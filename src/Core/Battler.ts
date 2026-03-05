/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import {
	ALIGN,
	ALIGN_VERTICAL,
	BATTLER_STEP,
	ELEMENT_MAP_KIND,
	Interpreter,
	STATUS_RESTRICTIONS_KIND,
} from '../Common';
import { ProgressionTable } from '../Model';
import { Data, Graphic, Manager, Scene } from '../index';
import { Animation } from './Animation';
import { Camera } from './Camera';
import { CustomGeometry } from './CustomGeometry';
import { Frame } from './Frame';
import { Player } from './Player';
import { Position } from './Position';
import { Rectangle } from './Rectangle';
import { Sprite } from './Sprite';
import { Status } from './Status';

/**
 * Represents a battler in battle (ally or enemy) including its mesh, animations, and HUD.
 */
export class Battler {
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
	public animationOffset = new THREE.Vector2();
	public rect: Rectangle = new Rectangle();
	public moving: boolean;
	public attacking: boolean;
	public damages: number;
	public damagesName: string;
	public graphicDamageName = new Graphic.Text('', { verticalAlign: ALIGN_VERTICAL.BOT });
	public isDamagesMiss: boolean;
	public isDamagesCritical: boolean;
	public tempIsDamagesMiss: boolean | null = null;
	public tempIsDamagesCritical: boolean | null = null;
	public currentStatusAnimation: Animation | null = null;
	public lastStatus: Status;
	public lastStatusHealed: Status;
	public lastTarget: Battler | null = null;
	public hidden = false;

	constructor(player: Player, isEnemy = false, position?: Position, vect?: THREE.Vector3, camera?: Camera) {
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
		this.initialize();
	}

	/**
	 * Initialize battler properties, frames, mesh, and positions.
	 * */
	initialize(): void {
		this.active = true;
		this.frame = new Frame(Interpreter.evaluate(Data.Systems.battlersFrameDuration) as number, {
			frames: Data.Systems.battlersFrames,
		});
		this.frameAttacking = new Frame(Interpreter.evaluate(Data.Systems.battlersFrameAttackingDuration) as number, {
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
			0,
		);
		this.progressionAllyBack = ProgressionTable.createFromNumbers(
			this.position.x - Battler.OFFSET_SELECTED,
			this.position.x,
			0,
		);
		this.progressionEnemyFront = ProgressionTable.createFromNumbers(
			this.position.x,
			this.position.x + Battler.OFFSET_SELECTED,
			0,
		);
		this.progressionEnemyBack = ProgressionTable.createFromNumbers(
			this.position.x + Battler.OFFSET_SELECTED,
			this.position.x,
			0,
		);
		this.timerMove = 0;
		this.timeDamage = Battler.TOTAL_TIME_DAMAGE;
		const idBattler = this.player.getBattlerID();
		if (idBattler === -1) {
			this.mesh = null;
		} else {
			// Copy original material because there will be individual color changes
			const originalMaterial = Data.Pictures.texturesBattlers.get(idBattler);
			const texture = Manager.GL.getMaterialTexture(originalMaterial);
			const copiedTexture = texture.clone();
			const material = Manager.GL.createMaterial({
				texture: copiedTexture,
				uniforms: {
					colorD: uniform(Manager.GL.screenTone.clone()),
					offset: uniform(this.animationOffset)
				},
			});
			const { width, height } = Manager.GL.getMaterialTextureSize(material);
			this.width = width / Data.Systems.SQUARE_SIZE / Data.Systems.battlersFrames;
			this.height = height / Data.Systems.SQUARE_SIZE / Data.Systems.battlersColumns;
			const sprite = Sprite.create(ELEMENT_MAP_KIND.SPRITES_FACE, new Rectangle(0, 0, this.width, this.height));
			const geometry = sprite.createGeometry(this.width, this.height, false, this.initialPosition)[0];
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.position.set(this.position.x, this.position.y, this.position.z);
			this.mesh.receiveShadow = true;
			this.mesh.castShadow = true;
			this.mesh.customDepthMaterial = material.userData.customDepthMaterial;
			this.topLeftPosition = new THREE.Vector3(
				this.position.x - (this.width / 2) * Data.Systems.SQUARE_SIZE,
				this.position.y + this.height * Data.Systems.SQUARE_SIZE,
				this.position.z,
			);
			this.botRightPosition = new THREE.Vector3(
				this.position.x + (this.width / 2) * Data.Systems.SQUARE_SIZE,
				this.position.y,
				this.position.z,
			);
			this.upPosition = new THREE.Vector3(
				this.position.x,
				this.position.y + this.height * Data.Systems.SQUARE_SIZE,
				this.position.z,
			);
			this.halfPosition = new THREE.Vector3(
				this.position.x,
				this.position.y + (this.height * Data.Systems.SQUARE_SIZE) / 2,
				this.position.z,
			);
			if (this.isEnemy) {
				this.mesh.scale.set(-1, 1, 1);
			}
			this.initializeTexture();
		}
		this.updateAnimationStatus();
	}

	/**
	 * Initialize UV mapping for the battler mesh.
	 * */
	initializeTexture(): void {
		const { width, height } = Manager.GL.getMaterialTextureSize(this.mesh.material as THREE.MeshPhongNodeMaterial);
		const w = (this.width * Data.Systems.SQUARE_SIZE) / width;
		const h = (this.height * Data.Systems.SQUARE_SIZE) / height;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, 0, 0, w, h);
		(this.mesh.geometry as CustomGeometry).pushQuadUVs(texA, texB, texC, texD);
		(this.mesh.geometry as CustomGeometry).updateUVs();
	}

	/**
	 *  Update the UVs coordinates according to frame and orientation.
	 */
	updateUVs() {
		if (this.mesh) {
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
			const { width, height } = Manager.GL.getMaterialTextureSize(this.mesh.material as THREE.MeshPhongNodeMaterial);
			const w = (this.width * Data.Systems.SQUARE_SIZE) / width;
			const h = (this.height * Data.Systems.SQUARE_SIZE) / height;
			const x = frame * w;
			const y = this.step * h;
			this.animationOffset.set(x, y);
		}
	}

	/**
	 * Check if the battler has a status restriction.
	 * */
	containsRestriction(restriction: STATUS_RESTRICTIONS_KIND): boolean {
		return this.player.status.some((status) => status.system.restrictionKind === restriction);
	}

	/**
	 *  Check if mouse coordinates are inside the battler.
	 */
	isInside(x: number, y: number): boolean {
		return this.rect.isInside(x, y);
	}

	/**
	 * Set battler selected state and reset timer for movement.
	 * */
	setSelected(selected: boolean) {
		if (this.selected !== selected) {
			this.selected = selected;
			this.timerMove = new Date().getTime();
		}
	}

	/**
	 * Set battler active state and update material screen tone.
	 */
	setActive(active: boolean) {
		this.active = active;
		const material = this.mesh.material as THREE.MeshPhongNodeMaterial;
		if (active) {
			material.userData.uniforms.colorD = uniform(Manager.GL.screenTone);
		} else {
			material.userData.uniforms.colorD = uniform(Manager.GL.screenTone.clone().subScalar(0.3));
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
	 */
	isStepAttacking(): boolean {
		return [BATTLER_STEP.ATTACK, BATTLER_STEP.SKILL, BATTLER_STEP.ITEM, BATTLER_STEP.ESCAPE].includes(this.step);
	}

	/**
	 *  Check if the battler is attacking and the frames is currently run.
	 */
	isAttacking(): boolean {
		return this.isStepAttacking() && this.frameAttacking.value !== Data.Systems.FRAMES - 1;
	}

	/**
	 *  Set battler step.
	 */
	updateStep(step: BATTLER_STEP): void {
		this.frameAttacking.value = 0;
		this.step = step;
		this.updateUVs();
	}

	/**
	 *  Set battler step as using a skill.
	 */
	setUsingSkill() {
		this.updateStep(BATTLER_STEP.SKILL);
	}

	/**
	 *  Set battler step as using an item.
	 */
	setUsingItem() {
		this.updateStep(BATTLER_STEP.ITEM);
	}

	/**
	 *  Set battler step as escaping.
	 */
	setEscaping() {
		this.updateStep(BATTLER_STEP.ESCAPE);
	}

	/**
	 *  Set battler step as victory.
	 */
	setVictory() {
		this.updateStep(BATTLER_STEP.VICTORY);
	}

	/**
	 *  Update battler step if is dead, attacked if attacked.
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
		const newX = progression.getProgressionAt(time, Battler.TIME_MOVE, true);
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
	 *  Update the arrow.
	 */
	updateArrow() {
		if (this.frameArrow.update()) {
			this.arrowPosition = Manager.GL.toScreenPosition(
				this.mesh.position,
				Scene.Map.current.camera.getThreeCamera(),
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
	 */
	updateAnimationStatus(previousFirst: Status = undefined) {
		const status = this.player.status[0];
		if (previousFirst != status) {
			if (status) {
				this.currentStatusAnimation = new Animation(
					status.system.animationID.getValue() as number as number,
					true,
				);
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
	 *  Add a new status and check if already in.
	 */
	addStatus(id: number): Status {
		const status = this.player.addStatus(id);
		this.updateStatusStep();
		return status;
	}

	/**
	 *  Remove the status.
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
		let step = BATTLER_STEP.NORMAL;
		const s = this.player.status[0];
		if (s) {
			step = s.system.battlerPosition.getValue() as number;
		}
		if (this.step !== step) {
			this.step = step;
			this.updateUVs();
		}
	}

	/**
	 *  Update hidden state.
	 */
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
			Data.Systems.getCurrentWindowSkin().drawArrowTarget(
				this.frameArrow.value,
				this.arrowPosition.x,
				this.arrowPosition.y,
				false,
			);
		}
	}

	/**
	 *  Draw the damages on top of the battler.
	 */
	drawDamages() {
		const zoom = this.timeDamage / Battler.TOTAL_TIME_DAMAGE;
		const [x, height] = Data.Systems.getCurrentWindowSkin().drawDamages(
			this.damages,
			this.damagePosition.x,
			this.damagePosition.y,
			this.isDamagesCritical,
			this.isDamagesMiss,
			zoom,
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
