# CI Authentication for Upstream Sync

## The Problem

Our `npm prepare` script fails in CI environments when trying to access private upstream repositories. This happens because CI runners don't have SSH keys configured and can't authenticate with GitHub using standard methods.

## Creating a GitHub Personal Access Token (PAT)

1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
2. Select "Tokens (classic)"
3. Click "Generate new token (classic)"
4. Set permissions:
   - `repo` scope for private repository access
   - `workflow` scope if using GitHub Actions
5. Set an expiration date
6. Generate and copy the token immediately

## Adding Token as Repository Secret

1. Navigate to your downstream repository settings
2. Go to Settings > Secrets and Variables > Actions
3. Click "New repository secret"
4. Name: `PAT_TOKEN`
5. Value: Paste your PAT token
6. Click "Add secret"

## Configuring GitHub Actions

Add the token to your workflow file:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.PAT_TOKEN }}
```

## Our Implementation

We've created a dedicated `detect-ci.ts` module that handles all CI-related logic. This module:

- Provides a clean API for CI environment detection
- Centralizes token management across different CI platforms
- Exports type-safe interfaces for CI environment data
- Integrates seamlessly with our initialization scripts

Example usage:

```typescript
import { detectCI } from "./detect-ci";

const ciEnv = detectCI();
if (ciEnv.isCI && ciEnv.accessToken) {
  console.log(`Running in ${ciEnv.name} with authentication`);
}
```

### Environment Detection

- Automatically detects CI environments
- Handles multiple CI platforms (GitHub Actions, GitLab CI, Azure DevOps)
- Transparent operation in both CI and local environments

### Token Security

- Tokens never appear in logs
- Secure storage in CI environment variables
- Automatic token rotation support

### SSH to HTTPS Conversion

```typescript
// Before: git@github.com:org/repo.git
// After:  https://${token}@github.com/org/repo.git
```

### Multi-CI Platform Support

- GitHub Actions: `GITHUB_TOKEN` or `PAT_TOKEN`
- GitLab CI: `CI_JOB_TOKEN` or `PAT_TOKEN`
- Azure DevOps: `SYSTEM_ACCESSTOKEN`
- Jenkins: `JENKINS_TOKEN`
- CircleCI: `CIRCLE_TOKEN`

### Remote URL Management

- Automatic URL updates for existing remotes
- Handles both new and existing configurations
- Maintains SSH URLs in local development

## Troubleshooting

### Token Issues

- Verify token has correct repository permissions
- Check token hasn't expired
- Ensure token is correctly set in repository secrets

### URL Conversion

- Check remote URL format: `git remote -v`
- Verify HTTPS conversion: temporarily echo URL (remove token)
- Ensure GitHub organization/repository path is correct

### Verification

Check token usage:

```bash
# Should succeed in CI, fail locally
git fetch upstream

# View remote without exposing token
git remote -v | sed 's/https:\/\/.*@/https:\/\/**TOKEN**@/'
```
