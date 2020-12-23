import { Base } from "./Base";
import { WindowBox, WindowChoices } from "../Core";
/** @class
 *  A scene in the menu for describing players equipments.
 *  @extends Scene.Base
 */
declare class MenuEquip extends Base {
    windowTop: WindowBox;
    windowChoicesTabs: WindowChoices;
    windowChoicesEquipment: WindowChoices;
    windowChoicesList: WindowChoices;
    windowInformations: WindowBox;
    selectedEquipment: number;
    list: number[];
    bonus: number[];
    constructor();
    /**
     *  Update tab.
     */
    updateForTab(): void;
    /**
     *  Update the equipment list
     */
    updateEquipmentList(): void;
    /**
     *  Update the informations to display for equipment stats.
     */
    updateInformations(): void;
    /**
     *  Move tab according to key.
     *  @param {number} key The key ID
     */
    moveTabKey(key: number): void;
    /**
     *  Remove the equipment of the character.
     */
    remove(): void;
    /**
     *  Equip the selected equipment.
     */
    equip(): void;
    /**
     *  Update the stats.
     */
    updateStats(): void;
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
}
export { MenuEquip };
