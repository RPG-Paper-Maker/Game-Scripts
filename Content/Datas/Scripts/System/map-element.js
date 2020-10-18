/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An element in the map
*   @property {number} xOffset The x offset of the object according to layer
*   @property {number} yOffset The y offset of the object according to layer
*   @property {number} zOffset The z offset of the object according to layer
*   @property {Orientation} orientation The orientation according to layer
*   @property {CameraUpDown} upDown The camera up down orientation according to
*   layer
*/
class MapElement
{
    constructor()
    {
        this.xOffset = 0;
        this.yOffset = 0;
        this.zOffset = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the map element
    *   @param {Object} json Json object describing the map element
    */
    read(json)
    {
        this.xOffset = json.xOff;
        this.yOffset = json.yOff;
        this.zOffset = json.zOff;
    }

    // -------------------------------------------------------
    /** Scale the vertices correctly
    *   @param {THREE.Vector3} vecA The A vertex to rotate
    *   @param {THREE.Vector3} vecB The B vertex to rotate
    *   @param {THREE.Vector3} vecC The C vertex to rotate
    *   @param {THREE.Vector3} vecD The D vertex to rotate
    *   @param {THREE.Vector3} center The center to rotate around
    *   @param {number[]} position The json position
    *   @param {THREE.Vector3} size The scale size
    *   @param {ElementMapKind} kind The element map kind
    */
    scale(vecA, vecB, vecC, vecD, center, position, size, kind)
    {
        let zPlus = RPM.positionLayer(position) * 0.05;

        // Apply an offset according to layer position
        if (kind !== ElementMapKind.SpritesFace && !this.front)
        {
            zPlus *= -1;
        }
        let offset = new THREE.Vector3(0, 0, zPlus);

        // Center
        center.setX(this.xOffset * RPM.SQUARE_SIZE);
        center.setY(this.yOffset * RPM.SQUARE_SIZE);
        center.setZ(this.zOffset * RPM.SQUARE_SIZE);

        // Position
        let pos = center.clone();
        pos.add(offset);
        center.setY(center.y + (size.y / 2));
        vecA.multiply(size);
        vecB.multiply(size);
        vecC.multiply(size);
        vecD.multiply(size);
        vecA.add(pos);
        vecB.add(pos);
        vecC.add(pos);
        vecD.add(pos);
    }
}