#!/bin/bash

# Get the latest commit message from the current repo
last_msg=$(git log -1 --pretty=%B)

rm -rf ../Game-Scripts-Build/Scripts
cp -r ./build/Scripts ../Game-Scripts-Build/Scripts
cd ../Game-Scripts-Build
git add *
git commit -m "$last_msg"
git push
echo "🚀 Build $last_msg committed and pushed!"