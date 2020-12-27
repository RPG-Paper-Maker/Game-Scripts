
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from "..";


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
    
    initialize() {
        RPM.escaped = false;
        this.battle.winning = false;
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.selectedUserIndex = 0;
        this.battle.selectedTargetIndex = 0;
        this.battle.battleCommandKind = EffectSpecialActionKind.None;
        this.battle.targets = [];
        this.battle.damages = [];
        this.battle.battlers = new Array(2);
        this.battle.graphicPlayers = new Array(2) as Player[];
        this.battle.time = new Date().getTime();
        this.battle.turn = 1;
        this.initializeAlliesBattlers();
        this.initializeEnemiesBattlers();
        this.initializeInformation();
        this.initializeWindowCommands();
        this.initializeWindowsEnd();
        this.initializeMusic();
    }

    initializeAlliesBattlers() {
        let l = RPM.game.teamHeroes.length;
        this.battle.battlers[CharacterKind.Hero] = new Array(l);
        this.battle.graphicPlayers[CharacterKind.Hero] = new Array(l);
        let position, character, battler;
        for (let i = 0; i < l; i++) {
            // Battlers
            position = new THREE.Vector3(RPM.game.heroBattle.position.x + (2 *
                RPM.SQUARE_SIZE) + (i * RPM.SQUARE_SIZE / 2), RPM.game
                    .heroBattle.position.y, RPM.game.heroBattle.position.z - RPM
                        .SQUARE_SIZE + (i * RPM.SQUARE_SIZE));
            character = RPM.game.teamHeroes[i];
            battler = new Battler(character, position, this.camera);
            battler.updateDead(false);
            character.battler = battler;
            battler.addToScene();
            this.battle.battlers[CharacterKind.Hero][i] = battler;

            // Graphic player
            this.battle.graphicPlayers[CharacterKind.Hero][i] = {
                user: new Player(battler.character, false),
                target: new Player(battler.character, true)
            };
        }
    }

    public  initializeEnemiesBattlers() {
        let troop = RPM.datasGame.troops.list[this.troopID];
        let l = troop.list.length;
        this.battle.battlers[CharacterKind.Monster] = new Array(l);
        this.battle.graphicPlayers[CharacterKind.Monster] = new Array(l);
        let enemy, position, instancied, battler;
        for (let i = 0; i < l; i++) {
            // Battlers
            enemy = troop.list[i];
            position = new THREE.Vector3(RPM.game.heroBattle.position.x - (2 *
                RPM.SQUARE_SIZE) - (i * RPM.SQUARE_SIZE * 3 / 4), RPM.game
                    .heroBattle.position.y, RPM.game.heroBattle.position.z - RPM
                        .SQUARE_SIZE + (i * RPM.SQUARE_SIZE));
            instancied = new GamePlayer(CharacterKind.Monster, enemy.id, RPM
                .game.charactersInstances++, []);
            instancied.instanciate(enemy.level);
            battler = new Battler(instancied, position, this.battle.camera);
            instancied.battler = battler;
            battler.addToScene();
            this.battle.battlers[CharacterKind.Monster][i] = battler;

            // Graphic player
            this.battle.graphicPlayers[CharacterKind.Monster][i] = {
                target: new Player(battler.character, true)
            };
        }
    }

    public initializeInformation() {
        this.battle.windowTopInformations = new WindowBox(0, RPM.HUGE_SPACE, RPM.SCREEN_X,
            RPM.SMALL_SLOT_HEIGHT,
            {
                padding: RPM.SMALL_SLOT_PADDING
            }
        );
        this.battle.windowUserInformations = new WindowBox(RPM.SCREEN_X - Battle
            .WINDOW_PROFILE_WIDTH, RPM.SCREEN_Y - Battle.WINDOW_PROFILE_HEIGHT,
            Battle.WINDOW_PROFILE_WIDTH, Battle.WINDOW_PROFILE_HEIGHT,
            {
                padding: RPM.SMALL_PADDING_BOX,
                limitContent: false
            }
        );
        this.battle.windowTargetInformations = new WindowBox(0, RPM.SCREEN_Y - Battle
            .WINDOW_PROFILE_HEIGHT, Battle.WINDOW_PROFILE_WIDTH, Battle
            .WINDOW_PROFILE_HEIGHT,
            {
                padding: RPM.SMALL_PADDING_BOX,
                limitContent: false
            }
        );
    }

    public initializeWindowCommands() {
        let l = RPM.datasGame.battleSystem.battleCommandsOrder.length;
        let listContent = new Array(l);
        let listCallbacks = new Array(l);
        let skill;
        for (let i = 0; i < l; i++) {
            skill = RPM.datasGame.skills.list[RPM.datasGame.battleSystem
                .battleCommandsOrder[i]];
            listContent[i] = new GraphicTextIcon(skill.name(), skill.pictureID);
            listContent[i].skill = skill;
            listCallbacks[i] = CommonSkillItem.prototype.useCommand;
        }
        this.battle.windowChoicesBattleCommands = new WindowChoices(RPM.HUGE_SPACE,
            RPM.SCREEN_Y - RPM.HUGE_SPACE - (l * RPM.SMALL_SLOT_HEIGHT),
            Battle.WINDOW_COMMANDS_WIDTH, RPM.SMALL_SLOT_HEIGHT,
            listContent,
            {
                nbItemsMax: Battle.COMMANDS_NUMBER,
                listCallbacks: listCallbacks
            }
        );
        this.battle.windowChoicesSkills = new WindowChoices(Battle
            .WINDOW_COMMANDS_SELECT_X, Battle.WINDOW_COMMANDS_SELECT_Y,
            Battle.WINDOW_COMMANDS_SELECT_WIDTH, RPM.SMALL_SLOT_HEIGHT, [],
            {
                nbItemsMax: Battle.COMMANDS_NUMBER
            }
        );
        this.battle.windowSkillDescription = new WindowBox(RPM.SCREEN_X - Battle
            .WINDOW_DESCRIPTIONS_X, Battle.WINDOW_DESCRIPTIONS_Y,
            Battle.WINDOW_DESCRIPTIONS_WIDTH, Battle
            .WINDOW_DESCRIPTIONS_HEIGHT,
            {
                padding: RPM.HUGE_PADDING_BOX
            }
        );
        this.battle.windowChoicesItems = new WindowChoices(Battle
            .WINDOW_COMMANDS_SELECT_X, Battle.WINDOW_COMMANDS_SELECT_Y,
            Battle.WINDOW_COMMANDS_SELECT_WIDTH, RPM.SMALL_SLOT_HEIGHT, [],
            {
                nbItemsMax: Battle.COMMANDS_NUMBER
            }
        );
        this.battle.windowItemDescription = new WindowBox(RPM.SCREEN_X - Battle
            .WINDOW_DESCRIPTIONS_X, Battle.WINDOW_DESCRIPTIONS_Y,
            Battle.WINDOW_DESCRIPTIONS_WIDTH, Battle
            .WINDOW_DESCRIPTIONS_HEIGHT,
            {
                padding: RPM.HUGE_PADDING_BOX
            }
        );
    }

     public async initializeWindowsEnd() {
        this.battle.windowExperienceProgression = new WindowBox(Battle
            .WINDOW_EXPERIENCE_X, Battle.WINDOW_EXPERIENCE_Y, Battle
            .WINDOW_EXPERIENCE_WIDTH, (Battle.WINDOW_EXPERIENCE_HEIGHT * RPM
                .game.teamHeroes.length) + RPM.SMALL_PADDING_BOX[2] + RPM
                    .SMALL_PADDING_BOX[3],
            {
                content: new GraphicXPProgression(),
                padding: RPM.SMALL_PADDING_BOX
            }
        );
        this.battle.windowStatisticProgression = new WindowBox(Battle.WINDOW_STATS_X,
            Battle.WINDOW_STATS_Y, Battle.WINDOW_STATS_WIDTH, Battle
            .WINDOW_STATS_HEIGHT,
            {
                padding: RPM.HUGE_PADDING_BOX
            }
        );
    }

    // -------------------------------------------------------
    /** Initialize musics
    */
    public initializeMusic() {
        Battle.musicMap = PlaySong.currentPlayingMusic;
        let song = RPM.songsManager.currentSong[SongKind.Music];
        Battle.musicMapTime = song === null ? 0 : song.seek() / RPM
            .ONE_SECOND_MILLI;
        RPM.datasGame.battleSystem.battleMusic.playMusic();
    }


    public update() {
        RPM.requestPaintHUD = true;

        if (this.transitionStart === MapTransitionKind.Fade) {
            this.updateTransitionStartFade();
        } else if (this.transitionStart === MapTransitionKind.Zoom) {
            this.updateTransitionStartZoom();
        } else {
            this.battle.changeStep(1);
        }
    }

    /** 
     * Update transtion start fade
    */

    public updateTransitionStartFade() {
        if (this.battle.transitionColor) {
            this.battle.transitionColorAlpha += Battle.TRANSITION_COLOR_VALUE;
            if (this.battle.transitionColorAlpha >= 1) {
                this.battle.transitionColorAlpha = 1;
                this.battle.transitionColor = false;
                this.battle.timeTransition = new Date().getTime();
                this.battle.updateBackgroundColor();
            }
            return;
        }
        if (new Date().getTime() - this.battle.timeTransition < Battle
            .TRANSITION_COLOR_END_WAIT) {
            return;
        }
        if (this.battle.transitionColorAlpha > 0) {
            this.battle.transitionColorAlpha -= Battle.TRANSITION_COLOR_VALUE;
            if (this.battle.transitionColorAlpha <= 0) {
                this.battle.transitionColorAlpha = 0;
            }
            return;
        }
        this.changeStep(1); //TODO: Change to Main Battle Change Step
    }

    /**
     * Update transition start zoom
    /
    public updateTransitionStartZoom() {
        let offset;
        if (this.transitionZoom) {
            this.sceneMap.camera.distance = ((this.sceneMapCameraDistance -
                Battle.START_CAMERA_DISTANCE) * (1 - ((new Date().getTime() -
                    this.time) / Battle.TRANSITION_ZOOM_TIME))) + Battle
                    .START_CAMERA_DISTANCE;
            if (this.sceneMap.camera.distance <= Battle.START_CAMERA_DISTANCE) {
                this.sceneMap.camera.distance = Battle.START_CAMERA_DISTANCE;
                this.transitionZoom = false;
                this.updateBackgroundColor();
                this.time = new Date().getTime();
            }
            this.sceneMap.camera.update();
            return;
        }
        if (this.camera.distance < this.cameraDistance) {
            offset = Battle.START_CAMERA_DISTANCE / this.cameraDistance *
                Battle.TRANSITION_ZOOM_TIME;
            this.camera.distance = (((new Date().getTime() - this.time) - offset) /
                (Battle.TRANSITION_ZOOM_TIME - offset)) * this.cameraDistance;
            if (this.camera.distance >= this.cameraDistance) {
                this.camera.distance = this.cameraDistance;
                this.cameraON = true;
            } else {
                return;
            }
        }
        this.changeStep(1);
    }
    
    // -------------------------------------------------------
    /** Handle key pressed
    *   @param {number} key The key ID 
    */
    onKeyPressedStep = function (key) {

    }

    // -------------------------------------------------------
    /** Handle key released
    *   @param {number} key The key ID 
    */
    onKeyReleasedStep = function (key) {

    }

    // -------------------------------------------------------
    /** Handle key repeat pressed
    *   @param {number} key The key ID 
    */
    onKeyPressedRepeatStep = function (key) {

    }

    // -------------------------------------------------------
    /** Handle key pressed and repeat
    *   @param {number} key The key ID 
    */
    public onKeyPressedAndRepeatStep = function (key) {


    }

    // -------------------------------------------------------
    /** Draw the battle HUD
    */
    drawHUDStep = function () {
        if (this.transitionStart === 1) {
            Platform.ctx.fillStyle = RPM.STRING_RGBA + RPM.STRING_PARENTHESIS_LEFT +
                this.transitionStartColor.red + RPM.STRING_COMA + this
                    .transitionStartColor.green + RPM.STRING_COMA + this
                        .transitionStartColor.blue + RPM.STRING_COMA + this
                    .transitionColorAlpha + RPM.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        }
    }

}

export { BattleInitialize }