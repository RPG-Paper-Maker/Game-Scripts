/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System } from "..";
import { Position } from "../Core";

/** @class
 *  A battle map of the game.
 *  @property {number} idMap The map ID
 *  @property {Position} position The position
 *  @param {Record<string, any>} [json=undefined] Json object describing the battle map
 */
class BattleMap extends Base {

    public idMap: number;
    public position: Position;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Create a System battle map.
     *  @static
     *  @param {number} idMap The map ID
     *  @param {number[]} position The json position
     *  @returns {System.BattleMap}
     */
    static create(idMap: number, position: number[]): BattleMap {
        let map = new BattleMap();
        map.idMap = idMap;
        map.position = Position.createFromArray(position);
        return map;
    }

    /** 
     *  Read the JSON associated to the battle map.
     *  @param {Record<string, any>} json Json object describing the battle map
     */
    read(json: Record<string, any>) {
        this.idMap = json.idm;
        this.position = json.p;
    }
}

export { BattleMap }