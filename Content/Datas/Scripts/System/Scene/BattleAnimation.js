/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, Graphic, Datas, Manager } from "../index.js";
import { Enum, Utils } from "../Common/index.js";
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var CharacterKind = Enum.CharacterKind;
var Align = Enum.Align;
var ItemKind = Enum.ItemKind;
var AnimationEffectConditionKind = Enum.AnimationEffectConditionKind;
var BattleStep = Enum.BattleStep;
var AnimationPositionKind = Enum.AnimationPositionKind;
import { Game } from "../Core/index.js";
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
    constructor(battle) {
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        let informationText, content;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                informationText = this.battle.attackSkill.name();
                break;
            case EffectSpecialActionKind.OpenSkills:
                content = this.battle.attackingGroup === CharacterKind.Hero ? this.battle.windowChoicesSkills
                    .getCurrentContent().system : Datas.Skills.get(this.battle
                    .action.skillID.getValue());
                informationText = content.name();
                break;
            case EffectSpecialActionKind.OpenItems:
                content = this.battle.attackingGroup === CharacterKind.Hero ? this.battle.windowChoicesItems
                    .getCurrentContent().system : Datas.Items.get(this.battle
                    .action.itemID.getValue());
                informationText = content.name();
                break;
            default:
                informationText = "";
                break;
        }
        this.battle.windowTopInformations.content = new Graphic.Text(informationText, { align: Align.Center });
        this.battle.time = new Date().getTime();
        this.battle.effects = [];
        this.battle.frameUser = 0;
        this.battle.frameTarget = 0;
        let i, l;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                if (this.battle.attackingGroup === CharacterKind.Hero) {
                    let equipments = this.battle.user.player.equip;
                    let j, m, gameItem, weapon;
                    for (i = 0, l = equipments.length; i < l; i++) {
                        gameItem = equipments[i];
                        if (gameItem && gameItem.kind === ItemKind.Weapon) {
                            weapon = gameItem.getItemInformations();
                            this.battle.userAnimation = Datas.Animations.get(weapon.animationUserID.getValue());
                            this.battle.targetAnimation = Datas.Animations.get(weapon.animationTargetID.getValue());
                            for (j = 0, m = weapon.effects.length; j < m; j++) {
                                this.battle.effects.push(weapon.effects[j]);
                            }
                        }
                    }
                }
                if (this.battle.effects.length === 0) {
                    this.battle.userAnimation = Datas.Animations.get(Datas
                        .Skills.get(1).animationUserID.getValue());
                    this.battle.targetAnimation = Datas.Animations.get(Datas
                        .Skills.get(1).animationTargetID.getValue());
                    let effects = this.battle.attackSkill.effects;
                    for (i = 1, l = effects.length; i < l; i++) {
                        this.battle.effects.push(effects[i]);
                    }
                }
                this.battle.user.setAttacking();
                break;
            case EffectSpecialActionKind.OpenSkills:
                this.battle.userAnimation = Datas.Animations.get(content
                    .animationUserID.getValue());
                this.battle.targetAnimation = Datas.Animations.get(content
                    .animationTargetID.getValue());
                this.battle.effects = content.effects;
                content.cost();
                this.battle.user.setUsingSkill();
                break;
            case EffectSpecialActionKind.OpenItems:
                let graphic = this.battle.windowChoicesItems
                    .getCurrentContent();
                this.battle.userAnimation = Datas.Animations.get(content
                    .animationUserID.getValue());
                this.battle.targetAnimation = Datas.Animations.get(content
                    .animationTargetID.getValue());
                this.battle.effects = content.effects;
                if (this.battle.attackingGroup === CharacterKind.Hero) {
                    Game.current.useItem(graphic.item);
                }
                this.battle.user.setUsingItem();
                break;
            case EffectSpecialActionKind.EndTurn:
                this.battle.time -= Scene.Battle.TIME_ACTION_ANIMATION;
                let user;
                for (i = 0, l = this.battle.battlers[CharacterKind.Hero].length; i < l; i++) {
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
        if (this.battle.userAnimation) {
            this.battle.userAnimationPicture = this.battle.userAnimation
                .createPicture();
        }
        if (this.battle.targetAnimation) {
            this.battle.targetAnimationPicture = this.battle.targetAnimation
                .createPicture();
        }
    }
    /**
     *  Get the animation efect condition kind.
     *  @returns {AnimationEffectConditionKind}
     */
    getCondition() {
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
     *  Update the battle.
     */
    update() {
        let i, l;
        switch (this.battle.subStep) {
            case 0: // Animation user
                // Before animation, wait for enemy moving
                if (this.battle.user.moving) {
                    return;
                }
                // User animation if exists
                if (this.battle.userAnimation) {
                    this.battle.frameUser++;
                    this.battle.userAnimation.playSounds(this.battle.frameUser, this
                        .getCondition());
                    Manager.Stack.requestPaintHUD = true;
                }
                // Test if animation finished
                if ((!this.battle.userAnimation || this.battle.frameUser > this
                    .battle.userAnimation.frames.length) && !this.battle.user
                    .isAttacking()) {
                    if (!this.battle.targetAnimation) {
                        this.battle.time = new Date().getTime() - (Scene.Battle
                            .TIME_ACTION_ANIMATION / 2);
                        for (i = 0, l = this.battle.targets.length; i < l; i++) {
                            this.battle.targets[i].timeDamage = 0;
                        }
                        this.battle.subStep = 2;
                    }
                    else {
                        this.battle.subStep = 1;
                    }
                }
                break;
            case 1: // Animation target
                // Target animation if exists
                this.battle.frameTarget++;
                this.battle.targetAnimation.playSounds(this.battle.frameTarget, this
                    .getCondition());
                Manager.Stack.requestPaintHUD = true;
                if (this.battle.frameTarget > this.battle.targetAnimation.frames
                    .length) {
                    this.battle.time = new Date().getTime() - (Scene.Battle
                        .TIME_ACTION_ANIMATION / 2);
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].timeDamage = 0;
                    }
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
                    let target;
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        target = this.battle.targets[i];
                        if (!Utils.isUndefined(target)) {
                            target.updateDead(target.damages > 0 &&
                                !target.isDamagesMiss, this.battle.user.player);
                        }
                    }
                    Manager.Stack.requestPaintHUD = true;
                    // Target and user test death
                    this.battle.user.updateDead(false);
                    for (i = 0, l = this.battle.targets.length; i < l; i++) {
                        this.battle.targets[i].updateDead(false);
                    }
                    // Testing end of battle
                    let effect, isAnotherEffect;
                    if (this.battle.isWin()) {
                        this.battle.winning = true;
                        this.battle.activeGroup();
                        this.battle.changeStep(4);
                    }
                    else if (this.battle.isLose()) {
                        this.battle.winning = false;
                        this.battle.changeStep(BattleStep.Victory);
                    }
                    else {
                        effect = this.battle.effects[this.battle.currentEffectIndex];
                        this.battle.currentEffectIndex++;
                        for (l = this.battle.effects.length; this.battle
                            .currentEffectIndex < l; this.battle.currentEffectIndex++) {
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
                            for (let j = 0, ll = this.battle.targets.length; j < ll; j++) {
                                this.battle.targets[j].timeDamage = 0;
                            }
                            return;
                        }
                        else {
                            this.battle.user.setActive(false);
                            this.battle.user.setSelected(false);
                        }
                        // Testing end of turn
                        if (this.battle.isEndTurn()) {
                            this.battle.activeGroup();
                            if (this.battle.attackingGroup === CharacterKind.Hero) {
                                this.battle.changeStep(3); // Attack of ennemies
                            }
                            else {
                                this.battle.turn++;
                                this.battle.changeStep(1); // Attack of heroes
                            }
                        }
                        else {
                            if (this.battle.attackingGroup === CharacterKind.Hero) {
                                this.battle.changeStep(1); // Attack of heroes
                            }
                            else {
                                this.battle.changeStep(3); // Attack of ennemies
                            }
                        }
                    }
                }
                break;
        }
    }
    /**
     *  Handle key pressed.
     *   @param {number} key The key ID
     */
    onKeyPressedStep(key) {
    }
    /**
     *  Handle key released.
     *  @param {number} key The key ID
     */
    onKeyReleasedStep(key) {
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key) {
        return true;
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
        // Draw animations
        if (this.battle.userAnimation) {
            this.battle.userAnimation.draw(this.battle.userAnimationPicture, this.battle.frameUser, this.battle.user);
        }
        let i, l;
        if (this.battle.targetAnimation) {
            if (this.battle.targetAnimation.positionKind ===
                AnimationPositionKind.ScreenCenter) {
                this.battle.targetAnimation.draw(this.battle
                    .targetAnimationPicture, this.battle.frameTarget, null);
            }
            else {
                for (i = 0, l = this.battle.targets.length; i < l; i++) {
                    this.battle.targetAnimation.draw(this.battle
                        .targetAnimationPicture, this.battle.frameTarget, this
                        .battle.targets[i]);
                }
            }
        }
        // Draw damages
        if (this.battle.reactionInterpreters.length === 0 && !this.battle.user
            .isAttacking() && (!this.battle.targetAnimation || this.battle
            .frameTarget > this.battle.targetAnimation.frames.length)) {
            for (i = 0, l = this.battle.targets.length; i < l; i++) {
                this.battle.targets[i].drawDamages();
            }
        }
    }
}
export { BattleAnimation };
