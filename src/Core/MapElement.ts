/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Utils } from '../Common';
import { CollisionSquare } from './CollisionSquare';
import { Position } from './Position';

/**
 * Minimal JSON structure for a map element.
 */
export type MapElementJSON = {
	xOff?: number;
	yOff?: number;
	zOff?: number;
};

/**
 * Internal structure used for collision checks.
 */
export interface StructMapElementCollision {
	b?: number[];
	p?: Position;
	l?: THREE.Vector3;
	c?: THREE.Vector3;
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

/**
 * An element in the map.
 */
export class MapElement {
	public static readonly COEF_TEX = 0.2;

	public xOffset: number;
	public yOffset: number;
	public zOffset: number;
	public front: boolean;

	constructor() {
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
		this.front = false;
	}

	/**
	 * Read the JSON associated to the map element.
	 */
	read(json: MapElementJSON): void {
		this.xOffset = Utils.valueOrDefault(json.xOff, 0);
		this.yOffset = Utils.valueOrDefault(json.yOff, 0);
		this.zOffset = Utils.valueOrDefault(json.zOff, 0);
	}
}
