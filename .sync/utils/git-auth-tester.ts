import { GitUtils } from "./git-utils";

interface AuthTestOptions {
  verbose?: boolean;
  token: string;
  repoUrl: string;
}

class GitAuthTester {
  private readonly git: GitUtils;
  private readonly options: Required<AuthTestOptions>;

  constructor(options: AuthTestOptions) {
    this.options = {
      verbose: true,
      ...options,
    };
    this.git = new GitUtils({ verbose: this.options.verbose });
  }

  private async testMethod1(): Promise<boolean> {
    // Method 1: Direct token in URL
    try {
      const tokenUrl = this.options.repoUrl.replace(
        "https://",
        `https://${this.options.token}@`,
      );
      this.git.log("Testing Method 1: Direct token in URL");
      this.git.execCommand(`git ls-remote ${tokenUrl}`);
      return true;
    } catch (error) {
      this.git.log(`Method 1 failed: ${error}`);
      return false;
    }
  }

  private async testMethod2(): Promise<boolean> {
    // Method 2: Using credential.helper store
    try {
      this.git.log("Testing Method 2: Using credential.helper store");

      // Create temporary credential store
      this.git.execCommand("git config --global credential.helper store");

      // Store credentials
      const protocol = this.options.repoUrl.startsWith("https")
        ? "https"
        : "http";
      const credentials = `protocol=${protocol}\nhost=github.com\nusername=${this.options.token}\npassword=x-oauth-basic\n`;
      this.git.execCommand(`printf "${credentials}" | git credential approve`);

      // Test access
      this.git.execCommand(`git ls-remote ${this.options.repoUrl}`);
      return true;
    } catch (error) {
      this.git.log(`Method 2 failed: ${error}`);
      return false;
    }
  }

  private async testMethod3(): Promise<boolean> {
    // Method 3: Using insteadOf configuration
    try {
      this.git.log("Testing Method 3: Using insteadOf configuration");

      // Clear any existing credential helper
      this.git.execCommand('git config --global credential.helper ""');

      // Set up insteadOf
      this.git.execCommand(
        `git config --global url."https://${this.options.token}@github.com/".insteadOf "https://github.com/"`,
      );

      // Test access
      this.git.execCommand(`git ls-remote ${this.options.repoUrl}`);
      return true;
    } catch (error) {
      this.git.log(`Method 3 failed: ${error}`);
      return false;
    }
  }

  private async testMethod4(): Promise<boolean> {
    // Method 4: Using GH_TOKEN environment variable
    try {
      this.git.log("Testing Method 4: Using GH_TOKEN environment variable");

      // Temporarily set GH_TOKEN
      process.env.GH_TOKEN = this.options.token;

      // Configure git to use GH_TOKEN
      this.git.execCommand('git config --global credential.helper ""');
      this.git.execCommand(
        'git config --global credential.helper "env --username=GH_TOKEN"',
      );

      // Test access
      this.git.execCommand(`git ls-remote ${this.options.repoUrl}`);
      return true;
    } catch (error) {
      this.git.log(`Method 4 failed: ${error}`);
      return false;
    }
  }

  public async testAll(): Promise<void> {
    this.git.log("\n=== Starting Authentication Tests ===\n");

    // Log token info (safely)
    this.git.log(`Token exists: ${Boolean(this.options.token)}`);
    this.git.log(`Token length: ${this.options.token?.length || 0}`);

    // Test public repo access first
    try {
      this.git.log("\nTesting public repository access...");
      this.git.execCommand(
        "git ls-remote https://github.com/sindresorhus/is-up.git",
      );
      this.git.log("✓ Public repository test successful\n");
    } catch (error) {
      this.git.log("❌ Public repository test failed\n");
      throw error;
    }

    // Test each authentication method
    const results = await Promise.all([
      this.testMethod1(),
      this.testMethod2(),
      this.testMethod3(),
      this.testMethod4(),
    ]);

    // Log results
    this.git.log("\n=== Authentication Test Results ===");
    results.forEach((success, index) => {
      this.git.log(
        `Method ${index + 1}: ${success ? "✓ Success" : "❌ Failed"}`,
      );
    });

    // Clean up
    this.git.log("\nCleaning up git configurations...");
    this.git.execCommand('git config --global credential.helper ""');
    this.git.execCommand(
      "git config --global --unset-all url.https://github.com/.insteadOf",
    );

    if (!results.some((r) => r)) {
      throw new Error("All authentication methods failed");
    }
  }
}

export { GitAuthTester, type AuthTestOptions };
