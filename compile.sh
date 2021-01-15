#!/bin/sh
rm -R ./Content/Datas/Scripts/System
npx tsc
cp ./src/Definitions.d.ts ./Content/Datas/Scripts/System/Definitions.d.ts
./module-fix.sh