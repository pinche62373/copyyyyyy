import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname } from "path";
import { createInterface } from "readline";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { GitUtils } from "./utils/git-utils";

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
      const statusOutput = this.git.execCommand(
        "git status --porcelain -uall",
        { suppressOutput: true },
      );

      if (statusOutput.trim()) {
        console.error(
          "\nError: sync-from-upstream requires a clean working directory but found:",
        );

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

        if (status.startsWith("R")) {
          change.path = paths[0];
          change.oldPath = paths[1];
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
        A: "[DEL]",
        M: "[MOD]",
        D: "[ADD]",
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

  private ensureDirectoryExists(filePath: string): void {
    const directory = dirname(filePath);
    if (!existsSync(directory)) {
      this.git.log(`Creating directory: ${directory}`);
      mkdirSync(directory, { recursive: true });
    }
  }

  private async applyChanges(changes: FileChange[]): Promise<void> {
    const originalBranch = this.git.getCurrentBranch();

    try {
      this.git.log("Creating temporary branch from upstream/main");
      this.git.execCommand(`git checkout -b ${this.tempBranch} upstream/main`);

      this.git.log(`Returning to original branch: ${originalBranch}`);
      this.git.execCommand(`git checkout ${originalBranch}`);

      for (const change of changes) {
        try {
          this.git.log(`\n⚡ Processing: ${change.path}`, true);

          switch (change.status) {
            case "D": {
              this.git.log(
                `Retrieving deleted file from upstream: ${change.path}`,
              );
              const addContent = this.git.execCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                { suppressOutput: true },
              );
              this.ensureDirectoryExists(change.path);
              this.git.log(`Writing recovered file: ${change.path}`);
              writeFileSync(change.path, addContent, "utf8");
              this.git.log(`Successfully restored ${change.path}`, true);
              break;
            }

            case "M": {
              this.git.log(
                `Getting modified content from upstream: ${change.path}`,
              );
              const modContent = this.git.execCommand(
                `git show ${this.tempBranch}:"${change.path}"`,
                { suppressOutput: true },
              );
              this.ensureDirectoryExists(change.path);
              this.git.log(`Writing updated content to ${change.path}`);
              writeFileSync(change.path, modContent, "utf8");
              this.git.log(`Successfully updated ${change.path}`, true);
              break;
            }

            case "A": {
              if (existsSync(change.path)) {
                this.git.log(
                  `Deleting file that was added in upstream: ${change.path}`,
                );
                unlinkSync(change.path);
                this.git.log(`Successfully deleted ${change.path}`, true);
              } else {
                this.git.log(
                  // TODO: fix this type
                  `ℹ️ File already doesn't exist locally: ${change.path}`,
                  true,
                );
              }
              break;
            }

            case "R": {
              const upstreamPath = change.path;
              const localOldPath = change.oldPath;

              if (!localOldPath) {
                throw new Error(
                  `Rename operation missing local path for: ${upstreamPath}`,
                );
              }

              if (existsSync(localOldPath)) {
                this.git.log(`Deleting old local file ${localOldPath}`);
                unlinkSync(localOldPath);
                this.git.log(
                  `Successfully deleted old local file ${localOldPath}`,
                  true,
                );
              }

              this.git.log(
                `Getting renamed file content from upstream: ${upstreamPath}`,
              );

              const renameContent = this.git.execCommand(
                `git show upstream/main:"${upstreamPath}"`,
                { suppressOutput: true },
              );

              this.ensureDirectoryExists(upstreamPath);

              this.git.log(`Writing to new local path: ${upstreamPath}`);
              writeFileSync(upstreamPath, renameContent, "utf8");
              this.git.log(`Successfully moved to ${upstreamPath}`, true);
              break;
            }
          }
        } catch (error) {
          console.error(`\n❌ Failed to process ${change.path}:`, error);
          throw error;
        }
      }
    } finally {
      try {
        const currentBranch = this.git.getCurrentBranch();
        if (currentBranch === this.tempBranch) {
          this.git.log("Ensuring we're back on the original branch");
          this.git.execCommand(`git checkout ${originalBranch}`);
        }

        this.git.log("Cleaning up temporary branch");
        this.git.execCommand(`git branch -D ${this.tempBranch}`, {
          throwOnError: false,
        });

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
          this.git.execCommand(`git branch -D ${this.tempBranch}`, {
            throwOnError: false,
          });
        }
      } catch (error) {
        this.git.log(`⚠️ Warning: Cleanup encountered issues: ${error}`);
      }
    }
  }

  public async pull(): Promise<void> {
    try {
      this.git.log("Starting upstream sync process...");

      this.git.changeToRepoRoot();

      this.git.log("Checking working directory status");
      this.checkWorkingDirectoryClean();

      this.git.log("Fetching latest changes from upstream");
      this.git.execCommand("git fetch upstream");

      const changes = this.getChangedFiles();
      this.git.log(`Found ${changes.length} changed files`);

      const ignorePatterns = this.readIgnorePatterns();
      this.git.log("Filtering changes based on ignore patterns");
      const filteredChanges = this.filterFiles(changes, ignorePatterns);
      this.git.log(`${filteredChanges.length} changes remain after filtering`);

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
