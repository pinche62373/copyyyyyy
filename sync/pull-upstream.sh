#!/bin/bash
#
# Update from upstream framework repository using sparse-checkout.
#
# Pulls latest changes from upstream while excluding the patterns defined
# in .gitignore-upstream. Requires prior setup via init-upstream.sh.

exclusions=$(cat ./sync/.gitignore-upstream | sed 's/^/!/')

git sparse-checkout set '/*' $exclusions

git pull upstream main