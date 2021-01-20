/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene, Manager, Graphic, Datas } from "../index";
import { Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;
import { WindowChoices, WindowBox, Game, Rectangle, ChoicesOptions } from "../Core";
import { MenuBase, MenuCommands } from "./MenuBase";

interface StructPositionChoice {
    index: number,
    offset: number
};


/**
 * The class who handle the scene menu in game.
 *
 * @class Menu
 * @extends {MenuBase}
 */
class Menu extends MenuBase {

    // Transferring public static SLOTS_TO_DISPLAY = 12; to menuBase

    /**
     * The array containing the menu commands.
     * @todo in 1.7 and above the system will be changed for a dynamic support.
     *
     * @static
     * @type {MenuCommands[]}
     * @memberof Menu
     */
    public static menuCommands: MenuCommands[] = [
        { command: { name: "Inventory", align: Align.Center }, action: Menu.prototype.openInventory },
        { command: { name: "Skills", align: Align.Center }, action: Menu.prototype.openSkills },
        { command: { name: "Equip", align: Align.Center }, action: Menu.prototype.openEquip },
        { command: { name: "State", align: Align.Center }, action: Menu.prototype.openState },
        { command: { name: "Order", align: Align.Center }, action: Menu.prototype.openOrder },
        { command: { name: "Save", align: Align.Center }, action: Menu.prototype.openSave },
        { command: { name: "Quit", align: Align.Center }, action: Menu.prototype.exit }
    ];


    public selectedOrder: number;
    public windowChoicesCommands: WindowChoices;
    public windowChoicesTeam: WindowChoices;
    public windowTimeCurrencies: WindowBox;

    constructor() {
        super();
        Manager.Stack.isInMainMenu = true;
        // Initializing order index
        this.selectedOrder = -1;
        // Play a sound when opening the menu
        Datas.Systems.soundCursor.playSound();
    }

    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    create() {
        super.create();
        this.createAllWindows();
    }

    /**
     * Create all the windows in the scene.
     *
     * @memberof Menu
     */
    createAllWindows() {
        this.createCommandWindow();
        this.createTeamOrderWindow();
        this.createWindowTimeCurrencies();
    }

    /**
     * Create the commands window
     *
     * @memberof Menu
     */
    createCommandWindow() {
        let commands: Graphic.Text[] = [];
        let actions: Function[] = [];
        let container = Menu.menuCommands;
        let _align: Align;
        let _name: string;
        for (let i = 0; i < container.length; i++) {
            _align = container[i].command.align;
            _name = container[i].command.name;
            commands[i] = new Graphic.Text(_name, { align: _align });
            actions[i] = container[i].action;
        }

        const rect = new Rectangle(20, 20, 150, WindowBox.MEDIUM_SLOT_HEIGHT);
        const options: ChoicesOptions = {
            nbItemsMax: Menu.menuCommands.length,
            listCallbacks: actions,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesCommands = new WindowChoices(rect.x, rect.y, rect.width, rect.height, commands, options);
    }

    /**
     * Create the team order window.
     *
     * @memberof Menu
     */
    createTeamOrderWindow() {
        const rect = new Rectangle(190, 20, 430, 95);
        const options: ChoicesOptions = {
            nbItemsMax: 4, // TODO : make sure it works for custom hero party?
            padding: WindowBox.VERY_SMALL_PADDING_BOX,
            space: 15,
            currentSelectedIndex: -1
        };

        this.windowChoicesTeam = new WindowChoices(rect.x, rect.y, rect.width, rect.height, this.partyGraphics(), options);
    }

    /**
     * Create the time and currencies window.
     *
     * @memberof Menu
     */
    createWindowTimeCurrencies() {
        const rect = new Rectangle(20, 0, 150, 0);
        this.windowTimeCurrencies = new WindowBox(rect.x, rect.y, rect.width, rect.height, {
            content: new Graphic.TimeCurrencies(),
            padding: WindowBox.HUGE_PADDING_BOX
        });
        let h = (<Graphic.TimeCurrencies>this.windowTimeCurrencies.content)
            .height + this.windowTimeCurrencies.padding[1] +
            this.windowTimeCurrencies.padding[3];
        this.windowTimeCurrencies.setY(ScreenResolution.SCREEN_Y - 20 - h);
        this.windowTimeCurrencies.setH(h);
    }


    /**
     * Callback function for opening the inventory.
     *
     * @return {*} 
     * @memberof Menu
     */
    openInventory() {
        Manager.Stack.push(new Scene.MenuInventory());
        return true;
    }

    /**
     * Callback function for opening the skills menu.
     *
     * @return {*} 
     * @memberof Menu
     */
    openSkills() {
        Manager.Stack.push(new Scene.MenuSkills());
        return true;
    }

    /**
     * callback function for opening the equipment menu.
     *
     * @return {*} 
     * @memberof Menu
     */
    openEquip() {
        Manager.Stack.push(new Scene.MenuEquip());
        return true;
    }

    /**
     * Callback function for opening the player description state menu.
     *
     * @return {*} 
     * @memberof Menu
     */
    openState() {
        Manager.Stack.push(new Scene.MenuDescriptionState());
        return true;
    }

    /** 
     *  Callback function for reordering heroes.
     * 
     * @returns {*}
     * @memberof Menu
     */
    openOrder() {
        this.windowChoicesTeam.select(0);
        return true;
    }

    /** 
     *  Callback function for opening the save menu.
     * 
     * @returns {*}
     * @memberof Menu
     */
    openSave() {
        if (Scene.Map.allowSaves) {
            Manager.Stack.push(new Scene.SaveGame());
            return true;
        }
        return false;
    }

    /** 
     *  Callback function for quitting the game.
     * 
     * @returns {*}
     * @memberof Menu
     */
    exit() {
        Manager.Stack.replace(new Scene.TitleScreen());
        return true;
    }

    /** 
     *  Update the scene.
     * 
     * @memberof Menu
     */
    update() {
        super.update();

        this.windowTimeCurrencies.content.update();
        for (let i = 0, l = this.windowChoicesTeam.listWindows.length; i < l; i++) {
            (<Graphic.Player>this.windowChoicesTeam.listWindows[i].content)
                .updateBattler();
        }
    }

    /**
     * return whether the key action is quitting to map and in window command.
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Menu
     */
    isKeyQuittingToMap(key: number): boolean {
        const kb = Datas.Keyboards;
        return (kb.isKeyEqual(key, kb.menuControls.Cancel)
            || kb.isKeyEqual(key, kb.controls.MainMenu));
    }

    /**
     * return whether the key action is quitting the order screen.
     *
     * @param {number} key
     * @return {*}  {boolean}
     * @memberof Menu
     */
    isKeyQuittingReorder(key: number): boolean {
        const kb = Datas.Keyboards;
        return (kb.isKeyEqual(key, kb.menuControls.Cancel)
            || kb.isKeyEqual(key, kb.controls.MainMenu));
    }

    /**
     * function called when quitting the menu.
     *
     * @memberof Menu
     */
    onQuitMenu() {
        Datas.Systems.soundCancel.playSound();
        Manager.Stack.pop();
    }

    /**
     * function called when quitting the team order selection.
     *
     * @memberof Menu
     */
    onTeamUnselect() {
        Datas.Systems.soundCancel.playSound();
        this.windowChoicesTeam.unselect();
    }

    /**
     * swap two hero index in the active team.
     *
     * @param {number} id1
     * @param {number} id2
     * @memberof Menu
     */
    swapHeroOrder(id1: number, id2: number) {
        let hero1 = this.party()[id1];
        let hero2 = this.party()[id2];
        this.party()[id1] = hero2;
        this.party()[id2] = hero1;
    }

    /**
     * function executed when you choose the order command.
     *
     * @memberof Menu
     */
    onTeamSelect() {
        Datas.Systems.soundConfirmation.playSound();
        const winTeam = this.windowChoicesTeam;
        const currentSelectedHero = winTeam.currentSelectedIndex;

        // If selecting the first hero to interchange
        if (this.selectedOrder === -1) {
            this.selectedOrder = currentSelectedHero;
        } else {

            this.swapHeroOrder(this.selectedOrder, currentSelectedHero);

            let graphic1 = winTeam.getContent(this.selectedOrder);
            let graphic2 = winTeam.getContent(currentSelectedHero);

            winTeam.setContent(this.selectedOrder, graphic2);
            winTeam.setContent(currentSelectedHero, graphic1);

            // Change background color
            winTeam.listWindows[this.selectedOrder]
                .selected = false;
            this.selectedOrder = -1;
            winTeam.select(currentSelectedHero);
        }
    }

    /** 
     *  @inheritdoc
     * 
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        const kb = Datas.Keyboards;

        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            this.windowChoicesCommands.onKeyPressed(key, this);

            // Quit the menu if cancelling + in window command
            if (this.isKeyQuittingToMap(key)) {
                this.onQuitMenu();
            }
        } else {
            // If in reorder team window
            if (this.isKeyQuittingReorder(key)) {
                this.onTeamUnselect();
            } else if (kb.isKeyEqual(key, kb.menuControls.Action)) {
                this.onTeamSelect();
            }
        }
    }

    /** 
     *  @inheritdoc
     * 
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number) {
        super.onKeyReleased(key);
    }

    /** 
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean {
        return super.onKeyPressedAndRepeat(key);
    }

    /** 
     *  @inheritdoc
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        super.onKeyPressedAndRepeat(key);
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        } else {
            return this.windowChoicesTeam.onKeyPressedAndRepeat(key);
        }
    }

    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    drawHUD() {
        // Draw the local map behind
        Scene.Map.current.drawHUD();

        // Draw the windows
        this.windowChoicesCommands.draw();
        this.windowChoicesTeam.draw();

        // Draw play time and currencies
        this.windowTimeCurrencies.draw();
    }

    /**
     * @inheritdoc
     *
     * @memberof Menu
     */
    close() {
        Manager.Stack.isInMainMenu = false;
    }
}

export { StructPositionChoice, Menu}