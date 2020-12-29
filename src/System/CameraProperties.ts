/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { DynamicValue } from "./DynamicValue";
import { Utils, ScreenResolution, Constants } from "../Common";
import { THREE } from "../Globals";
import { Camera, Vector3 } from "../Core";
import { Datas } from "../index";

/** @class
 *  A camera properties of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  camera properties
 */
export class CameraProperties extends Base {

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

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the camera properties.
     *  @param {Record<string, any>} json Json object describing the camera 
     *  properties
     */
    read(json: Record<string, any>) {
        this.distance = DynamicValue.readOrDefaultNumberDouble(json.d, 250);
        this.horizontalAngle = DynamicValue.readOrDefaultNumberDouble(json.ha,
            -90);
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
    initializeCamera(camera: Camera) {
        camera.isPerspective = true;
        camera.perspectiveCamera = new THREE.PerspectiveCamera(this.fov
            .getValue(), ScreenResolution.CANVAS_WIDTH / ScreenResolution
            .CANVAS_HEIGHT, this.near.getValue(), this.far.getValue());
        camera.distance = this.distance.getValue() * (Datas.Systems.SQUARE_SIZE 
            / Constants.BASIC_SQUARE_SIZE);
        camera.horizontalAngle = this.horizontalAngle.getValue();
        camera.verticalAngle = this.verticalAngle.getValue();
        camera.targetPosition = new Vector3();
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
        camera.targetOffset = new Vector3(x, y, z);
    }
}