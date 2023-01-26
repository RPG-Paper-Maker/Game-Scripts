/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MenuBase } from "./MenuBase";
import { Manager, Graphic, Scene, Datas } from "../index";
import { WindowBox, WindowChoices, Game, Rectangle } from "../Core";
import { Enum } from "../Common";
import Align = Enum.Align;
import OrientationWindow = Enum.OrientationWindow;


/**
 * The scene menu describing players statistics.
 *
 * @class MenuDescriptionState
 * @extends {Base}
 */
class MenuDescriptionState extends MenuBase {

    public title: string;

    /**
     * the top window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    public windowTop: WindowBox;

    /**
     * the choices tabs window
     *
     * @type {WindowChoices}
     * @memberof MenuDescriptionState
     */
    public windowChoicesTabs: WindowChoices;

    /**
     * the information window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    public windowInformation: WindowBox;
    

    /**
     * Creates an instance of MenuDescriptionState.
     * @memberof MenuDescriptionState
     */
    constructor(title: string) {
        super();
        this.title = title;
        this.createAllWindows();
        this.synchronize();
    }

    /**
     * create all the windows in the scene.
     *
     * @memberof MenuDescriptionState
     */
    createAllWindows() {
        this.createWindowTabs();
        this.createWindowTop();
        this.createWindowInformation();
    }

    /**
     * create the top window.
     *
     * @memberof MenuDescriptionState
     */
    createWindowTop() {
        const rect = new Rectangle(20, 20, 200, 30);
        const options = {
            content: new Graphic.Text(this.title, { align: Align.Center })
        };
        this.windowTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
    }

    /**
     * create the tab window containing the heros.
     *
     * @memberof MenuDescriptionState
     */
    createWindowTabs() {
        const rect = new Rectangle(50, 60, 110, WindowBox.SMALL_SLOT_HEIGHT);
        const options = { orientation: OrientationWindow.Horizontal, nbItemsMax: 4 }
        const listHeroes = [];
        for (let i = 0; i < this.party().length; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(this.party()[i]);
        }
        this.windowChoicesTabs = new WindowChoices(rect.x, rect.y, rect.width, rect.height, listHeroes, options)
    }

    /**
     * create the information window
     *
     * @memberof MenuDescriptionState
     */
    createWindowInformation(){
        const rect = new Rectangle(20,100,600,340);
        this.windowInformation = new WindowBox(rect.x, rect.y, rect.width,rect.height, 
            {padding: WindowBox.HUGE_PADDING_BOX});
    }

    /**
     * Synchronize information's with the selected hero.
     *
     * @memberof MenuDescriptionState
     */
    synchronize() {
        this.windowInformation.content = this.windowChoicesTabs
            .getCurrentContent();
    }

    /** 
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }

    /** 
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (isKey) {
            this.windowChoicesTabs.onKeyPressedAndRepeat(options.key);
        } else {
            this.windowChoicesTabs.onMouseMove(options.x, options.y);
        }
        this.synchronize();
    }
    
    /**
     * @inheritdoc
     *
     * @memberof MenuDescriptionState
     */
    update() {
        super.update();
        this.windowChoicesTabs.update();
        (<Graphic.PlayerDescription>this.windowInformation.content)
            .updateBattler();
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @memberof MenuDescriptionState
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Scene.Map.current, key);
        this.action(true, { key: key });
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @memberof MenuDescriptionState
     */
    onKeyReleased(key: number) {
        Scene.Base.prototype.onKeyReleased.call(Scene.Map.current, key);
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @return {*}  {boolean}
     * @memberof MenuDescriptionState
     */
    onKeyPressedRepeat(key: number): boolean {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Scene.Map.current, key);
    }

    /**
     * @inheritdoc
     *
     * @param {number} key - the key id
     * @return {*}  {boolean}
     * @memberof MenuDescriptionState
     */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Scene.Map
            .current, key);
        this.move(true, { key: key });
        return res;
    }

    /** 
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number) {
        super.onMouseMove(x, y);
        this.move(false, { x: x, y: y });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number) {
        super.onMouseUp(x, y);
        this.action(false, { x: x, y: y });
    }

    /**
     * @inheritdoc
     *
     * @memberof MenuDescriptionState
     */
    drawHUD() {
        // Draw the local map behind
        Scene.Map.current.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowInformation.draw();
    }
}

export { MenuDescriptionState }