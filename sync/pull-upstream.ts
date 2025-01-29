import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
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
      gitignoreUpstreamPath: config.sync.gitignoreUpstreamPath,
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

  private execGitCommand(command: string): string {
    try {
      this.log(`Executing: ${command}`);
      const output = execSync(command, { encoding: "utf8", stdio: "pipe" });
      this.log(`Command output: ${output}`);
      return output;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Git command failed: ${error.message}`);
        throw new Error(`Git command failed: ${error.message}`);
      }
      throw error;
    }
  }

  private getUncommittedChanges(): string[] {
    try {
      // Get both staged and unstaged changes
      const statusOutput = this.execGitCommand("git status --porcelain");
      return statusOutput
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.substring(3).trim()); // Remove status codes (first 2 chars + space)
    } catch (error) {
      console.error("Failed to check for uncommitted changes:", error);
      throw new Error("Failed to check for uncommitted changes");
    }
  }

  private checkConflictingChanges(proposedChanges: FileChange[]): string[] {
    const uncommittedFiles = this.getUncommittedChanges();
    const proposedPaths = proposedChanges.map((change) => change.path);

    // Find intersection between uncommitted files and files we want to modify
    return uncommittedFiles.filter((file) => proposedPaths.includes(file));
  }

  private getChangedFiles(): FileChange[] {
    const output = this.execGitCommand("git diff --name-status upstream/main");
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
          change.oldPath = paths[0];
          change.path = paths[1];
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
      return content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());
    } catch (error) {
      console.error(`Failed to read ignore patterns: ${error}`);
      throw error;
    }
  }

  private filterFiles(
    files: FileChange[],
    ignorePatterns: string[],
  ): FileChange[] {
    return files.filter(({ path }) => {
      for (const pattern of ignorePatterns) {
        const regexPattern = pattern
          .replace(/\./g, "\\.")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".");
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(path)) {
          this.log(`File ${path} matched ignore pattern ${pattern}`);
          return false;
        }
      }
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
      // Flip ADD/DEL from upstream perspective to downstream perspective
      const prefix = {
        A: "[DEL]", // If it exists in upstream but not here, we need to delete it locally
        M: "[MOD]",
        D: "[ADD]", // If it's deleted in upstream but exists here, we need to add it locally
        R: "[REN]",
      }[change.status];

      if (change.status === "R" && change.oldPath) {
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
      this.execGitCommand(`git checkout -b ${this.tempBranch} upstream/main`);

      // Get back to original branch
      this.execGitCommand(`git checkout ${currentBranch}`);

      // Apply changes based on their type
      for (const change of changes) {
        try {
          switch (change.status) {
            case "D": // Deleted in upstream = Add locally
              this.execGitCommand(
                `git checkout ${this.tempBranch} -- "${change.path}"`,
              );
              break;

            case "M": // Modified = copy from upstream
              this.execGitCommand(
                `git checkout ${this.tempBranch} -- "${change.path}"`,
              );
              break;

            case "A": // Added in upstream = Delete locally
              if (existsSync(change.path)) {
                this.execGitCommand(`git rm "${change.path}"`);
              }
              break;

            case "R": // Rename = handle both deletion and addition
              if (change.oldPath && existsSync(change.oldPath)) {
                this.execGitCommand(`git rm "${change.oldPath}"`);
              }
              this.execGitCommand(
                `git checkout ${this.tempBranch} -- "${change.path}"`,
              );
              break;
          }
        } catch (error) {
          console.error(`Failed to apply change for ${change.path}:`, error);
          throw error;
        }
      }
    } finally {
      // Clean up temp branch - attempt cleanup even if changes failed
      try {
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

      // Fetch upstream changes
      this.execGitCommand("git fetch upstream");

      // Store current state
      const { branch } = this.getCurrentState();

      // Get changed files
      const changes = this.getChangedFiles();
      this.log(`Found ${changes.length} changed files`);

      // Read and apply ignore patterns
      const ignorePatterns = this.readIgnorePatterns();
      const filteredChanges = this.filterFiles(changes, ignorePatterns);

      // Check for uncommitted changes that would conflict
      const conflictingFiles = this.checkConflictingChanges(filteredChanges);
      if (conflictingFiles.length > 0) {
        console.error(
          "\nError: You have uncommitted changes that would be overwritten by sync:",
        );
        conflictingFiles.forEach((file) => console.error(`  ${file}`));
        console.error(
          "\nPlease commit or stash these changes before running git sync-upstream",
        );
        process.exit(1);
      }

      // Get confirmation and proceed
      const proceed = await this.promptForConfirmation(filteredChanges);

      if (proceed) {
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
  process.argv[1]?.endsWith("pull-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  const puller = new UpstreamPuller();

  puller.pull().catch((error) => {
    console.error("Pull failed:", error);
    process.exit(1);
  });
}

export { UpstreamPuller, type PullOptions };
