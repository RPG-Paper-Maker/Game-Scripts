/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 */
class Mountains {
    constructor(texture) {
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
    updateGeometry(position, mountain) {
        let res = mountain.updateGeometry(this.geometry, this.texture, position, this.count);
        this.count = res[0];
        return res[1];
    }
    /**
     *  Create a mesh with material and geometry.
     */
    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.texture.texture);
    }
}
export { Mountains };
