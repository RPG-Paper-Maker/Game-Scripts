/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MenuBase } from "./MenuBase";
import { Manager, Graphic, Datas, Scene, System } from "../index";
import { WindowBox, WindowChoices, Player, Item, Game, Rectangle } from "../Core";
import { Enum } from "../Common";
import Align = Enum.Align;
import OrientationWindow = Enum.OrientationWindow;
import ItemKind = Enum.ItemKind;


/**
 * The menu scene displaying heroes equipments
 *
 * @class MenuEquip
 * @extends {MenuBase}
 */
class MenuEquip extends MenuBase {

    /**
     *  the top window
     *
     * @type {WindowBox}
     * @memberof MenuEquip
     */
    public windowTop: WindowBox;

    /**
     * the window choices tabs
     *
     * @type {WindowChoices}
     * @memberof MenuEquip
     */
    public windowChoicesTabs: WindowChoices;

    /**
     * the equipment choice window
     *
     * @type {WindowChoices}
     * @memberof MenuEquip
     */
    public windowChoicesEquipment: WindowChoices;

    /**
     * the window choice list
     *
     * @type {WindowChoices}
     * @memberof MenuEquip
     */
    public windowChoicesList: WindowChoices;

    /**
     * the information window.
     *
     * @type {WindowBox}
     * @memberof MenuEquip
     */
    public windowInformation: WindowBox;

    /**
     * the current selected equipment.
     *
     * @type {number}
     * @memberof MenuEquip
     */
    public selectedEquipment: number;

    /**
     * the equipment list
     *
     * @type {number[]}
     * @memberof MenuEquip
     */
    public list: number[];

    /**
     * the bonus stats.
     *
     * @type {number[]}
     * @memberof MenuEquip
     */
    public bonus: number[];


    constructor() {
        super();
        this.updateForTab();
    }

    /**
     * @inheritdoc
     *
     * @memberof MenuEquip
     */
    create() {
        this.createAllWindows();
    }

    /**
     * create all the window in the scene.
     *
     * @memberof MenuEquip
     */
    createAllWindows() {
        this.createWindowTop();
        this.createWindowChoiceTabs();
        this.createWindowChoiceEquipment();
        this.createWindowChoiceList();
        this.createWindowInformation();
    }

    /**
     * create the top window
     *
     * @memberof MenuEquip
     */
    createWindowTop() {
        const rect = new Rectangle(20, 20, 200, 30);
        this.windowTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, {
            content: new Graphic.Text("Equip", { align: Align.Center })
        });
    }

    /**
     * create the choice tab window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceTabs() {
        const rect = new Rectangle(50, 60, 110, WindowBox.SMALL_SLOT_HEIGHT);
        let listHeroes = [];
        for (let i = 0; i < this.party().length; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(this.party()[i]);
        }
        console.log(listHeroes);
        const options = {
            orientation: OrientationWindow.Horizontal,
            nbItemMax: 4,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesTabs = new WindowChoices(rect.x, rect.y, rect.width, rect.height, listHeroes, options);
    }

    /**
     * create the equipment choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceEquipment() {
        const rect = new Rectangle(20, 100, 290, WindowBox.SMALL_SLOT_HEIGHT);
        let nbEquipments = Datas.BattleSystems.equipmentsOrder.length;
        this.windowChoicesEquipment = new WindowChoices(rect.x, rect.y, rect.width, rect.height,
            new Array(nbEquipments),
            {
                nbItemsMax: nbEquipments
            }
        );
    }

    /**
     * create the choice window
     *
     * @memberof MenuEquip
     */
    createWindowChoiceList() {
        const nbEquips = Datas.BattleSystems.equipmentsOrder.length;
        const nbEquipChoice = MenuBase.SLOTS_TO_DISPLAY - nbEquips - 1;

        const y = 100 + (nbEquips + 1) * WindowBox.SMALL_SLOT_HEIGHT;
        const rect = new Rectangle(20, y, 290, WindowBox.SMALL_SLOT_HEIGHT);
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, []
            , {
                nbItemsMax: nbEquipChoice,
                currentSelectedIndex: -1
            }
        );
    }

    /**
     * create the information window
     *
     * @memberof MenuEquip
     */
    createWindowInformation() {
        const rect = new Rectangle(330, 100, 285, 350);
        this.windowInformation = new WindowBox(rect.x, rect.y, rect.width, rect.height,
            {
                padding: WindowBox.SMALL_PADDING_BOX
            }
        );
    }

    /**
     * update the tab window
     *
     * @memberof MenuEquip
     */
    updateForTab() {
        // update equipment
        let equipLength = Player.getEquipmentLength();
        let l = Datas.BattleSystems.equipmentsOrder.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++) {
            list[i] = new Graphic.Equip(Game.current.teamHeroes[this
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
     * update the equipment list
     *
     * @memberof MenuEquip
     */
    updateEquipmentList() {
        const currentIndex = this.windowChoicesEquipment.currentSelectedIndex;
        let idEquipment = Datas.BattleSystems.equipmentsOrder[currentIndex];
        let list: Graphic.Base[] = [new Graphic.Text("[Remove]")];
        let item: Item, systemItem: System.CommonSkillItem;
        let type: System.WeaponArmorKind, nbItem: number;

        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
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
     * update the equipment stats display information.
     *
     * @memberof MenuEquip
     */
    updateInformations() {
        let player = Game.current.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1) {
            this.list = [];
        } else {
            let item = <Graphic.Item>this.windowChoicesList.getCurrentContent();
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
        this.windowInformation.content = new Graphic.EquipStats(player, this
            .list);
    }

    /**
     * Move tab according to key
     *
     * @param {number} key - the key ID
     * @memberof MenuEquip
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
                .currentSelectedIndex) {
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
     * remove the selected equipment
     *
     * @memberof MenuEquip
     */
    remove() {
        let character = this.party()[this.windowChoicesTabs.currentSelectedIndex];
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
     * equip the selected equipment
     *
     * @memberof MenuEquip
     */
    equip() {
        let index = this.windowChoicesTabs.currentSelectedIndex;
        let character = Game.current.teamHeroes[index];
        let gameItem = (<Graphic.Item>this.windowChoicesList
            .getCurrentContent()).item;
        let id = Datas.BattleSystems.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = gameItem;

        // Remove one equip from inventory
        let item: Item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            item = Game.current.items[i];
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
     * update the character stats
     *
     * @memberof MenuEquip
     */
    updateStats() {
        const index = this.windowChoicesTabs.currentSelectedIndex;
        this.party()[index].updateEquipmentStats(this.list, this.bonus);
    }

    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Scene.Map.current, key);
        if (this.selectedEquipment === -1) {
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .controls.MainMenu)) {
                Datas.Systems.soundCancel.playSound();
                Manager.Stack.pop();
            } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .menuControls.Action)) {
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
                    .controls.MainMenu)) {
                Datas.Systems.soundCancel.playSound();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .menuControls.Action)) {
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
        return super.onKeyPressedAndRepeat(key);
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
    */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Scene.Map
            .current, key);
        this.moveTabKey(key);
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
        this.windowChoicesEquipment.draw();
        this.windowChoicesList.draw();
        this.windowInformation.draw();
    }
}

export { MenuEquip }