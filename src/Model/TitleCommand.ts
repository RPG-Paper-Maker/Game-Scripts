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
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure for a title screen command.
 */
export type TitleCommandJSON = LocalizationJSON & {
	k?: TITLE_COMMAND_KIND;
	s?: string;
};

/**
 * A title command of the game.
 */
export class TitleCommand extends Localization {
	public kind: TITLE_COMMAND_KIND;
	public script: string;

	constructor(json?: TitleCommandJSON) {
		super(json);
	}

	/**
	 * Start a new game.
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
	 * Load an existing game.
	 */
	static loadGame(): boolean {
		Manager.Stack.push(new Scene.LoadGame());
		return true;
	}

	/**
	 * Show settings screen.
	 */
	static showSettings(title: string): boolean {
		Manager.Stack.push(new Scene.TitleSettings(title));
		return true;
	}

	/**
	 * Exit the game.
	 */
	static exit(): boolean {
		Platform.quit();
		return true;
	}

	/**
	 * Get the action function according to the command kind.
	 */
	getAction(): () => boolean {
		switch (this.kind) {
			case TITLE_COMMAND_KIND.NEW_GAME:
				return TitleCommand.startNewGame;
			case TITLE_COMMAND_KIND.LOAD_GAME:
				return TitleCommand.loadGame;
			case TITLE_COMMAND_KIND.SETTINGS: {
				const name = this.name();
				return () => TitleCommand.showSettings(name);
			}
			case TITLE_COMMAND_KIND.EXIT:
				return TitleCommand.exit;
			case TITLE_COMMAND_KIND.SCRIPT:
				return this.executeScript;
		}
	}

	/**
	 * Execute custom script.
	 */
	executeScript(): boolean {
		Interpreter.evaluate(this.script, { addReturn: false });
		return true;
	}

	/**
	 * Read JSON into this title command.
	 */
	read(json: TitleCommandJSON) {
		super.read(json);
		this.kind = Utils.valueOrDefault(json.k, TITLE_COMMAND_KIND.NEW_GAME);
		this.script = Utils.valueOrDefault(json.s, '');
	}
}
