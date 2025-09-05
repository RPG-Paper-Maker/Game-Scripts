/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Node, Tree } from '../Core';
import { EventCommand, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  A reaction to an event.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object reaction
 */
class Reaction extends Base {
	public labels: [Model.DynamicValue, Node][];
	public idEvent: number;
	public blockingHero: boolean;
	public commands: Tree;
	public event: Model.Event;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the object reaction.
	 *  @param {Record<string, any>} - json Json object describing the object
	 *  reaction
	 */
	read(json: Record<string, any>) {
		this.labels = [];
		this.idEvent = json.id;

		// Options
		this.blockingHero = json.bh;

		// Read commands
		const jsonCommands = json.c;
		const commands = new Tree('root');
		this.readChildrenJSON(jsonCommands, commands.root);
		this.commands = commands;
	}

	/**
	 *  Read the JSON children associated to the object reaction.
	 *  @param {Record<string, any>} - jsonCommands Json object describing the
	 *  object
	 *  @param {Node} commands - All the commands (final result)
	 */
	readChildrenJSON(jsonCommands: Record<string, any>, commands: Node) {
		let showText: EventCommand.ShowText = null;
		let command: EventCommand.Base, node: Node;
		for (let i = 0, l = jsonCommands.length; i < l; i++) {
			command = Manager.Events.getEventCommand(jsonCommands[i]);

			// Comment
			if (command instanceof EventCommand.Comment) {
				continue;
			}

			// Add node
			node = commands.add(command);

			// If text before choice, make a link
			if (command instanceof EventCommand.ShowText) {
				showText = command;
			} else if (command instanceof EventCommand.DisplayChoice || command instanceof EventCommand.InputNumber) {
				command.setShowText(showText);
				showText = null;
			} else if (command instanceof EventCommand.Label) {
				this.labels.push([command.name, node]);
				showText = null;
			} else {
				showText = null;
			}
			if (jsonCommands[i].children) {
				this.readChildrenJSON(jsonCommands[i].children, node);
			}
		}
	}

	/**
	 *  Get the first node command of the reaction.
	 *  @returns {Node}
	 */
	getFirstCommand(): Node {
		return this.commands.root.firstChild;
	}
}

export { Reaction };
