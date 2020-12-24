
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battle } from "./Battle"
import {Enum} from "../Common/Enum";


// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 3 : Enemy attack (IA)
//
// -------------------------------------------------------

class BattleEnemyAttack {

    battle: Battle
    public constructor(battle: Battle) {
        this.battle = battle;
    }


    // -------------------------------------------------------
    /** Initialize step
    */
    initialize() {
        this.battle.windowTopInformations.content = null;
        this.battle.attackingGroup = Enum.CharacterKind.Monster;

        // Define which monster will attack
        let i = 0;
        do {
            this.battle.user = this.battle.battlers[Enum.CharacterKind.Monster][i];
            i++;
        } while (!this.battle.isDefined(Enum.CharacterKind.Monster, i - 1));

        // Define action
        this.defineAction();

        // Define targets
        this.defineTargets();

        this.battle.time = new Date().getTime();
        this.battle.timeEnemyAttack = new Date().getTime();
    }

    // -------------------------------------------------------
    /** Define the action to do
    */
    defineAction() {
        let actions = [];
        let character = this.battle.user.character;
        let monster = character.character;
        let systemActions = monster.actions;
        let priorities = 0;
        this.battle.action = this.battle.actionDoNothing;
        this.battle.battleCommandKind = Enum.EffectSpecialActionKind.DoNothing;

        // List every possible actions
        let i, l, action, stat, number;
        for (i = 0, l = systemActions.length; i < l; i++) {
            action = systemActions[i];
            if (action.isConditionTurn && !RPM.operators_compare[action
                .operationKindTurn](this.battle.turn, action.turnValueCompare.getValue())) {
                continue;
            }
            if (action.isConditionStatistic) {
                stat = RPM.datasGame.battleSystem.statistics[action.statisticID
                    .getValue()];
                if (!RPM.operators_compare[action.operationKindStatistic](character[
                    stat.abbreviation] / character[stat.getMaxAbbreviation()] * 100,
                    action.statisticValueCompare.getValue())) {
                    continue;
                }
            }
            if (action.isConditionVariable && !RPM.operators_compare[action
                .operationKindVariable](RPM.game.variables[action.variableID],
                    action.variableValueCompare.getValue())) {
                continue;
            }
            if (action.isConditionStatus) {
                // TODO
            }
            if (action.isConditionScript && !RPM.evaluateScript(action.script
                .getValue())) {
                continue;
            }
            if (action.actionKind === Enum.MonsterActionKind.UseSkill) {
                if (!RPM.datasGame.skills.list[action.skillID.getValue()].isPossible()) {
                    continue;
                }
            }
            if (action.actionKind === Enum.MonsterActionKind.UseItem) {
                number = this.battle.user.itemsNumbers[action.itemID.getValue()];
                if (!RPM.isUndefined(number) && number === 0) {
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
        let random = RPM.random(0, 100);
        let step = 0;
        let value;
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
            case Enum.MonsterActionKind.UseSkill:
                let effect = RPM.datasGame.skills.list[this.battle.action.skillID.getValue()]
                    .effects[0];
                if (effect) {
                    this.battle.battleCommandKind = effect.kind === EffectKind.SpecialActions ?
                        effect.specialActionKind : Enum.EffectSpecialActionKind.OpenSkills;
                } else {
                    this.battle.battleCommandKind = Enum.EffectSpecialActionKind.OpenSkills;
                }
                this.battle.attackSkill = RPM.datasGame.skills.list[this.battle.action.skillID
                    .getValue()];
                break;
            case Enum.MonsterActionKind.UseItem:
                this.battle.battleCommandKind = Enum.EffectSpecialActionKind.OpenItems;

                // If item, use one
                let id = this.battle.action.itemID.getValue();
                this.battle.user.itemsNumbers[id] = (this.battle.user.itemsNumbers[id] ? this.battle.user
                    .itemsNumbers[id] : this.battle.action.itemNumberMax.getValue()) - 1;
                break;
            case Enum.MonsterActionKind.DoNothing:
                this.battle.battleCommandKind = Enum.EffectSpecialActionKind.DoNothing;
                break;
        }
    }

    // -------------------------------------------------------
    /** Define the targets
    */
    defineTargets() {
        if (!this.battle.action) {
            this.battle.targets = [];
            return;
        }

        // Verify if the target is not all allies or all enemies and define side
        let Enum.TargetKind, side;
        switch (this.battle.action.actionKind) {
            case Enum.MonsterActionKind.UseSkill:
                Enum.TargetKind = RPM.datasGame.skills.list[this.battle.action.skillID.getValue()]
                    .Enum.TargetKind;
                break;
            case Enum.MonsterActionKind.UseItem:
                Enum.TargetKind = RPM.datasGame.items.list[this.battle.action.itemID.getValue()]
                    .Enum.TargetKind;
                break;
            case Enum.MonsterActionKind.DoNothing:
                this.battle.targets = [];
                return;
        }
        switch (Enum.TargetKind) {
            case Enum.TargetKind.None:
                this.battle.targets = [];
                return;
            case Enum.TargetKind.User:
                this.battle.targets = [this.battle.user];
                return;
            case Enum.TargetKind.Enemy:
                side = Enum.CharacterKind.Hero;
                break;
            case Enum.TargetKind.Ally:
                side = Enum.CharacterKind.Monster;
                break;
            case Enum.TargetKind.AllEnemies:
                this.battle.targets = this.battle.battlers[Enum.CharacterKind.Hero];
                return;
            case Enum.TargetKind.AllAllies:
                this.battle.targets = this.battle.battlers[Enum.CharacterKind.Monster];
                return;
        }

        // Select one enemy / ally according to target kind
        let l = this.battle.battlers[side].length;
        let i, target;
        switch (this.battle.action.Enum.TargetKind) {
            case Enum.MonsterActionTargetKind.Random:
                i = RPM.random(0, l - 1);
                while (!this.battle.isDefined(side, i)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                break;
            case Enum.MonsterAction.TargetKind.WeakEnemies:
                i = 0;
                while (!this.battle.isDefined(side, i)) {
                    i++;
                    i = i % l;
                }
                target = this.battle.battlers[side][i];
                let minHP = target.character.hp;
                let tempTarget, tempHP;
                while (i < l) {
                    tempTarget = this.battle.battlers[side][i];
                    if (this.battle.isDefined(side, i)) {
                        tempHP = tempTarget.character.hp;
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

    // -------------------------------------------------------
    /** Update the battle
    */
    update() {
        if (new Date().getTime() - this.battle.time >= 500) {
            if (this.battle.action.actionKind !== Enum.MonsterActionKind.DoNothing) {
                this.battle.user.setSelected(true);
            }
            if (new Date().getTime() - this.battle.timeEnemyAttack >= 1000) {
                this.battle.changeStep(2);
            }
        }
    }

    // -------------------------------------------------------
    /** Handle key pressed
    *   @param {number} key The key ID 
    */
    onKeyPressedStep(key: number) {

    }

    // -------------------------------------------------------
    /** Handle key released
    *   @param {number} key The key ID 
    */
    onKeyReleasedStep(key: number) {

    }

    // -------------------------------------------------------
    /** Handle key repeat pressed
    *   @param {number} key The key ID 
    */
    onKeyPressedRepeatStep(key: number) {

    }

    // -------------------------------------------------------
    /** Handle key pressed and repeat
    *   @param {number} key The key ID 
    */
    onKeyPressedAndRepeatStep(key: number) {

    }

    // -------------------------------------------------------
    /** Draw the battle HUD
    */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
    }
}

export { BattleEnemyAttack }