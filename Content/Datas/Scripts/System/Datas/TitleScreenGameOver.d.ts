import { System, Graphic } from "../index.js";
/** @class
 *  All the titlescreen and gameover datas.
 *  @static
 */
declare class TitlescreenGameover {
    static isTitleBackgroundImage: boolean;
    static titleBackgroundImageID: number;
    static titleBackgroundVideoID: number;
    static titleMusic: System.PlaySong;
    static titleCommands: System.TitleCommand[];
    static titleSettings: number[];
    constructor();
    /**
     *  Read the JSON file associated to title screen and game over.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the commands graphic names.
     *  @static
     *  @returns {Graphic.Text[]}
     */
    static getCommandsNames(): Graphic.Text[];
    /**
     *  Get the commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getCommandsActions(): Function[];
    /**
     *  Get the commands settings content graphic.
     *  @static
     *  @returns {Graphic.Setting[]}
     */
    static getSettingsCommandsContent(): Graphic.Setting[];
    /**
     *  Get the settings commands actions functions.
     *  @static
     *  @returns {function[]}
     */
    static getSettingsCommandsActions(): Function[];
    /**
     *  Get the settings commands action function according to ID.
     *  @static
     *  @param {number} id - The action ID
     *  @returns {function}
     */
    static getSettingsCommandsAction(id: number): Function;
    /**
     *  The setting action keyboard assignment.
     *  @static
     *  @returns {boolean}
     */
    static keyboardAssignment(): boolean;
    /**
     *  The setting action language.
     *  @static
     *  @returns {boolean}
     */
    static language(): boolean;
}
export { TitlescreenGameover };
