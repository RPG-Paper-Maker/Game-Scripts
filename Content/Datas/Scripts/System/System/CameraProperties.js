/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Utils, ScreenResolution, Constants } from "../Common/index.js";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
import { Datas } from "../index.js";
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
 *   @param {Record<string, any>} [json=undefined] Json object describing the camera
 *   properties
 */
export class CameraProperties extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the camera properties.
     *  @param {Record<string, any>} json Json object describing the camera
     *  properties
     */
    read(json) {
        this.distance = DynamicValue.readOrDefaultNumberDouble(json.d, 250);
        this.horizontalAngle = DynamicValue.readOrDefaultNumberDouble(json.ha, -90);
        this.verticalAngle = DynamicValue.readOrDefaultNumberDouble(json.va, 55);
        this.targetOffsetX = DynamicValue.readOrDefaultNumber(json.tox, 0);
        this.targetOffsetY = DynamicValue.readOrDefaultNumber(json.toy, 0);
        this.targetOffsetZ = DynamicValue.readOrDefaultNumber(json.toz, 0);
        this.isSquareTargetOffsetX = Utils.defaultValue(json.istox, true);
        this.isSquareTargetOffsetY = Utils.defaultValue(json.istoy, true);
        this.isSquareTargetOffsetZ = Utils.defaultValue(json.istoz, true);
        this.fov = DynamicValue.readOrDefaultNumberDouble(json.fov, 45);
        this.near = DynamicValue.readOrDefaultNumberDouble(json.n, 1);
        this.far = DynamicValue.readOrDefaultNumberDouble(json.f, 100000);
    }
    /**
     *  Initialize a camera according this System properties
     *  @param {Camera} camera The camera
     */
    initializeCamera(camera) {
        camera.isPerspective = true;
        camera.perspectiveCamera = new THREE.PerspectiveCamera(this.fov
            .getValue(), ScreenResolution.CANVAS_WIDTH / ScreenResolution
            .CANVAS_HEIGHT, this.near.getValue(), this.far.getValue());
        camera.distance = this.distance.getValue() * (Datas.Systems.SQUARE_SIZE
            / Constants.BASIC_SQUARE_SIZE);
        camera.horizontalAngle = this.horizontalAngle.getValue();
        camera.verticalAngle = this.verticalAngle.getValue();
        camera.verticalRight = true;
        camera.targetPosition = new THREE.Vector3();
        let x = this.targetOffsetX.getValue();
        if (this.isSquareTargetOffsetX) {
            x *= Datas.Systems.SQUARE_SIZE;
        }
        let y = this.targetOffsetY.getValue();
        if (this.isSquareTargetOffsetY) {
            y *= Datas.Systems.SQUARE_SIZE;
        }
        let z = this.targetOffsetZ.getValue();
        if (this.isSquareTargetOffsetZ) {
            z *= Datas.Systems.SQUARE_SIZE;
        }
        camera.targetOffset = new THREE.Vector3(x, y, z);
    }
}
