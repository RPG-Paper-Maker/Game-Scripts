/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemCameraProperties
//
// -------------------------------------------------------

/** @class
*   A camera properties of the game.
*/
function SystemCameraProperties() {

}

SystemCameraProperties.prototype = {

    /** Read the JSON associated to the camera properties.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.distance = SystemValue.readOrDefaultNumberDouble(json.d, 250);
        this.horizontalAngle = SystemValue.readOrDefaultNumberDouble(json.ha,
            -90);
        this.verticalAngle = SystemValue.readOrDefaultNumberDouble(json.va, 55);
        this.targetOffsetX = SystemValue.readOrDefaultNumber(json.tox, 0);
        this.targetOffsetY = SystemValue.readOrDefaultNumber(json.toy, 0);
        this.targetOffsetZ = SystemValue.readOrDefaultNumber(json.toz, 0);
        this.fov = SystemValue.readOrDefaultNumberDouble(json.fov, 45);
        this.near = SystemValue.readOrDefaultNumberDouble(json.n, 1);
        this.far = SystemValue.readOrDefaultNumberDouble(json.f, 100000);
    },

    // -------------------------------------------------------

    initializeCamera: function(camera) {
        camera.threeCamera = new THREE.PerspectiveCamera(this.fov.getValue(),
            $canvasWidth / $canvasHeight, this.near.getValue(), this.far
            .getValue());
        camera.distance = this.distance.getValue() * ($SQUARE_SIZE / RPM
            .BASIC_SQUARE_SIZE);
        camera.horizontalAngle = this.horizontalAngle.getValue();
        camera.verticalAngle = this.verticalAngle.getValue();
        camera.verticalRight = true;
        camera.targetPosition = new THREE.Vector3();
        camera.targetOffset = new THREE.Vector3(this.targetOffsetX.getValue(),
            this.targetOffsetY.getValue(), this.targetOffsetZ.getValue());
    }
}
