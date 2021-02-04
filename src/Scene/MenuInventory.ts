/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Datas, Scene, Manager, System } from "../index";
import { Constants, Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;
import OrientationWindow = Enum.OrientationWindow;
import ItemKind = Enum.ItemKind;
import TargetKind = Enum.TargetKind;
import AvailableKind = Enum.AvailableKind;
import { WindowBox, WindowChoices, Item, Game, Rectangle } from "../Core";
import { StructPositionChoice } from "./Menu";

/** @class
 *  A scene in the menu for describing inventory.
 *  @extends Scene.Base
 */
class MenuInventory extends Base {

    public windowTop: WindowBox;
    public windowChoicesTabs: WindowChoices;
    public windowChoicesList: WindowChoices;
    public windowBoxInformation: WindowBox;
    public windowEmpty: WindowBox;
    public windowBoxUseItem: WindowBox;
    public positionChoice: StructPositionChoice[];
    public substep: number;

    constructor() {
        super(false);

        // Initializing the top menu for item kinds
        let menuKind = [
            new Graphic.Text("All", { align: Align.Center }),
            new Graphic.Text("Consumables", { align: Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(1), { align: Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(2), { align: Align.Center }),
            new Graphic.Text("Weapons", { align: Align.Center }),
            new Graphic.Text("Armors", { align: Align.Center })
        ];

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
                content: new Graphic.Text("Inventory", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(5, 60, 105, WindowBox
            .SMALL_SLOT_HEIGHT, menuKind, {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 6
            }
        );
        this.createWindowChoicesList();
        this.createWindowBoxInformation();
        this.windowEmpty = new WindowBox(10, 100, ScreenResolution.SCREEN_X - 20
            , WindowBox.SMALL_SLOT_HEIGHT, {
                content: new Graphic.Text("Empty", { align: Align.Center }),
                padding: WindowBox.SMALL_SLOT_PADDING
            }
        );
        this.createWindowBoxUseItem();
        let l = menuKind.length;
        this.positionChoice = new Array(l);
        for (let i = 0; i < l; i++) {
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }

        // Update for changing tab
        this.substep = 0;
        this.updateForTab();
        this.synchronize();
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
     *  Create the user item window.
     */
    createWindowBoxUseItem() {
        const width = this.windowBoxInformation.oW;
        const height = 140;
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .HUGE_SPACE - width, this.windowBoxInformation.oY + this
            .windowBoxInformation.oH + Constants.MEDIUM_SPACE, width, height);
        const graphic = new Graphic.UseSkillItem();
        const options = {
            content: graphic, 
            padding: WindowBox.SMALL_PADDING_BOX
        }
        this.windowBoxUseItem = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }

    /** 
     *  Update informations to display.
     */
    synchronize() {
        this.windowBoxInformation.content = this.windowChoicesList
            .getCurrentContent();
    }

    /** 
     *  Update tab.
     */
    updateForTab() {
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        let nbItems = Game.current.items.length;
        let list = [];
        let ownedItem: Item, item: System.CommonSkillItem;
        for (let i = 0; i < nbItems; i++) {
            ownedItem = Game.current.items[i];
            item = ownedItem.system;
            if (indexTab === 0 || (indexTab === 1 && (ownedItem.kind === 
                ItemKind.Item && item.consumable)) || (indexTab === 2 && (
                ownedItem.kind === ItemKind.Item && item.type === 1)) || (
                indexTab === 3 && (ownedItem.kind === ItemKind.Item && item.type 
                === 2)) || (indexTab === 4 && ownedItem.kind === ItemKind.Weapon
                ) || (indexTab === 5 && ownedItem.kind === ItemKind.Armor))
            {
                list.push(new Graphic.Item(ownedItem));
            }
        }
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[
            indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
    }

    /** 
     *  Use the current item.
     */
    useItem() {
        let graphic = <Graphic.Item> this.windowBoxInformation.content;
        Game.current.useItem(graphic.item);
        if (graphic.item.nb > 0) {
            graphic.updateNb();
        } else {
            this.updateForTab();
            this.substep = 0;
            Manager.Stack.requestPaintHUD = true;
        }
        (<Graphic.UseSkillItem> this.windowBoxUseItem.content).updateStats();
        Manager.Stack.requestPaintHUD = true;
    }

    /** 
     *  Move tab according to key.
     *  @param {number} key - The key ID 
     */
    moveTabKey(key: number) {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
            this.updateForTab();
        }

        // List
        this.windowChoicesList.onKeyPressedAndRepeat(key);
        let position = this.positionChoice[this.windowChoicesTabs
            .currentSelectedIndex];
        position.index = this.windowChoicesList.currentSelectedIndex;
        position.offset = this.windowChoicesList.offsetSelectedIndex;

        this.synchronize();
    }

    /** 
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);

        if (this.windowChoicesList.currentSelectedIndex !== -1) {
            this.windowBoxUseItem.update();
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Scene.Map.current, key);
        let graphic = <Graphic.Item> this.windowBoxInformation.content;
        switch (this.substep) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action))
                {
                    if (this.windowBoxInformation.content === null) {
                        return;
                    }
                    let targetKind = graphic.item.system.targetKind;
                    let availableKind = graphic.item.system.availableKind;
                    if (graphic.item.system.consumable && (targetKind === 
                        TargetKind.Ally || targetKind === TargetKind.AllAllies) && 
                        (availableKind === AvailableKind.Always || availableKind 
                        === AvailableKind.MainMenu))
                    {
                        Datas.Systems.soundConfirmation.playSound();
                        this.substep = 1;
                        (<Graphic.UseSkillItem> this.windowBoxUseItem.content)
                            .setAll(targetKind === TargetKind.AllAllies);
                        Manager.Stack.requestPaintHUD = true;
                    } else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu))
                {
                    Datas.Systems.soundCancel.playSound();
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action))
                {
                    if (graphic.item.system.isPossible() && graphic.item.system.use()) {
                        this.useItem();
                    }
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu))
                {
                    Datas.Systems.soundCancel.playSound();
                    this.substep = 0;
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
        }
    }

    /** 
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number) {
        Scene.Base.prototype.onKeyReleased.call(Scene.Map.current, key);
    }

    /** 
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Scene.Map.current, key);
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Scene.Map
            .current, key);
        switch (this.substep) {
            case 0:
                this.moveTabKey(key);
                break;
            case 1:
                (<Graphic.UseSkillItem> this.windowBoxUseItem.content)
                    .onKeyPressedAndRepeat(key);
                break;
        }
        return res;
    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD() {
        // Draw the local map behind
        Scene.Map.current.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesList.draw();
        if (this.windowChoicesList.listWindows.length > 0) {
            this.windowBoxInformation.draw();
            if (this.substep === 1) {
                this.windowBoxUseItem.draw();
            }
        } else {
            this.windowEmpty.draw();
        }
    }
}

export { MenuInventory }