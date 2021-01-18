/** @class
 *  All the settings datas.
 *  @static
 */
declare class Settings {
    static kb: number[][][];
    static isDevMode: boolean;
    constructor();
    /**
     *  Read the settings file.
     *  @static
     */
    static read(): Promise<void>;
    /**
     *  Write the settings file.
     *  @static
     */
    static write(): void;
    /**
     *  Check if the app is in dev mode
     *  @static
     */
    static checkIsDevMode(): Promise<void>;
    /**
     *  Update Keyboard settings.
     *  @param {number} id
     *  @param {number[][]} sc -
     *  @static
     */
    static updateKeyboard(id: number, sc: number[][]): void;
}
export { Settings };
