/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Utils } from '../Common';
import { Base } from './Base';

/** @class
 *  A custom plugin in the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  plugin
 */
class Plugin extends Base {
	public id: number;
	public name: string;
	public author: string;
	public version: string;
	public parameters: Record<string, Model.DynamicValue>;
	public commands: Record<string, Function>;
	public commandsNames: string[];

	constructor(id: number, json?: Record<string, any>) {
		super(json);

		this.id = id;
	}

	/**
	 *  Read the JSON associated to the plugin.
	 *  @param {Record<string, any>} - json Json object describing the plugin
	 */
	read(json: Record<string, any>) {
		this.name = json.name;
		this.author = Utils.valueOrDefault(json.author, '');
		this.version = Utils.valueOrDefault(json.version, '1.0.0');
		this.parameters = {};
		let jsonList = Utils.valueOrDefault(json.parameters, []);
		let obj: Model.DynamicValue, jsonObj: Record<string, any>;
		let i: number, l: number;
		for (i = 0, l = jsonList.length; i < l; i++) {
			jsonObj = jsonList[i];
			obj = Model.DynamicValue.readOrDefaultNumber(jsonObj.defaultValue);
			this.parameters[jsonObj.name] = obj;
		}
		this.commands = {};
		this.commandsNames = [];
		jsonList = Utils.valueOrDefault(json.commands, []);
		for (i = 0, l = jsonList.length; i < l; i++) {
			jsonObj = jsonList[i];
			this.commands[jsonObj.name] = null;
			this.commandsNames[jsonObj.id] = jsonObj.name;
		}
	}
}

export { Plugin };
