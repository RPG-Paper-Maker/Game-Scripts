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
	Constants,
	EFFECT_SPECIAL_ACTION_KIND,
	MAP_TRANSITION_KIND,
	STATUS_RESTRICTIONS_KIND,
	TARGET_KIND,
	TROOP_REACTION_FREQUENCY_KIND,
} from '../Common';
import { Animation, Battler, Camera, Game, Item, Player, ReactionInterpreter, WindowBox, WindowChoices } from '../Core';
import { Map } from './Map';

/** State saved before a forced action, restored once the action is done. */
type BattleForcedAction = {
	useTurn: boolean;
	step: number;
	subStep: number;
	currentEffectIndex: number;
	currentTargetIndex: number;
	effects: Model.Effect[];
	informationText: string;
	time: number;
	user: Battler;
	targets: Battler[];
	skill: Model.CommonSkillItem;
	currentSkill: Model.Skill;
	action: Model.MonsterAction;
	battleCommandKind: EFFECT_SPECIAL_ACTION_KIND;
	animationUser: Animation;
	animationTarget: Animation;
	animationState: Record<string, any>;
};

/** Troop reactions of some frequencies run one after the other before calling back. */
type BattleTroopReactionRunner = {
	frequencies: TROOP_REACTION_FREQUENCY_KIND[];
	index: number;
	interpreter: ReactionInterpreter;
	step: number;
	callback: () => void;
};

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
	public static CAMERA_TICK = 0.05 / Constants.BASIC_SQUARE_SIZE;
	public static CAMERA_OFFSET = 3 / Constants.BASIC_SQUARE_SIZE;
	public static START_CAMERA_DISTANCE = 10 / Constants.BASIC_SQUARE_SIZE;
	public static COMMANDS_NUMBER = 6;
	public static WINDOW_COMMANDS_WIDTH = 300;
	public static WINDOW_COMMANDS_SELECT_X = 50;
	public static WINDOW_COMMANDS_SELECT_Y = 150;
	public static WINDOW_COMMANDS_SELECT_WIDTH = 400;
	public static WINDOW_DESCRIPTIONS_X = 770;
	public static WINDOW_DESCRIPTIONS_Y = 150;
	public static WINDOW_DESCRIPTIONS_WIDTH = 720;
	public static WINDOW_DESCRIPTIONS_HEIGHT = 300;
	public static WINDOW_EXPERIENCE_X = 20;
	public static WINDOW_EXPERIENCE_Y = 120;
	public static WINDOW_EXPERIENCE_WIDTH = 500;
	public static WINDOW_STATS_X = 535;
	public static WINDOW_STATS_Y = 135;
	public static WINDOW_STATS_WIDTH = 725;
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
	public forcedActions: BattleForcedAction[] = [];
	public battlerTurnStartedUser: Battler = null;

	//Selection
	public kindSelection: CHARACTER_KIND;
	public selectedUserIndex: number;
	public selectedTargetIndex: number;
	public skill: Model.CommonSkillItem;

	//Lists
	public listSkills: Graphic.Skill[];
	public listItems: Graphic.Item[];
	public effects: Model.Effect[];

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
	public indexTroopReaction: number;
	public interpreterTroopReaction: ReactionInterpreter;
	public troopReactionRunners: BattleTroopReactionRunner[] = [];

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
		await Promise.resolve();
		this.battleInitialize.initializeMusic();
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
			return this.user ? [this.user.player] : [];
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
			const hasTargetFormula = this.skill && this.skill.targetConditionFormula.getValue() !== null;
			if (!hasTargetFormula && battler.player.isDead()) {
				return false;
			}
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
	 *  Indicate if a forced action is currently in progress.
	 *  @returns {boolean}
	 */
	get forceAnAction(): boolean {
		return this.forcedActions.length > 0;
	}

	/**
	 *  Indicate if the current forced action uses the battler turn.
	 *  @returns {boolean}
	 */
	get forceAnActionUseTurn(): boolean {
		return this.forceAnAction && this.forcedActions[this.forcedActions.length - 1].useTurn;
	}

	/**
	 *  Save the current battle state before starting a forced action.
	 *  @param {boolean} useTurn - Indicate if the forced action uses the battler turn
	 *  @returns {BattleForcedAction}
	 */
	pushForcedAction(useTurn: boolean): BattleForcedAction {
		const forcedAction: BattleForcedAction = {
			useTurn: useTurn,
			step: this.step,
			subStep: this.subStep,
			currentEffectIndex: this.currentEffectIndex,
			currentTargetIndex: this.currentTargetIndex,
			effects: this.effects,
			informationText: this.informationText,
			time: this.time,
			user: this.user,
			targets: this.targets,
			skill: this.skill,
			currentSkill: this.currentSkill,
			action: this.action,
			battleCommandKind: this.battleCommandKind,
			animationUser: this.animationUser,
			animationTarget: this.animationTarget,
			animationState: this.battleAnimation.getState(),
		};
		this.forcedActions.push(forcedAction);
		return forcedAction;
	}

	/**
	 *  Restore the battle state saved before the last forced action.
	 */
	popForcedAction() {
		const forcedAction = this.forcedActions.pop();
		if (!forcedAction) {
			return;
		}
		this.step = forcedAction.step;
		this.subStep = forcedAction.subStep;
		this.currentEffectIndex = forcedAction.currentEffectIndex;
		this.currentTargetIndex = forcedAction.currentTargetIndex;
		this.effects = forcedAction.effects;
		this.informationText = forcedAction.informationText;
		this.time = forcedAction.time;
		this.user = forcedAction.user;
		this.targets = forcedAction.targets;
		this.skill = forcedAction.skill;
		this.currentSkill = forcedAction.currentSkill;
		this.action = forcedAction.action;
		this.battleCommandKind = forcedAction.battleCommandKind;
		this.animationUser = forcedAction.animationUser;
		this.animationTarget = forcedAction.animationTarget;
		this.battleAnimation.setState(forcedAction.animationState);
		(<Graphic.Text>this.windowTopInformations.content).setText(this.informationText);
	}

	/**
	 *  Check if an interpreter is waiting for one of its forced actions to be done.
	 *  @param {ReactionInterpreter} interpreter - The interpreter
	 *  @returns {boolean}
	 */
	isWaitingForcedAction(interpreter: ReactionInterpreter): boolean {
		const forcedAction = interpreter?.currentCommandState?.forcedAction;
		return !!forcedAction && this.forcedActions.includes(forcedAction);
	}

	/**
	 *  Get the frequencies of troop reactions triggered at the start or end of the current phase.
	 *  @param {boolean} begin - Indicate if this is the start of the phase
	 *  @returns {TROOP_REACTION_FREQUENCY_KIND[]}
	 */
	getPhaseFrequencies(begin: boolean): TROOP_REACTION_FREQUENCY_KIND[] {
		const isHero = this.attackingGroup === CHARACTER_KIND.HERO;
		if (begin) {
			return isHero
				? [
						TROOP_REACTION_FREQUENCY_KIND.EACH_PHASE_BEGIN,
						TROOP_REACTION_FREQUENCY_KIND.EACH_ROUND_BEGIN,
						TROOP_REACTION_FREQUENCY_KIND.EACH_ALLY_PHASE_BEGIN,
					]
				: [TROOP_REACTION_FREQUENCY_KIND.EACH_PHASE_BEGIN, TROOP_REACTION_FREQUENCY_KIND.EACH_ENEMY_PHASE_BEGIN];
		}
		return isHero
			? [TROOP_REACTION_FREQUENCY_KIND.EACH_PHASE_END, TROOP_REACTION_FREQUENCY_KIND.EACH_ALLY_PHASE_END]
			: [
					TROOP_REACTION_FREQUENCY_KIND.EACH_PHASE_END,
					TROOP_REACTION_FREQUENCY_KIND.EACH_ENEMY_PHASE_END,
					TROOP_REACTION_FREQUENCY_KIND.EACH_ROUND_END,
				];
	}

	/**
	 *  Get the frequencies of troop reactions triggered at the start or end of a battler turn.
	 *  @param {Battler} battler - The battler
	 *  @param {boolean} begin - Indicate if this is the start of the turn
	 *  @returns {TROOP_REACTION_FREQUENCY_KIND[]}
	 */
	getBattlerTurnFrequencies(battler: Battler, begin: boolean): TROOP_REACTION_FREQUENCY_KIND[] {
		const isHero = battler.player.kind === CHARACTER_KIND.HERO;
		if (begin) {
			return [
				TROOP_REACTION_FREQUENCY_KIND.EACH_TURN_BEGIN,
				isHero
					? TROOP_REACTION_FREQUENCY_KIND.EACH_ALLY_TURN_BEGIN
					: TROOP_REACTION_FREQUENCY_KIND.EACH_ENEMY_TURN_BEGIN,
			];
		}
		return [
			TROOP_REACTION_FREQUENCY_KIND.EACH_TURN_END,
			isHero ? TROOP_REACTION_FREQUENCY_KIND.EACH_ALLY_TURN_END : TROOP_REACTION_FREQUENCY_KIND.EACH_ENEMY_TURN_END,
		];
	}

	/**
	 *  Run the valid troop reactions of some frequencies, then call back.
	 *  @param {TROOP_REACTION_FREQUENCY_KIND[]} frequencies - The frequencies
	 *  @param {() => void} callback - Called when all the reactions are finished
	 */
	runTroopReactions(frequencies: TROOP_REACTION_FREQUENCY_KIND[], callback: () => void) {
		const runner: BattleTroopReactionRunner = {
			frequencies: frequencies,
			index: 0,
			interpreter: null,
			step: this.step,
			callback: callback,
		};
		this.troopReactionRunners.push(runner);
		this.nextTroopReaction(runner);
	}

	/**
	 *  Start the next valid troop reaction of a runner, or call back if none.
	 *  @param {BattleTroopReactionRunner} runner - The runner
	 */
	nextTroopReaction(runner: BattleTroopReactionRunner) {
		const reactions = this.troop.reactions;
		for (const l = reactions.length; runner.index < l; runner.index++) {
			const reaction = reactions[runner.index];
			if (runner.frequencies.includes(reaction.frequency) && reaction.conditions.isValid()) {
				runner.index++;
				runner.interpreter = new ReactionInterpreter(null, reaction, null, null);
				return;
			}
		}
		runner.interpreter = null;
		const index = this.troopReactionRunners.indexOf(runner);
		if (index !== -1) {
			this.troopReactionRunners.splice(index, 1);
		}
		if (this.step === runner.step) {
			runner.callback();
		}
	}

	/**
	 *  Get the troop reaction interpreter receiving inputs.
	 *  @returns {ReactionInterpreter}
	 */
	getTroopReactionInterpreter(): ReactionInterpreter {
		const runner = this.troopReactionRunners[this.troopReactionRunners.length - 1];
		return runner ? runner.interpreter : this.interpreterTroopReaction;
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
			this.forcedActions = [];
			this.winning = false;
			this.changeStep(BATTLE_STEP.VICTORY);
			this.forceEndBattle = false;
		}

		super.update();

		if (Scene.Map.current !== this) {
			return;
		}

		if (
			(this.transitionZoom || this.transitionColor) &&
			Game.current !== null &&
			Game.current.hero.currentStateInstance
		) {
			const heroVector = new THREE.Vector3();
			this.sceneMap.camera.getThreeCamera().getWorldDirection(heroVector);
			Game.current.hero.updateAngle(Math.atan2(heroVector.x, heroVector.z) + Math.PI);
			if (Game.current.hero.currentStateInstance.setWithCamera) {
				const prevMap = Scene.Map.current;
				Scene.Map.current = this.sceneMap;
				Game.current.hero.updateOrientation();
				Game.current.hero.updateUVs();
				Scene.Map.current = prevMap;
			}
		}

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

		// Troop reactions triggered by phases and turns
		let runner = this.troopReactionRunners[this.troopReactionRunners.length - 1];
		if (runner && runner.interpreter) {
			runner.interpreter.update();
			if (runner.interpreter.isFinished()) {
				this.nextTroopReaction(runner);
			}
		}
		runner = this.troopReactionRunners[this.troopReactionRunners.length - 1];
		if (runner && !this.isWaitingForcedAction(runner.interpreter)) {
			return;
		}

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
		if (this.interpreterTroopReaction && !this.isWaitingForcedAction(this.interpreterTroopReaction)) {
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			interpreter.onKeyPressed(key);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			interpreter.onKeyReleased(key);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			return res && interpreter.onKeyPressedRepeat(key);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			return res && interpreter.onKeyPressedAndRepeat(key);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			interpreter.onMouseDown(x, y);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			interpreter.onMouseMove(x, y);
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
		const interpreter = this.getTroopReactionInterpreter();
		if (interpreter) {
			interpreter.onMouseUp(x, y);
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
		// Draw all battlers special HUD (skip during victory/defeat or start transition to hide status icons)
		let i: number, l: number;
		if (this.step !== BATTLE_STEP.VICTORY && !this.transitionZoom && !this.transitionColor) {
			for (i = 0, l = this.battlers[CHARACTER_KIND.HERO].length; i < l; i++) {
				this.battlers[CHARACTER_KIND.HERO][i].drawHUD();
			}
			for (i = 0, l = this.battlers[CHARACTER_KIND.MONSTER].length; i < l; i++) {
				this.battlers[CHARACTER_KIND.MONSTER][i].drawHUD();
			}
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
		for (const runner of this.troopReactionRunners) {
			runner.interpreter?.drawHUD();
		}
		super.drawHUD();
	}
}

export { Battle };
