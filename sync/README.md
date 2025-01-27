# Sync

Pulls in commits from `source` repo to `target` repo BUT ONLY if commit message in `target` matches passed `regex`.

This allows pulling in changes that are limited to "code managed by an upstream stack".

## Usage

```bash
# clone/pull upstream repo to local folder
git clone git@github.com:username/repo.git /path/repo-with-cherries

# build the cjs file
./dev/compile.sh

# cherry-pick all commits where commit message starts with [base]
node sync/cherry-picker.cjs --source /path/repo-with-cherries --target /path/repo-without-cherries --regex \[base\]
```

## Good to know

- Skips already picked cherries.
- Creates files in the target repo as needed.
- Deletes files in the target repo as needed.
- Sets commit author to EITHER the global git user OR the git user of the current (repo) folder.
- Source and target paths are not related and can be located anywhere.
- Regex can be anything that matches the commit message conventions in the upstream repo.
