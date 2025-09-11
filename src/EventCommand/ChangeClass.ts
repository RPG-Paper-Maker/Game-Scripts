/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { GROUP_KIND } from '../Common';
import { Game, MapObject, Player } from '../Core';
import { Datas, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for changing experience curve of one or several hero.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeClass extends Base {
	public classID: Model.DynamicValue;
	public selectionKind: number;
	public selectionHeroEnemyInstanceID: Model.DynamicValue;
	public selectionTeam: GROUP_KIND;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.classID = Model.DynamicValue.createValueCommand(command, iterator);
		this.selectionKind = command[iterator.i++];
		switch (this.selectionKind) {
			case 0:
				this.selectionHeroEnemyInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1:
				this.selectionTeam = command[iterator.i++];
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
		const newClass = Datas.Classes.get(this.classID.getValue() as number);
		let targets: Player[];
		switch (this.selectionKind) {
			case 0:
				targets = [Game.current.getHeroByInstanceID(this.selectionHeroEnemyInstanceID.getValue() as number)];
				break;
			case 1:
				targets = Game.current.getTeam(this.selectionTeam);
				break;
		}
		let level: number;
		for (const target of targets) {
			target.changedClass = newClass;
			level = target[Datas.BattleSystems.getLevelStatistic().abbreviation];
			target.skills = target.system.getSkills(level, newClass);
			target.updateElements();
			target.updateAllStatsValues();
		}
		return 1;
	}
}

export { ChangeClass };
