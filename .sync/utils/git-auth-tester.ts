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

  private async testBasicAuth(): Promise<boolean> {
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
      console.error("Error in basic auth test:", error);
      return false;
    }
  }

  private async testUpstreamAccess(): Promise<boolean> {
    try {
      // Convert SSH URL to HTTPS with token
      const httpsUrl = this.repoUrl
        .replace("git@github.com:", "https://github.com/")
        .replace(".git", "");

      // Try to clone a single file to test access
      const command = `git archive --remote=${httpsUrl} HEAD README.md | tar t`;

      this.git.execCommand(command, {
        suppressOutput: true,
        throwOnError: true,
      });

      return true;
    } catch (error) {
      console.error("Error in upstream access test:", error);
      return false;
    }
  }

  public async testAll(): Promise<void> {
    const results = await Promise.all([
      this.testBasicAuth(),
      this.testUpstreamAccess(),
    ]);

    console.log("\n=== Authentication Test Results ===");
    console.log(`Basic Auth: ${results[0] ? "✓ Passed" : "❌ Failed"}`);
    console.log(`Upstream Access: ${results[1] ? "✓ Passed" : "❌ Failed"}`);

    if (!results.some((r) => r)) {
      throw new Error("All authentication methods failed");
    }

    // Require upstream access specifically
    if (!results[1]) {
      throw new Error("Unable to access upstream repository");
    }
  }
}
