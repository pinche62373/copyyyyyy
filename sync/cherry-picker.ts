import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface CherryPickOptions {
  sourceRepoPath: string;
  targetRepoPath: string;
  regex: string;
  branch?: string;
}

interface CommandError extends Error {
  stderr?: Buffer;
  stdout?: Buffer;
}

class GitCherryPicker {
  private sourceRepoPath: string;
  private targetRepoPath: string;
  private regex: string;
  private branch: string;

  constructor(options: CherryPickOptions) {
    this.validateRepositoryPaths(
      options.sourceRepoPath,
      options.targetRepoPath,
    );

    this.sourceRepoPath = path.resolve(options.sourceRepoPath);
    this.targetRepoPath = path.resolve(options.targetRepoPath);
    this.regex = options.regex;
    this.branch = options.branch || "main";
  }

  private validateRepositoryPaths(
    sourcePath: string,
    targetPath: string,
  ): void {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source repository path does not exist: ${sourcePath}`);
    }

    if (!fs.existsSync(targetPath)) {
      throw new Error(`Target repository path does not exist: ${targetPath}`);
    }

    this.validateGitRepository(sourcePath, "Source");
    this.validateGitRepository(targetPath, "Target");
  }

  private validateGitRepository(repoPath: string, repoType: string): void {
    const gitDirPath = path.join(repoPath, ".git");
    if (!fs.existsSync(gitDirPath)) {
      throw new Error(
        `${repoType} repository is not a valid Git repository: ${repoPath}`,
      );
    }
  }

  private runCommand(command: string, cwd: string): string {
    try {
      return execSync(command, { cwd, encoding: "utf-8" }).trim();
    } catch (error) {
      console.error(`Command execution failed:`, {
        command,
        cwd,
        error: (error as CommandError).message,
      });
      throw error;
    }
  }

  private isCommitMerged(commitMessage: string): boolean {
    try {
      const targetCommits = this.runCommand(
        'git log --pretty=format:"%s"',
        this.targetRepoPath,
      );
      return targetCommits.includes(commitMessage);
    } catch {
      return false;
    }
  }

  private getMatchingCommits(): Array<{ hash: string; message: string }> {
    const command = `git log --reverse ${this.branch} --pretty=format:"%H||%s"`;
    const output = this.runCommand(command, this.sourceRepoPath);

    return output
      .split("\n")
      .filter((line) => line.includes(this.regex))
      .map((line) => {
        const [hash, message] = line.split("||");
        return { hash, message };
      });
  }

  private getFileChanges(commit: string): Array<[string, string]> {
    const statusOutput = this.runCommand(
      `git diff-tree --no-commit-id -r ${commit}`,
      this.sourceRepoPath,
    );
    const fileChanges: Array<[string, string]> = [];

    statusOutput.split("\n").forEach((line) => {
      const parts = line.split("\t");
      if (parts.length >= 2) {
        const status = parts[0].slice(-1);
        const file = parts[1];
        fileChanges.push([file, status]);
      }
    });

    return fileChanges;
  }

  private async promptForConfirmation(
    commits: Array<{ hash: string; message: string }>,
  ): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\nCommits to be cherry-picked:");
    commits.forEach(({ hash, message }, index) => {
      console.log(`${index + 1}. ${hash.slice(0, 8)} - ${message}`);
    });

    return new Promise((resolve) => {
      rl.question(
        "\nProceed with cherry-picking these commits? (y/N) ",
        (answer) => {
          rl.close();
          resolve(answer.toLowerCase() === "y");
        },
      );
    });
  }

  public async cherryPick(): Promise<void> {
    const commits = this.getMatchingCommits();

    if (commits.length === 0) {
      console.log("No matching commits found.");
      return;
    }

    console.log(`Found ${commits.length} matching commits.`);

    const shouldProceed = await this.promptForConfirmation(commits);
    if (!shouldProceed) {
      console.log("Cherry-pick operation aborted.");
      return;
    }

    for (const { hash: commit, message } of commits) {
      try {
        console.log(`\nProcessing commit: ${commit}`);

        if (this.isCommitMerged(message)) {
          console.log(`Commit already merged, skipping: ${commit}`);
          continue;
        }

        const fileChanges = this.getFileChanges(commit);
        if (fileChanges.length === 0) {
          console.log(`No files changed in commit ${commit}. Skipping.`);
          continue;
        }

        console.log("Changed files:", fileChanges);

        for (const [file, status] of fileChanges) {
          console.log(`Processing file: ${file} (${status})`);
          const targetPath = path.join(this.targetRepoPath, file);

          if (status === "D") {
            if (fs.existsSync(targetPath)) {
              this.runCommand(`git rm "${file}"`, this.targetRepoPath);
              console.log(`Removed file: ${file}`);
            }
          } else {
            const targetDir = path.dirname(targetPath);
            fs.mkdirSync(targetDir, { recursive: true });

            const fileContent = this.runCommand(
              `git show ${commit}:${file}`,
              this.sourceRepoPath,
            );
            fs.writeFileSync(targetPath, fileContent);

            this.runCommand(`git add "${file}"`, this.targetRepoPath);
            console.log(`Added/Modified file: ${file}`);
          }
        }

        this.runCommand(
          `git commit -m "${message}" --no-verify`,
          this.targetRepoPath,
        );
        console.log(`Successfully processed commit: ${commit}`);
      } catch (error) {
        console.error(`Failed to process commit ${commit}:`, error);
        throw error;
      }
    }
  }
}

const parseArgs = () => {
  const args = process.argv.slice(2);
  const namedArgs = new Map<string, string>();

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];

    if (!key.startsWith("--")) {
      console.error(
        "Arguments must be named. Example: --source path --target path --regex pattern",
      );
      process.exit(1);
    }

    namedArgs.set(key.slice(2), value);
  }

  const source = namedArgs.get("source");
  const target = namedArgs.get("target");
  const regex = namedArgs.get("regex");

  if (!source || !target || !regex) {
    console.error(
      "Usage: ts-node script.ts --source <sourceRepoPath> --target <targetRepoPath> --regex <pattern>",
    );
    process.exit(1);
  }

  return {
    sourceRepoPath: source,
    targetRepoPath: target,
    regex: regex,
  };
};

const options = parseArgs();
const cherryPicker = new GitCherryPicker(options);
cherryPicker.cherryPick();
