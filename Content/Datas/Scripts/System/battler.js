/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A battler in a battle (ally or ennemy)
*   @property {WindowBox} rect (temporary)
*   @property {Player} character The character properties
*   @property {boolean} active Indicate if the battler already attacked or not
*   @param {Player} character The character properties
*/
class Battler
{
    static OFFSET_SELECTED = 10;
    static TIME_MOVE = 200;
    static TOTAL_TIME_DAMAGE = 250;

    constructor(character, position, camera)
    {
        this.character = character;
        this.arrowPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.damagePosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.topPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.midPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.botPosition = RPM.toScreenPosition(position, camera.threeCamera);
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
        this.lastItemIndex = 0;
        this.lastItemOffset = 0;
        this.itemsNumbers = [];
        this.progressionAllyFront = SystemProgressionTable.createProgression(
            this.position.x, this.position.x - Battler.OFFSET_SELECTED, 0);
        this.progressionAllyBack = SystemProgressionTable.createProgression(
            this.position.x - Battler.OFFSET_SELECTED, this.position.x, 0);
        this.progressionEnemyFront = SystemProgressionTable.createProgression(
            this.position.x, this.position.x + Battler.OFFSET_SELECTED, 0);
        this.progressionEnemyBack = SystemProgressionTable.createProgression(
            this.position.x + Battler.OFFSET_SELECTED, this.position.x, 0);
        this.timerMove = 0;
        this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
        let idBattler = RPM.datasGame.getHeroesMonsters(character.k).list[
            character.id].idBattler;
        if (idBattler === -1)
        {
            this.mesh = null;
        }
        else {
            // Copy original material because there will be individual color changes
            let originalMaterial = RPM.datasGame.tilesets.texturesBattlers[
                idBattler];
            let material = RPM.createMaterial(originalMaterial.map.clone(), { 
                uniforms:
                {
                    texture: { type: "t", value: originalMaterial.map },
                    colorD: { type: "v4", value: RPM.screenTone.clone()}
                }
            });
            material.map.needsUpdate = true;
            this.width = Math.floor(material.map.image.width / RPM.SQUARE_SIZE /
                RPM.FRAMES);
            this.height = Math.floor(material.map.image.height / RPM.SQUARE_SIZE
                / RPM.BATLLER_STEPS);
            let sprite = Sprite.create(ElementMapKind.SpritesFace, [0, 0, this
                .width, this.height]);
            let geometry = sprite.createGeometry(this.width, this.height, false,
                this.position)[0];
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(position.x, position.y, position.z);
            this.upPosition = new THREE.Vector3(position.x, position.y + (this
                .height * RPM.SQUARE_SIZE), position.z);
            this.halfPosition = new THREE.Vector3(position.x, position.y + (this
                .height * RPM.SQUARE_SIZE / 2), position.z);
            if (character.k === CharacterKind.Monster)
            {
                this.mesh.scale.set(-1, 1, 1);
            }
            this.updateUVs();
        }
    }
    
    setSelected(selected)
    {
        if (this.selected !== selected)
        {
            this.selected = selected;
            this.timerMove = new Date().getTime();
        }
    }

    // -------------------------------------------------------

    setActive(active)
    {
        this.active = active;
        if (active)
        {
            this.mesh.material.uniforms.colorD.value.setX(RPM.screenTone.x);
            this.mesh.material.uniforms.colorD.value.setY(RPM.screenTone.y);
            this.mesh.material.uniforms.colorD.value.setZ(RPM.screenTone.z);
            this.mesh.material.uniforms.colorD.value.setW(RPM.screenTone.w);
        } else {
            this.mesh.material.uniforms.colorD.value.setX(RPM.screenTone.x - 0.3);
            this.mesh.material.uniforms.colorD.value.setY(RPM.screenTone.y - 0.3);
            this.mesh.material.uniforms.colorD.value.setZ(RPM.screenTone.z - 0.3);
            this.mesh.material.uniforms.colorD.value.setW(RPM.screenTone.w - 0.3);
        }
    }

    // -------------------------------------------------------

    setAttacking()
    {
        this.attackingFrame = 0;
        this.step = BattlerStep.Attack;
        this.updateUVs();
    }

    // -------------------------------------------------------

    isStepAttacking()
    {
        return this.step === BattlerStep.Attack || this.step === BattlerStep
            .Skill || this.step === BattlerStep.Item || this.step ===
            BattlerStep.Escape;
    }

    // -------------------------------------------------------

    isAttacking()
    {
        return this.isStepAttacking() && this.attackingFrame !== RPM.FRAMES -1;
    }

    // -------------------------------------------------------

    setUsingSkill()
    {
        this.attackingFrame = 0;
        this.step = BattlerStep.Skill;
        this.updateUVs();
    }

    // -------------------------------------------------------

    setUsingItem()
    {
        this.attackingFrame = 0;
        this.step = BattlerStep.Item;
        this.updateUVs();
    }

    // -------------------------------------------------------

    setEscaping()
    {
        this.attackingFrame = 0;
        this.step = BattlerStep.Escape;
        this.updateUVs();
    }

    // -------------------------------------------------------

    setVictory()
    {
        this.frame = 0;
        this.step = BattlerStep.Victory;
        this.updateUVs();
    }

    // -------------------------------------------------------

    updateDead(attacked, user)
    {
        let step = BattlerStep.Normal;
        if (this.character.isDead())
        {
            step = BattlerStep.Dead;
        } else if (attacked) {
            step = BattlerStep.Attacked;
        }
        if (this.step !== step && (user !== this || step === BattlerStep.Dead))
        {
            this.step = step;
            this.updateUVs();
        }
    }

    // -------------------------------------------------------

    update()
    {
        if (this.mesh !== null)
        {
            this.setActive(this.active);
            this.updateSelected();
            this.updateFrame();
            this.updateArrow();
            this.updateDamages();
            this.updateAttacking();
            this.updatePositions();
        }
    }

    // -------------------------------------------------------

    updateSelected()
    {
        let newX = this.mesh.position.x;
        let progression;
        if (this.character.k === CharacterKind.Hero)
        {
            progression = this.selected ? this.progressionAllyFront : this
                .progressionAllyBack;
        } else if (this.character.k === CharacterKind.Monster)
        {
            progression = this.selected ? this.progressionEnemyFront : this
                .progressionEnemyBack;
        }
        let time = new Date().getTime() - this.timerMove;
        if (time <= Battler.TIME_MOVE)
        {
            this.moving = true;
            newX = progression.getProgressionAt(time, Battler.TIME_MOVE, true);
        } else
        {
            this.moving = false;
        }

        if (this.mesh.position.x !== newX)
        {
            this.mesh.position.setX(newX);
            this.upPosition.setX(newX);
            this.halfPosition.setX(newX);
            this.updatePositions();
            this.updateArrowPosition(RPM.currentMap.camera);
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------

    updateFrame()
    {
        if (this.timeDamage < Battler.TOTAL_TIME_DAMAGE)
        {
            this.timeDamage += RPM.elapsedTime;
            if (this.timeDamage > Battler.TOTAL_TIME_DAMAGE)
            {
                this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
            }
            RPM.requestPaintHUD = true;
        }
        if (!this.attacking)
        {
            var frame = this.frame;
            this.frameTick += RPM.elapsedTime;
            if (this.frameTick >= this.frameDuration)
            {
                this.frame = (this.frame + 1) % RPM.FRAMES;
                this.frameTick = 0;
            }
            if (frame !== this.frame)
            {
                this.updateUVs();
            }
        }
    }

    // -------------------------------------------------------

    updateArrow()
    {
        this.frameArrowTick += RPM.elapsedTime;
        if (this.frameArrowTick >= this.frameArrowDuration)
        {
            this.frameArrow = (this.frameArrow + 1) % RPM.FRAMES;
            this.frameArrowTick = 0;
            this.arrowPosition = RPM.toScreenPosition(this.mesh.position, RPM
                .currentMap.camera.threeCamera);
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------

    updateDamages()
    {
        this.damagePosition = RPM.toScreenPosition(this.upPosition, RPM
            .currentMap.camera.threeCamera);
    }

    // -------------------------------------------------------

    updateAttacking()
    {
        if (this.isStepAttacking())
        {
            let frame = this.attackingFrame;
            this.attackingFrameTick += RPM.elapsedTime;
            if (this.attackingFrameTick >= this.attackingFrameDuration)
            {
                this.attackingFrame = (this.attackingFrame + 1) % RPM.FRAMES;
                this.attackingFrameTick = 0;
            }

            if (frame !== this.attackingFrame)
            {
                if (this.attackingFrame === 0)
                {
                    this.step = BattlerStep.Normal;
                }
                this.updateUVs();
            }
        }
    }

    // -------------------------------------------------------

    updatePositions()
    {
        this.topPosition = RPM.toScreenPosition(this.upPosition, RPM
            .currentMap.camera.threeCamera);
        this.midPosition = RPM.toScreenPosition(this.halfPosition, RPM
            .currentMap.camera.threeCamera);
        this.botPosition = RPM.toScreenPosition(this.mesh.position, RPM
            .currentMap.camera.threeCamera);
    }

    // -------------------------------------------------------

    updateArrowPosition(camera)
    {
        this.arrowPosition = RPM.toScreenPosition(this.mesh.position, camera
            .threeCamera);
    }

    // -------------------------------------------------------

    addToScene()
    {
        if (this.mesh !== null)
        {
            RPM.currentMap.scene.add(this.mesh);
        }
    }

    // -------------------------------------------------------

    removeFromScene()
    {
        if (this.mesh !== null)
        {
            RPM.currentMap.scene.remove(this.mesh);
        }
    }

    // -------------------------------------------------------
    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs()
    {
        if (this.mesh !== null)
        {
            let textureWidth = this.mesh.material.map.image.width;
            let textureHeight = this.mesh.material.map.image.height;
            let frame = 0;
            switch (this.step)
            {
            case BattlerStep.Normal:
            case BattlerStep.Victory:
            case BattlerStep.Dead:
                frame = this.frame;
                break;
            case BattlerStep.Attack:
            case BattlerStep.Skill:
            case BattlerStep.Item:
            case BattlerStep.Escape:
                frame = this.attackingFrame;
                break;
            }
            let w = this.width * RPM.SQUARE_SIZE / textureWidth;
            let h = this.height * RPM.SQUARE_SIZE / textureHeight;
            let x = frame * w;
            let y = this.step * h;

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

    // -------------------------------------------------------

    drawArrow()
    {
        RPM.datasGame.system.getWindowSkin().drawArrowTarget(this.frameArrow, 
            this.arrowPosition.x, this.arrowPosition.y, false);
    }

    // -------------------------------------------------------

    drawDamages(damage, isCrit, isMiss)
    {
        RPM.datasGame.system.getWindowSkin().drawDamages(damage, this
            .damagePosition.x, this.damagePosition.y, isCrit, isMiss, this
            .timeDamage / Battler.TOTAL_TIME_DAMAGE);
    }
}