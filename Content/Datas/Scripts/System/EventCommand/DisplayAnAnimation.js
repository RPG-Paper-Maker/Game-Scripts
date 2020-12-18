/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System, Datas, Manager } from "..";
import { Utils, Enum } from "../Common";
import { MapObject } from "../Core";
var AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
/** @class
 *  An event command for displaying an animation.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class DisplayAnAnimation extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
        this.animationID = System.DynamicValue.createValueCommand(command, iterator);
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.isDirectNode = !this.isWaitEnd;
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        let animation = Datas.Animations.get(this.animationID.getValue());
        return {
            parallel: this.isWaitEnd,
            animation: animation,
            picture: animation.createPicture(),
            frame: 1,
            frameMax: animation.frames.length - 1,
            object: null,
            waitingObject: false
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
        if (currentState.parallel) {
            if (!currentState.waitingObject) {
                let objectID = this.objectID.getValue();
                MapObject.search(objectID, (result) => {
                    currentState.object = result.object;
                }, object);
                currentState.waitingObject = true;
            }
            if (currentState.object !== null) {
                currentState.object.topPosition = Manager.GL.toScreenPosition(currentState.object.upPosition, Manager.Stack.currentMap
                    .camera.getThreeCamera());
                currentState.object.midPosition = Manager.GL.toScreenPosition(currentState.object.halfPosition, Manager.Stack.currentMap
                    .camera.getThreeCamera());
                currentState.object.botPosition = Manager.GL.toScreenPosition(currentState.object.position, Manager.Stack.currentMap
                    .camera.getThreeCamera());
                currentState.animation.playSounds(currentState.frame, AnimationEffectConditionKind.None);
                currentState.frame++;
                Manager.Stack.requestPaintHUD = true;
                return currentState.frame > currentState.frameMax ? 1 : 0;
            }
        }
        return 1;
    }
    /**
     *  Draw the HUD.
     *  @param {Record<string, any>} currentState The current state of the event
     */
    drawHUD(currentState) {
        if (currentState.object !== null) {
            currentState.animation.draw(currentState.picture, currentState.frame, currentState.object);
        }
    }
}
export { DisplayAnAnimation };
