#!/bin/bash

# Threejs
cp ./node_modules/three/build/three.module.min.js ./src/Libs/three.module.min.js
cp ./node_modules/three/build/three.core.min.js ./src/Libs/three.core.min.js
rm -rf ./src/Libs/examples
cp -R ./node_modules/three/examples ./src/Libs

# Howler
cp ./node_modules/howler/dist/howler.core.min.js ./src/Libs/howler.core.min.js
cp ./node_modules/howler/dist/howler.min.js ./src/Libs/howler.min.js

echo "🚀 Libs Threejs + Howler copied to ./src/Libs!"