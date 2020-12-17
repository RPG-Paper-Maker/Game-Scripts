/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const THREE = require('./Content/Datas/Scripts/Libs/three.js');
import { TextureBundle } from "./TextureBundle";
import { Mountain } from "./Mountain";
import { StructMapElementCollision } from "./MapElement";
import { Position } from "./Position";

/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 *  @param {TextureBundle} texture
 */
class Mountains {
    
    public texture: TextureBundle;
    public width: number;
    public height: number;
    public geometry: typeof THREE.Geometry;
    public count: number;
    public mesh: typeof THREE.Mesh;

    constructor(texture: TextureBundle) {
        this.texture = texture;
        this.width = texture.texture.map.image.width;
        this.height = texture.texture.map.image.height;
        this.geometry = new THREE.Geometry();
        this.geometry.faceVertexUvs[0] = [];
        this.count = 0;
        this.mesh = null;
    }

    /** 
     *  Update the geometry of the mountains according to a mountain.
     *  @param {Position} position The position
     *  @param {Mountain} mountain The moutain to update
     */
    updateGeometry(position: Position, mountain: Mountain): 
        StructMapElementCollision[]
    {
        let res = mountain.updateGeometry(this.geometry, this.texture, position,
            this.count);
        this.count = res[0];
        return res[1];
    }

    /** 
     *  Create a mesh with material and geometry.
     */
    createMesh(): typeof THREE.Mesh {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}

export { Mountains }