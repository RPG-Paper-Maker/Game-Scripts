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
import { Datas } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Picture } from './Picture';

/**
 * JSON structure for a tileset.
 */
export type TilesetJSON = {
	id?: number;
	pic?: number;
	bm?: DynamicValueJSON;
};

/**
 * A tileset of the game.
 */
export class Tileset extends Base {
	public collisions: CollisionSquare[] | null;
	public id: number;
	public battleMap: DynamicValue;
	public picture: Picture;

	constructor(json?: TilesetJSON) {
		super(json);
		this.collisions = null;
	}

	/**
	 * Get the path to the picture tileset.
	 */
	getPath(): string | null {
		const newID = Game.current.textures.tilesets[this.id];
		const picture = newID === undefined ? this.picture : Datas.Pictures.get(PICTURE_KIND.TILESETS, newID);
		return picture ? picture.getPath() : null;
	}

	/**
	 * Read JSON into this tileset.
	 */
	read(json: TilesetJSON): void {
		this.id = json.id;
		this.picture = Datas.Pictures.get(PICTURE_KIND.TILESETS, json.pic);
		this.battleMap = DynamicValue.readOrDefaultDatabase(json.bm, 1);
	}
}
