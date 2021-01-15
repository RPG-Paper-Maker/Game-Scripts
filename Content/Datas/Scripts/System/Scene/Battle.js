/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Camera, Game } from "../Core/index.js";
import { System, Scene, Manager } from "../index.js";
import { Enum } from "../Common/index.js";
var CharacterKind = Enum.CharacterKind;
var BattleStep = Enum.BattleStep;
import { Map } from "./Map.js";
/** @class
 *  A scene for battling.
 *  @extends SceneGame
 *  @param {number} troopID - Current troop ID that the allies are fighting
 *  @param {boolean} canGameOver - Indicate if there is a win/lose node or not
 *  @param {boolean} canEscape - Indicate if the player can escape this battle
 *  @param {SystemBattleMap} battleMap - The System battle map
 *  @param {Enum.MapTransitionKind} transitionStart - The kind of transition for
 *  the battle start
 *  @param {Enum.MapTransitionKind} transitionEnd - The kind of transition for the
 *  battle end
 *  @param {SystemColor} transitionStartColor - The System color for start
 *  transition
 *  @param {SystemColor} transitionEndColor - The System color for end
 *  transition
 */
class Battle extends Map {
    constructor(troopID, canGameOver, canEscape, battleMap, transitionStart, transitionEnd, transitionStartColor, transitionEndColor) {
        super(battleMap.idMap, true);
        // Battle Handlers
        this.battleInitialize = new Scene.BattleInitialize(this);
        this.battleSelection = new Scene.BattleSelection(this);
        this.battleAnimation = new Scene.BattleAnimation(this);
        this.battleEnemyAttack = new Scene.BattleEnemyAttack(this);
        this.battleVictory = new Scene.BattleVictory(this);
        // ====
        this.troopID = troopID;
        this.canGameOver = canGameOver;
        this.canEscape = canEscape;
        this.transitionStart = transitionStart;
        this.transitionEnd = transitionEnd;
        this.transitionStartColor = transitionStartColor;
        this.transitionEndColor = transitionEndColor;
        this.transitionColor = transitionStart === Enum.MapTransitionKind.Fade;
        this.transitionColorAlpha = 0;
        this.step = BattleStep.Initialize;
        this.sceneMap = Manager.Stack.top;
        this.mapCameraDistance = this.sceneMap.camera.distance;
        this.actionDoNothing = new System.MonsterAction({});
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
     *  Initialize and correct some camera settings for the battle start
     */
    initializeCamera() {
        this.camera = new Camera(this.mapProperties.cameraProperties, Game
            .current.heroBattle);
        this.cameraStep = 0;
        this.cameraTick = Scene.Battle.CAMERA_TICK;
        this.cameraOffset = Battle.CAMERA_OFFSET;
        this.cameraON = this.transitionStart !== Enum.MapTransitionKind.Zoom;
        this.cameraDistance = this.camera.distance;
        this.transitionZoom = false;
        if (!this.cameraON) {
            this.camera.distance = Battle.START_CAMERA_DISTANCE;
            this.transitionZoom = true;
        }
        this.camera.update();
    }
    ;
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
     *  @param {CharacterKind} kind - Kind of player
     *  @param {number} index - Index in the group
     *  @param {boolean} target - Indicate if the player is a target
     *  @returns {boolean}
     */
    isDefined(kind, index, target) {
        return ((target || this.battlers[kind][index].active) && !this.battlers[kind][index].player.isDead());
    }
    /**
     *  Check if all the heroes or enemies are inactive.
     *  @returns {boolean}
     */
    isEndTurn() {
        for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; i++) {
            if (this.isDefined(this.attackingGroup, i)) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Check if all the heroes or enemies are dead
     *  @param {CharacterKind} group - Kind of player
     *  @returns {boolean}
     */
    isGroupDead(group) {
        for (let i = 0, l = this.battlers[group].length; i < l; i++) {
            if (!this.battlers[group][i].player.isDead()) {
                return false;
            }
        }
        return true;
    }
    /**
     *  Check if all the enemies are dead.
     *  @returns {boolean}
     */
    isWin() {
        return this.isGroupDead(CharacterKind.Monster);
    }
    /**
     *  Check if all the heroes are dead.
     *  @returns {boolean}
     */
    isLose() {
        return this.isGroupDead(CharacterKind.Hero);
    }
    /**
     *  Transition to game over scene.
     */
    gameOver() {
        if (this.canGameOver) {
            Manager.Stack.pop();
            Manager.Stack.replace(new Scene.TitleScreen()); // TODO
        }
        else {
            this.endBattle();
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
        for (let i = 0, l = Game.current.teamHeroes.length; i < l; i++) {
            this.battlers[CharacterKind.Hero][i].removeFromScene();
        }
        Manager.Stack.pop();
        Scene.Map.current = Manager.Stack.top;
    }
    /**
     *  Change the step of the battle.
     *  @param {BattleStep} i - Step of the battle
     */
    changeStep(i) {
        this.step = i;
        this.subStep = 0;
        this.initialize();
    }
    /**
     *  Initialize the current step.
     */
    initialize() {
        switch (this.step) {
            case BattleStep.Initialize:
                this.battleInitialize.initialize();
                break;
            case BattleStep.Selection:
                this.battleSelection.initialize();
                break;
            case BattleStep.Animation:
                this.battleAnimation.initialize();
                break;
            case BattleStep.EnemyAttack:
                this.battleEnemyAttack.initialize();
                break;
            case BattleStep.Victory:
                this.battleVictory.initialize();
                break;
        }
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Update battle according to step.
     */
    update() {
        super.update();
        // Heroes
        let battlers = this.battlers[CharacterKind.Hero];
        let i, l;
        for (i = 0, l = battlers.length; i < l; i++) {
            battlers[i].update();
        }
        // Ennemies
        battlers = this.battlers[CharacterKind.Monster];
        for (i = 0, l = battlers.length; i < l; i++) {
            battlers[i].update();
        }
        // Camera temp code for moving
        this.moveStandardCamera();
        // Update according to step
        switch (this.step) {
            case BattleStep.Initialize:
                this.battleInitialize.update();
                break;
            case BattleStep.Selection:
                this.battleSelection.update();
                break;
            case BattleStep.Animation:
                this.battleAnimation.update();
                break;
            case BattleStep.EnemyAttack:
                this.battleEnemyAttack.update();
                break;
            case BattleStep.Victory:
                this.battleVictory.update();
                break;
        }
    }
    /**
     *  Do camera standard moves.
     */
    moveStandardCamera() {
        if (this.cameraON) {
            switch (this.cameraStep) {
                case 0:
                    this.camera.distance -= this.cameraTick;
                    this.camera.targetOffset.x += this.cameraTick;
                    if (this.camera.distance <= this.cameraDistance - this
                        .cameraOffset) {
                        this.camera.distance = this.cameraDistance - this
                            .cameraOffset;
                        this.camera.targetOffset.x = this.cameraOffset;
                        this.cameraStep = 1;
                    }
                    break;
                case 1:
                    this.camera.distance += this.cameraTick;
                    if (this.camera.distance >= this.cameraDistance + this
                        .cameraOffset) {
                        this.camera.distance = this.cameraDistance + this
                            .cameraOffset;
                        this.cameraStep = 2;
                    }
                    break;
                case 2:
                    this.camera.distance -= this.cameraTick;
                    this.camera.targetOffset.x -= this.cameraTick;
                    if (this.camera.distance <= this.cameraDistance - this
                        .cameraOffset) {
                        this.camera.distance = this.cameraDistance - this
                            .cameraOffset;
                        this.camera.targetOffset.x = -this.cameraOffset;
                        this.cameraStep = 3;
                    }
                    break;
                case 3:
                    this.camera.distance += this.cameraTick;
                    if (this.camera.distance >= this.cameraDistance + this
                        .cameraOffset) {
                        this.camera.distance = this.cameraDistance + this
                            .cameraOffset;
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
    onKeyPressed(key) {
        super.onKeyPressed(key);
        switch (this.step) {
            case BattleStep.Initialize:
                this.battleInitialize.onKeyPressedStep(key);
                break;
            case BattleStep.Selection:
                this.battleSelection.onKeyPressedStep(key);
                break;
            case BattleStep.Animation:
                this.battleAnimation.onKeyPressedStep(key);
                break;
            case BattleStep.EnemyAttack:
                this.battleEnemyAttack.onKeyPressedStep(key);
                break;
            case BattleStep.Victory:
                this.battleVictory.onKeyPressedStep(key);
                break;
        }
    }
    /**
     *  Handle battle key released according to step.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key) {
        super.onKeyReleased(key);
        switch (this.step) {
            case BattleStep.Initialize:
                this.battleInitialize.onKeyReleasedStep(key);
                break;
            case BattleStep.Selection:
                this.battleSelection.onKeyReleasedStep(key);
                break;
            case BattleStep.Animation:
                this.battleAnimation.onKeyReleasedStep(key);
                break;
            case BattleStep.EnemyAttack:
                this.battleEnemyAttack.onKeyReleasedStep(key);
                break;
            case BattleStep.Victory:
                this.battleVictory.onKeyReleasedStep(key);
                break;
        }
    }
    /**
     *  Handle battle key pressed repeat according to step.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key) {
        let res = super.onKeyPressedRepeat(key);
        switch (this.step) {
            case BattleStep.Initialize:
                res = res && this.battleInitialize.onKeyPressedRepeatStep(key);
                break;
            case BattleStep.Selection:
                res = res && this.battleSelection.onKeyPressedRepeatStep(key);
                break;
            case BattleStep.Animation:
                res = res && this.battleAnimation.onKeyPressedRepeatStep(key);
                break;
            case BattleStep.EnemyAttack:
                res = res && this.battleEnemyAttack.onKeyPressedRepeatStep(key);
                break;
            case BattleStep.Victory:
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
    onKeyPressedAndRepeat(key) {
        let res = super.onKeyPressedAndRepeat(key);
        switch (this.step) {
            case BattleStep.Initialize:
                res = res && this.battleInitialize.onKeyPressedAndRepeatStep(key);
                break;
            case BattleStep.Selection:
                res = res && this.battleSelection.onKeyPressedAndRepeatStep(key);
                break;
            case BattleStep.Animation:
                res = res && this.battleAnimation.onKeyPressedAndRepeatStep(key);
                break;
            case BattleStep.EnemyAttack:
                res = res && this.battleEnemyAttack.onKeyPressedAndRepeatStep(key);
                break;
            case BattleStep.Victory:
                res = res && this.battleVictory.onKeyPressedAndRepeatStep(key);
                break;
        }
        return res;
    }
    /**
     *  Draw the battle 3D scene.
     */
    draw3D() {
        if (this.transitionZoom || this.transitionColor) {
            this.sceneMap.draw3D();
        }
        else {
            super.draw3D();
        }
    }
    /**
     *  Draw the battle HUD according to step.
     */
    drawHUD() {
        switch (this.step) {
            case BattleStep.Initialize:
                this.battleInitialize.drawHUDStep();
                break;
            case BattleStep.Selection:
                this.battleSelection.drawHUDStep();
                break;
            case BattleStep.Animation:
                this.battleAnimation.drawHUDStep();
                break;
            case BattleStep.EnemyAttack:
                this.battleEnemyAttack.drawHUDStep();
                break;
            case BattleStep.Victory:
                this.battleVictory.drawHUDStep();
                break;
        }
        super.drawHUD();
    }
}
Battle.TRANSITION_ZOOM_TIME = 500;
Battle.TRANSITION_COLOR_VALUE = 0.1;
Battle.TRANSITION_COLOR_END_WAIT = 600;
Battle.TIME_END_WAIT = 1000;
Battle.TIME_PROGRESSION_XP = 3000;
Battle.TIME_LINEAR_MUSIC_END = 500;
Battle.TIME_LINEAR_MUSIC_START = 500;
Battle.TIME_ACTION_ANIMATION = 2000;
Battle.CAMERA_TICK = 0.05;
Battle.CAMERA_OFFSET = 3;
Battle.START_CAMERA_DISTANCE = 10;
Battle.WINDOW_PROFILE_WIDTH = 300;
Battle.WINDOW_PROFILE_HEIGHT = 100;
Battle.COMMANDS_NUMBER = 6;
Battle.WINDOW_COMMANDS_WIDTH = 150;
Battle.WINDOW_COMMANDS_SELECT_X = 25;
Battle.WINDOW_COMMANDS_SELECT_Y = 100;
Battle.WINDOW_COMMANDS_SELECT_WIDTH = 200;
Battle.WINDOW_DESCRIPTIONS_X = 385;
Battle.WINDOW_DESCRIPTIONS_Y = 100;
Battle.WINDOW_DESCRIPTIONS_WIDTH = 360;
Battle.WINDOW_DESCRIPTIONS_HEIGHT = 200;
Battle.WINDOW_EXPERIENCE_X = 10;
Battle.WINDOW_EXPERIENCE_Y = 80;
Battle.WINDOW_EXPERIENCE_WIDTH = 300;
Battle.WINDOW_EXPERIENCE_HEIGHT = 90;
Battle.WINDOW_STATS_X = 250;
Battle.WINDOW_STATS_Y = 90;
Battle.WINDOW_STATS_WIDTH = 380;
Battle.WINDOW_STATS_HEIGHT = 200;
Battle.escapedLastBattle = false;
export { Battle };
