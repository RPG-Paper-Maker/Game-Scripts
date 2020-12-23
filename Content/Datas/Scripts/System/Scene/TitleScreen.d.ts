import { Base } from "./Base.js";
import { Picture2D, WindowChoices } from "../Core/index.js";
/** @class
 *  A scene for the title screen.
 *  @extends Scene.Base
 */
declare class TitleScreen extends Base {
    pictureBackground: Picture2D;
    windowChoicesCommands: WindowChoices;
    constructor();
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number): void;
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
}
export { TitleScreen };
