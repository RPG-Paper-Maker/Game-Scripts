/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
/** @class
 *  A battle map of the game.
 *  @property {number} idMap The map ID
 *  @property {number[]} position The json position
 *  @param {Record<string, any>} [json=undefined] Json object describing the battle map
 */
class BattleMap extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Create a System battle map.
     *  @static
     *  @param {number} idMap The map ID
     *  @param {number[]} position The json position
     *  @returns {System.BattleMap}
     */
    static create(idMap, position) {
        let map = new BattleMap();
        map.idMap = idMap;
        map.position = position;
        return map;
    }
    /**
     *  Read the JSON associated to the battle map.
     *  @param {Record<string, any>} json Json object describing the battle map
     */
    read(json) {
        this.idMap = json.idm;
        this.position = json.p;
    }
}
export { BattleMap };
