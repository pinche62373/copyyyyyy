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
  accessToken: string; // Required in CI - no null allowed!
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

      this.currentEnvironment = {
        isCI: true,
        name: "GitHub Actions",
        accessToken: this.getToken("PAT_TOKEN"), // Personal Access Token for GitHub
      };

      return this.currentEnvironment;
    }

    // Cache and return default environment
    this.currentEnvironment = defaultEnv;
    this.log("No CI environment detected");
    return this.currentEnvironment;
  }

  /**
   * Safely retrieves a token from environment variables
   * @param tokenName Name of the environment variable containing the token
   * @returns The token value
   * @throws Error if token is not found
   */
  private getToken(tokenName: string): string {
    const token = process.env[tokenName];
    if (!token) {
      throw new Error(
        `Required CI environment variable ${tokenName} is not configured. ` +
          `This token is required for private repository access.`,
      );
    }
    this.log(`Found token: ${tokenName}`);
    return token;
  }

  /**
   * Gets the access token for the current environment
   * @returns The access token if in CI environment, null otherwise
   */
  public getAccessToken(): string | null {
    const env = this.getEnv();
    return this.isCIEnvironment(env) ? env.accessToken : null;
  }

  /**
   * Makes sure the CI-specific token ENV var exists
   * @throws Error if required token is missing in CI environment
   */
  public requireToken(): void {
    const env = this.getEnv();

    if (this.isCIEnvironment(env) && !env.accessToken) {
      const tokenNames =
        {
          "GitHub Actions": ["GITHUB_TOKEN", "PAT_TOKEN"],
          "GitLab CI": ["CI_JOB_TOKEN", "PAT_TOKEN"],
          "Azure DevOps": ["SYSTEM_ACCESSTOKEN"],
          Jenkins: ["JENKINS_TOKEN"],
          CircleCI: ["CIRCLE_TOKEN"],
        }[env.name || ""] || [];

      throw new Error(
        `Required CI environment variable ${tokenNames.join(" or ")} is missing.`,
      );
    }
  }
}

// Export a default instance that can be used directly
export const defaultCIUtils = new CIUtils({ verbose: false });
