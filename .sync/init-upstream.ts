import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";

interface InitOptions {
  upstreamUrl?: string;
  gitignoreUpstreamPath?: string;
  verbose?: boolean;
}

class UpstreamInitializer {
  private readonly options: Required<InitOptions>;
  private readonly tempFile: string;

  constructor(options: InitOptions = {}) {
    this.options = {
      upstreamUrl: config.upstream.url,
      gitignoreUpstreamPath: config.sync.allowedOverridesPath,
      verbose: config.sync.verbose,
      ...options,
    };
    const createId = init();
    this.tempFile = join(tmpdir(), `gitignore-upstream-${createId()}`);
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

  private copyGitignoreToTemp(): void {
    try {
      this.log(`Reading gitignore from: ${this.options.gitignoreUpstreamPath}`);
      const content = readFileSync(this.options.gitignoreUpstreamPath, "utf8");
      writeFileSync(this.tempFile, content, "utf8");
      this.log("Gitignore copied to temp location");
    } catch (error) {
      console.error(`Failed to copy gitignore: ${error}`);
      throw new Error(`Failed to copy gitignore: ${error}`);
    }
  }

  private setupUpstreamRemote(): void {
    this.log("1. Setting up upstream remote...", true);
    const remotes = this.execGitCommand("git remote");

    if (!remotes.includes("upstream")) {
      this.log(`Adding upstream remote: ${this.options.upstreamUrl}`);
      this.execGitCommand(
        `git remote add upstream ${this.options.upstreamUrl}`,
      );
    } else {
      this.log("Upstream remote already exists");
    }
  }

  private initializeSparseCheckout(): void {
    this.log("2. Initializing sparse-checkout...", true);
    this.execGitCommand("git sparse-checkout init --no-cone");
    this.log("Sparse-checkout initialized");
  }

  private configureSparseCheckoutPatterns(): void {
    this.log("3. Configuring inclusion patterns...", true);

    // Write the base include pattern
    const sparseCheckoutPath = ".git/info/sparse-checkout";
    this.log(`Writing base pattern to ${sparseCheckoutPath}`);
    writeFileSync(sparseCheckoutPath, "/*\n", "utf8");

    // Read and process ignore patterns
    const patterns = readFileSync(this.tempFile, "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .map((pattern) => `:(upstream)${pattern}`);

    this.log("Adding exclusion patterns:");
    patterns.forEach((pattern) => this.log(`  ${pattern}`));

    // Append patterns to sparse-checkout file
    writeFileSync(sparseCheckoutPath, patterns.join("\n"), { flag: "a" });
  }

  private async cleanup(): Promise<void> {
    try {
      // Remove temporary file using fs promises
      const fs = await import("fs/promises");
      await fs.unlink(this.tempFile);
      this.log("Cleanup completed");
    } catch (error) {
      this.log(`Warning: Cleanup failed: ${error}`);
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.log("Initializing upstream sync configuration...", true);

      // Get the directory where the script is located
      const scriptDir = dirname(fileURLToPath(import.meta.url));
      const repoRoot = join(scriptDir, "..");

      this.log(`Changing to repository root: ${repoRoot}`);
      process.chdir(repoRoot);

      this.copyGitignoreToTemp();
      this.setupUpstreamRemote();
      this.initializeSparseCheckout();
      this.configureSparseCheckoutPatterns();

      // Fetch and reapply
      this.log("Fetching upstream...");
      this.execGitCommand("git fetch upstream");

      this.log("Reapplying sparse-checkout...");
      this.execGitCommand("git sparse-checkout reapply");

      await this.cleanup();
      this.log(
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
