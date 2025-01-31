// ./sync/utils/detect-ci.ts

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

/**
 * Safely retrieves a token from environment variables
 * Throws error if token is not found
 */
function getToken(tokenName: string): string {
  const token = process.env[tokenName];
  if (!token) {
    throw new Error(
      `Required CI environment variable ${tokenName} is not configured. ` +
        `This token is required for private repository access.`,
    );
  }
  return token;
}

/**
 * Type guard for CIEnvironment
 */
export function isCIEnvironment(env: Environment): env is CIEnvironment {
  return env.isCI === true;
}

/**
 * Detects the current CI environment and returns its configuration.
 * Each CI system uses its specific token for private repository access.
 */
export function detectCI(): Environment {
  // Default response - non-CI
  const defaultEnv: NonCIEnvironment = {
    isCI: false,
    name: null,
  };

  // GitHub Actions
  if (process.env.GITHUB_ACTIONS === "true") {
    return {
      isCI: true,
      name: "GitHub Actions",
      accessToken: getToken("PAT_TOKEN"), // Personal Access Token for GitHub
    };
  }

  // Azure DevOps
  if (process.env.TF_BUILD === "True") {
    return {
      isCI: true,
      name: "Azure DevOps",
      accessToken: getToken("SYSTEM_ACCESSTOKEN"),
    };
  }

  // GitLab CI
  if (process.env.GITLAB_CI === "true") {
    return {
      isCI: true,
      name: "GitLab CI",
      accessToken: getToken("CI_JOB_TOKEN"),
    };
  }

  // Jenkins
  if (process.env.JENKINS_URL) {
    return {
      isCI: true,
      name: "Jenkins",
      accessToken: getToken("JENKINS_TOKEN"),
    };
  }

  // CircleCI
  if (process.env.CIRCLECI === "true") {
    return {
      isCI: true,
      name: "CircleCI",
      accessToken: getToken("CIRCLE_TOKEN"),
    };
  }

  return defaultEnv;
}

/**
 * Checks if the code is running in a CI environment
 */
export function isRunningInCI(): boolean {
  return detectCI().isCI;
}

// Example usage with type checking
const env = detectCI();
if (isCIEnvironment(env)) {
  // TypeScript knows accessToken exists and is non-null here
  console.log(`Running in ${env.name} with access token`);
} else {
  console.log("Not running in CI environment");
}
