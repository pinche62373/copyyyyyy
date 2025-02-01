// .config.ts
export interface GitConfig {
  upstream: {
    organization: string;
    repository: string;
    url: string;
    defaultBranch: string;
  };
  sync: {
    allowedOverridesPath: string;
    ci: {
      syncCommitPattern: string; // Regex pattern to identify sync commits
      mainRepoPath?: string;
      upstreamRepoPath?: string;
    };
  };
}

export const config: GitConfig = {
  upstream: {
    organization: "pinche62373",
    repository: "tzdb",
    url: "git@github.com:pinche62373/tzdb.git",
    defaultBranch: "main",
  },
  sync: {
    allowedOverridesPath: "./.sync/.allowed-upstream-overrides",
    ci: {
      // This pattern matches commits created by `git sync-to-origin`
      syncCommitPattern:
        "^chore: sync with upstream https://github\\.com/[^/]+/[^/]+/tree/[a-f0-9]+$",
      // These will be populated at runtime in CI
      mainRepoPath: undefined,
      upstreamRepoPath: undefined,
    },
  },
};
