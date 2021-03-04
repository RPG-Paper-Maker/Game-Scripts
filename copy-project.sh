#!/bin/sh
path="/home/wano/Documents/RPG Paper Maker Games/project-without-name"
cp -r ./Content/Datas/Scripts ./Scripts-temp-copy
rm -R ./Content/Datas
cp -r "${path}/resources/app/Content/Datas" "./Content/Datas"
rm -R ./Content/Datas/Scripts
cp -r ./Scripts-temp-copy ./Content/Datas/Scripts
rm -R ./Scripts-temp-copy
rm -R ./Content/Images
rm -R ./Content/Shapes
rm -R ./Content/Songs
rm -R ./Content/Videos
rm -R ./Content/Fonts
rm -R ./Content/Styles
cp -r "${path}/resources/app/Content/Images" "./Content/Images"
cp -r "${path}/resources/app/Content/Shapes" "./Content/Shapes"
cp -r "${path}/resources/app/Content/Songs" "./Content/Songs"
cp -r "${path}/resources/app/Content/Videos" "./Content/Videos"
cp -r "${path}/resources/app/Content/Fonts" "./Content/Fonts"
cp -r "${path}/resources/app/Content/Styles" "./Content/Styles"
rm -R ./Content/Datas/Scripts/Plugins
cp -r "${path}/resources/app/Content/Datas/Scripts/Plugins" "./Content/Datas/Scripts/Plugins"