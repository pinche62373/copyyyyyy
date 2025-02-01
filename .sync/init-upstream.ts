import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { defaultCIUtils } from "./utils/ci-utils";
import { GitUtils } from "./utils/git-utils";

interface InitOptions {
  upstreamUrl?: string;
  gitignoreUpstreamPath?: string;
  verbose?: boolean;
}

class UpstreamInitializer {
  private readonly git: GitUtils;
  private readonly options: Required<InitOptions>;
  private readonly tempFile: string;

  constructor(options: InitOptions = {}) {
    this.options = {
      upstreamUrl: config.upstream.url,
      gitignoreUpstreamPath: config.sync.allowedOverridesPath,
      verbose: config.sync.verbose,
      ...options,
    };

    this.git = new GitUtils({ verbose: this.options.verbose });
    const createId = init();
    this.tempFile = join(tmpdir(), `gitignore-upstream-${createId()}`);
  }

  public async initialize(): Promise<void> {
    try {
      this.git.log("Initializing upstream sync configuration...", true);

      defaultCIUtils.requireToken();
      this.git.changeToRepoRoot();

      // Check if we're in the upstream repo
      if (this.isUpstreamRepo()) {
        this.git.log(
          "ℹ Skipping initialization: sync must not be used in the upstream repository itself",
          true,
        );
        return;
      }

      this.copyAllowedOverridesToTemp();
      this.setupUpstreamRemote();
      this.initializeSparseCheckout();
      this.configureSparseCheckoutPatterns();

      // Fetch and reapply
      this.git.log("Fetching upstream...");
      this.git.execCommand("git fetch upstream");

      this.git.log("Reapplying sparse-checkout...");
      this.git.execCommand("git sparse-checkout reapply");

      await this.cleanup();
      this.git.log(
        "✓ Initialization complete - Repository is now in sparse-checkout mode",
        true,
      );
    } catch (error) {
      await this.cleanup();
      throw error;
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

      this.git.log(`Reading allowed overrides from: ${allowedOverridesPath}`);

      try {
        const content = readFileSync(allowedOverridesPath, "utf8");
        this.git.log("Successfully read allowed overrides file");

        writeFileSync(this.tempFile, content, "utf8");
        this.git.log(`Copied to temp location: ${this.tempFile}`);
      } catch (readError) {
        throw new Error(
          `Failed to read allowed overrides file at ${allowedOverridesPath}. ` +
            `Make sure the file exists in the .sync directory. Error: ${readError.message}`,
        );
      }
    } catch (error) {
      console.error(`Failed to copy allowed overrides: ${error}`);
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
      this.git.log(
        `Warning: Could not determine if this is upstream repo: ${error}`,
      );
      return false;
    }
  }

  private async setupUpstreamRemote(): Promise<void> {
    this.git.log("1. Setting up upstream remote...", true);
    const hasUpstream = this.git.hasRemote("upstream");

    // Detect CI environment and modify URL if needed
    const ciEnv = defaultCIUtils.getEnv();
    let upstreamUrl = this.options.upstreamUrl;

    // Normalize URL for CI environments
    if (ciEnv.isCI && ciEnv.accessToken) {
      upstreamUrl = this.git.normalizeGitUrl(upstreamUrl, ciEnv.accessToken);
    }

    if (!hasUpstream) {
      this.git.log("Adding upstream remote...");
      // Using execCommand with suppressOutput to prevent token exposure in logs
      this.git.execCommand(`git remote add upstream ${upstreamUrl}`, {
        suppressOutput: true,
      });
    } else {
      this.git.log("Upstream remote already exists");
      // Update the URL in case token needs to be added
      if (ciEnv.isCI && ciEnv.accessToken) {
        this.git.execCommand(`git remote set-url upstream ${upstreamUrl}`, {
          suppressOutput: true,
        });
        this.git.log("Updated upstream remote URL for CI environment");
      }
    }
  }

  private initializeSparseCheckout(): void {
    this.git.log("2. Initializing sparse-checkout...", true);
    this.git.execCommand("git sparse-checkout init --no-cone");
    this.git.log("Sparse-checkout initialized");
  }

  private configureSparseCheckoutPatterns(): void {
    this.git.log("3. Configuring inclusion patterns...", true);

    // Write the base include pattern
    const sparseCheckoutPath = ".git/info/sparse-checkout";
    this.git.log(`Writing base pattern to ${sparseCheckoutPath}`);
    writeFileSync(sparseCheckoutPath, "/*\n", "utf8");

    // Read and process ignore patterns
    const patterns = readFileSync(this.tempFile, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((pattern) => `:(upstream)${pattern}`);

    this.git.log("Adding exclusion patterns:");
    patterns.forEach((pattern) => this.git.log(`  ${pattern}`));

    // Append patterns to sparse-checkout file
    writeFileSync(sparseCheckoutPath, patterns.join("\n"), { flag: "a" });
  }

  private async cleanup(): Promise<void> {
    try {
      const fs = await import("fs/promises");
      await fs.unlink(this.tempFile);
      this.git.log("Cleanup completed");
    } catch (error) {
      this.git.log(`Warning: Cleanup failed: ${error}`);
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("init-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  console.log("Running script directly...");
  const initializer = new UpstreamInitializer();

  initializer.initialize().catch((error) => {
    console.error("Initialization failed:", error);
    process.exit(1);
  });
} else {
  console.log("Script loaded as module");
}

export { UpstreamInitializer, type InitOptions };
