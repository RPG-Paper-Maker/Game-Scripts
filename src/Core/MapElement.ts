/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils } from '../Common';
import ElementMapKind = Enum.ElementMapKind;
import { Position } from './Position';
import { Datas } from '../index';
import { CollisionSquare } from './CollisionSquare';
import { Vector3 } from './Vector3';

interface StructMapElementCollision {
	b?: number[];
	p?: Position;
	l?: Vector3;
	c?: Vector3;
	cs?: CollisionSquare;
	w?: number;
	h?: number;
	d?: number;
	rw?: number;
	rh?: number;
	m?: number;
	t?: MapElement;
	k?: boolean;
	left?: boolean;
	right?: boolean;
	top?: boolean;
	bot?: boolean;
	a?: number;
	id?: number;
	cl?: boolean;
	cr?: [number, number, number];
}

/** @class
 *  An element in the map.
 */
class MapElement {
	public static readonly COEF_TEX = 0.2;

	public xOffset: number;
	public yOffset: number;
	public zOffset: number;
	public front: boolean;

	constructor() {
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
	}

	/**
	 *  Read the JSON associated to the map element.
	 *  @param {Record<string, any>} json - Json object describing the map element
	 */
	read(json: Record<string, any>) {
		this.xOffset = Utils.defaultValue(json.xOff, 0);
		this.yOffset = Utils.defaultValue(json.yOff, 0);
		this.zOffset = Utils.defaultValue(json.zOff, 0);
	}
}

export { StructMapElementCollision, MapElement };
