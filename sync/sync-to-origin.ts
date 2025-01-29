import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./.config";

interface SyncOptions {
  verbose?: boolean;
}

class OriginSyncer {
  private readonly options: Required<SyncOptions>;

  constructor(options: SyncOptions = {}) {
    this.options = {
      verbose: config.sync.verbose,
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

  private getUpstreamCommitHash(): string {
    try {
      const hash = this.execGitCommand("git rev-parse upstream/main").trim();
      return hash.substring(0, 10); // Get first 10 characters of the commit hash
    } catch (error) {
      console.error("Failed to get upstream commit hash:", error);
      throw error;
    }
  }

  private generateCommitMessage(): string {
    const upstreamHash = this.getUpstreamCommitHash();
    const { organization, repository } = config.upstream;
    return `chore: synced with upstream https://github.com/${organization}/${repository}/tree/${upstreamHash}`;
  }

  private hasChangesToCommit(): boolean {
    const status = this.execGitCommand("git status --porcelain");
    return status.length > 0;
  }

  public sync(): void {
    try {
      // Change to repository root
      const scriptDir = dirname(fileURLToPath(import.meta.url));
      const repoRoot = join(scriptDir, "..");
      this.log(`Changing to repository root: ${repoRoot}`);
      process.chdir(repoRoot);

      // Check if there are changes to commit
      if (!this.hasChangesToCommit()) {
        this.log("✓ No changes to sync with origin", true);
        return;
      }

      // Stage all changes
      this.log("Staging changes...", true);
      this.execGitCommand("git add .");

      // Create commit with formatted message
      const commitMessage = this.generateCommitMessage();
      this.log(`Creating commit: ${commitMessage}`, true);

      // Set environment variable to bypass protection check for this commit
      process.env.UPSTREAM_SYNC_OPERATION = "true";
      this.execGitCommand(`git commit -m "${commitMessage}"`);
      process.env.UPSTREAM_SYNC_OPERATION = "false";

      // Push to origin
      this.log("Pushing to origin...", true);
      this.execGitCommand("git push origin");

      this.log("✓ Successfully synced changes with origin", true);
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("sync-to-origin.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  console.log("Running origin sync...");
  const syncer = new OriginSyncer();
  try {
    syncer.sync();
  } catch (error) {
    console.error("Origin sync failed:", error);
    process.exit(1);
  }
} else {
  console.log("Script loaded as module");
}

export { OriginSyncer, type SyncOptions };
