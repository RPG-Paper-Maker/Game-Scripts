/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from "../Common";
import { SpecialElement } from "./SpecialElement";

/** @class
 *  Abn autotile of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  autotile
 */
class Autotile extends SpecialElement {

    public isAnimated: boolean;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} - json Json object describing the mountain
     */
    read(json: Record<string, any>) {
        super.read(json);
        this.isAnimated = Utils.defaultValue(json.isAnimated, false);
    }
}

export { Autotile }