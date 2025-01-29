export interface GitConfig {
  upstream: {
    organization: string;
    repository: string;
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
    organization: "pinche62373",
    repository: "tzdb",
    url: "git@github.com:pinche62373/tzdb.git",
    defaultBranch: "main",
  },
  sync: {
    gitignoreUpstreamPath: "./sync/.gitignore-upstream",
    verbose: true,
  },
};
