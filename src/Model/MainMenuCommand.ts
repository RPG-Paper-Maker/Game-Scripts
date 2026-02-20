/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Scene } from '..';
import { Interpreter, MAIN_MENU_COMMAND_KIND, Utils } from '../Common';
import { Game } from '../Core';
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure describing a main menu command.
 */
export type MainMenuCommandJSON = LocalizationJSON & {
	kind?: MAIN_MENU_COMMAND_KIND;
	script?: string;
};

/**
 * Represents a main menu command in the scene's main menu.
 */
export class MainMenuCommand extends Localization {
	public kind: MAIN_MENU_COMMAND_KIND;
	public script: string;

	constructor(json?: MainMenuCommandJSON) {
		super(json);
	}

	/**
	 * Gets the callback function to execute when the command is selected.
	 * @returns A function returning true if successful, false otherwise.
	 */
	getCallback(context: Scene.Menu): (() => boolean) | null {
		const name = this.name();
		switch (this.kind) {
			case MAIN_MENU_COMMAND_KIND.INVENTORY:
				return () => {
					Manager.Stack.push(new Scene.MenuInventory(name));
					return true;
				};
			case MAIN_MENU_COMMAND_KIND.SKILLS:
				return () => {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuSkills(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.EQUIP:
				return () => {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuEquip(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.STATES:
				return () => {
					if (Game.current.teamHeroes.length > 0) {
						Manager.Stack.push(new Scene.MenuDescriptionState(name));
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.ORDER:
				return () => {
					if (Game.current.teamHeroes.length > 0) {
						context.windowChoicesTeam.select(0);
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.SAVE:
				return () => {
					if (Scene.Map.allowSaves) {
						Manager.Stack.push(new Scene.SaveGame());
						return true;
					}
					return false;
				};
			case MAIN_MENU_COMMAND_KIND.QUIT:
				return () => {
					Manager.Stack.push(
						new Scene.Confirm(() => {
							Manager.Stack.popAll();
							Manager.Stack.push(new Scene.TitleScreen());
						}),
					);
					return true;
				};
			case MAIN_MENU_COMMAND_KIND.SCRIPT:
				return () => {
					return Interpreter.evaluate(this.script, {
						additionalName: 'menu',
						additionalValue: context,
						addReturn: false,
					}) as boolean;
				};
			default:
				return null;
		}
	}

	/**
	 *  Read the JSON associated to the main menu command.
	 */
	read(json: MainMenuCommandJSON): void {
		super.read(json);
		this.kind = Utils.valueOrDefault(json.kind, MAIN_MENU_COMMAND_KIND.INVENTORY);
		if (this.kind === MAIN_MENU_COMMAND_KIND.SCRIPT) {
			this.script = Utils.valueOrDefault(json.script, '');
		}
	}
}
