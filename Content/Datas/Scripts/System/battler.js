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
*   @property {number} [Battler.OFFSET_SELECTED=10] The pixel offset when the 
*   battler is selected
*   @property {number} [Battler.TIME_MOVE=200] The time in milliseconds when 
*   the battler moves to selection offset
*   @property {number} [Battler.TOTAL_TIME_DAMAGE=250] The total time in 
*   milliseconds for displaying damages animation
*   @property {GamePlayer} character The character properties
*   @property {THREE.Vector2} arrowPosition The target arrow position on screen
*   @property {THREE.Vector2} damagePosition The damage position on screen
*   @property {THREE.Vector2} topPosition The top animation position on screen
*   @property {THREE.Vector2} midPosition The mid animaion position on screen
*   @property {THREE.Vector2} botPosition The bot animation position on screen
*   @property {boolean} active Indicate if the battler already attacked or not
*   @property {Frame} frame The battler frame
*   @property {Frame} frameAttacking The attacking battler frame
*   @property {Frame} frameArrow The target arrow frame
*   @property {BattlerStep} step The battler step
*   @property {number} width The battler textures width in squares
*   @property {number} height The battler textures height in squares
*   @property {boolean} selected Indicate if the battler is selected
*   @property {number} lastCommandIndex The last selected index command
*   @property {number} lastCommandOffset The last selected offset command
*   @property {number} lastSkillIndex The last selected index skill
*   @property {number} lastSkillOffset The last selected offset skill
*   @property {number} lastItemIndex The last selected index item
*   @property {number} lastItemOffset The last selected offset item
*   @property {number} itemsNumbers Number of items used according to ID (for 
*   actions AI)
*   @property {SystemProgressionTable} progressionAllyFront The progression for 
*   ally to move front
*   @property {SystemProgressionTable} progressionAllyBack The progression for 
*   ally to move back
*   @property {SystemProgressionTable} progressionEnemyFront The progression for 
*   enemy to move front
*   @property {SystemProgressionTable} progressionEnemyBack The progression for 
*   enemy to move back
*   @property {number} timerMove The time to move front / back
*   @property {number} timeDamage The time to display damage
*   @property {THREE.Mesh} mesh The battler mesh
*   @property {THREE.Vector3} upPosition The vector position up to the battler
*   @property {THREE.Vector3} halfPosition The vector position halp to the 
*   @property {boolean} moving Indicate if the battler is moving (
*   selection)
*   @param {GamePlayer} character The character properties
*   @param {THREE.Vector3} position The battler position
*   @param {Camera} camera the camera associated to the battle
*/
class Battler
{
    static OFFSET_SELECTED = 10;
    static TIME_MOVE = 200;
    static TOTAL_TIME_DAMAGE = 250;

    constructor(character, position, camera)
    {
        this.character = character;
        this.position = position;
        this.arrowPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.damagePosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.topPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.midPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.botPosition = RPM.toScreenPosition(position, camera.threeCamera);
        this.active = true;
        this.frame = new Frame(RPM.random(250, 300));
        this.frameAttacking = new Frame(350);
        this.frameArrow = new Frame(125);
        this.step = BattlerStep.Normal;
        this.width = 1;
        this.height = 1;
        this.selected = false;
        this.lastCommandIndex = 0;
        this.lastCommandOffset = 0;
        this.lastSkillIndex = 0;
        this.lastSkillOffset = 0;
        this.lastItemIndex = 0;
        this.lastItemOffset = 0;
        this.itemsNumbers = [];
        this.progressionAllyFront = SystemProgressionTable.create(
            this.position.x, this.position.x - Battler.OFFSET_SELECTED, 0);
        this.progressionAllyBack = SystemProgressionTable.create(
            this.position.x - Battler.OFFSET_SELECTED, this.position.x, 0);
        this.progressionEnemyFront = SystemProgressionTable.create(
            this.position.x, this.position.x + Battler.OFFSET_SELECTED, 0);
        this.progressionEnemyBack = SystemProgressionTable.create(
            this.position.x + Battler.OFFSET_SELECTED, this.position.x, 0);
        this.timerMove = 0;
        this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
        let idBattler = RPM.datasGame.getHeroesMonsters(character.k).list[
            character.id].idBattler;
        if (idBattler === -1)
        {
            this.mesh = null;
        } else
        {
            // Copy original material because there will be individual color 
            // changes
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
    
    // -------------------------------------------------------
    /** Set the selected state
    *   @param {boolean} selected Indicate if the battler is selected 
    */
    setSelected(selected)
    {
        if (this.selected !== selected)
        {
            this.selected = selected;
            this.timerMove = new Date().getTime();
        }
    }

    // -------------------------------------------------------
    /** Set the active state
    *   @param {boolean} active Indicate if the battler is active
    */
    setActive(active)
    {
        this.active = active;
        if (active)
        {
            this.mesh.material.uniforms.colorD.value.setX(RPM.screenTone.x);
            this.mesh.material.uniforms.colorD.value.setY(RPM.screenTone.y);
            this.mesh.material.uniforms.colorD.value.setZ(RPM.screenTone.z);
            this.mesh.material.uniforms.colorD.value.setW(RPM.screenTone.w);
        } else
        {
            this.mesh.material.uniforms.colorD.value.setX(RPM.screenTone.x - 0.3);
            this.mesh.material.uniforms.colorD.value.setY(RPM.screenTone.y - 0.3);
            this.mesh.material.uniforms.colorD.value.setZ(RPM.screenTone.z - 0.3);
            this.mesh.material.uniforms.colorD.value.setW(RPM.screenTone.w - 0.3);
        }
    }

    // -------------------------------------------------------
    /** Set battler step as attacking
    */
    setAttacking()
    {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Attack;
        this.updateUVs();
    }

    // -------------------------------------------------------
    /** Check if the battler is attacking (or skill, item, escape)
    *   @returns {boolean}
    */
    isStepAttacking()
    {
        return this.step === BattlerStep.Attack || this.step === BattlerStep
            .Skill || this.step === BattlerStep.Item || this.step ===
            BattlerStep.Escape;
    }

    // -------------------------------------------------------
    /** Check if the battler is attacking and the frames is currently run
    *   @returns {boolean}
    */
    isAttacking()
    {
        return this.isStepAttacking() && this.frameAttacking.value !== RPM
            .FRAMES -1;
    }

    // -------------------------------------------------------
    /** Set battler step as using a skill
    */
    setUsingSkill()
    {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Skill;
        this.updateUVs();
    }

    // -------------------------------------------------------
    /** Set battler step as using an item
    */
    setUsingItem()
    {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Item;
        this.updateUVs();
    }

    // -------------------------------------------------------
    /** Set battler step as escaping
    */
    setEscaping()
    {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Escape;
        this.updateUVs();
    }

    // -------------------------------------------------------
    /** Set battler step as victory
    */
    setVictory()
    {
        this.frame.value = 0;
        this.step = BattlerStep.Victory;
        this.updateUVs();
    }

    // -------------------------------------------------------
    /** Update battler step if is dead, attacked if attacked
    *   @param {boolean} attacked Indicate if the battler is attacked
    *   @param {GamePlayer} user The attack / skill / item user
    */
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
    /** Update the battler
    */
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
    /** Update the selected move progress
    */
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
    /** Update the frame
    */
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
        if (!this.attacking && this.frame.update())
        {
            this.updateUVs();
        }
    }

    // -------------------------------------------------------
    /** Update the frame
    */
    updateArrow()
    {
        if (this.frameArrow.update())
        {
            this.arrowPosition = RPM.toScreenPosition(this.mesh.position, RPM
                .currentMap.camera.threeCamera);
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Update the damages position
    */
    updateDamages()
    {
        this.damagePosition = RPM.toScreenPosition(this.upPosition, RPM
            .currentMap.camera.threeCamera);
    }

    // -------------------------------------------------------
    /** Update attacking step frame
    */
    updateAttacking()
    {
        if (this.isStepAttacking() && this.frameAttacking.update())
        {
            if (this.frameAttacking.value === 0)
            {
                this.step = BattlerStep.Normal;
            }
            this.updateUVs();
        }
    }

    // -------------------------------------------------------
    /** Update positions to screen
    */
    updatePositions()
    {
        this.topPosition = RPM.toScreenPosition(this.upPosition, RPM.currentMap
            .camera.threeCamera);
        this.midPosition = RPM.toScreenPosition(this.halfPosition, RPM
            .currentMap.camera.threeCamera);
        this.botPosition = RPM.toScreenPosition(this.mesh.position, RPM
            .currentMap.camera.threeCamera);
    }

    // -------------------------------------------------------
    /** Update the arrow position
    */
    updateArrowPosition(camera)
    {
        this.arrowPosition = RPM.toScreenPosition(this.mesh.position, camera
            .threeCamera);
    }

    // -------------------------------------------------------
    /** Add the battler to scene
    */
    addToScene()
    {
        if (this.mesh !== null)
        {
            RPM.currentMap.scene.add(this.mesh);
        }
    }

    // -------------------------------------------------------
    /** Remove battler from scene
    */
    removeFromScene()
    {
        if (this.mesh !== null)
        {
            RPM.currentMap.scene.remove(this.mesh);
        }
    }

    // -------------------------------------------------------
    /** Update the UVs coordinates according to frame and orientation
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
                frame = this.frame.value;
                break;
            case BattlerStep.Attack:
            case BattlerStep.Skill:
            case BattlerStep.Item:
            case BattlerStep.Escape:
                frame = this.frameAttacking.value;
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
    /** Draw the arrow to select this battler
    */
    drawArrow()
    {
        RPM.datasGame.system.getWindowSkin().drawArrowTarget(this.frameArrow
            .value, this.arrowPosition.x, this.arrowPosition.y, false);
    }

    // -------------------------------------------------------
    /** Draw the damages on top of the battler
    */
    drawDamages(damage, isCrit, isMiss)
    {
        RPM.datasGame.system.getWindowSkin().drawDamages(damage, this
            .damagePosition.x, this.damagePosition.y, isCrit, isMiss, this
            .timeDamage / Battler.TOTAL_TIME_DAMAGE);
    }
}