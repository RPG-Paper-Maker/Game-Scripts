
/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene, Graphic, Datas, System, Manager } from "..";
import { Enum } from "../Common";
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import CharacterKind = Enum.CharacterKind;
import Align = Enum.Align;
import ItemKind = Enum.ItemKind;
import AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
import AnimationPositionKind = Enum.AnimationPositionKind;
import { Item, Battler, Game, Animation } from "../Core";
import { Status } from "../Core/Status";

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//      SubStep 0 : Animation user + animation sprite
//      SubStep 1 : Animation target
//      SubStep 2 : Damages
//
// -------------------------------------------------------

class BattleAnimation {

    public battle: Scene.Battle

    public constructor(battle: Scene.Battle) {
        this.battle = battle;
    }

    /** 
     *  Initialize step.
     */
    public initialize() {
        let informationText: string, content: System.CommonSkillItem;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                informationText = this.battle.attackSkill.name();
                break;
            case EffectSpecialActionKind.OpenSkills:
                content = this.battle.attackingGroup === CharacterKind.Hero ? (
                    this.battle.battleStartTurn.active ? this.battle.currentSkill : 
                    (<Graphic.Skill>this.battle.windowChoicesSkills
                    .getCurrentContent()).system) : Datas.Skills.get(this.battle
                    .action.skillID.getValue());
                informationText = content.name();
                break;
            case EffectSpecialActionKind.OpenItems:
                content = this.battle.attackingGroup === CharacterKind.Hero ? (<
                    Graphic.Item>this.battle.windowChoicesItems
                    .getCurrentContent()).system : Datas.Items.get(this.battle
                    .action.itemID.getValue());
                informationText = content.name();
                break;
            default:
                informationText = "";
                break;
        }
        this.battle.windowTopInformations.content = new Graphic.Text(
            informationText, { align: Align.Center });
        this.battle.time = new Date().getTime();
        this.battle.effects = [];
        let i: number, l: number;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                if (this.battle.attackingGroup === CharacterKind.Hero) {
                    let equipments = this.battle.user.player.equip;
                    let j: number, m: number, gameItem: Item, weapon: System
                        .Weapon;
                    for (i = 0, l = equipments.length; i < l; i++) {
                        gameItem = equipments[i];
                        if (gameItem && gameItem.kind === ItemKind.Weapon) {
                            weapon = gameItem.getItemInformations();
                            this.battle.animationUser = new Animation(weapon
                                .animationUserID.getValue());
                            this.battle.animationTarget = new Animation(weapon
                                .animationTargetID.getValue());
                            for (j = 0, m = weapon.effects.length; j < m; j++) {
                                this.battle.effects.push(weapon.effects[j]);
                            }
                        }
                    }
                }
                if (this.battle.effects.length === 0) {
                    this.battle.animationUser = new Animation(Datas.Skills.get(1)
                        .animationUserID.getValue());
                    this.battle.animationTarget = new Animation(Datas.Skills.get(1)
                        .animationTargetID.getValue());
                    let effects = this.battle.attackSkill.effects;
                    for (i = 1, l = effects.length; i < l; i++) {
                        this.battle.effects.push(effects[i]);
                    }
                }
                this.battle.user.setAttacking();
                break;
            case EffectSpecialActionKind.OpenSkills:
                this.battle.animationUser = new Animation(content
                    .animationUserID.getValue());
                this.battle.animationTarget = new Animation(content
                    .animationTargetID.getValue());
                this.battle.effects = content.effects;
                content.cost();
                this.battle.user.setUsingSkill();
                break;
            case EffectSpecialActionKind.OpenItems:
                let graphic = <Graphic.Item>this.battle.windowChoicesItems
                    .getCurrentContent();
                this.battle.animationUser = new Animation(content
                    .animationUserID.getValue());
                this.battle.animationTarget = new Animation(content
                    .animationTargetID.getValue());
                this.battle.effects = content.effects;
                if (this.battle.attackingGroup === CharacterKind.Hero) {
                    Game.current.useItem(graphic.item);
                }
                this.battle.user.setUsingItem();
                break;
            case EffectSpecialActionKind.EndTurn:
                this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
                let user: Battler;
                for (i = 0, l = this.battle.battlers[CharacterKind.Hero].length; 
                    i < l; i++)
                {
                    user = this.battle.battlers[CharacterKind.Hero][i];
                    user.setActive(false);
                    user.setSelected(false);
                }
                this.battle.subStep = 2;
                break;
            case EffectSpecialActionKind.DoNothing:
                this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
                this.battle.subStep = 2;
                break;
        }
        this.battle.currentEffectIndex = 0;
        if (this.battle.effects.length > 0) {
            this.battle.effects[this.battle.currentEffectIndex].execute();
        }
        if (this.battle.animationUser && this.battle.animationUser.system === null) {
            this.battle.animationUser = null;
        }
        if (this.battle.animationTarget && this.battle.animationTarget.system === null) {
            this.battle.animationTarget = null;
        }
    }

    /** 
     *  Get the animation efect condition kind.
     *  @returns {AnimationEffectConditionKind}
     */
    public getCondition(): AnimationEffectConditionKind {
        if (this.battle.targets[0]) {
            if (this.battle.targets[0].isDamagesMiss) {
                return AnimationEffectConditionKind.Miss;
            }
            if (this.battle.targets[0].isDamagesCritical) {
                return AnimationEffectConditionKind.Critical;
            }
        }
        return AnimationEffectConditionKind.Hit;
    }

    /**
     *  Update the targets attacked and check if they are dead.
     */
    public updateTargetsAttacked() {
        let target: Battler, previousFirst: Status;
        for (let i = 0, l = this.battle.targets.length; i < l; i++) {
            target = this.battle.targets[i];
            target.updateDead((target.damages > 0 || target.nextStatusID !== null) 
                && !target.isDamagesMiss, this.battle.user.player);
            previousFirst = target.player.status[0];

            // Release status after attacked
            target.player.removeAfterAttackedStatus();
             
            // Add or remove status
            if (target.nextStatusID !== null) {
                if (target.nextStatusAdd) {
                    target.addStatus(target.nextStatusID);
                } else {
                    target.removeStatus(target.nextStatusID);
                }
            }

            // If first status changed, change animation
            target.updateAnimationStatus(previousFirst);
        }
    }

    /**
     *  Update the battle.
     */
    public update() {
        let i: number, l: number;
        switch (this.battle.subStep) {
        case 0: // Animation user
            // Before animation, wait for enemy moving
            if (this.battle.user.moving) {
                return;
            }

            // User animation if exists
            if (this.battle.animationUser) {
                this.battle.animationUser.update();
                this.battle.animationUser.playSounds(this.getCondition());
                Manager.Stack.requestPaintHUD = true;
            }

            // Test if animation finished
            if ((!this.battle.animationUser || this.battle.animationUser.frame > 
                this.battle.animationUser.system.frames.length) && !this.battle
                .user.isAttacking()) {
                if (!this.battle.animationTarget) {
                    this.battle.time = new Date().getTime() - (Scene.Battle
                        .TIME_ACTION_ANIMATION / 2);
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].timeDamage = 0;
                    }
                    this.updateTargetsAttacked();
                    this.battle.subStep = 2;
                } else {
                    this.battle.subStep = 1;
                }
            }
            break;
        case 1: // Animation target
            // Target animation if exists
            this.battle.animationTarget.update();
            this.battle.animationTarget.playSounds(this.getCondition());
            Manager.Stack.requestPaintHUD = true;
            if (this.battle.animationTarget.frame > this.battle.animationTarget
                .system.frames.length) {
                this.battle.time = new Date().getTime() - (Scene.Battle
                    .TIME_ACTION_ANIMATION / 2);
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.targets[i].timeDamage = 0;
                }
                this.updateTargetsAttacked();
                this.battle.subStep = 2;
            }
            break;
        case 2: // Damages
            // If calling a common reaction, wait for it to be finished
            if (this.battle.reactionInterpreters.length > 0) {
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.targets[i].timeDamage = 0;
                }
                return;
            }
            if ((new Date().getTime() - this.battle.time) >= Scene.Battle
                .TIME_ACTION_ANIMATION) {

                // Target and user test death
                this.battle.user.updateDead(false);
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.targets[i].updateDead(false);
                }

                // Testing end of battle
                let effect: System.Effect, isAnotherEffect: boolean;
                if (this.battle.isWin()) {
                    this.battle.winning = true;
                    this.battle.activeGroup();
                    this.battle.changeStep(Enum.BattleStep.Victory);
                } else if (this.battle.isLose()) {
                    this.battle.winning = false;
                    this.battle.changeStep(Enum.BattleStep.Victory);
                } else {
                    effect = this.battle.effects[this.battle.currentEffectIndex];
                    this.battle.currentEffectIndex++;
                    for (l = this.battle.effects.length; this.battle
                        .currentEffectIndex < l; this.battle.currentEffectIndex++)
                    {
                        this.battle.targets = this.battle.tempTargets;
                        effect = this.battle.effects[this.battle.currentEffectIndex];
                        effect.execute();
                        if (effect.isAnimated()) {
                            break;
                        }
                    }
                    isAnotherEffect = this.battle.currentEffectIndex < this
                        .battle.effects.length;
                    if (isAnotherEffect) {
                        this.battle.time = new Date().getTime() - (Scene.Battle
                            .TIME_ACTION_ANIMATION / 2);
                        for (let j = 0, ll = this.battle.targets.length; j < ll;
                            j++) {
                            this.battle.targets[j].timeDamage = 0;
                        }
                        return;
                    } else {
                        this.battle.user.setActive(false);
                        this.battle.user.setSelected(false);
                    }

                    // Testing end of turn
                    if (this.battle.battleStartTurn.active) {
                        this.battle.changeStep(Enum.BattleStep.StartTurn);
                        return;
                    }
                    if (this.battle.isEndTurn()) {
                        this.battle.activeGroup();
                        this.battle.switchAttackingGroup();
                        this.battle.changeStep(Enum.BattleStep.StartTurn);
                    } else {
                        if (this.battle.attackingGroup === CharacterKind.Hero) {
                            this.battle.changeStep(Enum.BattleStep.Selection); // Attack of heroes
                        } else {
                            this.battle.changeStep(Enum.BattleStep.EnemyAttack); // Attack of ennemies
                        }
                    }
                }
            }
            break;
        }
    }

    /** 
     *  Handle key pressed.
     *   @param {number} key - The key ID 
     */
    public onKeyPressedStep(key: number) {

    }

    /** 
     *  Handle key released.
     *  @param {number} key - The key ID 
     */
    public onKeyReleasedStep(key: number) {

    }

    /** 
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID 
     *  @returns {boolean}
     */
    public onKeyPressedRepeatStep(key: number): boolean {
        return true;
    }

    /** 
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean} 
     */
    public onKeyPressedAndRepeatStep(key: number): boolean {
        return true;
    }

    /** 
     *  Draw the battle HUD.
     */
    public drawHUDStep() {
        this.battle.windowTopInformations.draw();

        // Draw animations
        if (this.battle.animationUser) {
            this.battle.animationUser.draw(this.battle.user);
        }
        let i: number, l: number;
        if (this.battle.animationTarget) {
            if (this.battle.animationTarget.system.positionKind === 
                AnimationPositionKind.ScreenCenter) {
                this.battle.animationTarget.draw(null);
            } else {
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.animationTarget.draw(this.battle.targets[i]);
                }
            }
        }

        // Draw damages
        if (this.battle.reactionInterpreters.length === 0 && !this.battle.user
            .isAttacking() && (!this.battle.animationTarget || this.battle
            .animationTarget.frame > this.battle.animationTarget.system.frames
            .length)) {
            for (i = 0, l = this.battle.targets.length; i < l; i++) {
                this.battle.targets[i].drawDamages();
            }
        }
    }
}

export { BattleAnimation }