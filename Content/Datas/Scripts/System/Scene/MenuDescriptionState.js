/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Manager, Graphic, Scene, Datas } from "../index.js";
import { WindowBox, WindowChoices } from "../Core/index.js";
import { Enum } from "../Common/index.js";
var Align = Enum.Align;
var OrientationWindow = Enum.OrientationWindow;
/** @class
 *  A scene in the menu for describing players statistics.
 *  @extends Scene.Base
 */
class MenuDescriptionState extends Base {
    constructor() {
        super(false);
        // Tab heroes
        let nbHeroes = Manager.Stack.game.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(Manager.Stack.game
                .teamHeroes[i]);
        }
        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
            content: new Graphic.Text("State", { align: Align.Center })
        });
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox
            .SMALL_SLOT_HEIGHT, listHeroes, {
            orientation: OrientationWindow.Horizontal,
            nbItemsMax: 4
        });
        this.windowInformations = new WindowBox(20, 100, 600, 340, {
            padding: WindowBox.HUGE_PADDING_BOX
        });
        this.synchronize();
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
        Scene.Base.prototype.update.call(Manager.Stack.currentMap);
        this.windowInformations.content
            .updateBattler();
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        Scene.Base.prototype.onKeyPressed.call(Manager.Stack.currentMap, key);
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel)
            || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }
    /**
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key) {
        Scene.Base.prototype.onKeyReleased.call(Manager.Stack.currentMap, key);
    }
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key) {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Manager.Stack
            .currentMap, key);
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Manager.Stack
            .currentMap, key);
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        this.synchronize();
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
        this.windowInformations.draw();
    }
}
export { MenuDescriptionState };
