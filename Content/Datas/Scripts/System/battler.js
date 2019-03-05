/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
*/
function Battler(character, position, camera) {
    this.character = character;
    this.arrowPosition = RPM.toScreenPosition(position, camera.threeCamera);
    this.damagePosition = RPM.toScreenPosition(position, camera.threeCamera);
    this.active = true;
    this.attackingFrame = 0;
    this.attackingFrameTick = 0;
    this.attackingFrameDuration = 350;
    this.frame = 0;
    this.step = BattlerStep.Normal;
    this.width = 1;
    this.height = 1;
    this.position = position;
    this.frameDuration = RPM.random(250, 300);
    this.frameTick = 0;
    this.frameArrow = 0;
    this.frameArrowDuration = 125;
    this.frameArrowTick = 0;
    this.position = position;
    this.selected = false;
    this.lastCommandIndex = 0;
    this.lastCommandOffset = 0;
    this.lastSkillIndex = 0;
    this.lastSkillOffset = 0;

    var idBattler = $datasGame.getHeroesMonsters(character.k).list[character.id]
        .idBattler;
    if (idBattler === -1) {
        this.mesh = null;
    }
    else {
        // Copy original material because there will be individual color changes
        var originalMaterial = $datasGame.tilesets.texturesBattlers[idBattler];
        var material = originalMaterial.clone();
        material.map = originalMaterial.map.clone();
        material.map.needsUpdate = true;

        this.width = material.map.image.width / $SQUARE_SIZE / $FRAMES;
        this.height = material.map.image.height / $SQUARE_SIZE /
            RPM.BATLLER_STEPS;
        var sprite = new Sprite(ElementMapKind.SpritesFace, [0, 0, this.width,
            this.height]);
        var geometry = sprite.createGeometry(this.width, this.height, false,
            this.position)[0];
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z);
        this.upPosition = new THREE.Vector3(position.x, position.y + (this
            .height * $SQUARE_SIZE), position.z);
        if (character.k === CharacterKind.Monster) {
            this.mesh.scale.set(-1, 1, 1);
        }
        this.updateUVs();
    }
}

Battler.OFFSET_SELECTED = 10;

Battler.prototype = {

    setActive: function(active) {
        this.active = active;
        if (active) {
            this.mesh.material.color.setRGB(1, 1, 1);
        } else {
            this.mesh.material.color.setRGB(0.5, 0.5, 0.5);
        }
    },

    // -------------------------------------------------------

    setAttacking: function() {
        this.attackingFrame = 0;
        this.step = BattlerStep.Attack;
        this.updateUVs();
    },

    // -------------------------------------------------------

    isAttacking: function() {
        return this.step === BattlerStep.Attack && this.attackingFrame !== 3;
    },

    // -------------------------------------------------------

    setVictory: function() {
        this.frame = 0;
        this.step = BattlerStep.Victory;
        this.updateUVs();
    },

    // -------------------------------------------------------

    updateDead: function(attacked) {
        var step = BattlerStep.Normal;

        if (this.character.isDead()) {
            step = BattlerStep.Dead;
        } else if (attacked) {
            step = BattlerStep.Attacked;
        }

        if (step !== this.step) {
            this.step = step;
            this.updateUVs();
        }
    },

    // -------------------------------------------------------

    update: function() {
        if (this.mesh !== null) {
            this.updateSelected();
            this.updateFrame();
            this.updateArrow();
            this.updateDamages();
            this.updateAttacking();
        }
    },

    // -------------------------------------------------------

    updateSelected: function() {
        var newX;

        if (this.character.k === CharacterKind.Hero) {
            if (this.selected) {
                newX = this.mesh.position.x - 1;
                if (newX <= -Battler.OFFSET_SELECTED + this.position.x) {
                    newX = -Battler.OFFSET_SELECTED + this.position.x;
                }
            } else {
                newX = this.mesh.position.x + 1;
                if (newX >= this.position.x) {
                    newX = this.position.x;
                }
            }
        } else if (this.character.k === CharacterKind.Monster) {
            if (this.selected) {
                newX = this.mesh.position.x + 1;
                if (newX >= Battler.OFFSET_SELECTED + this.position.x) {
                    newX = Battler.OFFSET_SELECTED + this.position.x;
                }
            } else {
                newX = this.mesh.position.x - 1;
                if (newX <= this.position.x) {
                    newX = this.position.x;
                }
            }
        }
        if (this.mesh.position.x !== newX) {
            this.mesh.position.setX(newX);
            this.upPosition.setX(newX);
            this.updateArrowPosition($currentMap.camera);
            $requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    updateFrame: function() {
        if (!this.character.isDead() && !this.attacking) {
            var frame = this.frame;
            this.frameTick += $elapsedTime;
            if (this.frameTick >= this.frameDuration)
            {
                this.frame = (this.frame + 1) % $FRAMES;
                this.frameTick = 0;
            }
            if (frame !== this.frame) {
                this.updateUVs();
            }
        }
    },

    // -------------------------------------------------------

    updateArrow: function() {
        this.frameArrowTick += $elapsedTime;
        if (this.frameArrowTick >= this.frameArrowDuration) {
            this.frameArrow = (this.frameArrow + 1) % $FRAMES;
            this.frameArrowTick = 0;
            this.arrowPosition = RPM.toScreenPosition(this.mesh.position,
                $currentMap.camera.threeCamera);
            $requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    updateDamages: function() {
        this.damagePosition = RPM.toScreenPosition(this.upPosition,
            $currentMap.camera.threeCamera);
    },

    // -------------------------------------------------------

    updateAttacking: function() {
        if (this.step === BattlerStep.Attack) {
            var frame = this.attackingFrame;
            this.attackingFrameTick += $elapsedTime;
            if (this.attackingFrameTick >= this.attackingFrameDuration) {
                this.attackingFrame = (this.attackingFrame + 1) % $FRAMES;
                this.attackingFrameTick = 0;
            }

            if (frame !== this.attackingFrame) {
                if (this.attackingFrame === 0) {
                    this.step = BattlerStep.Normal;
                }

                this.updateUVs();
            }
        }
    },

    // -------------------------------------------------------

    updateArrowPosition: function(camera) {
        this.arrowPosition = RPM.toScreenPosition(this.mesh.position, camera
            .threeCamera);
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
            var frame = 0;
            switch (this.step) {
            case BattlerStep.Normal:
            case BattlerStep.Victory:
                frame = this.frame; break;
            case BattlerStep.Attack:
                frame = this.attackingFrame; break;
            }

            var w = this.width * $SQUARE_SIZE / textureWidth;
            var h = this.height * $SQUARE_SIZE / textureHeight;
            var x = frame * w;
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
    },

    // -------------------------------------------------------

    drawArrow: function() {
        $datasGame.system.getWindowSkin().drawArrowTarget(this.frameArrow, this
            .arrowPosition.x, this.arrowPosition.y);
    },

    // -------------------------------------------------------

    drawDamages: function(damage, isCrit, isMiss) {
        $datasGame.system.getWindowSkin().drawDamages(damage, this
            .damagePosition.x, this.damagePosition.y, isCrit, isMiss);
    }
}
