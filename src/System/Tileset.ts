/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND, Utils } from '../Common';
import { CollisionSquare, Game } from '../Core';
import { Datas, System } from '../index';
import { Base } from './Base';

/** @class
 *  A tileset of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
class Tileset extends Base {
	public collisions: CollisionSquare[];
	public id: number;
	public battleMap: System.DynamicValue;
	public picture: System.Picture;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Assign the default members.
	 */
	public setup() {
		this.collisions = null;
	}

	/**
	 *  Read the JSON associated to the tileset.
	 *  @param {Record<string, any>} - json Json object describing the tileset
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.picture = Datas.Pictures.get(PICTURE_KIND.TILESETS, json.pic);
		this.battleMap = System.DynamicValue.readOrDefaultDatabase(json.bm, 1);
	}

	/**
	 *  Get the path to the picture tileset.
	 *  @returns {string}
	 */
	getPath(): string {
		const newID = Game.current.textures.tilesets[this.id];
		const picture = Utils.isUndefined(newID) ? this.picture : Datas.Pictures.get(PICTURE_KIND.TILESETS, newID);
		return picture ? picture.getPath() : null;
	}
}

export { Tileset };
