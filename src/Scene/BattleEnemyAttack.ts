
/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene, System, Datas } from "..";
import { Enum, Mathf, Interpreter, Utils } from "../Common";
import CharacterKind = Enum.CharacterKind;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import EffectKind = Enum.EffectKind;
import MonsterActionKind = Enum.MonsterActionKind
import TargetKind = Enum.TargetKind;
import MonsterActionTargetKind = Enum.MonsterActionTargetKind;
import { Battler, Game } from "../Core";

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 3 : Enemy attack (IA)
//
// -------------------------------------------------------

class BattleEnemyAttack {

    public battle: Scene.Battle

    public constructor(battle: Scene.Battle) {
        this.battle = battle;
    }

    /** 
     *  Initialize step.
     */
    initialize() {
        this.battle.windowTopInformations.content = null;
        this.battle.attackingGroup = CharacterKind.Monster;

        // Define which monster will attack
        let i = 0;
        do {
            this.battle.user = this.battle.battlers[CharacterKind.Monster][i];
            i++;
        } while (!this.battle.isDefined(CharacterKind.Monster, i - 1));

        // Define action
        this.defineAction();

        // Define targets
        this.defineTargets();

        this.battle.time = new Date().getTime();
        this.battle.timeEnemyAttack = new Date().getTime();
    }

    /** 
     *  Define the action to do.
     */
    defineAction() {
        let actions = [];
        let player = this.battle.user.player;
        let monster = <System.Monster>player.system;
        let systemActions = monster.actions;
        let priorities = 0;
        this.battle.action = this.battle.actionDoNothing;
        this.battle.battleCommandKind = EffectSpecialActionKind.DoNothing;

        // List every possible actions
        let i: number, l: number, action: System.MonsterAction, stat: System
            .Statistic, number: number;
        for (i = 0, l = systemActions.length; i < l; i++) {
            action = systemActions[i];
            if (action.isConditionTurn && !Mathf.OPERATORS_COMPARE[action
                .operationKindTurn](this.battle.turn, action.turnValueCompare
                .getValue())) {
                continue;
            }
            if (action.isConditionStatistic) {
                stat = Datas.BattleSystems.getStatistic(action.statisticID
                    .getValue());
                if (!Mathf.OPERATORS_COMPARE[action.operationKindStatistic](
                    player[stat.abbreviation] / player[stat.getMaxAbbreviation()]
                    * 100, action.statisticValueCompare.getValue())) {
                    continue;
                }
            }
            if (action.isConditionVariable && !Mathf.OPERATORS_COMPARE[action
                .operationKindVariable](Game.current.variables[action
                .variableID], action.variableValueCompare.getValue())) {
                continue;
            }
            if (action.isConditionStatus) {
                // TODO
            }
            if (action.isConditionScript && !Interpreter.evaluate(action.script
                .getValue())) {
                continue;
            }
            if (action.actionKind === MonsterActionKind.UseSkill) {
                if (!Datas.Skills.get(action.skillID.getValue()).isPossible()) {
                    continue;
                }
            }
            if (action.actionKind === MonsterActionKind.UseItem) {
                number = this.battle.user.itemsNumbers[action.itemID.getValue()];
                if (!Utils.isUndefined(number) && number === 0) {
                    continue;
                }
            }

            // Push to possible actions if passing every conditions
            actions.push(action);
            priorities += action.priority.getValue();
        }

        // If no action
        if (priorities <= 0) {
            return;
        }

        // Random
        let random = Mathf.random(0, 100);
        let step = 0;
        let value: number;
        for (i = 0, l = actions.length; i < l; i++) {
            action = actions[i];
            value = (action.priority.getValue() / priorities) * 100;
            if (random >= step && random <= (value + step)) {
                this.battle.action = action;
                break;
            }
            step += value;
        }

        // Define battle command kind
        switch (this.battle.action.actionKind) {
            case MonsterActionKind.UseSkill:
                let effect = Datas.Skills.get(this.battle.action.skillID
                    .getValue()).effects[0];
                if (effect) {
                    this.battle.battleCommandKind = effect.kind === EffectKind
                        .SpecialActions ? effect.specialActionKind : 
                        EffectSpecialActionKind.OpenSkills;
                } else {
                    this.battle.battleCommandKind = EffectSpecialActionKind
                        .OpenSkills;
                }
                this.battle.attackSkill = Datas.Skills.get(this.battle.action
                    .skillID.getValue());
                break;
            case MonsterActionKind.UseItem:
                this.battle.battleCommandKind = EffectSpecialActionKind
                    .OpenItems;

                // If item, use one
                let id = this.battle.action.itemID.getValue();
                this.battle.user.itemsNumbers[id] = (this.battle.user
                    .itemsNumbers[id] ? this.battle.user.itemsNumbers[id] : this
                    .battle.action.itemNumberMax.getValue()) - 1;
                break;
            case MonsterActionKind.DoNothing:
                this.battle.battleCommandKind = EffectSpecialActionKind.DoNothing;
                break;
        }
    }

    /** 
     *  Define the targets
     */
    defineTargets() {
        if (!this.battle.action) {
            this.battle.targets = [];
            return;
        }

        // Verify if the target is not all allies or all enemies and define side
        let targetKind: TargetKind, side: CharacterKind;
        switch (this.battle.action.actionKind) {
            case MonsterActionKind.UseSkill:
                targetKind = Datas.Skills.get(this.battle.action.skillID
                    .getValue()).targetKind;
                break;
            case MonsterActionKind.UseItem:
                targetKind = Datas.Items.get(this.battle.action.itemID
                    .getValue()).targetKind;
                break;
            case MonsterActionKind.DoNothing:
                this.battle.targets = [];
                return;
        }
        switch (targetKind) {
            case TargetKind.None:
                this.battle.targets = [];
                return;
            case TargetKind.User:
                this.battle.targets = [this.battle.user];
                return;
            case TargetKind.Enemy:
                side = CharacterKind.Hero;
                break;
            case TargetKind.Ally:
                side = CharacterKind.Monster;
                break;
            case TargetKind.AllEnemies:
                this.battle.targets = this.battle.battlers[CharacterKind.Hero];
                return;
            case TargetKind.AllAllies:
                this.battle.targets = this.battle.battlers[CharacterKind.Monster];
                return;
        }

        // Select one enemy / ally according to target kind
        let l = this.battle.battlers[side].length;
        let i: number, target: Battler;
        switch (this.battle.action.targetKind) {
            case MonsterActionTargetKind.Random:
                i = Mathf.random(0, l - 1);
                while (!this.battle.isDefined(side, i)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                break;
            case MonsterActionTargetKind.WeakEnemies:
                i = 0;
                while (!this.battle.isDefined(side, i)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                let minHP = target.player['hp'];
                let tempTarget: Battler, tempHP: Battler;
                while (i < l) {
                    tempTarget = this.battle.battlers[side][i];
                    if (this.battle.isDefined(side, i)) {
                        tempHP = tempTarget.player['hp'];
                        if (tempHP < minHP) {
                            target = tempTarget;
                        }
                    }
                    i++;
                }
                break;
        }
        this.battle.targets = [target];
    }

    /** 
     *  Update the battle
     */
    update() {
        if (new Date().getTime() - this.battle.time >= 500) {
            if (this.battle.action.actionKind !== MonsterActionKind.DoNothing) {
                this.battle.user.setSelected(true);
            }
            if (new Date().getTime() - this.battle.timeEnemyAttack >= 1000) {
                this.battle.changeStep(2);
            }
        }
    }

    /** 
     *  Handle key pressed.
     *  @param {number} key - The key ID 
     */
    onKeyPressedStep(key: number) {

    }

    /** 
     *  Handle key released.
     *   @param {number} key - The key ID 
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
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
    }
}

export { BattleEnemyAttack }