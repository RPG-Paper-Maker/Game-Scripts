import { Base } from "./Base";
import { WindowChoices, WindowBox } from "../Core";
interface StructPositionChoice {
    index: number;
    offset: number;
}
/** @class
 *  A scene for the main menu.
 *  @extends Scene.Base
 */
declare class Menu extends Base {
    static SLOTS_TO_DISPLAY: number;
    selectedOrder: number;
    windowChoicesCommands: WindowChoices;
    windowChoicesTeam: WindowChoices;
    windowTimeCurrencies: WindowBox;
    constructor();
    /**
     *  Callback function for opening inventory.
     */
    openInventory(): boolean;
    /**
     *  Callback function for opening skills menu.
     */
    openSkills(): boolean;
    /**
     *  Callback function for opening equipment menu.
     */
    openEquip(): boolean;
    /**
     *  Callback function for opening player description state menu.
     */
    openState(): boolean;
    /**
     *  Callback function for reordering heroes.
     */
    openOrder(): boolean;
    /**
     *  Callback function for opening save menu.
     */
    openSave(): boolean;
    /**
     *  Callback function for quiting the game.
     */
    exit(): boolean;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Draw the HUD scene.
     */
    drawHUD(): void;
    /**
     *  Close the scene.
     */
    close(): void;
}
export { StructPositionChoice, Menu };
