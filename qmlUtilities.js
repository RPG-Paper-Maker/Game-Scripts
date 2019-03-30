/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

Qt.include("qrc:/three.js")

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
