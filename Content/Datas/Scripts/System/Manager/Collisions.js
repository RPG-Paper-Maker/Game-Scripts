/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Libs/index.js";
/** @class
 *  The game stack that is organizing the game scenes.
 *  @property {Scene.Base[]} content The stack content
 *  @property {Scene.Base} top The stack top content
 *  @property {Scene.Base} subTop The stack top - 1 content
 *  @property {Scene.Base} bot The stack bot content
 */
class Collisions {
    constructor() {
        throw new Error("This is a static class");
    }
    /** Create a box for bounding box
     *   @static
     *   @returns {THREE.Mesh}
     */
    static createBox() {
        /*
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), MapPortion
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousRotate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        return box;
        */
    }
    // -------------------------------------------------------
    /** Create an oriented box for bounding box
     *   @static
     *   @returns {THREE.Mesh}
     */
    static createOrientedBox() {
        /*
        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), MapPortion
            .BB_MATERIAL);
        box.previousTranslate = [0, 0, 0];
        box.previousScale = [1, 1, 1];
        box.geometry.rotateY(Math.PI / 4);
        return box;
        */
    }
    /**
     *  Apply transform for lands bounding box
     *  @static
     *  @param {THREE.Mesh} box The mesh bounding box
     *  @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxLandTransforms(box, boundingBox) {
        /*
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
        box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
        box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
        box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);

        // Update to the new ones
        box.geometry.scale(boundingBox[3], 1, boundingBox[4]);
        box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

        // Register previous transforms to current
        box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box.previousRotate = [0, 0, 0];
        box.previousScale = [boundingBox[3], 1, boundingBox[4]];

        // Update geometry now
        box.updateMatrixWorld();
        */
    }
    // -------------------------------------------------------
    /** Apply transform for sprite bounding box
     *   @static
     *   @param {THREE.Mesh} box The mesh bounding box
     *   @param {number[]} boundingBox The bounding box list parameters
     */
    static applyBoxSpriteTransforms(box, boundingBox) {
        /*
        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
        box.geometry.rotateZ(-box.previousRotate[2] * Math.PI / 180.0);
        box.geometry.rotateX(-box.previousRotate[1] * Math.PI / 180.0);
        box.geometry.rotateY(-box.previousRotate[0] * Math.PI / 180.0);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);

        // Update to the new ones
        box.geometry.scale(boundingBox[3], boundingBox[4], boundingBox[5]);
        box.geometry.rotateY(boundingBox[6] * Math.PI / 180.0);
        box.geometry.rotateX(boundingBox[7] * Math.PI / 180.0);
        box.geometry.rotateZ(boundingBox[8] * Math.PI / 180.0);
        box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

        // Register previous transforms to current
        box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box.previousRotate = [boundingBox[6], boundingBox[7], boundingBox[8]];
        box.previousScale = [boundingBox[3], boundingBox[4], boundingBox[5]];

        // Update geometry now
        box.updateMatrixWorld();
        */
    }
    // -------------------------------------------------------
    /** Apply transform for oriented bounding box
     *   @static
     *   @param {THREE.Mesh} box The mesh bounding box
     *   @param {number[]} boundingBox The bounding box list parameters
     */
    static applyOrientedBoxTransforms(box, boundingBox) {
        /*
        let size = Math.floor(boundingBox[3] / Math.sqrt(2));

        // Cancel previous geometry transforms
        box.geometry.translate(-box.previousTranslate[0], -box.previousTranslate
            [1], -box.previousTranslate[2]);
        box.geometry.rotateY(-Math.PI / 4);
        box.geometry.scale(1 / box.previousScale[0], 1 / box.previousScale[1], 1
            / box.previousScale[2]);

        // Update to the new ones
        box.geometry.scale(size, boundingBox[4], size);
        box.geometry.rotateY(Math.PI / 4);
        box.geometry.translate(boundingBox[0], boundingBox[1], boundingBox[2]);

        // Register previous transforms to current
        box.previousTranslate = [boundingBox[0], boundingBox[1], boundingBox[2]];
        box.previousScale = [size, boundingBox[4], size];

        // Update geometry now
        box.updateMatrixWorld();
        */
    }
}
Collisions.BB_MATERIAL = new THREE.MeshBasicMaterial();
export { Collisions };
