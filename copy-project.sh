#!/bin/bash
# Change path value to the project path you want to copy
path="/home/wano/Documents/RPG Paper Maker Games/project-without-name"
# --------------------------------------------------------


delete_folder () {
	if [[ -d "$1" ]]
	then
		rm -R "$1"
	fi
}

if [[ -d "${path}" ]]
then
	if [[ ! -d "./Content" ]]
	then
		mkdir Content
		mkdir Content/Datas
		mkdir Content/Datas/Scripts
	fi
	cp -r ./Content/Datas/Scripts ./Scripts-temp-copy
	delete_folder "./Content/Datas"
	cp -r "${path}/resources/app/Content/Datas" "./Content/Datas"
	delete_folder "./Content/Datas/Scripts"
	cp -r ./Scripts-temp-copy ./Content/Datas/Scripts
	delete_folder "./Scripts-temp-copy"
	delete_folder "./Content/Images"
	delete_folder "./Content/Shapes"
	delete_folder "./Content/Songs"
	delete_folder "./Content/Videos"
	delete_folder "./Content/Fonts"
	delete_folder "./Content/Styles"
	cp -r "${path}/resources/app/Content/Images" "./Content/Images"
	cp -r "${path}/resources/app/Content/Shapes" "./Content/Shapes"
	cp -r "${path}/resources/app/Content/Songs" "./Content/Songs"
	cp -r "${path}/resources/app/Content/Videos" "./Content/Videos"
	cp -r "${path}/resources/app/Content/Fonts" "./Content/Fonts"
	cp -r "${path}/resources/app/Content/Styles" "./Content/Styles"
	delete_folder "./Content/Datas/Scripts/Plugins"
	cp -r "${path}/resources/app/Content/Datas/Scripts/Plugins" "./Content/Datas/Scripts/Plugins"
	delete_folder "./Content/Datas/Scripts/Libs"
	cp -r "${path}/resources/app/Content/Datas/Scripts/Libs" "./Content/Datas/Scripts/Libs"
	delete_folder "./Content/Datas/Scripts/Shaders"
	cp -r "${path}/resources/app/Content/Datas/Scripts/Shaders" "./Content/Datas/Scripts/Shaders"
else
	echo "The project ${path} doesn't exists"
fi