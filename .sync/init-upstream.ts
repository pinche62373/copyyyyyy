import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { defaultCIHelper } from "./utils/ci-helper";
import { GitUtils } from "./utils/git-utils";
import log from "./utils/logger";

interface InitOptions {
  upstreamUrl?: string;
  gitignoreUpstreamPath?: string;
}

class UpstreamInitializer {
  private readonly git: GitUtils;
  private readonly options: Required<InitOptions>;
  private readonly tempFile: string;

  constructor(options: InitOptions = {}) {
    this.options = {
      upstreamUrl: config.upstream.url,
      gitignoreUpstreamPath: config.sync.allowedOverridesPath,
      ...options,
    };

    this.git = new GitUtils({});
    const createId = init();
    this.tempFile = join(tmpdir(), `gitignore-upstream-${createId()}`);
  }

  public async initialize(): Promise<void> {
    try {
      log.info("Initializing upstream sync configuration...");

      // Initialize for CI
      if (defaultCIHelper.isGithubActions()) {
        await this.initializeForCI();

        return;
      }

      // Initialize for workstations
      this.git.changeToRepoRoot();

      // Check if we're in the upstream repo
      if (this.isUpstreamRepo()) {
        log.info(
          "ℹ Skipping initialization: sync must not be used in the upstream repository itself",
        );
        return;
      }

      this.copyAllowedOverridesToTemp();
      this.setupUpstreamRemote();
      this.initializeSparseCheckout();
      this.configureSparseCheckoutPatterns();

      // Fetch and reapply
      log.info("Fetching upstream...");
      this.git.execCommand("git fetch upstream");

      log.info("Reapplying sparse-checkout...");
      this.git.execCommand("git sparse-checkout reapply");

      await this.cleanup();
      log.info(
        "✓ Initialization complete - Repository is now in sparse-checkout mode",
        true,
      );
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  private async initializeForCI(): Promise<void> {
    try {
      log.info("Initializing for CI environment...", true);

      const { mainRepoPath, upstreamRepoPath } = defaultCIHelper.getRepoPaths();

      // Verify repository paths exist
      await defaultCIHelper.verifyRepoPaths();

      // Store paths in config for other tools to use
      config.sync.ci.mainRepoPath = mainRepoPath;
      config.sync.ci.upstreamRepoPath = upstreamRepoPath;

      log.info("CI initialization complete - Using side-by-side repositories:");
      log.info(`  Main repo: ${mainRepoPath}`, true);
      log.info(`  Upstream repo: ${upstreamRepoPath}`, true);
    } catch (error) {
      throw new Error(`CI initialization failed: ${error.message}`);
    }
  }

  /**
   * Copy .allowed-upstream-overrides file to temp folder because we will not be
   * able to it in the working directory once we switch to sparse-checkout mode.
   */
  private copyAllowedOverridesToTemp(): void {
    try {
      // First change to repository root
      this.git.changeToRepoRoot();

      // Now that we're in the repo root, resolve the full path to the allowed overrides file
      const allowedOverridesPath = resolve(
        process.cwd(),
        this.options.gitignoreUpstreamPath,
      );

      log.info(`Reading allowed overrides from: ${allowedOverridesPath}`);

      try {
        const content = readFileSync(allowedOverridesPath, "utf8");
        log.info("Successfully read allowed overrides file");

        writeFileSync(this.tempFile, content, "utf8");
        log.info(`Copied to temp location: ${this.tempFile}`);
      } catch (readError) {
        throw new Error(
          `Failed to read allowed overrides file at ${allowedOverridesPath}. ` +
            `Make sure the file exists in the .sync directory. Error: ${readError.message}`,
        );
      }
    } catch (error) {
      log.error(`Failed to copy allowed overrides: ${error}`);
      throw error;
    }
  }

  private isUpstreamRepo(): boolean {
    try {
      // Get the remote URL of origin
      const originUrl = this.git.getRemoteUrl("origin");

      // Extract org/repo from origin URL
      const match = originUrl.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (!match) {
        return false;
      }

      const [, org, repo] = match;

      // Compare with configured upstream
      return (
        org === config.upstream.organization &&
        repo === config.upstream.repository
      );
    } catch (error) {
      log.error(
        "Warning: Could not determine if this is upstream repo:",
        error,
      );

      return false;
    }
  }

  private async setupUpstreamRemote(): Promise<void> {
    log.info("1. Setting up upstream remote...", true);
    const hasUpstream = this.git.hasRemote("upstream");

    let upstreamUrl = this.options.upstreamUrl;

    if (!hasUpstream) {
      log.info("Adding upstream remote...");
      // Using execCommand with suppressOutput to prevent token exposure in logs
      this.git.execCommand(`git remote add upstream ${upstreamUrl}`, {
        suppressOutput: true,
      });
    } else {
      log.info("Upstream remote already exists");
      // Update the URL in case token needs to be added
      if (defaultCIHelper.isGithubActions()) {
        this.git.execCommand(`git remote set-url upstream ${upstreamUrl}`, {
          suppressOutput: true,
        });
        log.info("Updated upstream remote URL for CI environment");
      }
    }
  }

  private initializeSparseCheckout(): void {
    log.info("2. Initializing sparse-checkout...", true);
    this.git.execCommand("git sparse-checkout init --no-cone");
    log.info("Sparse-checkout initialized");
  }

  private configureSparseCheckoutPatterns(): void {
    log.info("3. Configuring inclusion patterns...", true);

    // Write the base include pattern
    const sparseCheckoutPath = ".git/info/sparse-checkout";
    log.debug(`Writing base pattern to ${sparseCheckoutPath}`);
    writeFileSync(sparseCheckoutPath, "/*\n", "utf8");

    // Read and process ignore patterns
    const patterns = readFileSync(this.tempFile, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((pattern) => `:(upstream)${pattern}`);

    log.info("Adding exclusion patterns:");
    patterns.forEach((pattern) => log.debug(`  ${pattern}`));

    // Append patterns to sparse-checkout file
    writeFileSync(sparseCheckoutPath, patterns.join("\n"), { flag: "a" });
  }

  private async cleanup(): Promise<void> {
    try {
      const fs = await import("fs/promises");
      await fs.unlink(this.tempFile);
      log.info("Cleanup completed");
    } catch (error) {
      log.error("Warning: Cleanup failed", error);
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("init-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  log.debug("Running script directly...");
  const initializer = new UpstreamInitializer();

  initializer.initialize().catch((error) => {
    log.error("Initialization failed:", error);
    process.exit(1);
  });
} else {
  log.debug("Script loaded as module");
}

export { UpstreamInitializer, type InitOptions };
