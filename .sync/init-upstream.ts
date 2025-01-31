import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { init } from "@paralleldrive/cuid2";
import { config } from "./.config";
import { detectCI } from "./utils/detect-ci";
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
      verbose: true,
      ...options,
    };

    this.git = new GitUtils({ verbose: true }); // Force verbose mode
    const createId = init();
    this.tempFile = join(tmpdir(), `gitignore-upstream-${createId()}`);
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

  private copyGitignoreToTemp(): void {
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

  private setupUpstreamRemote(): void {
    this.git.log("1. Setting up upstream remote...", true);
    const hasUpstream = this.git.hasRemote("upstream");

    // Debug: Log CI environment details
    const ciEnv = detectCI();
    console.log("CI Environment Details:", {
      isCI: ciEnv.isCI,
      name: ciEnv.name,
      hasToken: !!ciEnv.accessToken,
      tokenLength: ciEnv.accessToken ? ciEnv.accessToken.length : 0,
      tokenStart: ciEnv.accessToken
        ? ciEnv.accessToken.substring(0, 4) + "..."
        : null,
    });

    let upstreamUrl = this.options.upstreamUrl;
    console.log("Original upstream URL:", upstreamUrl);

    if (ciEnv.isCI && ciEnv.accessToken) {
      if (upstreamUrl.startsWith("git@")) {
        const match = upstreamUrl.match(/git@github\.com:(.+?)(?:\.git)?$/);
        if (match) {
          const [, repoPath] = match;
          // Format as https://oauth2:TOKEN@github.com/org/repo.git
          upstreamUrl = `https://oauth2:${ciEnv.accessToken}@github.com/${repoPath}.git`;
          console.log(
            "Modified upstream URL:",
            upstreamUrl.replace(ciEnv.accessToken, "TOKEN_HIDDEN"),
          );
        } else {
          console.log("Failed to match SSH URL pattern");
        }
      }
    }

    if (!hasUpstream) {
      console.log("Adding upstream remote...");
      // Verify URL format (safely)
      const urlTest = upstreamUrl.replace(ciEnv.accessToken, "HIDDEN_TOKEN");
      console.log(
        "URL format check:",
        urlTest.match(/^https:\/\/oauth2:.+@github\.com\/.+\/.+\.git$/)
          ? "Valid"
          : "Invalid",
      );
      try {
        // Test GitHub API access
        const testCmd = `curl -s -I -H "Authorization: token ${ciEnv.accessToken}" https://api.github.com/repos/${config.upstream.organization}/${config.upstream.repository}`;
        const testResult = this.git.execCommand(testCmd, {
          suppressOutput: true,
          throwOnError: false,
        });
        console.log("GitHub API Test Response:", testResult);

        // Add the remote
        const result = this.git.execCommand(
          `git remote add upstream ${upstreamUrl}`,
          {
            suppressOutput: true,
            throwOnError: false,
          },
        );
        console.log("Add remote result:", result);

        // Test the remote
        const fetchTest = this.git.execCommand("git fetch upstream --dry-run", {
          suppressOutput: true,
          throwOnError: false,
        });
        console.log("Fetch test result:", fetchTest);
      } catch (error) {
        console.error("Error during remote setup:", error);
        throw error;
      }
    } else {
      console.log("Upstream remote exists, testing connection...");
      try {
        const listResult = this.git.execCommand("git remote -v", {
          suppressOutput: true,
          throwOnError: false,
        });
        console.log("Remote list:", listResult);

        if (ciEnv.isCI && ciEnv.accessToken) {
          const updateResult = this.git.execCommand(
            `git remote set-url upstream ${upstreamUrl}`,
            {
              suppressOutput: true,
              throwOnError: false,
            },
          );
          console.log("Update remote result:", updateResult);
        }
      } catch (error) {
        console.error("Error during remote verification:", error);
        throw error;
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

  private validateCIEnvironment(): void {
    const ciEnv = detectCI();
    if (ciEnv.isCI && !ciEnv.accessToken) {
      const tokenNames =
        {
          "GitHub Actions": ["GITHUB_TOKEN", "PAT_TOKEN"],
          "GitLab CI": ["CI_JOB_TOKEN", "PAT_TOKEN"],
          "Azure DevOps": ["SYSTEM_ACCESSTOKEN"],
          Jenkins: ["JENKINS_TOKEN"],
          CircleCI: ["CIRCLE_TOKEN"],
        }[ciEnv.name || ""] || [];

      console.error(
        `\n❌ Error: Required CI environment variable ${tokenNames.join(" or ")} is missing.`,
      );
      process.exit(1);
    }
  }

  public async initialize(): Promise<void> {
    try {
      this.git.log("Initializing upstream sync configuration...", true);

      // Validate CI environment before proceeding
      this.validateCIEnvironment();

      // Change to repository root
      this.git.changeToRepoRoot();

      // Check if we're in the upstream repo
      if (this.isUpstreamRepo()) {
        this.git.log(
          "ℹ Skipping initialization: sync must not be used in the upstream repository itself",
          true,
        );
        return;
      }

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
