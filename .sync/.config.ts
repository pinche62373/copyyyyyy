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
      syncCommitPattern: string; // Regex pattern to identify sync commit messages created by `git sync-to-origin`
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
      syncCommitPattern:
        "^chore: sync with upstream https://github\\.com/[^/]+/[^/]+/tree/[a-f0-9]+$",
      mainRepoPath: undefined, // populated at runtime in CI
      upstreamRepoPath: undefined, // populated at runtime in CI
    },
  },
};
