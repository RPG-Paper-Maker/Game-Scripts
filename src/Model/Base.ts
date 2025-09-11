/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JsonType } from '../Common/Types';

/**
 * Abstract superclass that defines the structure for all Model classes.
 * Model classes are responsible for reading and representing game data
 * stored in JSON format. This base class enforces the implementation
 * of a `read` method to populate the instance with JSON data.
 */
export abstract class Base {
	/**
	 * Creates an instance of a Model class.
	 * If JSON data is provided, it automatically calls {@link Base.read}.
	 * @param json - Optional JSON object used to initialize the class.
	 */
	constructor(json?: JsonType) {
		if (json) {
			this.read(json);
		}
	}

	/**
	 * Reads and loads data from a JSON object into the instance.
	 * Must be implemented by subclasses to define how the data is mapped.
	 * @param json - The JSON object containing the data to load.
	 */
	abstract read(json: JsonType): void;
}
