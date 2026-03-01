/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Data, Graphic, Manager, Model, Scene } from '..';
import {
	BATTLE_STEP,
	CHARACTER_KIND,
	MAP_TRANSITION_KIND,
	STATUS_RESTRICTIONS_KIND,
	TARGET_KIND,
	TROOP_REACTION_FREQUENCY_KIND,
} from '../Common';
import { Animation, Battler, Camera, Game, Item, Player, ReactionInterpreter, WindowBox, WindowChoices } from '../Core';
import { Map } from './Map';

/** @class
 *  A scene for battling.
 *  @extends SceneGame
 *  @param {number} troopID - Current troop ID that the allies are fighting
 *  @param {boolean} canGameOver - Indicate if there is a win/lose node or not
 *  @param {boolean} canEscape - Indicate if the player can escape this battle
 *  @param {SystemBattleMap} battleMap - The System battle map
 *  @param {MAP_TRANSITION_KIND} transitionStart - The kind of transition for
 *  the battle start
 *  @param {MAP_TRANSITION_KIND} transitionEnd - The kind of transition for the
 *  battle end
 *  @param {SystemColor} transitionStartColor - The System color for start
 *  transition
 *  @param {SystemColor} transitionEndColor - The System color for end
 *  transition
 */
class Battle extends Map {
	public static TRANSITION_ZOOM_TIME = 500;
	public static TRANSITION_COLOR_VALUE = 0.1;
	public static TRANSITION_COLOR_END_WAIT = 600;
	public static TIME_END_WAIT = 1000;
	public static TIME_PROGRESSION_XP = 3000;
	public static TIME_LINEAR_MUSIC_END = 500;
	public static TIME_LINEAR_MUSIC_START = 500;
	public static TIME_ACTION_ANIMATION = 2000;
	public static TIME_ACTION_NO_ANIMATION = 400;
	public static CAMERA_TICK = 0.05;
	public static CAMERA_OFFSET = 3;
	public static START_CAMERA_DISTANCE = 10;
	public static WINDOW_PROFILE_WIDTH = 300;
	public static WINDOW_PROFILE_HEIGHT = 136;
	public static COMMANDS_NUMBER = 6;
	public static WINDOW_COMMANDS_WIDTH = 150;
	public static WINDOW_COMMANDS_SELECT_X = 25;
	public static WINDOW_COMMANDS_SELECT_Y = 100;
	public static WINDOW_COMMANDS_SELECT_WIDTH = 200;
	public static WINDOW_DESCRIPTIONS_X = 385;
	public static WINDOW_DESCRIPTIONS_Y = 100;
	public static WINDOW_DESCRIPTIONS_WIDTH = 360;
	public static WINDOW_DESCRIPTIONS_HEIGHT = 200;
	public static WINDOW_EXPERIENCE_X = 10;
	public static WINDOW_EXPERIENCE_Y = 80;
	public static WINDOW_EXPERIENCE_WIDTH = 300;
	public static WINDOW_EXPERIENCE_HEIGHT = 90;
	public static WINDOW_STATS_X = 250;
	public static WINDOW_STATS_Y = 90;
	public static WINDOW_STATS_WIDTH = 380;
	public static WINDOW_STATS_HEIGHT = 200;
	public static escapedLastBattle = false;

	// Battle steps
	public battleInitialize: Scene.BattleInitialize;
	public battleStartTurn: Scene.BattleStartTurn;
	public battleSelection: Scene.BattleSelection;
	public battleAnimation: Scene.BattleAnimation;
	public battleEnemyAttack: Scene.BattleEnemyAttack;
	public battleEndTurn: Scene.BattleEndTurn;
	public battleVictory: Scene.BattleVictory;

	// Flags
	public troop: Model.Troop;
	public canGameOver: boolean;
	public canEscape: boolean;
	public winning: boolean;
	public loadingStep: boolean;
	public finishedXP: boolean;
	public all: boolean;
	public userTarget: boolean;
	public forceEndBattle: boolean;
	public forceAnAction: boolean;
	public forceAnActionUseTurn: boolean;

	//Selection
	public kindSelection: CHARACTER_KIND;
	public selectedUserIndex: number;
	public selectedTargetIndex: number;
	public skill: Model.CommonSkillItem;

	//Lists
	public listSkills: Graphic.Skill[];
	public listItems: Graphic.Item[];
	public effects: Model.Effect[];
	public previousEffects: Model.Effect[];

	//Battle Information
	public graphicPlayers: Graphic.Player[][];
	public graphicRewardTop: Graphic.RewardsTop;
	public battlers: Battler[][];
	public players: Player[][];
	public time: number;
	public timeEnemyAttack: number;
	public turn: number;
	public currentSkill: Model.Skill;
	public informationText: string;
	public previousInformationText: string;
	public oneTimeTroopReactions: boolean[] = [];

	//Animation
	public animationUser: Animation;
	public animationTarget: Animation;
	public action: Model.MonsterAction;

	//Transition
	public transitionStart: MAP_TRANSITION_KIND;
	public transitionStartColor: Model.Color;
	public transitionEnd: MAP_TRANSITION_KIND;
	public transitionEndColor: Model.Color;
	public transitionColorAlpha: number;
	public transitionColor: boolean;
	/**Whether to zoom during a transition */
	public transitionZoom: boolean;
	/**Indicate whether the transition has ended */
	public transitionEnded: boolean;
	/** Time Transition time */
	public timeTransition: number;

	//Step
	/**What step (initialization, animation, selection, victory) of battle the game is on */
	public step: number;
	public subStep: number;
	public previousStep: number;
	public previousSubStep: number;
	public indexTroopReaction: number;
	public interpreterTroopReaction: ReactionInterpreter;

	public mapCameraDistance: number;
	public actionDoNothing: Model.MonsterAction;

	//Camera
	public cameraStep: number;
	public cameraTick: number;
	public cameraON: boolean;
	public cameraDistance: number;
	public cameraOffset: number;

	//Windows
	public windowTopInformations: WindowBox;
	public windowTargetInformations: WindowBox;
	public windowUserInformations: WindowBox;
	public windowChoicesBattleCommands: WindowChoices;
	public windowChoicesSkills: WindowChoices;
	public windowChoicesItems: WindowChoices;
	public windowSkillDescription: WindowBox;
	public windowItemDescription: WindowBox;
	public windowExperienceProgression: WindowBox;
	public windowStatisticProgression: WindowBox;
	public windowLoots: WindowBox;

	// Musics
	public musicMap: Model.PlaySong;
	public musicMapTime: number;

	public sceneMap: Scene.Map;
	public loots: Record<string, Item>[];
	public currencies: Record<string, any>;
	public xp: number;
	public battleMap: Model.BattleMap;
	public currentEffectIndex: number;
	public previousCurrentEffectIndex: number;
	public currentTargetIndex: number;
	public priorityIndex: number;
	public lootsNumber: number;

	//Attack
	public attackSkill: Model.Skill;
	public attackingGroup: CHARACTER_KIND;

	constructor(
		troopID: number,
		canGameOver: boolean,
		canEscape: boolean,
		battleMap: Model.BattleMap,
		transitionStart: number,
		transitionEnd: number,
		transitionStartColor: Model.Color,
		transitionEndColor: Model.Color,
	) {
		super(battleMap.idMap, true);

		// Battle Handlers
		this.battleInitialize = new Scene.BattleInitialize(this);
		this.battleStartTurn = new Scene.BattleStartTurn(this);
		this.battleSelection = new Scene.BattleSelection(this);
		this.battleAnimation = new Scene.BattleAnimation(this);
		this.battleEnemyAttack = new Scene.BattleEnemyAttack(this);
		this.battleEndTurn = new Scene.BattleEndTurn(this);
		this.battleVictory = new Scene.BattleVictory(this);

		// ====
		this.troop = Data.Troops.get(troopID);
		this.canGameOver = canGameOver;
		this.canEscape = canEscape;
		this.transitionStart = transitionStart;
		this.transitionEnd = transitionEnd;
		this.transitionStartColor = transitionStartColor;
		this.transitionEndColor = transitionEndColor;
		this.transitionColor = transitionStart === MAP_TRANSITION_KIND.FADE;
		this.transitionColorAlpha = 0;
		this.step = BATTLE_STEP.INITIALIZE;
		this.indexTroopReaction = 0;
		this.interpreterTroopReaction = null;
		this.sceneMap = <Scene.Map>Manager.Stack.top;
		if (this.sceneMap) {
			this.mapCameraDistance = this.sceneMap.camera.distance;
		}
		this.actionDoNothing = new Model.MonsterAction({});
		this.skill = null;
	}

	/**
	 *  Load async stuff.
	 */
	async load() {
		await super.load();
		this.initialize();
		Manager.Stack.requestPaintHUD = true;
		this.loading = false;
	}

	/**
	 *  Get all the possible targets of a skill.
	 *  @param {TARGET_KIND} targetKind
	 *  @returns {Player[]}
	 */
	getPossibleTargets(targetKind: TARGET_KIND): Player[] {
		if (targetKind === TARGET_KIND.USER) {
			return [this.user.player];
		} else if (targetKind === TARGET_KIND.NONE) {
			return [];
		} else {
			return this.battlers[
				(targetKind === TARGET_KIND.ALLY || targetKind === TARGET_KIND.ALL_ALLIES) &&
				this.attackingGroup === CHARACTER_KIND.HERO
					? CHARACTER_KIND.HERO
					: CHARACTER_KIND.MONSTER
			].map((battler) => {
				return battler.player;
			});
		}
	}

	/**
	 *  Initialize and correct some camera settings for the battle start
	 */
	initializeCamera() {
		this.camera = new Camera(this.mapProperties.cameraProperties, Game.current.heroBattle);
		this.cameraStep = 0;
		this.cameraTick = Scene.Battle.CAMERA_TICK;
		this.cameraOffset = Battle.CAMERA_OFFSET;
		this.cameraON = this.transitionStart !== MAP_TRANSITION_KIND.ZOOM;
		this.cameraDistance = this.camera.distance;
		this.transitionZoom = false;
		if (!this.cameraON) {
			this.camera.distance = Battle.START_CAMERA_DISTANCE;
			this.transitionZoom = true;
		}
		this.camera.update();
	}

	/**
	 *  Make the attacking group all actives.
	 */
	activeGroup() {
		for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++) {
			this.battlers[this.attackingGroup][i].setActive(true);
		}
	}

	/**
	 *  Check if a player is defined (active and not dead).
	 *  @param {CHARACTER_KIND} kind - Kind of player
	 *  @param {number} index - Index in the group
	 *  @param {boolean} target - Indicate if the player is a target
	 *  @returns {boolean}
	 */
	isDefined(kind: CHARACTER_KIND, index: number, target?: boolean): boolean {
		const battler = this.battlers[kind][index];
		if (target) {
			return !battler.hidden && (!this.skill || this.skill.isPossible(battler.player));
		}
		return (
			battler.active &&
			!battler.player.isDead() &&
			!battler.hidden &&
			!battler.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_DO_ANYTHING) &&
			!battler.containsRestriction(STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ALLY) &&
			!battler.containsRestriction(STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_ENEMY) &&
			!battler.containsRestriction(STATUS_RESTRICTIONS_KIND.ATTACK_RANDOM_TARGET)
		);
	}

	/**
	 *  Check if all the heroes or enemies are inactive.
	 *  @returns {boolean}
	 */
	isEndTurn(): boolean {
		for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++) {
			if (this.isDefined(this.attackingGroup, i)) {
				return false;
			}
		}
		return true;
	}

	/**
	 *  Check if all the heroes or enemies are dead or hidden.
	 *  @param {CHARACTER_KIND} group - Kind of player
	 *  @returns {boolean}
	 */
	isGroupDeadHidden(group: CHARACTER_KIND): boolean {
		for (const battler of this.battlers[group]) {
			if (!battler.player.isDead() && !battler.hidden) {
				return false;
			}
		}
		return true;
	}

	/**
	 *  Check if all the enemies are dead.
	 *  @returns {boolean}
	 */
	isWin(): boolean {
		return this.isGroupDeadHidden(CHARACTER_KIND.MONSTER);
	}

	/**
	 *  Check if all the heroes are dead.
	 *  @returns {boolean}
	 */
	isLose(): boolean {
		return this.isGroupDeadHidden(CHARACTER_KIND.HERO);
	}

	/**
	 *  Transition to game over scene.
	 */
	gameOver() {
		if (this.canGameOver) {
			Manager.Stack.popAll();
			Manager.Stack.pushGameOver();
		}
	}

	/**
	 *  Win the battle.
	 */
	win() {
		this.endBattle();
	}

	/**
	 *  Win the battle.
	 */
	endBattle() {
		// Heroes
		for (const battler of this.battlers[CHARACTER_KIND.HERO]) {
			battler.removeFromScene();
		}
		Manager.Stack.pop();
		Scene.Map.current = <Scene.Map>Manager.Stack.top;
		Game.current.battles++;
	}

	/**
	 *  Switch attacking group.
	 */
	switchAttackingGroup() {
		// Switching group
		if (this.attackingGroup === CHARACTER_KIND.HERO) {
			this.attackingGroup = CHARACTER_KIND.MONSTER;
		} else {
			this.turn++;
			this.attackingGroup = CHARACTER_KIND.HERO;
		}

		// Updating status turn
		for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++) {
			this.battlers[this.attackingGroup][i].player.updateStatusTurn();
		}
	}

	/**
	 *  Change the step of the battle.
	 *  @param {BATTLE_STEP} i - Step of the battle
	 */
	changeStep(i: BATTLE_STEP) {
		this.step = i;
		this.subStep = 0;
		this.initialize();
	}

	/**
	 *  Initialize the current step.
	 */
	initialize() {
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				this.battleInitialize.initialize();
				break;
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.initialize();
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.initialize();
				break;
			case BATTLE_STEP.ANIMATION:
				this.battleAnimation.initialize();
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				this.battleEnemyAttack.initialize();
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.initialize();
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.initialize();
				break;
		}
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Update battle according to step.
	 */
	update() {
		if (this.forceEndBattle) {
			this.winning = false;
			this.changeStep(BATTLE_STEP.VICTORY);
			this.forceEndBattle = false;
		}

		super.update();

		// Y angle
		const vector = new THREE.Vector3();
		this.camera.getThreeCamera().getWorldDirection(vector);
		const angle = Math.atan2(vector.x, vector.z) + (180 * Math.PI) / 180.0;

		// Heroes
		let battlers = this.battlers[CHARACTER_KIND.HERO];
		let i: number, l: number;
		for (i = 0, l = battlers.length; i < l; i++) {
			battlers[i].update(angle);
		}
		// Ennemies
		battlers = this.battlers[CHARACTER_KIND.MONSTER];
		for (i = 0, l = battlers.length; i < l; i++) {
			battlers[i].update(angle);
		}

		// Camera temp code for moving
		this.moveStandardCamera();

		// Reaction troop always frequency
		if (this.interpreterTroopReaction === null) {
			let reaction: Model.TroopReaction;
			for (l = this.troop.reactions.length; this.indexTroopReaction < l; this.indexTroopReaction++) {
				reaction = this.troop.reactions[this.indexTroopReaction];
				if (
					reaction.frequency === TROOP_REACTION_FREQUENCY_KIND.ALWAYS ||
					(reaction.frequency === TROOP_REACTION_FREQUENCY_KIND.ONE_TIME &&
						!this.oneTimeTroopReactions[reaction.id])
				) {
					// Check conditions
					if (!reaction.conditions.isValid()) {
						continue;
					}
					if (reaction.frequency === TROOP_REACTION_FREQUENCY_KIND.ONE_TIME) {
						this.oneTimeTroopReactions[reaction.id] = true;
					}
					this.interpreterTroopReaction = new ReactionInterpreter(null, reaction, null, null);
					break;
				}
			}
		}
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.update();
			if (this.interpreterTroopReaction.isFinished()) {
				this.indexTroopReaction++;
				this.interpreterTroopReaction = null;
			}
		}
		if (this.indexTroopReaction >= l) {
			this.indexTroopReaction = 0;
		}
		if (this.interpreterTroopReaction) {
			return;
		}

		// Update according to step
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				this.battleInitialize.update();
				break;
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.update();
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.update();
				break;
			case BATTLE_STEP.ANIMATION:
				this.battleAnimation.update();
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				this.battleEnemyAttack.update();
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.update();
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.update();
				break;
		}
	}

	/**
	 *  Do camera standard moves.
	 */
	moveStandardCamera() {
		if (Data.BattleSystems.cameraMoveInBattle && this.cameraON) {
			switch (this.cameraStep) {
				case 0:
					this.camera.distance -= this.cameraTick;
					this.camera.targetOffset.x += this.cameraTick;
					if (this.camera.distance <= this.cameraDistance - this.cameraOffset) {
						this.camera.distance = this.cameraDistance - this.cameraOffset;
						this.camera.targetOffset.x = this.cameraOffset;
						this.cameraStep = 1;
					}
					break;
				case 1:
					this.camera.distance += this.cameraTick;
					if (this.camera.distance >= this.cameraDistance + this.cameraOffset) {
						this.camera.distance = this.cameraDistance + this.cameraOffset;
						this.cameraStep = 2;
					}
					break;
				case 2:
					this.camera.distance -= this.cameraTick;
					this.camera.targetOffset.x -= this.cameraTick;
					if (this.camera.distance <= this.cameraDistance - this.cameraOffset) {
						this.camera.distance = this.cameraDistance - this.cameraOffset;
						this.camera.targetOffset.x = -this.cameraOffset;
						this.cameraStep = 3;
					}
					break;
				case 3:
					this.camera.distance += this.cameraTick;
					if (this.camera.distance >= this.cameraDistance + this.cameraOffset) {
						this.camera.distance = this.cameraDistance + this.cameraOffset;
						this.cameraStep = 4;
					}
					break;
				case 4:
					this.camera.distance -= this.cameraTick;
					this.camera.targetOffset.x += this.cameraTick;
					if (this.camera.distance <= this.cameraDistance) {
						this.camera.distance = this.cameraDistance;
						this.camera.targetOffset.x = 0;
						this.cameraStep = 0;
					}
					break;
			}
		}
	}

	/**
	 *  Handle battle key pressed according to step.
	 *  @param {number} key - The key ID
	 */
	onKeyPressed(key: string) {
		super.onKeyPressed(key);
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.onKeyPressed(key);
			return;
		}
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				this.battleInitialize.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.ANIMATION:
				this.battleAnimation.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				this.battleEnemyAttack.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.onKeyPressedStep(key);
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.onKeyPressedStep(key);
				break;
		}
	}

	/**
	 *  Handle battle key released according to step.
	 *  @param {number} key - The key ID
	 */
	onKeyReleased(key: string) {
		super.onKeyReleased(key);
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.onKeyReleased(key);
			return;
		}
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				this.battleInitialize.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.ANIMATION:
				this.battleAnimation.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				this.battleEnemyAttack.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.onKeyReleasedStep(key);
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.onKeyReleasedStep(key);
				break;
		}
	}

	/**
	 *  Handle battle key pressed repeat according to step.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeat(key: string): boolean {
		let res = super.onKeyPressedRepeat(key);
		if (this.interpreterTroopReaction) {
			return res && this.interpreterTroopReaction.onKeyPressedRepeat(key);
		}
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				res = res && this.battleInitialize.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.START_TURN:
				res = res && this.battleStartTurn.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.SELECTION:
				res = res && this.battleSelection.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.ANIMATION:
				res = res && this.battleAnimation.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				res = res && this.battleEnemyAttack.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.END_TURN:
				res = res && this.battleEndTurn.onKeyPressedRepeatStep(key);
				break;
			case BATTLE_STEP.VICTORY:
				res = res && this.battleVictory.onKeyPressedRepeatStep(key);
				break;
		}
		return res;
	}

	/**
	 *  Handle battle key pressed and repeat according to step.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		let res = super.onKeyPressedAndRepeat(key);
		if (this.interpreterTroopReaction) {
			return res && this.interpreterTroopReaction.onKeyPressedAndRepeat(key);
		}
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				res = res && this.battleInitialize.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.START_TURN:
				res = res && this.battleStartTurn.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.SELECTION:
				res = res && this.battleSelection.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.ANIMATION:
				res = res && this.battleAnimation.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				res = res && this.battleEnemyAttack.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.END_TURN:
				res = res && this.battleEndTurn.onKeyPressedAndRepeatStep(key);
				break;
			case BATTLE_STEP.VICTORY:
				res = res && this.battleVictory.onKeyPressedAndRepeatStep(key);
				break;
		}
		return res;
	}

	/**
	 *  @inheritdoc
	 */
	onMouseDown(x: number, y: number) {
		super.onMouseDown(x, y);
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.onMouseDown(x, y);
			return;
		}
		switch (this.step) {
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.onMouseDownStep(x, y);
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.onMouseDownStep(x, y);
				break;
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMove(x: number, y: number) {
		super.onMouseMove(x, y);
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.onMouseMove(x, y);
			return;
		}
		switch (this.step) {
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.onMouseMoveStep(x, y);
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.onMouseMoveStep(x, y);
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.onMouseMoveStep(x, y);
				break;
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(x: number, y: number) {
		super.onMouseUp(x, y);
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.onMouseUp(x, y);
			return;
		}
		switch (this.step) {
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.onMouseUpStep(x, y);
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.onMouseUpStep(x, y);
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.onMouseUpStep(x, y);
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.onMouseUpStep(x, y);
				break;
		}
	}

	/**
	 *  Draw the battle 3D scene.
	 */
	draw3D() {
		if (this.transitionZoom || this.transitionColor) {
			this.sceneMap.draw3D();
		} else {
			super.draw3D();
		}
	}

	/**
	 *  Draw the battle HUD according to step.
	 */
	drawHUD() {
		// Draw all battlers special HUD
		let i: number, l: number;
		for (i = 0, l = this.battlers[CHARACTER_KIND.HERO].length; i < l; i++) {
			this.battlers[CHARACTER_KIND.HERO][i].drawHUD();
		}
		for (i = 0, l = this.battlers[CHARACTER_KIND.MONSTER].length; i < l; i++) {
			this.battlers[CHARACTER_KIND.MONSTER][i].drawHUD();
		}

		// Draw HUD according to step
		switch (this.step) {
			case BATTLE_STEP.INITIALIZE:
				this.battleInitialize.drawHUDStep();
				break;
			case BATTLE_STEP.START_TURN:
				this.battleStartTurn.drawHUDStep();
				break;
			case BATTLE_STEP.SELECTION:
				this.battleSelection.drawHUDStep();
				break;
			case BATTLE_STEP.ANIMATION:
				this.battleAnimation.drawHUDStep();
				break;
			case BATTLE_STEP.ENEMY_ATTACK:
				this.battleEnemyAttack.drawHUDStep();
				break;
			case BATTLE_STEP.END_TURN:
				this.battleEndTurn.drawHUDStep();
				break;
			case BATTLE_STEP.VICTORY:
				this.battleVictory.drawHUDStep();
				break;
		}
		if (this.interpreterTroopReaction) {
			this.interpreterTroopReaction.drawHUD();
		}
		super.drawHUD();
	}
}

export { Battle };
