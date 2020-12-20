/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { System, Datas, Manager, Scene } from "..";
import { MapObject, Position, ReactionInterpreter } from "../Core";
/** @class
 *  An event command for teleporting an object.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
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
        // Options
        // TODO
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
            teleported: false
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
                            Manager.Stack.game.hero.position = currentState
                                .position;
                            if (Manager.Stack.currentMap.id !== id) {
                                let map = new Scene.Map(id);
                                map.reactionInterpreters.push(ReactionInterpreter.currentReaction);
                                Manager.Stack.replace(map);
                            }
                            else {
                                await Manager.Stack.currentMap.loadPortions(true);
                            }
                        }
                    }
                    result.object.teleport(currentState.position);
                    currentState.teleported = true;
                }, object);
                currentState.waitingObject = true;
            }
        }
        return currentState.teleported ? 1 : 0;
    }
}
export { TeleportObject };
