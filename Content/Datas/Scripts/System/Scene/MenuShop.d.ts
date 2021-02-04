import { Item, WindowBox, WindowChoices } from "../Core/index.js";
import { StructPositionChoice } from "./Menu.js";
import { MenuBase } from "./MenuBase.js";
/**
 * The scene handling and processing the shop system.
 * @class
 * @extends {MenuBase}
 */
declare class MenuShop extends MenuBase {
    windowBoxTop: WindowBox;
    windowChoicesBuySell: WindowChoices;
    windowChoicesItemsKind: WindowChoices;
    windowChoicesList: WindowChoices;
    windowBoxInformation: WindowBox;
    windowBoxEmpty: WindowBox;
    windowBoxUseItem: WindowBox;
    windowBoxOwned: WindowBox;
    windowBoxCurrencies: WindowBox;
    buyOnly: boolean;
    stock: Item[];
    step: number;
    positionChoice: StructPositionChoice[];
    constructor(buyOnly: boolean, stock: Item[]);
    initialize(buyOnly: boolean, stock: Item[]): void;
    /**
     *  Create the menu.
     */
    create(): void;
    /**
     *  Create all the windows.
     */
    createAllWindows(): void;
    /**
     *  Create the top window.
     */
    createWindowBoxTop(): void;
    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowChoicesBuySell(): void;
    /**
     *  Create the choice tab window for sorting items kind.
     */
    createWindowChoicesItemsKind(): void;
    /**
     *  Create the choice list.
     */
    createWindowChoicesList(): void;
    /**
     *  Create the information window.
     */
    createWindowBoxInformation(): void;
    /**
     *  Create the empty window.
     */
    createWindowBoxEmpty(): void;
    /**
     *  Create the user item window.
     */
    createWindowBoxUseItem(): void;
    /**
     *  Create the owned items window.
     */
    createWindowBoxOwned(): void;
    /**
     *  Create the currencies window.
     */
    createWindowBoxCurrencies(): void;
    /**
     *  Update items list.
     */
    updateItemsList(): void;
    /**
     *  Update informations to display.
     */
    synchronize(): void;
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
export { MenuShop };
