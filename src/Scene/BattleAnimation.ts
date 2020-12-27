
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Text } from "../Graphic";
import { Battle } from "./Battle";
import {Enum} from "../Common/Enum";

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 2 :
//      SubStep 0 : Animation user + animation sprite
//      SubStep 1 : Animation target
//      SubStep 2 : Damages
//
// -------------------------------------------------------

class BattleAnimation {
    battle:Battle
    public constructor(battle:Battle) {
        this.battle = battle;
    }

    //-------------------------------------------------------
/** Initialize step
*/
public initialize ()
{
    let informationText, content;
    switch (this.battle.battleCommandKind)
    {
    case Enum.EffectSpecialActionKind.ApplyWeapons:
        informationText = this.battle.attackSkill.name();
        break;
    case Enum.EffectSpecialActionKind.OpenSkills:
        content = this.battle.attackingGroup === Enum.CharacterKind.Hero ? this.battle
            .windowChoicesSkills.getCurrentContent().skill : RPM.datasGame
            .skills.list[this.battle.action.skillID.getValue()];
        informationText = content.name();
        break;
    case Enum.EffectSpecialActionKind.OpenItems:
        content = this.battle.attackingGroup === Enum.CharacterKind.Hero ? this.battle
            .windowChoicesItems.getCurrentContent().item : RPM.datasGame.items
            .list[this.battle.action.itemID.getValue()];
        informationText = content.name();
        break;
    default:
        informationText = RPM.STRING_EMPTY;
        break;
    }
    this.battle.windowTopInformations.content = new Text(informationText, {
        align: Enum.Align.Center });
    this.battle.time = new Date().getTime();
    this.battle.damages = [];
    this.battle.effects = [];
    this.battle.frameUser = 0;
    this.battle.frameTarget = 0;
    let i, l;
    switch (this.battle.battleCommandKind)
    {
    case Enum.EffectSpecialActionKind.ApplyWeapons:
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero)
        {
            let equipments = this.battle.user.character.equip;
            let j, m, gameItem, weapon;
            for (i = 0, l = equipments.length; i < l; i++)
            {
                gameItem = equipments[i];
                if (gameItem && gameItem.k === Enum.ItemKind.Weapon)
                {
                    weapon = gameItem.getItemInformations();
                    this.battle.userAnimation = RPM.datasGame.animations.list[weapon
                        .animationUserID.getValue()];
                    this.battle.targetAnimation = RPM.datasGame.animations.list[weapon
                        .animationTargetID.getValue()];
                    for (j = 0, m = weapon.effects.length; j < m; j++)
                    {
                        this.battle.effects.push(weapon.effects[j]);
                    }
                }
            }
        }
        if (this.battle.effects.length === 0)
        {
            this.battle.userAnimation = RPM.datasGame.animations.list[RPM.datasGame
                .skills.list[1].animationUserID.getValue()];
            this.battle.targetAnimation = RPM.datasGame.animations.list[RPM.datasGame
                .skills.list[1].animationTargetID.getValue()];
            let effects = this.battle.attackSkill.effects;
            for (i = 1, l = effects.length; i < l; i++)
            {
                this.battle.effects.push(effects[i]);
            }
        }
        this.battle.user.setAttacking();
        break;
    case Enum.EffectSpecialActionKind.OpenSkills:
        this.battle.userAnimation = RPM.datasGame.animations.list[content
            .animationUserID.getValue()];
        this.battle.targetAnimation = RPM.datasGame.animations.list[content
            .animationTargetID.getValue()];
        this.battle.effects = content.effects;
        content.cost();
        this.battle.user.setUsingSkill();
        break;
    case Enum.EffectSpecialActionKind.OpenItems:
        let graphic = this.battle.windowChoicesItems.getCurrentContent();
        this.battle.userAnimation = RPM.datasGame.animations.list[content
            .animationUserID.getValue()];
        this.battle.targetAnimation = RPM.datasGame.animations.list[content
            .animationTargetID.getValue()];
        this.battle.effects = content.effects;
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero)
        {
            RPM.game.useItem(graphic.gameItem);
        }
        this.battle.user.setUsingItem();
        break;
    case Enum.EffectSpecialActionKind.EndTurn:
        this.battle.time -= Battle.TIME_ACTION_ANIMATION;
        let user;
        for (i = 0, l = this.battle.battlers[Enum.CharacterKind.Hero].length; i < l; i++)
        {
            user = this.battle.battlers[Enum.CharacterKind.Hero][i];
            user.setActive(false);
            user.setSelected(false);
        }
        this.battle.subStep = 2;
        break;
    case Enum.EffectSpecialActionKind.DoNothing:
        this.battle.time -= SceneBattle.TIME_ACTION_ANIMATION;
        this.battle.subStep = 2;
        break;
    }
    this.battle.currentEffectIndex = 0;
    if (this.battle.effects.length > 0)
    {
        this.battle.effects[this.battle.currentEffectIndex].execute();
    }
    if (this.battle.userAnimation)
    {
        this.battle.userAnimationPicture = this.battle.userAnimation.createPicture();
    }
    if (this.battle.targetAnimation)
    {
        this.battle.targetAnimationPicture = this.battle.targetAnimation.createPicture();
    }
}

// -------------------------------------------------------
/** Get the animation efect condition kind
*   @returns {Enum.AnimationEffectConditionKind}
*/
public getCondition (): Enum.AnimationEffectConditionKind
{
    if (this.battle.damages[0])
    {
        if (this.battle.damages[0][1])
        {
            return Enum.AnimationEffectConditionKind.Critical;
        }
        if (this.battle.damages[0][2])
        {
            return Enum.AnimationEffectConditionKind.Miss;
        }
    }
    return Enum.AnimationEffectConditionKind.Hit;
}

// -------------------------------------------------------
/** Update the battle
*/
public update ()
{
    let i, l;
    switch (this.battle.subStep)
    {
    case 0: // Animation user
        // Before animation, wait for enemy moving
        if (this.battle.user.moving)
        {
            return;
        }

        // User animation if exists
        if (this.battle.userAnimation)
        {
            this.battle.frameUser++;
            this.battle.userAnimation.playSounds(this.battle.frameUser, this.battle.getCondition());
            RPM.requestPaintHUD = true;
        }

        // Test if animation finished
        if ((!this.battle.userAnimation || this.battle.frameUser > this.battle.userAnimation.frames
            .length) && !this.battle.user.isAttacking())
        {
            if (!this.battle.targetAnimation)
            {
                this.battle.time = new Date().getTime() - (Battle
                    .TIME_ACTION_ANIMATION / 2);
                for (i = 0, l = this.battle.targets.length; i < l; i++)
                {
                    this.battle.targets[i].timeDamage = 0;
                }
                this.battle.subStep = 2;
            } else
            {
                this.battle.subStep = 1;
            }
        }
        break;
    case 1: // Animation target
        // Target animation if exists
        this.battle.frameTarget++;
        this.battle.targetAnimation.playSounds(this.battle.frameTarget, this.battle.getCondition());
        RPM.requestPaintHUD = true;
        if (this.battle.frameTarget > this.battle.targetAnimation.frames.length)
        {
            this.battle.time = new Date().getTime() - (Battle
                .TIME_ACTION_ANIMATION / 2);
            for (i = 0, l = this.battle.targets.length; i < l; i++)
            {
                this.battle.targets[i].timeDamage = 0;
            }
            this.battle.subStep = 2;
        }
        break;
    case 2: // Damages
        // If calling a common reaction, wait for it to be finished
        if (this.battle.reactionInterpreters.length > 0)
        {
            for (i = 0, l = this.battle.targets.length; i < l; i++)
            {
                this.battle.targets[i].timeDamage = 0;
            }
            return;
        }
        if ((new Date().getTime() - this.battle.time) >= Battle
            .TIME_ACTION_ANIMATION)
        {
            let damage;
            for (i = 0, l = this.battle.targets.length; i < l; i++)
            {
                damage = this.battle.damages[i];
                if (damage)
                {
                    this.battle.targets[i].updateDead(damage[0] > 0 && !damage[1], this
                        .user);
                }
            }
            RPM.requestPaintHUD = true;

            // Target and user test death
            this.battle.user.updateDead(false);
            for (i = 0, l = this.battle.targets.length; i < l; i++)
            {
                this.battle.targets[i].updateDead(false);
            }

            // Testing end of battle
            let effect, isAnotherEffect;
            if (this.battle.isWin())
            {
                this.battle.winning = true;
                this.battle.activeGroup();
                this.battle.changeStep(4);
            } else if (this.battle.isLose())
            {
                this.battle.winning = false;
                this.battle.changeStep(4);
            } else
            {
                effect = this.battle.effects[this.battle.currentEffectIndex];
                this.battle.currentEffectIndex++;
                for (l = this.battle.effects.length; this.battle.currentEffectIndex < l; this.battle
                    .currentEffectIndex++)
                {
                    this.battle.targets = this.battle.tempTargets;
                    effect = this.battle.effects[this.battle.currentEffectIndex];
                    effect.execute();
                    if (effect.isAnimated())
                    {
                        break;
                    }
                }
                isAnotherEffect = this.battle.currentEffectIndex < this.battle.effects.length;
                if (isAnotherEffect)
                {
                    this.battle.time = new Date().getTime() - (Battle
                        .TIME_ACTION_ANIMATION / 2);
                    for (let j = 0, ll = this.battle.targets.length; j < ll; j++)
                    {
                        this.battle.targets[j].timeDamage = 0;
                    }
                    return;
                } else
                {
                    this.battle.user.setActive(false);
                    this.battle.user.setSelected(false);
                }

                // Testing end of turn
                if (this.battle.isEndTurn())
                {
                    this.battle.activeGroup();
                    if (this.battle.attackingGroup === Enum.CharacterKind.Hero)
                    {
                        this.battle.changeStep(3); // Attack of ennemies
                    } else
                    {
                        this.battle.turn++;
                        this.battle.changeStep(1); // Attack of heroes
                    }
                } else
                {
                    if (this.battle.attackingGroup === Enum.CharacterKind.Hero)
                    {
                        this.battle.changeStep(1); // Attack of heroes
                    } else
                    {
                        this.battle.changeStep(3); // Attack of ennemies
                    }
                }
            }
        }
        break;
    }
}

// -------------------------------------------------------
/** Handle key pressed
*   @param {number} key The key ID 
*/
public onKeyPressedStep (key: number){

}

// -------------------------------------------------------
/** Handle key released
*   @param {number} key The key ID 
*/
public onKeyReleasedStep (key: number){

}

// -------------------------------------------------------
/** Handle key repeat pressed
*   @param {number} key The key ID 
*/
public onKeyPressedRepeatStep (key: number){

}

// -------------------------------------------------------
/** Handle key pressed and repeat
*   @param {number} key The key ID 
*/
public onKeyPressedAndRepeatStep (key: number){

}

// -------------------------------------------------------
/** Draw the battle HUD
*/
public drawHUDStep ()
{
    this.battle.windowTopInformations.draw();

    // Draw animations
    if (this.battle.userAnimation)
    {
        this.battle.userAnimation.draw(this.battle.userAnimationPicture, this.battle.frameUser, this.battle
            .user);
    }
    let i, l;
    if (this.battle.targetAnimation)
    {
        if (this.battle.targetAnimation.positionKind === Enum.AnimationPositionKind
            .ScreenCenter)
        {
            this.battle.targetAnimation.draw(this.battle.targetAnimationPicture, this.battle
                .frameTarget, null);
        } else
        {
            for (i = 0, l = this.battle.targets.length; i < l; i++)
            {
                this.battle.targetAnimation.draw(this.battle.targetAnimationPicture, this.battle
                    .frameTarget, this.battle.targets[i]);
            }
        }
    }

    // Draw damages
    if (this.battle.reactionInterpreters.length === 0 && !this.battle.user.isAttacking() && (
        !this.battle.targetAnimation || this.battle.frameTarget > this.battle.targetAnimation.frames
        .length))
    {
        let damage;
        for (i = 0, l = this.battle.damages.length; i < l; i++)
        {
            damage = this.battle.damages[i];
            this.battle.targets[i].drawDamages(damage[0], damage[1], damage[2]);
        }
    }
}
}

export{BattleAnimation}