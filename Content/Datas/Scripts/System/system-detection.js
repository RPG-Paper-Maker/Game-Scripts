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
//  CLASS SystemDetection
//
// -------------------------------------------------------

/** @class
*   A detection of the game.
*/
function SystemDetection() {

}

SystemDetection.prototype = {

    /** Read the JSON associated to the detection.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        var i, l, jsonTab, jsonObj;

        jsonTab = typeof json.b === 'undefined' ? [] : json.b;
        l = jsonTab.length;
        this.boxes = new Array(l);
        for (i = 0; i < l; i++) {
            jsonObj = jsonTab[i];
            this.boxes[i] = [jsonObj.k, typeof jsonObj.v.bhs === 'undefined' ? 1
                : jsonObj.v.bhs, typeof jsonObj.v.bhp === 'undefined' ? 0 : json
                .v.bhp];
        }
    },

    // -------------------------------------------------------

    checkCollision: function(sender, object) {
        var i, l, boundingBoxes;

        boundingBoxes = this.getBoundingBoxes(sender);
        for (i = 0, l = boundingBoxes.length; i < l; i++) {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX_DETECTION, boundingBoxes
                [i]);
            if (object.checkCollisionDetection()) {
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    getBoundingBoxes: function(sender) {
        var i, l, localPosition, list, orientation, p, box, x, z;

        orientation = sender.orientationEye;
        localPosition = sender.position;

        l = this.boxes.length;
        list = new Array(l);
        for (i = 0; i < l; i++) {
            box = this.boxes[i];
            p = box[0];

            // Update position according to sender orientation
            switch (orientation) {
            case Orientation.South:
                x = p[0] * RPM.SQUARE_SIZE;
                z = p[3]* RPM.SQUARE_SIZE;
                break;
            case Orientation.West:
                x = -p[3] * RPM.SQUARE_SIZE;
                z = p[0] * RPM.SQUARE_SIZE;
                break;
            case Orientation.North:
                x = -p[0] * RPM.SQUARE_SIZE;
                z = -p[3] * RPM.SQUARE_SIZE;
                break;
            case Orientation.East:
                x = p[3] * RPM.SQUARE_SIZE;
                z = -p[0] * RPM.SQUARE_SIZE;
                break;
            }

            list[i] = [
                    localPosition.x + x,
                    localPosition.y + RPM.positionTotalY(p),
                    localPosition.z + z,
                    RPM.SQUARE_SIZE,
                    (box[1] * RPM.SQUARE_SIZE) + (box[2] / 100 * RPM.SQUARE_SIZE),
                    RPM.SQUARE_SIZE,
                    0,
                    0,
                    0
            ];
        }

        return list;
    }
}
