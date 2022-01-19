/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from "../Common";
import { Translatable } from "./Translatable";

/** @class
 *  Something at least including an icon.
 *  @extends {System.Translatable}
 *  @param {Object} [json=undefined] - Json object describing the icon
 */
class Icon extends Translatable {
    
    public pictureID: number;
    public pictureIndexX: number;
    public pictureIndexY: number;

    constructor(json) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the icon.
     *  @param {Record<string, any>} - json Json object describing the icon
     */
    read(json?: Record<string, any>) {
        super.read(json);

        this.pictureID = json.pid;
        this.pictureIndexX = Utils.defaultValue(json.pictureIndexX, 0);
        this.pictureIndexY = Utils.defaultValue(json.pictureIndexY, 0);
    }
}

export { Icon }