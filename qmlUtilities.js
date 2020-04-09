/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

Qt.include("qrc:/three.js")
Qt.include("qrc:/Loaders/objLoader.js")

/** The list of all the keys that are currently pressed (for multi-key
*   handling).
*   @type {string}
*   @default "file:"
*   @constant */
var $ROOT_DIRECTORY = "file:";

var $ROOT_DIRECTORY_LOCAL = "../../../../../";

/** Indicates if this application is a desktop one.
*   @type {boolean}
*   @default true
*   @constant */
var $DESKTOP = true;

/**
    Close the window.
*/
function quit(){
    Qt.quit();
}

Qt.include("file:Content/Datas/Scripts/System/desktop/includes.js")
Qt.include("file:Content/Datas/Scripts/Plugins/desktop/includes.js")
