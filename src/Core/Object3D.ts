/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Model } from '..';
import { CustomGeometry } from './CustomGeometry';
import { MapElement, StructMapElementCollision } from './MapElement';
import { Position } from './Position';

/** @class
 *  The abstract class who model the Structure of RPM datas.
 *  @extends MapElement
 */
abstract class Object3D extends MapElement {
	public abstract id: number;
	public abstract datas: Model.Object3D;

	constructor() {
		super();
	}

	/**
	 *  Read the JSON associated to the object 3D.
	 *  @param {Record<string, any>} json - Json object describing the object 3D
	 */
	read(json: Record<string, any>) {
		super.read(json);
	}

	/**
	 *  Get the center vector.
	 *  @returns {Vector3}
	 */
	abstract getCenterVector(): THREE.Vector3;

	/**
	 *  Update the geometry of a group of object 3D with the same material.
	 *  @param {Core.CustomGeometry} geometry - Geometry of the object 3D
	 *  @param {Position} position - The position of object 3D
	 *  @param {number} count - The faces count
	 *  @return {any[]}
	 */
	abstract updateGeometry(
		geometry: CustomGeometry,
		position: Position,
		count: number,
	): [number, StructMapElementCollision[]];
}

export { Object3D };
