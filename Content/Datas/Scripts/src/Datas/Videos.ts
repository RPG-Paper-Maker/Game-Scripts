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
 *  All the videos datas
 *  @property {System.Video[]} list List of all the videos of the game
 *  according to ID
 */
class Videos {

    private static list: System.Video[];

    constructor()
    {

    }

    /** 
     *  Read the JSON file associated to videos
     */
    static async read()
    {
        let json = (await IO.parseFileJSON(Paths.FILE_VIDEOS)).list;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
            .Video });
    }

    /** 
     *  Get the corresponding video.
     *  @param {number} id
     *  @returns {System.Video}
     */
    static get(id: number): System.Video
    {
        return Datas.Base.get(id, this.list, "video");
    }
}

export { Videos }
