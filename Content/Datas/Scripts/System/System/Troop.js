/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System } from "../index.js";
import { Utils } from "../Common/index.js";
import { Base } from "./Base.js";
/** @class
 *  A troop of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  troop
 */
class Troop extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the troop.
     *  @param {Record<string, any>} - json Json object describing the troop
     */
    read(json) {
        let jsonList = Utils.defaultValue(json.l, []);
        let l = jsonList.length;
        this.list = new Array(l);
        let jsonElement;
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            this.list[i] = {
                id: jsonElement.id,
                level: jsonElement.l
            };
        }
        this.reactions = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.reactions, []),
            listIndexes: this.reactions, cons: System.TroopReaction });
    }
}
export { Troop };
