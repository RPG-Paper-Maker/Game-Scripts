/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Platform, Utils, Enum } from "../Common";
import TitleSettingKind = Enum.TitleSettingKind;

interface StructKeyboards {
    [key: string]: number;
} 

/** @class
 *  All settings
 *  @property {StructKeyboards} kb The keyboard assignments according to ID
 */
class Settings {

    public static kb: StructKeyboards;

    constructor() {
        throw new Error("This is a static class!");
    }

    /** Read the settings file.
     */
    static async read()
    {
        let json = await IO.parseFileJSON(Platform.ROOT_DIRECTORY + Paths
            .FILE_SETTINGS);
        Settings.kb = {};
        let jsonObjs = json[Utils.numToString(TitleSettingKind.KeyboardAssigment)];
        for (let id in jsonObjs)
        {
            Settings.kb[id] = jsonObjs[id];
        }
    }

    /** Write the settings file.
     */
    static write()
    {
        let json = {};
        let jsonObjs = {};
        for (let id in Settings.kb) {
            jsonObjs[id] = Settings.kb[id];
        }
        json[Utils.numToString(TitleSettingKind.KeyboardAssigment)] = jsonObjs;
        IO.saveFile(Platform.ROOT_DIRECTORY + Paths.FILE_SETTINGS, json);
    }

    /** Update Keyboard settings.
     */
    static updateKeyboard(id: number, sc: number)
    {
        Settings.kb[id] = sc;
        Settings.write();
    }
}

export { StructKeyboards, Settings }