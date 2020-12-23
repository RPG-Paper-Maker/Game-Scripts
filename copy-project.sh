#!/bin/sh
path="/home/wano/Documents/RPG Paper Maker Games/project-without-name"
cp -r ./Content/Datas/Scripts ./Scripts-temp-copy
rm -R ./Content/Datas
cp -r "${path}/resources/app/Content/Datas" "./Content/Datas"
rm -R ./Content/Datas/Scripts
cp -r ./Scripts-temp-copy ./Content/Datas/Scripts
rm -R ./Scripts-temp-copy