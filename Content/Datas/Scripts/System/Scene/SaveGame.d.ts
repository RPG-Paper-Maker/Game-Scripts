import { SaveLoadGame } from "./SaveLoadGame";
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
     *  Handle scene key pressed.
     *   @param {number} key The key ID
     */
    onKeyPressed(key: number): void;
}
export { SaveGame };
