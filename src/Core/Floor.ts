/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Scene } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { Land, LandJSON } from './Land';
import { StructMapElementCollision } from './MapElement';
import { Position } from './Position';

/**
 * A floor tile element in the map grid.
 */
export class Floor extends Land {
	constructor(json?: LandJSON) {
		super();
		if (json) {
			this.read(json);
		}
	}

	/**
	 * Update the geometry for this floor and optionally generate collision data.
	 * @param geometry - The custom geometry instance to update with vertices, indices and UVs.
	 * @param position - The floor tile’s position in the map grid.
	 * @param width - The total texture width (in pixels).
	 * @param height - The total texture height (in pixels).
	 * @param count - The current face count used for indexing.
	 * @returns A {@link StructMapElementCollision} describing collision data, or `null` if no collision applies.
	 */
	updateGeometry(
		geometry: CustomGeometry,
		position: Position,
		width: number,
		height: number,
		count: number,
	): StructMapElementCollision {
		return width === 0 || height === 0
			? null
			: super.updateGeometryLand(
					geometry,
					Scene.Map.current.mapProperties.tileset.picture.getCollisionAt(this.texture),
					position,
					width,
					height,
					(this.texture.x * Data.Systems.SQUARE_SIZE) / width,
					(this.texture.y * Data.Systems.SQUARE_SIZE) / height,
					(this.texture.width * Data.Systems.SQUARE_SIZE) / width,
					(this.texture.height * Data.Systems.SQUARE_SIZE) / height,
					count,
				);
	}
}
