/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Manager, Model, Scene } from '..';
import { GAME_OVER_COMMAND_KIND, Interpreter, Platform, Utils } from '../Common';
import { Game } from '../Core';
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure describing a game over command.
 */
export type GameOverCommandJSON = LocalizationJSON & {
	k?: GAME_OVER_COMMAND_KIND;
	s?: string;
};

/**
 * A game over command of the game.
 */
export class GameOverCommand extends Localization {
	public kind: GAME_OVER_COMMAND_KIND;
	public script: string;

	constructor(json?: GameOverCommandJSON) {
		super(json);
	}

	/**
	 * Get the action function according to kind.
	 */
	getAction(): () => boolean {
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
	 * Stop the game over video if it is playing.
	 */
	static stopGameOverVideo() {
		if (!Data.TitlescreenGameover.isGameOverBackgroundImage) {
			Manager.Videos.stop();
		}
	}

	/**
	 * Callback function for continuing the game (load last save).
	 */
	continue(): boolean {
		GameOverCommand.stopGameOverVideo();
		if (Game.current.slot === -1) {
			// No save slot → start new game
			Model.TitleCommand.startNewGame();
		} else {
			// Resume from the last save slot
			(Manager.Stack.top as Scene.GameOver).continue().catch(console.error);
		}
		return true;
	}

	/**
	 * Callback function for going back to title screen.
	 */
	titleScreen(): boolean {
		GameOverCommand.stopGameOverVideo();
		Manager.Stack.popAll();
		Manager.Stack.pushTitleScreen();
		return true;
	}

	/**
	 * Callback function for closing the window.
	 */
	exit(): boolean {
		Platform.quit();
		return true;
	}

	/**
	 * Callback function for executing a custom script.
	 */
	executeScript(): boolean {
		Interpreter.evaluate(this.script, { addReturn: false });
		return true;
	}

	/**
	 * Read the JSON associated to the game over command.
	 */
	read(json: GameOverCommandJSON): void {
		super.read(json);
		this.kind = Utils.valueOrDefault(json.k, GAME_OVER_COMMAND_KIND.CONTINUE);
		this.script = Utils.valueOrDefault(json.s, '');
	}
}
