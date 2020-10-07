/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A camera properties of the game
*/
class SystemCameraProperties
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the camera properties
    *   @param {Object} json Json object describing the camera properties
    */
    read(json)
    {
        this.distance = SystemValue.readOrDefaultNumberDouble(json.d, 250);
        this.horizontalAngle = SystemValue.readOrDefaultNumberDouble(json.ha,
            -90);
        this.verticalAngle = SystemValue.readOrDefaultNumberDouble(json.va, 55);
        this.targetOffsetX = SystemValue.readOrDefaultNumber(json.tox, 0);
        this.targetOffsetY = SystemValue.readOrDefaultNumber(json.toy, 0);
        this.targetOffsetZ = SystemValue.readOrDefaultNumber(json.toz, 0);
        this.isSquareTargetOffsetX = RPM.defaultValue(json.istox, true);
        this.isSquareTargetOffsetY = RPM.defaultValue(json.istoy, true);
        this.isSquareTargetOffsetZ = RPM.defaultValue(json.istoz, true);
        this.fov = SystemValue.readOrDefaultNumberDouble(json.fov, 45);
        this.near = SystemValue.readOrDefaultNumberDouble(json.n, 1);
        this.far = SystemValue.readOrDefaultNumberDouble(json.f, 100000);
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the camera properties
    *   @param {Object} json Json object describing the camera properties
    */
    initializeCamera(camera)
    {
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
        if (this.isSquareTargetOffsetX)
        {
            x *= RPM.SQUARE_SIZE;
        }
        let y = this.targetOffsetY.getValue();
        if (this.isSquareTargetOffsetY)
        {
            y *= RPM.SQUARE_SIZE;
        }
        let z = this.targetOffsetZ.getValue();
        if (this.isSquareTargetOffsetZ)
        {
            z *= RPM.SQUARE_SIZE;
        }
        camera.targetOffset = new THREE.Vector3(x, y, z);
    }
}