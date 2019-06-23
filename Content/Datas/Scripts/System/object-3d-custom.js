/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS Object3DCustom
//
// -------------------------------------------------------

/** @class
*   A 3D object custom in the map.
*/
function Object3DCustom() {
    MapElement.call(this);
}

Object3DCustom.prototype = {

    read: function(json, datas) {
        MapElement.prototype.read.call(this, json);

        this.id = datas.id;
        this.datas = datas;
    },

    /** Update the geometry of a group of sprite walls with the same material.
    *   @param {THREE.Geometry} geometry of the sprites walls.
    *   @param {number[]} position The position of the wall.
    *   @return {number}
    */
    updateGeometry: function(geometry, position, c) {
        var i, j, l, vecA, vecB, vecC, face, localPosition, size,
            modelGeometry, vertices, uvs;

        localPosition = RPM.positionToVector3(position);
        modelGeometry = $datasGame.shapes.get(CustomShapeKind.OBJ, this.datas
            .objID).geometry;
        vertices = modelGeometry.vertices;
        uvs = modelGeometry.uvs;
        l = modelGeometry.vertices.length;
        for (i = 0, j = 0; i < l; i += 3) {
            vecA = vertices[i].clone();
            vecB = vertices[i + 1].clone();
            vecC = vertices[i + 2].clone();
            vecA.add(localPosition);
            vecB.add(localPosition);
            vecC.add(localPosition);
            face = [
                uvs[i].clone(),
                uvs[i + 1].clone(),
                uvs[i + 2].clone()
            ];
            geometry.vertices.push(vecA);
            geometry.vertices.push(vecB);
            geometry.vertices.push(vecC);
            geometry.faces.push(new THREE.Face3(c, c + 1, c + 2));
            geometry.faceVertexUvs[0].push(face);
            c += 3;
        }

        return [c];
    }
}
