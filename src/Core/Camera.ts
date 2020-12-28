/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ScreenResolution, Enum, Mathf } from "../Common";
import { System, Scene } from "../index";
import { MapObject } from "./MapObject";
import Orientation = Enum.Orientation;
import { Vector3 } from "./index";

/** @class
 *  The camera of the current map.
 *  @param {System.CameraProperties} cameraProperties The System camera
 *  properties
 *  @param {MapObject} target The camera target
 */
class Camera {
    
    public perspectiveCamera: THREE.PerspectiveCamera;
    public orthographicCamera:  THREE.OrthographicCamera;
    public isPerspective: boolean;
    public target: MapObject;
    public targetPosition: Vector3;
    public targetOffset:   Vector3;
    public distance: number;
    public horizontalAngle: number;
    public verticalAngle: number;
    public verticalRight: boolean;

    constructor(cameraProperties: System.CameraProperties, target: MapObject) {
        cameraProperties.initializeCamera(this);
        this.target = target;
    }

    /** 
     *  Configure camera when resizing window.
     */
    resizeGL() {
        if (this.isPerspective) {
            this.perspectiveCamera.aspect = ScreenResolution.CANVAS_WIDTH / 
                ScreenResolution.CANVAS_HEIGHT;
            this.perspectiveCamera.updateProjectionMatrix();
        }
    }

    /** 
     *  Get the map orientation according to the camera.
     *  @returns {Orientation}
     */
    getMapOrientation(): Orientation {
        return Mathf.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }

    /** 
     *  Get the distance according to vertical angle.
     *  @returns {number}
     */
    getDistance(): number {
        return this.distance * Math.sin(this.verticalAngle * Math.PI / 180.0);
    }

    /** 
     *  Get the height according to vertical angle.
     *  @returns {number}
     */
    getHeight(): number {
        return this.distance * Math.cos(this.verticalAngle * Math.PI / 180.0);
    }

    /** 
     *  Get the horizontal angle between two positions.
     *  @param {Vector3} p1 The first position
     *  @param {Vector3} p2 The second position
     *  @returns {number}
     */
    getHorizontalAngle(p1: Vector3, p2: Vector3): 
        number
    {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    }

    /** 
     *  Get the vertical angle between two positions.
     *  @param {Vector3} p1 The first position
     *  @param {Vector3} p2 The second position
     *  @returns {number}
     */
    getVerticalAngle(p1: Vector3, p2:  Vector3): number {
        let x = p2.x - p1.x;
        let y = p2.y - p1.y;
        let z = p2.z - p1.z;
        return 90 + (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180 / Math.PI);
    }

    /** 
     *  Add an angle to the vertical angle.
     *  @param {number} a The angle to add
     */
    addVerticalAngle(a: number) {
        if (this.verticalRight) {
            this.verticalAngle += a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0) {
                this.verticalRight = false;
            }
        } else {
            this.verticalAngle -= a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0) {
                this.verticalRight = true;
            }
        }
    }

    /** 
     *  Update the target position according to target and target offset.
     */
    updateTargetPosition() {
        this.targetPosition = this.target.position.clone().add(this
            .targetOffset);
    }

    /** 
     *  Get the perspective or orthographic camera.
     *  @returns {THREE.Camera}
     */
    getThreeCamera(): THREE.Camera {
        return this.isPerspective ? this.perspectiveCamera : this
            .orthographicCamera;
    }

    /** 
     *  Update the three.js camera position.
     */
    updateCameraPosition() {
        let distance = this.getDistance();
        let camera = this.getThreeCamera();
        camera.position.x = this.targetPosition.x - (distance * Math
            .cos(this.horizontalAngle * Math.PI / 180.0));
        camera.position.y = this.targetPosition.y + this.getHeight();
        camera.position.z = this.targetPosition.z - (distance * Math
            .sin(this.horizontalAngle * Math.PI / 180.0));
    }

    /** 
     *  Update target offset position.
     */
    updateTargetOffset() {
        let distance = this.getDistance();
        let camera = this.getThreeCamera();
        this.targetOffset.x += camera.position.x - (distance * Math.cos((this
            .horizontalAngle + 180) * Math.PI / 180.0)) - this.targetPosition.x;
        this.targetOffset.y += camera.position.y - this.getHeight() - this
            .targetPosition.y;
        this.targetOffset.z += camera.position.z - (distance * Math.sin((this
            .horizontalAngle + 180) * Math.PI / 180.0)) - this.targetPosition.z;
    }

    /** 
     *  Update horizontal and vertical angles.
     */
    updateAngles() {
        let camera = this.getThreeCamera();
        this.horizontalAngle = this.getHorizontalAngle(camera.position, this
            .targetPosition);
        this.verticalAngle = this.getVerticalAngle(camera.position, this
            .targetPosition);
    }

    /** 
     *  Update the distance.
     */
    updateDistance() {
        this.distance = this.getThreeCamera().position.distanceTo(this
            .targetPosition);
    }

    /** 
     * Update the three.js camera view.
     */
    updateView() {
        this.getThreeCamera().lookAt(this.targetPosition);
        Scene.Map.current.orientation = this.getMapOrientation();
    }

    /** 
     * Update all the parameters.
     */
    update() {
        // Update target
        this.updateTargetPosition();

        // Update position
        this.updateCameraPosition();

        // Update view
        this.updateView();
    }
}

export { Camera }