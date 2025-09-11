/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Datas, Graphic, Manager, Model, Scene } from '..';
import {
	ALIGN,
	BATTLE_STEP,
	CHARACTER_KIND,
	Constants,
	EFFECT_SPECIAL_ACTION_KIND,
	Interpreter,
	MAP_TRANSITION_KIND,
	Platform,
	ScreenResolution,
	SONG_KIND,
} from '../Common';
import { Battler, Game, Player, Position, WindowBox, WindowChoices } from '../Core';

// -------------------------------------------------------
//
//  CLASS Battle
//
//  Step 0 : Initialization of the battle, camera movment (transition),
//  allies/ennemies comming.
//
// -------------------------------------------------------

class BattleInitialize {
	public battle: Scene.Battle;

	constructor(battle: Scene.Battle) {
		this.battle = battle;
	}

	/**
	 *  Initialize step.
	 */
	initialize() {
		Scene.Battle.escapedLastBattle = false;
		this.battle.winning = false;
		this.battle.kindSelection = CHARACTER_KIND.HERO;
		this.battle.selectedUserIndex = 0;
		this.battle.selectedTargetIndex = 0;
		this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
		this.battle.targets = [];
		this.battle.battlers = new Array(2);
		this.battle.players = new Array(2);
		this.battle.graphicPlayers = new Array(2);
		this.battle.time = new Date().getTime();
		this.battle.turn = 0;
		this.battle.attackingGroup = CHARACTER_KIND.HERO;
		this.initializeAlliesBattlers();
		this.initializeEnemiesBattlers();
		this.initializeInformation();
		this.initializeWindowCommands();
		this.initializeWindowsEnd();
		this.initializeMusic();
	}

	/**
	 *  Initialize allies battlers.
	 */
	initializeAlliesBattlers() {
		const l = Game.current.teamHeroes.length;
		this.battle.battlers[CHARACTER_KIND.HERO] = new Array(l);
		this.battle.players[CHARACTER_KIND.HERO] = new Array(l);
		this.battle.graphicPlayers[CHARACTER_KIND.HERO] = new Array(l);
		let position: THREE.Vector3, player: Player, battler: Battler, center: THREE.Vector3, offset: THREE.Vector3;
		for (let i = 0; i < l; i++) {
			// Battlers
			center = Interpreter.evaluate(
				Datas.BattleSystems.heroesBattlersCenterOffset.getValue() as string
			) as THREE.Vector3;
			if (!(center instanceof THREE.Vector3)) {
				Platform.showErrorMessage(
					'Heroes battlers center offset incorrect return, should be a THREE.Vecto3: ' + center
				);
			}
			offset = Interpreter.evaluate(Datas.BattleSystems.heroesBattlersOffset.getValue() as string, {
				additionalName: 'i',
				additionalValue: i,
			}) as THREE.Vector3;
			if (!(offset instanceof THREE.Vector3)) {
				Platform.showErrorMessage(
					'Heroes battlers offset incorrect return, should be a THREE.Vecto3: ' + center
				);
			}
			position = Game.current.heroBattle.position.clone().add(center).add(offset);
			player = Game.current.teamHeroes[i];
			battler = new Battler(player, false, Position.createFromVector3(position), position, this.battle.camera);
			battler.updateDead(false);
			player.battler = battler;
			battler.updateHidden(false);
			this.battle.battlers[CHARACTER_KIND.HERO][i] = battler;
			this.battle.players[CHARACTER_KIND.HERO][i] = player;

			// Graphic player
			this.battle.graphicPlayers[CHARACTER_KIND.HERO][i] = new Graphic.Player(player);
		}
	}

	/**
	 *  Initialize enemies battlers.
	 */
	initializeEnemiesBattlers() {
		const l = this.battle.troop.list.length;
		this.battle.battlers[CHARACTER_KIND.MONSTER] = new Array(l);
		this.battle.players[CHARACTER_KIND.MONSTER] = new Array(l);
		this.battle.graphicPlayers[CHARACTER_KIND.MONSTER] = new Array(l);
		let troopMonster: Model.TroopMonster,
			position: THREE.Vector3,
			player: Player,
			battler: Battler,
			center: THREE.Vector3,
			offset: THREE.Vector3;
		for (let i = 0; i < l; i++) {
			// Battlers
			troopMonster = this.battle.troop.list[i];
			if (troopMonster.isSpecificPosition) {
				center = Interpreter.evaluate(troopMonster.specificPosition.getValue() as string) as THREE.Vector3;
				if (!(center instanceof THREE.Vector3)) {
					Platform.showErrorMessage('Specific position return: ' + center);
				}
				offset = new THREE.Vector3();
			} else {
				center = Interpreter.evaluate(
					Datas.BattleSystems.troopsBattlersCenterOffset.getValue() as string
				) as THREE.Vector3;
				if (!(center instanceof THREE.Vector3)) {
					Platform.showErrorMessage('Troops battlers center offset incorrect return: ' + center);
				}
				offset = Interpreter.evaluate(Datas.BattleSystems.troopsBattlersOffset.getValue() as string, {
					additionalName: 'i',
					additionalValue: i,
				}) as THREE.Vector3;
				if (!(offset instanceof THREE.Vector3)) {
					Platform.showErrorMessage('Troops battlers offset incorrect return: ' + center);
				}
			}
			position = Game.current.heroBattle.position.clone().add(center).add(offset);
			player = new Player(CHARACTER_KIND.MONSTER, troopMonster.id, Game.current.charactersInstances++, [], []);
			player.instanciate(troopMonster.level.getValue() as number);
			battler = new Battler(player, true, Position.createFromVector3(position), position, this.battle.camera);
			player.battler = battler;
			battler.updateHidden(troopMonster.hidden.getValue() as boolean);
			this.battle.battlers[CHARACTER_KIND.MONSTER][i] = battler;
			this.battle.players[CHARACTER_KIND.MONSTER][i] = player;

			// Graphic player
			this.battle.graphicPlayers[CHARACTER_KIND.MONSTER][i] = new Graphic.Player(player, { reverse: true });
		}
	}

	/**
	 *  Initialize informations (boxes).
	 */
	initializeInformation() {
		this.battle.windowTopInformations = new WindowBox(
			0,
			Constants.HUGE_SPACE,
			ScreenResolution.SCREEN_X,
			WindowBox.SMALL_SLOT_HEIGHT,
			{
				padding: WindowBox.SMALL_SLOT_PADDING,
				content: new Graphic.Text('', { align: ALIGN.CENTER }),
			}
		);
		this.battle.windowUserInformations = new WindowBox(
			ScreenResolution.SCREEN_X - Scene.Battle.WINDOW_PROFILE_WIDTH,
			ScreenResolution.SCREEN_Y - Scene.Battle.WINDOW_PROFILE_HEIGHT,
			Scene.Battle.WINDOW_PROFILE_WIDTH,
			Scene.Battle.WINDOW_PROFILE_HEIGHT,
			{
				padding: WindowBox.MEDIUM_PADDING_BOX,
				limitContent: false,
			}
		);
		this.battle.windowTargetInformations = new WindowBox(
			0,
			ScreenResolution.SCREEN_Y - Scene.Battle.WINDOW_PROFILE_HEIGHT,
			Scene.Battle.WINDOW_PROFILE_WIDTH,
			Scene.Battle.WINDOW_PROFILE_HEIGHT,
			{
				padding: WindowBox.MEDIUM_PADDING_BOX,
				limitContent: false,
			}
		);
	}

	/**
	 *  Initialize window commands.
	 */
	public initializeWindowCommands() {
		const l = Datas.BattleSystems.battleCommandsOrder.length;
		const listContent: Graphic.TextIcon[] = new Array(l);
		const listCallbacks = new Array(l);
		let skill: Model.Skill;
		for (let i = 0; i < l; i++) {
			skill = Datas.Skills.get(Datas.BattleSystems.getBattleCommand(Datas.BattleSystems.battleCommandsOrder[i]));
			listContent[i] = Graphic.TextIcon.createFromSystem(skill.name(), skill);
			listContent[i].system = skill;
			listCallbacks[i] = Model.CommonSkillItem.prototype.useCommand;
		}
		this.battle.windowChoicesBattleCommands = new WindowChoices(
			Constants.HUGE_SPACE,
			ScreenResolution.SCREEN_Y - Constants.HUGE_SPACE - l * WindowBox.SMALL_SLOT_HEIGHT,
			Scene.Battle.WINDOW_COMMANDS_WIDTH,
			WindowBox.SMALL_SLOT_HEIGHT,
			listContent,
			{
				nbItemsMax: Scene.Battle.COMMANDS_NUMBER,
				listCallbacks: listCallbacks,
			}
		);
		this.battle.windowChoicesSkills = new WindowChoices(
			Scene.Battle.WINDOW_COMMANDS_SELECT_X,
			Scene.Battle.WINDOW_COMMANDS_SELECT_Y,
			Scene.Battle.WINDOW_COMMANDS_SELECT_WIDTH,
			WindowBox.SMALL_SLOT_HEIGHT,
			[],
			{
				nbItemsMax: Scene.Battle.COMMANDS_NUMBER,
			}
		);
		this.battle.windowSkillDescription = new WindowBox(
			ScreenResolution.SCREEN_X - Scene.Battle.WINDOW_DESCRIPTIONS_X,
			Scene.Battle.WINDOW_DESCRIPTIONS_Y,
			Scene.Battle.WINDOW_DESCRIPTIONS_WIDTH,
			Scene.Battle.WINDOW_DESCRIPTIONS_HEIGHT,
			{
				padding: WindowBox.HUGE_PADDING_BOX,
			}
		);
		this.battle.windowChoicesItems = new WindowChoices(
			Scene.Battle.WINDOW_COMMANDS_SELECT_X,
			Scene.Battle.WINDOW_COMMANDS_SELECT_Y,
			Scene.Battle.WINDOW_COMMANDS_SELECT_WIDTH,
			WindowBox.SMALL_SLOT_HEIGHT,
			[],
			{
				nbItemsMax: Scene.Battle.COMMANDS_NUMBER,
			}
		);
		this.battle.windowItemDescription = new WindowBox(
			ScreenResolution.SCREEN_X - Scene.Battle.WINDOW_DESCRIPTIONS_X,
			Scene.Battle.WINDOW_DESCRIPTIONS_Y,
			Scene.Battle.WINDOW_DESCRIPTIONS_WIDTH,
			Scene.Battle.WINDOW_DESCRIPTIONS_HEIGHT,
			{
				padding: WindowBox.HUGE_PADDING_BOX,
			}
		);
	}

	// -------------------------------------------------------
	/** Initialize windows end
	 */
	initializeWindowsEnd() {
		this.battle.windowExperienceProgression = new WindowBox(
			Scene.Battle.WINDOW_EXPERIENCE_X,
			Scene.Battle.WINDOW_EXPERIENCE_Y,
			Scene.Battle.WINDOW_EXPERIENCE_WIDTH,
			Scene.Battle.WINDOW_EXPERIENCE_HEIGHT * Game.current.teamHeroes.length +
				WindowBox.SMALL_PADDING_BOX[2] +
				WindowBox.SMALL_PADDING_BOX[3],
			{
				content: new Graphic.XPProgression(),
				padding: WindowBox.SMALL_PADDING_BOX,
			}
		);
		this.battle.windowStatisticProgression = new WindowBox(
			Scene.Battle.WINDOW_STATS_X,
			Scene.Battle.WINDOW_STATS_Y,
			Scene.Battle.WINDOW_STATS_WIDTH,
			Scene.Battle.WINDOW_STATS_HEIGHT,
			{
				padding: WindowBox.HUGE_PADDING_BOX,
			}
		);
	}

	/**
	 *  Initialize musics.
	 */
	initializeMusic() {
		this.battle.musicMap = Model.PlaySong.currentPlayingMusic;
		const song = Manager.Songs.current[SONG_KIND.MUSIC];
		this.battle.musicMapTime = song === null ? 0 : song.seek();
		if ((Game.current.battleMusic.songID.getValue() as number) !== -1) {
			Game.current.battleMusic.playMusic();
		}
	}

	/**
	 *  Update the battle.
	 */
	update() {
		Manager.Stack.requestPaintHUD = true;
		if (this.battle.transitionStart === MAP_TRANSITION_KIND.FADE) {
			this.updateTransitionStartFade();
		} else if (this.battle.transitionStart === MAP_TRANSITION_KIND.ZOOM) {
			this.updateTransitionStartZoom();
		} else {
			this.battle.turn = 1;
			this.battle.changeStep(BATTLE_STEP.START_TURN);
		}
	}

	/**
	 * Update transtion start fade.
	 */
	public updateTransitionStartFade() {
		if (this.battle.transitionColor) {
			this.battle.transitionColorAlpha += Scene.Battle.TRANSITION_COLOR_VALUE;
			if (this.battle.transitionColorAlpha >= 1) {
				this.battle.transitionColorAlpha = 1;
				this.battle.transitionColor = false;
				this.battle.timeTransition = new Date().getTime();
				this.battle.updateBackgroundColor();
			}
			return;
		}
		if (new Date().getTime() - this.battle.timeTransition < Scene.Battle.TRANSITION_COLOR_END_WAIT) {
			return;
		}
		if (this.battle.transitionColorAlpha > 0) {
			this.battle.transitionColorAlpha -= Scene.Battle.TRANSITION_COLOR_VALUE;
			if (this.battle.transitionColorAlpha <= 0) {
				this.battle.transitionColorAlpha = 0;
			}
			return;
		}
		this.battle.turn = 1;
		this.battle.changeStep(BATTLE_STEP.START_TURN);
	}

	/**
	 *  Update transition start zoom.
	 */
	public updateTransitionStartZoom() {
		let offset: number;
		this.battle.sceneMap.camera.forceNoHide = true;
		if (this.battle.transitionZoom) {
			this.battle.sceneMap.camera.distance =
				(this.battle.mapCameraDistance - Scene.Battle.START_CAMERA_DISTANCE) *
					(1 - (new Date().getTime() - this.battle.time) / Scene.Battle.TRANSITION_ZOOM_TIME) +
				Scene.Battle.START_CAMERA_DISTANCE;
			if (this.battle.sceneMap.camera.distance <= Scene.Battle.START_CAMERA_DISTANCE) {
				this.battle.sceneMap.camera.distance = Scene.Battle.START_CAMERA_DISTANCE;
				this.battle.transitionZoom = false;
				this.battle.updateBackgroundColor();
				this.battle.time = new Date().getTime();
			}
			this.battle.sceneMap.camera.update();
			return;
		}
		if (this.battle.camera.distance < this.battle.cameraDistance) {
			offset =
				(Scene.Battle.START_CAMERA_DISTANCE / this.battle.cameraDistance) * Scene.Battle.TRANSITION_ZOOM_TIME;
			this.battle.camera.distance =
				((new Date().getTime() - this.battle.time - offset) / (Scene.Battle.TRANSITION_ZOOM_TIME - offset)) *
				this.battle.cameraDistance;
			if (this.battle.camera.distance >= this.battle.cameraDistance) {
				this.battle.camera.distance = this.battle.cameraDistance;
				this.battle.cameraON = true;
			} else {
				return;
			}
		}
		this.battle.turn = 1;
		this.battle.changeStep(BATTLE_STEP.START_TURN);
	}

	/**
	 *  Handle key pressed.
	 *   @param {number} key - The key ID
	 */
	onKeyPressedStep(key: string) {}

	/**
	 *  Handle key released.
	 *  @param {number} key - The key ID
	 */
	onKeyReleasedStep(key: string) {}

	/**
	 *  Handle key repeat pressed.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Handle key pressed and repeat.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Draw the battle HUD
	 */
	drawHUDStep() {
		if (this.battle.transitionStart === 1) {
			Platform.ctx.fillStyle = `rgba(${this.battle.transitionStartColor.red},${this.battle.transitionStartColor.green},${this.battle.transitionStartColor.blue},${this.battle.transitionColorAlpha})`;
			Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT);
		}
	}
}

export { BattleInitialize };
