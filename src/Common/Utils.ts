/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from './index';
import { JsonObject } from './Types';

interface SystemJsonList<T = any> {
	list: Record<string, any>[];
	listIDs?: T[];
	listIndexes?: (T | number)[];
	indexesIDs?: boolean;
	listHash?: Record<string, T>;
	cons?: new (data: any) => T;
	func?: (data: any) => T;
}

/**
 * Static utility class providing helper functions for value handling,
 * formatting, JSON parsing, and array/object manipulation.
 */
export class Utils {
	/**
	 * Returns the default value if the given value is `undefined`, otherwise returns the value.
	 * @template T
	 * @param value - The value to check
	 * @param defaultValue - The default value to return if `value` is undefined
	 * @returns The resolved value
	 */
	public static valueOrDefault<T>(value: T | undefined, defaultValue: T): T {
		return value === undefined ? defaultValue : value;
	}

	/**
	 * Converts a number (1 or 0) into a boolean.
	 * @param num - The number
	 * @returns True if `num` is 1, otherwise false
	 */
	public static numberToBool(num: number): boolean {
		return num === 1;
	}

	/**
	 * Converts a boolean into a number (true → 1, false → 0).
	 * @param b - The boolean
	 * @returns The number representation
	 */
	public static boolToNumber(b: boolean): number {
		return b ? 1 : 0;
	}

	/**
	 * Converts a total number of seconds into a formatted time string (HH:MM:SS).
	 * @param total - Total number of seconds
	 * @returns A formatted string
	 */
	public static getStringDate(total: number): string {
		return (
			this.formatNumber(Math.floor(total / 3600), 4) +
			':' +
			this.formatNumber(Math.floor((total % 3600) / 60), 2) +
			':' +
			this.formatNumber(Math.floor(total % 60), 2)
		);
	}

	/**
	 * Formats a number with leading zeros according to a given size.
	 * @param num - The number
	 * @param size - The total length
	 * @returns A formatted string
	 */
	public static formatNumber(num: number, size: number): string {
		return num.toString().padStart(size, '0');
	}

	/**
	 * Returns a formatted string containing an ID and name.
	 * @param id - The ID
	 * @param name - The name
	 * @returns A formatted string
	 */
	public static getIDName(id: number, name: string): string {
		return `<> ${this.formatNumber(id, 4)}: ${name}`;
	}

	/**
	 * Builds a font string usable by canvas contexts.
	 * @param fontSize - Font size in pixels
	 * @param fontName - Font family name
	 * @param bold - Whether the font is bold
	 * @param italic - Whether the font is italic
	 * @returns A CSS-compatible font string
	 */
	public static createFont(fontSize: number, fontName: string, bold: boolean, italic: boolean): string {
		return `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${fontSize}px "${fontName}"`;
	}

	/**
	 * Reads a JSON system list and populates the provided structures with elements.
	 * @param json - The JSON list definition
	 * @returns The maximum ID encountered
	 */
	public static readJSONSystemList<T>(json: SystemJsonList<T>): number {
		// TODO replace by Map
		let maxID = 0;

		for (let i = 0; i < json.list.length; i++) {
			const jsonElement = json.list[i];
			const id = jsonElement.id;
			let element: T;

			if (json.listHash === undefined) {
				element = json.cons ? new json.cons(jsonElement) : json.func!(jsonElement);

				if (json.listIDs) {
					json.listIDs[jsonElement.id] = element;
				}
				if (json.listIndexes) {
					json.listIndexes[i] = json.indexesIDs ? id : element;
				}
			} else {
				json.listHash[jsonElement[Constants.JSON_KEY]] = json.cons
					? new json.cons(jsonElement[Constants.JSON_VALUE])
					: json.func!(jsonElement);
			}

			maxID = Math.max(id, maxID);
		}

		return maxID;
	}

	/**
	 * Reads a JSON list and returns an array of objects of type `T`,
	 * ordered by the `id` property in ascending order.
	 * @typeParam T - The type of object to construct from each JSON entry.
	 * @param jsonList - The array of JSON objects to read and process. Defaults to empty array.
	 * @param transformFn - A constructor function (`new`) or a custom function to create an instance of `T`.
	 *  @param ordered - indicates if the list should be sorted by `id`.
	 * @returns An array of objects of type `T` sorted by `id` if wanted.
	 * @throws Will throw an error if `transformFn` is not provided.
	 * @remarks
	 * JSON entries without an `id` will default to `0` for sorting purposes.
	 */
	public static readJSONList<T>(
		jsonList: JsonObject[] = [],
		transformFn: (new (data: JsonObject) => T) | ((data: JsonObject) => T),
		ordered = false
	): T[] {
		const list = jsonList;
		if (ordered) {
			list.sort((a, b) => ((a.id as number) ?? 0) - ((b.id as number) ?? 0));
		}
		return list.map((json) => {
			if (transformFn.prototype && typeof transformFn === 'function') {
				// Called as constructor
				return new (transformFn as new (data: JsonObject) => T)(json);
			} else {
				// Called as regular function
				return (transformFn as (data: JsonObject) => T)(json);
			}
		});
	}

	/**
	 * Converts a list of JSON objects into a `Map<number, T>`,
	 * using a provided transform function or constructor.
	 * @template T - The target type to transform each JSON object into.
	 * @param {JsonObject[]} [jsonList=[]] - An array of JSON objects. Each must contain an `id` field (numeric).
	 * @param {(new (data: JsonObject) => T) | ((data: JsonObject) => T)} transformFn -
	 *   Either a class constructor or a plain function to transform each JSON object into type `T`.
	 * @returns {Map<number, T>} A map where:
	 *   - The key is the `id` property of each JSON object.
	 *   - The value is the transformed object of type `T`.
	 */
	public static readJSONMap<T>(
		jsonList: JsonObject[] = [],
		transformFn: (new (data: JsonObject) => T) | ((data: JsonObject) => T)
	): Map<number, T> {
		return new Map(
			jsonList.map<[number, T]>((json) => {
				let item: T;
				if (typeof transformFn === 'function' && 'prototype' in transformFn) {
					// Called as constructor
					item = new (transformFn as new (data: JsonObject) => T)(json);
				} else {
					// Called as regular function
					item = (transformFn as (data: JsonObject) => T)(json);
				}
				return [(json.id as number) ?? 0, item];
			})
		);
	}

	public static getMapMaxID(map: Map<number, unknown>): number {
		return map.size > 0 ? Math.max(...map.keys()) : 0;
	}

	/**
	 * Finds the index of an object in an array based on a property value.
	 * @param array - The array to search
	 * @param attr - The property name
	 * @param value - The value to match
	 * @returns The index if found, otherwise -1
	 */
	public static indexOfProp<T extends Record<string, unknown>>(array: T[], attr: keyof T, value: unknown): number {
		return array.findIndex((item) => item[attr] === value);
	}
}
