/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from "../Common";
import { EventCommand } from "..";
import { Base } from "./Base";

/** @class
 *  A name that can have several translations.
 *  @extends {System.Base}
 *  @property {string[]} [names=[]] The different names list according to lang
 *  ID
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  name in sevaral langs
 */
class Translatable extends Base {

    public static EMPTY_NAMES = 
    {
        names: ["", ""]
    }

    public names: string[];

    constructor(json?: Record<string, any>) {
        super(json)
    }

    /** 
     *  Assign the default members.
     */
    public setup() {
        this.names = [];
    }

    /** 
     *  Read the JSON associated to the name in sevaral langs.
     *  @param {Record<string, any>} json Json object describing the name in 
     *  sevaral langs
     */
    read(json: Record<string, any>): void {
        this.names = Utils.defaultValue(json.names, ["", json[1]]);
    }

    /** 
     *  Get the name according to current lang.
     *  @returns {string}
     */
    name(): string {
        return this.names[1];
    }

    /** 
     *  Update lang according to a command list and iterator.
     */
    getCommand(command: string[], iterator: EventCommand.StructIterator) {
        let id = command[iterator.i++];
        let name = command[iterator.i++];
        this.names[id] = name;
    }

}

export { Translatable }