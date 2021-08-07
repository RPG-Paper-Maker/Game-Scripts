/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../Globals";
import { Player } from "./Player";
import { Enum, Mathf, ScreenResolution } from "../Common";
import { Frame } from "./Frame";
import { ProgressionTable } from "../System";
import { Manager, Datas, Scene, Core } from "../index";
import { Camera } from "./Camera";
import { Sprite } from "./Sprite";
import { Position } from "./Position";
import { ShaderMaterial } from "three";
import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";
import { Status } from "./Status";
import { Animation } from "./Animation";
import { CustomGeometry } from "./CustomGeometry";

/** @class
 *  A battler in a battle (ally or ennemy).
 *  @param {Player} player - The character properties
 *  @param {Vector3} position - The battler position
 *  @param {Camera} camera - the camera associated to the battle
 */
class Battler {
    
    public static OFFSET_SELECTED = 10;
    public static TIME_MOVE = 200;
    public static TOTAL_TIME_DAMAGE = 250;

    public player: Player;
    public position: Vector3;
    public arrowPosition: Vector2;
    public damagePosition: Vector2;
    public topPosition: Vector2;
    public midPosition: Vector2;
    public botPosition: Vector2;
    public active: boolean;
    public frame: Frame;
    public frameAttacking: Frame;
    public frameArrow: Frame;
    public step: Enum.BattlerStep;
    public lastStep: Enum.BattlerStep;
    public width: number;
    public height: number;
    public selected: boolean;
    public lastCommandIndex: number;
    public lastCommandOffset: number;
    public lastSkillIndex: number;
    public lastSkillOffset: number;
    public lastItemIndex: number;
    public lastItemOffset: number;
    public itemsNumbers = [];
    public progressionAllyFront: ProgressionTable;
    public progressionAllyBack: ProgressionTable;
    public progressionEnemyFront: ProgressionTable;
    public progressionEnemyBack: ProgressionTable;
    public timerMove: number;
    public timeDamage: number;
    public mesh: THREE.Mesh;
    public upPosition: Vector3;
    public halfPosition: Vector3;
    public moving: boolean;
    public attacking: boolean;
    public damages: number;
    public isDamagesMiss: boolean;
    public isDamagesCritical: boolean;
    public currentStatusAnimation: Animation = null;
    public lastStatus: Status;
    public lastStatusHealed: Status;
    public lastTarget: Battler = null;

    constructor(player: Player, position?: Position, vect?: Vector3, camera?: Camera) {
        this.player = player;
        if (!position) {
            return;
        }
        this.position = vect;
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
        this.frame = new Frame(Mathf.random(250, 300), { frames: Datas.Systems.battlersFrames });
        this.frameAttacking = new Frame(350, { loop: false });
        this.frameArrow = new Frame(125);
        this.step = Enum.BattlerStep.Normal;
        this.lastStep = Enum.BattlerStep.Normal;
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
        this.progressionAllyFront = ProgressionTable.createFromNumbers(
            this.position.x, this.position.x - Battler.OFFSET_SELECTED, 0);
        this.progressionAllyBack = ProgressionTable.createFromNumbers(
            this.position.x - Battler.OFFSET_SELECTED, this.position.x, 0);
        this.progressionEnemyFront = ProgressionTable.createFromNumbers(
            this.position.x, this.position.x + Battler.OFFSET_SELECTED, 0);
        this.progressionEnemyBack = ProgressionTable.createFromNumbers(
            this.position.x + Battler.OFFSET_SELECTED, this.position.x, 0);
        this.timerMove = 0;
        this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
        let idBattler = player.system.idBattler;
        if (idBattler === -1) {
            this.mesh = null;
        } else {
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
            this.width = texture.image.width / Datas.Systems.SQUARE_SIZE / Datas
                .Systems.battlersFrames;
            this.height = texture.image.height / Datas.Systems.SQUARE_SIZE / 
                Datas.Systems.battlersColumns;
            let sprite = Sprite.create(Enum.ElementMapKind.SpritesFace, [0, 0, 
                this.width, this.height]);
            let geometry = sprite.createGeometry(this.width, this.height, false, 
                position)[0];
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(this.position.x, this.position.y, this
                .position.z);
            this.upPosition = new Vector3(this.position.x, this.position.y + (
                this.height * Datas.Systems.SQUARE_SIZE), this.position.z);
            this.halfPosition = new Vector3(this.position.x, this.position.y + (
                this.height * Datas.Systems.SQUARE_SIZE / 2), this.position.z);
            if (player.kind === Enum.CharacterKind.Monster) {
                this.mesh.scale.set(-1, 1, 1);
            }
            this.updateUVs();
        }
        // Update status animation
        this.updateAnimationStatus();
    }

    /** 
     *  Check at least one affected status contains the following restriction.
     *  @param {Enum.StatusRestrictionsKind} restriction - The kind of restriction 
     *  @returns {boolean}
     */
    containsRestriction(restriction: Enum.StatusRestrictionsKind): boolean {
        let status: Status;
        for (let i = 0, l = this.player.status.length; i < l; i++) {
            status = this.player.status[i];
            if (status.system.restrictionKind === restriction) {
                return true;
            }
        }
        return false;
    }
    
    /** 
     *  Set the selected state.
     *  @param {boolean} selected - Indicate if the battler is selected 
     */
    setSelected(selected: boolean) {
        if (this.selected !== selected) {
            this.selected = selected;
            this.timerMove = new Date().getTime();
        }
    }

    /** 
     *  Set the active state.
     *  @param {boolean} active - Indicate if the battler is active
     */
    setActive(active: boolean) {
        this.active = active;
        let material = <ShaderMaterial>this.mesh.material;
        if (active) {
            material.uniforms.colorD.value.setX(Manager.GL.screenTone.x);
            material.uniforms.colorD.value.setY(Manager.GL.screenTone.y);
            material.uniforms.colorD.value.setZ(Manager.GL.screenTone.z);
            material.uniforms.colorD.value.setW(Manager.GL.screenTone.w);
        } else {
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
        this.step = Enum.BattlerStep.Attack;
        this.updateUVs();
    }

    /** 
     *  Check if the battler is attacking (or skill, item, escape).
     *  @returns {boolean}
     */
    isStepAttacking(): boolean {
        return this.step === Enum.BattlerStep.Attack || this.step === Enum
            .BattlerStep.Skill || this.step === Enum.BattlerStep.Item || this
            .step === Enum.BattlerStep.Escape;
    }

    /** 
     *  Check if the battler is attacking and the frames is currently run.
     *  @returns {boolean}
     */
    isAttacking(): boolean {
        return this.isStepAttacking() && this.frameAttacking.value !== Datas
            .Systems.FRAMES -1;
    }

    /** 
     *  Set battler step as using a skill.
     */
    setUsingSkill() {
        this.frameAttacking.value = 0;
        this.step = Enum.BattlerStep.Skill;
        this.updateUVs();
    }

    /** 
     *  Set battler step as using an item.
     */
    setUsingItem() {
        this.frameAttacking.value = 0;
        this.step = Enum.BattlerStep.Item;
        this.updateUVs();
    }

    /** 
     *  Set battler step as escaping.
     */
    setEscaping() {
        this.frameAttacking.value = 0;
        this.step = Enum.BattlerStep.Escape;
        this.updateUVs();
    }

    /** 
     *  Set battler step as victory.
     */
    setVictory() {
        this.frame.value = 0;
        this.step = Enum.BattlerStep.Victory;
        this.updateUVs();
    }

    /** 
     *  Update battler step if is dead, attacked if attacked.
     *  @param {boolean} attacked - Indicate if the battler is attacked
     *  @param {Player} user - The attack / skill / item user
     */
    updateDead(attacked: boolean, user?: Player) {
        let step = this.step;
        if (this.player.isDead()) {
            this.addStatus(1);
            step = this.step;
            this.lastStep = step;
        } else {
            this.removeStatus(1);
            if (attacked) {
                step = Enum.BattlerStep.Attacked;
            } else {
                step = this.step;
                this.lastStep = step;
            }
        }
        if (this.step !== step && (user !== this.player)) {
            this.step = step;
            this.updateUVs();
        }
    }

    /** 
     *  Update the battler.
     */
    update(angle: number) {
        if (this.mesh !== null) {
            this.setActive(this.active);
            this.updateSelected();
            this.updateFrame();
            this.updateArrow();
            this.updateDamages();
            this.updateAttacking();
            this.updatePositions();
            this.mesh.rotation.y = angle;
        }
    }

    /** 
     *  Update the selected move progress.
     */
    updateSelected() {
        let newX = this.mesh.position.x;
        let progression: ProgressionTable;
        if (this.player.kind === Enum.CharacterKind.Hero) {
            progression = this.selected ? this.progressionAllyFront : this
                .progressionAllyBack;
        } else if (this.player.kind === Enum.CharacterKind.Monster) {
            progression = this.selected ? this.progressionEnemyFront : this
                .progressionEnemyBack;
        }
        let time = new Date().getTime() - this.timerMove;
        if (time <= Battler.TIME_MOVE) {
            this.moving = true;
            newX = progression.getProgressionAt(time, Battler.TIME_MOVE, true);
        } else {
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
        if (this.currentStatusAnimation) {
            this.currentStatusAnimation.update();
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Update the frame.
     */
    updateArrow() {
        if (this.frameArrow.update()) {
            this.arrowPosition = Manager.GL.toScreenPosition(this.mesh.position, 
                Scene.Map.current.camera.getThreeCamera());
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Update the damages position.
     */
    updateDamages() {
        this.damagePosition = Manager.GL.toScreenPosition(this.upPosition, 
            Scene.Map.current.camera.getThreeCamera());
    }

    /** 
     *  Update attacking step frame.
     */
    updateAttacking() {
        if (this.isStepAttacking() && this.frameAttacking.update()) {
            if (this.frameAttacking.value === 0) {
                this.step = this.lastStep;
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
        this.midPosition = Manager.GL.toScreenPosition(this.halfPosition, 
            Scene.Map.current.camera.getThreeCamera());
        this.botPosition = Manager.GL.toScreenPosition(this.mesh.position, 
            Scene.Map.current.camera.getThreeCamera());
    }

    /** 
     *  Update the arrow position.
     */
    updateArrowPosition(camera: Camera) {
        this.arrowPosition = Manager.GL.toScreenPosition(this.mesh.position, 
            camera.getThreeCamera());
    }

    /** 
     *  Update current status animation.
     *  @param {Core.Status} previousFirst - The previous status animation.
     */
    updateAnimationStatus(previousFirst: Status = undefined) {
        let status = this.player.status[0];
        if (previousFirst != status) {
            if (status) {
                this.currentStatusAnimation = new Animation(status.system
                    .animationID.getValue(), true);
            } else {
                this.currentStatusAnimation = null;
            }
        }
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
        if (this.mesh) {
            let texture = Manager.GL.getMaterialTexture(<ShaderMaterial>this
                .mesh.material);
            let textureWidth = texture.image.width;
            let textureHeight = texture.image.height;
            let frame = 0;
            switch (this.step) {
                case Enum.BattlerStep.Attack:
                case Enum.BattlerStep.Skill:
                case Enum.BattlerStep.Item:
                    frame = this.frameAttacking.value;
                    break;
                default:
                    frame = this.frame.value;
                    break;
            }
            let w = this.width * Datas.Systems.SQUARE_SIZE / textureWidth;
            let h = this.height * Datas.Systems.SQUARE_SIZE / textureHeight;
            let x = frame * w;
            let y = this.step * h;

            // Update geometry
            let texA = new Vector2();
            let texB = new Vector2();
            let texC = new Vector2();
            let texD = new Vector2();
            CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, x, y, w, h);

            // Update geometry
            (<CustomGeometry>this.mesh.geometry).pushQuadUVs(texA, texB, texC, texD);
            (<CustomGeometry>this.mesh.geometry).updateUVs();
        }
    }

    /** 
     *  Add a new status and check if already in.
     *  @param {number} id - The status id to add
     *  @returns {Core.Status}
     */
    addStatus(id: number): Status {
        let status = this.player.addStatus(id);
        this.updateStatusStep();
        return status;
    }

    /** 
     *  Remove the status.
     *  @param {number} id - The status id to remove
     *  @returns {Core.Status}
     */
    removeStatus(id: number): Status {
        let status = this.player.removeStatus(id);
        this.updateStatusStep();
        return status;
    }

    /** 
     *  Update status step (first priority status displayed).
     */
    updateStatusStep() {
        // Update step if changed
        let step = Enum.BattlerStep.Normal;
        let s = this.player.status[0];
        if (s) {
            step = s.system.battlerPosition.getValue();
        }
        if (this.step !== step) {
            this.step = step;
            this.updateUVs();
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
            .damagePosition.x, this.damagePosition.y, this.isDamagesCritical, 
            this.isDamagesMiss, this.timeDamage / Battler.TOTAL_TIME_DAMAGE);
    }

    /** 
     *  Draw the status on top of the battler.
     */
    drawStatus() {
        Status.drawList(this.player.getFirstStatus(), ScreenResolution
            .getScreenXReverse(this.damagePosition.x), ScreenResolution
            .getScreenYReverse(this.damagePosition.y), Enum.Align.Center);
    }

    /** 
     *  Draw the status animation
     */
    drawStatusAnimation() {
        if (this.currentStatusAnimation) {
            this.currentStatusAnimation.draw(this);
        }
    }

    /** 
     *  Draw the HUD specific to battler.
     */
    drawHUD() {
        this.drawStatusAnimation();
        this.drawStatus();
    }
}

export { Battler }