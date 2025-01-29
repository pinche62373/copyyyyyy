import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { GitUtils } from "./git-utils";

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

  private copyGitignoreToTemp(): void {
    try {
      this.git.log(
        `Reading gitignore from: ${this.options.gitignoreUpstreamPath}`,
      );
      const content = readFileSync(this.options.gitignoreUpstreamPath, "utf8");
      writeFileSync(this.tempFile, content, "utf8");
      this.git.log("Gitignore copied to temp location");
    } catch (error) {
      console.error(`Failed to copy gitignore: ${error}`);
      throw new Error(`Failed to copy gitignore: ${error}`);
    }
  }

  private setupUpstreamRemote(): void {
    this.git.log("1. Setting up upstream remote...", true);
    const hasUpstream = this.git.hasRemote("upstream");

    if (!hasUpstream) {
      this.git.log(`Adding upstream remote: ${this.options.upstreamUrl}`);
      this.git.execCommand(
        `git remote add upstream ${this.options.upstreamUrl}`,
      );
    } else {
      this.git.log("Upstream remote already exists");
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
      // Remove temporary file using fs promises
      const fs = await import("fs/promises");
      await fs.unlink(this.tempFile);
      this.git.log("Cleanup completed");
    } catch (error) {
      this.git.log(`Warning: Cleanup failed: ${error}`);
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.git.log("Initializing upstream sync configuration...", true);

      // Change to repository root using GitUtils
      this.git.changeToRepoRoot();

      this.copyGitignoreToTemp();
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
