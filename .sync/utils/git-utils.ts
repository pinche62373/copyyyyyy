// ./sync/utils/git-utils.ts

import { execSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

type BufferEncoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "utf-16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex";

export interface GitCommandOptions {
  /** Whether to suppress command output in logs */
  suppressOutput?: boolean;
  /** Whether to enable verbose logging */
  verbose?: boolean;
  /** Working directory for the command. If not provided, uses current directory */
  cwd?: string;
  /** Command timeout in milliseconds */
  timeout?: number;
  /** Whether to throw on non-zero exit code */
  throwOnError?: boolean;
  /** Encoding for the command output. Defaults to 'utf8' */
  encoding?: BufferEncoding;
}

export interface GitUtilsConfig {
  /** Default verbose setting for all operations */
  verbose: boolean;
}

export class GitUtils {
  private config: GitUtilsConfig;

  constructor(config: GitUtilsConfig) {
    this.config = config;
  }

  /**
   * Logs a message if verbose mode is enabled
   * @param message The message to log
   * @param force Force log even if verbose is disabled
   */
  public log(message: string, force: boolean = false): void {
    if (force || this.config.verbose) {
      console.log(message);
    }
  }

  /**
   * Normalizes a Git URL to a consistent format
   * - Removes trailing slashes
   * - Adds .git suffix if missing
   * - Converts SSH URLs to HTTPS format
   * - Adds authentication token if provided
   *
   * @param url The Git URL to normalize
   * @param token Optional authentication token to add to HTTPS URLs
   * @returns The normalized URL
   */
  public normalizeGitUrl(url: string, token: string | null = null): string {
    url = url.replace(/\/$/, ""); // Remove trailing slash if present

    // Add .git if missing
    if (!url.endsWith(".git")) {
      url = `${url}.git`;
    }

    // No token, return original URL
    if (!token) return url;

    // Log original URL for transparency
    this.log(`Original upstream URL: ${url}`, true);

    // Transform SSH URL to HTTPS with OAuth2 token
    if (url.startsWith("git@github.com:")) {
      const match = url.match(/git@github\.com:(.+?)(?:\.git)?$/);
      if (match) {
        const [, repoPath] = match;
        const normalizedUrl = `https://oauth2:${token}@github.com/${repoPath}.git`;

        // Log modified URL, masking the token for security
        this.log(
          `Modified upstream URL: https://oauth2:***@github.com/${repoPath}.git`,
          true,
        );

        return normalizedUrl;
      }
    }

    return "UNEXPECTED-GIT-URL";
  }

  /**
   * Executes a git command and returns its output
   */
  public execCommand(command: string, options: GitCommandOptions = {}): string {
    const {
      suppressOutput = false,
      verbose = this.config.verbose,
      cwd = process.cwd(),
      timeout = 30000,
      throwOnError = true,
      encoding = "utf8",
    } = options;

    try {
      if (verbose) {
        this.log(`Executing: ${command}`);
        this.log(`Working directory: ${cwd}`);
      }

      const output = execSync(command, {
        encoding,
        stdio: "pipe",
        cwd,
        timeout,
      });

      if (verbose && !suppressOutput) {
        this.log(`Command output: ${output}`);
      }

      return output;
    } catch (error) {
      const gitError = error as Error;
      if (verbose) {
        console.error(`Git command failed: ${gitError.message}`);
      }

      if (throwOnError) {
        throw new Error(`Git command failed: ${gitError.message}`);
      }

      return "";
    }
  }

  /**
   * Changes working directory to repository root
   * Returns the previous working directory
   */
  public changeToRepoRoot(): string {
    const previousCwd = process.cwd();

    // Get the git root directory using git rev-parse
    try {
      const rootDir = this.execCommand("git rev-parse --show-toplevel", {
        suppressOutput: true,
      }).trim();

      this.log(`Changing to repository root: ${rootDir}`);
      process.chdir(rootDir);
      return previousCwd;
    } catch (error) {
      // Fallback to finding .git directory if rev-parse fails
      try {
        const scriptDir = dirname(fileURLToPath(import.meta.url));
        const repoRoot = dirname(dirname(scriptDir)); // Go up two levels from utils/git-utils.ts

        this.log(`Changing to repository root (fallback): ${repoRoot}`);
        process.chdir(repoRoot);
        return previousCwd;
      } catch (fallbackError) {
        throw new Error(
          `Failed to determine repository root: ${error}\nFallback error: ${fallbackError}`,
        );
      }
    }
  }

  /**
   * Checks if the working directory is clean
   * Returns true if clean, false if there are uncommitted changes
   */
  public isWorkingDirectoryClean(): boolean {
    const status = this.execCommand("git status --porcelain", {
      suppressOutput: true,
      throwOnError: false,
    });
    return status.trim().length === 0;
  }

  /**
   * Gets the current branch name
   */
  public getCurrentBranch(): string {
    return this.execCommand("git branch --show-current", {
      suppressOutput: true,
    }).trim();
  }

  /**
   * Gets the current commit hash
   * @param short Whether to return the short version of the hash
   */
  public getCurrentCommitHash(short: boolean = false): string {
    const command = short ? "git rev-parse --short HEAD" : "git rev-parse HEAD";
    return this.execCommand(command, { suppressOutput: true }).trim();
  }

  /**
   * Checks if a remote exists
   */
  public hasRemote(remoteName: string): boolean {
    const remotes = this.execCommand("git remote", {
      suppressOutput: true,
      throwOnError: false,
    });
    return remotes.split("\n").includes(remoteName);
  }

  /**
   * Gets the URL of a remote
   */
  public getRemoteUrl(remoteName: string): string {
    return this.execCommand(`git config --get remote.${remoteName}.url`, {
      suppressOutput: true,
    }).trim();
  }

  /**
   * Safely checkout a branch, creating it if it doesn't exist
   */
  public checkoutBranch(
    branch: string,
    createIfNotExists: boolean = false,
  ): void {
    if (createIfNotExists) {
      this.execCommand(`git checkout -B ${branch}`);
    } else {
      this.execCommand(`git checkout ${branch}`);
    }
  }

  /**
   * Deletes a branch if it exists
   */
  public deleteBranch(branch: string, force: boolean = false): void {
    const flag = force ? "-D" : "-d";
    this.execCommand(`git branch ${flag} ${branch}`, { throwOnError: false });
  }
}

// Export a default instance that can be used directly
export const defaultGitUtils = new GitUtils({ verbose: false });
