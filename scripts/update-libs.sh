#!/bin/bash

# Threejs
cp ./node_modules/three/build/three.module.min.js ./src/Libs/three.module.min.js
cp ./node_modules/three/build/three.core.min.js ./src/Libs/three.core.min.js
rm -rf ./src/Libs/examples
mkdir -p ./src/Libs/examples/jsm/loaders
mkdir -p ./src/Libs/examples/jsm/utils
cp ./node_modules/three/examples/jsm/loaders/GLTFLoader.js ./src/Libs/examples/jsm/loaders/
cp ./node_modules/three/examples/jsm/utils/BufferGeometryUtils.js ./src/Libs/examples/jsm/utils/
cp ./node_modules/three/examples/jsm/utils/SkeletonUtils.js ./src/Libs/examples/jsm/utils/

# Howler
cp ./node_modules/howler/dist/howler.core.min.js ./src/Libs/howler.core.min.js
cp ./node_modules/howler/dist/howler.min.js ./src/Libs/howler.min.js

echo "🚀 Libs Threejs + Howler copied to ./src/Libs!"