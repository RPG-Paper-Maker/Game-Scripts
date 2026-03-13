/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, ScreenResolution, Utils } from '../Common';
import { Camera } from '../Core';
import { Data } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/**
 * JSON structure for camera properties.
 */
export type CameraPropertiesJSON = {
	d?: DynamicValueJSON;
	ha?: DynamicValueJSON;
	va?: DynamicValueJSON;
	tox?: DynamicValueJSON;
	toy?: DynamicValueJSON;
	toz?: DynamicValueJSON;
	istox?: boolean;
	istoy?: boolean;
	istoz?: boolean;
	fov?: DynamicValueJSON;
	n?: DynamicValueJSON;
	f?: DynamicValueJSON;
	o?: boolean;
};

/**
 * Represents the configurable properties of a camera in the game.
 * Defines projection settings, orientation, offsets, and clipping planes.
 */
export class CameraProperties extends Base {
	public distance: DynamicValue;
	public horizontalAngle: DynamicValue;
	public verticalAngle: DynamicValue;
	public targetOffsetX: DynamicValue;
	public targetOffsetY: DynamicValue;
	public targetOffsetZ: DynamicValue;
	public isSquareTargetOffsetX: boolean;
	public isSquareTargetOffsetY: boolean;
	public isSquareTargetOffsetZ: boolean;
	public fov: DynamicValue;
	public near: DynamicValue;
	public far: DynamicValue;
	public orthographic: boolean;

	constructor(json?: CameraPropertiesJSON) {
		super(json);
	}

	/**
	 * Initializes a given {@link Camera} instance using the current properties.
	 * Creates either a perspective or orthographic camera depending on settings.
	 * @param {Camera} camera - The camera to initialize.
	 */
	initializeCamera(camera: Camera) {
		camera.isPerspective = !this.orthographic;
		camera.distance =
			(this.distance.getValue() as number) * (Data.Systems.SQUARE_SIZE / Constants.BASIC_SQUARE_SIZE);
		if (camera.isPerspective) {
			camera.perspectiveCamera = new THREE.PerspectiveCamera(
				this.fov.getValue() as number,
				ScreenResolution.CANVAS_WIDTH / ScreenResolution.CANVAS_HEIGHT,
				this.near.getValue() as number,
				this.far.getValue() as number,
			);
		} else {
			const x = ScreenResolution.CANVAS_WIDTH * (camera.distance / 1000);
			const y = ScreenResolution.CANVAS_HEIGHT * (camera.distance / 1000);
			camera.orthographicCamera = new THREE.OrthographicCamera(
				-x,
				x,
				y,
				-y,
				-this.far.getValue() as number,
				this.far.getValue() as number,
			);
		}
		camera.horizontalAngle = this.horizontalAngle.getValue() as number;
		camera.verticalAngle = this.verticalAngle.getValue() as number;
		camera.targetPosition = new THREE.Vector3();
		let x = this.targetOffsetX.getValue() as number;
		if (this.isSquareTargetOffsetX) {
			x *= Data.Systems.SQUARE_SIZE;
		}
		let y = this.targetOffsetY.getValue() as number;
		if (this.isSquareTargetOffsetY) {
			y *= Data.Systems.SQUARE_SIZE;
		}
		let z = this.targetOffsetZ.getValue() as number;
		if (this.isSquareTargetOffsetZ) {
			z *= Data.Systems.SQUARE_SIZE;
		}
		camera.targetOffset = new THREE.Vector3(x, y, z);
	}

	/**
	 * Reads and initializes camera properties from a JSON object.
	 */
	read(json: CameraPropertiesJSON): void {
		this.distance = DynamicValue.readOrDefaultNumberDouble(json.d, 300);
		this.horizontalAngle = DynamicValue.readOrDefaultNumberDouble(json.ha, -90);
		this.verticalAngle = DynamicValue.readOrDefaultNumberDouble(json.va, 65);
		this.targetOffsetX = DynamicValue.readOrDefaultNumber(json.tox, 0);
		this.targetOffsetY = DynamicValue.readOrDefaultNumber(json.toy, 0);
		this.targetOffsetZ = DynamicValue.readOrDefaultNumber(json.toz, 0);
		this.isSquareTargetOffsetX = Utils.valueOrDefault(json.istox, true);
		this.isSquareTargetOffsetY = Utils.valueOrDefault(json.istoy, true);
		this.isSquareTargetOffsetZ = Utils.valueOrDefault(json.istoz, true);
		this.fov = DynamicValue.readOrDefaultNumberDouble(json.fov, 45);
		this.near = DynamicValue.readOrDefaultNumberDouble(json.n, 1);
		this.far = DynamicValue.readOrDefaultNumberDouble(json.f, 100000);
		this.orthographic = Utils.valueOrDefault(json.o, false);
	}
}
