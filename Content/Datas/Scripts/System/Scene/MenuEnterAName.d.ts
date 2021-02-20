import { Frame, Picture2D, Player, WindowBox, WindowChoices } from "../Core/index.js";
import { MenuBase } from "./MenuBase.js";
/**
 * The scene handling and processing the enter a name menu
 * @class
 * @extends {MenuBase}
 */
declare class MenuEnterAName extends MenuBase {
    static MAX_ROWS: number;
    static MAX_COLUMNS: number;
    windowChoicesTop: WindowChoices;
    windowBoxMain: WindowBox;
    windowChoicesMain: WindowChoices[];
    windowBoxOk: WindowBox;
    pictureFaceset: Picture2D;
    heroInstanceID: number;
    maxCharacters: number;
    rows: number;
    columns: number;
    displayRows: number;
    displayColumns: number;
    selectedhero: Player;
    frameUnderscore: Frame;
    currentRow: number;
    offsetRow: number;
    currentCharacterPosition: number;
    constructor(heroInstanceID: number, maxCharacters: number);
    initialize(heroInstanceID: number, maxCharacters: number): void;
    /**
     *  Create the menu.
     */
    create(): void;
    /**
     *  Create all the windows.
     */
    createAllWindows(): void;
    /**
     *  Initialize all the datas.
     */
    initializeDatas(): void;
    /**
     *  Create all the pictures.
     */
    createPictures(): void;
    /**
     *  Create the top window.
     */
    createWindowBoxTop(): void;
    /**
     *  Create main window box.
     */
    createWindowBoxMain(): void;
    /**
     *  Create the top window.
     */
    createWindowChoicesMain(): void;
    /**
     *  Create the ok window box.
     */
    createWindowBoxOk(): void;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the HUD scene.
     */
    drawHUD(): void;
}
export { MenuEnterAName };
