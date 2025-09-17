/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { MapObject, Player } from '../Core';
import { Common, Core, Data, EventCommand, Graphic, Main, Manager, Model, Scene } from '../index';

/**
 * Represents the context available to evaluated formulas.
 */
interface EvalContext {
	Common: typeof Common;
	Core: typeof Core;
	Data: typeof Data;
	EventCommand: typeof EventCommand;
	Graphic: typeof Graphic;
	Manager: typeof Manager;
	Scene: typeof Scene;
	Model: typeof Model;
	Main: typeof Main;
	THREE: typeof THREE;
	Howl: typeof Howl;
	u?: Player;
	t?: Player;
	damage?: number;
	$object?: MapObject;
	[key: string]: unknown;
}

/**
 * A static class for evaluating dynamic formulas or scripts in a sandboxed context.
 * Provides global access to game modules and injects runtime objects like `user`, `target`, or `thisObject`.
 */
export class Interpreter {
	private constructor() {
		throw new Error('This is a static class');
	}

	/**
	 * Evaluate a formula string within the game's runtime context.
	 * @param formula - The formula to evaluate. Can be any valid JS expression or statement.
	 * @param options - Runtime options and context injection.
	 * @param options.user - The acting battler (user).
	 * @param options.target - The target battler.
	 * @param options.damage - Damage value reference.
	 * @param options.thisObject - The current map object (`this` equivalent).
	 * @param options.addReturn - Whether to prepend `return` to the formula (default: true).
	 * @param options.additionalName - Extra variable name to inject into context.
	 * @param options.additionalValue - Extra variable value to inject.
	 * @param options.defaultValue - Value to return if formula is `null`.
	 * @returns The result of the evaluated formula, or `null` on error.
	 */
	static evaluate(
		formula: string | null,
		{
			user,
			target,
			damage,
			thisObject,
			addReturn = true,
			additionalName = '',
			additionalValue = null,
			defaultValue = true,
		}: {
			user?: Player;
			target?: Player;
			damage?: number;
			thisObject?: MapObject;
			addReturn?: boolean;
			additionalName?: string;
			additionalValue?: unknown;
			defaultValue?: unknown;
		} = {}
	): unknown {
		if (formula === null) {
			return defaultValue;
		}

		const context: EvalContext = {
			Common,
			Core,
			Data,
			EventCommand,
			Graphic,
			Manager,
			Scene,
			Model,
			Main,
			THREE,
			Howl,
			u: user,
			t: target,
			damage,
			$object: thisObject,
			...(additionalName ? { [additionalName]: additionalValue } : {}),
		};

		const body = (addReturn ? 'return ' : '') + formula;
		try {
			const argNames = Object.keys(context);
			const argValues = Object.values(context);
			return new Function(...argNames, body)(...argValues);
		} catch (e) {
			console.error(`Error while interpreting formula: "${body}"`, e);
			return null;
		}
	}
}
