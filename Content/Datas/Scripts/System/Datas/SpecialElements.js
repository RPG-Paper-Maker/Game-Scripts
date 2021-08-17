/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Utils } from "../Common/index.js";
import { System, Datas } from "../index.js";
/** @class
 *  All the special elements datas.
 *  @static
 */
class SpecialElements {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to special elements.
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_SPECIAL_ELEMENTS));
        this.autotiles = [];
        Utils.readJSONSystemList({ list: json.autotiles, listIDs: this.autotiles,
            cons: System.Autotile });
        this.walls = [];
        Utils.readJSONSystemList({ list: json.walls, listIDs: this.walls, cons: System.SpecialElement });
        this.mountains = [];
        Utils.readJSONSystemList({ list: json.m, listIDs: this.mountains, cons: System.Mountain });
        this.objects = [];
        Utils.readJSONSystemList({ list: json.o, listIDs: this.objects, cons: System.Object3D });
    }
    /**
     *  Get the autotile by ID.
     *  @param {number} id
     *  @returns {System.Autotile}
     */
    static getAutotile(id) {
        return Datas.Base.get(id, this.autotiles, "autotile");
    }
    /**
     *  Get the wall by ID.
     *  @param {number} id
     *  @returns {System.SpecialElement}
     */
    static getWall(id) {
        return Datas.Base.get(id, this.walls, "wall");
    }
    /**
     *  Get the mountain by ID.
     *  @param {number} id
     *  @returns {System.Mountain}
     */
    static getMountain(id) {
        return Datas.Base.get(id, this.mountains, "mountain");
    }
    /**
     *  Get the object 3D by ID.
     *  @param {number} id
     *  @returns {System.Object3D}
     */
    static getObject3D(id) {
        return Datas.Base.get(id, this.objects, "object 3D");
    }
}
export { SpecialElements };
