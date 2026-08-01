#!/bin/bash

version="$1"

rm -rf ../Game-Scripts-Build/Scripts
cp -r ./build/Scripts ../Game-Scripts-Build/Scripts
cd ../Game-Scripts-Build
git add *
git commit -m "Add $version build"
git push
echo "🚀 Build $version committed and pushed!"
