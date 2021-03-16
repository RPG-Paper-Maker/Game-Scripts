/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Graphic, Datas, Manager, Scene } from "../index.js";
import { IO, Paths, Utils, Enum } from "../Common/index.js";
var SongKind = Enum.SongKind;
var Align = Enum.Align;
var TitleSettingKind = Enum.TitleSettingKind;
/** @class
 *  All the titlescreen and gameover datas.
 *  @static
 */
class TitlescreenGameover {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to title screen and game over.
     *  @static
     *  @async
     */
    static async read() {
        let json = await IO.parseFileJSON(Paths.FILE_TITLE_SCREEN_GAME_OVER);
        // Title screen
        this.isTitleBackgroundImage = Utils.defaultValue(json.itbi, true);
        this.titleBackgroundImageID = Utils.defaultValue(json.tb, 1);
        this.titleBackgroundVideoID = Utils.defaultValue(json.tbv, 1);
        this.titleMusic = new System.PlaySong(SongKind.Music, json.tm);
        this.titleCommands = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.tc, []),
            listIndexes: this.titleCommands, cons: System.TitleCommand });
        let jsonList = json.ts;
        let l = jsonList.length;
        this.titleSettings = [];
        let obj;
        for (let i = 0, j = 0; i < l; i++) {
            obj = jsonList[i];
            if (Utils.defaultValue(obj.checked, true)) {
                this.titleSettings[j] = obj.id;
                j++;
            }
        }
    }
    /**
     *  Get the commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getCommandsNames() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        let titleCommand, obj;
        for (let i = 0; i < l; i++) {
            titleCommand = this.titleCommands[i];
            obj = new Graphic.Text(titleCommand.name(), { align: Align.Center });
            obj.datas = titleCommand;
            list[i] = obj;
        }
        return list;
    }
    /**
     *  Get the commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getCommandsActions() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.titleCommands[i].getAction();
        }
        return list;
    }
    /**
     *  Get the commands settings content graphic.
     *  @static
     *  @returns {Graphic.Setting[]}
     */
    static getSettingsCommandsContent() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new Graphic.Setting(this.titleSettings[i]);
        }
        return list;
    }
    /**
     *  Get the settings commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getSettingsCommandsActions() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.getSettingsCommandsAction(this.titleSettings[i]);
        }
        return list;
    }
    /**
     *  Get the settings commands action function according to ID.
     *  @static
     *  @param {number} id - The action ID
     *  @returns {function}
     */
    static getSettingsCommandsAction(id) {
        switch (id) {
            case TitleSettingKind.KeyboardAssigment:
                return Datas.TitlescreenGameover.keyboardAssignment;
            case TitleSettingKind.Language:
                return Datas.TitlescreenGameover.language;
        }
    }
    /**
     *  The setting action keyboard assignment.
     *  @static
     *  @returns {boolean}
     */
    static keyboardAssignment() {
        Manager.Stack.push(new Scene.KeyboardAssign());
        return true;
    }
    /**
     *  The setting action language.
     *  @static
     *  @returns {boolean}
     */
    static language() {
        Manager.Stack.push(new Scene.ChangeLanguage());
        return true;
    }
}
export { TitlescreenGameover };
