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
//  Step 4 : End of battle
//      SubStep 0 : Victory message
//      SubStep 1 : Experience update
//      SubStep 2 : Level up
//      SubStep 3 : End transition
//      SubStep 4 : Defeat message
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep4 = async function()
{
    // If loosing, directly go to end transition
    if (!this.winning)
    {
        this.windowTopInformations.content = new GraphicText("Defeat...", { 
            align: Align.Center });
        this.subStep = 4;
        return;
    }

    // Change information bar content
    this.windowTopInformations.content = new GraphicText("Victory!", { align:
        Align.Center });

    // Rewards
    await this.prepareRewards();
    let id;
    for (id in this.currencies)
    {
        RPM.game.currencies[id] += this.currencies[id];
    }
    let i, l;
    for (i = 0, l = this.loots.length; i < l; i++)
    {
        for (id in this.loots[i])
        {
            this.loots[i][id].addItems();
        }
    }

    // Heroes
    let battler;
    for (i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        battler = this.battlers[CharacterKind.Hero][i];
        battler.setVictory();
        battler.character.totalRemainingXP = this.xp;
    }

    // Time progression settings
    this.time = new Date().getTime();
    this.finishedXP = false;
    this.user = null;
    this.priorityIndex = 0;

    // Music
    RPM.datasGame.battleSystem.battleVictory.playMusic();

    // Windows
    w = 200 + RPM.SMALL_PADDING_BOX[0] + RPM.SMALL_PADDING_BOX[2];
    h = this.lootsNumber * 30 + RPM.SMALL_PADDING_BOX[1] + RPM.SMALL_PADDING_BOX
        [3];
    this.windowLoots = new WindowBox(RPM.SCREEN_X - 20 - w, RPM.SCREEN_Y - 20 - 
        h, w, h,
        {
            content: await GraphicLoots.create(this.loots, this.lootsNumber),
            padding: RPM.SMALL_PADDING_BOX
        }
    )
}

// -------------------------------------------------------

SceneBattle.prototype.prepareRewards = async function()
{
    // Experience + currencies + loots
    this.xp = 0;
    this.currencies = {};
    this.loots = [];
    this.loots[LootKind.Item] = {};
    this.loots[LootKind.Weapon] = {};
    this.loots[LootKind.Armor] = {};
    this.lootsNumber = 0;
    let i, j, l, m, character, id, list, loots;
    for (i = 0, l = this.battlers[CharacterKind.Monster].length; i < l; i++)
    {
        character = this.battlers[CharacterKind.Monster][i].character;
        this.xp += character.getRewardExperience();
        currencies = character.getRewardCurrencies();
        for (id in currencies)
        {
            if (this.currencies.hasOwnProperty(id))
            {
                this.currencies[id] += currencies[id];
            } else
            {
                this.currencies[id] = currencies[id];
            }
        }
        list = character.getRewardLoots();
        for (j = 0, m = list.length; j < m; j++)
        {
            loots = list[j];
            for (id in loots)
            {
                if (this.loots[j].hasOwnProperty(id))
                {
                    this.loots[j][id] += loots[id];
                } else
                {
                    this.loots[j][id] = loots[id];
                    this.lootsNumber++;
                }
            }
        }
    }
    for (i = 0, l = this.loots.length; i < l; i++)
    {
        for (id in this.loots[i])
        {
            this.loots[i][id] = new GameItem(i, parseInt(id), this.loots[i][id]);
        }
    }

    // Prepare graphics
    this.graphicRewardTop = await GraphicRewardsTop.create(this.xp, this
        .currencies);
}

// -------------------------------------------------------

SceneBattle.prototype.updateTeamXP = function()
{
    this.finishedXP = true;
    let character, y , h;
    for (let i = this.priorityIndex, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        character = this.battlers[CharacterKind.Hero][i].character;
        if (!character.isExperienceUpdated())
        {
            if (character.updateExperience())
                { // Level up
                this.user = character;
                this.user.levelingUp = true;
                this.finishedXP = false;
                this.windowExperienceProgression.content.updateExperience();
                this.priorityIndex = i + 1 % RPM.game.teamHeroes.length;
                this.pauseTeamXP();
                this.finishedXP = false;
                this.user.stepLevelUp = 0;
                this.windowStatisticProgression.content = new
                    GraphicStatisticProgression(this.user);
                y = 90 + (i * 90);
                h = this.windowStatisticProgression.content.getHeight() + RPM
                    .HUGE_PADDING_BOX[0] + RPM.HUGE_PADDING_BOX[2];
                if (y + h > RPM.CANVAS_HEIGHT - 10)
                {
                    y = RPM.CANVAS_HEIGHT - h - 10;
                }
                this.windowStatisticProgression.setY(y);
                this.windowStatisticProgression.setH(h);
                RPM.datasGame.battleSystem.battleLevelUp.playSound();
                this.subStep = 2;
                return;
            }
            this.finishedXP = false;
        }
    }
    this.windowExperienceProgression.content.updateExperience();
    this.priorityIndex = 0;
}

// -------------------------------------------------------

SceneBattle.prototype.pauseTeamXP = function()
{
    for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        this.battlers[CharacterKind.Hero][i].character.pauseExperience();
    }
}

// -------------------------------------------------------

SceneBattle.prototype.unpauseTeamXP = function()
{
    for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        this.battlers[CharacterKind.Hero][i].character.unpauseExperience();
    }
    this.user.updateRemainingXP(SceneBattle.TIME_PROGRESSION_XP);
}

// -------------------------------------------------------

SceneBattle.prototype.playMapMusic = function()
{
    SceneBattle.musicMap.playMusic(SceneBattle.musicMapTime, 0);
    RPM.songsManager.initializeProgressionMusic(0, SceneBattle.musicMap.volume, 
        0, SceneBattle.TIME_LINEAR_MUSIC_START);
}

// -------------------------------------------------------

SceneBattle.prototype.prepareEndTransition = function()
{
    this.transitionEnded = false;
    RPM.songsManager.initializeProgressionMusic(SystemPlaySong
        .currentPlayingMusic.volume, 0, 0, SceneBattle.TIME_LINEAR_MUSIC_END);
    this.subStep = 3;
    this.time = new Date().getTime();
}

// -------------------------------------------------------

SceneBattle.prototype.updateStep4 = function()
{
    switch (this.subStep)
    {
    case 0:
        if (new Date().getTime() - this.time >= SceneBattle.TIME_END_WAIT)
        {
            this.time = new Date().getTime();
            this.windowTopInformations.content = this.graphicRewardTop;
            for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
            {
                this.battlers[CharacterKind.Hero][i].character.updateRemainingXP
                    (SceneBattle.TIME_PROGRESSION_XP);
            }
            RPM.requestPaintHUD = true;
            this.subStep = 1;
        }
        break;
    case 1:
        this.updateTeamXP();
        RPM.requestPaintHUD = true;
        break;
    case 2:
        break;
    case 3:
        RPM.requestPaintHUD = true;
        if (RPM.songsManager.isProgressionMusicEnd && this.transitionEnded)
        {
            if (this.winning)
            {
                this.win();
            } else
            {
                this.gameOver();
            }
        }

        // Transition zoom
        if (this.transitionEnd === 2)
        {
            let offset;
            if (!this.transitionZoom)
            {
                offset = SceneBattle.START_CAMERA_DISTANCE / this.cameraDistance
                    * SceneBattle.TRANSITION_ZOOM_TIME;
                this.camera.distance = (1 - (((new Date().getTime() - this.time)
                    - offset) / (SceneBattle.TRANSITION_ZOOM_TIME - offset))) * 
                    this.cameraDistance;
                if (this.camera.distance <= SceneBattle.START_CAMERA_DISTANCE)
                {
                    this.camera.distance = SceneBattle.START_CAMERA_DISTANCE;
                    this.transitionZoom = true;
                    RPM.gameStack.subTop.updateBackgroundColor();
                    this.playMapMusic();
                    this.time = new Date().getTime();
                }
                this.camera.update();
                return;
            }
            if (this.sceneMap.camera.distance < this.sceneMapCameraDistance)
            {
                offset = SceneBattle.START_CAMERA_DISTANCE / this
                    .sceneMapCameraDistance * SceneBattle.TRANSITION_ZOOM_TIME;
                this.sceneMap.camera.distance = (((new Date().getTime() - this
                    .time) - offset) / (SceneBattle.TRANSITION_ZOOM_TIME - 
                    offset)) * this.sceneMapCameraDistance;
                if (this.sceneMap.camera.distance >= this.sceneMapCameraDistance)
                {
                    this.sceneMap.camera.distance = this.sceneMapCameraDistance;
                } else
                {
                    this.sceneMap.camera.update();
                    return;
                }
                this.sceneMap.camera.update();
            }
        }

        // Transition fade
        if (this.transitionEnd === 1)
        {
            if (!this.transitionColor)
            {
                this.transitionColorAlpha += SceneBattle.TRANSITION_COLOR_VALUE;
                if (this.transitionColorAlpha >= 1)
                {
                    this.transitionColorAlpha = 1;
                    this.transitionColor = true;
                    this.timeTransition = new Date().getTime();
                    RPM.gameStack.subTop.updateBackgroundColor();
                }
                return;
            }
            if (new Date().getTime() - this.timeTransition < SceneBattle
                .TRANSITION_COLOR_END_WAIT)
            {
                return;
            } else
            {
                if (this.timeTransition !== -1)
                {
                    this.timeTransition = -1;
                    this.playMapMusic();
                }
            }
            if (this.transitionColorAlpha > 0)
            {
                this.transitionColorAlpha -= SceneBattle.TRANSITION_COLOR_VALUE;
                if (this.transitionColorAlpha <= 0)
                {
                    this.transitionColorAlpha = 0;
                }
                return;
            }
        }
        this.transitionEnded = true;
        break;
    }
}

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep4 = function(key)
{
    switch (this.subStep)
    {
    case 1:
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            if (this.finishedXP)
            {
                this.prepareEndTransition();
            } else
            {   // Pass xp
                let character;
                for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
                {
                    character = this.battlers[CharacterKind.Hero][i].character;
                    character.passExperience();
                    character.updateObtainedExperience();
                }
            }
        }
        break;
    case 2:
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            if (this.user.stepLevelUp === 0)
            {
                this.user.stepLevelUp = 1;
                this.windowStatisticProgression.content
                    .updateStatisticProgression();
            } else
            {
                this.user.levelingUp = false;
                this.unpauseTeamXP();
                this.subStep = 1;
            }
            RPM.requestPaintHUD = true;
        }
        break;
    case 4:
        this.prepareEndTransition();
        break;
    }
}

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep4 = function(key)
{

}

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep4 = function(key)
{

}

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep4 = function(key)
{

}

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep4 = function()
{
    if (this.subStep !== 3)
    {
        this.windowTopInformations.draw();
    }
    if (this.subStep === 1 || this.subStep === 2)
    {
        this.windowExperienceProgression.draw();
        if (this.lootsNumber > 0)
        {
            this.windowLoots.draw();
        }
    }
    switch (this.subStep)
    {
    case 2:
        this.windowStatisticProgression.draw();
        break;
    case 3:
        // Transition fade
        if (this.transitionEnd === 1)
        {
            Platform.ctx.fillStyle = "rgba(" + this.transitionEndColor.red + ","
                + this.transitionEndColor.green + "," + this.transitionEndColor
                .blue + "," + this.transitionColorAlpha + ")";
            Platform.ctx.fillRect(0, 0, RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        }
        break;
    }
};
