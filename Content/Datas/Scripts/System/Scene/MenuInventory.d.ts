import { Base } from "./Base.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
import { StructPositionChoice } from "./index.js";
/** @class
 *  A scene in the menu for describing inventory.
 *  @extends Scene.Base
 */
declare class MenuInventory extends Base {
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowChoicesList: WindowChoices;
    windowInformations: WindowBox;
    windowEmpty: WindowBox;
    windowBoxUseItem: WindowBox;
    positionChoice: StructPositionChoice[];
    substep: number;
    constructor();
    /**
     *  Update informations to display.
     */
    synchronize(): void;
    /**
     *  Update tab.
     */
    updateForTab(): void;
    /**
     *  Use the current item.
     */
    useItem(): void;
    /**
     *  Move tab according to key.
     *  @param {number} key - The key ID
     */
    moveTabKey(key: number): void;
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
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
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
export { MenuInventory };
