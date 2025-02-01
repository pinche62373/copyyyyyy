import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, relative, resolve } from "path";
import { config } from "./.config";
import { defaultCIUtils } from "./utils/ci-utils";
import { GitUtils } from "./utils/git-utils";

interface ProtectOptions {
  allowedOverridesPath?: string;
  verbose?: boolean;
}

interface ViolatingFile {
  file: string;
  type: "modified" | "added" | "deleted" | "renamed";
  upstreamPath?: string;
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

  private log(message: string, force: boolean = false): void {
    if (force || this.options.verbose) {
      console.log(message);
    }
  }

  // Shared methods between CI and local environments
  private readAllowedOverrides(): string[] {
    try {
      const allowedOverridesPath = resolve(
        process.cwd(),
        this.options.allowedOverridesPath,
      );
      this.log(`Reading allowed overrides from: ${allowedOverridesPath}`);

      const content = readFileSync(allowedOverridesPath, "utf8");
      return content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());
    } catch (error) {
      console.error(`Failed to read allowed overrides: ${error}`);
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

  // CI-specific methods
  private getAllFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];

    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (entry === "node_modules" || entry === ".git") continue;
        files.push(...this.getAllFiles(fullPath, baseDir));
      } else {
        // Get path relative to base directory
        const relativePath = relative(baseDir, fullPath);
        files.push(relativePath);
      }
    }

    return files;
  }

  private async getChangedFilesCI(): Promise<ViolatingFile[]> {
    const env = defaultCIUtils.getEnv();
    if (!defaultCIUtils.isCIEnvironment(env)) {
      throw new Error("Not in CI environment");
    }

    const mainRepoPath = env.mainRepoPath;
    const upstreamRepoPath = env.upstreamRepoPath;

    // Get all files from both repositories
    this.log("Scanning repositories...");
    const mainFiles = new Set(this.getAllFiles(mainRepoPath));
    const upstreamFiles = new Set(this.getAllFiles(upstreamRepoPath));

    const changes: ViolatingFile[] = [];

    // Check for modifications and additions
    for (const file of mainFiles) {
      if (upstreamFiles.has(file)) {
        // File exists in both - check if modified
        const mainContent = readFileSync(join(mainRepoPath, file), "utf8");
        const upstreamContent = readFileSync(
          join(upstreamRepoPath, file),
          "utf8",
        );

        if (mainContent !== upstreamContent) {
          changes.push({
            file,
            type: "modified",
            upstreamPath: join(upstreamRepoPath, file),
          });
        }
      }
    }

    return changes;
  }

  // Local development methods
  private isUpstreamRepo(): boolean {
    try {
      const originUrl = this.git.getRemoteUrl("origin");
      const match = originUrl.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (!match) return false;
      const [, org, repo] = match;
      return (
        org === config.upstream.organization &&
        repo === config.upstream.repository
      );
    } catch (error) {
      this.log(
        `Warning: Could not determine if this is upstream repo: ${error}`,
      );
      return false;
    }
  }

  private getUpstreamFiles(): Set<string> {
    try {
      this.git.execCommand("git fetch upstream");
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

  private getStagedChanges(): ViolatingFile[] {
    const status = this.git
      .execCommand("git diff --cached --name-status", { suppressOutput: true })
      .split("\n")
      .filter((line) => line.trim());

    return status.map((line) => {
      const [status, ...paths] = line.split("\t");
      const type = status.charAt(0) as "M" | "A" | "D" | "R";
      let file: string;

      if (type === "R") {
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

  private checkViolationsLocal(): ViolatingFile[] {
    const allowedPatterns = this.readAllowedOverrides();
    const upstreamFiles = this.getUpstreamFiles();
    const stagedChanges = this.getStagedChanges();
    const violations: ViolatingFile[] = [];

    for (const change of stagedChanges) {
      if (upstreamFiles.has(change.file)) {
        if (!this.isFileAllowedOverride(change.file, allowedPatterns)) {
          violations.push(change);
        }
      }
    }

    return violations;
  }

  // Common formatting methods
  private formatErrorMessage(violations: ViolatingFile[]): string {
    const messages: string[] = [
      "\n🚫 Error: Attempted to modify upstream-controlled files",
      "\nUnauthorized changes detected:\n",
    ];

    violations.forEach(({ file, type }) => {
      const prefix = {
        modified: "[MOD]",
        added: "[ADD]",
        deleted: "[DEL]",
        renamed: "[REN]",
      }[type];

      messages.push(`  ${prefix} ${file}`);
    });

    messages.push(
      "\nThese files can only be modified in the upstream repository unless explicitly allowed in .allowed-upstream-overrides",
      `\nPlease submit your changes to: https://github.com/${config.upstream.organization}/${config.upstream.repository}`,
      "\nAfter your changes are merged upstream, you can use 'git sync-from-upstream' to pull them into this repository.\n",
    );

    return messages.join("\n");
  }

  private formatChanges(
    changes: ViolatingFile[],
    violations: ViolatingFile[],
  ): void {
    if (changes.length > 0) {
      this.log("\nDetected changes:", true);
      changes.forEach(({ file, type }) => {
        const prefix = {
          modified: "[MOD]",
          added: "[ADD]",
          deleted: "[DEL]",
          renamed: "[REN]",
        }[type];
        const status = violations.some((v) => v.file === file) ? "❌" : "✓";
        this.log(`  ${status} ${prefix} ${file}`, true);
      });
      this.log(""); // Empty line for spacing
    }
  }

  public async check(): Promise<void> {
    try {
      // Skip check if this is a sync operation
      if (process.env.UPSTREAM_SYNC_OPERATION === "true") {
        this.log("✓ Upstream sync operation - skipping protection check", true);
        process.exit(0);
      }

      // Determine environment
      const env = defaultCIUtils.getEnv();
      let violations: ViolatingFile[] = [];
      let changes: ViolatingFile[] = [];

      if (defaultCIUtils.isCIEnvironment(env)) {
        this.log("Running in CI environment...", true);
        changes = await this.getChangedFilesCI();
        violations = changes.filter(
          (change) =>
            !this.isFileAllowedOverride(
              change.file,
              this.readAllowedOverrides(),
            ),
        );
      } else {
        this.log("Running in local environment...", true);
        // Change to repository root
        this.git.changeToRepoRoot();

        // Skip check if we're in the upstream repo
        if (this.isUpstreamRepo()) {
          this.log(
            "✓ In upstream repository - skipping protection check",
            true,
          );
          process.exit(0);
        }

        violations = this.checkViolationsLocal();
        changes = this.getStagedChanges();
      }

      // Format and display changes
      this.formatChanges(changes, violations);

      if (violations.length > 0) {
        console.error(this.formatErrorMessage(violations));
        process.exit(1);
      }

      this.log("✓ No unauthorized modifications to upstream files", true);
      process.exit(0);
    } catch (error) {
      console.error("Protection check failed:", error);
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
