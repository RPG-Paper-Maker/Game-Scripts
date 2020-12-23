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
import { System } from "../index";

/** @class
 *  A custom plugin in the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  plugin
 */
class Plugin extends Base {

    public id: number;
    public name: string;
    public isOn: boolean;
    public author: string;
    public version: string;
    public parameters: Record<string, System.DynamicValue>;

    constructor(id: number, json?: Record<string, any>) {
        super(json);

        this.id = id;
    }

    /** 
     *  Read the JSON associated to the plugin.
     *  @param {Record<string, any>} json Json object describing the plugin
     */
    read(json: Record<string, any>) {
        this.name = json.name;
        this.isOn = Utils.defaultValue(json.isOn, true);
        this.author = Utils.defaultValue(json.author, "");
        this.version = Utils.defaultValue(json.version, "1.0.0");
        this.parameters = {};
        let jsonList = Utils.defaultValue(json.parameters, []);
        let parameter: System.DynamicValue, jsonParameter: Record<string, any>;
        for (let i = 0, l = jsonList.length; i < l; i++) {
            jsonParameter = jsonList[i];
            parameter = System.DynamicValue.readOrDefaultNumber(jsonParameter
                .defaultValue);
            this.parameters[jsonParameter.name] = parameter;
        }
        /*
        this.commands = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.commands, []), 
            listIndexes: this.commands, cons: System.PluginCommand });
        */
    }
}

export { Plugin }