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
    const results = await Promise.all([this.testMethod4()]);

    console.log("\n=== Authentication Test Results ===");
    results.forEach((success, index) => {
      console.log(`Method ${index + 1}: ${success ? "✓ Passed" : "❌ Failed"}`);
    });

    if (!results.some((r) => r)) {
      throw new Error("All authentication methods failed");
    }
  }
}
