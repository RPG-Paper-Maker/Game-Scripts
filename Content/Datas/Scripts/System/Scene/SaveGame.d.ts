import { SaveLoadGame } from "./SaveLoadGame.js";
/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
declare class SaveGame extends SaveLoadGame {
    constructor();
    /**
     *  Load async stuff.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Save current game in the selected slot.
     */
    save(): Promise<void>;
    /**
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options?: {
        key?: number;
        x?: number;
        y?: number;
    }): void;
    /**
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
}
export { SaveGame };
