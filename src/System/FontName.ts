/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, System } from "..";
import { Constants, Utils } from "../Common";
import { Base } from "./Base";

/** @class
 *  A font name of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  font name
 */
class FontName extends Base {

    public name: string;
    public isBasic: boolean;
    public font: System.DynamicValue;
    public customFontID: number;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the font name.
     *  @param {Record<string, any>} - json Json object describing the font name
     */
    read(json: Record<string, any>) {
        this.name = json.name;
        this.isBasic = Utils.defaultValue(json.isBasic, true);
        this.font = System.DynamicValue.readOrDefaultMessage(json.f, Constants
            .DEFAULT_FONT_NAME);
        this.customFontID = Utils.defaultValue(json.customFontID, 1);
    }

    /** 
     *  Get the font name (default or custom).
     *  @returns {string}
     */
    getName(): string {
        return this.isBasic ? this.font.getValue() : this.name;
    }
}

export { FontName }