// ./sync/utils/git-helper.ts

import { execSync } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import log from "./logger";

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
  suppressOutput?: boolean; // Whether to suppress command output in logs
  cwd?: string; //   // Working directory for the command. If not provided, uses current directory
  timeout?: number; //  Command timeout in milliseconds
  throwOnError?: boolean; // Whether to throw on non-zero exit code */
  encoding?: BufferEncoding; // Encoding for the command output. Defaults to 'utf8' */
  env?: Record<string, string>; // @Claude: unused ?!?
  input?: string; // @Claude: unused ?!?
}

export interface GitHelperConfig {}

export class GitHelper {
  private config: GitHelperConfig;

  constructor(config: GitHelperConfig) {
    this.config = config;
  }

  /**
   * Executes a git command and returns its output
   */
  public execCommand(command: string, options: GitCommandOptions = {}): string {
    const {
      suppressOutput = false,
      cwd = process.cwd(),
      timeout = 30000,
      throwOnError = true,
      encoding = "utf8",
      env = {},
      input,
    } = options;

    try {
      log.debug(`Raw command: ${command}`); // Add this
      log.debug(`CWD: ${options.cwd || process.cwd()}`); // Add this

      log.debug(`Executing: ${command}`);
      log.debug(`Working directory: ${cwd}`);

      const output = execSync(command, {
        encoding,
        stdio: "pipe",
        cwd,
        timeout,
        env: { ...process.env, ...env },
        input,
      });

      if (!suppressOutput) {
        log.debug(`Command output: ${output}`);
      }

      return output;
    } catch (error) {
      const gitError = error as Error;

      log.error("Git command failed:", gitError.message);

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

      log.debug(`Changing to repository root: ${rootDir}`);

      process.chdir(rootDir);
      return previousCwd;
    } catch (error) {
      // Fallback to finding .git directory if rev-parse fails
      try {
        const scriptDir = dirname(fileURLToPath(import.meta.url));
        const repoRoot = dirname(dirname(scriptDir)); // Go up two levels from utils/git-jelper.ts

        log.debug(`Changing to repository root (fallback): ${repoRoot}`);

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
export const defaultGitHelper = new GitHelper({});
