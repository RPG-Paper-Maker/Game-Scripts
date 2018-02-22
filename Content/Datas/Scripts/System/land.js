/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS Land
//
// -------------------------------------------------------

/** @class
*   A land in the map.
*   @property {number[]} texture Texture rect of the land.
*/
function Land() {
    MapElement.call(this);

    this.up = true;
}

Land.prototype = {

    /** Read the JSON associated to the land.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        MapElement.prototype.read.call(this, json);

        var up = json.up;
        this.texture = json.t;

        if (this.texture.length === 2) {
            this.texture.push(1); this.texture.push(1);
        }

        if (typeof(up) !== 'undefined')
            this.up = up;
    },

    /** Update the geometry associated to this land.
    *   @returns {THREE.Geometry}
    */
    updateGeometry: function(geometry, position, width, height, x, y, w, h, i) {
        var localPosition = RPM.positionToBorderVector3(position);
        var a = localPosition.x;
        var yLayerOffset = RPM.positionLayer(position) * 0.05;
        if (!this.up)
            yLayerOffset *= -1;
        var b = localPosition.y + yLayerOffset;
        var c = localPosition.z;
        var objCollision = null;

        // Vertices
        geometry.vertices.push(new THREE.Vector3(a, b, c));
        geometry.vertices.push(new THREE.Vector3(a + $SQUARE_SIZE, b, c));
        geometry.vertices.push(new THREE.Vector3(a + $SQUARE_SIZE, b,
                                                 c + $SQUARE_SIZE));
        geometry.vertices.push(new THREE.Vector3(a, b, c + $SQUARE_SIZE));
        var j = i * 4;
        geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        geometry.faces.push(new THREE.Face3(j, j + 2, j + 3));

        // Texture
        var coefX = 0.1 / width;
        var coefY = 0.1 / height;
        x += coefX;
        y += coefY;
        w -= (coefX * 2);
        h -= (coefY * 2);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y),
            new THREE.Vector2(x + w, y + h)
        ]);
        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(x, y),
            new THREE.Vector2(x + w, y + h),
            new THREE.Vector2(x, y + h)
        ]);

        // Collision
        var collision = $currentMap.mapInfos.tileset.getCollisionAt(
                    this.texture);
        if (collision !== null) {
            var rect = collision.rect;

            if (!collision.hasAllDirections()) {
                objCollision = {
                    "p": position,
                    "b": null,
                    "c": collision
                }
            }
            if (rect !== null) {
                var gb = new THREE.Geometry();
                var xC = a + rect[0] - 1;
                var yC = c + rect[1] - 1;
                var widthC = rect[2] + 2;
                var heightC = rect[3] + 2;
                var offsetH = 1;
                gb.vertices.push(new THREE.Vector3(0, 0, 0));
                gb.vertices.push(new THREE.Vector3(widthC, 0, 0));
                gb.vertices.push(new THREE.Vector3(widthC, 0, heightC));
                gb.vertices.push(new THREE.Vector3(0, 0, heightC));
                gb.vertices.push(new THREE.Vector3(0, offsetH, 0));
                gb.vertices.push(new THREE.Vector3(widthC, offsetH, 0));
                gb.vertices.push(new THREE.Vector3(widthC, offsetH, heightC));
                gb.vertices.push(new THREE.Vector3(0, offsetH, heightC));
                gb.faces.push(new THREE.Face3(0, 1, 2));
                gb.faces.push(new THREE.Face3(0, 2, 3));
                gb.faces.push(new THREE.Face3(5, 4, 0));
                gb.faces.push(new THREE.Face3(5, 0, 1));
                gb.faces.push(new THREE.Face3(6, 5, 1));
                gb.faces.push(new THREE.Face3(6, 1, 2));
                gb.faces.push(new THREE.Face3(7, 6, 2));
                gb.faces.push(new THREE.Face3(7, 2, 3));
                gb.faces.push(new THREE.Face3(4, 7, 3));
                gb.faces.push(new THREE.Face3(4, 3, 0));
                gb.faces.push(new THREE.Face3(4, 5, 6));
                gb.faces.push(new THREE.Face3(4, 6, 7));
                gb.computeFaceNormals();
                var boundingBox = new THREE.Mesh(gb, $INVISIBLE_MATERIAL);
                boundingBox.position.set(xC, b, yC);
                objCollision = {
                    "p": position,
                    "b": boundingBox,
                    "c": null
                }
            }
        }



        return objCollision;
    }
}
