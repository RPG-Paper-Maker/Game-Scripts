#!/bin/bash
path="./Content/Datas/Scripts/System"
if [[ -d "${path}" ]]
then
	rm -R "${path}"
fi
npx tsc
cp ./src/Definitions.d.ts ./Content/Datas/Scripts/System/Definitions.d.ts
./module-fix.sh