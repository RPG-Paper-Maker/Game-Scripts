/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A troop of the game
 *   @property {Object[]} list list of the monsters (ids, level)
 *   @param {Object} [json=undefined] Json object describing the troop
 */
class SystemTroop {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the troop
     *   @param {Object} json Json object describing the troop
     */
    read(json) {
        let jsonList = json.l;
        let l = jsonList.length;
        this.list = new Array(l);
        let jsonElement;
        for (let i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            this.list[i] =
                {
                    id: jsonElement.id,
                    level: jsonElement.l
                };
        }
    }
}