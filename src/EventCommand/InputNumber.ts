/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { MapObject, Game, WindowChoices } from "../Core";
import { Mathf, ScreenResolution } from "../Common";
import { Datas, EventCommand, Manager, Scene, System } from "..";
import { SpinBox } from "../Core/SpinBox";

/** @class
 *  An event command for entering a number inside a variable.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class InputNumber extends Base {

    public stockVariableID: System.DynamicValue;
    public digits: System.DynamicValue;
    public showText: EventCommand.ShowText;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        };
        this.stockVariableID = System.DynamicValue.createValueCommand(command, 
            iterator);
        this.digits = System.DynamicValue.createValueCommand(command, iterator);
    }

    /** 
     *  Set the show text property.
     *  @param {EventCommand.ShowText} showText - The show text value
     */
    setShowText(showText: EventCommand.ShowText) {
        this.showText = showText;
    }

    /** 
     *  An event action.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(currentState: Record<string ,any>, isKey: boolean, options: { key?: 
        number, x?: number, y?: number } = {}) {
        if (Scene.MenuBase.checkActionMenu(isKey, options) || Scene.MenuBase
            .checkCancel(isKey, options)) {
            currentState.confirmed = true;
        }
    }

    /** 
     *  An event move.
     *  @param {Record<string ,any>} currentState
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(currentState: Record<string ,any>, isKey: boolean, options: { key?: 
        number, x?: number, y?: number } = {}) {
        currentState.spinBoxes[currentState.index].move(isKey, options);
    
        // Wait for a slower update
        let t = new Date().getTime();
        if (!isKey || (isKey && t - currentState.startTime >= WindowChoices
            .TIME_WAIT_PRESS)) {
            currentState.startTime = t;
            currentState.spinBoxes[currentState.index].setActive(false);
            if (isKey) {
                if (Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards
                    .menuControls.Right)) {
                    currentState.index = Mathf.mod(currentState.index + 1, 
                        currentState.digits);
                    Datas.Systems.soundCursor.playSound();
                    Manager.Stack.requestPaintHUD = true;
                } else if (Datas.Keyboards.isKeyEqual(options.key, Datas
                    .Keyboards.menuControls.Left)) {
                    currentState.index = Mathf.mod(currentState.index - 1, 
                        currentState.digits);
                    Datas.Systems.soundCursor.playSound();
                    Manager.Stack.requestPaintHUD = true;
                }
            } else {
                for (let i = 0; i < currentState.digits; i++) {
                    if (currentState.index !== i && currentState.spinBoxes[i]
                        .isInside(options.x, options.y)) {
                        currentState.index = i;
                        Datas.Systems.soundCursor.playSound();
                        Manager.Stack.requestPaintHUD = true;
                    }
                }
            }
            currentState.spinBoxes[currentState.index].setActive(true);
        }
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        let spinBoxes = [];
        let digits = this.digits.getValue();
        let w = 50;
        let h = 50;
        let totalWidth = w * digits;
        let x = (ScreenResolution.SCREEN_X - totalWidth) / 2;
        let y = (ScreenResolution.SCREEN_Y - h) / 2;
        for (let i = 0; i < digits; i++) {
            spinBoxes.push(new SpinBox(x + (i * w), y , { w: w, h: h, value: 0, 
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
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        for (let spinbox of currentState.spinBoxes) {
            spinbox.update();
        }
        if (currentState.confirmed) {
            let value = "";
            for (let spinbox of currentState.spinBoxes) {
                value += spinbox.value;
            }
            Game.current.variables[this.stockVariableID.getValue(true)] = 
                parseInt(value);
            return 1;
        }
        return 0;
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Record<string, any>, key: number) {
        this.action(currentState, true, { key: key });
    }

    /** 
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState: Record<string, any>, key: number): boolean {
        this.move(currentState, true, { key: key });
        return true;
    }

    /** 
     *  @inheritdoc
     */
    onMouseMove(currentState: Record<string, any>, x: number, y: number) {
        this.move(currentState, false, { x: x, y: y });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(currentState: Record<string, any>, x: number, y: number) {
        this.action(currentState, false, { x: x, y: y });
    }

    /** 
     *  Draw the HUD.
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState: Record<string, any>) {
        if (this.showText) {
            this.showText.drawHUD();
        }
        for (let i = 0; i < currentState.digits; i++) {
            currentState.spinBoxes[i].draw();
        }
    }
}

export { InputNumber }