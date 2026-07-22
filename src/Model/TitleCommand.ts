/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Interpreter, Platform, TITLE_COMMAND_KIND, Utils } from '../Common';
import { Game } from '../Core';
import { Data, Manager, Scene } from '../index';
import { Localization, LocalizationJSON } from './Localization';
import { Main } from '../main';

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
		TitleCommand.waitForGameData(() => {
			if (Data.TitlescreenGameover.isTitleBackgroundVideo) {
				Manager.Videos.stop();
			}

			Game.current = new Game();
			Game.current.initializeDefault();
			Manager.Stack.replace(new Scene.Map(Data.Systems.ID_MAP_START_HERO));
			Manager.Stack.clearHUD();
		});
		return true;
	}

	/** Show the loading scene until deferred game data has completed, then continue. */
	private static waitForGameData(action: () => void): void {
		const titleScreen = Manager.Stack.top;
		titleScreen.loading = true;
		Manager.Stack.requestPaintHUD = true;
		Main.waitForGameData()
			.then(action)
			.catch(console.error)
			.finally(() => {
				titleScreen.loading = false;
				Manager.Stack.requestPaintHUD = true;
			});
	}

	/**
	 * Load an existing game.
	 */
	static loadGame(): boolean {
		TitleCommand.waitForGameData(() => Manager.Stack.push(new Scene.LoadGame()));
		return true;
	}

	/**
	 * Show settings screen.
	 */
	static showSettings(titleCommand: TitleCommand): boolean {
		Manager.Stack.push(new Scene.TitleSettings(titleCommand));
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
			case TITLE_COMMAND_KIND.SETTINGS:
				return () => TitleCommand.showSettings(this);
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
