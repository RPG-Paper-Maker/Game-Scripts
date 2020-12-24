/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battler, Camera, WindowBox, WindowChoices } from "../Core";
import { Player } from "../Graphic";
import { Animation, BattleMap, Color, Effect, MonsterAction, Skill } from "../System";
import { BattleAnimation } from "./BattleAnimation";
import { BattleEnemyAttack } from "./BattleEnemyAttack";
import { BattleInitialize } from "./BattleInitialize";
import { BattleSelection } from "./BattleSelection";
import { BattleVictory } from "./BattleVictory";
import { Map } from "./Map";
import {Enum} from "../Common/Enum"
import { TitleScreen } from "./TitleScreen";

/** @class
*   A scene for battling
*   @extends SceneGame
*   @property {number} [SceneBattle.TRANSITION_ZOOM_TIME=500] The time in 
*   milliseconds for zooming in transition
*   @property {number} [SceneBattle.TRANSITION_COLOR_VALUE=0.1] The color 
*   value for transition
*   @property {number} [SceneBattle.TRANSITION_COLOR_END_WAIT=600] The 
*   transition color to wait at the end
*   @property {number} [SceneBattle.TIME_END_WAIT=1000] The time in 
*   milliseconds to wait at the end of the battle
*   @property {number} [SceneBattle.TIME_PROGRESSION_XP=3000] The time in 
*   milliseconds for progression xp
*   @property {number} [SceneBattle.TIME_LINEAR_MUSIC_END=500] The linear music 
*   end time in milliseconds
*   @property {number} [SceneBattle.TIME_LINEAR_MUSIC_START=500] The linear 
*   music start time in milliseconds
*   @property {number} [SceneBattle.TIME_ACTION_ANIMATION=2000] The time in 
*   milliseconds for action animation
*   @property {number} [SceneBattle.CAMERA_TICK=0.05] The camera tick
*   @property {number} [SceneBattle.CAMERA_OFFSET=3] The camera small move 
*   offset in pixels
*   @property {number} [SceneBattle.START_CAMERA_DISTANCE=10] The start camera 
*   distance
*   @property {number} [SceneBattle.WINDOW_PROFILE_WIDTH=300] The window 
*   profile width
*   @property {number} [SceneBattle.WINDOW_PROFILE_HEIGHT=100] The window 
*   profile height
*   @property {number} [SceneBattle.COMMANDS_NUMBER=6] The max commands number
*   @property {number} [SceneBattle.WINDOW_COMMANDS_WIDTH=150] The window 
*   commands width
*   @property {number} [SceneBattle.WINDOW_COMMANDS_SELECT_X=25] The window 
*   commands select x
*   @property {number} [SceneBattle.WINDOW_COMMANDS_SELECT_Y=100] The window 
*   commands select y
*   @property {number} [SceneBattle.WINDOW_COMMANDS_SELECT_WIDTH=200] The 
*   window commands select width
*   @property {number} [SceneBattle.WINDOW_DESCRIPTIONS_X=385] The window 
*   descriptions x
*   @property {number} [SceneBattle.WINDOW_DESCRIPTIONS_Y=100] The window 
*   descriptions y
*   @property {number} [SceneBattle.WINDOW_DESCRIPTIONS_WIDTH=360] The window 
*   descriptions width
*   @property {number} [SceneBattle.WINDOW_DESCRIPTIONS_HEIGHT=200] The window 
*   descriptions height
*   @property {number} [SceneBattle.WINDOW_EXPERIENCE_X=10] The window 
*   experience x
*   @property {number} [SceneBattle.WINDOW_EXPERIENCE_Y=80] The window 
*   experience y
*   @property {number} [SceneBattle.WINDOW_EXPERIENCE_WIDTH=300] The window 
*   experience width
*   @property {number} [SceneBattle.WINDOW_EXPERIENCE_HEIGHT=90] The window 
*   experience height
*   @property {number} [SceneBattle.WINDOW_STATS_X=250] The window stats x
*   @property {number} [SceneBattle.WINDOW_STATS_Y=90] The window stats y
*   @property {number} [SceneBattle.WINDOW_STATS_WIDTH=380] The window stats 
*   width
*   @property {number} [SceneBattle.WINDOW_STATS_HEIGHT=200] The window stats 
*   height
*   @property {number} troopID Current troop ID that the allies are fighting
*   @property {boolean} canGameOver Indicate if there is a win/lose node or not
*   @property {boolean} canEscape Indicate if the player can escape this battle
*   @property {Enum.MapTransitionKind} transitionStart The kind of transition for 
*   the battle start
*   @property {Enum.MapTransitionKind} transitionEnd The kind of transition for the 
*   battle end
*   @property {SystemColor} transitionStartColor The System color for start
*   transition
*   @property {SystemColor} transitionEndColor The System color for end
*   transition
*   @property {boolean} transitionColor Indicate if the transition is by color
*   @property {number} transitionColorAlpha The alpha transition color value
*   @property {number} step Main step of the battle
*   @property {number} subStep Sub step of the battle (used for menus or other 
*   sub-steps)
*   @property {SceneMap} sceneMap The scene map where the battle was run
*   @property {number} sceneMapCameraDistance The scene map camera distance
*   @property {MonsterAction} actionDoNothing A System monster action
*   reprensenting action doing nothing
*   @property {number} cameraStep The camera step (for moving)
*   @property {number} cameraTick The camera tick
*   @property {number} cameraOffset The camera offset
*   @property {boolean} cameraON Indicate if the transition is camera zoom
*   @property {number} cameraDistance The camera distance
*   @property {boolean} transitionZoom Indicate when to zoom in or out
*   @property {boolean} loadingStep Indicate if there is a loading step
*   @property {boolean} winning Indicate if the battle is won
*   @property {Enum.CharacterKind} kindSelection Indicating which group is currently
*       selected
*   @property {number} selectedUserIndex Index of the selected user
*   @property {number} selectedTargetIndex Index of the selected target
*   @property {Enum.EffectSpecialActionKind} battleCommandKind The current battle 
*   command kind
*   @property {Battler[]} targets List of all the current targets
*   @property {any[]} damages Informations about damages
*   @property {Array.<Array.<Battler>>} battlers Battlers of all the allies / 
*   enemies
*   @property {Object[]} graphicPlayers The graphics used for user and target(s)
*   @property {number} time A chronometer for several steps of battle
*   @property {number} turn The turn number
*   @property {WindowBox} windowTopInformations The window on top that shows
*   specific informations
*   @property {WindowBox} windowUserInformations The window on bot that shows 
*   user characteristics informations
*   @property {WindowBox} windowTargetInformations The window on bot that shows 
*   target characteristics informations
*   @property {WindowChoices} windowChoicesBattleCommands The window for battle
*   commands
*   @property {WindowChoices} windowChoicesSkills The window choices for skills
*   @property {WindowBox} windowSkillDescription The window description for 
*   selected skill
*   @property {WindowChoices} windowChoicesItems The window choices for items
*   @property {WindowBox} windowItemDescription The window description for 
*   selected item
*   @property {WindowBox} windowExperienceProgression The window experience 
*   progression
*   @property {WindowBox} windowStatisticProgression The window statistic 
*   progression
*   @property {Enum.CharacterKind} attackingGroup Indicating which group is 
*   currently attacking
*   @property {boolean} userTarget Indicate if the user is a target
*   @property {boolean} all Indicate if the targets are all the enemies
*   @property {GraphicSkill[]} listSkills The graphics list for each skill
*   @property {GraphicItem[]} listItems The graphics list for each item
*   @property {boolean} transitionEnded Indicate if the transition ended
*   @property {SystemEffect[]} effects The current weapon / skill System effects
*   @property {number} frameUser The frame user
*   @property {number} frameTarget The frame target
*   @property {SystemAnimation} userAnimation The System animation for user
*   @property {SystemAnimation} targetAnimation The System animation for target
*   @property {Battler} user The user battler
*   @property {number} currentEffectIndex The current effect index
*   @property {number} timeEnemyAttack A chronometer for enemy attack
*   @property {MonsterAction} action The current System action
*   @property {Skill} attackSkill The System skill
*   @property {boolean} finishedXP Indicate if the xp progression is finished
*   @property {number} priorityIndex The priority index
*   @property {WindowBox} windowLoots The window box for loots
*   @property {number} xp The total xp
*   @property {Object} currencies The total currencies
*   @property {Object[]} loots The total loots
*   @property {number} lootsNumber The total loots number
*   @property {GraphicRewardsTop} graphicRewardTop The graphic reward on top
*   @param {number} troopID Current troop ID that the allies are fighting
*   @param {boolean} canGameOver Indicate if there is a win/lose node or not
*   @param {boolean} canEscape Indicate if the player can escape this battle
*   @param {SystemBattleMap} battleMap The System battle map
*   @param {Enum.MapTransitionKind} transitionStart The kind of transition for 
*   the battle start
*   @param {Enum.MapTransitionKind} transitionEnd The kind of transition for the 
*   battle end
*   @param {SystemColor} transitionStartColor The System color for start
*   transition
*   @param {SystemColor} transitionEndColor The System color for end
*   transition
*/

class Battle extends Map {

    static TRANSITION_ZOOM_TIME = 500;
    static TRANSITION_COLOR_VALUE = 0.1;
    static TRANSITION_COLOR_END_WAIT = 600;
    static TIME_END_WAIT = 1000;
    static TIME_PROGRESSION_XP = 3000;
    static TIME_LINEAR_MUSIC_END = 500;
    static TIME_LINEAR_MUSIC_START = 500;
    static TIME_ACTION_ANIMATION = 2000;
    static CAMERA_TICK = 0.05;
    static CAMERA_OFFSET = 3;
    static START_CAMERA_DISTANCE = 10;
    static WINDOW_PROFILE_WIDTH = 300;
    static WINDOW_PROFILE_HEIGHT = 100;
    static COMMANDS_NUMBER = 6;
    static WINDOW_COMMANDS_WIDTH = 150;
    static WINDOW_COMMANDS_SELECT_X = 25;
    static WINDOW_COMMANDS_SELECT_Y = 100;
    static WINDOW_COMMANDS_SELECT_WIDTH = 200;
    static WINDOW_DESCRIPTIONS_X = 385;
    static WINDOW_DESCRIPTIONS_Y = 100;
    static WINDOW_DESCRIPTIONS_WIDTH = 360;
    static WINDOW_DESCRIPTIONS_HEIGHT = 200;
    static WINDOW_EXPERIENCE_X = 10;
    static WINDOW_EXPERIENCE_Y = 80;
    static WINDOW_EXPERIENCE_WIDTH = 300;
    static WINDOW_EXPERIENCE_HEIGHT = 90;
    static WINDOW_STATS_X = 250;
    static WINDOW_STATS_Y = 90;
    static WINDOW_STATS_WIDTH = 380;
    static WINDOW_STATS_HEIGHT = 200;


    public battleInitialize: BattleInitialize;
    public battleSelection: BattleSelection; //Step 1
    public battleAnimation: BattleAnimation; //Step 2
    public battleEnemyAttack: BattleEnemyAttack; //Step 3
    public battleVictory: BattleVictory; //Step 4

    // Flags
    public troopID: number;
    public canGameOver: boolean;
    public canEscape: boolean;
    public winning: boolean;
    public loadingStep: boolean;
    public finishedXP: boolean;
    public all:boolean;
    public userTarget:boolean;

    //Selection
    public kindSelection: Enum.CharacterKind;
    public selectedUserIndex: number;
    public selectedTargetIndex: number;

    //Lists
    public listSkills:any[]; //Graphic Skill[]
    public listItems:any[];
    public effects:Effect[];

    //Command
    public battleCommandKind: Enum.EffectSpecialActionKind;

    //Battle Information
    public graphicPlayers: Player;
    public targets: Battler[];
    public battlers:Battler[][];
    public damages: any[];
    public time: number;
    public timeEnemyAttack:number;
    public turn: number;

    //Animation
    public userAnimation:Animation;
    public targetAnimation:Animation;

    public action:MonsterAction;



    //Transition
    public transitionStart: number; //TODO: Add Enum
    public transitionStartColor: Color;
    public transitionEnd: number;
    public transitionEndColor: Color;
    public transitionColorAlpha: number;
    public transitionColor: boolean;
    /**Whether to zoom during a transition */
    public transitionZoom: boolean;
    /**Indicate whether the transition has ended */
    public transitionEnded:boolean;
    /** Time Transition time */
    public timeTransition:number;

    //Step
    /**What step (initialization, animation, selection, victory) of battle the game is on */
    public step: number;
    public subStep:number;

    public sceneMapCameraDistance: number; //Remove Scene Prefix
    public actionDoNothing: MonsterAction;
    public frameUser:number;
    public frameTarget:number;

    //Camera
    public cameraStep: number;
    public cameraTick: number;
    public cameraON: boolean;
    public cameraDistance: number;
    public cameraOffset: number;

    //Window
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




    public sceneMap: Map;
    public loots: Object[];
    public currencies: Object;
    public xp: number;
    public battleMap: BattleMap;
    public currentEffectIndex:number;
    public priorityIndex:number;
    public lootsNumber:number;

    //Attack
    public attackSkill:Skill;
    public attackingGroup:Enum.CharacterKind;




    constructor(troopID, canGameOver, canEscape, battleMap, transitionStart,
        transitionEnd, transitionStartColor, transitionEndColor) {
        super(battleMap.idMap, true);


        // Battle Handlers
        this.battleInitialize = new BattleInitialize(this)
        this.battleSelection = new BattleSelection(this);
        this.battleAnimation = new BattleAnimation(this); //Step 2
        this.battleEnemyAttack = new BattleEnemyAttack(this);
        this.battleVictory = new BattleVictory(this); //Step 4

        // ====
        this.troopID = troopID;
        this.canGameOver = canGameOver;
        this.canEscape = canEscape;
        this.transitionStart = transitionStart;
        this.transitionEnd = transitionEnd;
        this.transitionStartColor = transitionStartColor;
        this.transitionEndColor = transitionEndColor;
        //TODO: Bug?
        this.transitionColor = transitionStart === Enum.MapTransitionKind.Fade;
        this.transitionColorAlpha = 0;
        this.step = 0;
        this.sceneMap = RPM.gameStack.top;
        this.sceneMapCameraDistance = this.sceneMap.camera.distance;
        this.actionDoNothing = new MonsterAction({});
    }

    // -------------------------------------------------------
    /** Load async stuff
    */
    async load() {
        await super.load();
        this.initialize();
        RPM.requestPaintHUD = true;
        this.loading = false;
    }

    // -------------------------------------------------------
    /** Initialize and correct some camera settings for the battle start
    */
    initializeCamera() {
        this.camera = new Camera(this.mapProperties.cameraProperties, RPM.game
            .heroBattle);
        this.cameraStep = 0;
        this.cameraTick = Battle.CAMERA_TICK;
        this.cameraOffset = Battle.CAMERA_OFFSET;
        this.cameraON = this.transitionStart !== Enum.MapTransitionKind.Zoom;
        this.cameraDistance = this.camera.distance;
        this.transitionZoom = false;
        if (!this.cameraON) {
            this.camera.distance = Battle.START_CAMERA_DISTANCE;
            this.transitionZoom = true;
        }
        this.camera.update();
    };

    // -------------------------------------------------------
    /** Make the attacking group all actives
    */
    activeGroup() {
        for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l;
            i++) {
            this.battlers[this.attackingGroup][i].setActive(true);
        }
    }

    // -------------------------------------------------------
    /** Check if a player is defined (active and not dead)
    *   @param {Enum.CharacterKind} kind Kind of player
    *   @param {number} index Index in the group
    *   @param {boolean} target Indicate if the player is a target
    *   @returns {boolean}
    */
    isDefined(kind: Enum.CharacterKind, index: number, target: boolean): boolean {
        return ((target || this.battlers[kind][index].active) && !this.battlers
        [kind][index].character.isDead())
    }

    // -------------------------------------------------------
    /** Check if all the heroes or enemies are inactive
    *   @returns {boolean}
    */
    isEndTurn(): boolean {
        for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l;
            i++) {
            if (this.isDefined(this.attackingGroup, i)) {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------
    /** Check if all the heroes or enemies are dead
    *   @param {Enum.CharacterKind} group Kind of player
    *   @returns {boolean}
    */
    isGroupDead(group: Enum.CharacterKind): boolean {
        for (let i = 0, l = this.battlers[group].length; i < l; i++) {
            if (!this.battlers[group][i].character.isDead()) {
                return false;
            }
        }
        return true;
    };

    // -------------------------------------------------------
    /** Check if all the enemies are dead
    *   @returns {boolean}
    */
    isWin(): boolean {
        return this.isGroupDead(Enum.CharacterKind.Monster);
    }

    // -------------------------------------------------------
    /** Check if all the heroes are dead
    *   @returns {boolean}
    */
    isLose(): boolean {
        return this.isGroupDead(Enum.CharacterKind.Hero);
    }

    // -------------------------------------------------------
    /** Transition to game over scene
    */
    gameOver() {
        if (this.canGameOver) {
            RPM.gameStack.pop();
            RPM.gameStack.replace(new TitleScreen()); // TODO
        } else {
            this.endBattle();
        }
    }

    // -------------------------------------------------------
    /** Win the battle
    */
    win() {
        this.endBattle();
    }

    // -------------------------------------------------------
    /** Win the battle
    */
    endBattle() {
        // Heroes
        for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++) {
            this.battlers[Enum.CharacterKind.Hero][i].removeFromScene();
        }
        RPM.gameStack.pop();
        RPM.currentMap = RPM.gameStack.top;
    }

    // -------------------------------------------------------

    /** Change the step of the battle
    *   @param {number} i Step of the battle
    */
    changeStep(i: number) {
        this.step = i;
        this.subStep = 0;
        this.initialize();
    }

    // -------------------------------------------------------
    /** Initialize the current step
    */
    initialize() {
        switch (this.step) {
            case 0:
                this.battleInitialize.initialize();
                break;
            case 1:
                this.battleSelection.initialize();
                break;
            case 2:
                this.battleAnimation.initialize();
                break;
            case 3:
                this.battleEnemyAttack.initialize();
                break;
            case 4:
                this.battleVictory.initialize();
                break;
        }
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Update battle according to step
    */
    update() {
        super.update();

        // Heroes
        let battlers = this.battlers[Enum.CharacterKind.Hero];
        let i, l;
        for (i = 0, l = battlers.length; i < l; i++) {
            battlers[i].update();
        }
        // Ennemies
        battlers = this.battlers[Enum.CharacterKind.Monster];
        for (i = 0, l = battlers.length; i < l; i++) {
            battlers[i].update();
        }

        // Camera temp code for moving
        this.moveStandardCamera();

        // Update according to step
        switch (this.step) {
            case 0:
                this.battleInitialize.update();
                break;
            case 1:
                this.battleSelection.update();
                break;
            case 2:
                this.battleAnimation.update();
                break;
            case 3:
                this.battleEnemyAttack.update();
                break;
            case 4:
                this.battleVictory.update();
                break;
        }
    }

    // -------------------------------------------------------
    /** Do camera standard moves
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

    // -------------------------------------------------------
    /** Handle battle key pressed according to step
    *   @param {number} key The key ID
    */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        switch (this.step) {
            case 0:
                this.battleInitialize.onKeyPressedStep(key);
                break;
            case 1:
                this.battleSelection.onKeyPressedStep(key);
                break;
            case 2:
                this.battleAnimation.onKeyPressedStep(key);
                break;
            case 3:
                this.battleEnemyAttack.onKeyPressedStep(key);
                break;
            case 4:
                this.battleVictory.onKeyPressedStep(key);
                break;
        }
    }

    // -------------------------------------------------------
    /** Handle battle key released according to step
    *   @param {number} key The key ID
    */
    onKeyReleased(key: number) {
        super.onKeyReleased(key);
        switch (this.step) {
            case 0:
                this.battleInitialize.onKeyReleasedStep(key);
                break;
            case 1:
                this.battleSelection.onKeyReleasedStep(key);
                break;
            case 2:
                this.battleAnimation.onKeyReleasedStep(key);
                break;
            case 3:
                this.battleEnemyAttack.onKeyReleasedStep(key);
                break;
            case 4:
                this.battleVictory.onKeyReleasedStep(key);
                break;
        }
    }

    // -------------------------------------------------------
    /** Handle battle key pressed repeat according to step
    *   @param {number} key The key ID
    */
    onKeyPressedRepeat(key: number) {
        super.onKeyPressedRepeat(key);
        switch (this.step) {
            case 0:
                this.battleInitialize.onKeyPressedRepeatStep(key);
                break;
            case 1:
                this.battleSelection.onKeyPressedRepeatStep(key);
                break;
            case 2:
                this.battleAnimation.onKeyPressedRepeatStep(key);
                break;
            case 3:
                this.battleEnemyAttack.onKeyPressedRepeatStep(key);
                break;
            case 4:
                this.battleVictory.onKeyPressedRepeatStep(key);
                break;
        }
    }

    // -------------------------------------------------------
    /** Handle battle key pressed and repeat according to step
    *   @param {number} key The key ID
    */
    onKeyPressedAndRepeat(key: number) {
        super.onKeyPressedAndRepeat(key);
        switch (this.step) {
            case 0:
                this.battleInitialize.onKeyPressedAndRepeatStep(key);
                break;
            case 1:
                this.battleSelection.onKeyPressedAndRepeatStep(key);
                break;
            case 2:
                this.battleAnimation.onKeyPressedAndRepeatStep(key);
                break;
            case 3:
                this.battleEnemyAttack.onKeyPressedAndRepeatStep(key);
                break;
            case 4:
                this.battleVictory.onKeyPressedAndRepeatStep(key);
                break;
        }
    }

    // -------------------------------------------------------
    /** Draw the battle 3D scene
    */
    draw3D() {
        if (this.transitionZoom || this.transitionColor) {
            this.sceneMap.draw3D();
        } else {
            super.draw3D();
        }
    }

    // -------------------------------------------------------
    /** Draw the battle HUD according to step
    */
    drawHUD() {
        switch (this.step) {
            case 0:
                this.battleInitialize.drawHUDStep();
                break;
            case 1:
                this.battleSelection.drawHUDStep();
                break;
            case 2:
                this.battleAnimation.drawHUDStep();
                break;
            case 3:
                this.battleEnemyAttack.drawHUDStep();
                break;
            case 4:
                this.battleVictory.drawHUDStep();
                break;
        }
        super.drawHUD();
    }
}
export { Battle }