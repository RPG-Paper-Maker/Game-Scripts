/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Datas } from "..";
import { IO, Paths, Utils } from "../Common";
/** @class
 *  All the troops datas.
 *  @property {System.Troop[]} list List of all the troops of the game according
 *  to ID
 */
class Troops {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to troops
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_TROOPS)).troops;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
                .Troop });
    }
    /**
     *  Get the troop by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Troop}
     */
    static get(id) {
        return Datas.Base.get(id, this.list, "troop");
    }
}
export { Troops };
