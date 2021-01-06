import { MenuBase } from "./MenuBase.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
/**
 * The scene menu describing players statistics.
 *
 * @class MenuDescriptionState
 * @extends {Base}
 */
declare class MenuDescriptionState extends MenuBase {
    /**
     * the top window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowInformations: WindowBox;
    constructor();
    create(): void;
    createAllWindows(): void;
    createWindowTop(): void;
    createWindowTabs(): void;
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
export { MenuDescriptionState };
