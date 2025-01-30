import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { GitUtils } from "./git-utils";

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
  private readonly git: GitUtils;
  private readonly options: Required<PullOptions>;
  private readonly tempBranch: string;

  constructor(options: PullOptions = {}) {
    this.options = {
      gitignoreUpstreamPath: config.sync.allowedOverridesPath,
      verbose: config.sync.verbose,
      ...options,
    };
    this.git = new GitUtils({ verbose: this.options.verbose });
    const createId = init();
    this.tempBranch = `temp-upstream-${createId()}`;
  }

  private checkWorkingDirectoryClean(): void {
    try {
      // Get complete status including untracked files
      const statusOutput = this.git.execCommand(
        "git status --porcelain -uall",
        { suppressOutput: true },
      );

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
    const output = this.git.execCommand(
      "git diff --name-status upstream/main",
      { suppressOutput: true },
    );
    this.git.log("Parsing changed files from git diff output");
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
          this.git.log(`Detected rename: ${change.oldPath} -> ${change.path}`);
        } else {
          this.git.log(`Detected ${status} change for: ${change.path}`);
        }

        return change;
      });
  }

  private readIgnorePatterns(): string[] {
    try {
      this.git.log(
        `Reading ignore patterns from: ${this.options.gitignoreUpstreamPath}`,
      );
      const content = readFileSync(this.options.gitignoreUpstreamPath, "utf8");
      const patterns = content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());
      this.git.log(`Found ${patterns.length} ignore patterns`);
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
    this.git.log("Filtering files based on ignore patterns");
    return files.filter(({ path }) => {
      for (const pattern of ignorePatterns) {
        const regexPattern = pattern
          .replace(/\./g, "\\.")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".")
          .replace(/\//g, "[/\\\\]");
        const regex = new RegExp(`^${regexPattern}($|[/\\\\])`);
        if (regex.test(path)) {
          this.git.log(`Excluding ${path} (matched pattern: ${pattern})`);
          return false;
        }
      }
      this.git.log(`Including ${path} (no matching ignore patterns)`);
      return true;
    });
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
      this.git.log("No files to update after applying filters", true);
      return false;
    }

    this.git.log("\nProposed changes:", true);
    this.formatChangesForDisplay(changes).forEach((line) =>
      this.git.log(line, true),
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

  private async applyChanges(changes: FileChange[]): Promise<void> {
    const originalBranch = this.git.getCurrentBranch();

    try {
      // Create temp branch from upstream/main
      this.git.log("Creating temporary branch from upstream/main");
      // Explicitly create branch from upstream/main
      this.git.execCommand(`git checkout -b ${this.tempBranch} upstream/main`);

      // Get back to original branch immediately
      this.git.log(`Returning to original branch: ${originalBranch}`);
      this.git.execCommand(`git checkout ${originalBranch}`);

      // Apply changes based on their type
      for (const change of changes) {
        try {
          switch (change.status) {
            case "D": {
              // Deleted in upstream = Add locally
              this.git.log(
                `Retrieving deleted file from upstream: ${change.path}`,
              );
              const addContent = this.git.execCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                { suppressOutput: true },
              );
              this.git.log(`Writing recovered file: ${change.path}`);
              writeFileSync(change.path, addContent, "utf8");
              break;
            }

            case "M": {
              // Modified = copy from upstream
              this.git.log(
                `Getting modified content from upstream: ${change.path}`,
              );
              const modContent = this.git.execCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                { suppressOutput: true },
              );
              this.git.log(`Writing updated content to: ${change.path}`);
              writeFileSync(change.path, modContent, "utf8");
              break;
            }

            case "A": {
              // Added in upstream = Delete locally
              if (existsSync(change.path)) {
                this.git.log(
                  `Deleting file that was added in upstream: ${change.path}`,
                );
                unlinkSync(change.path);
              } else {
                this.git.log(
                  `File already doesn't exist locally: ${change.path}`,
                );
              }
              break;
            }

            case "R": {
              const upstreamPath = change.path; // Where file exists in upstream now
              const localOldPath = change.oldPath; // Where file exists locally now

              if (!localOldPath) {
                throw new Error(
                  `Rename operation missing local path for: ${upstreamPath}`,
                );
              }

              // Delete the old file if it exists
              if (existsSync(localOldPath)) {
                this.git.log(`Deleting old local file: ${localOldPath}`);
                unlinkSync(localOldPath);
              }

              this.git.log(
                `Getting renamed file content from upstream: ${upstreamPath}`,
              );
              // For renames, we need to use the upstream path to get content
              const renameContent = this.git.execCommand(
                `git show upstream/main:"${upstreamPath}"`,
                { suppressOutput: true },
              );

              // Write to the new path to match upstream's structure
              this.git.log(`Writing to new local path: ${upstreamPath}`);
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
      // Cleanup phase - always try to get back to original branch and clean up
      try {
        // First ensure we're not on the temp branch
        const currentBranch = this.git.getCurrentBranch();
        if (currentBranch === this.tempBranch) {
          this.git.log("Ensuring we're back on the original branch");
          this.git.execCommand(`git checkout ${originalBranch}`);
        }

        // Now try to delete the temp branch
        this.git.log("Cleaning up temporary branch");
        // Force delete and ignore errors about worktree
        this.git.execCommand(`git branch -D ${this.tempBranch}`, {
          throwOnError: false,
        });

        // If the branch still exists due to worktree, try to remove the worktree first
        if (
          this.git
            .execCommand(`git branch --list ${this.tempBranch}`, {
              suppressOutput: true,
            })
            .trim()
        ) {
          this.git.log("Branch still exists, attempting to remove worktree");
          this.git.execCommand(`git worktree remove ${this.tempBranch}`, {
            throwOnError: false,
          });
          // Try branch deletion one more time
          this.git.execCommand(`git branch -D ${this.tempBranch}`, {
            throwOnError: false,
          });
        }
      } catch (error) {
        // Log cleanup errors but don't throw - we don't want cleanup failures to mask the original error
        this.git.log(`Warning: Cleanup encountered issues: ${error}`);
      }
    }
  }

  public async pull(): Promise<void> {
    try {
      this.git.log("Starting upstream sync process...");

      // Change to repository root
      this.git.changeToRepoRoot();

      // Check for clean working directory before proceeding
      this.git.log("Checking working directory status");
      this.checkWorkingDirectoryClean();

      // Fetch upstream changes
      this.git.log("Fetching latest changes from upstream");
      this.git.execCommand("git fetch upstream");

      // Get changed files
      const changes = this.getChangedFiles();
      this.git.log(`Found ${changes.length} changed files`);

      // Read and apply ignore patterns
      const ignorePatterns = this.readIgnorePatterns();
      this.git.log("Filtering changes based on ignore patterns");
      const filteredChanges = this.filterFiles(changes, ignorePatterns);
      this.git.log(`${filteredChanges.length} changes remain after filtering`);

      // Get confirmation and proceed
      const proceed = await this.promptForConfirmation(filteredChanges);

      if (proceed) {
        this.git.log("Beginning to apply changes");
        await this.applyChanges(filteredChanges);
        this.git.log(
          "✓ Sync complete: successfully synced core changes from upstream",
          true,
        );
      } else {
        this.git.log("Update cancelled", true);
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
