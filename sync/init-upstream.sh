#!/bin/bash
#
# Initialize sparse-checkout configuration for upstream syncing.
# 
# Sets up remote tracking and sparse-checkout using exclusion patterns from .gitignore-upstream.
# Run this once during initial repository setup. Use update-upstream.sh for subsequent syncs.

git remote add upstream git@github.com:username/repo-name.git

git sparse-checkout init --cone

./sync/pull-upstream.sh  # Use shared exclusion list from .gitignore-upstream
