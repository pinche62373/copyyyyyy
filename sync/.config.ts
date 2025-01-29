export interface GitConfig {
  upstream: {
    url: string;
    defaultBranch: string;
  };
  sync: {
    gitignoreUpstreamPath: string;
    verbose: boolean;
  };
}

export const config: GitConfig = {
  upstream: {
    url: "git@github.com:pinche62373/tzdb.git",
    defaultBranch: "main",
  },
  sync: {
    gitignoreUpstreamPath: "./sync/.gitignore-upstream",
    verbose: false,
  },
};
