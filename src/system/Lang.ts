/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from ".";
import {RPM} from "../core";

/** @class
 *   A name that can have several translations
 *   @property {Object} [Lang.EMPTY_NAMES={names:["",""]}] The default
 *   json for no names
 *   @property {string[]} [names=[]] The different names list according to lang
 *   ID
 *   @param {Object} [json=undefined] Json object describing the name in sevaral
 *   langs
 */
export class Lang extends BaseSystem {

    static EMPTY_NAMES = {names: ["", ""]};

    names: { names: string[] }[];

    constructor(json = undefined) {
        super(json)
    }

    public setup() {
        this.names = [];
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the name in sevaral langs
     *   @param {Object} json Json object describing the name in sevaral langs
     */
    read(json) {
        this.names = RPM.defaultValue(json.names, [null, json[1]]);
    }

    // -------------------------------------------------------
    /** Get the name according to current lang
     *   @returns {string}
     */
    name() {
        return this.names[1];
    }

    // -------------------------------------------------------
    /** Update lang according to a command list and iterator
     */
    getCommand(command, iterator) {
        let id = command[iterator.i++];
        let name = command[iterator.i++];
        this.names[id] = name;
    }

}