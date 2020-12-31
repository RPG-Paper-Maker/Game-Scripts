#!/bin/sh
rm -R ./Content/Datas/Scripts/System
npx tsc
cp -v ./src/definitions.d.ts ./Content/Datas/Script/System
./module-fix.sh
npm start