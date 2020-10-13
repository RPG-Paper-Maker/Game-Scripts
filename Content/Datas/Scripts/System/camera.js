/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The camera of the current map
*   @property {THREE.PerspectiveCamera} threeCamera The three.js camera
*   @property {number} distance The distance between the camera and
*   the target
*   @property {number} height The y distance between the camera and the target
*   @property {number} horizontalAngle The horizontal angle of the camera
*   @property {number} verticalAngle The vertical angle of the camera
*   @property {boolean} verticalRight Used to loop the horizontal and vertical 
*   angle
*   @property {MapObject} target The camera target
*   @property {THREE.Vector3} targetPosition The camera target position
*   @property {THREE.Vector3} targetOffset The target offset position
*   @param {SystemCameraProperties} cameraProperties The system camera 
*   properties
*   @param {MapObject} target The camera target
*/
class Camera
{
    constructor(cameraProperties, target)
    {
        cameraProperties.initializeCamera(this);
        this.target = target;
    }

    // -------------------------------------------------------
    /** Get the map orientation according to the camera
    *   @returns {Orientation}
    */
    getMapOrientation()
    {
        return RPM.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }

    // -------------------------------------------------------
    /** Get the distance according to vertical angle
    *   @returns {number}
    */
    getDistance()
    {
        return this.distance * Math.sin(this.verticalAngle * Math.PI / 180.0);
    }

    // -------------------------------------------------------
    /** Get the height according to vertical angle
    *   @returns {number}
    */
    getHeight()
    {
        return this.distance * Math.cos(this.verticalAngle * Math.PI / 180.0);
    }

    // -------------------------------------------------------
    /** Get the horizontal angle between two positions
    *   @param {THREE.Vector3} p1 The first position
    *   @param {THREE.Vector3} p2 The second position
    *   @returns {number}
    */
    getHorizontalAngle(p1, p2)
    {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    }

    // -------------------------------------------------------
    /** Get the vertical angle between two positions
    *   @param {THREE.Vector3} p1 The first position
    *   @param {THREE.Vector3} p2 The second position
    *   @returns {number}
    */
    getVerticalAngle(p2, p1)
    {
        let x = p1.x - p2.x;
        let y = p1.y - p2.y;
        let z = p1.z - p2.z;
        return 90 + (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180 / Math.PI);
    }

    // -------------------------------------------------------
    /** Add an angle to the vertical angle
    *   @param {THREE.Vector3} a The angle to add
    */
    addVerticalAngle(a)
    {
        if (this.verticalRight)
        {
            this.verticalAngle += a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
            {
                this.verticalRight = false;
            }
        } else
        {
            this.verticalAngle -= a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
            {
                this.verticalRight = true;
            }
        }
    }

    // -------------------------------------------------------
    /** Update the target position according to target and target offset
    */
    updateTargetPosition()
    {
        this.targetPosition = this.target.position.clone().add(this
            .targetOffset);
    }

    // -------------------------------------------------------
    /** Update the three.js camera position
    */
    updateCameraPosition()
    {
        let distance = this.getDistance();
        this.threeCamera.position.x = this.targetPosition.x - (distance * Math
            .cos(this.horizontalAngle * Math.PI / 180.0));
        this.threeCamera.position.y = this.targetPosition.y + this.getHeight();
        this.threeCamera.position.z = this.targetPosition.z - (distance * Math
            .sin(this.horizontalAngle * Math.PI / 180.0));
    }

    // -------------------------------------------------------
    /** Update target offset position
    */
    updateTargetOffset()
    {
        let distance = this.getDistance();
        this.targetOffset.x += this.threeCamera.position.x - (distance * Math
            .cos((this.horizontalAngle + 180) * Math.PI / 180.0)) - this
            .targetPosition.x;
        this.targetOffset.y += this.threeCamera.position.y - this.getHeight() - 
            this.targetPosition.y;
        this.targetOffset.z += this.threeCamera.position.z - (distance * Math
            .sin((this.horizontalAngle + 180) * Math.PI / 180.0)) - this
            .targetPosition.z;
    }

    // -------------------------------------------------------
    /** Update horizontal and vertical angles
    */
    updateAngles()
    {
        this.horizontalAngle = this.getHorizontalAngle(this.threeCamera.position
            , this.targetPosition);
        this.verticalAngle = this.getVerticalAngle(this.threeCamera.position, 
            this.targetPosition);
    }

    // -------------------------------------------------------
    /** Update the distance
    */
    updateDistance()
    {
        this.distance = this.threeCamera.position.distanceTo(this.targetPosition);
    }

    // -------------------------------------------------------
    /** Update the three.js camera view
    */
    updateView()
    {
        this.threeCamera.lookAt(this.targetPosition);
        RPM.currentMap.orientation = this.getMapOrientation();
    }

    // -------------------------------------------------------
    /** Update all the parameters
    */
    update()
    {
        // Update target
        this.updateTargetPosition();

        // Update position
        this.updateCameraPosition();

        // Update view
        this.updateView();
    }
}