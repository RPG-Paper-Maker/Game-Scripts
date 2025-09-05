/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND } from '../Common';
import { CollisionSquare, Game } from '../Core';
import { Datas, Model } from '../index';
import { Base } from './Base';

/** @class
 *  A tileset of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - json Json object describing the tileset
 */
class Tileset extends Base {
	public collisions: CollisionSquare[];
	public id: number;
	public battleMap: Model.DynamicValue;
	public picture: Model.Picture;

	constructor(json?: Record<string, any>) {
		super(json);
		if (this.collisions === undefined) {
			this.collisions = null;
		}
	}

	/**
	 *  Read the JSON associated to the tileset.
	 *  @param {Record<string, any>} - json Json object describing the tileset
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.picture = Datas.Pictures.get(PICTURE_KIND.TILESETS, json.pic);
		this.battleMap = Model.DynamicValue.readOrDefaultDatabase(json.bm, 1);
	}

	/**
	 *  Get the path to the picture tileset.
	 *  @returns {string}
	 */
	getPath(): string {
		const newID = Game.current.textures.tilesets[this.id];
		const picture = newID === undefined ? this.picture : Datas.Pictures.get(PICTURE_KIND.TILESETS, newID);
		return picture ? picture.getPath() : null;
	}
}

export { Tileset };
