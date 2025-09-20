/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, Paths, Platform, SONG_KIND, TITLE_SETTING_KIND, Utils } from '../Common';
import { Graphic, Manager, Scene } from '../index';
import { GameOverCommand, GameOverCommandJSON, PlaySong, PlaySongJSON, TitleCommand, TitleCommandJSON } from '../Model';

/**
 * JSON structure for title screen and game over.
 */
export type TitlescreenGameoverJSON = {
	itbi: boolean;
	tb: number;
	tbv: number;
	tm: PlaySongJSON;
	tc: TitleCommandJSON[];
	ts: { id?: number; checked?: boolean }[];
	isGameOverBackgroundImage: boolean;
	gameOverBackgroundImage: number;
	gameOverBackgroundVideo: number;
	gameOverMusic: PlaySongJSON;
	gameOverCommands: GameOverCommandJSON[];
};

/**
 * All the title screen and game over data.
 */
export class TitlescreenGameover {
	public static isTitleBackgroundImage: boolean;
	public static titleBackgroundImageID: number;
	public static titleBackgroundVideoID: number;
	public static titleMusic: PlaySong;
	public static titleCommands: TitleCommand[];
	public static titleSettings: number[];
	public static isGameOverBackgroundImage: boolean;
	public static gameOverBackgroundImageID: number;
	public static gameOverBackgroundVideoID: number;
	public static gameOverMusic: PlaySong;
	public static gameOverCommands: GameOverCommand[];

	/** Get title screen command graphics. */
	static getTitleCommandsNames(): Graphic.Text[] {
		return this.titleCommands.map((cmd) => {
			const text = new Graphic.Text(cmd.name(), { align: ALIGN.CENTER });
			text.datas = cmd;
			return text;
		});
	}

	/** Get title screen command actions. */
	static getTitleCommandsActions(): (() => boolean)[] {
		return this.titleCommands.map((cmd) => cmd.getAction());
	}

	/** Get title screen setting command graphics. */
	static getTitleSettingsCommandsContent(): Graphic.Setting[] {
		return this.titleSettings.map((id) => new Graphic.Setting(id));
	}

	/** Get title screen setting command actions. */
	static getTitleSettingsCommandsActions(): (() => boolean)[] {
		return this.titleSettings.map((id) => this.getTitleSettingsCommandsAction(id));
	}

	/** Get action for a specific title setting. */
	static getTitleSettingsCommandsAction(id: number): () => boolean {
		switch (id) {
			case TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT:
				return this.keyboardAssignment;
			case TITLE_SETTING_KIND.LANGUAGE:
				return this.language;
		}
	}

	/** Setting action: open keyboard assignment. */
	static keyboardAssignment(): boolean {
		Manager.Stack.push(new Scene.KeyboardAssign());
		return true;
	}

	/** Setting action: open language selection. */
	static language(): boolean {
		Manager.Stack.push(new Scene.ChangeLanguage());
		return true;
	}

	/** Get game over command graphics. */
	static getGameOverCommandsNames(): Graphic.Text[] {
		return this.gameOverCommands.map((cmd) => {
			const text = new Graphic.Text(cmd.name(), { align: ALIGN.CENTER });
			text.datas = cmd;
			return text;
		});
	}

	/** Get game over command actions. */
	static getGameOverCommandsActions(): (() => boolean)[] {
		return this.gameOverCommands.map((cmd) => cmd.getAction());
	}

	/** Read the JSON file associated with title screen and game over. */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_TITLE_SCREEN_GAME_OVER)) as TitlescreenGameoverJSON;

		// Title screen
		this.isTitleBackgroundImage = Utils.valueOrDefault(json.itbi, true);
		this.titleBackgroundImageID = Utils.valueOrDefault(json.tb, 1);
		this.titleBackgroundVideoID = Utils.valueOrDefault(json.tbv, 1);
		this.titleMusic = new PlaySong(SONG_KIND.MUSIC, json.tm);
		this.titleCommands = Utils.readJSONList(json.tc, TitleCommand);
		this.titleSettings = [];
		for (const obj of json.ts) {
			if (Utils.valueOrDefault(obj.checked, true)) {
				this.titleSettings.push(obj.id ?? 0);
			}
		}

		// Game over
		this.isGameOverBackgroundImage = Utils.valueOrDefault(json.isGameOverBackgroundImage, true);
		this.gameOverBackgroundImageID = Utils.valueOrDefault(json.gameOverBackgroundImage, 1);
		this.gameOverBackgroundVideoID = Utils.valueOrDefault(json.gameOverBackgroundVideo, 1);
		this.gameOverMusic = new PlaySong(SONG_KIND.MUSIC, json.gameOverMusic);
		this.gameOverCommands = Utils.readJSONList(json.gameOverCommands, GameOverCommand);
	}
}
