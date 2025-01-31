import { GitUtils } from "./git-utils";

interface GitAuthTesterConfig {
  token: string;
  repoUrl: string;
  verbose?: boolean;
}

export class GitAuthTester {
  private readonly git: GitUtils;
  private readonly token: string;
  private readonly repoUrl: string;

  constructor(config: GitAuthTesterConfig) {
    this.git = new GitUtils({ verbose: config.verbose ?? false });
    this.token = config.token;
    this.repoUrl = config.repoUrl;
  }

  private async testMethod1(): Promise<boolean> {
    try {
      // Test basic HTTPS access with token
      const httpsUrl = this.repoUrl.replace(
        "git@github.com:",
        "https://github.com/",
      );
      const command = `git ls-remote ${httpsUrl}`;
      this.git.execCommand(command, {
        suppressOutput: true,
        env: { GIT_ASKPASS: "echo", GIT_TOKEN: this.token },
      });
      return true;
    } catch (error) {
      console.error("Error", error);
      return false;
    }
  }

  private async testMethod2(): Promise<boolean> {
    try {
      // Test with explicit token in URL
      const [org, repo] = this.repoUrl
        .split(":")[1]
        .replace(".git", "")
        .split("/");
      const tokenUrl = `https://${this.token}@github.com/${org}/${repo}.git`;
      const command = `git ls-remote ${tokenUrl}`;
      this.git.execCommand(command, { suppressOutput: true });
      return true;
    } catch (error) {
      console.error("Error", error);
      return false;
    }
  }

  private async testMethod3(): Promise<boolean> {
    try {
      // Test with credential helper
      const command = "git config --global credential.helper store";
      this.git.execCommand(command);

      // Store credentials
      const credentialInput = `protocol=https\nhost=github.com\nusername=x-access-token\npassword=${this.token}\n`;
      this.git.execCommand("git credential approve", {
        input: credentialInput,
        suppressOutput: true,
      });

      // Test access
      const httpsUrl = this.repoUrl.replace(
        "git@github.com:",
        "https://github.com/",
      );
      this.git.execCommand(`git ls-remote ${httpsUrl}`, {
        suppressOutput: true,
      });
      return true;
    } catch (error) {
      console.error("Error", error);
      return false;
    }
  }

  private async testMethod4(): Promise<boolean> {
    try {
      // Test with GitHub CLI authentication
      if (!process.env.GITHUB_TOKEN) {
        process.env.GITHUB_TOKEN = this.token;
      }

      const [org, repo] = this.repoUrl
        .split(":")[1]
        .replace(".git", "")
        .split("/");
      const command = `curl -H "Authorization: token ${this.token}" https://api.github.com/repos/${org}/${repo}`;

      const result = this.git.execCommand(command, {
        suppressOutput: true,
        throwOnError: false,
      });

      return !result.includes("Bad credentials");
    } catch (error) {
      console.error("Error", error);
      return false;
    }
  }

  public async testAll(): Promise<void> {
    const results = await Promise.all([
      this.testMethod1(),
      this.testMethod2(),
      this.testMethod3(),
      this.testMethod4(),
    ]);

    console.log("\n=== Authentication Test Results ===");
    results.forEach((success, index) => {
      console.log(`Method ${index + 1}: ${success ? "✓ Passed" : "❌ Failed"}`);
    });

    if (!results.some((r) => r)) {
      throw new Error("All authentication methods failed");
    }
  }
}
