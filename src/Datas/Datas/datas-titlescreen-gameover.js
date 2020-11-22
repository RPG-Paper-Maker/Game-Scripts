/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the titlescreen and gameover datas
 *   @property {boolean} isTitleBackgroundImage Indicate if the background is an
 *   image
 *   @property {number} titleBackgroundImageID The background image ID
 *   @property {number} titleBackgroundVideoID The background video ID
 *   @property {SystemPlaySong} titleMusic The title music
 *   @property {SystemTitleCommand[]} titleCommands The title commands
 *   @property {number[]} titleSettings The title settings IDs
 */
class DatasTitlescreenGameover {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to title screen and game over
     */
    async read() {
        let json = await RPM.parseFileJSON(RPM.FILE_TITLE_SCREEN_GAME_OVER);

        // Title screen
        this.isTitleBackgroundImage = RPM.defaultValue(json.itbi, true);
        this.titleBackgroundImageID = RPM.defaultValue(json.tb, 1);
        this.titleBackgroundVideoID = RPM.defaultValue(json.tbv, 1);
        this.titleMusic = new PlaySong(SongKind.Music, json.tm);
        this.titleCommands = RPM.readJSONSystemListByIndex(RPM.defaultValue(json
            .tc, []), SystemTitleCommand);
        let jsonList = json.ts;
        let l = jsonList.length;
        this.titleSettings = [];
        let obj;
        for (let i = 0, j = 0; i < l; i++) {
            obj = jsonList[i];
            if (obj.tso) {
                this.titleSettings[j] = obj.id;
                j++;
            }
        }
    }

    // -------------------------------------------------------
    /** Get the commands graphic names
     *   @returns {GraphicText[]}
     */
    getCommandsNames() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        let titleCommand, obj;
        for (let i = 0; i < l; i++) {
            titleCommand = this.titleCommands[i];
            obj = new GraphicText(titleCommand.name(), {align: Align.Center});
            obj.datas = titleCommand;
            list[i] = obj;
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the commands actions functions
     *   @returns {function[]}
     */
    getCommandsActions() {
        let l = this.titleCommands.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.titleCommands[i].getAction();
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the commands settings content graphic
     *   @returns {GraphicSetting[]}
     */
    getSettingsCommandsContent() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new GraphicSetting(this.titleSettings[i]);
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the settings commands actions functions
     *   @returns {function[]}
     */
    getSettingsCommandsActions() {
        let l = this.titleSettings.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = this.getSettingsCommandsAction(this.titleSettings[i]);
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the settings commands action function according to ID
     *   @param {number} id The action ID
     *   @returns {function}
     */
    getSettingsCommandsAction(id) {
        switch (id) {
            case TitleSettingKind.KeyboardAssigment:
                return DatasTitlescreenGameover.prototype.keyboardAssignment;
        }
    }

    // -------------------------------------------------------
    /** The setting action keyboard assignment
     *   @returns {boolean}
     */
    keyboardAssignment() {
        RPM.gameStack.push(new SceneKeyboardAssign());
        return true;
    }
}

