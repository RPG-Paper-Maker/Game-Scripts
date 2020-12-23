/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Manager, Graphic, Datas, Scene, System } from "..";
import { WindowBox, WindowChoices, Player, Item } from "../Core";
import { Enum } from "../Common";
import Align = Enum.Align;
import OrientationWindow = Enum.OrientationWindow;
import ItemKind = Enum.ItemKind;

/** @class
 *  A scene in the menu for describing players equipments.
 *  @extends Scene.Base
 */
class MenuEquip extends Base {

    public windowTop: WindowBox;
    public windowChoicesTabs: WindowChoices;
    public windowChoicesEquipment: WindowChoices;
    public windowChoicesList: WindowChoices;
    public windowInformations: WindowBox;
    public selectedEquipment: number;
    public list: number[];
    public bonus: number[];

    constructor() {
        super(false);

        // Tab heroes
        let nbHeroes = Manager.Stack.game.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(Manager.Stack.game
                .teamHeroes[i]);
        }

        // Equipment
        let nbEquipments = Datas.BattleSystems.equipmentsOrder.length;
        let nbEquipChoice = Scene.Menu.SLOTS_TO_DISPLAY - nbEquipments - 1;

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
                content: new Graphic.Text("Equip", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox
            .SMALL_SLOT_HEIGHT, listHeroes, {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 4,
                padding: [0, 0, 0, 0]
            }
        );
        this.windowChoicesEquipment = new WindowChoices(20, 100, 290, WindowBox
            .SMALL_SLOT_HEIGHT, new Array(nbEquipments), {
                nbItemsMax: nbEquipments
            }
        );
        this.windowChoicesList = new WindowChoices(20, 100 + (nbEquipments + 1) 
            *  WindowBox.SMALL_SLOT_HEIGHT, 290, WindowBox.SMALL_SLOT_HEIGHT, []
            , {
                nbItemsMax: nbEquipChoice,
                currentSelectedIndex: -1
            }
        );
        this.windowInformations = new WindowBox(330, 100, 285, 350, {
                padding: WindowBox.SMALL_PADDING_BOX
            }
        );

        // Updates
        this.updateForTab();
    }

    /** 
     *  Update tab.
     */
    updateForTab() {
        // update equipment
        let equipLength = Player.getEquipmentLength();
        let l = Datas.BattleSystems.equipmentsOrder.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new Graphic.Equip(Manager.Stack.game.teamHeroes[this
                .windowChoicesTabs.currentSelectedIndex], Datas.BattleSystems
                .equipmentsOrder[i], equipLength);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        this.updateEquipmentList();
        this.updateInformations();
    }

    /** 
     *  Update the equipment list
     */
    updateEquipmentList() {
        let idEquipment = Datas.BattleSystems.equipmentsOrder[this
            .windowChoicesEquipment.currentSelectedIndex];
        let list: Graphic.Base[] = [new Graphic.Text("[Remove]")];
        let item: Item, systemItem: System.CommonSkillItem, type: System
            .WeaponArmorKind, nbItem: number;
        for (let i = 0, l = Manager.Stack.game.items.length; i < l; i++) {
            item = Manager.Stack.game.items[i];
            if (item.kind !== ItemKind.Item) {
                systemItem = item.getItemInformations();
                type = systemItem.getType();
                if (type.equipments[idEquipment]) {
                    nbItem = item.nb;
                    if (nbItem > 0) {
                        list.push(new Graphic.Item(item, nbItem));
                    }
                }
            }
        }
        this.windowChoicesList.setContentsCallbacks(list, null, -1);
    }

    /** 
     *  Update the informations to display for equipment stats.
     */
    updateInformations() {
        let player = Manager.Stack.game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1) {
            this.list = [];
        } else {
            let item = <Graphic.Item> this.windowChoicesList.getCurrentContent();
            if (item === null) {
                this.list = [];
            } else {
                let result = player.getEquipmentStatsAndBonus(item.system, Datas
                    .BattleSystems.equipmentsOrder[this.windowChoicesEquipment
                    .currentSelectedIndex]);
                this.list = result[0];
                this.bonus = result[1];
            }
        }
        this.windowInformations.content = new Graphic.EquipStats(player, this
            .list);
    }

    /** 
     *  Move tab according to key.
     *  @param {number} key The key ID 
     */
    moveTabKey(key: number) {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
            this.updateForTab();
        }

        // Equipment
        if (this.selectedEquipment === -1) {
            let indexEquipment = this.windowChoicesEquipment
                .currentSelectedIndex;
            this.windowChoicesEquipment.onKeyPressedAndRepeat(key);
            if (indexEquipment !== this.windowChoicesEquipment
                .currentSelectedIndex)
            {
                this.updateEquipmentList();
            }
        } else {
            let indexList = this.windowChoicesList.currentSelectedIndex;
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            if (indexList !== this.windowChoicesList.currentSelectedIndex) {
                this.updateInformations();
            }
        }
    }

    /** 
     *  Remove the equipment of the character.
     */
    remove() {
        let character = Manager.Stack.game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        let id = Datas.BattleSystems.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = null;
        if (prev) {
            prev.add(1);
        }
        this.updateStats();
    }

    /** 
     *  Equip the selected equipment.
     */
    equip() {
        let index = this.windowChoicesTabs.currentSelectedIndex;
        let character = Manager.Stack.game.teamHeroes[index];
        let gameItem = (<Graphic.Item> this.windowChoicesList
            .getCurrentContent()).item;
        let id = Datas.BattleSystems.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = gameItem;

        // Remove one equip from inventory
        let item: Item;
        for (let i = 0, l = Manager.Stack.game.items.length; i < l; i++) {
            item = Manager.Stack.game.items[i];
            if (item.kind === gameItem.kind && item.id === gameItem.id) {
                item.remove(1);
                break;
            }
        }
        if (prev) {
            prev.add(1);
        }
        this.updateStats();
    }

    /** 
     *  Update the stats.
     */
    updateStats() {
        Manager.Stack.game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex].updateEquipmentStats(this.list, this.bonus);
    }

    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Manager.Stack.currentMap);
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Manager.Stack.currentMap, key);
        if (this.selectedEquipment === -1) {
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .controls.MainMenu))
            {
                Datas.Systems.soundCancel.playSound();
                Manager.Stack.pop();
            } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .menuControls.Action))
            {
                Datas.Systems.soundConfirmation.playSound();
                this.selectedEquipment = this.windowChoicesEquipment
                    .currentSelectedIndex;
                this.windowChoicesList.currentSelectedIndex = 0;
                this.updateInformations();
                this.windowChoicesList.selectCurrent();
            }
        } else {
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .controls.MainMenu))
            {
                Datas.Systems.soundCancel.playSound();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .menuControls.Action))
            {
                if (this.windowChoicesList.getCurrentContent() !== null) {
                    Datas.Systems.soundConfirmation.playSound();
                    if (this.windowChoicesList.currentSelectedIndex === 0) {
                        this.remove();
                    } else {
                        this.equip();
                    }
                    this.selectedEquipment = -1;
                    this.windowChoicesList.unselect();
                    this.updateForTab();
                } else {
                    Datas.Systems.soundImpossible.playSound();
                }
            }
        }
    }

    /** 
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key: number) {
        Scene.Base.prototype.onKeyReleased.call(Manager.Stack.currentMap, key);
    }

    /** 
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
    */
    onKeyPressedRepeat(key: number): boolean {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Manager.Stack
            .currentMap, key);
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
    */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Manager.Stack
            .currentMap, key);
        this.moveTabKey(key);
        return res;
    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD() {
        // Draw the local map behind
        Manager.Stack.currentMap.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesEquipment.draw();
        this.windowChoicesList.draw();
        this.windowInformations.draw();
    }
}

export { MenuEquip }