/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from "../Common";
import { WindowBox } from "../Core";
import { PlaySong } from "../System";
import { Battle } from "./Battle";
import {Text} from "../Graphic/Text"
import {Enum} from "../Common/Enum";
import { Keyboards } from "../Datas";

// -------------------------------------------------------
//
//  CLASS BattleVictory
//
//  Step 4 : End of battle
//      SubStep 0 : Victory message
//      SubStep 1 : Experience update
//      SubStep 2 : Level up
//      SubStep 3 : End transition
//      SubStep 4 : Defeat message
//
// -------------------------------------------------------

class BattleVictory {

    battle:Battle
    public constructor(battle:Battle) {
        this.battle = battle;
    }

    // -------------------------------------------------------
/** Initialize step
*/
initialize ()
{
    // If loosing, directly go to end transition
    if (!this.battle.winning)
    {
        this.battle.windowTopInformations.content = new Text("Defeat...", { 
            align: Enum.Align.Center });
        this.battle.subStep = 4;
        return;
    }

    // Change information bar content
    this.battle.windowTopInformations.content = new Text("Victory!", { align:
        Enum.Align.Center });

    // Rewards
    this.prepareRewards();
    let id;
    for (id in this.battle.currencies)
    {
        RPM.game.currencies[id] += this.battle.currencies[id];
    }
    let i, l;
    for (i = 0, l = this.battle.loots.length; i < l; i++)
    {
        for (id in this.battle.loots[i])
        {
            this.battle.loots[i][id].addItems();
        }
    }

    // Heroes
    let battler;
    for (i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        battler = this.battle.battlers[Enum.CharacterKind.Hero][i];
        battler.setVictory();
        battler.character.totalRemainingXP = this.battle.xp;
    }

    // Time progression settings
    this.battle.time = new Date().getTime();
    this.battle.finishedXP = false;
    this.battle.user = null;
    this.battle.priorityIndex = 0;

    // Music
    RPM.datasGame.battleSystem.battleVictory.playMusic();

    // Windows
    w = 200 + RPM.SMALL_PADDING_BOX[0] + RPM.SMALL_PADDING_BOX[2];
    h = this.battle.lootsNumber * 30 + RPM.SMALL_PADDING_BOX[1] + RPM.SMALL_PADDING_BOX
        [3];
    this.battle.windowLoots = new WindowBox(RPM.SCREEN_X - 20 - w, RPM.SCREEN_Y - 20 - 
        h, w, h,
        {
            content: new GraphicLoots(this.battle.loots, this.battle.lootsNumber),
            padding: RPM.SMALL_PADDING_BOX
        }
    )
}

// -------------------------------------------------------
/** Prepare the rewards (xp, currencies, loots)
*/
prepareRewards ()
{
    // Experience + currencies + loots
    this.battle.xp = 0;
    this.battle.currencies = {};
    this.battle.loots = [];
    this.battle.loots[Enum.LootKind.Item] = {};
    this.battle.loots[Enum.LootKind.Weapon] = {};
    this.battle.loots[Enum.LootKind.Armor] = {};
    this.battle.lootsNumber = 0;
    let i, j, l, m, character, id, list, loots;
    for (i = 0, l = this.battle.battlers[Enum.CharacterKind.Monster].length; i < l; i++)
    {
        character = this.battle.battlers[Enum.CharacterKind.Monster][i].character;
        this.battle.xp += character.getRewardExperience();
        currencies = character.getRewardCurrencies();
        for (id in currencies)
        {
            if (this.battle.currencies.hasOwnProperty(id))
            {
                this.battle.currencies[id] += currencies[id];
            } else
            {
                this.battle.currencies[id] = currencies[id];
            }
        }
        list = character.getRewardLoots();
        for (j = 0, m = list.length; j < m; j++)
        {
            loots = list[j];
            for (id in loots)
            {
                if (this.battle.loots[j].hasOwnProperty(id))
                {
                    this.battle.loots[j][id] += loots[id];
                } else
                {
                    this.battle.loots[j][id] = loots[id];
                    this.battle.lootsNumber++;
                }
            }
        }
    }
    for (i = 0, l = this.battle.loots.length; i < l; i++)
    {
        for (id in this.battle.loots[i])
        {
            this.battle.loots[i][id] = new GameItem(i, parseInt(id), this.battle.loots[i][id]);
        }
    }

    // Prepare graphics
    this.battle.graphicRewardTop = new GraphicRewardsTop(this.battle.xp, this.battle.currencies);
}

// -------------------------------------------------------
/** Update the team progression xp
*/
updateTeamXP ()
{
    this.battle.finishedXP = true;
    let character, y , h;
    for (let i = this.battle.priorityIndex, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        character = this.battle.battlers[Enum.CharacterKind.Hero][i].character;
        if (!character.isExperienceUpdated())
        {
            if (character.updateExperience())
                { // Level up
                this.battle.user = character;
                this.battle.user.levelingUp = true;
                this.battle.finishedXP = false;
                this.battle.windowExperienceProgression.content.updateExperience();
                this.battle.priorityIndex = i + 1 % RPM.game.teamHeroes.length;
                this.pauseTeamXP();
                this.battle.finishedXP = false;
                this.battle.user.stepLevelUp = 0;
                this.battle.windowStatisticProgression.content = new
                    GraphicStatisticProgression(this.battle.user);
                y = 90 + (i * 90);
                h = this.battle.windowStatisticProgression.content.getHeight() + RPM
                    .HUGE_PADDING_BOX[0] + RPM.HUGE_PADDING_BOX[2];
                if (y + h > RPM.CANVAS_HEIGHT - 10)
                {
                    y = RPM.CANVAS_HEIGHT - h - 10;
                }
                this.battle.windowStatisticProgression.setY(y);
                this.battle.windowStatisticProgression.setH(h);
                RPM.datasGame.battleSystem.battleLevelUp.playSound();
                this.battle.subStep = 2;
                return;
            }
            this.battle.finishedXP = false;
        }
    }
    this.battle.windowExperienceProgression.content.updateExperience();
    this.battle.priorityIndex = 0;
}

// -------------------------------------------------------
/** Pause the team progression xp
*/
pauseTeamXP ()
{
    for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        this.battle.battlers[Enum.CharacterKind.Hero][i].character.pauseExperience();
    }
}

// -------------------------------------------------------
/** Unpause the team progression xp
*/
unpauseTeamXP ()
{
    for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
    {
        this.battle.battlers[Enum.CharacterKind.Hero][i].character.unpauseExperience();
    }
    this.battle.user.updateRemainingXP(Battle.TIME_PROGRESSION_XP);
}

// -------------------------------------------------------
/** Play map music
*/
playMapMusic ()
{
    Battle.musicMap.playMusic(Battle.musicMapTime, 0);
    RPM.songsManager.initializeProgressionMusic(0, Battle.musicMap.volume, 
        0, Battle.TIME_LINEAR_MUSIC_START);
}

// -------------------------------------------------------
/** Prepare the end transition
*/
prepareEndTransition ()
{
    this.battle.transitionEnded = false;
    RPM.songsManager.initializeProgressionMusic(PlaySong
        .currentPlayingMusic.volume, 0, 0, Battle.TIME_LINEAR_MUSIC_END);
    this.battle.subStep = 3;
    this.battle.time = new Date().getTime();
}

// -------------------------------------------------------
/** Update the battle
*/
update ()
{
    switch (this.battle.subStep)
    {
    case 0:
        if (new Date().getTime() - this.battle.time >= Battle.TIME_END_WAIT)
        {
            this.battle.time = new Date().getTime();
            this.battle.windowTopInformations.content = this.battle.graphicRewardTop;
            for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
            {
                this.battle.battlers[Enum.CharacterKind.Hero][i].character.updateRemainingXP
                    (Battle.TIME_PROGRESSION_XP);
            }
            RPM.requestPaintHUD = true;
            this.battle.subStep = 1;
        }
        break;
    case 1:
        this.battle.updateTeamXP();
        RPM.requestPaintHUD = true;
        break;
    case 2:
        break;
    case 3:
        RPM.requestPaintHUD = true;
        if (RPM.songsManager.isProgressionMusicEnd && this.battle.transitionEnded)
        {
            if (this.battle.winning)
            {
                this.battle.win();
            } else
            {
                this.battle.gameOver();
            }
        }

        // Transition zoom
        if (this.battle.transitionEnd === 2)
        {
            let offset;
            if (!this.battle.transitionZoom)
            {
                offset = Battle.START_CAMERA_DISTANCE / this.battle.cameraDistance
                    * Battle.TRANSITION_ZOOM_TIME;
                this.battle.camera.distance = (1 - (((new Date().getTime() - this.battle.time)
                    - offset) / (Battle.TRANSITION_ZOOM_TIME - offset))) * 
                    this.battle.cameraDistance;
                if (this.battle.camera.distance <= Battle.START_CAMERA_DISTANCE)
                {
                    this.battle.camera.distance = Battle.START_CAMERA_DISTANCE;
                    this.battle.transitionZoom = true;
                    RPM.gameStack.subTop.updateBackgroundColor();
                    this.playMapMusic();
                    this.battle.time = new Date().getTime();
                }
                this.battle.camera.update();
                return;
            }
            if (this.battle.sceneMap.camera.distance < this.battle.sceneMapCameraDistance)
            {
                offset = Battle.START_CAMERA_DISTANCE / this
                    .battle.sceneMapCameraDistance * Battle.TRANSITION_ZOOM_TIME;
                this.battle.sceneMap.camera.distance = (((new Date().getTime() - this
                    .battle.time) - offset) / (Battle.TRANSITION_ZOOM_TIME - 
                    offset)) * this.battle.sceneMapCameraDistance;
                if (this.battle.sceneMap.camera.distance >= this.battle.sceneMapCameraDistance)
                {
                    this.battle.sceneMap.camera.distance = this.battle.sceneMapCameraDistance;
                } else
                {
                    this.battle.sceneMap.camera.update();
                    return;
                }
                this.battle.sceneMap.camera.update();
            }
        }

        // Transition fade
        if (this.battle.transitionEnd === 1)
        {
            if (!this.battle.transitionColor)
            {
                this.battle.transitionColorAlpha += Battle.TRANSITION_COLOR_VALUE;
                if (this.battle.transitionColorAlpha >= 1)
                {
                    this.battle.transitionColorAlpha = 1;
                    this.battle.transitionColor = true;
                    this.battle.timeTransition = new Date().getTime();
                    RPM.gameStack.subTop.updateBackgroundColor();
                }
                return;
            }
            if (new Date().getTime() - this.battle.timeTransition < Battle
                .TRANSITION_COLOR_END_WAIT)
            {
                return;
            } else
            {
                if (this.battle.timeTransition !== -1)
                {
                    this.battle.timeTransition = -1;
                    this.playMapMusic();
                }
            }
            if (this.battle.transitionColorAlpha > 0)
            {
                this.battle.transitionColorAlpha -= Battle.TRANSITION_COLOR_VALUE;
                if (this.battle.transitionColorAlpha <= 0)
                {
                    this.battle.transitionColorAlpha = 0;
                }
                return;
            }
        }
        this.battle.transitionEnded = true;
        break;
    }
}

// -------------------------------------------------------
/** Handle key pressed
*   @param {number} key The key ID 
*/
onKeyPressedStep (key: number)
{
    switch (this.battle.subStep)
    {
    case 1:
        if (Keyboards.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            if (this.battle.finishedXP)
            {
                this.prepareEndTransition();
            } else
            {   // Pass xp
                let character;
                for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
                {
                    character = this.battle.battlers[Enum.CharacterKind.Hero][i].character;
                    character.passExperience();
                    character.updateObtainedExperience();
                }
            }
        }
        break;
    case 2:
        if (Keyboards.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            if (this.battle.user.stepLevelUp === 0)
            {
                this.battle.user.stepLevelUp = 1;
                this.battle.windowStatisticProgression.content
                    .updateStatisticProgression();
            } else
            {
                this.battle.user.levelingUp = false;
                this.battle.unpauseTeamXP();
                this.battle.subStep = 1;
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
/** Handle key released
*   @param {number} key The key ID 
*/
onKeyReleasedStep (key: number)
{

}

// -------------------------------------------------------
/** Handle key repeat pressed
*   @param {number} key The key ID 
*/
onKeyPressedRepeatStep (key: number)
{

}

// -------------------------------------------------------
/** Handle key pressed and repeat
*   @param {number} key The key ID 
*/
onKeyPressedAndRepeatStep (key: number)
{

}

// -------------------------------------------------------
/** Draw the battle HUD
*/
drawHUDStep ()
{
    if (this.battle.subStep !== 3)
    {
        this.battle.windowTopInformations.draw();
    }
    if (this.battle.subStep === 1 || this.battle.subStep === 2)
    {
        this.battle.windowExperienceProgression.draw();
        if (this.battle.lootsNumber > 0)
        {
            this.battle.windowLoots.draw();
        }
    }
    switch (this.battle.subStep)
    {
    case 2:
        this.battle.windowStatisticProgression.draw();
        break;
    case 3:
        // Transition fade
        if (this.battle.transitionEnd === 1)
        {
            Platform.ctx.fillStyle = "rgba(" + this.battle.transitionEndColor.red + ","
                + this.battle.transitionEndColor.green + "," + this.battle.transitionEndColor
                .blue + "," + this.battle.transitionColorAlpha + ")";
            Platform.ctx.fillRect(0, 0, RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        }
        break;
    }
}
}

export{BattleVictory}