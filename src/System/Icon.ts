/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   Something at least including an icon
 *   @extends {SystemLang}
 *   @property {number} pictureID The icon picture ID
 *   @param {Object} [json=undefined] Json object describing the icon
 */
import {Lang, SystemStructure} from ".";

export class Icon extends Lang implements SystemStructure {
    pictureID: number;

    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.pictureID = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the icon
     *   @param {Object} json Json object describing the icon
     */
    read(json) {
        super.read(json);

        this.pictureID = json.pid;
    }
}
