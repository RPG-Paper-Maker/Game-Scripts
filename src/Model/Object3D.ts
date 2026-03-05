/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CUSTOM_SHAPE_KIND, OBJECT_COLLISION_KIND, SHAPE_KIND, Utils } from '../Common';
import { Data } from '../index';
import { Shape } from './Shape';
import { SpecialElement, SpecialElementJSON } from './SpecialElement';

/** JSON structure describing a 3D object. */
export type Object3DJSON = SpecialElementJSON & {
	id: number;
	sk?: SHAPE_KIND;
	oid?: number;
	gid?: number;
	mid?: number;
	ck?: OBJECT_COLLISION_KIND;
	ccid?: number;
	s?: number;
	ws?: number;
	wp?: number;
	hs?: number;
	hp?: number;
	ds?: number;
	dp?: number;
	st?: boolean;
	itl?: boolean;
	mai?: number;
	sai?: number;
};

/** Represents a 3D object. */
export class Object3D extends SpecialElement {
	public id: number;
	public shapeKind: SHAPE_KIND;
	public objID: number;
	public gltfID: number;
	public mtlID: number;
	public collisionKind: OBJECT_COLLISION_KIND;
	public collisionCustomID: number;
	public scale: number;
	public widthSquare: number;
	public widthPixel: number;
	public heightSquare: number;
	public heightPixel: number;
	public depthSquare: number;
	public depthPixel: number;
	public stretch: boolean;
	public isTopLeft: boolean;
	public moveAnimationIndex: number;
	public stopAnimationIndex: number;

	constructor(json?: Object3DJSON) {
		super(json);
	}

	/** Width in pixels. */
	widthPixels(): number {
		return this.widthSquare * Data.Systems.SQUARE_SIZE + (this.widthPixel * Data.Systems.SQUARE_SIZE) / 100;
	}

	/** Height in pixels. */
	heightPixels(): number {
		return this.heightSquare * Data.Systems.SQUARE_SIZE + (this.heightPixel * Data.Systems.SQUARE_SIZE) / 100;
	}

	/** Depth in pixels. */
	depthPixels(): number {
		return this.depthSquare * Data.Systems.SQUARE_SIZE + (this.depthPixel * Data.Systems.SQUARE_SIZE) / 100;
	}

	/** Width in squares. */
	width(): number {
		return this.widthSquare + (this.widthPixel > 0 ? 1 : 0);
	}

	/** Height in squares. */
	height(): number {
		return this.heightSquare + (this.heightPixel > 0 ? 1 : 0);
	}

	/** Depth in squares. */
	depth(): number {
		return this.depthSquare + (this.depthPixel > 0 ? 1 : 0);
	}

	/** Size as a vector. */
	getSizeVector(): THREE.Vector3 {
		return new THREE.Vector3(this.widthPixels(), this.heightPixels(), this.depthPixels());
	}

	/** Get shape object. */
	getObj(): Shape {
		if (this.gltfID !== -1) {
			return Data.Shapes.get(CUSTOM_SHAPE_KIND.GLTF, this.gltfID);
		}
		return Data.Shapes.get(CUSTOM_SHAPE_KIND.OBJ, this.objID);
	}

	/** Get collision shape object. */
	getCollisionObj(): Shape {
		return Data.Shapes.get(CUSTOM_SHAPE_KIND.COLLISIONS, this.collisionCustomID);
	}

	/** Initialize from JSON data. */
	read(json: Object3DJSON): void {
		super.read(json);
		this.id = json.id;
		this.shapeKind = Utils.valueOrDefault(json.sk, SHAPE_KIND.BOX);
		this.objID = Utils.valueOrDefault(json.oid, -1);
		this.gltfID = Utils.valueOrDefault(json.gid, -1);
		this.mtlID = Utils.valueOrDefault(json.mid, -1);
		this.collisionKind = Utils.valueOrDefault(json.ck, OBJECT_COLLISION_KIND.NONE);
		this.collisionCustomID = Utils.valueOrDefault(json.ccid, -1);
		this.scale = Utils.valueOrDefault(json.s, 1);
		this.widthSquare = Utils.valueOrDefault(json.ws, 1);
		this.widthPixel = Utils.valueOrDefault(json.wp, 0);
		this.heightSquare = Utils.valueOrDefault(json.hs, 1);
		this.heightPixel = Utils.valueOrDefault(json.hp, 0);
		this.depthSquare = Utils.valueOrDefault(json.ds, 1);
		this.depthPixel = Utils.valueOrDefault(json.dp, 0);
		this.stretch = Utils.valueOrDefault(json.st, false);
		this.isTopLeft = Utils.valueOrDefault(json.itl, true);
		this.moveAnimationIndex = Utils.valueOrDefault(json.mai, -1);
		this.stopAnimationIndex = Utils.valueOrDefault(json.sai, -1);
	}
}
