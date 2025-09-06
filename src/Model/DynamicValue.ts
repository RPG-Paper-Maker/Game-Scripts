/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { DYNAMIC_VALUE_KIND, PICTURE_KIND, Platform, SONG_KIND, Utils } from '../Common';
import { Game, ReactionInterpreter } from '../Core';
import { StructIterator } from '../EventCommand';
import { Datas, Model } from '../index';

export type DynamicValueJSON = {
	k: DYNAMIC_VALUE_KIND;
	v: any;
	x: DynamicValueJSON;
	y: DynamicValueJSON;
	z: DynamicValueJSON;
	customStructure?: Record<string, any>;
	customList?: Record<string, any>;
};

/** @class
 *  The class who handle dynamic value.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the value
 */
export class DynamicValue extends Model.Base {
	public kind: DYNAMIC_VALUE_KIND;
	public value: any;
	public customStructure: Record<string, Model.DynamicValue>;
	public customList: Model.DynamicValue[];
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public z: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Create a new value from kind and value.
	 *  @static
	 *  @param {DYNAMIC_VALUE_KIND} [k=DYNAMIC_VALUE_KIND.NONE] - The kind of value
	 *  @param {any} [v=0] - The value
	 *  @returns {SystemValue}
	 */
	static create(k: DYNAMIC_VALUE_KIND = DYNAMIC_VALUE_KIND.NONE, v: any = 0): Model.DynamicValue {
		const systemValue = new Model.DynamicValue();
		systemValue.kind = k;
		switch (k) {
			case DYNAMIC_VALUE_KIND.NONE:
				systemValue.value = null;
				break;
			case DYNAMIC_VALUE_KIND.MESSAGE:
				systemValue.value = String(v);
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				switch (v) {
					case 1:
						systemValue.value = true;
						break;
					case 0:
						systemValue.value = false;
						break;
					default:
						systemValue.value = v;
						break;
				}
				break;
			default:
				systemValue.value = v;
				break;
		}
		return systemValue;
	}

	/**
	 *  Create a new value from a command and iterator.
	 *  @static
	 *  @param {any[]} command - The list describing the command
	 *  @param {StructIterator} iterator - The iterator
	 *  @returns {Model.DynamicValue}
	 */
	static createValueCommand(command: any[], iterator: StructIterator): Model.DynamicValue {
		const k = command[iterator.i++];
		const v = command[iterator.i++];
		return Model.DynamicValue.create(k, v);
	}

	/**
	 *  Create a none value.
	 *  @static
	 *  @returns {Model.DynamicValue}
	 */
	static createNone(): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.NONE, null);
	}

	/**
	 *  Create a new value number.
	 *  @static
	 *  @param {number} n - The number
	 *  @returns {Model.DynamicValue}
	 */
	static createNumber(n: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, n);
	}

	/**
	 *  Create a new value message.
	 *  @static
	 *  @param {string} m - The message
	 *  @returns {Model.DynamicValue}
	 */
	static createMessage(m: string): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m);
	}

	/**
	 *  Create a new value decimal number.
	 *  @static
	 *  @param {number} n - The number
	 *  @returns {Model.DynamicValue}
	 */
	static createNumberDouble(n: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DOUBLE, n);
	}

	/**
	 *  Create a new value keyBoard.
	 *  @static
	 *  @param {number} k - The key number
	 *  @returns {Model.DynamicValue}
	 */
	static createKeyBoard(k: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.KEYBOARD, k);
	}

	/**
	 *  Create a new value switch.
	 *  @static
	 *  @param {boolean} b - The value of the switch
	 *  @returns {Model.DynamicValue}
	 */
	static createSwitch(b: boolean): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, Utils.boolToNumber(b));
	}

	/**
	 *  Create a new value variable.
	 *  @static
	 *  @param {number} id - The variable ID
	 *  @returns {Model.DynamicValue}
	 */
	static createVariable(id: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.VARIABLE, id);
	}

	/**
	 *  Create a new value parameter.
	 *  @static
	 *  @param {number} id - The parameter ID
	 *  @returns {Model.DynamicValue}
	 */
	static createParameter(id: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.PARAMETER, id);
	}

	/**
	 *  Create a new value property.
	 *  @static
	 *  @param {number} id - The property id
	 *  @returns {Model.DynamicValue}
	 */
	static createProperty(id: number): Model.DynamicValue {
		return Model.DynamicValue.create(DYNAMIC_VALUE_KIND.PROPERTY, id);
	}

	/**
	 *  Map a list of parameters so it gets the current properties and
	 *  parameters values.
	 *  @static
	 *  @param {Model.DynamicValue[]} parameters
	 *  @returns {Model.DynamicValue[]}
	 */
	static mapWithParametersProperties(parameters: Model.DynamicValue[]): Model.DynamicValue[] {
		return parameters.map((value) => {
			return value.kind === DYNAMIC_VALUE_KIND.PARAMETER || DYNAMIC_VALUE_KIND.PROPERTY
				? Model.DynamicValue.create(DYNAMIC_VALUE_KIND.UNKNOWN, value.getValue())
				: value;
		});
	}

	/**
	 *  Try to read a variable value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {number} [n=0] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultVariable(json: DynamicValueJSON): Model.DynamicValue {
		return json === undefined ? Model.DynamicValue.createVariable(1) : Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a number value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {number} [n=0] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultNumber(json: DynamicValueJSON, n: number = 0): Model.DynamicValue {
		return json === undefined ? Model.DynamicValue.createNumber(n) : Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a double number value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {number} [n=0] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultNumberDouble(json: DynamicValueJSON, n: number = 0): Model.DynamicValue {
		return json === undefined ? Model.DynamicValue.createNumberDouble(n) : Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a database value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {number} [id=1] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultDatabase(json: DynamicValueJSON, id: number = 1): Model.DynamicValue {
		return json === undefined
			? Model.DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, id)
			: Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a message value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {string} [m=""] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultMessage(json: DynamicValueJSON, m: string = ''): Model.DynamicValue {
		return json === undefined
			? Model.DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m)
			: Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a switch value, if not possible put default value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @param {boolean} [s=true] - The default value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrDefaultSwitch(json: DynamicValueJSON, s: boolean = true): Model.DynamicValue {
		return json === undefined ? Model.DynamicValue.createSwitch(s) : Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a value, if not possible put none value.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @returns {Model.DynamicValue}
	 */
	static readOrNone(json: DynamicValueJSON): Model.DynamicValue {
		return json === undefined ? Model.DynamicValue.createNone() : Model.DynamicValue.readFromJSON(json);
	}

	/**
	 *  Read a value of any kind and return it.
	 *  @static
	 *  @param {DynamicValueJSONDynamicValue} json - The json value
	 *  @returns {Model.DynamicValue}
	 */
	static readFromJSON(json: DynamicValueJSON): Model.DynamicValue {
		const value = new Model.DynamicValue();
		value.read(json);
		return value;
	}

	/**
	 *  Read the JSON associated to the value
	 *  @param {DynamicValueJSONDynamicValue} json - Json object describing the value
	 */
	read(json: any) {
		this.kind = json.k;
		this.value = json.v;

		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = {};
				const jsonList = Utils.valueOrDefault(json.customStructure.properties, []);
				let parameter: Model.DynamicValue, jsonParameter: Record<string, any>;
				for (let i = 0, l = jsonList.length; i < l; i++) {
					jsonParameter = jsonList[i];
					parameter = Model.DynamicValue.readOrDefaultNumber(jsonParameter.value);
					this.customStructure[jsonParameter.name] = parameter;
				}
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = [];
				Utils.readJSONSystemList({
					list: Utils.valueOrDefault(json.customList.list, []),
					listIndexes: this.customList,
					func: (jsonParameter: Record<string, any>) => {
						return Model.DynamicValue.readOrDefaultNumber(jsonParameter.value);
					},
				});
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = Model.DynamicValue.readFromJSON(json.x);
				this.y = Model.DynamicValue.readFromJSON(json.y);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = Model.DynamicValue.readFromJSON(json.x);
				this.y = Model.DynamicValue.readFromJSON(json.y);
				this.z = Model.DynamicValue.readFromJSON(json.z);
				break;
			default:
				break;
		}
	}

	/**
	 *  Get the json value.
	 *  @returns {Record<string, any>}
	 */
	toJson(): Record<string, any> {
		const json: Record<string, any> = {};
		json.k = this.kind;
		json.v = this.value;
		return json;
	}

	/**
	 *  Get the value
	 *  @returns {any}
	 */
	getValue<T>(forceVariable: boolean = false, deep: boolean = false): any {
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.VARIABLE:
				if (!Game.current) {
					Platform.showErrorMessage('Trying to access a variable value without any game loaded.');
				}
				return forceVariable ? this.value : Game.current.variables[this.value];
			case DYNAMIC_VALUE_KIND.PARAMETER:
				return ReactionInterpreter.currentParameters[this.value].getValue();
			case DYNAMIC_VALUE_KIND.PROPERTY:
				return ReactionInterpreter.currentObject.properties[this.value];
			case DYNAMIC_VALUE_KIND.CLASS:
				return Datas.Classes.get(this.value);
			case DYNAMIC_VALUE_KIND.HERO:
				return Datas.Heroes.get(this.value);
			case DYNAMIC_VALUE_KIND.MONSTER:
				return Datas.Monsters.get(this.value);
			case DYNAMIC_VALUE_KIND.TROOP:
				return Datas.Troops.get(this.value);
			case DYNAMIC_VALUE_KIND.ITEM:
				return Datas.Items.get(this.value);
			case DYNAMIC_VALUE_KIND.WEAPON:
				return Datas.Weapons.get(this.value);
			case DYNAMIC_VALUE_KIND.ARMOR:
				return Datas.Armors.get(this.value);
			case DYNAMIC_VALUE_KIND.SKILL:
				return Datas.Skills.get(this.value);
			case DYNAMIC_VALUE_KIND.ANIMATION:
				return Datas.Animations.get(this.value);
			case DYNAMIC_VALUE_KIND.STATUS:
				return Datas.Status.get(this.value);
			case DYNAMIC_VALUE_KIND.TILESET:
				return Datas.Tilesets.get(this.value);
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
				return Datas.Systems.getFontSize(this.value);
			case DYNAMIC_VALUE_KIND.FONT_NAME:
				return Datas.Systems.getFontName(this.value);
			case DYNAMIC_VALUE_KIND.COLOR:
				return Datas.Systems.getColor(this.value);
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
				return Datas.Systems.getWindowSkin(this.value);
			case DYNAMIC_VALUE_KIND.CURRENCY:
				return Datas.Systems.getCurrency(this.value);
			case DYNAMIC_VALUE_KIND.SPEED:
				return Datas.Systems.getSpeed(this.value);
			case DYNAMIC_VALUE_KIND.DETECTION:
				return Datas.Systems.getDetection(this.value);
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
				return Datas.Systems.getCameraProperties(this.value);
			case DYNAMIC_VALUE_KIND.FREQUENCY:
				return Datas.Systems.getFrequency(this.value);
			case DYNAMIC_VALUE_KIND.SKYBOX:
				return Datas.Systems.getSkybox(this.value);
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
				return Datas.BattleSystems.getBattleMap(this.value);
			case DYNAMIC_VALUE_KIND.ELEMENT:
				return Datas.BattleSystems.getElement(this.value);
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
				return Datas.BattleSystems.getStatistic(this.value);
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
				return Datas.BattleSystems.getWeaponKind(this.value);
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
				return Datas.BattleSystems.getArmorKind(this.value);
			case DYNAMIC_VALUE_KIND.COMMON_BATTLE_COMMAND:
				return Datas.BattleSystems.getBattleCommand(this.value);
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
				return Datas.BattleSystems.getEquipment(this.value);
			case DYNAMIC_VALUE_KIND.EVENT:
				return Datas.CommonEvents.getEventUser(this.value);
			case DYNAMIC_VALUE_KIND.STATE:
				return this.value;
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
				return Datas.CommonEvents.getCommonReaction(this.value);
			case DYNAMIC_VALUE_KIND.MODEL:
				return Datas.CommonEvents.getCommonObject(this.value);
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				if (deep) {
					const obj = {};
					for (const k in this.customStructure) {
						obj[k] = this.customStructure[k].getValue(forceVariable, true);
					}
					return obj;
				}
				return this.customStructure;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				if (deep) {
					const list = [];
					for (const v of this.customList) {
						list.push(v.getValue(forceVariable, true));
					}
					return list;
				}
				return this.customList;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				return new THREE.Vector2(this.x.getValue(), this.y.getValue());
			case DYNAMIC_VALUE_KIND.VECTOR3:
				return new THREE.Vector3(this.x.getValue(), this.y.getValue(), this.z.getValue());
			case DYNAMIC_VALUE_KIND.BARS:
				return Datas.Pictures.get(PICTURE_KIND.BARS, this.value);
			case DYNAMIC_VALUE_KIND.ICONS:
				return Datas.Pictures.get(PICTURE_KIND.ICONS, this.value);
			case DYNAMIC_VALUE_KIND.AUTOTILES:
				return Datas.Pictures.get(PICTURE_KIND.AUTOTILES, this.value);
			case DYNAMIC_VALUE_KIND.CHARACTERS:
				return Datas.Pictures.get(PICTURE_KIND.CHARACTERS, this.value);
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
				return Datas.Pictures.get(PICTURE_KIND.MOUNTAINS, this.value);
			case DYNAMIC_VALUE_KIND.TILESETS:
				return Datas.Pictures.get(PICTURE_KIND.TILESETS, this.value);
			case DYNAMIC_VALUE_KIND.WALLS:
				return Datas.Pictures.get(PICTURE_KIND.WALLS, this.value);
			case DYNAMIC_VALUE_KIND.BATTLERS:
				return Datas.Pictures.get(PICTURE_KIND.BATTLERS, this.value);
			case DYNAMIC_VALUE_KIND.FACESETS:
				return Datas.Pictures.get(PICTURE_KIND.FACESETS, this.value);
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
				return Datas.Pictures.get(PICTURE_KIND.WINDOW_SKINS, this.value);
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
				return Datas.Pictures.get(PICTURE_KIND.TITLE_SCREEN, this.value);
			case DYNAMIC_VALUE_KIND.OBJECT_3D:
				return Datas.Pictures.get(PICTURE_KIND.OBJECTS_3D, this.value);
			case DYNAMIC_VALUE_KIND.PICTURES:
				return Datas.Pictures.get(PICTURE_KIND.PICTURES, this.value);
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
				return Datas.Pictures.get(PICTURE_KIND.ANIMATIONS, this.value);
			case DYNAMIC_VALUE_KIND.SKYBOXES:
				return Datas.Pictures.get(PICTURE_KIND.SKYBOXES, this.value);
			case DYNAMIC_VALUE_KIND.MUSIC:
				return Datas.Songs.get(SONG_KIND.MUSIC, this.value);
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
				return Datas.Songs.get(SONG_KIND.BACKGROUND_SOUND, this.value);
			case DYNAMIC_VALUE_KIND.SOUND:
				return Datas.Songs.get(SONG_KIND.SOUND, this.value);
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				return Datas.Songs.get(SONG_KIND.MUSIC_EFFECT, this.value);
			default:
				return this.value;
		}
	}

	/**
	 *  Check if a value is equal to another one
	 *  @param {Model.DynamicValue} value - The value to compare
	 *  @returns {boolean}
	 */
	isEqual(value: Model.DynamicValue): boolean {
		// If keyBoard
		if (this.kind === DYNAMIC_VALUE_KIND.KEYBOARD && value.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
			return Datas.Keyboards.isKeyEqual(value.value, Datas.Keyboards.get(this.value));
		} else if (value.kind === DYNAMIC_VALUE_KIND.KEYBOARD && this.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
			return Datas.Keyboards.isKeyEqual(this.value, Datas.Keyboards.get(value.value));
		} else if (this.kind === DYNAMIC_VALUE_KIND.ANYTHING || value.kind === DYNAMIC_VALUE_KIND.ANYTHING) {
			return true;
		}
		// If any other value, compare the direct values
		return this.getValue() === value.getValue();
	}

	/**
	 *  Create a copy of the value.
	 *  @param {Model.DynamicValue} v
	 *  @returns {Model.DynamicValue}
	 */
	createCopy(): Model.DynamicValue {
		return Model.DynamicValue.create(this.kind, this.value);
	}
}
