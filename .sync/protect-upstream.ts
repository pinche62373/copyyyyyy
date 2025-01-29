import { readFileSync } from "fs";
import { config } from "./.config";
import { GitUtils } from "./git-utils";

interface ProtectOptions {
  allowedOverridesPath?: string;
  verbose?: boolean;
}

interface ViolatingFile {
  file: string;
  type: "modified" | "added" | "deleted" | "renamed";
}

class UpstreamProtector {
  private readonly git: GitUtils;
  private readonly options: Required<ProtectOptions>;

  constructor(options: ProtectOptions = {}) {
    this.options = {
      allowedOverridesPath: config.sync.allowedOverridesPath,
      verbose: config.sync.verbose,
      ...options,
    };
    this.git = new GitUtils({ verbose: this.options.verbose });
  }

  private isUpstreamRepo(): boolean {
    try {
      // Get the remote URL of origin
      const originUrl = this.git.getRemoteUrl("origin");

      // Extract org/repo from origin URL
      const match = originUrl.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (!match) {
        return false;
      }

      const [, org, repo] = match;

      // Compare with configured upstream
      return (
        org === config.upstream.organization &&
        repo === config.upstream.repository
      );
    } catch (error) {
      this.git.log(
        `Warning: Could not determine if this is upstream repo: ${error}`,
      );
      return false;
    }
  }

  private readAllowedOverrides(): string[] {
    try {
      this.git.log(
        `Reading allowed overrides from: ${this.options.allowedOverridesPath}`,
      );
      const content = readFileSync(this.options.allowedOverridesPath, "utf8");
      return content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());
    } catch (error) {
      console.error(`Failed to read allowed overrides: ${error}`);
      throw error;
    }
  }

  private getUpstreamFiles(): Set<string> {
    try {
      // Fetch latest upstream if needed
      this.git.execCommand("git fetch upstream");

      // Get list of files that exist in upstream
      const files = this.git
        .execCommand("git ls-tree -r --name-only upstream/main", {
          suppressOutput: true,
        })
        .split("\n")
        .filter((file) => file.trim());

      return new Set(files);
    } catch (error) {
      console.error("Failed to get upstream files:", error);
      throw error;
    }
  }

  private isFileAllowedOverride(
    file: string,
    allowedPatterns: string[],
  ): boolean {
    for (const pattern of allowedPatterns) {
      const regexPattern = pattern
        .replace(/\./g, "\\.")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".")
        .replace(/\//g, "[/\\\\]");

      const regex = new RegExp(`^${regexPattern}($|[/\\\\])`);
      if (regex.test(file)) {
        return true;
      }
    }
    return false;
  }

  private getStagedChanges(): ViolatingFile[] {
    // Get status of staged files with rename detection
    const status = this.git
      .execCommand("git diff --cached --name-status", { suppressOutput: true })
      .split("\n")
      .filter((line) => line.trim());

    return status.map((line) => {
      const [status, ...paths] = line.split("\t");
      const type = status.charAt(0) as "M" | "A" | "D" | "R";

      let file: string;
      if (type === "R") {
        // For renames, we care about the new filename
        file = paths[1];
      } else {
        file = paths[0];
      }

      return {
        file,
        type:
          type === "M"
            ? "modified"
            : type === "A"
              ? "added"
              : type === "D"
                ? "deleted"
                : "renamed",
      };
    });
  }

  private checkViolations(): ViolatingFile[] {
    const allowedPatterns = this.readAllowedOverrides();
    const upstreamFiles = this.getUpstreamFiles();
    const stagedChanges = this.getStagedChanges();
    const violations: ViolatingFile[] = [];

    for (const change of stagedChanges) {
      // If the file exists in upstream
      if (upstreamFiles.has(change.file)) {
        // Check if it's allowed to be overridden
        if (!this.isFileAllowedOverride(change.file, allowedPatterns)) {
          violations.push(change);
        }
      }
      // If file doesn't exist in upstream, it's allowed by default
    }

    return violations;
  }

  private generateUpstreamUrl(file: string): string {
    const { organization, repository } = config.upstream;
    return `https://github.com/${organization}/${repository}/blob/main/${file}`;
  }

  private formatErrorMessage(violations: ViolatingFile[]): string {
    const messages: string[] = [
      "\n🚫 Error: Attempted to modify upstream-controlled files",
      "\nThe following files are managed by the upstream repository and cannot be modified:",
      "",
    ];

    violations.forEach(({ file, type }) => {
      messages.push(`  • ${file}`);
      messages.push(`    action: ${type}`);
      messages.push(`    upstream location: ${this.generateUpstreamUrl(file)}`);
      messages.push("");
    });

    messages.push(
      "These files can only be modified in the upstream repository unless explicitly allowed in .allowed-upstream-overrides",
      `Please submit your changes to: https://github.com/${config.upstream.organization}/${config.upstream.repository}`,
      "\nAfter your changes are merged upstream, you can use 'git sync-from-upstream' to pull them into this repository.",
      "",
    );

    return messages.join("\n");
  }

  public check(): void {
    try {
      // Skip check if this is a sync operation
      if (process.env.UPSTREAM_SYNC_OPERATION === "true") {
        this.git.log(
          "✓ Upstream sync operation - skipping protection check",
          true,
        );
        process.exit(0);
      }

      // Change to repository root
      this.git.changeToRepoRoot();

      // Skip check if we're in the upstream repo
      if (this.isUpstreamRepo()) {
        this.git.log(
          "✓ In upstream repository - skipping protection check",
          true,
        );
        process.exit(0);
      }

      // Check for violations
      const violations = this.checkViolations();

      if (violations.length > 0) {
        console.error(this.formatErrorMessage(violations));
        process.exit(1);
      }

      this.git.log("✓ No unauthorized modifications to upstream files", true);
      process.exit(0);
    } catch (error) {
      console.error("Check failed:", error);
      process.exit(1);
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("protect-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  console.log("Running protection check...");
  const protector = new UpstreamProtector();
  protector.check();
} else {
  console.log("Script loaded as module");
}

export { UpstreamProtector, type ProtectOptions };
