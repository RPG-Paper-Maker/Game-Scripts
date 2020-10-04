/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A detection of the game
*   @property {number[][]} boxes List of boxes for detection 
*/
class SystemDetection
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the detection
    *   @param {Object} json Json object describing the detection
    */
    read(json)
    {
        let jsonList = RPM.defaultValue(json.b, []);
        let l = jsonList.length;
        this.boxes = new Array(l);
        let jsonElement;
        for (let i = 0; i < l; i++)
        {
            jsonElement = jsonList[i];
            this.boxes[i] = [jsonElement.k, RPM.defaultValue(jsonElement.v.bhs, 
                1), RPM.defaultValue(jsonElement.v.bhp, 0)];
        }
    }

    // -------------------------------------------------------
    /** Check the collision between sender and object
    *   @param {MapObject} sender The object that sent test collision
    *   @param {MapObject} object The object to test the collision
    *   @returns {boolean}
    */
    checkCollision(sender, object)
    {
        let boundingBoxes = this.getBoundingBoxes(sender);
        for (let i = 0, l = boundingBoxes.length; i < l; i++)
        {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX_DETECTION, 
                boundingBoxes[i]);
            if (object.checkCollisionDetection())
            {
                return true;
            }
        }
        return false;
    }

    // -------------------------------------------------------
    /** Get the sender bounding box
    *   @param {MapObject} sender The object that sent test collision
    *   @returns {number[][]}
    */
    getBoundingBoxes(sender)
    {
        let orientation = sender.orientationEye;
        let localPosition = sender.position;
        let l = this.boxes.length;
        let list = new Array(l);
        let box, p, x, z;
        for (let i = 0; i < l; i++)
        {
            box = this.boxes[i];
            p = box[0];

            // Update position according to sender orientation
            switch (orientation)
            {
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
