# .sync/utils/explainers.md

This file contains all explainer texts used throughout the sync system. Each section starts
with an h2 header (##) containing the explainer key, followed by the explainer text.

Each h2 header text is used directly as the key when calling getExplainer().

## git-configure-complete

Git configuration complete:

- Use 'git sync-from-upstream' to pull from upstream while respecting exclusions
- Use 'git sync-to-origin' to commit and push upstream sync changes

## protect-upstream-violation

These centrally managed files can ONLY be modified in the upstream repository
[https://github.com/pinche62373/tzdb](https://github.com/pinche62373/tzdb) UNLESS
explicitly allowed in '.sync/.allowed-upstream-overrides'.

If you really need to update these files, first submit a PR in the upstream repository, then pull merged
changes into your downstream repository by using the 'git sync-from-upstream' command.

## sync-from-upstream-complete

Now run 'git sync-to-origin' to push these updates to your repository.

Feel free to review files changes first but DO NOT ADD OR MODIFY FILES.

To abort, simply run 'git reset --hard origin/main'.
