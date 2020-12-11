#!/bin/sh
rm -R ./Content/Datas/Scripts/System
npx tsc
./module-fix.sh
npm start