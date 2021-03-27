/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Core, Datas, Graphic, Manager, Scene, System } from "..";
import { Constants, Enum, ScreenResolution } from "../Common";
import { Game, Item, Player, Rectangle, WindowBox, WindowChoices } from "../Core";
import { SpinBox } from "../Core/SpinBox";
import { StructPositionChoice } from "./Menu";
import { MenuBase } from "./MenuBase";

/**
 * The scene handling and processing the shop system.
 * @class
 * @extends {MenuBase}
 */
class MenuShop extends MenuBase {

    public windowBoxTop: WindowBox;
    public windowChoicesBuySell: WindowChoices;
    public windowChoicesItemsKind: WindowChoices;
    public windowChoicesList: WindowChoices;
    public windowBoxInformation: WindowBox;
    public windowBoxEmpty: WindowBox;
    public windowBoxUseItem: WindowBox;
    public windowBoxOwned: WindowBox;
    public windowBoxCurrencies: WindowBox;
    public windowBoxConfirmEquip: WindowBox;
    public windowChoicesConfirmEquip: WindowChoices;
    public spinBox: SpinBox;
    public shopID: number;
    public buyOnly: boolean;
    public stock: Item[];
    public step: number;
    public positionChoice: StructPositionChoice[];
    public currentEquipmentID: number;
    public currentList: number[];
    public currentBonus: number[];

    constructor(shopID: number, buyOnly: boolean, stock: Item[]) {
        super(shopID, buyOnly, stock);
    }

    initialize(shopID: number, buyOnly: boolean, stock: Item[]) {
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
        this.createWindowBoxConfirmEquip();
        this.createWindowChoicesConfirmEquip();
    }

    /**
     *  Create the top window.
     */
    createWindowBoxTop() {
        const rect = new Rectangle(Constants.HUGE_SPACE, Constants.HUGE_SPACE, 
            WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const graphic = new Graphic.Text("Shop", { align: Enum.Align.Center });
        const options = { 
            content: graphic
        };
        this.windowBoxTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, 
            options);
    }

    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowChoicesBuySell() {
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants.HUGE_SPACE - 
            (WindowBox.SMALL_SLOT_WIDTH * 2), Constants.HUGE_SPACE, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("Buy", { align: Enum.Align.Center})
        ];
        if (!this.buyOnly) {
            list.push(new Graphic.Text("Sell", { align: Enum.Align.Center}));
        }
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: WindowBox.NONE_PADDING
        };
        this.windowChoicesBuySell = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, list, options);
    }

    /**
     *  Create the choice tab window for sorting items kind.
     */
    createWindowChoicesItemsKind() {
        const rect = new Rectangle(Constants.MEDIUM_SPACE, Constants.HUGE_SPACE + 
            WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        let l = Datas.Systems.inventoryFilters.length;
        let list: Graphic.Text[] = new Array();
        let i: number;
        for (i = 0, l = Datas.Systems.inventoryFilters.length; i < l; i++) {
            list[i] = new Graphic.Text(Datas.Systems.inventoryFilters[i]
                .name(), { align: Enum.Align.Center });
        }
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesItemsKind = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, list, options);
        l = list.length;
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
            nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY,
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, [], options);
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
        const rect = new Rectangle(Constants.LARGE_SPACE, WindowBox.SMALL_SLOT_WIDTH, 
            ScreenResolution.SCREEN_X - Constants.HUGE_SPACE, WindowBox
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
        const graphic = new Graphic.UseSkillItem({ hideArrow: true });
        const options = {
            content: graphic, 
            padding: WindowBox.SMALL_PADDING_BOX
        }
        this.windowBoxUseItem = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }

    /**
     *  Create the owned items window.
     */
    createWindowBoxOwned() {
        const rect = new Rectangle(Constants.LARGE_SPACE, ScreenResolution
            .SCREEN_Y - WindowBox.SMALL_SLOT_HEIGHT - Constants.LARGE_SPACE, 
            WindowBox.SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
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
        this.spinBox = new SpinBox((ScreenResolution.SCREEN_X - width) / 2, (
            ScreenResolution.SCREEN_Y - height) / 2);
    }

    /**
     *  Create the confirm equip window.
     */
    createWindowBoxConfirmEquip() {
        const width = 300;
        const height = 100;
        const rect = new Rectangle((ScreenResolution.SCREEN_X - width) / 2, (
            ScreenResolution.SCREEN_Y - height) / 2, width, height);
        const graphic = new Graphic.Text("Would you like to equip it?", { align: 
            Enum.Align.Center });
        const options = { 
            content: graphic, 
            padding: WindowBox.SMALL_SLOT_PADDING
        };
        this.windowBoxConfirmEquip = new WindowBox(rect.x, rect.y, rect.width, 
            rect.height, options);
    }

    /**
     *  Create the confirm equip window choice.
     */
    createWindowChoicesConfirmEquip() {
        const rect = new Rectangle((ScreenResolution.SCREEN_X - WindowBox
            .SMALL_SLOT_WIDTH) / 2, this.windowBoxConfirmEquip.oY + this
            .windowBoxConfirmEquip.oH, WindowBox.SMALL_SLOT_WIDTH, WindowBox
            .SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("Yes", { align: Enum.Align.Center}),
            new Graphic.Text("No", { align: Enum.Align.Center})
        ];
        const options = {
            nbItemsMax: list.length,
            padding: WindowBox.NONE_PADDING
        };
        this.windowChoicesConfirmEquip = new WindowChoices(rect.x, rect.y, rect
            .width, rect.height, list, options);
    }

    /** 
     *  Check if is in buy mode.
     *  @returns {boolean}
     */
    isBuy(): boolean {
        return this.windowChoicesBuySell.currentSelectedIndex === 0;
    }

    /** 
     *  Get the current selected player.
     *  @returns {Core.Player}
     */
    getCurrentPlayer(): Player {
        return (<Graphic.UseSkillItem>this.windowBoxUseItem.content).getSelectedPlayer();
    }

    /** 
     *  Update items list.
     */
    updateItemsList() {
        let listToSort = this.isBuy() ? this.stock : Game.current.items;
        let indexTab = this.windowChoicesItemsKind.currentSelectedIndex;
        let list: Graphic.Item[] = [];
        let item: Item;
        for (let i = 0, l = listToSort.length; i < l; i++) {
            item = listToSort[i];
            if (item.nb !== 0 && (this.isBuy() || item.system.canBeSold
                .getValue()) && Datas.Systems.inventoryFilters[indexTab]
                .getFilter()(item)) {
                list.push(this.isBuy() ? new Graphic.Item(item, { nbItem: item
                    .nb, possible: item.shop.isPossiblePrice() }) : new Graphic
                    .Item(item, { showSellPrice: true }));
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
            let item: Item;
            for (let i = 0, l = Game.current.items.length; i < l; i++) {
                item = Game.current.items[i];
                if (item.system.id === (<Graphic.Item>this.windowBoxInformation
                    .content).item.system.id) {
                    owned = item.nb;
                    break;
                }
            }
            (<Graphic.Text>this.windowBoxOwned.content).setText("Owned: " + owned);
        }
    }

    /** 
     *  Move tab according to key.
     *  @param {number} key - The key ID 
     */
    moveTabKey(key: number) {
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

        // Update stats short if weapon / armor
        if (this.windowChoicesList.getCurrentContent()) {
            let system = (<Graphic.Item>this.windowChoicesList.getCurrentContent())
            .item.system;
            if (system.isWeaponArmor()) {
                (<Graphic.UseSkillItem>this.windowBoxUseItem.content).updateStatShort(system);
            } else {
                (<Graphic.UseSkillItem>this.windowBoxUseItem.content).updateStatShortNone();
            }
        }

        // Update position
        if (this.windowChoicesList.currentSelectedIndex !== -1) {
            let position = this.positionChoice[this.windowChoicesItemsKind
                .currentSelectedIndex];
            position.index = this.windowChoicesList.currentSelectedIndex;
            position.offset = this.windowChoicesList.offsetSelectedIndex;
        }
    }

    /**
     *  Update the equipments stats when selecting a player.
     */
    updateEquipmentStats() {
        let player = this.getCurrentPlayer();
        let result = player.getBestWeaponArmorToReplace((<Graphic.Item>this
            .windowChoicesList.getCurrentContent()).item.system);
        this.windowBoxInformation.content = new Graphic.EquipStats(player, 
            result[2][0], false);
        this.currentEquipmentID = result[1];
        this.currentList = result[2][0];
        this.currentBonus = result[2][1];
    }

    /**
     *  Equip the selected equipment.
     */
    equip(shopItem: Item) {
        let player = this.getCurrentPlayer();
        let item = Item.findItem(shopItem.kind, shopItem.system.id);
        let prev = player.equip[this.currentEquipmentID];
        player.equip[this.currentEquipmentID] = item;
        item.remove(1);
        if (prev) {
            prev.add(1);
        }
        player.updateEquipmentStats(this.currentList, this.currentBonus);
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
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        let graphic = <Graphic.Item>this.windowChoicesList.getCurrentContent();
        switch (this.step) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.updateItemsList();
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    Scene.Map.current.user = null;
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action))
                {
                    if (this.windowBoxInformation.content === null) {
                        return;
                    }
                    if (this.isBuy()) {
                        if (graphic.item.shop.isPossiblePrice()) {
                            Datas.Systems.soundConfirmation.playSound();
                            if (graphic.item.system.isWeaponArmor()) {
                                (<Graphic.UseSkillItem>this.windowBoxUseItem.content)
                                    .hideArrow = false;
                                (<Graphic.UseSkillItem>this.windowBoxUseItem.content)
                                    .indexArrow = 0;
                                this.updateEquipmentStats();
                                this.step = 3;
                            } else {
                                this.spinBox.max = graphic.item.getMaxBuy();
                                this.spinBox.updateValue(1);
                                this.step = 2;
                            }
                            Manager.Stack.requestPaintHUD = true;
                        } else {
                            Datas.Systems.soundImpossible.playSound();
                        }
                    } else {
                        Datas.Systems.soundConfirmation.playSound();
                        this.spinBox.max = graphic.item.nb;
                        this.spinBox.updateValue(1);
                        this.step = 2;
                        Manager.Stack.requestPaintHUD = true;
                    }
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    this.step = 0;
                }
                break;
            case 2:
            case 4:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    let shopItem = graphic.item;
                    if (this.isBuy()) {
                        if (this.step === 2 && graphic.item.system.isWeaponArmor()) {
                            this.step = 4;
                            Manager.Stack.requestPaintHUD = true;
                            break;
                        } else {
                            if (graphic.item.buy(this.shopID, this.spinBox.value)) {
                                this.windowChoicesList.removeCurrent();
                            } else {
                                graphic.updateName();
                            }
                        }
                    } else {
                        if (graphic.item.sell(this.spinBox.value)) {
                            this.windowChoicesList.removeCurrent();
                        } else {
                            graphic.updateNb();
                        }
                    }
                    this.windowBoxCurrencies.update();
                    // If equip
                    if (this.step === 4 && this.windowChoicesConfirmEquip
                        .currentSelectedIndex === 0) {
                        this.equip(shopItem);
                        (<Graphic.UseSkillItem>this.windowBoxUseItem.content)
                            .hideArrow = true;
                        this.synchronize();
                    }
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    this.step = graphic.item.system.isWeaponArmor() ? 3 : 1;
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
            case 3:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.spinBox.max = graphic.item.nb;
                    this.spinBox.updateValue(1);
                    this.step = 2;
                    Manager.Stack.requestPaintHUD = true;
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    (<Graphic.UseSkillItem>this.windowBoxUseItem.content)
                        .hideArrow = true;
                    this.synchronize();
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
    onKeyPressedAndRepeat(key: number): boolean {
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
            case 3:
                (<Graphic.UseSkillItem>this.windowBoxUseItem.content).onKeyPressedAndRepeat(key);
                this.updateEquipmentStats();
                break;
            case 4:
                this.windowChoicesConfirmEquip.onKeyPressedAndRepeat(key);
                break;
        }
        return res;
    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD(){
        super.drawHUD();
        this.windowBoxTop.draw();
        this.windowChoicesBuySell.draw();
        if (this.step > 0) {
            this.windowChoicesItemsKind.draw();
            this.windowChoicesList.draw();
            if (this.windowChoicesList.listWindows.length > 0) {
                this.windowBoxInformation.draw();
                this.windowBoxUseItem.draw();
                if (this.isBuy()) {
                    this.windowBoxOwned.draw();
                }
            } else {
                this.windowBoxEmpty.draw();
            }
            if (this.step === 2) {
                this.spinBox.draw();
            } else if (this.step === 4) {
                this.windowBoxConfirmEquip.draw();
                this.windowChoicesConfirmEquip.draw();
            }
        }
        this.windowBoxCurrencies.draw();
    }
}

export { MenuShop }