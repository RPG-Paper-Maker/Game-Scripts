import { Base } from "./Base.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
/** @class
 *  A scene in the menu for describing players statistics.
 *  @extends Scene.Base
 */
declare class MenuDescriptionState extends Base {
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowInformations: WindowBox;
    constructor();
    /**
     *  Synchronize informations with selected hero.
     */
    synchronize(): void;
    /**
     *  Update the scene
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
}
export { MenuDescriptionState };
