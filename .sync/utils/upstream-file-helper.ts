// utils/upstream-file-helper.ts

import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "../.config";
import log from "./logger";

export type SyncBehavior = {
  shouldSync: boolean;
  type: "implicit-sync" | "explicit-sync" | "explicit-skip";
  pattern?: string;
};

export class UpstreamFileHelper {
  private readonly allowedOverridesPath: string;
  protected patterns: string[] | null = null;

  constructor() {
    this.allowedOverridesPath = config.sync.allowedOverridesPath;
  }

  /**
   * Determines if a file can be overridden locally.
   * Returns true if overriding is allowed, false if overriding is not allowed.
   */
  public allowOverride(filePath: string): boolean {
    const patterns = this.loadPatterns();
    let isAllowed = false;

    for (const pattern of patterns) {
      // Skip empty lines and comments
      if (!pattern || pattern.startsWith("#")) {
        continue;
      }

      const isNegation = pattern.startsWith("!");
      const cleanPattern = isNegation ? pattern.slice(1) : pattern;

      if (this.fileMatchesPattern(filePath, cleanPattern)) {
        if (isNegation) {
          // If it matches a negation pattern, overriding is not allowed
          return false;
        }
        // If it matches a regular pattern, mark as allowed (but keep checking for negations)
        isAllowed = true;
      }
    }

    // If no patterns matched at all, overriding is not allowed
    return isAllowed;
  }

  /**
   * Determines sync behavior for a file with semantic reasoning.
   * Returns:
   * - implicit-sync: File syncs because it doesn't match any patterns (catchall)
   * - explicit-sync: File syncs because it matches a negation pattern
   * - explicit-skip: File skips because it matches an allow pattern
   */
  public getSyncBehavior(filePath: string): SyncBehavior {
    const patterns = this.loadPatterns();
    let matchesAllowPattern = false;
    let allowPattern: string | undefined;

    for (const pattern of patterns) {
      if (!pattern || pattern.startsWith("#")) {
        continue;
      }

      const isNegation = pattern.startsWith("!");
      const cleanPattern = isNegation ? pattern.slice(1) : pattern;

      if (this.fileMatchesPattern(filePath, cleanPattern)) {
        if (isNegation) {
          return {
            shouldSync: true,
            type: "explicit-sync",
            pattern,
          };
        }
        matchesAllowPattern = true;
        allowPattern = pattern;
      }
    }

    return matchesAllowPattern
      ? {
          shouldSync: false,
          type: "explicit-skip",
          pattern: allowPattern,
        }
      : {
          shouldSync: true,
          type: "implicit-sync",
        };
  }

  /**
   * Backwards compatibility method for existing code
   */
  public shouldSync(filePath: string): boolean {
    return this.getSyncBehavior(filePath).shouldSync;
  }

  /**
   * Loads and parses the allowed overrides file.
   * Handles empty lines and comments.
   */
  private loadPatterns(): string[] {
    if (this.patterns !== null) {
      return this.patterns;
    }

    try {
      const fullPath = resolve(process.cwd(), this.allowedOverridesPath);
      const content = readFileSync(fullPath, "utf8");

      this.patterns = content
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => pattern.trim());

      return this.patterns;
    } catch (error) {
      log.error(`Failed to read allowed overrides: ${error}`);
      throw error;
    }
  }

  /**
   * Parses patterns for sync checks.
   * Uses negation patterns - if a file matches a negation pattern, it should sync.
   */
  private parseSyncPatterns(): string[] {
    const patterns = this.loadPatterns();
    // Only use negation patterns and remove the ! prefix
    return patterns
      .filter((pattern) => pattern.startsWith("!"))
      .map((pattern) => pattern.slice(1));
  }

  /**
   * Checks if a file matches a glob pattern.
   * Supports * (non-recursive) and ** (recursive) wildcards.
   */
  private fileMatchesPattern(filePath: string, pattern: string): boolean {
    // Handle directory patterns (ending with /)
    if (pattern.endsWith("/")) {
      const dirPattern = pattern.slice(0, -1);
      return filePath.startsWith(dirPattern + "/");
    }

    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, "\\.")
      .replace(/\*\*/g, ":::GLOBSTAR:::") // Temporary replacement for **
      .replace(/\*/g, "[^/]*") // * matches anything except /
      .replace(/\?/g, "[^/]") // ? matches any single char except /
      .replace(/:::GLOBSTAR:::/g, ".*") // ** matches anything including /
      .replace(/\//g, "\\/"); // Escape forward slashes

    const regex = new RegExp(`^${regexPattern}($|\\/)`);
    return regex.test(filePath);
  }
}

// Export a default instance that can be used directly
export const defaultUpstreamFileHelper = new UpstreamFileHelper();
