/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, Interpreter } from '../Common';
import { Player } from '../Core';
import { Base } from './Base';
import { Class } from './Class';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { ProgressionTable, ProgressionTableJSON } from './ProgressionTable';

/** JSON data for initializing a StatisticProgression */
export type StatisticProgressionJSON = {
	id: number;
	m?: DynamicValueJSON;
	if?: boolean;
	t?: ProgressionTableJSON;
	r?: DynamicValueJSON;
	f?: DynamicValueJSON;
};

/**
 * Represents a statistic progression for a class or player.
 */
export class StatisticProgression extends Base {
	public id: number;
	public maxValue: DynamicValue;
	public isFix: boolean;
	public table: ProgressionTable;
	public random: DynamicValue;
	public formula: DynamicValue;

	constructor(json?: StatisticProgressionJSON) {
		super(json);
	}

	/**
	 * Gets the progression value at a specific level.
	 * @param level - The level to get the value for
	 * @param user - The player using this statistic
	 * @param maxLevel - Optional maximum level (defaults to the class final level)
	 * @returns The value of the statistic at the specified level
	 */
	getValueAtLevel(level: number, user: Player, maxLevel?: number): number {
		const value = this.isFix
			? this.table.getProgressionAt(
					level,
					maxLevel === undefined
						? user.system.getProperty(Class.PROPERTY_FINAL_LEVEL, user.changedClass)
						: maxLevel,
				)
			: (Interpreter.evaluate(this.formula.getValue() as string, { user: user }) as number);
		return this.clampValue(value);
	}

	/**
	 * Clamp a statistic value to its configured maximum value, if any.
	 * @param value - The statistic value to clamp
	 * @returns The clamped value
	 */
	clampValue(value: number): number {
		const max = this.getMaxValue();
		return max === null ? value : Math.min(value, max);
	}

	/**
	 * Get the configured maximum value, if any.
	 * @returns The max value, or null when no max is configured
	 */
	getMaxValue(): number {
		if (!this.maxValue || this.maxValue.kind === DYNAMIC_VALUE_KIND.NONE) {
			return null;
		}
		const max = this.maxValue.getValue();
		return typeof max === 'number' ? max : null;
	}

	/**
	 * Reads the JSON data to initialize this statistic progression.
	 */
	read(json: StatisticProgressionJSON): void {
		this.id = json.id;
		this.maxValue = DynamicValue.readOrNone(json.m);
		this.isFix = json.if;
		if (this.isFix) {
			this.table = new ProgressionTable(undefined, json.t);
			this.random = new DynamicValue(json.r);
		} else {
			this.formula = new DynamicValue(json.f);
		}
	}
}
