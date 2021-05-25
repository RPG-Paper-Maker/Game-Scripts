/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Datas, Manager, Scene } from "../index.js";
import { MapObject, Position, ReactionInterpreter, Game, Frame } from "../Core/index.js";
import { Constants, Platform, ScreenResolution, Utils } from "../Common/index.js";
/** @class
 *  An event command for teleporting an object.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class TeleportObject extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        // Object ID
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
        // Position
        this.objectIDPosition = null;
        this.mapID = null;
        switch (command[iterator.i++]) {
            case 0:
                this.mapID = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.x = System.DynamicValue.createNumber(command[iterator.i++]);
                this.y = System.DynamicValue.createNumber(command[iterator.i++]);
                this.yPlus = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.z = System.DynamicValue.createNumber(command[iterator.i++]);
                break;
            case 1:
                this.mapID = System.DynamicValue.createValueCommand(command, iterator);
                this.x = System.DynamicValue.createValueCommand(command, iterator);
                this.y = System.DynamicValue.createValueCommand(command, iterator);
                this.yPlus = System.DynamicValue.createValueCommand(command, iterator);
                this.z = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 2:
                this.objectIDPosition = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        // Transition
        this.direction = command[iterator.i++];
        this.transitionStart = command[iterator.i++];
        if (Utils.numToBool(this.transitionStart)) {
            this.transitionStartColor = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.transitionEnd = command[iterator.i++];
        if (Utils.numToBool(this.transitionEnd)) {
            this.transitionEndColor = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.isDirectNode = false;
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            position: null,
            waitingPosition: false,
            waitingObject: false,
            teleported: false,
            transitionedStart: this.transitionStart === 0,
            transitionedEnd: this.transitionEnd === 0,
            startColor: this.transitionStart === 1 ? Datas.Systems.getColor(this
                .transitionStartColor.getValue()) : null,
            endColor: this.transitionEnd === 1 ? Datas.Systems.getColor(this
                .transitionEndColor.getValue()) : null,
            transitionColorAlpha: 0,
            transitioning: false,
            frame: new Frame(TeleportObject.TRANSITION_DURATION)
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
        // Apply start transition
        if (!currentState.transitionedStart) {
            if (currentState.transitionColorAlpha < 1) {
                currentState.transitionColorAlpha = currentState.frame.update()
                    ? 1 : currentState.frame.tick / TeleportObject
                    .TRANSITION_DURATION;
            }
            if (currentState.transitionColorAlpha !== 1) {
                return 0;
            }
        }
        // Search object
        if (!currentState.waitingObject) {
            let objectID = this.objectID.getValue();
            if (!currentState.waitingPosition) {
                // Set object's position
                if (this.objectIDPosition === null) {
                    currentState.position = new Position(this.x.getValue(), this
                        .y.getValue(), this.z.getValue(), this.yPlus.getValue()
                        * 100 / Datas.Systems.SQUARE_SIZE).toVector3();
                }
                else {
                    MapObject.search(this.objectIDPosition.getValue(), (result) => {
                        currentState.position = result.object.position;
                    }, object);
                }
                currentState.waitingPosition = true;
            }
            if (currentState.position !== null) {
                MapObject.search(objectID, async (result) => {
                    // If needs teleport hero in another map
                    if (this.mapID !== null) {
                        let id = this.mapID.getValue();
                        // If hero set the current map
                        if (result.object.isHero) {
                            Game.current.hero.position = currentState
                                .position;
                            if (Scene.Map.current.id !== id) {
                                let map = new Scene.Map(id);
                                map.reactionInterpreters.push(ReactionInterpreter.currentReaction);
                                Manager.Stack.replace(map);
                            }
                            else {
                                await Scene.Map.current.loadPortions(true);
                            }
                        }
                    }
                    result.object.teleport(currentState.position);
                    currentState.teleported = true;
                }, object);
                currentState.waitingObject = true;
            }
        }
        // Apply end transition
        if (currentState.teleported && !currentState.transitionedEnd) {
            if (!currentState.transitioning) {
                currentState.frame.reset();
            }
            currentState.transitionedStart = true;
            currentState.transitioning = true;
            if (currentState.transitionColorAlpha > 0) {
                currentState.transitionColorAlpha = currentState.frame.update()
                    ? 0 : (TeleportObject.TRANSITION_DURATION - currentState
                    .frame.tick) / TeleportObject.TRANSITION_DURATION;
            }
            if (currentState.transitionColorAlpha === 0) {
                currentState.transitionedEnd = true;
                currentState.transitioning = false;
            }
            else {
                return 0;
            }
        }
        return currentState.teleported ? 1 : 0;
    }
    /**
     *  Draw the HUD
     *  @param {Record<string ,any>} - currentState The current state of the event
     */
    drawHUD(currentState) {
        if (!currentState.transitionedStart) {
            Platform.ctx.fillStyle = Constants.STRING_RGBA + Constants
                .STRING_PARENTHESIS_LEFT + currentState.startColor.red
                + Constants.STRING_COMA + currentState.startColor.green
                + Constants.STRING_COMA + currentState.startColor.blue
                + Constants.STRING_COMA + currentState.transitionColorAlpha +
                Constants.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        }
        if (currentState.transitioning && !currentState.transitionedEnd) {
            Platform.ctx.fillStyle = Constants.STRING_RGBA + Constants
                .STRING_PARENTHESIS_LEFT + currentState.endColor.red
                + Constants.STRING_COMA + currentState.endColor.green
                + Constants.STRING_COMA + currentState.endColor.blue
                + Constants.STRING_COMA + currentState.transitionColorAlpha +
                Constants.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
        }
    }
}
TeleportObject.TRANSITION_DURATION = 1000;
export { TeleportObject };
