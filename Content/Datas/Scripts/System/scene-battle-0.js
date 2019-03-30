/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 0 : Initialization of the battle, camera movment (transition),
//  allies/ennemies comming.
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep0 = function(){
    var i, l, battler, position, w, h;
    this.winning = false;
    this.distanceCenterAlly = 75;
    this.kindSelection = CharacterKind.Hero;
    this.selectedUserIndex = 0;
    this.selectedTargetIndex = 0;
    this.battleCommandKind = EffectSpecialActionKind.None;
    this.targets = [];
    this.damages = [];

    // Battlers and graphics
    this.battlers = new Array(2);
    this.graphicPlayers = new Array(2);
    l = $game.teamHeroes.length;
    this.battlers[CharacterKind.Hero] = new Array(l);
    this.graphicPlayers[CharacterKind.Hero] = new Array(l);
    for (i = 0; i < l; i++) {
        // Battlers
        position = new THREE.Vector3($game.heroBattle.position.x + (2 *
            $SQUARE_SIZE) + (i * $SQUARE_SIZE / 2), $game.heroBattle
            .position.y, $game.heroBattle.position.z - $SQUARE_SIZE + (i *
            $SQUARE_SIZE));
        battler = new Battler($game.teamHeroes[i], position, this.camera);
        battler.addToScene();
        this.battlers[CharacterKind.Hero][i] = battler;

        // Graphic player
        this.graphicPlayers[CharacterKind.Hero][i] = {
            user: new GraphicPlayer(battler.character, false),
            target: new GraphicPlayer(battler.character, true)
        };
    }
    var troop = $datasGame.troops.list[this.troopID];
    l = troop.list.length;
    this.battlers[CharacterKind.Monster] = new Array(l);
    this.graphicPlayers[CharacterKind.Monster] = new Array(l);
    for (i = 0; i < l; i++){
        // Battlers
        var enemy = troop.list[i];
        position = new THREE.Vector3($game.heroBattle.position.x - (2 *
            $SQUARE_SIZE) - (i * $SQUARE_SIZE * 3 / 4), $game.heroBattle
            .position.y, $game.heroBattle.position.z - $SQUARE_SIZE + (i *
            $SQUARE_SIZE));
        var instancied = new GamePlayer(CharacterKind.Monster, enemy.id, $game
            .charactersInstances++, []);
        instancied.instanciate(enemy.level);
        battler = new Battler(instancied, position, this.camera);
        battler.addToScene();
        this.battlers[CharacterKind.Monster][i] = battler;

        // Graphic player
        this.graphicPlayers[CharacterKind.Monster][i] = {
            target: new GraphicPlayer(battler.character, true)
        };
    }

    // Informations
    this.windowTopInformations = new WindowBox(0, 20 , $SCREEN_X, RPM
        .SMALL_SLOT_HEIGHT, null, RPM.SMALL_SLOT_PADDING);
    w = 300;
    h = 100;
    this.windowUserInformations = new WindowBox($SCREEN_X - w, $SCREEN_Y -
        h, w, h, null, RPM.SMALL_PADDING_BOX, false);
    this.windowTargetInformations = new WindowBox(0, $SCREEN_Y - h, w, h, null,
        RPM.SMALL_PADDING_BOX, false);
    l = $datasGame.battleSystem.battleCommandsOrder.length;
    var listContent = new Array(l);
    var listCallbacks = new Array(l);
    var skill;
    for (i = 0; i < l; i++){
        skill = $datasGame.skills.list[$datasGame.battleSystem
            .battleCommandsOrder[i]];

        listContent[i] = new GraphicTextIcon(skill.name, skill.pictureID);
        listContent[i].skill = skill;
        listCallbacks[i] = SystemCommonSkillItem.prototype.use;
    }
    this.windowChoicesBattleCommands = new WindowChoices(OrientationWindow
        .Vertical, 20, $SCREEN_Y - 20 - (l*30), 150, 30, 6, listContent,
        listCallbacks, RPM.SMALL_SLOT_PADDING);
    this.windowChoicesSkills = new WindowChoices(OrientationWindow.Vertical, 25,
        100, 200, RPM.SMALL_SLOT_HEIGHT, 6, [], null,
        RPM.SMALL_SLOT_PADDING);
    this.windowSkillDescription = new WindowBox($SCREEN_X - 385, 100, 360, 200,
        null, RPM.HUGE_PADDING_BOX);
    this.windowChoicesItems = new WindowChoices(OrientationWindow.Vertical, 25,
        100, 200, RPM.SMALL_SLOT_HEIGHT, 6, [], null,
        RPM.SMALL_SLOT_PADDING);
    this.windowItemDescription = new WindowBox($SCREEN_X - 385, 100, 360, 200,
        null, RPM.HUGE_PADDING_BOX);

    // Music
    SceneBattle.musicMap = SystemPlaySong.currentPlayingMusic;
    SceneBattle.musicMapTime = $songsManager.getPlayer(SongKind.Music).position
        / 1000;
    $datasGame.battleSystem.battleMusic.playSong();

    // End windows
    this.windowExperienceProgression = new WindowBox(10, 80, 300, (90 * $game
        .teamHeroes.length) + RPM.SMALL_PADDING_BOX[2] + RPM
        .SMALL_PADDING_BOX[3], new GraphicXPProgression(), RPM.SMALL_PADDING_BOX);
    this.windowStatisticProgression = new WindowBox(250, 90, 380, 200, null,
        RPM.HUGE_PADDING_BOX);
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep0 = function() {
    $requestPaintHUD = true;

    // Transition fade
    if (this.transitionStart === 1) {
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
    }

    // Transition zoom
    if (this.transitionStart === 2) {
        if (this.transitionZoom) {
            this.sceneMap.camera.distance -= 5;
            if (this.sceneMap.camera.distance <= 10) {
                this.sceneMap.camera.distance = 10;
                this.transitionZoom = false;
                this.updateBackgroundColor();
            }
            this.sceneMap.camera.update();
            return;
        }
        if (this.camera.distance < 180) {
            this.camera.distance += 5;
            if (this.camera.distance >= 180) {
                this.camera.distance = 180;
                this.cameraON = true;
            } else {
                return;
            }
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
        $context.fillStyle = "rgba(" + this.transitionStartColor.red + "," +
            this.transitionStartColor.green + "," + this.transitionStartColor
            .blue + "," + this.transitionColorAlpha + ")";
        $context.fillRect(0, 0, $canvasWidth, $canvasHeight);
    }
};
