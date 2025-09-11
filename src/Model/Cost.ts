/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DAMAGES_KIND, Interpreter, Utils } from '../Common';
import { MapObjectCommandType } from '../Common/Types';
import { Game, Player } from '../Core';
import { StructIterator } from '../EventCommand';
import { Datas, Scene } from '../index';
import { Base } from './Base';
import { CommonSkillItem } from './CommonSkillItem';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON schema for a skill or item cost.
 */
export type CostJSON = {
	k?: number;
	sid?: DynamicValueJSON;
	cid?: DynamicValueJSON;
	vid?: number;
	vf?: DynamicValueJSON;
};

/**
 * A class for costs.
 */
export class Cost extends Base {
	public kind: DAMAGES_KIND;
	public statisticID?: DynamicValue;
	public currencyID?: DynamicValue;
	public variableID?: number;
	public valueFormula: DynamicValue;
	public skillItem: CommonSkillItem;

	constructor(json?: CostJSON) {
		super(json);
	}

	/**
	 * Computes the price mapping for multiple costs.
	 * @param list - The list of costs.
	 * @returns A record mapping ID → tuple(kind, value).
	 */
	static getPrice(list: Cost[]): Map<number, [DAMAGES_KIND, number]> {
		const price = new Map<number, [DAMAGES_KIND, number]>();
		for (const cost of list) {
			const value: [DAMAGES_KIND, number] = [
				cost.kind,
				Interpreter.evaluate(cost.valueFormula.getValue() as string) as number,
			];
			switch (cost.kind) {
				case DAMAGES_KIND.STAT:
					price.set(cost.statisticID.getValue() as number, value);
					break;
				case DAMAGES_KIND.CURRENCY:
					price.set(cost.currencyID.getValue() as number, value);
					break;
				case DAMAGES_KIND.VARIABLE:
					price.set(cost.variableID, value);
					break;
			}
		}
		return price;
	}

	/**
	 * Computes the effective cost value for a user and target,
	 * accounting for resistances and multipliers.
	 * @param user - The player using the skill/item.
	 * @param target - The target of the skill/item.
	 * @returns The computed cost value.
	 */
	getValue(user: Player, target: Player): number {
		let value = Interpreter.evaluate(this.valueFormula.getValue() as string, { user, target }) as number;
		const baseValue = value;
		if (user.skillCostRes[-1]) {
			value *= user.skillCostRes[-1].multiplication;
		}
		if (user.skillCostRes[this.skillItem.id]) {
			value *= user.skillCostRes[this.skillItem.id].multiplication;
		}
		if (user.skillCostRes[-1]) {
			value += (baseValue * user.skillCostRes[-1].addition) / 100;
		}
		if (user.skillCostRes[this.skillItem.id]) {
			value += (baseValue * user.skillCostRes[this.skillItem.id].multiplication) / 100;
		}
		return Math.round(value);
	}

	/**
	 * Applies the cost to the current user (reducing stats, currency, or variables).
	 */
	use(): void {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		const value = this.getValue(user, target);
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				user[Datas.BattleSystems.getStatistic(this.statisticID.getValue() as number).abbreviation] -= value;
				break;
			case DAMAGES_KIND.CURRENCY:
				Game.current.currencies[this.currencyID.getValue() as number] -= value;
				break;
			case DAMAGES_KIND.VARIABLE:
				Game.current.variables[this.variableID] -= value;
				break;
		}
	}

	/**
	 * Checks if the cost can be paid with the current resources.
	 * @returns True if possible, false otherwise.
	 */
	isPossible(): boolean {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		const value = this.getValue(user, target);
		let currentValue = 0;
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				currentValue =
					user[Datas.BattleSystems.getStatistic(this.statisticID.getValue() as number).abbreviation];
				break;
			case DAMAGES_KIND.CURRENCY:
				currentValue = Game.current.getCurrency(this.currencyID.getValue() as number);
				break;
			case DAMAGES_KIND.VARIABLE:
				currentValue = Game.current.getVariable(this.variableID);
				break;
		}
		return currentValue - value >= 0;
	}

	/**
	 * Returns a string representation of this cost.
	 * @returns A human-readable string.
	 */
	toString(): string {
		const user = Scene.Map.current.user?.player ?? Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		let result = `${this.getValue(user, target)} `;
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				result += Datas.BattleSystems.getStatistic(this.statisticID.getValue() as number).name();
				break;
			case DAMAGES_KIND.CURRENCY:
				result += Datas.Systems.getCurrency(this.currencyID.getValue() as number).name();
				break;
			case DAMAGES_KIND.VARIABLE:
				result += Datas.Variables.get(this.variableID);
				break;
		}
		return result;
	}

	/**
	 * Reads the JSON data describing this cost.
	 */
	read(json: CostJSON): void {
		this.kind = Utils.valueOrDefault(json.k, DAMAGES_KIND.STAT);
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID = DynamicValue.readOrDefaultDatabase(json.sid);
				break;
			case DAMAGES_KIND.CURRENCY:
				this.currencyID = DynamicValue.readOrDefaultDatabase(json.cid);
				break;
			case DAMAGES_KIND.VARIABLE:
				this.variableID = Utils.valueOrDefault(json.vid, 1);
				break;
		}
		this.valueFormula = DynamicValue.readOrDefaultMessage(json.vf);
	}

	/**
	 * Parses a cost from an event command.
	 * @param command - The command array.
	 * @param iterator - The command iterator.
	 */
	parse(command: MapObjectCommandType[], iterator: StructIterator): void {
		this.kind = command[iterator.i++] as DAMAGES_KIND;
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID = DynamicValue.createValueCommand(command, iterator);
				break;
			case 1:
				this.currencyID = DynamicValue.createValueCommand(command, iterator);
				break;
			case 2:
				this.variableID = command[iterator.i++] as number;
				break;
		}
		this.valueFormula = DynamicValue.createValueCommand(command, iterator);
	}
}
