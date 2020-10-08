/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene for battling.
*   @ SceneGame
*   @extends SceneGame
*   @property {boolean} winning Boolean indicating whether the player won the
*       battle or not.
*   @property {number} troopID Current troop that the allies are fighting.
*   @property {boolean} canEscape Boolean indicating if the player can escape
*       this battle.
*   @property {boolean} canGameOver Boolean indicating if there a win/lose node
*       or not.
*   @property {SceneMap} battleMap The current scene used for battle map.
*   @property {MapTransitionKind} transitionStart The kind of transition for 
*       the battle start.
*   @property {MapTransitionKind} transitionEnd The kind of transition for 
*       the battle end.
*   @property {boolean} transitionZoom Boolean used for knowing when to zoom
*       in or out.
*   @property {CharacterKind} kindSelection Indicating which group is currently
*       selected.
*   @property {CharacterKind} attackingGroup Indicating which group is currently
*       attacking.
*   @property {number} step Main step of the battle.
*   @property {number} subStep Sub step of the battle (used for menus or
*       other sub-steps).
*   @property {number} selectedUserIndex Index of the selected user.
*   @property {number} distanceCenterAlly The distance between the center of map
*       battle and ally.
*   @property {number} time A chronometer.
*   @property {Player[]} targets List of all the current targets.
*   @property {Array.<Array.<Player>>} battlers Battlers of all the
*       allies/enemies.
*   @property {WindowBox} windowTopInformations The window on top that shows
*       specific informations.
*   @property {WindowBox} windowCharacterInformations The window on bot that
*       shows characteristics informations.
*   @property {WindowChoice} windowChoicesBattleCommands The window for battle
*       commands.
*   @property {WindowBox} arrowSelection The arrow used to select
*       allies/ennemies.
*   @property {GraphicText} textsDamages List of all the damages to display.
*/

class SceneBattle extends SceneMap
{
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

    constructor(troopID, canGameOver, canEscape, battleMap, transitionStart, 
        transitionEnd, transitionStartColor, transitionEndColor)
    {
        super(battleMap.idMap, true);

        this.troopID = troopID;
        this.canGameOver = canGameOver;
        this.canEscape = canEscape;
        this.sysBattleMap = battleMap;
        this.transitionStart = transitionStart;
        this.transitionEnd = transitionEnd;
        this.transitionStartColor = transitionStartColor;
        this.transitionEndColor = transitionEndColor;
        this.transitionColor = transitionStart === MapTransitionKind.Fade;
        this.transitionColorAlpha = 0;
        this.step = 0;
        this.sceneMap = RPM.gameStack.top;
        this.sceneMapCameraDistance = this.sceneMap.camera.distance;
        this.actionDoNothing = new SystemMonsterAction({});
    }

    async load()
    {
        await super.load();
        this.initialize();
    }

    // -------------------------------------------------------
    /** Initialize and correct some camera settings for the battle start.
    */
    initializeCamera()
    {
        this.camera = new Camera(this.mapProperties.cameraProperties, RPM.game
            .heroBattle);
        this.cameraStep = 0;
        this.cameraTick = SceneBattle.CAMERA_TICK;
        this.cameraOffset = SceneBattle.CAMERA_OFFSET;
        this.cameraON = this.transitionStart !== MapTransitionKind.Zoom;
        this.cameraDistance = this.camera.distance;
        this.transitionZoom = false;
        if (!this.cameraON)
        {
            this.camera.distance = SceneBattle.START_CAMERA_DISTANCE;
            this.transitionZoom = true;
        }
        this.camera.update();
    };

    // -------------------------------------------------------
    /** Make the attacking group all actives.
    */
    activeGroup()
    {
        for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; 
            i++)
        {
            this.battlers[this.attackingGroup][i].setActive(true);
        }
    }

    // -------------------------------------------------------
    /** Check if a player is defined (active and not dead).
    *   @param {CharacterKind} kind Kind of player.
    *   @param {number} index Index in the group.
    *   @returns {boolean}
    */
    isDefined(kind, index, target)
    {
        return ((target || this.battlers[kind][index].active) && !this.battlers
            [kind][index].character.isDead())
    };

    // -------------------------------------------------------
    /** Check if all the heroes or enemies are inactive
    *   @returns {boolean}
    */
    isEndTurn()
    {
        for (let i = 0, l = this.battlers[this.attackingGroup].length; i < l; 
            i++)
        {
            if (this.isDefined(this.attackingGroup, i))
            {
                return false;
            }
        }
        return true;
    }

    // -------------------------------------------------------
    /** Check if all the heroes or enemies are dead
    *   @param {CharacterKind} group Kind of player
    *   @returns {boolean}
    */
    isGroupDead(group)
    {
        for (let i = 0, l = this.battlers[group].length; i < l; i++)
        {
            if (!this.battlers[group][i].character.isDead())
            {
                return false;
            }
        }
        return true;
    };

    // -------------------------------------------------------
    /** Check if all the enemies are dead
    *   @returns {boolean}
    */
    isWin()
    {
        return this.isGroupDead(CharacterKind.Monster);
    }

    // -------------------------------------------------------
    /** Check if all the heroes are dead
    *   @returns {boolean}
    */
    isLose()
    {
        return this.isGroupDead(CharacterKind.Hero);
    }

    // -------------------------------------------------------
    /** Transition to game over scene
    */
    gameOver()
    {
        if (this.canGameOver)
        {
            RPM.gameStack.pop();
            RPM.gameStack.replace(new SceneTitleScreen()); // TODO
        } else
        {
            this.endBattle();
        }
    }

    // -------------------------------------------------------
    /** Win the battle
    */
    win()
    {
        this.endBattle();
    }

    // -------------------------------------------------------
    /** Win the battle
    */
    endBattle()
    {
        // Heroes
        for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
        {
            this.battlers[CharacterKind.Hero][i].removeFromScene();
        }
        RPM.gameStack.pop();
        RPM.currentMap = RPM.gameStack.top;
    };

    // -------------------------------------------------------

    /** Change the step of the battle
    *   @param {number} i Step of the battle
    */
    changeStep(i)
    {
        this.step = i;
        this.subStep = 0;
        this.initialize();
    }

    // -------------------------------------------------------
    /** Initialize the current step
    */
    initialize()
    {
        this.loading = true;
        this.loadInitialize();
    };

    async loadInitialize()
    {
        switch (this.step)
        {
        case 0:
            await this.initializeStep0();
            break;
        case 1:
            await this.initializeStep1();
            break;
        case 2:
            await this.initializeStep2();
            break;
        case 3:
            await this.initializeStep3();
            break;
        case 4:
            await this.initializeStep4();
            break;
        }
        this.loading = false;
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    update()
    {
        super.update();

        // Heroes
        let battlers = this.battlers[CharacterKind.Hero];
        let i, l;
        for (i = 0, l = battlers.length; i < l; i++)
        {
            battlers[i].update();
        }
        // Ennemies
        battlers = this.battlers[CharacterKind.Monster];
        for (i = 0, l = battlers.length; i < l; i++)
        {
            battlers[i].update();
        }

        // Camera temp code for moving
        this.moveStandardCamera();

        switch(this.step)
        {
        case 0:
            this.updateStep0();
            break;
        case 1:
            this.updateStep1();
            break;
        case 2:
            this.updateStep2();
            break;
        case 3:
            this.updateStep3();
            break;
        case 4:
            this.updateStep4();
            break;
        }
    }

    // -------------------------------------------------------
    /** Do camera standard moves
    */
    moveStandardCamera()
    {
        if (this.cameraON)
        {
            switch (this.cameraStep)
            {
            case 0:
                this.camera.distance -= this.cameraTick;
                this.camera.targetOffset.x += this.cameraTick;
                if (this.camera.distance <= this.cameraDistance - this
                    .cameraOffset) 
                {
                    this.camera.distance = this.cameraDistance - this
                        .cameraOffset;
                    this.camera.targetOffset.x = this.cameraOffset;
                    this.cameraStep = 1;
                }
                break;
            case 1:
                this.camera.distance += this.cameraTick;
                if (this.camera.distance >= this.cameraDistance + this
                    .cameraOffset) 
                {
                    this.camera.distance = this.cameraDistance + this
                        .cameraOffset;
                    this.cameraStep = 2;
                }
                break;
            case 2:
                this.camera.distance -= this.cameraTick;
                this.camera.targetOffset.x -= this.cameraTick;
                if (this.camera.distance <= this.cameraDistance - this
                    .cameraOffset) 
                {
                    this.camera.distance = this.cameraDistance - this
                        .cameraOffset;
                    this.camera.targetOffset.x = -this.cameraOffset;
                    this.cameraStep = 3;
                }
                break;
            case 3:
                this.camera.distance += this.cameraTick;
                if (this.camera.distance >= this.cameraDistance + this
                    .cameraOffset) 
                {
                    this.camera.distance = this.cameraDistance + this
                        .cameraOffset;
                    this.cameraStep = 4;
                }
                break;
            case 4:
                this.camera.distance -= this.cameraTick;
                this.camera.targetOffset.x += this.cameraTick;
                if (this.camera.distance <= this.cameraDistance)
                {
                    this.camera.distance = this.cameraDistance;
                    this.camera.targetOffset.x = 0;
                    this.cameraStep = 0;
                }
                break;
            }
        }
    }

    // -------------------------------------------------------

    onKeyPressed(key)
    {
        switch (this.step)
        {
        case 0:
            this.onKeyPressedStep0(key);
            break;
        case 1:
            this.onKeyPressedStep1(key);
            break;
        case 2:
            this.onKeyPressedStep2(key);
            break;
        case 3:
            this.onKeyPressedStep3(key);
            break;
        case 4:
            this.onKeyPressedStep4(key);
            break;
        }
        super.onKeyPressed(key);
    }

    // -------------------------------------------------------

    onKeyReleased(key)
    {
        switch (this.step)
        {
        case 0:
            this.onKeyReleasedStep0(key);
            break;
        case 1:
            this.onKeyReleasedStep1(key);
            break;
        case 2:
            this.onKeyReleasedStep2(key);
            break;
        case 3:
            this.onKeyReleasedStep3(key);
            break;
        case 4:
            this.onKeyReleasedStep4(key);
            break;
        }
        super.onKeyReleased(key);
    }

    // -------------------------------------------------------

    onKeyPressedRepeat(key)
    {
        switch (this.step)
        {
        case 0:
            this.onKeyPressedRepeatStep0(key);
            break;
        case 1:
            this.onKeyPressedRepeatStep1(key);
            break;
        case 2:
            this.onKeyPressedRepeatStep2(key);
            break;
        case 3:
            this.onKeyPressedRepeatStep3(key);
            break;
        case 4:
            this.onKeyPressedRepeatStep4(key);
            break;
        }
        super.onKeyPressedRepeat(key);
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(key)
    {
        switch (this.step)
        {
        case 0:
            this.onKeyPressedAndRepeatStep0(key);
            break;
        case 1:
            this.onKeyPressedAndRepeatStep1(key);
            break;
        case 2:
            this.onKeyPressedAndRepeatStep2(key);
            break;
        case 3:
            this.onKeyPressedAndRepeatStep3(key);
            break;
        case 4:
            this.onKeyPressedAndRepeatStep4(key);
            break;
        }
        super.onKeyPressedAndRepeat(key);
    }

    // -------------------------------------------------------

    draw3D()
    {
        if (this.transitionZoom || this.transitionColor)
        {
            this.sceneMap.draw3D();
        } else {
            super.draw3D();
        }
    }

    // -------------------------------------------------------

    drawHUD()
    {
        switch (this.step)
        {
        case 0:
            this.drawHUDStep0();
            break;
        case 1:
            this.drawHUDStep1();
            break;
        case 2:
            this.drawHUDStep2();
            break;
        case 3:
            this.drawHUDStep3();
            break;
        case 4:
            this.drawHUDStep4();
            break;
        }
        super.drawHUD();
    }
}