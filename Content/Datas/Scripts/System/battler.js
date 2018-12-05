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
//  CLASS Battler
//
// -------------------------------------------------------

/** @class
*   A battler in a battle (ally or ennemy).
*   @property {WindowBox} rect (temporary)
*   @property {Player} character The character properties.
*   @property {boolean} active Indicate if the battler already attacked or not.
*   @param {Player} character The character properties.
*   @param {number} x Coords of battler.
*   @param {number} y Coords of battler.
*   @param {number} w Coords of battler.
*   @param {number} h Coords of battler.
*/
function Battler(character, position, x, y, w, h){
    this.character = character;
    this.rect = new WindowBox(x, y, w, h);
    this.active = true;
    this.frame = 0;
    this.step = 0;
    this.width = 1;
    this.height = 1;
    this.position = position;
    this.frameDuration = 300;
    this.frameTick = 0;

    var idBattler = $datasGame.getHeroesMonsters(character.k).list[character.id]
        .idBattler;
    if (idBattler === -1) {
        this.mesh = null;
    }
    else {
        var material = $datasGame.tilesets.texturesBattlers[idBattler];
        this.width = material.map.image.width / $SQUARE_SIZE / $FRAMES;
        this.height = material.map.image.height / $SQUARE_SIZE / 7;
        var sprite = new Sprite(ElementMapKind.SpritesFace, [0, 0, this.width,
            this.height]);
        var geometry = sprite.createGeometry(this.width, this.height, false,
            this.position)[0];
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z);
        this.updateUVs();
    }
}

Battler.prototype = {

    update: function() {
        if (this.mesh !== null) {
            var frame = this.frame;
            this.frameTick += $elapsedTime;
            if (this.frameTick >= this.frameDuration){
                this.frame = (this.frame + 1) % $FRAMES;
                this.frameTick = 0;
            }
            if (frame !== this.frame) {
                this.updateUVs();
            }
        }
    },

    // -------------------------------------------------------

    addToScene: function(){
        if (this.mesh !== null) {
            $currentMap.scene.add(this.mesh);
        }
    },

    // -------------------------------------------------------

    removeFromScene: function(){
        if (this.mesh !== null) {
            $currentMap.scene.remove(this.mesh);
        }
    },

    // -------------------------------------------------------

    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs: function(){
        if (this.mesh !== null) {
            var textureWidth = this.mesh.material.map.image.width;
            var textureHeight = this.mesh.material.map.image.height;
            var w = this.width * $SQUARE_SIZE / textureWidth;
            var h = this.height * $SQUARE_SIZE / textureHeight;
            var x = this.frame * w;
            var y = this.step * h;

            // Update geometry
            this.mesh.geometry.faceVertexUvs[0][0][0].set(x, y);
            this.mesh.geometry.faceVertexUvs[0][0][1].set(x + w, y);
            this.mesh.geometry.faceVertexUvs[0][0][2].set(x + w, y + h);
            this.mesh.geometry.faceVertexUvs[0][1][0].set(x, y);
            this.mesh.geometry.faceVertexUvs[0][1][1].set(x + w, y + h);
            this.mesh.geometry.faceVertexUvs[0][1][2].set(x, y + h);
            this.mesh.geometry.uvsNeedUpdate = true;
        }
    }
}
