/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants } from '../Common';
import { Datas } from '../index';
import { Vector3 } from './index';

/** @class
 *  The data class for portion.
 *  @param {number} x
 *  @param {number} y
 *  @param {number} z
 */
class Portion {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 *  Create a portion from an array.
	 *  @static
	 *  @param {number[]} array
	 *  @returns {Portion}
	 */
	static createFromArray(array: number[]): Portion {
		return new Portion(array[0], array[1], array[2]);
	}

	/**
	 *  Create a portion from a three.js Vector3.
	 *   @static
	 *   @param {number[]} p - The array position
	 *   @returns {number[]}
	 */
	static createFromVector3(position: Vector3): Portion {
		return new Portion(
			Math.floor(position.x / Datas.Systems.SQUARE_SIZE / Constants.PORTION_SIZE),
			Math.floor(position.y / Datas.Systems.SQUARE_SIZE / Constants.PORTION_SIZE),
			Math.floor(position.z / Datas.Systems.SQUARE_SIZE / Constants.PORTION_SIZE)
		);
	}

	static fromKey(key: string): Portion {
		const [x, y, z] = key.split('_').map(Number);
		return new Portion(x, y, z);
	}

	/**
	 *  Test if a portion is equal to another.
	 *  @returns {boolean}
	 */
	equals(portion: Portion): boolean {
		return this.x === portion.x && this.y === portion.y && this.z === portion.z;
	}

	/**
	 *  Get the portion file name.
	 *  @returns {string}
	 */
	getFileName(): string {
		return this.toKey() + Constants.EXTENSION_JSON;
	}

	toKey(): string {
		return [this.x, this.y, this.z].join('_');
	}
}

export { Portion };
