#!/bin/bash

# alias for `git pull origin main` so that is uses the sparse checkout script.
git config core.hooksPath .githooks
git config alias.pull '!if [ "$1" = "origin" ] && [ "$2" = "main" ]; then bash ./sync/update-script.sh; else git pull "$@"; fi'
