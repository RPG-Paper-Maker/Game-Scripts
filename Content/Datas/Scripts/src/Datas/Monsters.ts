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
 *  All the monsters datas.
 *  @property {System.Monster[]} list List of all the monsters of the game
 *  according to ID
 */
class Monsters {

    private static list: System.Monster[];

    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the JSON file associated to monsters.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_MONSTERS)).monsters;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
            .Monster });
    }

    /** 
     *  Get the monster by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Monster}
     */
    static get(id: number): System.Monster {
        return Datas.Base.get(id, this.list, "monster");
    }
}

export { Monsters }