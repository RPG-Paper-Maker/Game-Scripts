/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS Settings
//
// -------------------------------------------------------

/** @class
*   All settings.
*/
function Settings() {

}

// -------------------------------------------------------

/** Update Keyboard settings.
*/
Settings.prototype.updateKeyboard = function(id, sc) {
    this.kb[id] = sc;
    this.write();
}

// -------------------------------------------------------

/** Read the settings file.
*/
Settings.prototype.read = async function() {
    let json = await RPM.parseFileJSON(RPM.FILE_SETTINGS);

    jsonObjs = json["" + TitleSettingKind.KeyboardAssigment];
    this.kb = {};
    for (id in jsonObjs) {
        this.kb[id] = jsonObjs[id];
    }
}

// -------------------------------------------------------

/** Write the settings file.
*/
Settings.prototype.write = function() {
    var json, jsonObjs, id;

    json = {};
    jsonObjs = {};
    for (id in this.kb) {
        jsonObjs["" + id] = this.kb[id];
    }
    json["" + TitleSettingKind.KeyboardAssigment] = jsonObjs;
    RPM.saveFile(RPM.FILE_SETTINGS, json);
}
