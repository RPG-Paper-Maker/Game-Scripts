/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem} from "./BaseSystem";
import {DynamicValue} from ".";
import {RPM} from "../Core";

/** @class
 *   A camera properties of the game
 *   @property {number} distance The distance between the target position and
 *   the camera position
 *   @property {number} horizontalAngle The horizontal angle between target and
 *   camera
 *   @property {number} verticalAngle The vertical angle between target and
 *   camera
 *   @property {number} targetOffsetX The target offset x position
 *   @property {number} targetOffsetY The target offset y position
 *   @property {number} targetOffsetZ The target offset z position
 *   @property {boolean} isSquareTargetOffsetX Indicate if the current target x
 *   offset is square value
 *   @property {number} isSquareTargetOffsetY Indicate if the current target y
 *   offset is square value
 *   @property {number} isSquareTargetOffsetZ Indicate if the current target z
 *   offset is square value
 *   @property {number} fov The field of fiew
 *   @property {number} near The near
 *   @property {number} far The far
 *   @param {Object} [json=undefined] Json object describing the camera
 *   properties
 */
export class CameraProperties extends BaseSystem {

    // TODO : convert those values to Vector3?
    // TODO : create an Angle.ts class?
    distance: DynamicValue;
    horizontalAngle: DynamicValue;
    verticalAngle: DynamicValue;
    targetOffsetX: DynamicValue;
    targetOffsetY: DynamicValue;
    targetOffsetZ: DynamicValue;
    isSquareTargetOffsetX: boolean;
    isSquareTargetOffsetY: boolean;
    isSquareTargetOffsetZ: boolean;
    fov: DynamicValue;
    near: DynamicValue;
    far: DynamicValue;

    // TODO :  targetOffset: Vector3;
    constructor(json) {
        super(json);
    }

    public setup() {
        this.distance = 0;
        this.horizontalAngle = 0;
        this.verticalAngle = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        this.targetOffsetZ = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the camera properties
     *   @param {Object} json Json object describing the camera properties
     */
    read(json) {
        this.distance = DynamicValue.readOrDefaultNumberDouble(json.d, 250);
        this.horizontalAngle = DynamicValue.readOrDefaultNumberDouble(json.ha,
            -90);
        this.verticalAngle = DynamicValue.readOrDefaultNumberDouble(json.va, 55);
        this.targetOffsetX = DynamicValue.readOrDefaultNumber(json.tox, 0);
        this.targetOffsetY = DynamicValue.readOrDefaultNumber(json.toy, 0);
        this.targetOffsetZ = DynamicValue.readOrDefaultNumber(json.toz, 0);
        this.isSquareTargetOffsetX = RPM.defaultValue(json.istox, true);
        this.isSquareTargetOffsetY = RPM.defaultValue(json.istoy, true);
        this.isSquareTargetOffsetZ = RPM.defaultValue(json.istoz, true);
        this.fov = DynamicValue.readOrDefaultNumberDouble(json.fov, 45);
        this.near = DynamicValue.readOrDefaultNumberDouble(json.n, 1);
        this.far = DynamicValue.readOrDefaultNumberDouble(json.f, 100000);
    }

    // -------------------------------------------------------
    /** Initialize a camera according this System properties
     *   @param {Camera} camera The camera
     */
    initializeCamera(camera) {
        camera.threeCamera = new THREE.PerspectiveCamera(this.fov.getValue(),
            RPM.CANVAS_WIDTH / RPM.CANVAS_HEIGHT, this.near.getValue(), this.far
                .getValue());
        camera.distance = this.distance.getValue() * (RPM.SQUARE_SIZE / RPM
            .BASIC_SQUARE_SIZE);
        camera.horizontalAngle = this.horizontalAngle.getValue();
        camera.verticalAngle = this.verticalAngle.getValue();
        camera.verticalRight = true;
        camera.targetPosition = new THREE.Vector3();
        let x = this.targetOffsetX.getValue();
        if (this.isSquareTargetOffsetX) {
            x *= RPM.SQUARE_SIZE;
        }
        let y = this.targetOffsetY.getValue();
        if (this.isSquareTargetOffsetY) {
            y *= RPM.SQUARE_SIZE;
        }
        let z = this.targetOffsetZ.getValue();
        if (this.isSquareTargetOffsetZ) {
            z *= RPM.SQUARE_SIZE;
        }
        camera.targetOffset = new THREE.Vector3(x, y, z);
    }
}