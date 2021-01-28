/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Enum, Mathf } from "../Common/index.js";
import { Animation } from "../Core/index.js";
// -------------------------------------------------------
//
//  CLASS BattleStartTurn
//
//      SubStep 0 : Random attacks
//      SubStep 1 : Status effect
//
// -------------------------------------------------------
class BattleStartTurn {
    constructor(battle) {
        this.step = 0;
        this.active = false;
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        this.active = true;
        // Check status releases
        let i, l, user, s;
        if (this.step === 0) {
            for (i = 0, l = this.battle.battlers[this.battle.attackingGroup]
                .length; i < l; i++) {
                user = this.battle.battlers[this.battle.attackingGroup][i];
                if (!user.player.isDead()) {
                    let s = user.player.status[0];
                    user.player.removeStartTurnStatus();
                    user.updateStatusStep();
                    user.updateAnimationStatus(s);
                }
            }
            this.step++;
        }
        // Status effects
        if (this.step === 1) {
            this.step++;
        }
        // Check status restrictions (force attacks)
        if (this.step === 2) {
            for (i = 0, l = this.battle.battlers[this.battle.attackingGroup]
                .length; i < l; i++) {
                user = this.battle.battlers[this.battle.attackingGroup][i];
                if (user.active) {
                    if (user.containsRestriction(Enum.StatusRestrictionsKind
                        .CantDoAnything)) {
                        continue;
                    }
                    if (user.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomAlly)) {
                        this.defineRandom(user, Enum.StatusRestrictionsKind
                            .AttackRandomAlly);
                        return;
                    }
                    if (user.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomEnemy)) {
                        this.defineRandom(user, Enum.StatusRestrictionsKind
                            .AttackRandomEnemy);
                        return;
                    }
                    if (user.containsRestriction(Enum.StatusRestrictionsKind
                        .AttackRandomTarget)) {
                        this.defineRandom(user, Enum.StatusRestrictionsKind
                            .AttackRandomTarget);
                        return;
                    }
                }
            }
            if (this.battle.isEndTurn()) {
                this.battle.activeGroup();
                this.battle.switchAttackingGroup();
                this.battle.changeStep(Enum.BattleStep.StartTurn);
            }
            else {
                this.startSelectionEnemyAttack();
            }
        }
    }
    startSelectionEnemyAttack() {
        this.active = false;
        this.step = 0;
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero) {
            this.battle.changeStep(Enum.BattleStep.Selection); // Attack of heroes
        }
        else {
            this.battle.changeStep(Enum.BattleStep.EnemyAttack); // Attack of ennemies
        }
    }
    defineRandom(user, restriction) {
        this.battle.user = user;
        if (this.battle.attackingGroup === Enum.CharacterKind.Hero) {
            this.battle.battleCommandKind = Enum.EffectSpecialActionKind.OpenSkills;
            this.battle.currentEffectIndex = 0;
            let skills = [];
            let skill;
            for (let i = 0, l = user.player.sk.length; i < l; i++) {
                skill = Datas.Skills.get(user.player.sk[i].id);
                if (!skill.isPossible()) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomAlly &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomEnemy &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
                if (restriction === Enum.StatusRestrictionsKind.AttackRandomTarget &&
                    skill.targetKind !== Enum.TargetKind.AllEnemies && skill
                    .targetKind !== Enum.TargetKind.Enemy) {
                    continue;
                }
                skills.push(skill);
            }
            if (skills.length === 0) {
                this.battle.battleCommandKind = Enum.EffectSpecialActionKind.DoNothing;
                return;
            }
            skill = skills[Mathf.random(0, skills.length - 1)];
            this.battle.currentSkill = skill;
            this.battle.animationUser = new Animation(skill.animationUserID.getValue());
            this.battle.animationTarget = new Animation(skill.animationTargetID.getValue());
            let side;
            switch (restriction) {
                case Enum.StatusRestrictionsKind.AttackRandomAlly:
                    side = Enum.CharacterKind.Hero;
                    break;
                case Enum.StatusRestrictionsKind.AttackRandomEnemy:
                    side = Enum.CharacterKind.Monster;
                    break;
                case Enum.StatusRestrictionsKind.AttackRandomTarget:
                    side = Mathf.random(0, 1) === 0 ? Enum.CharacterKind
                        .Hero : Enum.CharacterKind.Monster;
                    break;
            }
            switch (skill.targetKind) {
                case Enum.TargetKind.AllEnemies: {
                    this.battle.targets = this.battle.battlers[side];
                    break;
                }
                case Enum.TargetKind.Enemy: {
                    this.battle.targets = [this.battle.battlers[side][Mathf
                            .random(0, this.battle.battlers[side].length - 1)]];
                    break;
                }
            }
        }
        else {
            this.battle.battleEnemyAttack.defineAction(restriction);
            this.battle.battleEnemyAttack.defineTargets(restriction);
        }
        this.battle.changeStep(Enum.BattleStep.Animation);
    }
    /**
     *  Update the battle.
     */
    update() {
    }
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key) {
    }
    /**
     *  Handle key released.
     *  @param {number} key - The key ID
     */
    onKeyReleasedStep(key) {
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
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
    }
}
export { BattleStartTurn };
