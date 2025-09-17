/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND } from '../Common';
import { Data } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { Land } from './Land';
import { StructMapElementCollision } from './MapElement';
import { Position } from './Position';
import { TextureBundle } from './TextureBundle';

/**
 * An autotile in the map
 *
 * @class Autotile
 * @extends {Land}
 */
class Autotile extends Land {
	public autotileID: number;
	public tileID: number;

	constructor(json?: Record<string, any>) {
		super();
		if (json) {
			this.read(json);
		}
	}

	/**
	 *  Read the JSON associated to the autotile.
	 *  @param {Record<string, any>} json - Json object describing the autotile
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.autotileID = json.id;
		this.tileID = json.tid;
	}

	/**
	 *  Update the geometry associated to this autotile and return the
	 *  collision result.
	 *  @param {Core.CustomGeometry} geometry - The geometry asoociated to the
	 *  autotiles
	 *  @param {TextureBundle} texure - The several texture used for this
	 *  geometry
	 *  @param {Position} position - The json position
	 *  @param {number} width - The texture total width
	 *  @param {number} height - The texture total height
	 *  @param {number} count - The faces count
	 *  @returns {StructMapElementCollision}
	 */
	updateGeometryAutotile(
		geometry: CustomGeometry,
		texture: TextureBundle,
		position: Position,
		width: number,
		height: number,
		pictureID: number,
		count: number
	): StructMapElementCollision {
		const autotile = Data.SpecialElements.getAutotile(this.autotileID);
		const picture = autotile ? Data.Pictures.get(PICTURE_KIND.AUTOTILES, pictureID) : null;
		return super.updateGeometryLand(
			geometry,
			picture ? picture.getCollisionAtIndex(Land.prototype.getIndex.call(this, picture.width)) : null,
			position,
			width,
			height,
			((this.tileID % 64) * Data.Systems.SQUARE_SIZE) / width,
			((Math.floor(this.tileID / 64) + 10 * texture.getOffset(pictureID, this.texture)) *
				Data.Systems.SQUARE_SIZE) /
				height,
			Data.Systems.SQUARE_SIZE / width,
			Data.Systems.SQUARE_SIZE / height,
			count
		);
	}
}

export { Autotile };
