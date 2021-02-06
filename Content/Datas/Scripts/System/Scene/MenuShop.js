/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Graphic, Manager, Scene } from "../index.js";
import { Constants, Enum, ScreenResolution } from "../Common/index.js";
import { Game, Rectangle, WindowBox, WindowChoices } from "../Core/index.js";
import { SpinBox } from "../Core/SpinBox.js";
import { MenuBase } from "./MenuBase.js";
/**
 * The scene handling and processing the shop system.
 * @class
 * @extends {MenuBase}
 */
class MenuShop extends MenuBase {
    constructor(shopID, buyOnly, stock) {
        super(shopID, buyOnly, stock);
    }
    initialize(shopID, buyOnly, stock) {
        this.shopID = shopID;
        this.buyOnly = buyOnly;
        this.stock = stock;
        this.step = 0;
    }
    /**
     *  Create the menu.
     */
    create() {
        super.create();
        this.createAllWindows();
        this.updateItemsList();
        this.synchronize();
    }
    /**
     *  Create all the windows.
     */
    createAllWindows() {
        this.createWindowBoxTop();
        this.createWindowChoicesBuySell();
        this.createWindowChoicesItemsKind();
        this.createWindowChoicesList();
        this.createWindowBoxInformation();
        this.createWindowBoxEmpty();
        this.createWindowBoxUseItem();
        this.createWindowBoxOwned();
        this.createWindowBoxCurrencies();
        this.createSpinBox();
    }
    /**
     *  Create the top window.
     */
    createWindowBoxTop() {
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE, WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const graphic = new Graphic.Text("Shop", { align: Enum.Align.Center });
        const options = {
            content: graphic
        };
        this.windowBoxTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
    }
    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowChoicesBuySell() {
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants.HUGE_SPACE -
            (WindowBox.SMALL_SLOT_WIDTH * 2), Constants.HUGE_SPACE, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("Buy", { align: Enum.Align.Center })
        ];
        if (!this.buyOnly) {
            list.push(new Graphic.Text("Sell", { align: Enum.Align.Center }));
        }
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: WindowBox.NONE_PADDING
        };
        this.windowChoicesBuySell = new WindowChoices(rect.x, rect.y, rect.width, rect.height, list, options);
    }
    /**
     *  Create the choice tab window for sorting items kind.
     */
    createWindowChoicesItemsKind() {
        const rect = new Rectangle(Constants.MEDIUM_SPACE, Constants.HUGE_SPACE +
            WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("All", { align: Enum.Align.Center }),
            new Graphic.Text("Consumables", { align: Enum.Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(1), { align: Enum.Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(2), { align: Enum.Align.Center }),
            new Graphic.Text("Weapons", { align: Enum.Align.Center }),
            new Graphic.Text("Armors", { align: Enum.Align.Center })
        ];
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesItemsKind = new WindowChoices(rect.x, rect.y, rect.width, rect.height, list, options);
        const l = list.length;
        this.positionChoice = new Array(l);
        for (let i = 0; i < l; i++) {
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }
    }
    /**
     *  Create the choice list.
     */
    createWindowChoicesList() {
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE +
            ((WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2), WindowBox
            .LARGE_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const options = {
            nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY
        };
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, [], options);
    }
    /**
     *  Create the information window.
     */
    createWindowBoxInformation() {
        const width = ScreenResolution.SCREEN_X - (Constants.HUGE_SPACE * 2) -
            WindowBox.LARGE_SLOT_WIDTH - Constants.LARGE_SPACE;
        const height = 215;
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .HUGE_SPACE - width, Constants.HUGE_SPACE + ((WindowBox
            .SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2), width, height);
        const options = {
            padding: WindowBox.HUGE_PADDING_BOX
        };
        this.windowBoxInformation = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Create the empty window.
     */
    createWindowBoxEmpty() {
        const rect = new Rectangle(Constants.LARGE_SPACE, WindowBox.SMALL_SLOT_WIDTH, ScreenResolution.SCREEN_X - Constants.HUGE_SPACE, WindowBox
            .SMALL_SLOT_HEIGHT);
        const graphic = new Graphic.Text("Empty", { align: Enum.Align.Center });
        const options = {
            content: graphic,
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        this.windowBoxEmpty = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Create the user item window.
     */
    createWindowBoxUseItem() {
        const width = this.windowBoxInformation.oW;
        const height = 140;
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .HUGE_SPACE - width, this.windowBoxInformation.oY + this
            .windowBoxInformation.oH + Constants.MEDIUM_SPACE, width, height);
        const graphic = new Graphic.UseSkillItem(true);
        const options = {
            content: graphic,
            padding: WindowBox.SMALL_PADDING_BOX
        };
        this.windowBoxUseItem = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Create the owned items window.
     */
    createWindowBoxOwned() {
        const rect = new Rectangle(Constants.LARGE_SPACE, ScreenResolution
            .SCREEN_Y - WindowBox.SMALL_SLOT_HEIGHT - Constants.LARGE_SPACE, WindowBox.SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const graphic = new Graphic.Text("", { align: Enum.Align.Center });
        const options = {
            content: graphic,
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        this.windowBoxOwned = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Create the currencies window.
     */
    createWindowBoxCurrencies() {
        const graphic = new Graphic.ShopCurrencies();
        const width = graphic.getWidth() + (WindowBox.SMALL_SLOT_PADDING[0] * 2);
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .LARGE_SPACE - width, ScreenResolution.SCREEN_Y - WindowBox
            .SMALL_SLOT_HEIGHT - Constants.LARGE_SPACE, width, WindowBox
            .SMALL_SLOT_HEIGHT);
        const options = {
            content: graphic,
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        this.windowBoxCurrencies = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }
    /**
     *  Create the currencies window.
     */
    createSpinBox() {
        const width = SpinBox.DEFAULT_WIDTH;
        const height = SpinBox.DEFAULT_HEIGHT;
        this.spinBox = new SpinBox((ScreenResolution.SCREEN_X - width) / 2, (ScreenResolution.SCREEN_Y - height) / 2);
    }
    /**
     *  Update items list.
     */
    updateItemsList() {
        let indexTab = this.windowChoicesItemsKind.currentSelectedIndex;
        let list = [];
        let item;
        for (let i = 0, l = this.stock.length; i < l; i++) {
            item = this.stock[i];
            if (item.nb !== 0 && (indexTab === 0 || (indexTab === 1 && (item.kind ===
                Enum.ItemKind.Item && item.system.consumable)) || (indexTab ===
                2 && (item.kind === Enum.ItemKind.Item && item.system.type === 1))
                || (indexTab === 3 && (item.kind === Enum.ItemKind.Item && item
                    .system.type === 2)) || (indexTab === 4 && item.kind === Enum
                .ItemKind.Weapon) || (indexTab === 5 && item.kind === Enum
                .ItemKind.Armor))) {
                list.push(new Graphic.Item(item, item.nb, item.shop.isPossiblePrice()));
            }
        }
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
    }
    /**
     *  Update informations to display.
     */
    synchronize() {
        this.windowBoxInformation.content = this.windowChoicesList.getCurrentContent();
        if (this.windowBoxInformation.content) {
            let owned = 0;
            let item;
            for (let i = 0, l = Game.current.items.length; i < l; i++) {
                item = Game.current.items[i];
                if (item.system.id === this.windowBoxInformation
                    .content.item.system.id) {
                    owned = item.nb;
                    break;
                }
            }
            this.windowBoxOwned.content.setText("Owned: " + owned);
        }
    }
    /**
     *  Move tab according to key.
     *  @param {number} key - The key ID
     */
    moveTabKey(key) {
        // Tab
        const indexTab = this.windowChoicesItemsKind.currentSelectedIndex;
        this.windowChoicesItemsKind.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesItemsKind.currentSelectedIndex) {
            this.updateItemsList();
        }
        // List
        const indexList = this.windowChoicesList.currentSelectedIndex;
        this.windowChoicesList.onKeyPressedAndRepeat(key);
        if (indexList !== this.windowChoicesList.currentSelectedIndex) {
            this.synchronize();
        }
        let position = this.positionChoice[this.windowChoicesItemsKind
            .currentSelectedIndex];
        position.index = this.windowChoicesList.currentSelectedIndex;
        position.offset = this.windowChoicesList.offsetSelectedIndex;
    }
    /**
     *  Update the scene.
     */
    update() {
        this.windowBoxUseItem.content.update();
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        let graphic = this.windowChoicesList.getCurrentContent();
        switch (this.step) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    Scene.Map.current.user = null;
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    if (this.windowBoxInformation.content === null) {
                        return;
                    }
                    if (graphic.item.shop.isPossiblePrice()) {
                        Datas.Systems.soundConfirmation.playSound();
                        this.spinBox.max = graphic.item.getMaxBuy();
                        this.spinBox.value = 1;
                        this.step = 2;
                        Manager.Stack.requestPaintHUD = true;
                    }
                    else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    this.step = 0;
                }
                break;
            case 2:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    if (graphic.item.buy(this.shopID, this.spinBox.value)) {
                        this.windowChoicesList.removeCurrent();
                    }
                    else {
                        graphic.updateName();
                    }
                    this.synchronize();
                    this.windowBoxCurrencies.update();
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
        }
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        let res = super.onKeyPressedAndRepeat(key);
        switch (this.step) {
            case 0:
                this.windowChoicesBuySell.onKeyPressedAndRepeat(key);
                break;
            case 1:
                this.moveTabKey(key);
                break;
            case 2:
                this.spinBox.onKeyPressedAndRepeat(key);
                break;
        }
        return res;
    }
    /**
     *  Draw the HUD scene.
     */
    drawHUD() {
        super.drawHUD();
        this.windowBoxTop.draw();
        this.windowChoicesBuySell.draw();
        if (this.step > 0) {
            this.windowChoicesItemsKind.draw();
            this.windowChoicesList.draw();
            if (this.windowChoicesList.listWindows.length > 0) {
                this.windowBoxInformation.draw();
                this.windowBoxUseItem.draw();
                this.windowBoxOwned.draw();
            }
            else {
                this.windowBoxEmpty.draw();
            }
            if (this.step === 2) {
                this.spinBox.draw();
            }
        }
        this.windowBoxCurrencies.draw();
    }
}
export { MenuShop };
