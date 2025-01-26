#!/bin/bash
#
# Initialize sparse-checkout configuration for upstream syncing.
# 
# Sets up remote tracking and sparse-checkout using exclusion patterns from .gitignore-upstream.
# Run this once during initial repository setup. Use update-upstream.sh for subsequent syncs.
set -e

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Copy gitignore-upstream to temp location
cp ./sync/.gitignore-upstream /tmp/gitignore-upstream.temp

echo "Initializing upstream sync configuration..."

echo "1. Setting up upstream remote..."
if ! git remote | grep -q "upstream"; then
    git remote add upstream git@github.com:pinche62373/tzdb.git
fi

echo "2. Initializing sparse-checkout..."
git sparse-checkout init --no-cone

echo "3. Configuring inclusion patterns..."
echo "/*" > .git/info/sparse-checkout

# Use the temp file for patterns
while IFS= read -r pattern; do
    [[ $pattern =~ ^#.*$ || -z $pattern ]] && continue
    echo ":(upstream)$pattern" >> .git/info/sparse-checkout
done < /tmp/gitignore-upstream.temp

git fetch upstream
git sparse-checkout reapply

# Clean up
rm /tmp/gitignore-upstream.temp

echo "✓ Initialization complete - Repository is now in sparse-checkout mode"