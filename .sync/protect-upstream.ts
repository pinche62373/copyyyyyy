import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { config } from "./.config";
import { getInfoBox } from "./utils/boxen";
import { defaultCIHelper } from "./utils/ci-helper";
import { getExplainer } from "./utils/explainers";
import { GitHelper } from "./utils/git-helper";
import log from "./utils/logger";
import { defaultUpstreamFileHelper } from "./utils/upstream-file-helper";

interface ViolatingFile {
  file: string;
  type: "modified" | "added" | "deleted" | "renamed";
  upstreamPath?: string;
}

class UpstreamProtector {
  private readonly git: GitHelper;

  constructor() {
    this.git = new GitHelper({});
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
    if (!defaultCIHelper.isGithubActions()) {
      throw new Error("Not in CI environment");
    }

    const { mainRepoPath, upstreamRepoPath } = defaultCIHelper.getRepoPaths();

    log.debug("Scanning repositories...");
    const mainFiles = new Set(this.getAllFiles(mainRepoPath));
    const upstreamFiles = new Set(this.getAllFiles(upstreamRepoPath));

    const changes: ViolatingFile[] = [];

    for (const file of mainFiles) {
      if (upstreamFiles.has(file)) {
        const mainContent = readFileSync(join(mainRepoPath, file), "utf8");
        const upstreamContent = readFileSync(
          join(upstreamRepoPath, file),
          "utf8",
        );

        if (mainContent !== upstreamContent) {
          if (!defaultUpstreamFileHelper.allowOverride(file)) {
            changes.push({
              file,
              type: "modified",
              upstreamPath: join(upstreamRepoPath, file),
            });
          }
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
      log.error(
        "Warning: Could not determine if this is upstream repo:",
        error,
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
      log.error("Failed to get upstream files:", error);
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
    const upstreamFiles = this.getUpstreamFiles();
    const stagedChanges = this.getStagedChanges();
    const violations: ViolatingFile[] = [];

    for (const change of stagedChanges) {
      if (upstreamFiles.has(change.file)) {
        if (!defaultUpstreamFileHelper.allowOverride(change.file)) {
          violations.push(change);
        }
      }
    }

    return violations;
  }

  private formatErrorMessage(violations: ViolatingFile[]): string {
    const messages: string[] = [
      "\n🚫 Error: Detected modification of upstream-controlled files:",
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

    return (
      messages.join("\n") +
      "\n\n" +
      getInfoBox(getExplainer("protect-upstream-violation"))
    );
  }

  private formatChanges(
    changes: ViolatingFile[],
    violations: ViolatingFile[],
  ): void {
    if (changes.length > 0) {
      log.info("\nDetected changes:", true);
      changes.forEach(({ file, type }) => {
        const prefix = {
          modified: "[MOD]",
          added: "[ADD]",
          deleted: "[DEL]",
          renamed: "[REN]",
        }[type];
        const status = violations.some((v) => v.file === file) ? "❌" : "✓";

        log.info(`  ${status} ${prefix} ${file}`, true);
      });
      log.info(""); // Empty line for spacing
    }
  }

  public async check(): Promise<void> {
    try {
      // Skip check if this is a sync operation
      if (process.env.UPSTREAM_SYNC_OPERATION === "true") {
        log.info("✓ Upstream sync operation - skipping protection check", true);
        process.exit(0);
      }

      let violations: ViolatingFile[] = [];
      let changes: ViolatingFile[] = [];

      if (defaultCIHelper.isGithubActions()) {
        log.debug("Running in CI environment...", true);
        changes = await this.getChangedFilesCI();
        violations = changes.filter(
          (change) => !defaultUpstreamFileHelper.allowOverride(change.file),
        );
      } else {
        log.debug("Running in local environment...", true);
        this.git.changeToRepoRoot();

        if (this.isUpstreamRepo()) {
          log.info("In upstream repository - skipping protection check", true);
          process.exit(0);
        }

        violations = this.checkViolationsLocal();
        changes = this.getStagedChanges();
      }

      this.formatChanges(changes, violations);

      if (violations.length > 0) {
        log.error(this.formatErrorMessage(violations));
        process.exit(1);
      }

      log.info("✓ No unauthorized modifications to upstream files", true);
      process.exit(0);
    } catch (error) {
      log.error("Protection check failed:", error);
      process.exit(1);
    }
  }
}

// Check if file is being run directly
const isRunDirectly =
  process.argv[1]?.endsWith("protect-upstream.ts") ||
  process.argv[1]?.includes("tsx");

if (isRunDirectly) {
  log.info("Running protection check...");
  const protector = new UpstreamProtector();
  protector.check();
} else {
  log.debug("Script loaded as module");
}

export { UpstreamProtector };
