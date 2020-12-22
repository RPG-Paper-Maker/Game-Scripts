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
import { Utils } from "../Common";
import { MapObject } from "../Core";
/** @class
 *  An event command for battle processing.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
class StartBattle extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.battleMapID = null;
        this.mapID = null;
        this.x = null;
        this.y = null;
        this.yPlus = null;
        this.z = null;
        // Options
        this.canEscape = Utils.numToBool(command[iterator.i++]);
        this.canGameOver = Utils.numToBool(command[iterator.i++]);
        // Troop
        let type = command[iterator.i++];
        switch (type) {
            case 0: // Existing troop ID
                this.troopID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1: // If random troop in map properties
            // TODO
        }
        // Battle map
        type = command[iterator.i++];
        switch (type) {
            case 0: // Existing battle map ID
                this.battleMapID = System.DynamicValue.createValueCommand(command, iterator);
                break;
            case 1: // Select
                this.mapID = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.x = System.DynamicValue.createNumber(command[iterator.i++]);
                this.y = System.DynamicValue.createNumber(command[iterator.i++]);
                this.yPlus = System.DynamicValue.createNumber(command[iterator
                    .i++]);
                this.z = System.DynamicValue.createNumber(command[iterator.i++]);
                break;
            case 2: // Numbers
                this.mapID = System.DynamicValue.createValueCommand(command, iterator);
                this.x = System.DynamicValue.createValueCommand(command, iterator);
                this.y = System.DynamicValue.createValueCommand(command, iterator);
                this.yPlus = System.DynamicValue.createValueCommand(command, iterator);
                this.z = System.DynamicValue.createValueCommand(command, iterator);
                break;
        }
        // Transition
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
            mapScene: null,
            sceneBattle: null
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
        // Initializing battle
        if (currentState.sceneBattle === null) {
            let battleMap = (this.battleMapID === null) ? System.BattleMap
                .create(this.mapID.getValue(), [this.x.getValue(), this.y
                    .getValue(), this.yPlus.getValue(), this.z.getValue()]) : Datas
                .BattleSystems.getBattleMap(this.battleMapID.getValue());
            Manager.Stack.game.heroBattle = new MapObject(null, battleMap
                .position.toVector3());
            // Defining the battle state instance
            /*
            let sceneBattle = new Scene.Battle(this.troopID.getValue(), this
                .canGameOver, this.canEscape, battleMap, this.transitionStart,
                this.transitionEnd, this.transitionStartColor ? RPM.datasGame
                .system.colors[this.transitionStartColor.getValue()] : null,
                this.transitionEndColor ? RPM.datasGame.system.colors[this
                .transitionEndColor.getValue()] : null);
            
            // Keep instance of battle state for results
            currentState.sceneBattle = sceneBattle;
            currentState.mapScene = RPM.gameStack.top;
            RPM.gameStack.push(sceneBattle);
            */
            return 0; // Stay on this command as soon as we are in battle state
        }
        // If there are not game overs, go to win/lose nodes
        if (!this.canGameOver && !currentState.sceneBattle.winning) {
            return 2;
        }
        return 1;
    }
}
export { StartBattle };
