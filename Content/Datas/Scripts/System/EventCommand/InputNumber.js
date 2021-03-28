/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Game, WindowChoices } from "../Core/index.js";
import { Mathf, ScreenResolution } from "../Common/index.js";
import { Datas, Manager, System } from "../index.js";
import { SpinBox } from "../Core/SpinBox.js";
/** @class
 *  An event command for entering a number inside a variable.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class InputNumber extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.stockVariableID = System.DynamicValue.createValueCommand(command, iterator);
        this.digits = System.DynamicValue.createValueCommand(command, iterator);
        this.isDirectNode = false;
    }
    /**
     *  Set the show text property.
     *  @param {EventCommand.ShowText} showText - The show text value
     */
    setShowText(showText) {
        this.showText = showText;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let spinBoxes = [];
        let digits = this.digits.getValue();
        let w = 50;
        let h = 50;
        let totalWidth = w * digits;
        let x = (ScreenResolution.SCREEN_X - totalWidth) / 2;
        let y = (ScreenResolution.SCREEN_Y - h) / 2;
        for (let i = 0; i < digits; i++) {
            spinBoxes.push(new SpinBox(x + (i * w), y, { w: w, h: h, value: 0,
                min: 0, max: 9, active: false, allowLeftRight: false, times: false }));
        }
        spinBoxes[0].setActive(true);
        Manager.Stack.requestPaintHUD = true;
        return {
            spinBoxes: spinBoxes,
            digits: digits,
            confirmed: false,
            index: 0,
            startTime: new Date().getTime()
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        if (currentState.confirmed) {
            let value = "";
            for (let i = 0; i < currentState.digits; i++) {
                value += currentState.spinBoxes[i].value;
            }
            Game.current.variables[this.stockVariableID.getValue(true)] = parseInt(value);
            return 1;
        }
        return 0;
    }
    /**
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState, key) {
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)
            || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls
            .MainMenu)) {
            currentState.confirmed = true;
        }
    }
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState, key) {
        currentState.spinBoxes[currentState.index].onKeyPressedAndRepeat(key);
        // Wait for a slower update
        let t = new Date().getTime();
        if (t - currentState.startTime >= WindowChoices.TIME_WAIT_PRESS) {
            currentState.startTime = t;
            currentState.spinBoxes[currentState.index].setActive(false);
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Right)) {
                currentState.index = Mathf.mod(currentState.index + 1, currentState.digits);
                Datas.Systems.soundCursor.playSound();
                Manager.Stack.requestPaintHUD = true;
            }
            else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Left)) {
                currentState.index = Mathf.mod(currentState.index - 1, currentState.digits);
                Datas.Systems.soundCursor.playSound();
                Manager.Stack.requestPaintHUD = true;
            }
            currentState.spinBoxes[currentState.index].setActive(true);
        }
        return true;
    }
    /**
     *  Draw the HUD.
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        if (this.showText) {
            this.showText.drawHUD();
        }
        for (let i = 0; i < currentState.digits; i++) {
            currentState.spinBoxes[i].draw();
        }
    }
}
export { InputNumber };
