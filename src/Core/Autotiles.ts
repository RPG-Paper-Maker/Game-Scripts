/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { TextureBundle } from "./TextureBundle";
import { THREE } from "../Globals";
import { Autotile } from "./Autotile";
import { Position } from "./Position";
import { StructMapElementCollision } from "./MapElement";
import { Manager } from "../index";

/** @class
 *  Autotiles grouped with the same textures.
 *  @param {TextureBundle} texture
 */
class Autotiles {

    public static COUNT_LIST = 5;
    public static LIST_A = ["A1", "A2", "A3", "A4", "A5"];
    public static LIST_B = ["B1", "B2", "B3", "B4", "B5"];
    public static LIST_C = ["C1", "C2", "C3", "C4", "C5"];
    public static LIST_D = ["D1", "D2", "D3", "D4", "D5"];
    public static AUTOTILE_BORDER = {
        "A1": 2,
        "B1": 3,
        "C1": 6,
        "D1": 7,
        "A2": 8,
        "B4": 9,
        "A4": 10,
        "B2": 11,
        "C5": 12,
        "D3": 13,
        "C3": 14,
        "D5": 15,
        "A5": 16,
        "B3": 17,
        "A3": 18,
        "B5": 19,
        "C2": 20,
        "D4": 21,
        "C4": 22,
        "D2": 23,
    };

    public bundle: TextureBundle;
    public width: number;
    public height: number;
    public geometry: THREE.Geometry;
    public mesh: THREE.Mesh;
    public index: number;

    constructor(bundle: TextureBundle) {
        this.bundle = bundle;
        let texture = Manager.GL.getMaterialTexture(bundle.material);
        this.width = texture ? texture.image.width : 0;
        this.height = texture ? texture.image.height : 0;
        this.geometry = new THREE.Geometry();
        this.geometry.faceVertexUvs[0] = [];
        this.mesh = null;
        this.index = 0;
    }

    /** 
     *  Update the geometry of the autotiles according to an autotile and its
     *  position.
     *  @param {Position} position The position
     *  @param {Autotile} autotile The autotile to add to geometry
     *  @returns {StructMapElementCollision}
     */
    updateGeometry(position: Position, autotile: Autotile): 
        StructMapElementCollision
    {
        return this.width === null || this.height === 0 ? null : autotile
            .updateGeometryAutotile(this.geometry, this.bundle, position, this
            .width, this.height, this.index++);
    }

    /** 
     *  Create a mesh with material and geometry.
     */
    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.bundle.material);
    }
}

export { Autotiles }