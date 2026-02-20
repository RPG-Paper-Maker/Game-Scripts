/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { DynamicValue } from './DynamicValue';

/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure describing a property.
 */
export type PropertyJSON = {
	id: number;
	iv?: DynamicValueJSON;
};

/**
 * Represents a property of an object.
 */
export class Property extends Base {
	public id: number;
	public initialValue: DynamicValue;

	constructor(json?: PropertyJSON) {
		super(json);
	}

	/**
	 * Initialize this property from JSON data.
	 */
	read(json: PropertyJSON): void {
		this.id = json.id;
		this.initialValue = DynamicValue.readOrNone(json.iv);
	}
}
