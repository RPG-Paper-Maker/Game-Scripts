/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CUSTOM_SHAPE_KIND, Paths, Platform } from '../Common';
import { Data } from '../index';
import { Shape, ShapeJSON } from '../Model';

/** @class
 *  All the shapes datas.
 *  @static
 */
class Shapes {
	private static list: Map<number, Map<number, Shape>>;

	/**
	 *  Read the JSON file associated to shapes.
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_SHAPES)).list as any;
		const l = json.length;
		this.list = new Map();
		let j: number,
			m: number,
			n: number,
			jsonHash: Record<string, any>,
			k: number,
			jsonList: ShapeJSON[],
			jsonShape: ShapeJSON,
			id: number,
			shape: Shape;
		for (let i = 0; i < l; i++) {
			jsonHash = json[i];
			k = jsonHash.k;
			jsonList = jsonHash.v;

			// Get the max ID
			m = jsonList.length;
			n = 0;
			for (j = 0; j < m; j++) {
				jsonShape = jsonList[j];
				id = jsonShape.id;
				if (id > n) {
					n = id;
				}
			}

			// Fill the shapes list
			const list = new Map<number, Shape>();
			for (j = 0; j < n + 1; j++) {
				jsonShape = jsonList[j];
				if (jsonShape) {
					id = jsonShape.id;
					shape = new Shape(jsonShape);
					shape.kind = k;
					if (!Platform.IS_DESKTOP && !shape.isBR) {
						shape.base64 = await Platform.loadFile(
							Platform.ROOT_DIRECTORY.slice(0, -1) + Shape.getLocalFolder(shape.kind) + '/' + shape.name
						);
					}
					if (k === CUSTOM_SHAPE_KIND.OBJ || k === CUSTOM_SHAPE_KIND.COLLISIONS) {
						await shape.load();
					}
					if (id !== 0) {
						if (id === -1) {
							id = 0;
						}
						list.set(id, shape);
					}
				}
			}
			this.list.set(k, list);
		}
	}

	/**
	 *  Get the corresponding shape
	 *  @param {CustomSHAPE_KIND} kind - The shape kind
	 *  @param {number} id - The shape id
	 *  @returns {System.Shape}
	 */
	static get(kind: CUSTOM_SHAPE_KIND, id: number): Shape {
		return kind === CUSTOM_SHAPE_KIND.NONE || id === -1
			? new Shape()
			: Data.Base.get(id, this.list.get(kind), 'shape ' + Shape.customShapeKindToString(kind));
	}
}

export { Shapes };
