#!/bin/bash
set -e

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Fetch upstream changes
git fetch upstream

# Store current state
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_SHA=$(git rev-parse HEAD)

# Get list of changed files
changed_files=$(git diff --name-status upstream/main | awk '{print $2}')

# Read ignore patterns
mapfile -t ignore_patterns < <(grep -v '^#' ./sync/.gitignore-upstream | sed '/^$/d')

# Filter out ignored files
filtered_files=()
for file in $changed_files; do
    should_include=true
    for pattern in "${ignore_patterns[@]}"; do
        if [[ "$file" =~ ^${pattern//\*/.*/}$ ]]; then
            should_include=false
            break
        fi
    done
    if $should_include; then
        filtered_files+=("$file")
    fi
done

if [ ${#filtered_files[@]} -eq 0 ]; then
    echo "No files to update after applying filters"
    exit 0
fi

echo "Files that will be updated:"
printf '%s\n' "${filtered_files[@]}"

read -p "Proceed with update? (y/n) " answer
if [[ $answer =~ ^[Yy]$ ]]; then
    # Create temp branch from upstream
    git checkout -b temp-upstream upstream/main
    
    # Get back to original branch
    git checkout $CURRENT_BRANCH
    
    # Copy selected files from temp branch
    for file in "${filtered_files[@]}"; do
        git checkout temp-upstream -- "$file"
    done
    
    # Clean up
    git branch -D temp-upstream
    
    echo "✓ Sync complete"
else
    echo "Update cancelled"
    exit 1
fi