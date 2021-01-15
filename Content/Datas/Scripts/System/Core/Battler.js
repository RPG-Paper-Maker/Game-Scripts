/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals.js";
import { Enum, Mathf } from "../Common/index.js";
import { Frame } from "./Frame.js";
var BattlerStep = Enum.BattlerStep;
var CharacterKind = Enum.CharacterKind;
var ElementMapKind = Enum.ElementMapKind;
import { ProgressionTable } from "../System/index.js";
import { Manager, Datas, Scene } from "../index.js";
import { Sprite } from "./Sprite.js";
import { Vector3 } from "./Vector3.js";
/** @class
 *  A battler in a battle (ally or ennemy).
 *  @param {Player} player - The character properties
 *  @param {Vector3} position - The battler position
 *  @param {Camera} camera - the camera associated to the battle
 */
class Battler {
    constructor(player, position, camera) {
        this.itemsNumbers = [];
        this.player = player;
        if (!position) {
            return;
        }
        this.position = position.toVector3();
        this.arrowPosition = Manager.GL.toScreenPosition(this.position, camera
            .getThreeCamera());
        this.damagePosition = Manager.GL.toScreenPosition(this.position, camera
            .getThreeCamera());
        this.topPosition = Manager.GL.toScreenPosition(this.position, camera
            .getThreeCamera());
        this.midPosition = Manager.GL.toScreenPosition(this.position, camera
            .getThreeCamera());
        this.botPosition = Manager.GL.toScreenPosition(this.position, camera
            .getThreeCamera());
        this.active = true;
        this.frame = new Frame(Mathf.random(250, 300));
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
        this.progressionAllyFront = ProgressionTable.createFromNumbers(this.position.x, this.position.x - Battler.OFFSET_SELECTED, 0);
        this.progressionAllyBack = ProgressionTable.createFromNumbers(this.position.x - Battler.OFFSET_SELECTED, this.position.x, 0);
        this.progressionEnemyFront = ProgressionTable.createFromNumbers(this.position.x, this.position.x + Battler.OFFSET_SELECTED, 0);
        this.progressionEnemyBack = ProgressionTable.createFromNumbers(this.position.x + Battler.OFFSET_SELECTED, this.position.x, 0);
        this.timerMove = 0;
        this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
        let idBattler = player.system.idBattler;
        if (idBattler === -1) {
            this.mesh = null;
        }
        else {
            // Copy original material because there will be individual color 
            // changes
            let originalMaterial = Datas.Tilesets.texturesBattlers[idBattler];
            let texture = Manager.GL.getMaterialTexture(originalMaterial);
            let material = Manager.GL.createMaterial(texture.clone(), {
                uniforms: {
                    t: { type: "t", value: texture },
                    colorD: { type: "v4", value: Manager.GL.screenTone.clone() }
                }
            });
            texture = Manager.GL.getMaterialTexture(material);
            this.width = Math.floor(texture.image.width / Datas.Systems
                .SQUARE_SIZE / Datas.Systems.FRAMES);
            this.height = Math.floor(texture.image.height / Datas.Systems
                .SQUARE_SIZE / Battler.STEPS);
            let sprite = Sprite.create(ElementMapKind.SpritesFace, [0, 0, this
                    .width, this.height]);
            let geometry = sprite.createGeometry(this.width, this.height, false, position)[0];
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(this.position.x, this.position.y, this
                .position.z);
            this.upPosition = new Vector3(this.position.x, this.position.y + (this.height * Datas.Systems.SQUARE_SIZE), this.position.z);
            this.halfPosition = new Vector3(this.position.x, this.position.y + (this.height * Datas.Systems.SQUARE_SIZE / 2), this.position.z);
            if (player.kind === CharacterKind.Monster) {
                this.mesh.scale.set(-1, 1, 1);
            }
            this.updateUVs();
        }
    }
    /**
     *  Set the selected state.
     *  @param {boolean} selected - Indicate if the battler is selected
     */
    setSelected(selected) {
        if (this.selected !== selected) {
            this.selected = selected;
            this.timerMove = new Date().getTime();
        }
    }
    /**
     *  Set the active state.
     *  @param {boolean} active - Indicate if the battler is active
     */
    setActive(active) {
        this.active = active;
        let material = this.mesh.material;
        if (active) {
            material.uniforms.colorD.value.setX(Manager.GL.screenTone.x);
            material.uniforms.colorD.value.setY(Manager.GL.screenTone.y);
            material.uniforms.colorD.value.setZ(Manager.GL.screenTone.z);
            material.uniforms.colorD.value.setW(Manager.GL.screenTone.w);
        }
        else {
            material.uniforms.colorD.value.setX(Manager.GL.screenTone.x - 0.3);
            material.uniforms.colorD.value.setY(Manager.GL.screenTone.y - 0.3);
            material.uniforms.colorD.value.setZ(Manager.GL.screenTone.z - 0.3);
            material.uniforms.colorD.value.setW(Manager.GL.screenTone.w - 0.3);
        }
    }
    /**
     *  Set battler step as attacking.
     */
    setAttacking() {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Attack;
        this.updateUVs();
    }
    /**
     *  Check if the battler is attacking (or skill, item, escape).
     *  @returns {boolean}
     */
    isStepAttacking() {
        return this.step === BattlerStep.Attack || this.step === BattlerStep
            .Skill || this.step === BattlerStep.Item || this.step ===
            BattlerStep.Escape;
    }
    /**
     *  Check if the battler is attacking and the frames is currently run.
     *  @returns {boolean}
     */
    isAttacking() {
        return this.isStepAttacking() && this.frameAttacking.value !== Datas
            .Systems.FRAMES - 1;
    }
    /**
     *  Set battler step as using a skill.
     */
    setUsingSkill() {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Skill;
        this.updateUVs();
    }
    /**
     *  Set battler step as using an item.
     */
    setUsingItem() {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Item;
        this.updateUVs();
    }
    /**
     *  Set battler step as escaping.
     */
    setEscaping() {
        this.frameAttacking.value = 0;
        this.step = BattlerStep.Escape;
        this.updateUVs();
    }
    /**
     *  Set battler step as victory.
     */
    setVictory() {
        this.frame.value = 0;
        this.step = BattlerStep.Victory;
        this.updateUVs();
    }
    /**
     *  Update battler step if is dead, attacked if attacked.
     *  @param {boolean} attacked - Indicate if the battler is attacked
     *  @param {Player} user - The attack / skill / item user
     */
    updateDead(attacked, user) {
        let step = BattlerStep.Normal;
        if (this.player.isDead()) {
            step = BattlerStep.Dead;
        }
        else if (attacked) {
            step = BattlerStep.Attacked;
        }
        if (this.step !== step && (user !== this.player || step === BattlerStep
            .Dead)) {
            this.step = step;
            this.updateUVs();
        }
    }
    /**
     *  Update the battler.
     */
    update() {
        if (this.mesh !== null) {
            this.setActive(this.active);
            this.updateSelected();
            this.updateFrame();
            this.updateArrow();
            this.updateDamages();
            this.updateAttacking();
            this.updatePositions();
        }
    }
    /**
     *  Update the selected move progress.
     */
    updateSelected() {
        let newX = this.mesh.position.x;
        let progression;
        if (this.player.kind === CharacterKind.Hero) {
            progression = this.selected ? this.progressionAllyFront : this
                .progressionAllyBack;
        }
        else if (this.player.kind === CharacterKind.Monster) {
            progression = this.selected ? this.progressionEnemyFront : this
                .progressionEnemyBack;
        }
        let time = new Date().getTime() - this.timerMove;
        if (time <= Battler.TIME_MOVE) {
            this.moving = true;
            newX = progression.getProgressionAt(time, Battler.TIME_MOVE, true);
        }
        else {
            this.moving = false;
        }
        if (this.mesh.position.x !== newX) {
            this.mesh.position.setX(newX);
            this.upPosition.setX(newX);
            this.halfPosition.setX(newX);
            this.updatePositions();
            this.updateArrowPosition(Scene.Map.current.camera);
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Update the frame.
     */
    updateFrame() {
        if (this.timeDamage < Battler.TOTAL_TIME_DAMAGE) {
            this.timeDamage += Manager.Stack.elapsedTime;
            if (this.timeDamage > Battler.TOTAL_TIME_DAMAGE) {
                this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
            }
            Manager.Stack.requestPaintHUD = true;
        }
        if (!this.attacking && this.frame.update()) {
            this.updateUVs();
        }
    }
    /**
     *  Update the frame.
     */
    updateArrow() {
        if (this.frameArrow.update()) {
            this.arrowPosition = Manager.GL.toScreenPosition(this.mesh.position, Scene.Map.current.camera.getThreeCamera());
            Manager.Stack.requestPaintHUD = true;
        }
    }
    /**
     *  Update the damages position.
     */
    updateDamages() {
        this.damagePosition = Manager.GL.toScreenPosition(this.upPosition, Scene.Map.current.camera.getThreeCamera());
    }
    /**
     *  Update attacking step frame.
     */
    updateAttacking() {
        if (this.isStepAttacking() && this.frameAttacking.update()) {
            if (this.frameAttacking.value === 0) {
                this.step = BattlerStep.Normal;
            }
            this.updateUVs();
        }
    }
    /**
     *  Update positions to screen.
     */
    updatePositions() {
        this.topPosition = Manager.GL.toScreenPosition(this.upPosition, Scene
            .Map.current.camera.getThreeCamera());
        this.midPosition = Manager.GL.toScreenPosition(this.halfPosition, Scene.Map.current.camera.getThreeCamera());
        this.botPosition = Manager.GL.toScreenPosition(this.mesh.position, Scene.Map.current.camera.getThreeCamera());
    }
    /**
     *  Update the arrow position.
     */
    updateArrowPosition(camera) {
        this.arrowPosition = Manager.GL.toScreenPosition(this.mesh.position, camera.getThreeCamera());
    }
    /**
     *  Add the battler to scene.
     */
    addToScene() {
        if (this.mesh !== null) {
            Scene.Map.current.scene.add(this.mesh);
        }
    }
    /**
     *  Remove battler from scene.
     */
    removeFromScene() {
        if (this.mesh !== null) {
            Scene.Map.current.scene.remove(this.mesh);
        }
    }
    /**
     *  Update the UVs coordinates according to frame and orientation.
     */
    updateUVs() {
        if (this.mesh !== null) {
            let texture = Manager.GL.getMaterialTexture(this
                .mesh.material);
            let textureWidth = texture.image.width;
            let textureHeight = texture.image.height;
            let frame = 0;
            switch (this.step) {
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
            let w = this.width * Datas.Systems.SQUARE_SIZE / textureWidth;
            let h = this.height * Datas.Systems.SQUARE_SIZE / textureHeight;
            let x = frame * w;
            let y = this.step * h;
            // Update geometry
            this.mesh.geometry.faceVertexUvs[0][0][0].set(x, y);
            this.mesh.geometry.faceVertexUvs[0][0][1].set(x +
                w, y);
            this.mesh.geometry.faceVertexUvs[0][0][2].set(x +
                w, y + h);
            this.mesh.geometry.faceVertexUvs[0][1][0].set(x, y);
            this.mesh.geometry.faceVertexUvs[0][1][1].set(x +
                w, y + h);
            this.mesh.geometry.faceVertexUvs[0][1][2].set(x, y
                + h);
            this.mesh.geometry.uvsNeedUpdate = true;
        }
    }
    /**
     *  Draw the arrow to select this battler.
     */
    drawArrow() {
        Datas.Systems.getCurrentWindowSkin().drawArrowTarget(this.frameArrow
            .value, this.arrowPosition.x, this.arrowPosition.y, false);
    }
    /**
     *  Draw the damages on top of the battler.
     */
    drawDamages() {
        Datas.Systems.getCurrentWindowSkin().drawDamages(this.damages, this
            .damagePosition.x, this.damagePosition.y, this.isDamagesCritical, this.isDamagesMiss, this.timeDamage / Battler.TOTAL_TIME_DAMAGE);
    }
}
Battler.OFFSET_SELECTED = 10;
Battler.TIME_MOVE = 200;
Battler.TOTAL_TIME_DAMAGE = 250;
Battler.STEPS = 9;
export { Battler };