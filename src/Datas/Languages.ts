/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic, Model } from '..';
import { Paths, Platform, Utils } from '../Common';

interface ExtrasKind {
	loadAGame: Model.Localization;
	loadAGameDescription: Model.Localization;
	slot: Model.Localization;
	empty: Model.Localization;
	saveAGame: Model.Localization;
	saveAGameDescription: Model.Localization;
	keyboardAssignment: Model.Localization;
	keyboardAssignmentDescription: Model.Localization;
	keyboardAssignmentSelectedDescription: Model.Localization;
	language: Model.Localization;
	languageDescription: Model.Localization;
	languageSelectedDescription: Model.Localization;
	confirm: Model.Localization;
	ok: Model.Localization;
	yes: Model.Localization;
	no: Model.Localization;
	add: Model.Localization;
	remove: Model.Localization;
	shop: Model.Localization;
	buy: Model.Localization;
	sell: Model.Localization;
	owned: Model.Localization;
	selectAnAlly: Model.Localization;
	victory: Model.Localization;
	defeat: Model.Localization;
	levelUp: Model.Localization;
	precision: Model.Localization;
	critical: Model.Localization;
	damage: Model.Localization;
	heal: Model.Localization;
	skill: Model.Localization;
	performSkill: Model.Localization;
	loading: Model.Localization;
	equipQuestion: Model.Localization;
	pressAnyKeys: Model.Localization;
	target: Model.Localization;
}

/**
 *  @class
 *  All the languages datas.
 *  @static
 */
class Languages {
	private static list: string[];
	public static listOrder: number[];
	public static extras: ExtrasKind;

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to languages.
	 *  @static
	 *  @async
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_LANGS)) as any;
		this.list = [];
		this.listOrder = [];
		Utils.readJSONSystemList({
			list: json.langs,
			listIDs: this.list,
			listIndexes: this.listOrder,
			indexesIDs: true,
			func: (element: Record<string, any>) => {
				return element.name;
			},
		});
		this.extras = {
			loadAGame: new Model.Localization(json.lag),
			loadAGameDescription: new Model.Localization(json.lagd),
			slot: new Model.Localization(json.sl),
			empty: new Model.Localization(json.em),
			saveAGame: new Model.Localization(json.sag),
			saveAGameDescription: new Model.Localization(json.sagd),
			keyboardAssignment: new Model.Localization(json.ka),
			keyboardAssignmentDescription: new Model.Localization(json.kad),
			keyboardAssignmentSelectedDescription: new Model.Localization(json.kasd),
			language: new Model.Localization(json.l),
			languageDescription: new Model.Localization(json.ld),
			languageSelectedDescription: new Model.Localization(json.lsd),
			confirm: new Model.Localization(json.co),
			ok: new Model.Localization(json.ok),
			yes: new Model.Localization(json.ye),
			no: new Model.Localization(json.no),
			add: new Model.Localization(json.ad),
			remove: new Model.Localization(json.re),
			shop: new Model.Localization(json.sh),
			buy: new Model.Localization(json.bu),
			sell: new Model.Localization(json.se),
			owned: new Model.Localization(json.ow),
			selectAnAlly: new Model.Localization(json.saa),
			victory: new Model.Localization(json.vi),
			defeat: new Model.Localization(json.de),
			levelUp: new Model.Localization(json.lu),
			precision: new Model.Localization(json.pr),
			critical: new Model.Localization(json.cr),
			damage: new Model.Localization(json.da),
			heal: new Model.Localization(json.he),
			skill: new Model.Localization(json.sk),
			performSkill: new Model.Localization(json.ps),
			loading: new Model.Localization(json.lo),
			equipQuestion: new Model.Localization(json.eq),
			pressAnyKeys: new Model.Localization(json.pak),
			target: new Model.Localization(json.ta),
		};
	}

	/**
	 *  Get the main language ID.
	 *  @static
	 *  @returns {number}
	 */
	static getMainLanguageID(): number {
		return this.listOrder[0];
	}

	/**
	 *  Get the language name by ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {System.Monster}
	 */
	static get(id: number): string {
		return Datas.Base.get(id, this.list, 'language');
	}

	/**
	 *  Get the index according to language ID.
	 *  @static
	 *  @param {number} id
	 *  @returns {number}
	 */
	static getIndexByID(id: number): number {
		return this.listOrder.indexOf(id);
	}

	/**
	 *  Get the language graphics.
	 *  @static
	 *  @returns {Graphic.Text[]}
	 */
	static getCommandsGraphics(): Graphic.Text[] {
		return this.listOrder.map((id) => new Graphic.Text(this.get(id)));
	}

	/**
	 *  Get the language callbacks.
	 *  @static
	 *  @returns {(() => boolean)[]}
	 */
	static getCommandsCallbacks(): (() => boolean)[] {
		return this.listOrder.map((id) => () => {
			return true;
		});
	}
}

export { Languages };
