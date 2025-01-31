import { GitUtils } from "./git-utils";

interface GitHubAuthConfig {
  token: string;
  repoUrl: string;
  verbose?: boolean;
}

export class GitHubAuthHandler {
  private readonly git: GitUtils;
  private readonly token: string;
  private readonly repoUrl: string;

  constructor(config: GitHubAuthConfig) {
    this.git = new GitUtils({ verbose: config.verbose ?? false });
    this.token = config.token;
    this.repoUrl = config.repoUrl;
  }

  public async authenticate(): Promise<void> {
    // Set GitHub token in environment
    process.env.GITHUB_TOKEN = this.token;

    // Extract org and repo from URL
    const [org, repo] = this.repoUrl
      .split(":")[1]
      .replace(".git", "")
      .split("/");

    // Test authentication using GitHub API
    const command = `curl -H "Authorization: token ${this.token}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/${org}/${repo}`;

    try {
      const result = this.git.execCommand(command, {
        suppressOutput: true,
        throwOnError: false,
      });

      if (result.includes("Bad credentials") || result.includes("Not Found")) {
        throw new Error(
          "GitHub authentication failed - invalid token or insufficient permissions",
        );
      }

      // Configure git credentials if API check passes
      this.git.execCommand("git config --global credential.helper cache");
      this.git.execCommand(
        `git config --global url."https://oauth2:${this.token}@github.com/".insteadOf "git@github.com:"`,
      );

      // Verify git access
      const httpsUrl = `https://github.com/${org}/${repo}.git`;
      await this.git.execCommand(`git ls-remote ${httpsUrl}`, {
        suppressOutput: true,
      });
    } catch (error) {
      throw new Error(`GitHub authentication failed: ${error.message}`);
    }
  }

  public cleanup(): void {
    // Remove credential helper configuration
    this.git.execCommand("git config --global --unset credential.helper");
    this.git.execCommand(
      "git config --global --remove-section url.https://oauth2:${token}@github.com/",
    );
  }
}
