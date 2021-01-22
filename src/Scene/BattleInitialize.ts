
/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene, Graphic, Manager, Datas, System } from "..";
import { Enum, Constants, ScreenResolution, Platform } from "../Common";
import CharacterKind = Enum.CharacterKind;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import SongKind = Enum.SongKind;
import MapTransitionKind = Enum.MapTransitionKind;
import BattleStep = Enum.BattleStep;
import { Vector3, Player, Battler, Position, WindowBox, WindowChoices, Game } from "../Core";
import { StructTroopElement } from "../System";

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
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.selectedUserIndex = 0;
        this.battle.selectedTargetIndex = 0;
        this.battle.battleCommandKind = EffectSpecialActionKind.None;
        this.battle.targets = [];
        this.battle.battlers = new Array(2);
        this.battle.graphicPlayers = new Array(2);
        this.battle.time = new Date().getTime();
        this.battle.turn = 1;
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
        let l = Game.current.teamHeroes.length;
        this.battle.battlers[CharacterKind.Hero] = new Array(l);
        this.battle.graphicPlayers[CharacterKind.Hero] = new Array(l);
        let position: Vector3, player: Player, battler: Battler;
        for (let i = 0; i < l; i++) {
            // Battlers
            position = new Vector3(Game.current.heroBattle.position.x + (2
                * Datas.Systems.SQUARE_SIZE) + (i * Datas.Systems.SQUARE_SIZE / 
                2), Game.current.heroBattle.position.y, Game.current
                .heroBattle.position.z - Datas.Systems.SQUARE_SIZE + (i * Datas
                .Systems.SQUARE_SIZE));
            player = Game.current.teamHeroes[i];
            battler = new Battler(player, Position.createFromVector3(position), 
                this.battle.camera);
            battler.updateDead(false);
            player.battler = battler;
            battler.addToScene();
            this.battle.battlers[CharacterKind.Hero][i] = battler;

            // Graphic player
            this.battle.graphicPlayers[CharacterKind.Hero][i] = new Graphic
                .Player(player);
        }
    }

    /** 
     *  Initialize enemies battlers.
     */
    initializeEnemiesBattlers() {
        let troop = Datas.Troops.get(this.battle.troopID);
        let l = troop.list.length;
        this.battle.battlers[CharacterKind.Monster] = new Array(l);
        this.battle.graphicPlayers[CharacterKind.Monster] = new Array(l);
        let troopElement: StructTroopElement, position: Vector3, player: Player,
            battler: Battler;
        for (let i = 0; i < l; i++) {
            // Battlers
            troopElement = troop.list[i];
            position = new Vector3(Game.current.heroBattle.position.x - (2
                * Datas.Systems.SQUARE_SIZE) - (i * Datas.Systems.SQUARE_SIZE * 
                3 / 4), Game.current.heroBattle.position.y, Game.current
                .heroBattle.position.z - Datas.Systems.SQUARE_SIZE + (i * Datas
                    .Systems.SQUARE_SIZE));
            player = new Player(CharacterKind.Monster, troopElement.id, Game
                .current.charactersInstances++, [], []);
            player.instanciate(troopElement.level);
            battler = new Battler(player, Position.createFromVector3(position), 
                this.battle.camera);
            player.battler = battler;
            battler.addToScene();
            this.battle.battlers[CharacterKind.Monster][i] = battler;

            // Graphic player
            this.battle.graphicPlayers[CharacterKind.Monster][i] = new Graphic
                .Player(player, true);
        
        }
    }

    /** 
     *  Initialize informations (boxes).
     */
    initializeInformation() {
        this.battle.windowTopInformations = new WindowBox(0, Constants
            .HUGE_SPACE, ScreenResolution.SCREEN_X, WindowBox.SMALL_SLOT_HEIGHT,
            {
                padding: WindowBox.SMALL_SLOT_PADDING
            }
        );
        this.battle.windowUserInformations = new WindowBox(ScreenResolution
            .SCREEN_X - Scene.Battle.WINDOW_PROFILE_WIDTH, ScreenResolution
            .SCREEN_Y - Scene.Battle.WINDOW_PROFILE_HEIGHT, Scene.Battle
            .WINDOW_PROFILE_WIDTH, Scene.Battle.WINDOW_PROFILE_HEIGHT,
            {
                padding: WindowBox.SMALL_PADDING_BOX,
                limitContent: false
            }
        );
        this.battle.windowTargetInformations = new WindowBox(0, ScreenResolution
            .SCREEN_Y - Scene.Battle.WINDOW_PROFILE_HEIGHT, Scene.Battle
            .WINDOW_PROFILE_WIDTH, Scene.Battle.WINDOW_PROFILE_HEIGHT,
            {
                padding: WindowBox.SMALL_PADDING_BOX,
                limitContent: false
            }
        );
    }

    /**
     *  Initialize window commands.
     */
    public initializeWindowCommands() {
        let l = Datas.BattleSystems.battleCommandsOrder.length;
        let listContent: Graphic.TextIcon[] = new Array(l);
        let listCallbacks = new Array(l);
        let skill: System.Skill;
        for (let i = 0; i < l; i++) {
            skill = Datas.Skills.get(Datas.BattleSystems.battleCommandsOrder[i]);
            listContent[i] = new Graphic.TextIcon(skill.name(), skill.pictureID);
            listContent[i].system = skill;
            listCallbacks[i] = System.CommonSkillItem.prototype.useCommand;
        }
        this.battle.windowChoicesBattleCommands = new WindowChoices(Constants
            .HUGE_SPACE, ScreenResolution.SCREEN_Y - Constants.HUGE_SPACE - (l * 
            WindowBox.SMALL_SLOT_HEIGHT), Scene.Battle.WINDOW_COMMANDS_WIDTH, 
            WindowBox.SMALL_SLOT_HEIGHT, listContent, {
                nbItemsMax: Scene.Battle.COMMANDS_NUMBER,
                listCallbacks: listCallbacks
            }
        );
        this.battle.windowChoicesSkills = new WindowChoices(Scene.Battle
            .WINDOW_COMMANDS_SELECT_X, Scene.Battle.WINDOW_COMMANDS_SELECT_Y,
            Scene.Battle.WINDOW_COMMANDS_SELECT_WIDTH, WindowBox
            .SMALL_SLOT_HEIGHT, [], {
                nbItemsMax: Scene.Battle.COMMANDS_NUMBER
            }
        );
        this.battle.windowSkillDescription = new WindowBox(ScreenResolution
            .SCREEN_X - Scene.Battle.WINDOW_DESCRIPTIONS_X, Scene.Battle
            .WINDOW_DESCRIPTIONS_Y, Scene.Battle.WINDOW_DESCRIPTIONS_WIDTH, 
            Scene.Battle.WINDOW_DESCRIPTIONS_HEIGHT, {
                padding: WindowBox.HUGE_PADDING_BOX
            }
        );
        this.battle.windowChoicesItems = new WindowChoices(Scene.Battle
            .WINDOW_COMMANDS_SELECT_X, Scene.Battle.WINDOW_COMMANDS_SELECT_Y,
            Scene.Battle.WINDOW_COMMANDS_SELECT_WIDTH, WindowBox
            .SMALL_SLOT_HEIGHT, [], {
                nbItemsMax: Scene.Battle.COMMANDS_NUMBER
            }
        );
        this.battle.windowItemDescription = new WindowBox(ScreenResolution
            .SCREEN_X - Scene.Battle.WINDOW_DESCRIPTIONS_X, Scene.Battle
            .WINDOW_DESCRIPTIONS_Y, Scene.Battle.WINDOW_DESCRIPTIONS_WIDTH, 
            Scene.Battle.WINDOW_DESCRIPTIONS_HEIGHT, {
                padding: WindowBox.HUGE_PADDING_BOX
            }
        );
    }

    // -------------------------------------------------------
    /** Initialize windows end
    */
    initializeWindowsEnd() {
        this.battle.windowExperienceProgression = new WindowBox(Scene.Battle
            .WINDOW_EXPERIENCE_X, Scene.Battle.WINDOW_EXPERIENCE_Y, Scene.Battle
            .WINDOW_EXPERIENCE_WIDTH, (Scene.Battle.WINDOW_EXPERIENCE_HEIGHT * 
            Game.current.teamHeroes.length) + WindowBox.SMALL_PADDING_BOX[
            2] + WindowBox.SMALL_PADDING_BOX[3], {
                content: new Graphic.XPProgression(),
                padding: WindowBox.SMALL_PADDING_BOX
            }
        );
        this.battle.windowStatisticProgression = new WindowBox(Scene.Battle
            .WINDOW_STATS_X, Scene.Battle.WINDOW_STATS_Y, Scene.Battle
            .WINDOW_STATS_WIDTH, Scene.Battle.WINDOW_STATS_HEIGHT, {
                padding: WindowBox.HUGE_PADDING_BOX
            }
        );
    }

    /** 
     *  Initialize musics.
     */
    initializeMusic() {
        this.battle.musicMap = System.PlaySong.currentPlayingMusic;
        let song = Manager.Songs.current[SongKind.Music];
        this.battle.musicMapTime = song === null ? 0 : song.seek() / Constants
            .ONE_SECOND_MILLI;
        Datas.BattleSystems.battleMusic.playMusic();
    }

    /** 
     *  Update the battle.
     */
    update() {
        Manager.Stack.requestPaintHUD = true;
        if (this.battle.transitionStart === MapTransitionKind.Fade) {
            this.updateTransitionStartFade();
        } else if (this.battle.transitionStart === MapTransitionKind.Zoom) {
            this.updateTransitionStartZoom();
        } else {
            this.battle.changeStep(1);
        }
    }

    /** 
     * Update transtion start fade.
     */
    public updateTransitionStartFade() {
        if (this.battle.transitionColor) {
            this.battle.transitionColorAlpha += Scene.Battle
                .TRANSITION_COLOR_VALUE;
            if (this.battle.transitionColorAlpha >= 1) {
                this.battle.transitionColorAlpha = 1;
                this.battle.transitionColor = false;
                this.battle.timeTransition = new Date().getTime();
                this.battle.updateBackgroundColor();
            }
            return;
        }
        if (new Date().getTime() - this.battle.timeTransition < Scene.Battle
            .TRANSITION_COLOR_END_WAIT) {
            return;
        }
        if (this.battle.transitionColorAlpha > 0) {
            this.battle.transitionColorAlpha -= Scene.Battle
                .TRANSITION_COLOR_VALUE;
            if (this.battle.transitionColorAlpha <= 0) {
                this.battle.transitionColorAlpha = 0;
            }
            return;
        }
        this.battle.changeStep(BattleStep.Selection);
    }

    /**
     *  Update transition start zoom.
     */
    public updateTransitionStartZoom() {
        let offset: number;
        if (this.battle.transitionZoom) {
            this.battle.sceneMap.camera.distance = ((this.battle
                .mapCameraDistance - Scene.Battle.START_CAMERA_DISTANCE) * (1 - 
                ((new Date().getTime() - this.battle.time) / Scene.Battle
                .TRANSITION_ZOOM_TIME))) + Scene.Battle.START_CAMERA_DISTANCE;
            if (this.battle.sceneMap.camera.distance <= Scene.Battle
                .START_CAMERA_DISTANCE) {
                this.battle.sceneMap.camera.distance = Scene.Battle
                    .START_CAMERA_DISTANCE;
                this.battle.transitionZoom = false;
                this.battle.updateBackgroundColor();
                this.battle.time = new Date().getTime();
            }
            this.battle.sceneMap.camera.update();
            return;
        }
        if (this.battle.camera.distance < this.battle.cameraDistance) {
            offset = Scene.Battle.START_CAMERA_DISTANCE / this.battle
                .cameraDistance * Scene.Battle.TRANSITION_ZOOM_TIME;
            this.battle.camera.distance = (((new Date().getTime() - this.battle
                .time) - offset) / (Scene.Battle.TRANSITION_ZOOM_TIME - offset))
                * this.battle.cameraDistance;
            if (this.battle.camera.distance >= this.battle.cameraDistance) {
                this.battle.camera.distance = this.battle.cameraDistance;
                this.battle.cameraON = true;
            } else {
                return;
            }
        }
        this.battle.changeStep(BattleStep.Selection);
    }
    
    /** 
     *  Handle key pressed.
     *   @param {number} key - The key ID 
     */
    onKeyPressedStep(key: number) {

    }

    /** 
     *  Handle key released.
     *  @param {number} key - The key ID 
     */
    onKeyReleasedStep(key: number) {

    }

    /** 
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key: number): boolean {
        return true;
    }

    /** 
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key: number): boolean {
        return true;
    }

    /** 
     *  Draw the battle HUD
    */
    drawHUDStep() {
        if (this.battle.transitionStart === 1) {
            Platform.ctx.fillStyle = Constants.STRING_RGBA + Constants
                .STRING_PARENTHESIS_LEFT + this.battle.transitionStartColor.red 
                + Constants.STRING_COMA + this.battle.transitionStartColor.green
                + Constants.STRING_COMA + this.battle.transitionStartColor.blue 
                + Constants.STRING_COMA + this.battle.transitionColorAlpha + 
                Constants.STRING_PARENTHESIS_RIGHT;
            Platform.ctx.fillRect(0, 0, ScreenResolution.CANVAS_WIDTH, 
                ScreenResolution.CANVAS_HEIGHT);
        }
    }

}

export { BattleInitialize }