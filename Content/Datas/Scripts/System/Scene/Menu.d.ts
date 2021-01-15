import { WindowChoices, WindowBox } from "../Core/index.js";
import { MenuBase, MenuCommands } from "./MenuBase.js";
interface StructPositionChoice {
    index: number;
    offset: number;
}
/**
 * The class who handle the scene menu in game.
 *
 * @class Menu
 * @extends {MenuBase}
 */
declare class Menu extends MenuBase {
    /**
     * The array containing the menu commands.
     * @todo in 1.7 and above the system will be changed for a dynamic support.
     *
     * @static
     * @type {MenuCommands[]}
     * @memberof Menu
     */
    static menuCommands: MenuCommands[];
    selectedOrder: number;
    windowChoicesCommands: WindowChoices;
    windowChoicesTeam: WindowChoices;
    windowTimeCurrencies: WindowBox;
    constructor();
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    create(): void;
    /**
     * Create all the windows in the scene.
     *
     * @memberof Menu
     */
    createAllWindows(): void;
    /**
     * Create the commands window
     *
     * @memberof Menu
     */
    createCommandWindow(): void;
    /**
     * Create the team order window.
     *
     * @memberof Menu
     */
    createTeamOrderWindow(): void;
    /**
     * Create the time and currencies window.
     *
     * @memberof Menu
     */
    createWindowTimeCurrencies(): void;
    /**
     * Callback function for opening the inventory.
     *
     * @return {*}
     * @memberof Menu
     */
    openInventory(): boolean;
    /**
     * Callback function for opening the skills menu.
     *
     * @return {*}
     * @memberof Menu
     */
    openSkills(): boolean;
    /**
     * callback function for opening the equipment menu.
     *
     * @return {*}
     * @memberof Menu
     */
    openEquip(): boolean;
    /**
     * Callback function for opening the player description state menu.
     *
     * @return {*}
     * @memberof Menu
     */
    openState(): boolean;
    /**
     *  Callback function for reordering heroes.
     *
     * @returns {*}
     * @memberof Menu
     */
    openOrder(): boolean;
    /**
     *  Callback function for opening the save menu.
     *
     * @returns {*}
     * @memberof Menu
     */
    openSave(): boolean;
    /**
     *  Callback function for quitting the game.
     *
     * @returns {*}
     * @memberof Menu
     */
    exit(): boolean;
    /**
     *  Update the scene.
     *
     * @memberof Menu
     */
    update(): void;
    /**
     * return whether the key action is quitting to map and in window command.
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Menu
     */
    isKeyQuittingToMap(key: number): boolean;
    /**
     * return whether the key action is quitting the order screen.
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Menu
     */
    isKeyQuittingReorder(key: number): boolean;
    /**
     * function called when quitting the menu.
     *
     * @memberof Menu
     */
    onQuitMenu(): void;
    /**
     * function called when quitting the team order selection.
     *
     * @memberof Menu
     */
    onTeamUnselect(): void;
    /**
     * swap two hero index in the active team.
     *
     * @param {number} id1
     * @param {number} id2
     * @memberof Menu
     */
    swapHeroOrder(id1: number, id2: number): void;
    /**
     * function executed when you choose the order command.
     *
     * @memberof Menu
     */
    onTeamSelect(): void;
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     *
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    drawHUD(): void;
    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    close(): void;
}
export { StructPositionChoice, Menu };
