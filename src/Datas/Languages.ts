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
	loadAGame: Model.Translatable;
	loadAGameDescription: Model.Translatable;
	slot: Model.Translatable;
	empty: Model.Translatable;
	saveAGame: Model.Translatable;
	saveAGameDescription: Model.Translatable;
	keyboardAssignment: Model.Translatable;
	keyboardAssignmentDescription: Model.Translatable;
	keyboardAssignmentSelectedDescription: Model.Translatable;
	language: Model.Translatable;
	languageDescription: Model.Translatable;
	languageSelectedDescription: Model.Translatable;
	confirm: Model.Translatable;
	ok: Model.Translatable;
	yes: Model.Translatable;
	no: Model.Translatable;
	add: Model.Translatable;
	remove: Model.Translatable;
	shop: Model.Translatable;
	buy: Model.Translatable;
	sell: Model.Translatable;
	owned: Model.Translatable;
	selectAnAlly: Model.Translatable;
	victory: Model.Translatable;
	defeat: Model.Translatable;
	levelUp: Model.Translatable;
	precision: Model.Translatable;
	critical: Model.Translatable;
	damage: Model.Translatable;
	heal: Model.Translatable;
	skill: Model.Translatable;
	performSkill: Model.Translatable;
	loading: Model.Translatable;
	equipQuestion: Model.Translatable;
	pressAnyKeys: Model.Translatable;
	target: Model.Translatable;
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
			loadAGame: new Model.Translatable(json.lag),
			loadAGameDescription: new Model.Translatable(json.lagd),
			slot: new Model.Translatable(json.sl),
			empty: new Model.Translatable(json.em),
			saveAGame: new Model.Translatable(json.sag),
			saveAGameDescription: new Model.Translatable(json.sagd),
			keyboardAssignment: new Model.Translatable(json.ka),
			keyboardAssignmentDescription: new Model.Translatable(json.kad),
			keyboardAssignmentSelectedDescription: new Model.Translatable(json.kasd),
			language: new Model.Translatable(json.l),
			languageDescription: new Model.Translatable(json.ld),
			languageSelectedDescription: new Model.Translatable(json.lsd),
			confirm: new Model.Translatable(json.co),
			ok: new Model.Translatable(json.ok),
			yes: new Model.Translatable(json.ye),
			no: new Model.Translatable(json.no),
			add: new Model.Translatable(json.ad),
			remove: new Model.Translatable(json.re),
			shop: new Model.Translatable(json.sh),
			buy: new Model.Translatable(json.bu),
			sell: new Model.Translatable(json.se),
			owned: new Model.Translatable(json.ow),
			selectAnAlly: new Model.Translatable(json.saa),
			victory: new Model.Translatable(json.vi),
			defeat: new Model.Translatable(json.de),
			levelUp: new Model.Translatable(json.lu),
			precision: new Model.Translatable(json.pr),
			critical: new Model.Translatable(json.cr),
			damage: new Model.Translatable(json.da),
			heal: new Model.Translatable(json.he),
			skill: new Model.Translatable(json.sk),
			performSkill: new Model.Translatable(json.ps),
			loading: new Model.Translatable(json.lo),
			equipQuestion: new Model.Translatable(json.eq),
			pressAnyKeys: new Model.Translatable(json.pak),
			target: new Model.Translatable(json.ta),
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
