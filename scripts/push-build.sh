#!/bin/bash

set -e

version="$1"
build_directory="./build/Scripts"
target_directory="../Game-Scripts-Build/Scripts"

if [ -z "$version" ]; then
  echo "Missing build version."
  exit 1
fi

node scripts/build.mjs

if [ ! -d "$build_directory" ]; then
  echo "Build output not found: $build_directory"
  exit 1
fi

rm -rf "$target_directory"
mkdir -p "$target_directory"
cp -r "$build_directory"/. "$target_directory"
cd ../Game-Scripts-Build
git add --all Scripts

if git diff --cached --quiet; then
  echo "No build changes to publish."
  exit 0
fi

git commit -m "Add $version build"
git push
echo "Build $version committed and pushed!"
