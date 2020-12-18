/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils } from "../Common";
import { Base } from "./Base";
/** @class
 *  A name that can have several translations.
 *  @extends {System.Base}
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  name in sevaral langs
 */
class Translatable extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Assign the default members.
     */
    setup() {
        this.names = [];
    }
    /**
     *  Read the JSON associated to the name in sevaral langs.
     *  @param {Record<string, any>} json Json object describing the name in
     *  sevaral langs
     */
    read(json) {
        this.names = Utils.defaultValue(json.names, ["", json[1]]);
    }
    /**
     *  Get the name according to current lang.
     *  @returns {string}
     */
    name() {
        return this.names[1];
    }
    /**
     *  Update lang according to a command list and iterator.
     */
    getCommand(command, iterator) {
        let id = command[iterator.i++];
        let name = command[iterator.i++];
        this.names[id] = name;
    }
}
Translatable.EMPTY_NAMES = {
    names: ["", ""]
};
export { Translatable };
