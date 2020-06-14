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
//  Step 3 : Enemy attack (IA)
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep3 = function() {
    var i;

    this.windowTopInformations.content = null;
    this.attackingGroup = CharacterKind.Monster;

    // Define which monster will attack
    i = 0;
    do {
        this.user = this.battlers[CharacterKind.Monster][i];
        i++;
    } while (!this.isDefined(CharacterKind.Monster, i - 1));

    // Define action
    this.defineAction();

    // Define targets
    this.defineTargets();

    this.time = new Date().getTime();
    this.timeEnemyAttack = new Date().getTime();
};

// -------------------------------------------------------

SceneBattle.prototype.defineAction = function()
{
    var i, l, actions, action, priorities, monster, systemActions, random, step,
        value, character;

    actions = [];
    character = this.user.character;
    monster = character.character;
    systemActions = monster.actions;
    priorities = 0;
    this.action = this.actionDoNothing;
    this.battleCommandKind = EffectSpecialActionKind.DoNothing;

    // List every possible actions
    for (i = 0, l = systemActions.length; i < l; i++)
    {
        action = systemActions[i];
        if (action.isConditionTurn && !RPM.operators_compare[action
            .operationKindTurn](this.turn, action.turnValueCompare.getValue()))
        {
            continue;
        }
        if (action.isConditionStatistic)
        {
            var stat;

            stat = RPM.datasGame.battleSystem.statistics[action.statisticID
                .getValue()];
            if (!RPM.operators_compare[action.operationKindStatistic](character[
                stat.abbreviation] / character[stat.getMaxAbbreviation()] * 100,
                action.statisticValueCompare.getValue()))
            {
                continue;
            }
        }
        if (action.isConditionVariable && !RPM.operators_compare[action
            .operationKindVariable](RPM.game.variables[action.variableID], action
            .variableValueCompare.getValue()))
        {
            continue;
        }
        if (action.isConditionStatus)
        {
            // TODO
        }
        if (action.isConditionScript && !RPM.evaluateScript(action.script
            .getValue()))
        {
            continue;
        }
        if (action.actionKind === MonsterActionKind.UseSkill)
        {
            if (!RPM.datasGame.skills.list[action.skillID.getValue()].isPossible())
            {
                continue;
            }
        }
        if (action.actionKind === MonsterActionKind.UseItem)
        {
            var number;

            number = this.user.itemsNumbers[action.itemID.getValue()];
            if (!RPM.isUndefined(number) && number === 0)
            {
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
    random = RPM.random(0, 100);
    step = 0;
    for (i = 0, l = actions.length; i < l; i++)
    {
        action = actions[i];
        value = (action.priority.getValue() / priorities) * 100;
        if (random >= step && random <= (value + step)) {
            this.action = action;
            break;
        }
        step += value;
    }

    // Define battle command kind
    switch (this.action.actionKind)
    {
    case MonsterActionKind.UseSkill:
        var effect;

        effect = RPM.datasGame.skills.list[this.action.skillID.getValue()].effects[0];
        if (effect)
        {
            this.battleCommandKind = effect.kind === EffectKind.SpecialActions ?
                effect.specialActionKind : EffectSpecialActionKind.OpenSkills;
        } else
        {
            this.battleCommandKind = EffectSpecialActionKind.OpenSkills;
        }
        this.attackSkill = RPM.datasGame.skills.list[this.action.skillID
            .getValue()];
        break;
    case MonsterActionKind.UseItem:
        var id;

        this.battleCommandKind = EffectSpecialActionKind.OpenItems;

        // If item, use one
        id = this.action.itemID.getValue();
        this.user.itemsNumbers[id] = (this.user.itemsNumbers[id] ? this.user
            .itemsNumbers[id] : this.action.itemNumberMax.getValue()) - 1;
        break;
    case MonsterActionKind.DoNothing:
        this.battleCommandKind = EffectSpecialActionKind.DoNothing;
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.defineTargets = function() {
    if (!this.action)
    {
        this.targets = [];
        return;
    }

    var i, l, side, targetKind, target;

    // Verify if the target is not all allies or all enemies and define side
    switch (this.action.actionKind)
    {
    case MonsterActionKind.UseSkill:
        targetKind = RPM.datasGame.skills.list[this.action.skillID.getValue()]
            .targetKind;
        break;
    case MonsterActionKind.UseItem:
        targetKind = RPM.datasGame.items.list[this.action.itemID.getValue()]
            .targetKind;
        break;
    case MonsterActionKind.DoNothing:
        this.targets = [];
        return;
    }
    switch (targetKind)
    {
    case TargetKind.None:
        this.targets = [];
        return;
    case TargetKind.User:
        this.targets = [this.user];
        return;
    case TargetKind.Enemy:
        side = CharacterKind.Hero;
        break;
    case TargetKind.Ally:
        side = CharacterKind.Monster;
        break;
    case TargetKind.AllEnemies:
        this.targets = this.battlers[CharacterKind.Hero];
        return;
    case TargetKind.AllAllies:
        this.targets = this.battlers[CharacterKind.Monster];
        return;
    }

    // Select one enemy / ally according to target kind
    l = this.battlers[side].length;
    switch (this.action.targetKind)
    {
    case MonsterActionTargetKind.Random:
        i = RPM.random(0, l - 1);
        while (!this.isDefined(side, i))
        {
            i++;
            i = i % l;
        }
        target = this.battlers[side][i];
        break;
    case MonsterActionTargetKind.WeakEnemies:
        var minHP, tempTarget,tempHP;

        i = 0;
        while (!this.isDefined(side, i))
        {
            i++;
            i = i % l;
        }
        target = this.battlers[side][i];
        minHP = target.character.hp;
        while (i < l)
        {
            tempTarget = this.battlers[side][i];
            if (this.isDefined(side, i))
            {
                tempHP = tempTarget.character.hp;
                if (tempHP < minHP)
                {
                    target = tempTarget;
                }
            }
            i++;
        }
        break;
    }
    this.targets = [target];
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep3 = function(){
    if (new Date().getTime() - this.time >= 500) {
        if (this.action.actionKind !== MonsterActionKind.DoNothing)
        {
            this.user.setSelected(true);
        }
        if (new Date().getTime() - this.timeEnemyAttack >= 1000) {
            this.changeStep(2);
        }
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep3 = function(){
    this.windowTopInformations.draw();
};
