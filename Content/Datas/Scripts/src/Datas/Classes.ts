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
 *  All the classes datas.
 *  @property {System.Class[]} list List of all the classes of the game according
 *  to ID
 */
class Classes {

    private static list: System.Class[];

    constructor() {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the JSON file associated to classes
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_CLASSES)).classes;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
            .Class });
    }

    /** 
     *  Get the class by ID.
     *  @param {number} id
     *  @returns {System.Class}
     */
    static get(id: number): System.Class {
        return Datas.Base.get(id, this.list, "class");
    }
}

export { Classes }