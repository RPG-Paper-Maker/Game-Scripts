/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DAMAGES_KIND, Interpreter, Utils } from '../Common';
import { Game, Player } from '../Core';
import { StructIterator } from '../EventCommand';
import { Datas, Scene, System } from '../index';
import { Base } from './Base';
import { DynamicValue } from './DynamicValue';

/** @class
 *  A cost of a common skill item.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  cost
 */
class Cost extends Base {
	public kind: number;
	public statisticID: System.DynamicValue;
	public currencyID: System.DynamicValue;
	public variableID: number;
	public valueFormula: System.DynamicValue;
	public skillItem: System.CommonSkillItem;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Get the price for several costs.
	 */
	static getPrice(list: System.Cost[]): Record<string, [DAMAGES_KIND, number]> {
		const price = {};
		let cost: System.Cost, value: [DAMAGES_KIND, number];
		for (let i = 0, l = list.length; i < l; i++) {
			cost = list[i];
			value = [cost.kind, Interpreter.evaluate(cost.valueFormula.getValue())];
			switch (cost.kind) {
				case DAMAGES_KIND.STAT:
					price[cost.statisticID.getValue()] = value;
					break;
				case DAMAGES_KIND.CURRENCY:
					price[cost.currencyID.getValue()] = value;
					break;
				case DAMAGES_KIND.VARIABLE:
					price[cost.variableID] = value;
					break;
			}
		}
		return price;
	}

	/**
	 *  Read the JSON associated to the cost.
	 *  @param {Record<string, any>} - json Json object describing the cost
	 */
	read(json: Record<string, any>) {
		this.kind = Utils.defaultValue(json.k, DAMAGES_KIND.STAT);
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID = DynamicValue.readOrDefaultDatabase(json.sid);
				break;
			case DAMAGES_KIND.CURRENCY:
				this.currencyID = DynamicValue.readOrDefaultDatabase(json.cid);
				break;
			case DAMAGES_KIND.VARIABLE:
				this.variableID = Utils.defaultValue(json.vid, 1);
				break;
		}
		this.valueFormula = DynamicValue.readOrDefaultMessage(json.vf);
	}

	/**
	 *  Parse command with iterator.
	 *  @param {any[]} command
	 *  @param {StructIterator} iterator
	 */
	parse(command: any[], iterator: StructIterator) {
		this.kind = command[iterator.i++];
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				this.statisticID = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1:
				this.currencyID = System.DynamicValue.createValueCommand(command, iterator);
				break;
			case 2:
				this.variableID = command[iterator.i++];
				break;
		}
		this.valueFormula = System.DynamicValue.createValueCommand(command, iterator);
	}

	/**
	 *  Get value according to user characteristics.
	 */
	getValue(user: Player, target: Player) {
		let value = Interpreter.evaluate(this.valueFormula.getValue(), { user: user, target: target });
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
	 *  Use the cost.
	 */
	use() {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		const value = this.getValue(user, target);
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				user[Datas.BattleSystems.getStatistic(this.statisticID.getValue()).abbreviation] -= value;
				break;
			case DAMAGES_KIND.CURRENCY:
				Game.current.currencies[this.currencyID.getValue()] -= value;
				break;
			case DAMAGES_KIND.VARIABLE:
				Game.current.variables[this.variableID] -= value;
				break;
		}
	}

	/**
	 *  Check if the cost is possible.
	 *  @returns {boolean}
	 */
	isPossible(): boolean {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		const value = this.getValue(user, target);
		let currentValue: number;
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				currentValue = user[Datas.BattleSystems.getStatistic(this.statisticID.getValue()).abbreviation];
				break;
			case DAMAGES_KIND.CURRENCY:
				currentValue = Game.current.getCurrency(this.currencyID.getValue());
				break;
			case DAMAGES_KIND.VARIABLE:
				currentValue = Game.current.getVariable(this.variableID);
				break;
		}
		return currentValue - value >= 0;
	}

	/**
	 *  Get the string representing the cost.
	 *  @returns {string}
	 */
	toString(): string {
		const user = Scene.Map.current.user ? Scene.Map.current.user.player : Player.getTemporaryPlayer();
		const target = Player.getTemporaryPlayer();
		let result = this.getValue(user, target) + ' ';
		switch (this.kind) {
			case DAMAGES_KIND.STAT:
				result += Datas.BattleSystems.getStatistic(this.statisticID.getValue()).name();
				break;
			case DAMAGES_KIND.CURRENCY:
				result += Datas.Systems.getCurrency(this.currencyID.getValue()).name();
				break;
			case DAMAGES_KIND.VARIABLE:
				result += Datas.Variables.get(this.variableID);
				break;
		}
		return result;
	}
}

export { Cost };
