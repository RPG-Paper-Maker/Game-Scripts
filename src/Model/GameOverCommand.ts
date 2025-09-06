/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Model, Scene } from '..';
import { GAME_OVER_COMMAND_KIND, Interpreter, Platform, Utils } from '../Common';
import { Game } from '../Core';
import { Localization } from './Localization';

/** @class
 *  A game over command of the game.
 *  @extends Model.Localization
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  game over command
 */
class GameOverCommand extends Localization {
	public kind: GAME_OVER_COMMAND_KIND;
	public script: string;

	constructor(json?: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Read the JSON associated to the game over command.
	 *  @param {Record<string, any>} json - Json object describing the game
	 *  over command
	 */
	read(json: Record<string, any>) {
		super.read(json as any);
		this.kind = Utils.valueOrDefault(json.k, GAME_OVER_COMMAND_KIND.CONTINUE);
		this.script = Utils.valueOrDefault(json.s, '');
	}

	/**
	 *  Get the action function according to kind.
	 *  @returns {Function}
	 */
	getAction(): Function {
		switch (this.kind) {
			case GAME_OVER_COMMAND_KIND.CONTINUE:
				return this.continue;
			case GAME_OVER_COMMAND_KIND.TITLE_SCREEN:
				return this.titleScreen;
			case GAME_OVER_COMMAND_KIND.EXIT:
				return this.exit;
			case GAME_OVER_COMMAND_KIND.SCRIPT:
				return this.executeScript;
		}
	}

	/**
	 *  Callback function for continuying the game (load last save).
	 *  @returns {boolean}
	 */
	continue(): boolean {
		if (Game.current.slot === -1) {
			// If slot = -1, then run new game (no save)
			Model.TitleCommand.startNewGame();
		} else {
			// Else, run the last save slot
			(<Scene.GameOver>Manager.Stack.top).continue();
		}
		return true;
	}

	/**
	 *  Callback function for going back to title screen.
	 *  @returns {boolean}
	 */
	titleScreen(): boolean {
		Manager.Stack.popAll();
		Manager.Stack.pushTitleScreen();
		return true;
	}

	/**
	 *  Callback function for closing the window.
	 *  @returns {boolean}
	 */
	exit(): boolean {
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

export { GameOverCommand };
