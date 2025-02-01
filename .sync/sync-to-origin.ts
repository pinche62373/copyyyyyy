import { config } from "./.config";
import { GitUtils } from "./utils/git-utils";
import log from "./utils/logger";

interface SyncOptions {}

class OriginSyncer {
  private readonly git: GitUtils;
  private readonly options: Required<SyncOptions>;

  constructor(options: SyncOptions = {}) {
    this.options = {
      ...options,
    };
    this.git = new GitUtils({});
  }

  private getUpstreamCommitHash(): string {
    try {
      const hash = this.git
        .execCommand("git rev-parse upstream/main", { suppressOutput: true })
        .trim();
      return hash.substring(0, 10); // Get first 10 characters of the commit hash
    } catch (error) {
      log.error("Failed to get upstream commit hash:", error);
      throw error;
    }
  }

  private generateCommitMessage(): string {
    const upstreamHash = this.getUpstreamCommitHash();
    const { organization, repository } = config.upstream;
    return `chore: sync with upstream https://github.com/${organization}/${repository}/tree/${upstreamHash}`;
  }

  private hasChangesToCommit(): boolean {
    const status = this.git.execCommand("git status --porcelain", {
      suppressOutput: true,
    });
    return status.length > 0;
  }

  public sync(): void {
    try {
      // Change to repository root
      this.git.changeToRepoRoot();

      // Check if there are changes to commit
      if (!this.hasChangesToCommit()) {
        log.info("✓ No changes to sync with origin");
        return;
      }

      // Stage all changes
      log.info("Staging changes...", true);
      this.git.execCommand("git add .");

      // Create commit with formatted message
      const commitMessage = this.generateCommitMessage();
      log.info("Creating commit...");

      log.debug(`Commit message: ${commitMessage}`, true);

      // Set environment variable to bypass protection check for this commit
      process.env.UPSTREAM_SYNC_OPERATION = "true";
      this.git.execCommand(`git commit -m "${commitMessage}"`);
      process.env.UPSTREAM_SYNC_OPERATION = "false";

      // Push to origin
      log.info("Pushing to origin...", true);
      this.git.execCommand("git push origin");

      log.info("Sync complete: successfully synced core changes to origin ✓");
    } catch (error) {
      log.error("Sync failed:", error);
      throw error;
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("sync-to-origin.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  log.debug("Running origin sync...");
  const syncer = new OriginSyncer();
  try {
    syncer.sync();
  } catch (error) {
    log.error("Origin sync failed:", error);
    process.exit(1);
  }
} else {
  log.debug("Script loaded as module");
}

export { OriginSyncer, type SyncOptions };
