/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A 3D object custom in the map
*/
class Object3DCustom extends MapElement
{
    constructor(json, datas)
    {
        super();

        if (json)
        {
            this.read(json, datas);
        }
    }

    read(json, datas)
    {
        super.read(json);

        this.id = datas.id;
        this.datas = datas;
    }

    /** Update the geometry of a group of sprite walls with the same material
    *   @param {THREE.Geometry} geometry of the sprites walls
    *   @param {number[]} position The position of the wall
    *   @return {number}
    */
    updateGeometry(geometry, position, c)
    {
        let localPosition = RPM.positionToVector3(position);
        let modelGeometry = RPM.datasGame.shapes.get(CustomShapeKind.OBJ, this
            .datas.objID).geometry;
        let vertices = modelGeometry.vertices;
        let uvs = modelGeometry.uvs;
        let center = modelGeometry.center;
        let scale = this.datas.scale;
        let scaleVec = new THREE.Vector3(scale, scale, scale);
        let angleY = RPM.positionAngleY(position);
        let angleX = RPM.positionAngleX(position);
        let angleZ = RPM.positionAngleZ(position);
        let vecA, vecB, vecC, face;
        for (let i = 0, l = modelGeometry.vertices.length; i < l; i += 3)
        {
            vecA = vertices[i].clone();
            vecB = vertices[i + 1].clone();
            vecC = vertices[i + 2].clone();
            if (angleY !== 0.0)
            {
                Sprite.rotateVertex(vecA, center, angleY, Sprite.Y_AXIS);
                Sprite.rotateVertex(vecB, center, angleY, Sprite.Y_AXIS);
                Sprite.rotateVertex(vecC, center, angleY, Sprite.Y_AXIS);
            }
            if (angleX !== 0.0)
            {
                Sprite.rotateVertex(vecA, center, angleX, Sprite.X_AXIS);
                Sprite.rotateVertex(vecB, center, angleX, Sprite.X_AXIS);
                Sprite.rotateVertex(vecC, center, angleX, Sprite.X_AXIS);
            }
            if (angleZ !== 0.0)
            {
                Sprite.rotateVertex(vecA, center, angleZ, Sprite.Z_AXIS);
                Sprite.rotateVertex(vecB, center, angleZ, Sprite.Z_AXIS);
                Sprite.rotateVertex(vecC, center, angleZ, Sprite.Z_AXIS);
            }
            vecA.multiply(scaleVec);
            vecB.multiply(scaleVec);
            vecC.multiply(scaleVec);
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

        // Collisions
        let objCollision = new Array;
        if (this.datas.collisionKind === ObjectCollisionKind.Simplified)
        {
            let obj = this.datas.getObj().geometry;
            let w = obj.w * scale;
            let h = obj.h * scale;
            let d = obj.d * scale;
            let minPos = obj.minVertex.clone();
            minPos.multiply(scaleVec);

            objCollision.push({
                p: position,
                l: localPosition,
                b: [
                    localPosition.x + minPos.x + (w / 2),
                    localPosition.y + minPos.y + (h / 2),
                    localPosition.z + minPos.z + (d / 2),
                    w,
                    h,
                    d,
                    angleY,
                    angleX,
                    angleZ
                ],
                c: center,
                w: Math.ceil(w / 2 / RPM.SQUARE_SIZE),
                h: Math.ceil(h / 2 / RPM.SQUARE_SIZE),
                d: Math.ceil(d / 2 / RPM.SQUARE_SIZE),
                m: Math.max(Math.max(Math.ceil(w / 2 / RPM.SQUARE_SIZE), Math
                    .ceil(h / 2 / RPM.SQUARE_SIZE)), Math.ceil(d / 2 / RPM
                    .SQUARE_SIZE)),
                k: true
            });
        }
        return [c, objCollision];
    }
}