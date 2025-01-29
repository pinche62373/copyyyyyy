import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "./.config";

interface ConfigureOptions {
  verbose?: boolean;
}

class GitConfigurator {
  private readonly options: Required<ConfigureOptions>;

  constructor(options: ConfigureOptions = {}) {
    this.options = {
      verbose: config.sync.verbose,
      ...options,
    };
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(message);
    }
  }

  private execGitCommand(command: string): string {
    try {
      this.log(`Executing: ${command}`);
      const output = execSync(command, { encoding: "utf8", stdio: "pipe" });
      this.log(`Command output: ${output}`);
      return output;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Git command failed: ${error.message}`);
        throw new Error(`Git command failed: ${error.message}`);
      }
      throw error;
    }
  }

  public configure(): void {
    try {
      this.log("Configuring git settings...");

      // Change to repository root
      const scriptDir = dirname(fileURLToPath(import.meta.url));
      const repoRoot = join(scriptDir, "..");
      this.log(`Changing to repository root: ${repoRoot}`);
      process.chdir(repoRoot);

      // Configure the sync-upstream alias
      const aliasScript = "!npx tsx ./sync/pull-upstream.ts";
      this.execGitCommand(`git config alias.sync-upstream "${aliasScript}"`);

      this.log(
        '✓ Git configuration complete - Use "git sync-upstream" to pull from upstream while respecting exclusions',
      );
    } catch (error) {
      console.error("Configuration failed:", error);
      throw error;
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("configure-git.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  console.log("Running script directly...");
  const configurator = new GitConfigurator();

  try {
    configurator.configure();
  } catch (error) {
    console.error("Configuration failed:", error);
    process.exit(1);
  }
} else {
  console.log("Script loaded as module");
}

export { GitConfigurator, type ConfigureOptions };
