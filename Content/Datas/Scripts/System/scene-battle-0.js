/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
        this.graphicPlayers[CharacterKind.Hero][i] = new GraphicPlayer(battler
            .character, false);
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
        this.graphicPlayers[CharacterKind.Monster][i] = new GraphicPlayer(battler
            .character, true);
    }

    // Informations
    this.windowTopInformations = new WindowBox(0, 20 , $SCREEN_X, RPM
        .SMALL_SLOT_HEIGHT, null, RPM.SMALL_SLOT_PADDING);
    w = 300;
    h = 100;
    this.windowCharacterInformations = new WindowBox($SCREEN_X - w,
                                                     $SCREEN_Y - h, w, h, null,
                                                     RPM.SMALL_PADDING_BOX);
    l = $datasGame.battleSystem.battleCommandsOrder.length;
    var listContent = new Array(l);
    var listCallbacks = new Array(l);
    var skill;
    for (i = 0; i < l; i++){
        skill = $datasGame.skills.list[$datasGame.battleSystem
            .battleCommandsOrder[i]];
        listContent[i] = new GraphicTextIcon(skill.name, skill.pictureID);
        listContent[i].skill = skill;
        listCallbacks[i] = SystemCommonSkillItem.prototype.useInBattle;
    }
    this.windowChoicesBattleCommands = new WindowChoices(OrientationWindow
        .Vertical, 20, $SCREEN_Y - 20 - (l*30), 150, 30, 4, listContent,
        listCallbacks);

    // Music
    $datasGame.battleSystem.battleMusic.playSong(true);

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
