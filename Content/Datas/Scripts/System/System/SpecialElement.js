/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base";
import { Utils } from "../Common";
/** @class
 *  A special element (autotile, wall, object3D, mountain) of the game.
 *  @property {number} pictureID The picture ID of the special element
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  special element
 */
class SpecialElement extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the special element.
     *  @param {Record<string, any>} json Json object describing the special
     *  element
     */
    read(json) {
        this.pictureID = Utils.defaultValue(json.pic, -1);
    }
}
export { SpecialElement };
