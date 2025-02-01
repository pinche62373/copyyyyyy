// ./sync/utils/ci-helpers.ts
import log from "./logger";

/**
 * CI Utils for GitHub Actions Integration
 *
 * This utility provides helper functions for working with GitHub Actions,
 * specifically focusing on repository path management and environment detection.
 *
 * Usage:
 * ```typescript
 * if (defaultCIHelper.isGithubActions()) {
 *   const { mainRepoPath, upstreamRepoPath } = defaultCIHelper.getRepoPaths();
 *   // Work with paths...
 * }
 * ```
 */

/** Configuration for GitHub Actions paths */
interface GithubActionsPaths {
  mainRepoPath: string;
  upstreamRepoPath: string;
}

export interface CIHelperConfig {}

export class CIHelper {
  private config: CIHelperConfig;

  constructor(config: CIHelperConfig) {
    this.config = config;
  }

  /**
   * Returns true if running in GitHub Actions
   */
  public isGithubActions(): boolean {
    return process.env.GITHUB_ACTIONS === "true";
  }

  /**
   * Gets the repository paths for GitHub Actions
   * @throws Error if not in GitHub Actions or paths not configured
   */
  public getRepoPaths(): GithubActionsPaths {
    if (!this.isGithubActions()) {
      throw new Error("Not running in GitHub Actions");
    }

    const mainRepoPath = process.env.MAIN_REPO_PATH;
    const upstreamRepoPath = process.env.UPSTREAM_REPO_PATH;

    if (!mainRepoPath || !upstreamRepoPath) {
      throw new Error(
        "Required repository paths are not configured. " +
          "Please ensure MAIN_REPO_PATH and UPSTREAM_REPO_PATH are set in the workflow.",
      );
    }

    return { mainRepoPath, upstreamRepoPath };
  }

  /**
   * Verifies that the repository paths exist
   * @throws Error if paths don't exist
   */
  public async verifyRepoPaths(): Promise<void> {
    const paths = this.getRepoPaths();

    const fs = await import("fs/promises");
    for (const [key, path] of Object.entries(paths)) {
      try {
        await fs.access(path);
        log.info(`✓ Verified ${key}: ${path}`);
      } catch {
        throw new Error(`Repository path does not exist: ${path}`);
      }
    }
  }
}

// Export a default instance that can be used directly
export const defaultCIHelper = new CIHelper({});
