/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Interpreter, Platform, TITLE_COMMAND_KIND, Utils } from '../Common';
import { Game } from '../Core';
import { Datas, Manager, Scene } from '../index';
import { Translatable } from './Translatable';

/** @class
 *  A title command of the game.
 *  @extends System.Translatable
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  title screen command
 */
class TitleCommand extends Translatable {
	public kind: TITLE_COMMAND_KIND;
	public script: string;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the title screen command.
	 *  @param {Record<string, any>} - json Json object describing the title
	 *  screen command
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.kind = Utils.defaultValue(json.k, TITLE_COMMAND_KIND.NEW_GAME);
		this.script = Utils.defaultValue(json.s, '');
	}

	/**
	 *  Get the action function according to kind.
	 *  @returns {Function}
	 */
	getAction(): Function {
		switch (this.kind) {
			case TITLE_COMMAND_KIND.NEW_GAME:
				return TitleCommand.startNewGame;
			case TITLE_COMMAND_KIND.LOAD_GAME:
				return TitleCommand.loadGame;
			case TITLE_COMMAND_KIND.SETTINGS:
				const name = this.name();
				return () => {
					return TitleCommand.showSettings(name);
				};
			case TITLE_COMMAND_KIND.EXIT:
				return TitleCommand.exit;
			case TITLE_COMMAND_KIND.SCRIPT:
				return this.executeScript;
		}
	}

	/**
	 *  Callback function for start a new game.
	 *  @static
	 *  @returns {boolean}
	 */
	static startNewGame(): boolean {
		// Stop video and songs if existing
		if (!Datas.TitlescreenGameover.isTitleBackgroundImage) {
			Manager.Videos.stop();
		}

		// Create a new game
		Game.current = new Game();
		Game.current.initializeDefault();

		// Add local map to stack
		Manager.Stack.replace(new Scene.Map(Datas.Systems.ID_MAP_START_HERO));

		return true;
	}

	/**
	 *  Callback function for loading an existing game.
	 *  @returns {boolean}
	 */
	static loadGame(): boolean {
		Manager.Stack.push(new Scene.LoadGame());
		return true;
	}

	/**
	 *  Callback function for loading an existing game.
	 *   @returns {boolean}
	 */
	static showSettings(title: string): boolean {
		Manager.Stack.push(new Scene.TitleSettings(title));
		return true;
	}

	/**
	 *  Callback function for closing the window.
	 *  @returns {boolean}
	 */
	static exit(): boolean {
		Platform.quit();
		return true;
	}

	/**
	 *  Callback function for closing the window.
	 *  @returns {boolean}
	 */
	executeScript(): boolean {
		Interpreter.evaluate(this.script, { addReturn: false });
		return true;
	}
}

export { TitleCommand };
