/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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

    /**
     * the top window
     *
     * @type {WindowBox}
     * @memberof MenuDescriptionState
     */
    public windowTop: WindowBox;
    public windowChoicesTabs: WindowChoices;
    public windowInformations: WindowBox;

    constructor() {
        super();

        // Tab heroes
        let nbHeroes = Game.current.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(Game.current
                .teamHeroes[i]);
        }

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
            content: new Graphic.Text("State", { align: Align.Center })
        }
        );
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox
            .SMALL_SLOT_HEIGHT, listHeroes, {
            orientation: OrientationWindow.Horizontal,
            nbItemsMax: 4
        }
        );
        this.windowInformations = new WindowBox(20, 100, 600, 340, {
            padding: WindowBox.HUGE_PADDING_BOX
        }
        );
        this.synchronize();
    }

    create() {
        this.createAllWindows();
    }

    createAllWindows() {
        this.createWindowTop();
        this.createWindowTabs();
    }

    createWindowTop() {
        const rect = new Rectangle(20, 20, 200, 30);
        const options = {
            content: new Graphic.Text("State", { align: Align.Center })
        };
        this.windowTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
    }

    createWindowTabs() {
        const rect = new Rectangle(50, 60, 110, WindowBox.SMALL_SLOT_HEIGHT);
        const options = { orientation: OrientationWindow.Horizontal, nbItemsMax: 4 }
        const listHeroes = [];
        for (let i = 0; i < this.party().length; i++) {
            listHeroes[i] = new Graphic.Player(this.party()[i]);
        }
        this.windowChoicesTabs = new WindowChoices(rect.x, rect.y, rect.width, rect.height, listHeroes, options)
    }


    /**
     *  Synchronize informations with selected hero.
     */
    synchronize() {
        this.windowInformations.content = this.windowChoicesTabs
            .getCurrentContent();
    }

    /** 
     *  Update the scene
     */
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);
        (<Graphic.PlayerDescription>this.windowInformations.content)
            .updateBattler();
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Scene.Map.current, key);
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel)
            || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
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
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        this.synchronize();
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
        this.windowInformations.draw();
    }
}

export { MenuDescriptionState }