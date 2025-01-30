// ./sync/utils/detect-ci.ts

/** Represents a CI environment configuration */
interface CIEnvironment {
  /** Whether running in a CI environment */
  isCI: boolean;
  /** Name of the CI platform */
  name: string | null;
  /** Access token for CI operations */
  accessToken: string | null;
}

/**
 * Safely retrieves a token from environment variables
 * @param tokenName The name of the token in process.env
 * @returns The token value or null if not found
 */
function getToken(tokenName: string): string | null {
  try {
    return process.env[tokenName] || null;
  } catch (error) {
    console.warn(`Failed to access token ${tokenName}:`, error);
    return null;
  }
}

/**
 * Type guard for CIEnvironment
 * @param env Value to check
 * @returns Whether the value is a CIEnvironment
 */
export function isCIEnvironment(env: unknown): env is CIEnvironment {
  return (
    typeof env === "object" &&
    env !== null &&
    "isCI" in env &&
    "name" in env &&
    "accessToken" in env
  );
}

/**
 * Detects the current CI environment and returns its configuration
 * @returns {CIEnvironment} The detected CI environment information
 */
export function detectCI(): CIEnvironment {
  // Default response
  const result: CIEnvironment = {
    isCI: false,
    name: null,
    accessToken: null,
  };

  // GitHub Actions
  if (process.env.GITHUB_ACTIONS === "true") {
    return {
      isCI: true,
      name: "GitHub Actions",
      accessToken: getToken("GITHUB_TOKEN") || getToken("PAT_TOKEN"),
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
      accessToken: getToken("CI_JOB_TOKEN") || getToken("PAT_TOKEN"),
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

  return result;
}

/**
 * Checks if the code is running in a CI environment
 * @returns {boolean} True if running in CI, false otherwise
 */
export function isRunningInCI(): boolean {
  return detectCI().isCI;
}

/**
 * Example usage with type checking
 */
const ciInfo = detectCI();
if (ciInfo.isCI && ciInfo.accessToken) {
  console.log(`Running in ${ciInfo.name} with access token`);
} else if (ciInfo.isCI) {
  console.log(`Running in ${ciInfo.name} without access token`);
} else {
  console.log("Not running in CI environment");
}
