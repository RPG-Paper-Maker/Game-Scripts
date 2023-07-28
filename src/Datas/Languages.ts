/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic, System } from '..';
import { Platform, Paths, Utils } from '../Common';

interface ExtrasKind {
	loadAGame: System.Translatable;
	loadAGameDescription: System.Translatable;
	slot: System.Translatable;
	empty: System.Translatable;
	saveAGame: System.Translatable;
	saveAGameDescription: System.Translatable;
	keyboardAssignment: System.Translatable;
	keyboardAssignmentDescription: System.Translatable;
	keyboardAssignmentSelectedDescription: System.Translatable;
	language: System.Translatable;
	languageDescription: System.Translatable;
	languageSelectedDescription: System.Translatable;
	confirm: System.Translatable;
	ok: System.Translatable;
	yes: System.Translatable;
	no: System.Translatable;
	add: System.Translatable;
	remove: System.Translatable;
	shop: System.Translatable;
	buy: System.Translatable;
	sell: System.Translatable;
	owned: System.Translatable;
	selectAnAlly: System.Translatable;
	victory: System.Translatable;
	defeat: System.Translatable;
	levelUp: System.Translatable;
	precision: System.Translatable;
	critical: System.Translatable;
	damage: System.Translatable;
	heal: System.Translatable;
	skill: System.Translatable;
	performSkill: System.Translatable;
	loading: System.Translatable;
	equipQuestion: System.Translatable;
	pressAnyKeys: System.Translatable;
	target: System.Translatable;
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
		let json = await Platform.parseFileJSON(Paths.FILE_LANGS);
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
			loadAGame: new System.Translatable(json.lag),
			loadAGameDescription: new System.Translatable(json.lagd),
			slot: new System.Translatable(json.sl),
			empty: new System.Translatable(json.em),
			saveAGame: new System.Translatable(json.sag),
			saveAGameDescription: new System.Translatable(json.sagd),
			keyboardAssignment: new System.Translatable(json.ka),
			keyboardAssignmentDescription: new System.Translatable(json.kad),
			keyboardAssignmentSelectedDescription: new System.Translatable(json.kasd),
			language: new System.Translatable(json.l),
			languageDescription: new System.Translatable(json.ld),
			languageSelectedDescription: new System.Translatable(json.lsd),
			confirm: new System.Translatable(json.co),
			ok: new System.Translatable(json.ok),
			yes: new System.Translatable(json.ye),
			no: new System.Translatable(json.no),
			add: new System.Translatable(json.ad),
			remove: new System.Translatable(json.re),
			shop: new System.Translatable(json.sh),
			buy: new System.Translatable(json.bu),
			sell: new System.Translatable(json.se),
			owned: new System.Translatable(json.ow),
			selectAnAlly: new System.Translatable(json.saa),
			victory: new System.Translatable(json.vi),
			defeat: new System.Translatable(json.de),
			levelUp: new System.Translatable(json.lu),
			precision: new System.Translatable(json.pr),
			critical: new System.Translatable(json.cr),
			damage: new System.Translatable(json.da),
			heal: new System.Translatable(json.he),
			skill: new System.Translatable(json.sk),
			performSkill: new System.Translatable(json.ps),
			loading: new System.Translatable(json.lo),
			equipQuestion: new System.Translatable(json.eq),
			pressAnyKeys: new System.Translatable(json.pak),
			target: new System.Translatable(json.ta),
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
