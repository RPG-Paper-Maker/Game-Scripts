/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SaveLoadGame } from "./SaveLoadGame";
import { Graphic, Datas, Manager, Scene } from "../index";
import { Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;
import { Game, Rectangle, WindowBox, WindowChoices } from "../Core";

/** @class
 *  A scene in the menu for saving a game.
 *  @extends Scene.SaveLoadGame
 */
class SaveGame extends SaveLoadGame {

    public windowBoxConfirm: WindowBox;
    public windowChoicesConfirm: WindowChoices;
    public step: number = 0;

    constructor() {
        super();
    }

    /**
     *  Create scene.
     */
    create() {
        super.create();
        this.createAllWindows();
    }

    /**
     *  Create all the windows in the scene.
     */
    createAllWindows() {
        this.createWindowBoxConfirm();
        this.createWindowChoicesConfirm();
    }

    /** 
     *  Create the window confirmation.
     */
    createWindowBoxConfirm() {
        const width = 200;
        const height = 75;
        const rect = new Rectangle((ScreenResolution.SCREEN_X - width) / 2, (
            ScreenResolution.SCREEN_Y - height) / 2, width, height);
        const graphic = new Graphic.Text("Confirm?", { align: Enum.Align.Center });
        const options = { 
            content: graphic
        };
        this.windowBoxConfirm = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, options);
    }

    /** 
     *  Create the window information on top.
     */
    createWindowChoicesConfirm() {
        const rect = new Rectangle(this.windowBoxConfirm.oX + ((this
            .windowBoxConfirm.oW - WindowBox.SMALL_SLOT_WIDTH) / 2), this
            .windowBoxConfirm.oY + this.windowBoxConfirm.oH, WindowBox
            .SMALL_SLOT_WIDTH, WindowBox.SMALL_SLOT_HEIGHT);
        const options = {
            listCallbacks: [
                () => { // YES
                    this.loading = true;
                    this.save();
                    this.step = 0;
                    return true;
                },
                () => { // NO
                    this.step = 0;
                    Manager.Stack.requestPaintHUD = true;
                    return false;
                }
            ]
        };
        const graphics = [
            new Graphic.Text("Yes", { align: Enum.Align.Center }),
            new Graphic.Text("No", { align: Enum.Align.Center })
        ];
        this.windowChoicesConfirm = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, graphics, options);
    }

    /** 
     *  Load async stuff.
     *  @async
     */
    async load() {
        await super.load();
        this.setContents.call(this, new Graphic.Text("Save a game", { align: 
            Align.Center }), new Graphic.Text(
            "Select a slot where you want to save.", { align: Align.Center }));
        this.loading = false;
    }

    /** 
     *  Save current game in the selected slot.
     */
    async save() {
        await Game.current.save(this.windowChoicesSlots.currentSelectedIndex + 1);
        Manager.Stack.pop();
        Manager.Stack.requestPaintHUD = true;
        this.loading = false;
    }

    /** 
     *  Slot action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        // If action, save in the selected slot
        if (Scene.MenuBase.checkActionMenu(isKey, options)) {
            switch (this.step) {
                case 0:
                    this.step = 1;
                    Datas.Systems.soundConfirmation.playSound();
                    Manager.Stack.requestPaintHUD = true;
                    break;
                case 1:
                    if (isKey) {
                        this.windowChoicesConfirm.onKeyPressed(options.key);
                    } else {
                        this.windowChoicesConfirm.onMouseUp(options.x, options.y);
                    }
                    break;
            }
        }
    }

    /** 
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        switch (this.step) {
            case 0:
                super.move(isKey, options);
                break;
            case 1:
                this.windowChoicesConfirm.move(isKey, options);
                break;
        }
    }

    /** 
     *  Handle scene key pressed.
     *   @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        this.action(true, { key: key });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }

    /** 
     *  Draw the HUD scene
     */
    drawHUD() {
        super.drawHUD();
        if (this.step === 1) {
            this.windowBoxConfirm.draw();
            this.windowChoicesConfirm.draw();
        }
    }
}

export { SaveGame }