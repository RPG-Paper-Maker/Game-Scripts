/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 0 : Initialization of the battle, camera movment (transition),
//  allies/ennemies comming.
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep0 = function() {
    this.winning = false;
    this.kindSelection = CharacterKind.Hero;
    this.selectedUserIndex = 0;
    this.selectedTargetIndex = 0;
    this.battleCommandKind = EffectSpecialActionKind.None;
    this.targets = [];
    this.damages = [];
    this.battlers = new Array(2);
    this.graphicPlayers = new Array(2);
    this.time = new Date().getTime();
    this.turn = 1;

    this.initializeAlliesBattlers();
    this.initializeEnemiesBattlers();
    this.initializeInformations();
    this.initializeWindowCommands();
    this.initializeMusics();
    this.initializeWindowsEnd();
};

// -------------------------------------------------------

SceneBattle.prototype.initializeAlliesBattlers = function() {
    var i, l, position, battler, character;

    l = RPM.game.teamHeroes.length;
    this.battlers[CharacterKind.Hero] = new Array(l);
    this.graphicPlayers[CharacterKind.Hero] = new Array(l);
    for (i = 0; i < l; i++) {

        // Battlers
        position = new THREE.Vector3(RPM.game.heroBattle.position.x + (2 *
            RPM.SQUARE_SIZE) + (i * RPM.SQUARE_SIZE / 2), RPM.game.heroBattle.position.y, 
            RPM.game.heroBattle.position.z - RPM.SQUARE_SIZE + (i * RPM.SQUARE_SIZE));
        character = RPM.game.teamHeroes[i];
        battler = new Battler(character, position, this.camera);
        character.battler = battler;
        battler.addToScene();
        this.battlers[CharacterKind.Hero][i] = battler;

        // Graphic player
        this.graphicPlayers[CharacterKind.Hero][i] = {
            user: new GraphicPlayer(battler.character, false),
            target: new GraphicPlayer(battler.character, true)
        };
    }
};

// -------------------------------------------------------

SceneBattle.prototype.initializeEnemiesBattlers = function() {
    var i, l, troop, enemy, position, instancied, battler;

    troop = RPM.datasGame.troops.list[this.troopID];
    l = troop.list.length;
    this.battlers[CharacterKind.Monster] = new Array(l);
    this.graphicPlayers[CharacterKind.Monster] = new Array(l);
    for (i = 0; i < l; i++) {

        // Battlers
        enemy = troop.list[i];
        position = new THREE.Vector3(RPM.game.heroBattle.position.x - (2 *
            RPM.SQUARE_SIZE) - (i * RPM.SQUARE_SIZE * 3 / 4), RPM.game.heroBattle
            .position.y, RPM.game.heroBattle.position.z - RPM.SQUARE_SIZE + (i *
            RPM.SQUARE_SIZE));
        instancied = new GamePlayer(CharacterKind.Monster, enemy.id, RPM.game
            .charactersInstances++, []);
        instancied.instanciate(enemy.level);
        battler = new Battler(instancied, position, this.camera);
        instancied.battler = battler;
        battler.addToScene();
        this.battlers[CharacterKind.Monster][i] = battler;

        // Graphic player
        this.graphicPlayers[CharacterKind.Monster][i] = {
            target: new GraphicPlayer(battler.character, true)
        };
    }
};

// -------------------------------------------------------

SceneBattle.prototype.initializeInformations = function() {
    this.windowTopInformations = new WindowBox(0, RPM.HUGE_SPACE, RPM.SCREEN_X, RPM
        .SMALL_SLOT_HEIGHT, null, RPM.SMALL_SLOT_PADDING);
    this.windowUserInformations = new WindowBox(RPM.SCREEN_X - SceneBattle
        .WINDOW_PROFILE_WIDTH, RPM.SCREEN_Y - SceneBattle.WINDOW_PROFILE_HEIGHT,
        SceneBattle.WINDOW_PROFILE_WIDTH, SceneBattle.WINDOW_PROFILE_HEIGHT, 
        null, RPM.SMALL_PADDING_BOX, false);
    this.windowTargetInformations = new WindowBox(0, RPM.SCREEN_Y - SceneBattle
        .WINDOW_PROFILE_HEIGHT, SceneBattle.WINDOW_PROFILE_WIDTH, SceneBattle
        .WINDOW_PROFILE_HEIGHT, null, RPM.SMALL_PADDING_BOX, false);
};

// -------------------------------------------------------

SceneBattle.prototype.initializeWindowCommands = function() {
    var i, l, listContent, listCallbacks, skill;

    l = RPM.datasGame.battleSystem.battleCommandsOrder.length;
    listContent = new Array(l);
    listCallbacks = new Array(l);
    for (i = 0; i < l; i++) {
        skill = RPM.datasGame.skills.list[RPM.datasGame.battleSystem
            .battleCommandsOrder[i]];
        listContent[i] = new GraphicTextIcon(skill.name, skill.pictureID);
        listContent[i].skill = skill;
        listCallbacks[i] = SystemCommonSkillItem.prototype.useCommand;
    }
    this.windowChoicesBattleCommands = new WindowChoices(OrientationWindow
        .Vertical, RPM.HUGE_SPACE, RPM.SCREEN_Y - RPM.HUGE_SPACE - (l * RPM
        .SMALL_SLOT_HEIGHT), SceneBattle.WINDOW_COMMANDS_WIDTH, RPM
        .SMALL_SLOT_HEIGHT, SceneBattle.COMMANDS_NUMBER, listContent, 
        listCallbacks, RPM.SMALL_SLOT_PADDING);
    this.windowChoicesSkills = new WindowChoices(OrientationWindow.Vertical, 
        SceneBattle.WINDOW_COMMANDS_SELECT_X, SceneBattle
        .WINDOW_COMMANDS_SELECT_Y, SceneBattle.WINDOW_COMMANDS_SELECT_WIDTH, RPM
        .SMALL_SLOT_HEIGHT, SceneBattle.COMMANDS_NUMBER, [], null, RPM
        .SMALL_SLOT_PADDING);
    this.windowSkillDescription = new WindowBox(RPM.SCREEN_X - SceneBattle
        .WINDOW_DESCRIPTIONS_X, SceneBattle.WINDOW_DESCRIPTIONS_Y, SceneBattle
        .WINDOW_DESCRIPTIONS_WIDTH, SceneBattle.WINDOW_DESCRIPTIONS_HEIGHT, null
        , RPM.HUGE_PADDING_BOX);
    this.windowChoicesItems = new WindowChoices(OrientationWindow.Vertical, 
        SceneBattle.WINDOW_COMMANDS_SELECT_X, SceneBattle
        .WINDOW_COMMANDS_SELECT_Y, SceneBattle.WINDOW_COMMANDS_SELECT_WIDTH, RPM
        .SMALL_SLOT_HEIGHT, SceneBattle.COMMANDS_NUMBER, [], null, RPM
        .SMALL_SLOT_PADDING);
    this.windowItemDescription = new WindowBox(RPM.SCREEN_X - SceneBattle
        .WINDOW_DESCRIPTIONS_X, SceneBattle.WINDOW_DESCRIPTIONS_Y, SceneBattle
        .WINDOW_DESCRIPTIONS_WIDTH, SceneBattle.WINDOW_DESCRIPTIONS_HEIGHT, null
        , RPM.HUGE_PADDING_BOX);
};

// -------------------------------------------------------

SceneBattle.prototype.initializeMusics = function() {
    SceneBattle.musicMap = SystemPlaySong.currentPlayingMusic;
    let song = RPM.songsManager.currentSong[SongKind.Music];
    SceneBattle.musicMapTime = song === null ? 0 : song.seek() / RPM
        .ONE_SECOND_MILLI;
    RPM.datasGame.battleSystem.battleMusic.playSong();
};


// -------------------------------------------------------

SceneBattle.prototype.initializeWindowsEnd = function() {
    this.windowExperienceProgression = new WindowBox(SceneBattle
        .WINDOW_EXPERIENCE_X, SceneBattle.WINDOW_EXPERIENCE_Y, SceneBattle
        .WINDOW_EXPERIENCE_WIDTH, (SceneBattle.WINDOW_EXPERIENCE_HEIGHT * RPM.game
        .teamHeroes.length) + RPM.SMALL_PADDING_BOX[2] + RPM.SMALL_PADDING_BOX
        [3], new GraphicXPProgression(), RPM.SMALL_PADDING_BOX);
    this.windowStatisticProgression = new WindowBox(SceneBattle.WINDOW_STATS_X, 
        SceneBattle.WINDOW_STATS_Y, SceneBattle.WINDOW_STATS_WIDTH, SceneBattle
        .WINDOW_STATS_HEIGHT, null, RPM.HUGE_PADDING_BOX);
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep0 = function() {
    RPM.requestPaintHUD = true;

    if (this.transitionStart === MapTransitionKind.Fade)
    {
        this.updateTransitionStartFade();
    } else if (this.transitionStart === MapTransitionKind.Zoom)
    {
        this.updateTransitionStartZoom();
    } else
    {
        this.changeStep(1);
    }
};

// -------------------------------------------------------

SceneBattle.prototype.updateTransitionStartFade = function() {
    if (this.transitionColor) {
        this.transitionColorAlpha += SceneBattle.TRANSITION_COLOR_VALUE;
        if (this.transitionColorAlpha >= 1) {
            this.transitionColorAlpha = 1;
            this.transitionColor = false;
            this.timeTransition = new Date().getTime();
            this.updateBackgroundColor();
        }
        return;
    }
    if (new Date().getTime() - this.timeTransition < SceneBattle
        .TRANSITION_COLOR_END_WAIT)
    {
        return;
    }
    if (this.transitionColorAlpha > 0) {
        this.transitionColorAlpha -= SceneBattle.TRANSITION_COLOR_VALUE;
        if (this.transitionColorAlpha <= 0) {
            this.transitionColorAlpha = 0;
        }
        return;
    }

    this.changeStep(1);
};

// -------------------------------------------------------

SceneBattle.prototype.updateTransitionStartZoom = function() {
    var offset;

    if (this.transitionZoom) {
        offset = SceneBattle.START_CAMERA_DISTANCE / this
            .sceneMapCameraDistance * SceneBattle.TRANSITION_ZOOM_TIME;
        this.sceneMap.camera.distance = (1 - (((new Date().getTime() - this
            .time) - offset) / (SceneBattle.TRANSITION_ZOOM_TIME - offset)))
            * this.sceneMapCameraDistance;
        if (this.sceneMap.camera.distance <= SceneBattle
            .START_CAMERA_DISTANCE)
        {
            this.sceneMap.camera.distance = SceneBattle
                .START_CAMERA_DISTANCE;
            this.transitionZoom = false;
            this.updateBackgroundColor();
            this.time = new Date().getTime();
        }
        this.sceneMap.camera.update();
        return;
    }
    if (this.camera.distance < this.cameraDistance) {
        offset = SceneBattle.START_CAMERA_DISTANCE / this.cameraDistance *
            SceneBattle.TRANSITION_ZOOM_TIME;
        this.camera.distance = (((new Date().getTime() - this.time) - offset
            ) / (SceneBattle.TRANSITION_ZOOM_TIME - offset)) * this
            .cameraDistance;
        if (this.camera.distance >= this.cameraDistance) {
            this.camera.distance = this.cameraDistance;
            this.cameraON = true;
        } else {
            return;
        }
    }

    this.changeStep(1);
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep0 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep0 = function() {
    if (this.transitionStart === 1) {
        Platform.ctx.fillStyle = RPM.STRING_RGBA + RPM.STRING_PARENTHESIS_LEFT + 
            this.transitionStartColor.red + RPM.STRING_COMA + this
            .transitionStartColor.green + RPM.STRING_COMA + this
            .transitionStartColor.blue + RPM.STRING_COMA + this
            .transitionColorAlpha + RPM.STRING_PARENTHESIS_RIGHT;
        Platform.ctx.fillRect(0, 0, RPM.canvasWidth, RPM.canvasHeight);
    }
};
