// utils/upstream-file-helper.test.ts

import { describe, expect, it } from "vitest";
import { UpstreamFileHelper } from "./upstream-file-helper";

describe("UpstreamFileHelper", () => {
  // Create a subclass for testing that overrides the pattern loading
  class TestUpstreamFileHelper extends UpstreamFileHelper {
    constructor(testPatterns: string[]) {
      super();
      // Override patterns for testing
      this.patterns = testPatterns;
    }
  }

  // Test scenarios with different pattern sets
  describe("Basic File Protection", () => {
    const helper = new TestUpstreamFileHelper([
      "package.json", // Allow overriding package.json in root directory
      "README.md", // Allow overriding README.md in root directory
      "app/components/*", // Allow overriding all files in components directory
      "app/components/*/*", // Allow overriding nested component files
      "!app/components/upstream/**", // Do not allow overriding upstream components
      "!app/ui/upstream/**", // Do not allow overriding upstream UI files
    ]);

    it("should allow overriding explicitly allowed files", () => {
      expect(helper.allowOverride("README.md")).toBe(true);
    });

    it("should allow overriding files in allowed directories", () => {
      expect(helper.allowOverride("app/components/Button.tsx")).toBe(true);
      expect(helper.allowOverride("app/components/forms/Input.tsx")).toBe(true);
    });

    it("should not allow overriding upstream files", () => {
      expect(helper.allowOverride("app/components/upstream/core.ts")).toBe(
        false,
      );
      expect(helper.allowOverride("app/ui/upstream/theme.ts")).toBe(false);
    });

    it("should not allow overriding files without explicit patterns", () => {
      expect(helper.allowOverride("src/random.ts")).toBe(false);
      expect(helper.allowOverride("lib/utils.ts")).toBe(false);
    });
  });

  describe("Complex Pattern Matching", () => {
    const helper = new TestUpstreamFileHelper([
      "src/**/*.ts", // Allow overriding all TypeScript files in src
      "!src/core/**", // Do not allow overriding core files
      "lib/*.js", // Allow overriding root-level JS files in lib
      "!lib/internal/*", // Do not allow overriding internal lib files
    ]);

    it("should handle nested glob patterns", () => {
      expect(helper.allowOverride("src/utils/helper.ts")).toBe(true);
      expect(helper.allowOverride("src/core/base.ts")).toBe(false);
    });

    it("should handle multiple patterns affecting same directory", () => {
      expect(helper.allowOverride("lib/utils.js")).toBe(true);
      expect(helper.allowOverride("lib/internal/core.js")).toBe(false);
    });
  });

  describe("Sync File Selection", () => {
    const helper = new TestUpstreamFileHelper([
      "README2.md", // Should not sync
      "app/**/*", // Should not sync
      "!app/core/**", // Should sync
      "!app/shared/**", // Should sync
      "lib/**/*", // Should not sync
      "!lib/internal/**", // Should sync
    ]);

    it("should sync files matching negation patterns", () => {
      expect(helper.shouldSync("app/core/base.ts")).toBe(true);
      expect(helper.shouldSync("app/shared/utils.ts")).toBe(true);
      expect(helper.shouldSync("lib/internal/helper.ts")).toBe(true);
    });

    it("should not sync files without negation patterns", () => {
      expect(helper.shouldSync("app/features/component.ts")).toBe(false);
      expect(helper.shouldSync("lib/public/api.ts")).toBe(false);
    });

    it("should handle deeply nested paths in sync patterns", () => {
      expect(helper.shouldSync("app/core/deep/nested/file.ts")).toBe(true);
      expect(helper.shouldSync("lib/internal/submodule/utils/helper.ts")).toBe(
        true,
      );
    });
  });

  describe("Edge Cases", () => {
    const helper = new TestUpstreamFileHelper([
      "*", // Allow overriding all root files
      "!core/", // Do not allow overriding core directory
      "**.md", // Allow overriding all markdown files
      "!docs/*.md", // Do not allow overriding docs markdown files
    ]);

    it("should handle root wildcard patterns", () => {
      expect(helper.allowOverride("file.txt")).toBe(true);
    });

    it("should handle extension-specific patterns", () => {
      expect(helper.allowOverride("README.md")).toBe(true);
      expect(helper.allowOverride("docs/guide.md")).toBe(false);
    });

    it("should handle trailing slashes correctly", () => {
      expect(helper.allowOverride("core/file.txt")).toBe(false);
    });
  });
});
