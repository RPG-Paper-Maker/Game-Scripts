/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { EVENT_COMMAND_KIND } from '../Common';
import { MapObjectCommandType } from '../Common/Types';
import { Node, Tree } from '../Core';
import { EventCommand, Manager } from '../index';
import { Base } from './Base';
import { DynamicValue } from './DynamicValue';
import { Event } from './Event';

/**
 * JSON structure describing a reaction command node.
 */
export type ReactionCommandJSON = {
	kind: EVENT_COMMAND_KIND;
	command: MapObjectCommandType[];
	d?: boolean;
	children?: ReactionCommandJSON[];
};

/**
 * JSON structure describing a reaction.
 */
export type ReactionJSON = {
	id?: number;
	bh: boolean;
	c: ReactionCommandJSON[];
};

/**
 * A reaction to an event.
 */
export class Reaction extends Base {
	public labels: [DynamicValue, Node][];
	public idEvent: number;
	public blockingHero: boolean;
	public commands: Tree;
	public event: Event;

	constructor(json?: ReactionJSON) {
		super(json);
	}

	/**
	 * Get the first node command of the reaction.
	 */
	getFirstCommand(): Node {
		return this.commands.root.firstChild;
	}

	/**
	 * Read the JSON associated to the reaction.
	 */
	read(json: ReactionJSON): void {
		this.labels = [];
		this.idEvent = json.id;
		this.blockingHero = json.bh;
		this.commands = new Tree('root');
		this.readChildrenJSON(json.c, this.commands.root);
	}

	/**
	 * Recursively read the JSON children associated to the reaction.
	 */
	readChildrenJSON(jsonCommands: ReactionCommandJSON[], parent: Node): void {
		let showText: EventCommand.ShowText = null;
		for (const jsonCommand of jsonCommands) {
			const command = Manager.Events.getEventCommand(jsonCommand);

			// Comment
			if (command instanceof EventCommand.Comment) {
				continue;
			}

			if (jsonCommand.d) {
				command.disabled = true;
			}

			// Add node
			const node = parent.add(command);

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
			if (jsonCommand.children) {
				this.readChildrenJSON(jsonCommand.children, node);
			}
		}
	}
}
