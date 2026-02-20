/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure describing a plugin.
 */
export type PluginJSON = {
	name: string;
	author?: string;
	version?: string;
	parameters?: { name: string; defaultValue: DynamicValueJSON }[];
	commands?: { id: number; name: string }[];
};

/**
 * A custom plugin in the game.
 */
export class Plugin extends Base {
	public id: number;
	public name: string;
	public author: string;
	public version: string;
	public parameters: Record<string, DynamicValue>;
	public commands: Record<string, (args: unknown[]) => void>;
	public commandsNames: Map<number, string>;

	constructor(id: number, json?: PluginJSON) {
		super(json);
		this.id = id;
	}

	/**
	 * Reads the JSON data and initializes the plugin.
	 */
	read(json: PluginJSON): void {
		this.name = json.name;
		this.author = Utils.valueOrDefault(json.author, '');
		this.version = Utils.valueOrDefault(json.version, '1.0.0');

		// Parameters
		this.parameters = {};
		for (const param of Utils.valueOrDefault(json.parameters, [])) {
			this.parameters[param.name] = DynamicValue.readOrDefaultNumber(param.defaultValue);
		}

		// Commands
		this.commands = {};
		this.commandsNames = new Map();
		for (const cmd of Utils.valueOrDefault(json.commands, [])) {
			this.commands[cmd.name] = null;
			this.commandsNames.set(cmd.id, cmd.name);
		}
	}
}
