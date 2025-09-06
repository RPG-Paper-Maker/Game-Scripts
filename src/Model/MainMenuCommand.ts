/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Scene } from '..';
import { Interpreter, MAIN_MENU_COMMAND_KIND, Utils } from '../Common';
import { Game } from '../Core';
import { Localization } from './Localization';

/** @class
 *  A main menu command in scene main menu.
 *  @extends Localization
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
class MainMenuCommand extends Localization {
	public kind: MAIN_MENU_COMMAND_KIND;
	public script: string;

	constructor(json?: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Read the JSON associated to the main menu command.
	 *  @param {Record<string, any>} - json Json object describing the main
	 *  menu command.
	 */
	read(json: Record<string, any>) {
		super.read(json as any);
		this.kind = Utils.valueOrDefault(json.kind, MAIN_MENU_COMMAND_KIND.INVENTORY);
		if (this.kind === MAIN_MENU_COMMAND_KIND.SCRIPT) {
			this.script = Utils.valueOrDefault(json.script, '');
		}
	}

	/**
	 *  Get the callbacks functions when clicking on command.
	 *  @returns {(item: Core.Item) => boolean}
	 */
	getCallback(): () => boolean {
		const name = this.name();
		switch (this.kind) {
			case MAIN_MENU_COMMAND_KIND.INVENTORY:
				return function () {
					Manager.Stack.push(new Scene.MenuInventory(name));
					return true;
				};
			case MAIN_MENU_COMMAND_KIND.SKILLS:
				return function () {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuSkills(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.EQUIP:
				return function () {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuEquip(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.STATES:
				return function () {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuDescriptionState(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.ORDER:
				return function () {
					if (Game.current.teamHeroes.length > 0) {
						this.windowChoicesTeam.select(0);
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.SAVE:
				return function () {
					if (Scene.Map.allowSaves) {
						Manager.Stack.push(new Scene.SaveGame());
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.QUIT:
				return function () {
					Manager.Stack.push(
						new Scene.Confirm(() => {
							Manager.Stack.popAll();
							Manager.Stack.push(new Scene.TitleScreen());
						})
					);
					return true;
				};
			case MAIN_MENU_COMMAND_KIND.SCRIPT:
				const t = this;
				return function () {
					return Interpreter.evaluate(t.script, {
						additionalName: 'menu',
						additionalValue: t,
						addReturn: false,
					}) as boolean;
				};
			default:
				return null;
		}
	}
}

export { MainMenuCommand };
