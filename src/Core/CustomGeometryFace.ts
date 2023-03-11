/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../Globals";
import { CustomGeometry } from "./CustomGeometry";
import { Sprite } from "./Sprite";
import { Vector3 } from "./Vector3";

/**
 *  The geometry used to apply vertices + indices + uvs.
 * 
 *  @class CustomGeometry
 *  @extends THREE.BufferGeometry
 */
export class CustomGeometryFace extends CustomGeometry {

    public b_size: number[] = [];
    public b_center: number[] = [];
    public centerPoints: number[] = [];
    public currentAngle: number = 0;

    constructor() {
        super();
    }

    /**
     *  Push vertices for quad geometries.
     *  @param {THREE.Vector3} vecA
     *  @param {THREE.Vector3} vecB
     *  @param {THREE.Vector3} vecC
     *  @param {THREE.Vector3} vecD
     *  @param {THREE.Vector3} size
     *  @param {THREE.Vector3} center
     */
    pushQuadVerticesFace(vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3, 
        vecD: THREE.Vector3, center: THREE.Vector3) {
        this.b_vertices.push(vecA.x, vecA.y, vecA.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecB.x, vecB.y, vecB.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecC.x, vecC.y, vecC.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecD.x, vecD.y, vecD.z);
        this.b_center.push(center.x, center.y, center.z);
    }

    /** 
     *  Rotate all the vertices around a specified center Y.
     *  @param {number} angle
     *  @param {THREE.Vector3} axis
     *  @param {THREE.Vector3} center
     */
    rotate(angle: number, axis: Vector3) {
        const a = angle - this.currentAngle;
        if (a === 0) {
            return;
        }
        this.currentAngle = angle;
        const vertices = this.getVertices();
        let vertex = new THREE.Vector3();
        let center = new THREE.Vector3();
        for (let i = 0, l = vertices.length; i < l; i += 3) {
            vertex.set(vertices[i], vertices[i + 1], vertices[i + 2]);
            center.set(this.centerPoints[i], this.centerPoints[i + 1], this.centerPoints[i + 2])
            Sprite.rotateVertex(vertex, center, a, axis, false);
            this.b_vertices.push(vertex.x, vertex.y, vertex.z);
        }
        this.setAttribute('position', new THREE.Float32BufferAttribute(this
            .b_vertices, 3));
        this.b_vertices = [];
        this.computeVertexNormals();
    }

    /**
     *  Update vertices, indices, and uvs buffer geometry attributes.
     */
    updateAttributes() {
        this.setAttribute('position', new THREE.Float32BufferAttribute(this
            .b_vertices, 3));
        this.b_vertices = [];
        this.setIndex(this.b_indices);
        this.b_indices = [];
        this.centerPoints = this.b_center;
        this.b_center = [];
        this.updateUVs();
        this.computeVertexNormals();
    }
}
