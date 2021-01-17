/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Utils, Enum } from "../Common";
import TitleSettingKind = Enum.TitleSettingKind;

/** @class
 *  All the settings datas.
 *  @static
 */
class Settings {

    public static kb: number[][][];

    public static isDevMode: boolean;

    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the settings file.
     *  @static
     */
    static async read() {
        this.isDevMode = await IO.fileExists(Paths.FILE_TREE_MAP);
        console.log(this.isDevMode);

        // Settings
        let json = await IO.parseFileJSON(Paths.FILE_SETTINGS);
        this.kb = [];
        let jsonObjs = json[Utils.numToString(TitleSettingKind.KeyboardAssigment)];
        for (let id in jsonObjs) {
            this.kb[id] = jsonObjs[id];
        }
    }

    /** 
     *  Write the settings file.
     *  @static
     */
    static write() {
        let json = {};
        let jsonObjs = {};
        for (let id in this.kb) {
            jsonObjs[id] = this.kb[id];
        }
        json[Utils.numToString(TitleSettingKind.KeyboardAssigment)] = jsonObjs;
        IO.saveFile(Paths.FILE_SETTINGS, json);
    }

    /** 
     *  Update Keyboard settings.
     *  @param {number} id
     *  @param {number[][]} sc - 
     *  @static
     */
    static updateKeyboard(id: number, sc: number[][]) {
        this.kb[id] = sc;
        this.write();
    }
}

export { Settings }