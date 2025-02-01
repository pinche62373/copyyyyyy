// ./sync/utils/ci-utils.ts

/** Base interface for environment configuration */
interface BaseEnvironment {
  /** Name of the CI platform */
  name: string | null;
}

/** Environment configuration for non-CI environment */
interface NonCIEnvironment extends BaseEnvironment {
  isCI: false;
  accessToken?: never; // accessToken doesn't make sense in non-CI
}

/** Environment configuration for CI environment */
interface CIEnvironment extends BaseEnvironment {
  isCI: true;
  mainRepoPath: string; // paths for side-by-side repo checkout
  upstreamRepoPath: string;
}

/** Union type for all environment configurations */
type Environment = CIEnvironment | NonCIEnvironment;

export interface CIUtilsConfig {
  /** Whether to enable verbose logging */
  verbose: boolean;
}

export class CIUtils {
  private config: CIUtilsConfig;
  private currentEnvironment: Environment | null = null;

  constructor(config: CIUtilsConfig) {
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
   * Type guard for CIEnvironment
   */
  public isCIEnvironment(env: Environment): env is CIEnvironment {
    return env.isCI === true;
  }

  /**
   * Detects and returns the current CI environment configuration
   * Caches the result for subsequent calls
   */
  public getEnv(): Environment {
    // Return cached environment if already detected
    if (this.currentEnvironment) {
      this.log("Returning cached CI environment");
      return this.currentEnvironment;
    }

    this.log("Detecting CI environment...");

    // Default response - non-CI
    const defaultEnv: NonCIEnvironment = {
      isCI: false,
      name: null,
    };

    // GitHub Actions detection
    if (process.env.GITHUB_ACTIONS === "true") {
      this.log("Detected GitHub Actions environment");

      // Debug token presence without exposing value
      const token = process.env.PAT_TOKEN;
      this.log(`Token exists: ${!!token}`);
      this.log(`Token length: ${token?.length || 0}`);

      // Get repo paths from environment
      const mainRepoPath = process.env.MAIN_REPO_PATH;
      const upstreamRepoPath = process.env.UPSTREAM_REPO_PATH;

      if (!mainRepoPath || !upstreamRepoPath) {
        this.log(
          "Warning: CI repo paths not found, will be required during initialization",
        );
      }

      this.currentEnvironment = {
        isCI: true,
        name: "GitHub Actions",
        mainRepoPath: mainRepoPath || "", // Initialize with empty string, will be set during init
        upstreamRepoPath: upstreamRepoPath || "", // Initialize with empty string, will be set during init
      };

      return this.currentEnvironment;
    }

    // Cache and return default environment
    this.currentEnvironment = defaultEnv;
    this.log("No CI environment detected");
    return this.currentEnvironment;
  }

  /**
   * Gets the paths for side-by-side repositories in GitHub Actions
   * @throws Error if paths cannot be determined
   */
  public getCIRepoPaths(): { mainRepoPath: string; upstreamRepoPath: string } {
    const env = this.getEnv();

    if (!this.isCIEnvironment(env)) {
      throw new Error("Not in CI environment");
    }

    // In GitHub Actions, we expect these to be set by the workflow
    const mainRepoPath = process.env.MAIN_REPO_PATH;
    const upstreamRepoPath = process.env.UPSTREAM_REPO_PATH;

    if (!mainRepoPath || !upstreamRepoPath) {
      throw new Error(
        "Required CI repository paths are not configured. " +
          "Please ensure MAIN_REPO_PATH and UPSTREAM_REPO_PATH are set in the workflow.",
      );
    }

    return { mainRepoPath, upstreamRepoPath };
  }
}

// Export a default instance that can be used directly
export const defaultCIUtils = new CIUtils({ verbose: false });
