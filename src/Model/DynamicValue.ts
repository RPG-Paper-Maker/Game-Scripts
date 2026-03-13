/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { DYNAMIC_VALUE_KIND, PICTURE_KIND, Platform, SONG_KIND, Utils } from '../Common';
import { MapObjectCommandType } from '../Common/Types';
import { Game, ReactionInterpreter } from '../Core';
import { StructIterator } from '../EventCommand';
import { Data } from '../index';
import { Base } from './Base';

/**
 * JSON structure describing a dynamic value.
 */
export type DynamicValueJSON = {
	k: DYNAMIC_VALUE_KIND;
	v: unknown;
	x?: DynamicValueJSON;
	y?: DynamicValueJSON;
	z?: DynamicValueJSON;
	customStructure?: {
		properties: { name: string; value: DynamicValueJSON }[];
	};
	customList?: {
		list: { value: DynamicValueJSON }[];
	};
};

/**
 * A dynamic value (variable, parameter, constant, etc.).
 */
export class DynamicValue extends Base {
	public kind: DYNAMIC_VALUE_KIND;
	public value: unknown;
	public customStructure: Record<string, DynamicValue>;
	public customList: DynamicValue[];
	public x: DynamicValue;
	public y: DynamicValue;
	public z: DynamicValue;

	constructor(json?: DynamicValueJSON) {
		super(json);
	}

	/** Create a new value from kind and value. */
	static create(k: DYNAMIC_VALUE_KIND = DYNAMIC_VALUE_KIND.NONE, v: unknown = 0): DynamicValue {
		const modelValue = new DynamicValue();
		modelValue.kind = k;
		switch (k) {
			case DYNAMIC_VALUE_KIND.NONE:
				modelValue.value = null;
				break;
			case DYNAMIC_VALUE_KIND.MESSAGE:
				modelValue.value = String(v);
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				modelValue.value = v === 1 ? true : v === 0 ? false : v;
				break;
			default:
				modelValue.value = v;
				break;
		}
		return modelValue;
	}

	/** Create a new value from a command and iterator. */
	static createValueCommand(command: MapObjectCommandType[], iterator: StructIterator): DynamicValue {
		const k = command[iterator.i++] as DYNAMIC_VALUE_KIND;
		const v = command[iterator.i++];
		return DynamicValue.create(k, v);
	}

	/**
	 *  Create a none value.
	 */
	static createNone(): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.NONE, null);
	}

	/**
	 *  Create a new value number.
	 */
	static createNumber(n: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, n);
	}

	/**
	 *  Create a new value message.
	 */
	static createMessage(m: string): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m);
	}

	/**
	 *  Create a new value decimal number.
	 */
	static createNumberDouble(n: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DOUBLE, n);
	}

	/**
	 *  Create a new value keyBoard.
	 */
	static createKeyBoard(k: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.KEYBOARD, k);
	}

	/**
	 *  Create a new value switch.
	 */
	static createSwitch(b: boolean): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, Utils.boolToNumber(b));
	}

	/**
	 *  Create a new value variable.
	 */
	static createVariable(id: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.VARIABLE, id);
	}

	/**
	 *  Create a new value parameter.
	 */
	static createParameter(id: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.PARAMETER, id);
	}

	/**
	 *  Create a new value property.
	 */
	static createProperty(id: number): DynamicValue {
		return DynamicValue.create(DYNAMIC_VALUE_KIND.PROPERTY, id);
	}

	/** Map parameters so they get resolved values instead of references. */
	static mapWithParametersProperties(parameters: DynamicValue[]): DynamicValue[] {
		return parameters.map((value) => {
			return value.kind === DYNAMIC_VALUE_KIND.PARAMETER || DYNAMIC_VALUE_KIND.PROPERTY
				? DynamicValue.create(DYNAMIC_VALUE_KIND.UNKNOWN, value.getValue() as number)
				: value;
		});
	}

	/**
	 *  Try to read a variable value, if not possible put default value.
	 */
	static readOrDefaultVariable(json?: DynamicValueJSON): DynamicValue {
		return json === undefined ? DynamicValue.createVariable(1) : DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a number value, if not possible put default value.
	 */
	static readOrDefaultNumber(json?: DynamicValueJSON, n = 0): DynamicValue {
		return json === undefined ? DynamicValue.createNumber(n) : DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a double number value, if not possible put default value.
	 */
	static readOrDefaultNumberDouble(json?: DynamicValueJSON, n = 0): DynamicValue {
		return json === undefined ? DynamicValue.createNumberDouble(n) : DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a database value, if not possible put default value.
	 */
	static readOrDefaultDatabase(json?: DynamicValueJSON, id = 1): DynamicValue {
		return json === undefined
			? DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, id)
			: DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a message value, if not possible put default value.
	 */
	static readOrDefaultMessage(json?: DynamicValueJSON, m = ''): DynamicValue {
		return json === undefined
			? DynamicValue.create(DYNAMIC_VALUE_KIND.MESSAGE, m)
			: DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a switch value, if not possible put default value.
	 */
	static readOrDefaultSwitch(json?: DynamicValueJSON, s = true): DynamicValue {
		return json === undefined ? DynamicValue.createSwitch(s) : DynamicValue.readFromJSON(json);
	}

	/**
	 *  Try to read a value, if not possible put none value.
	 */
	static readOrNone(json?: DynamicValueJSON): DynamicValue {
		return json === undefined ? DynamicValue.createNone() : DynamicValue.readFromJSON(json);
	}

	/**
	 *  Read a value of any kind and return it.
	 */
	static readFromJSON(json: DynamicValueJSON): DynamicValue {
		const value = new DynamicValue();
		value.read(json);
		return value;
	}

	/**
	 *  Get the value.
	 */
	getValue(forceVariable: boolean = false, deep: boolean = false): unknown {
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.VARIABLE:
				if (!Game.current) {
					Platform.showErrorMessage('Trying to access a variable value without any game loaded.');
				}
				return forceVariable ? this.value : Game.current.getVariable(this.value as number);
			case DYNAMIC_VALUE_KIND.PARAMETER:
				return ReactionInterpreter.currentParameters.get(this.value as number).getValue() as number;
			case DYNAMIC_VALUE_KIND.PROPERTY:
				return ReactionInterpreter.currentObject.properties[this.value as number];
			case DYNAMIC_VALUE_KIND.CLASS:
				return Data.Classes.get(this.value as number);
			case DYNAMIC_VALUE_KIND.HERO:
				return Data.Heroes.get(this.value as number);
			case DYNAMIC_VALUE_KIND.MONSTER:
				return Data.Monsters.get(this.value as number);
			case DYNAMIC_VALUE_KIND.TROOP:
				return Data.Troops.get(this.value as number);
			case DYNAMIC_VALUE_KIND.ITEM:
				return Data.Items.get(this.value as number);
			case DYNAMIC_VALUE_KIND.WEAPON:
				return Data.Weapons.get(this.value as number);
			case DYNAMIC_VALUE_KIND.ARMOR:
				return Data.Armors.get(this.value as number);
			case DYNAMIC_VALUE_KIND.SKILL:
				return Data.Skills.get(this.value as number);
			case DYNAMIC_VALUE_KIND.ANIMATION:
				return Data.Animations.get(this.value as number);
			case DYNAMIC_VALUE_KIND.STATUS:
				return Data.Status.get(this.value as number);
			case DYNAMIC_VALUE_KIND.TILESET:
				return Data.Tilesets.get(this.value as number);
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
				return Data.Systems.getFontSize(this.value as number);
			case DYNAMIC_VALUE_KIND.FONT_NAME:
				return Data.Systems.getFontName(this.value as number);
			case DYNAMIC_VALUE_KIND.COLOR:
				return Data.Systems.getColor(this.value as number);
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
				return Data.Systems.getWindowSkin(this.value as number);
			case DYNAMIC_VALUE_KIND.CURRENCY:
				return Data.Systems.getCurrency(this.value as number);
			case DYNAMIC_VALUE_KIND.SPEED:
				return Data.Systems.getSpeed(this.value as number);
			case DYNAMIC_VALUE_KIND.DETECTION:
				return Data.Systems.getDetection(this.value as number);
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
				return Data.Systems.getCameraProperties(this.value as number);
			case DYNAMIC_VALUE_KIND.FREQUENCY:
				return Data.Systems.getFrequency(this.value as number);
			case DYNAMIC_VALUE_KIND.SKYBOX:
				return Data.Systems.getSkybox(this.value as number);
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
				return Data.BattleSystems.getBattleMap(this.value as number);
			case DYNAMIC_VALUE_KIND.ELEMENT:
				return Data.BattleSystems.getElement(this.value as number);
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
				return Data.BattleSystems.getStatistic(this.value as number);
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
				return Data.BattleSystems.getWeaponKind(this.value as number);
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
				return Data.BattleSystems.getArmorKind(this.value as number);
			case DYNAMIC_VALUE_KIND.COMMON_BATTLE_COMMAND:
				return Data.BattleSystems.getBattleCommand(this.value as number);
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
				return Data.BattleSystems.getEquipment(this.value as number);
			case DYNAMIC_VALUE_KIND.EVENT:
				return Data.CommonEvents.getEventUser(this.value as number);
			case DYNAMIC_VALUE_KIND.STATE:
				return this.value;
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
				return Data.CommonEvents.getCommonReaction(this.value as number);
			case DYNAMIC_VALUE_KIND.MODEL:
				return Data.CommonEvents.getCommonObject(this.value as number);
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
					return this.customList.map((v) => v.getValue(forceVariable, true));
				}
				return this.customList;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				return new THREE.Vector2(this.x.getValue() as number as number, this.y.getValue() as number as number);
			case DYNAMIC_VALUE_KIND.VECTOR3:
				return new THREE.Vector3(
					this.x.getValue() as number as number,
					this.y.getValue() as number as number,
					this.z.getValue() as number as number,
				);
			case DYNAMIC_VALUE_KIND.BARS:
				return Data.Pictures.get(PICTURE_KIND.BARS, this.value as number);
			case DYNAMIC_VALUE_KIND.ICONS:
				return Data.Pictures.get(PICTURE_KIND.ICONS, this.value as number);
			case DYNAMIC_VALUE_KIND.AUTOTILES:
				return Data.Pictures.get(PICTURE_KIND.AUTOTILES, this.value as number);
			case DYNAMIC_VALUE_KIND.CHARACTERS:
				return Data.Pictures.get(PICTURE_KIND.CHARACTERS, this.value as number);
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
				return Data.Pictures.get(PICTURE_KIND.MOUNTAINS, this.value as number);
			case DYNAMIC_VALUE_KIND.TILESETS:
				return Data.Pictures.get(PICTURE_KIND.TILESETS, this.value as number);
			case DYNAMIC_VALUE_KIND.WALLS:
				return Data.Pictures.get(PICTURE_KIND.WALLS, this.value as number);
			case DYNAMIC_VALUE_KIND.BATTLERS:
				return Data.Pictures.get(PICTURE_KIND.BATTLERS, this.value as number);
			case DYNAMIC_VALUE_KIND.FACESETS:
				return Data.Pictures.get(PICTURE_KIND.FACESETS, this.value as number);
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
				return Data.Pictures.get(PICTURE_KIND.WINDOW_SKINS, this.value as number);
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
				return Data.Pictures.get(PICTURE_KIND.TITLE_SCREEN, this.value as number);
			case DYNAMIC_VALUE_KIND.OBJECT_3D:
				return Data.Pictures.get(PICTURE_KIND.OBJECTS_3D, this.value as number);
			case DYNAMIC_VALUE_KIND.PICTURES:
				return Data.Pictures.get(PICTURE_KIND.PICTURES, this.value as number);
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
				return Data.Pictures.get(PICTURE_KIND.ANIMATIONS, this.value as number);
			case DYNAMIC_VALUE_KIND.SKYBOXES:
				return Data.Pictures.get(PICTURE_KIND.SKYBOXES, this.value as number);
			case DYNAMIC_VALUE_KIND.MUSIC:
				return Data.Songs.get(SONG_KIND.MUSIC, this.value as number);
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
				return Data.Songs.get(SONG_KIND.BACKGROUND_SOUND, this.value as number);
			case DYNAMIC_VALUE_KIND.SOUND:
				return Data.Songs.get(SONG_KIND.SOUND, this.value as number);
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				return Data.Songs.get(SONG_KIND.MUSIC_EFFECT, this.value as number);
			default:
				return this.value;
		}
	}

	/** Check if a value is equal to another one. */
	isEqual(value: DynamicValue): boolean {
		// If keyBoard
		if (this.kind === DYNAMIC_VALUE_KIND.KEYBOARD && value.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
			return Data.Keyboards.isKeyEqual(value.value as string, Data.Keyboards.get(this.value as number));
		} else if (value.kind === DYNAMIC_VALUE_KIND.KEYBOARD && this.kind !== DYNAMIC_VALUE_KIND.KEYBOARD) {
			return Data.Keyboards.isKeyEqual(this.value as string, Data.Keyboards.get(value.value as number));
		} else if (this.kind === DYNAMIC_VALUE_KIND.ANYTHING || value.kind === DYNAMIC_VALUE_KIND.ANYTHING) {
			return true;
		}
		// If any other value, compare the direct values
		return (this.getValue() as number) === (value.getValue() as number);
	}

	/** Create a copy of the value. */
	createCopy(): DynamicValue {
		return DynamicValue.create(this.kind, this.value);
	}

	/** Read the JSON. */
	read(json: DynamicValueJSON) {
		this.kind = json.k;
		this.value = json.v;
		switch (this.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				this.customStructure = {};
				for (const { name, value } of Utils.valueOrDefault(json.customStructure?.properties, [])) {
					this.customStructure[name] = DynamicValue.readOrDefaultNumber(value);
				}
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				this.customList = Utils.readJSONList(
					json.customList.list,
					(jsonParameter: { value: DynamicValueJSON }) =>
						DynamicValue.readOrDefaultNumber(jsonParameter.value),
				);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
				this.x = DynamicValue.readFromJSON(json.x);
				this.y = DynamicValue.readFromJSON(json.y);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR3:
				this.x = DynamicValue.readFromJSON(json.x);
				this.y = DynamicValue.readFromJSON(json.y);
				this.z = DynamicValue.readFromJSON(json.z);
				break;
			default:
				break;
		}
	}

	/** Convert to JSON. */
	toJson(): DynamicValueJSON {
		return { k: this.kind, v: this.value };
	}
}
