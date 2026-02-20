/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Game, MapObject, Player } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for changing a hero name.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ChangeName extends Base {
	public name: Model.DynamicValue;
	public selection: number;
	public heInstanceID: Model.DynamicValue;
	public groupIndex: number;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.name = Model.DynamicValue.createValueCommand(command, iterator);

		// Selection
		this.selection = command[iterator.i++];
		switch (this.selection) {
			case 0:
				this.heInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1:
				this.groupIndex = command[iterator.i++];
				break;
		}
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const name = this.name.getValue() as string;
		let targets: Player[];
		switch (this.selection) {
			case 0:
				targets = [Game.current.getHeroByInstanceID(this.heInstanceID.getValue() as number)];
				break;
			case 1:
				targets = Game.current.getTeam(this.groupIndex);
				break;
		}
		let target: Player;
		for (let i = 0, l = targets.length; i < l; i++) {
			target = targets[i];
			target.name = name;
		}
		return 1;
	}
}

export { ChangeName };
