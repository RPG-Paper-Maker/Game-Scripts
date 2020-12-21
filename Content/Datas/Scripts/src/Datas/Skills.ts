/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { IO, Paths, Utils } from "../Common";
import { System, Datas } from "..";

/** @class
*   All the skills datas
*   @static
*/
class Skills {

    private static list: System.Skill[];
    
    constructor()
    {
        throw new Error("This is a static class!");
    }

    /** 
     *  Read the JSON file associated to skills.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_SKILLS)).skills;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
            .Skill });
    }

    /** 
     *  Get the skill by ID.
     *  @static
     *  @param {number} id
     *  @returns {System.Skill}
     */
    static get(id: number): System.Skill {
        return Datas.Base.get(id, this.list, "skill");
    }
}

export { Skills }