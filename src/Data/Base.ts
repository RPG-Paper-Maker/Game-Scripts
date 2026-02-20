/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform, Utils } from '../Common';

/**
 * Abstract base class for RPM data structures.
 * Provides safe access to elements by ID.
 */
export abstract class Base {
	public static readonly STRING_ERROR_GET_1 = 'Impossible to get the system ';
	public static readonly STRING_ERROR_GET_2 = '. Please check if this ID exists in the software.';

	/**
	 *  Get an element in a list by ID safely.
	 *  @param id - The ID to select
	 *  @param list - The list to browse
	 *  @param name - The name of the element to describe in the error message
	 *  @param isId - Indicate if searching for ID
	 *  @param errorMessage - The message error to force to display if not found
	 */
	static get<T>(
		id: number | null | undefined,
		list: Map<number, T>,
		name: string,
		isID = true,
		errorMessage = '',
	): T {
		if (id === null) {
			return null;
		} else if (id === undefined) {
			throw new Error();
		}
		const v = list.get(id);
		if (v === undefined) {
			Platform.showErrorMessage(
				errorMessage ||
					`${Base.STRING_ERROR_GET_1}${isID ? 'ID' : 'index'} ${Utils.formatNumber(id, 4)}: ${name}${
						Base.STRING_ERROR_GET_2
					}`,
			);
		} else {
			return v;
		}
	}
}
