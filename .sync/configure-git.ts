import { config } from "./.config";
import { GitUtils } from "./git-utils";

interface ConfigureOptions {
  verbose?: boolean;
}

class GitConfigurator {
  private readonly git: GitUtils;

  constructor(options: ConfigureOptions = {}) {
    const verbose = options.verbose ?? config.sync.verbose;
    this.git = new GitUtils({ verbose });
  }

  public configure(): void {
    try {
      this.git.log("Configuring git settings...");

      // Change to repository root
      this.git.changeToRepoRoot();

      // Configure the sync-from-upstream alias
      const upstreamScript = "!npx tsx ./.sync/sync-from-upstream.ts";
      this.git.execCommand(
        `git config alias.sync-from-upstream "${upstreamScript}"`,
      );

      // Configure the sync-to-origin alias
      const originScript = "!npx tsx ./.sync/sync-to-origin.ts";
      this.git.execCommand(`git config alias.sync-to-origin "${originScript}"`);

      this.git.log(
        "✓ Git configuration complete\n" +
          '  - Use "git sync-from-upstream" to pull from upstream while respecting exclusions\n' +
          '  - Use "git sync-to-origin" to commit and push upstream sync changes',
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
