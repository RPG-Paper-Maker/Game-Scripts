/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CUSTOM_SHAPE_KIND, Paths, Platform } from '../Common';
import { Shape, ShapeJSON } from '../Model';
import { Base } from './Base';

/**
 * JSON structure for Shapes.
 */
export type ShapesJSON = {
	list: {
		k: CUSTOM_SHAPE_KIND;
		v: ShapeJSON[];
	}[];
};

/**
 * Handles all shape data.
 */
export class Shapes {
	private static list: Map<CUSTOM_SHAPE_KIND, Map<number, Shape>>;

	/**
	 * Get a shape by kind and ID.
	 */
	static get(kind: CUSTOM_SHAPE_KIND, id: number, errorMessage?: string): Shape {
		if (kind === CUSTOM_SHAPE_KIND.NONE || id === -1) {
			return new Shape();
		}
		return Base.get(id, this.list.get(kind), `shape ${Shape.customShapeKindToString(kind)}`, true, errorMessage);
	}

	/**
	 * Read the JSON file associated with shapes.
	 */
	static async read(): Promise<void> {
		const json = (await Platform.parseFileJSON(Paths.FILE_SHAPES)) as ShapesJSON;
		this.list = new Map();
		for (const jsonHash of json.list) {
			const k = jsonHash.k;
			const jsonList = jsonHash.v;
			const list = new Map<number, Shape>();
			for (const jsonShape of jsonList) {
				const id = jsonShape.id ?? 0;
				const shape = new Shape(jsonShape);
				shape.kind = k;
				await shape.checkBase64();
				if (k === CUSTOM_SHAPE_KIND.OBJ || k === CUSTOM_SHAPE_KIND.COLLISIONS || k === CUSTOM_SHAPE_KIND.GLTF) {
					await shape.load();
				}
				list.set(id, shape);
			}
			this.list.set(k, list);
		}
		if (!this.list.has(CUSTOM_SHAPE_KIND.GLTF)) {
			this.list.set(CUSTOM_SHAPE_KIND.GLTF, new Map());
		}
	}
}
