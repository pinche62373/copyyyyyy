import { execSync } from "child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";

interface PullOptions {
  gitignoreUpstreamPath?: string;
  verbose?: boolean;
}

interface FileChange {
  status: "A" | "M" | "D" | "R";
  path: string;
  oldPath?: string;
}

class UpstreamPuller {
  private readonly options: Required<PullOptions>;
  private readonly tempBranch: string;

  constructor(options: PullOptions = {}) {
    this.options = {
      gitignoreUpstreamPath: config.sync.allowedOverridesPath,
      verbose: config.sync.verbose,
      ...options,
    };
    const createId = init();
    this.tempBranch = `temp-upstream-${createId()}`;
  }

  private log(message: string, isMainStep: boolean = false): void {
    if (isMainStep || this.options.verbose) {
      console.log(message);
    }
  }

  private execGitCommand(
    command: string,
    suppressOutput: boolean = false,
  ): string {
    try {
      this.log(`Executing: ${command}`);
      const output = execSync(command, { encoding: "utf8", stdio: "pipe" });
      if (!suppressOutput) {
        this.log(`Command output: ${output}`);
      }
      return output;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Git command failed: ${error.message}`);
        throw new Error(`Git command failed: ${error.message}`);
      }
      throw error;
    }
  }

  private checkWorkingDirectoryClean(): void {
    try {
      // Get complete status including untracked files
      const statusOutput = this.execGitCommand("git status --porcelain -uall");

      // If there's any output, the directory isn't clean
      if (statusOutput.trim()) {
        console.error(
          "\nError: sync-from-upstream requires a clean working directory but found:",
        );

        // Parse and display all changes in a structured way
        statusOutput
          .split("\n")
          .filter((line) => line.trim())
          .forEach((line) => {
            const status = line.substring(0, 2);
            const file = line.substring(3);

            let description = "";
            switch (status.trim()) {
              case "M":
                description = "modified:";
                break;
              case "A":
                description = "added:";
                break;
              case "D":
                description = "deleted:";
                break;
              case "R":
                description = "renamed:";
                break;
              case "??":
                description = "untracked:";
                break;
              default:
                description = "changed:";
                break;
            }
            console.error(`  ${description.padEnd(12)} ${file}`);
          });

        console.error(
          "\nPlease commit or stash these changes before running git sync-from-upstream",
        );
        process.exit(1);
      }
    } catch (error) {
      console.error("Failed to check working directory status:", error);
      throw new Error("Failed to check working directory status");
    }
  }

  private getChangedFiles(): FileChange[] {
    const output = this.execGitCommand("git diff --name-status upstream/main");
    this.log("Parsing changed files from git diff output");
    return output
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [status, ...paths] = line.split("\t");
        const change: FileChange = {
          status: status.charAt(0) as FileChange["status"],
          path: paths[paths.length - 1],
        };

        // Handle renamed files (R100 old-name new-name)
        if (status.startsWith("R")) {
          // paths[0] is where file exists in upstream NOW (start-me.sh)
          // paths[1] is where file WAS in upstream, matching our local (start.sh)
          change.path = paths[0]; // New upstream path (where we need to get content from)
          change.oldPath = paths[1]; // Current local path (where we need to write to)
          this.log(`Detected rename: ${change.oldPath} -> ${change.path}`);
        } else {
          this.log(`Detected ${status} change for: ${change.path}`);
        }

        return change;
      });
  }

  private readIgnorePatterns(): string[] {
    try {
      this.log(
        `Reading ignore patterns from: ${this.options.gitignoreUpstreamPath}`,
      );
      const content = readFileSync(this.options.gitignoreUpstreamPath, "utf8");
      const patterns = content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());
      this.log(`Found ${patterns.length} ignore patterns`);
      return patterns;
    } catch (error) {
      console.error(`Failed to read ignore patterns: ${error}`);
      throw error;
    }
  }

  private filterFiles(
    files: FileChange[],
    ignorePatterns: string[],
  ): FileChange[] {
    this.log("Filtering files based on ignore patterns");
    return files.filter(({ path }) => {
      for (const pattern of ignorePatterns) {
        const regexPattern = pattern
          .replace(/\./g, "\\.")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".");
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(path)) {
          this.log(`Excluding ${path} (matched pattern: ${pattern})`);
          return false;
        }
      }
      this.log(`Including ${path} (no matching ignore patterns)`);
      return true;
    });
  }

  private getCurrentState(): { branch: string; sha: string } {
    const branch = this.execGitCommand("git branch --show-current").trim();
    const sha = this.execGitCommand("git rev-parse HEAD").trim();
    return { branch, sha };
  }

  private formatChangesForDisplay(changes: FileChange[]): string[] {
    return changes.map((change) => {
      const prefix = {
        A: "[DEL]", // If it exists in upstream but not here, we need to delete it locally
        M: "[MOD]",
        D: "[ADD]", // If it's deleted in upstream but exists here, we need to add it locally
        R: "[REN]",
      }[change.status];

      if (change.status === "R" && change.oldPath) {
        // Display format: local -> upstream
        // oldPath is where it was (our local state)
        // path is where it is in upstream now
        return `${prefix} ${change.oldPath} -> ${change.path}`;
      }
      return `${prefix} ${change.path}`;
    });
  }

  private async promptForConfirmation(changes: FileChange[]): Promise<boolean> {
    if (changes.length === 0) {
      this.log("No files to update after applying filters", true);
      return false;
    }

    this.log("\nProposed changes:", true);
    this.formatChangesForDisplay(changes).forEach((line) =>
      this.log(line, true),
    );
    console.log();

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const answer = await new Promise<string>((resolve) => {
        rl.question("Proceed with update? (y/n) ", resolve);
      });
      return answer.toLowerCase() === "y";
    } finally {
      rl.close();
    }
  }

  private async applyChanges(
    changes: FileChange[],
    currentBranch: string,
  ): Promise<void> {
    try {
      // Create temp branch from upstream
      this.log("Creating temporary branch from upstream/main");
      this.execGitCommand(`git checkout -b ${this.tempBranch} upstream/main`);

      // Get back to original branch
      this.log(`Returning to original branch: ${currentBranch}`);
      this.execGitCommand(`git checkout ${currentBranch}`);

      // Apply changes based on their type
      for (const change of changes) {
        try {
          switch (change.status) {
            case "D": {
              // Deleted in upstream = Add locally
              this.log(`Retrieving deleted file from upstream: ${change.path}`);
              const addContent = this.execGitCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                true, // suppress output logging because we do not want to show full file content, too verbose
              );
              this.log(`Writing recovered file: ${change.path}`);
              writeFileSync(change.path, addContent, "utf8");
              break;
            }

            case "M": {
              // Modified = copy from upstream
              this.log(
                `Getting modified content from upstream: ${change.path}`,
              );
              const modContent = this.execGitCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                true, // suppress output logging
              );
              this.log(`Writing updated content to: ${change.path}`);
              writeFileSync(change.path, modContent, "utf8");
              break;
            }

            case "A": {
              // Added in upstream = Delete locally
              if (existsSync(change.path)) {
                this.log(
                  `Deleting file that was added in upstream: ${change.path}`,
                );
                unlinkSync(change.path);
              } else {
                this.log(`File already doesn't exist locally: ${change.path}`);
              }
              break;
            }

            case "R": {
              const upstreamPath = change.path; // Where file exists in upstream now (orignal-renamed.sh)
              const localOldPath = change.oldPath; // Where file exists locally now (original.sh)

              if (!localOldPath) {
                throw new Error(
                  `Rename operation missing local path for: ${upstreamPath}`,
                );
              }

              // Delete the old file if it exists
              if (existsSync(localOldPath)) {
                this.log(`Deleting old local file: ${localOldPath}`);
                unlinkSync(localOldPath);
              }

              this.log(
                `Getting renamed file content from upstream: ${upstreamPath}`,
              );
              const renameContent = this.execGitCommand(
                `git show ${this.tempBranch}:"${upstreamPath}"`,
                true, // suppress output logging
              );

              // Write to the new path (upstreamPath) to match upstream's structure
              this.log(`Writing to new local path: ${upstreamPath}`);
              writeFileSync(upstreamPath, renameContent, "utf8");
              break;
            }
          }
        } catch (error) {
          console.error(`Failed to apply change for ${change.path}:`, error);
          throw error;
        }
      }
    } finally {
      // Clean up temp branch - attempt cleanup even if changes failed
      try {
        this.log("Cleaning up temporary branch");
        this.execGitCommand(`git branch -D ${this.tempBranch}`);
      } catch (error) {
        this.log(`Warning: Failed to clean up temporary branch: ${error}`);
      }
    }
  }

  public async pull(): Promise<void> {
    try {
      this.log("Starting upstream sync process...");

      // Change to repository root
      const scriptDir = dirname(fileURLToPath(import.meta.url));
      const repoRoot = join(scriptDir, "..");
      this.log(`Changing to repository root: ${repoRoot}`);
      process.chdir(repoRoot);

      // Check for clean working directory before proceeding
      this.log("Checking working directory status");
      this.checkWorkingDirectoryClean();

      // Fetch upstream changes
      this.log("Fetching latest changes from upstream");
      this.execGitCommand("git fetch upstream");

      // Store current state
      const { branch } = this.getCurrentState();
      this.log(`Current branch: ${branch}`);

      // Get changed files
      const changes = this.getChangedFiles();
      this.log(`Found ${changes.length} changed files`);

      // Read and apply ignore patterns
      const ignorePatterns = this.readIgnorePatterns();
      this.log("Filtering changes based on ignore patterns");
      const filteredChanges = this.filterFiles(changes, ignorePatterns);
      this.log(`${filteredChanges.length} changes remain after filtering`);

      // Get confirmation and proceed
      const proceed = await this.promptForConfirmation(filteredChanges);

      if (proceed) {
        this.log("Beginning to apply changes");
        await this.applyChanges(filteredChanges, branch);
        this.log("✓ Sync complete", true);
      } else {
        this.log("Update cancelled", true);
        process.exit(1);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("sync-from-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  const puller = new UpstreamPuller();

  puller.pull().catch((error) => {
    console.error("Pull failed:", error);
    process.exit(1);
  });
}

export { UpstreamPuller, type PullOptions };
