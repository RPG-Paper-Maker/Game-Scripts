/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All settings
*   @property {Object} kb The keyboard assignments according to ID
*/
class Settings
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the settings file
    */
    async read()
    {
        let json = await RPM.parseFileJSON(RPM.FILE_SETTINGS);
        this.kb = {};
        let jsonObjs = json[RPM.numToString(TitleSettingKind.KeyboardAssigment)];
        for (let id in jsonObjs)
        {
            this.kb[id] = jsonObjs[id];
        }
    }

    // -------------------------------------------------------
    /** Write the settings file
    */
    write()
    {
        let json = {};
        let jsonObjs = {};
        for (let id in this.kb) {
            jsonObjs[RPM.numToString(id)] = this.kb[id];
        }
        json[RPM.numToString(TitleSettingKind.KeyboardAssigment)] = jsonObjs;
        RPM.saveFile(RPM.FILE_SETTINGS, json);
    }

    // -------------------------------------------------------
    /** Update Keyboard settings
    */
    updateKeyboard(id, sc)
    {
        this.kb[id] = sc;
        this.write();
    }
}