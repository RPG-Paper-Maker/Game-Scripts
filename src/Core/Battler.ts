/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { MeshPhongMaterial } from 'three';
import {
	ALIGN,
	ALIGN_VERTICAL,
	BATTLER_STEP,
	ELEMENT_MAP_KIND,
	Interpreter,
	STATUS_RESTRICTIONS_KIND,
} from '../Common';
import { ProgressionTable } from '../System';
import { Datas, Graphic, Manager, Scene } from '../index';
import { Animation } from './Animation';
import { Camera } from './Camera';
import { CustomGeometry } from './CustomGeometry';
import { Frame } from './Frame';
import { Player } from './Player';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { Sprite } from './Sprite';
import { Status } from './Status';

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
	public isEnemy: boolean;
	public initialPosition: Position;
	public position: THREE.Vector3;
	public arrowPosition: THREE.Vector2;
	public damagePosition: THREE.Vector2;
	public topPosition: THREE.Vector2;
	public midPosition: THREE.Vector2;
	public botPosition: THREE.Vector2;
	public active: boolean;
	public frame: Frame;
	public frameAttacking: Frame;
	public frameArrow: Frame;
	public step: BATTLER_STEP;
	public lastStep: BATTLER_STEP;
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
	public topLeftPosition: THREE.Vector3;
	public botRightPosition: THREE.Vector3;
	public upPosition: THREE.Vector3;
	public halfPosition: THREE.Vector3;
	public rect: Rectangle = new Rectangle();
	public moving: boolean;
	public attacking: boolean;
	public damages: number;
	public damagesName: string;
	public graphicDamageName: Graphic.Text = new Graphic.Text('', { verticalAlign: ALIGN_VERTICAL.BOT });
	public isDamagesMiss: boolean;
	public isDamagesCritical: boolean;
	public tempIsDamagesMiss: boolean = null;
	public tempIsDamagesCritical: boolean = null;
	public currentStatusAnimation: Animation = null;
	public lastStatus: Status;
	public lastStatusHealed: Status;
	public lastTarget: Battler = null;
	public hidden: boolean = false;

	constructor(player: Player, isEnemy: boolean = false, position?: Position, vect?: THREE.Vector3, camera?: Camera) {
		this.player = player;
		this.isEnemy = isEnemy;
		this.initialPosition = position;
		if (!position) {
			return;
		}
		this.position = vect;
		this.arrowPosition = Manager.GL.toScreenPosition(this.position, camera.getThreeCamera());
		this.damagePosition = Manager.GL.toScreenPosition(this.position, camera.getThreeCamera());
		this.topPosition = Manager.GL.toScreenPosition(this.position, camera.getThreeCamera());
		this.midPosition = Manager.GL.toScreenPosition(this.position, camera.getThreeCamera());
		this.botPosition = Manager.GL.toScreenPosition(this.position, camera.getThreeCamera());
		this.active = true;
		this.frame = new Frame(Interpreter.evaluate(Datas.Systems.battlersFrameDuration), {
			frames: Datas.Systems.battlersFrames,
		});
		this.frameAttacking = new Frame(Interpreter.evaluate(Datas.Systems.battlersFrameAttackingDuration), {
			loop: false,
		});
		this.frameArrow = new Frame(125);
		this.step = BATTLER_STEP.NORMAL;
		this.lastStep = BATTLER_STEP.NORMAL;
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
			this.position.x,
			this.position.x - Battler.OFFSET_SELECTED,
			0
		);
		this.progressionAllyBack = ProgressionTable.createFromNumbers(
			this.position.x - Battler.OFFSET_SELECTED,
			this.position.x,
			0
		);
		this.progressionEnemyFront = ProgressionTable.createFromNumbers(
			this.position.x,
			this.position.x + Battler.OFFSET_SELECTED,
			0
		);
		this.progressionEnemyBack = ProgressionTable.createFromNumbers(
			this.position.x + Battler.OFFSET_SELECTED,
			this.position.x,
			0
		);
		this.timerMove = 0;
		this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
		const idBattler = player.getBattlerID();
		if (idBattler === -1) {
			this.mesh = null;
		} else {
			// Copy original material because there will be individual color
			// changes
			const originalMaterial = Datas.Tilesets.texturesBattlers[idBattler];
			const texture = Manager.GL.getMaterialTexture(originalMaterial);
			const copiedTexture = texture.clone();
			const material = Manager.GL.createMaterial({
				texture: copiedTexture,
				uniforms: {
					colorD: { type: 'v4', value: Manager.GL.screenTone.clone() },
					offset: { type: 'v2', value: new THREE.Vector2() },
				},
			});
			this.width = copiedTexture.image.width / Datas.Systems.SQUARE_SIZE / Datas.Systems.battlersFrames;
			this.height = copiedTexture.image.height / Datas.Systems.SQUARE_SIZE / Datas.Systems.battlersColumns;
			const sprite = Sprite.create(ELEMENT_MAP_KIND.SPRITES_FACE, [0, 0, this.width, this.height]);
			const geometry = sprite.createGeometry(this.width, this.height, false, position)[0];
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);
			this.mesh.receiveShadow = true;
			this.mesh.castShadow = true;
			this.mesh.customDepthMaterial = material.userData.customDepthMaterial;
			this.topLeftPosition = new THREE.Vector3(
				this.position.x - (this.width / 2) * Datas.Systems.SQUARE_SIZE,
				this.position.y + this.height * Datas.Systems.SQUARE_SIZE,
				this.position.z
			);
			this.botRightPosition = new THREE.Vector3(
				this.position.x + (this.width / 2) * Datas.Systems.SQUARE_SIZE,
				this.position.y,
				this.position.z
			);
			this.upPosition = new THREE.Vector3(
				this.position.x,
				this.position.y + this.height * Datas.Systems.SQUARE_SIZE,
				this.position.z
			);
			this.halfPosition = new THREE.Vector3(
				this.position.x,
				this.position.y + (this.height * Datas.Systems.SQUARE_SIZE) / 2,
				this.position.z
			);
			if (isEnemy) {
				this.mesh.scale.set(-1, 1, 1);
			}
			this.updateUVs();
		}
		// Update status animation
		this.updateAnimationStatus();
	}

	/**
	 *  Check at least one affected status contains the following restriction.
	 *  @param {STATUS_RESTRICTIONS_KIND} restriction - The kind of restriction
	 *  @returns {boolean}
	 */
	containsRestriction(restriction: STATUS_RESTRICTIONS_KIND): boolean {
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
	 *  Check if mouse is inside the battler rectangle.
	 *  @param {number} x
	 *  @param {number} y
	 *  @returns {boolean}
	 */
	isInside(x: number, y: number): boolean {
		return this.rect.isInside(x, y);
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
		const material = <MeshPhongMaterial>this.mesh.material;
		if (active) {
			material.userData.uniforms.colorD.value.setX(Manager.GL.screenTone.x);
			material.userData.uniforms.colorD.value.setY(Manager.GL.screenTone.y);
			material.userData.uniforms.colorD.value.setZ(Manager.GL.screenTone.z);
			material.userData.uniforms.colorD.value.setW(Manager.GL.screenTone.w);
		} else {
			material.userData.uniforms.colorD.value.setX(Manager.GL.screenTone.x - 0.3);
			material.userData.uniforms.colorD.value.setY(Manager.GL.screenTone.y - 0.3);
			material.userData.uniforms.colorD.value.setZ(Manager.GL.screenTone.z - 0.3);
			material.userData.uniforms.colorD.value.setW(Manager.GL.screenTone.w - 0.3);
		}
	}

	/**
	 *  Set battler step as attacking.
	 */
	setAttacking() {
		this.frameAttacking.value = 0;
		this.step = BATTLER_STEP.ATTACK;
		this.updateUVs();
	}

	/**
	 *  Check if the battler is attacking (or skill, item, escape).
	 *  @returns {boolean}
	 */
	isStepAttacking(): boolean {
		return (
			this.step === BATTLER_STEP.ATTACK ||
			this.step === BATTLER_STEP.SKILL ||
			this.step === BATTLER_STEP.ITEM ||
			this.step === BATTLER_STEP.ESCAPE
		);
	}

	/**
	 *  Check if the battler is attacking and the frames is currently run.
	 *  @returns {boolean}
	 */
	isAttacking(): boolean {
		return this.isStepAttacking() && this.frameAttacking.value !== Datas.Systems.FRAMES - 1;
	}

	/**
	 *  Set battler step as using a skill.
	 */
	setUsingSkill() {
		this.frameAttacking.value = 0;
		this.step = BATTLER_STEP.SKILL;
		this.updateUVs();
	}

	/**
	 *  Set battler step as using an item.
	 */
	setUsingItem() {
		this.frameAttacking.value = 0;
		this.step = BATTLER_STEP.ITEM;
		this.updateUVs();
	}

	/**
	 *  Set battler step as escaping.
	 */
	setEscaping() {
		this.frameAttacking.value = 0;
		this.step = BATTLER_STEP.ESCAPE;
		this.updateUVs();
	}

	/**
	 *  Set battler step as victory.
	 */
	setVictory() {
		this.frame.value = 0;
		this.step = BATTLER_STEP.VICTORY;
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
				step = BATTLER_STEP.ATTACKED;
			} else {
				step = this.step;
				this.lastStep = step;
			}
		}
		if (this.step !== step && user !== this.player) {
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
		if (this.isEnemy) {
			progression = this.selected ? this.progressionEnemyFront : this.progressionEnemyBack;
		} else {
			progression = this.selected ? this.progressionAllyFront : this.progressionAllyBack;
		}
		let time = new Date().getTime() - this.timerMove;
		if (time <= Battler.TIME_MOVE) {
			this.moving = true;
		} else {
			this.moving = false;
			time = Battler.TIME_MOVE;
		}
		newX = progression.getProgressionAt(time, Battler.TIME_MOVE, true);
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
			this.arrowPosition = Manager.GL.toScreenPosition(
				this.mesh.position,
				Scene.Map.current.camera.getThreeCamera()
			);
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
				this.step = this.lastStep;
			}
			this.updateUVs();
		}
	}

	/**
	 *  Update positions to screen.
	 */
	updatePositions() {
		this.topPosition = Manager.GL.toScreenPosition(this.upPosition, Scene.Map.current.camera.getThreeCamera());
		this.midPosition = Manager.GL.toScreenPosition(this.halfPosition, Scene.Map.current.camera.getThreeCamera());
		this.botPosition = Manager.GL.toScreenPosition(this.mesh.position, Scene.Map.current.camera.getThreeCamera());
		const topLeft = Manager.GL.toScreenPosition(this.topLeftPosition, Scene.Map.current.camera.getThreeCamera());
		const botRight = Manager.GL.toScreenPosition(this.botRightPosition, Scene.Map.current.camera.getThreeCamera());
		this.rect.setCoords(topLeft.x, topLeft.y, botRight.x - topLeft.x, botRight.y - topLeft.y);
	}

	/**
	 *  Update the arrow position.
	 */
	updateArrowPosition(camera: Camera) {
		this.arrowPosition = Manager.GL.toScreenPosition(this.mesh.position, camera.getThreeCamera());
	}

	/**
	 *  Update current status animation.
	 *  @param {Core.Status} previousFirst - The previous status animation.
	 */
	updateAnimationStatus(previousFirst: Status = undefined) {
		const status = this.player.status[0];
		if (previousFirst != status) {
			if (status) {
				this.currentStatusAnimation = new Animation(status.system.animationID.getValue(), true);
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
			const texture = Manager.GL.getMaterialTexture(<MeshPhongMaterial>this.mesh.material);
			const textureWidth = texture.image.width;
			const textureHeight = texture.image.height;
			let frame = 0;
			switch (this.step) {
				case BATTLER_STEP.ATTACK:
				case BATTLER_STEP.SKILL:
				case BATTLER_STEP.ITEM:
					frame = this.frameAttacking.value;
					break;
				default:
					frame = this.frame.value;
					break;
			}
			const w = (this.width * Datas.Systems.SQUARE_SIZE) / textureWidth;
			const h = (this.height * Datas.Systems.SQUARE_SIZE) / textureHeight;
			const x = frame * w;
			const y = this.step * h;

			// Update geometry
			const texA = new THREE.Vector2();
			const texB = new THREE.Vector2();
			const texC = new THREE.Vector2();
			const texD = new THREE.Vector2();
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
		const status = this.player.addStatus(id);
		this.updateStatusStep();
		return status;
	}

	/**
	 *  Remove the status.
	 *  @param {number} id - The status id to remove
	 *  @returns {Core.Status}
	 */
	removeStatus(id: number): Status {
		const status = this.player.removeStatus(id);
		this.updateStatusStep();
		return status;
	}

	/**
	 *  Update status step (first priority status displayed).
	 */
	updateStatusStep() {
		// Update step if changed
		let step = BATTLER_STEP.NORMAL;
		const s = this.player.status[0];
		if (s) {
			step = s.system.battlerPosition.getValue();
		}
		if (this.step !== step) {
			this.step = step;
			this.updateUVs();
		}
	}

	updateHidden(hidden: boolean) {
		this.hidden = hidden;
		if (this.hidden) {
			this.removeFromScene();
		} else {
			this.addToScene();
		}
	}

	/**
	 *  Draw the arrow to select this battler.
	 */
	drawArrow() {
		if (!this.hidden) {
			Datas.Systems.getCurrentWindowSkin().drawArrowTarget(
				this.frameArrow.value,
				this.arrowPosition.x,
				this.arrowPosition.y,
				false
			);
		}
	}

	/**
	 *  Draw the damages on top of the battler.
	 */
	drawDamages() {
		const zoom = this.timeDamage / Battler.TOTAL_TIME_DAMAGE;
		const [x, height] = Datas.Systems.getCurrentWindowSkin().drawDamages(
			this.damages,
			this.damagePosition.x,
			this.damagePosition.y,
			this.isDamagesCritical,
			this.isDamagesMiss,
			zoom
		);
		if (this.damagesName && this.damages && !this.isDamagesMiss) {
			this.graphicDamageName.setText(this.damagesName);
			this.graphicDamageName.zoom = zoom;
			this.graphicDamageName.draw(x, this.damagePosition.y, this.graphicDamageName.textWidth * zoom, height);
		}
	}

	/**
	 *  Draw the status on top of the battler.
	 */
	drawStatus() {
		Status.drawList(this.player.getFirstStatus(), this.damagePosition.x, this.damagePosition.y, ALIGN.CENTER);
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

export { Battler };
