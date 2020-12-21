/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System, Datas } from "..";
import { ReactionInterpreter } from "../Core";
import { Enum } from "../Common";
var PrimitiveValueKind = Enum.PrimitiveValueKind;
/** @class
 *  An event command for calling a common reaction.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class CallACommonReaction extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.commonReactionID = command[iterator.i++];
        this.parameters = [];
        let l = command.length;
        let paramID;
        while (iterator.i < l) {
            paramID = command[iterator.i++];
            this.parameters[paramID] = System.DynamicValue.createValueCommand(command, iterator);
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>}
     */
    initialize() {
        return {
            interpreter: null
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState, object, state) {
        if (!currentState.interpreter) {
            let reaction = Datas.CommonEvents.getCommonReaction(this
                .commonReactionID);
            // Correct parameters for default values
            let v, parameter, k;
            for (let id in reaction.parameters) {
                v = reaction.parameters[id].value;
                parameter = this.parameters[id];
                k = parameter ? parameter.kind : PrimitiveValueKind.None;
                if (k <= PrimitiveValueKind.Default) {
                    parameter = k === PrimitiveValueKind.Default ? v : System
                        .DynamicValue.create(k, null);
                }
                this.parameters[id] = parameter;
            }
            currentState.interpreter = new ReactionInterpreter(object, Datas
                .CommonEvents.getCommonReaction(this.commonReactionID), null, null, this.parameters);
        }
        ReactionInterpreter.blockingHero = currentState.interpreter
            .currentReaction.blockingHero;
        currentState.interpreter.update();
        if (currentState.interpreter.isFinished()) {
            currentState.interpreter.updateFinish();
            return 1;
        }
        return 0;
    }
    /**
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} key The key ID pressed
     */
    onKeyPressed(currentState, key) {
        if (currentState.interpreter && currentState.interpreter.currentCommand) {
            currentState.interpreter.currentCommand.data.onKeyPressed(currentState.interpreter.currentCommandState, key);
        }
        super.onKeyPressed(currentState, key);
    }
    /**
     *  First key release handle for the current stack.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} key The key ID pressed
     */
    onKeyReleased(currentState, key) {
        if (currentState.interpreter && currentState.interpreter.currentCommand) {
            currentState.interpreter.currentCommand.data.onKeyReleased(currentState.interpreter.currentCommandState, key);
        }
        super.onKeyReleased(currentState, key);
    }
    /**
     *  Key pressed repeat handle for the current stack.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} key The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedRepeat(currentState, key) {
        if (currentState.interpreter && currentState.interpreter.currentCommand) {
            return currentState.interpreter.currentCommand.data
                .onKeyPressedRepeat(currentState.interpreter.currentCommandState, key);
        }
        return super.onKeyPressedRepeat(currentState, key);
    }
    /**
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {number} key The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState, key) {
        if (currentState.interpreter && currentState.interpreter.currentCommand) {
            currentState.interpreter.currentCommand.data.onKeyPressedAndRepeat(currentState.interpreter.currentCommandState, key);
        }
        return super.onKeyPressedAndRepeat(currentState, key);
    }
    /**
     *  Draw the HUD.
     *  @param {Record<string, any>} currentState The current state of the event
     */
    drawHUD(currentState) {
        if (currentState.interpreter && currentState.interpreter.currentCommand) {
            currentState.interpreter.currentCommand.data.drawHUD(currentState
                .interpreter.currentCommandState);
        }
        super.drawHUD(currentState);
    }
}
export { CallACommonReaction };
