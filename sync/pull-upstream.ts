import { execSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

interface PullOptions {
  gitignoreUpstreamPath?: string;
  verbose?: boolean;
}

class UpstreamPuller {
  private readonly options: Required<PullOptions>;

  constructor(options: PullOptions = {}) {
    this.options = {
      gitignoreUpstreamPath: "./sync/.gitignore-upstream",
      verbose: false,
      ...options,
    };
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

  private getCurrentState(): { branch: string; sha: string } {
    const branch = this.execGitCommand("git branch --show-current").trim();
    const sha = this.execGitCommand("git rev-parse HEAD").trim();
    return { branch, sha };
  }

  private getChangedFiles(): string[] {
    const output = this.execGitCommand("git diff --name-status upstream/main");
    return output
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.split("\t")[1])
      .filter((file): file is string => file !== undefined);
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

  private filterFiles(files: string[], ignorePatterns: string[]): string[] {
    return files.filter((file) => {
      for (const pattern of ignorePatterns) {
        const regexPattern = pattern
          .replace(/\./g, "\\.")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".");
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(file)) {
          this.log(`File ${file} matched ignore pattern ${pattern}`);
          return false;
        }
      }
      return true;
    });
  }

  private async promptForConfirmation(files: string[]): Promise<boolean> {
    if (files.length === 0) {
      this.log("No files to update after applying filters", true);
      return false;
    }

    this.log("\nFiles that will be updated:", true);
    files.forEach((file) => this.log(file, true));
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

  private async updateFiles(
    files: string[],
    currentBranch: string,
  ): Promise<void> {
    // Create temp branch from upstream
    this.execGitCommand("git checkout -b temp-upstream upstream/main");

    // Get back to original branch
    this.execGitCommand(`git checkout ${currentBranch}`);

    // Copy selected files from temp branch
    for (const file of files) {
      this.execGitCommand(`git checkout temp-upstream -- "${file}"`);
    }

    // Clean up
    this.execGitCommand("git branch -D temp-upstream");
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
      const { branch, sha } = this.getCurrentState();
      this.log(`Current branch: ${branch}, SHA: ${sha}`);

      // Get changed files
      const changedFiles = this.getChangedFiles();
      this.log(`Found ${changedFiles.length} changed files`);

      // Read and apply ignore patterns
      const ignorePatterns = this.readIgnorePatterns();
      const filteredFiles = this.filterFiles(changedFiles, ignorePatterns);

      // Get confirmation and proceed
      const proceed = await this.promptForConfirmation(filteredFiles);

      if (proceed) {
        await this.updateFiles(filteredFiles, branch);
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

// Debug information and script execution
console.log("Script starting...");
console.log("import.meta.url:", import.meta.url);
console.log("process.argv[1]:", process.argv[1]);

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("pull-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  console.log("Running script directly...");
  const puller = new UpstreamPuller({ verbose: false });

  puller.pull().catch((error) => {
    console.error("Pull failed:", error);
    process.exit(1);
  });
} else {
  console.log("Script loaded as module");
}

export { UpstreamPuller, type PullOptions };
