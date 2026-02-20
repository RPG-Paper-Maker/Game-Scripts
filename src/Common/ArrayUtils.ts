/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 * Utility methods for working with arrays.
 */
export class ArrayUtils {
	/**
	 * Removes an element at the given index.
	 *
	 * @param array - The array to modify.
	 * @param index - The index of the element to remove.
	 */
	static removeAt<T>(array: T[], index: number): void {
		array.splice(index, 1);
	}

	/**
	 * Removes the first occurrence of a value from the array, if found.
	 *
	 * @param array - The array to modify.
	 * @param value - The value to search for and remove.
	 */
	static removeElement<T>(array: T[], value: T): void {
		const idx = array.indexOf(value);
		if (idx !== -1) {
			this.removeAt(array, idx);
		}
	}

	/**
	 * Inserts a value at the given index.
	 *
	 * @param array - The array to modify.
	 * @param index - The index where the value should be inserted.
	 * @param value - The value to insert.
	 */
	static insert<T>(array: T[], index: number, value: T): void {
		array.splice(index, 0, value);
	}
}
