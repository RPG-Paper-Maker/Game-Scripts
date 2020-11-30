/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An effect of a common skill item
*   @property {EffectKind} kind The kind of effect
*   @property {DamageKind} damageKind The damage kind
*   @property {SystemValue} damageStatisticID The damage statistic ID value
*   @property {SystemValue} damageCurrencyID The damage currency ID value
*   @property {SystemValue} damageVariableID The damage variable ID value
*   @property {SystemValue} damageFormula The damage formula value
*   @property {boolean} isDamagesMinimum Indicate if damages minimum exists
*   @property {SystemValue} damagesMinimumFormula The damage minimum formula 
*   value
*   @property {boolean} isDamagesMaximum Indicate if damages maximum exists
*   @property {SystemValue} damagesMaximumFormula The damage maximum formula 
*   value
*   @property {boolean} isDamageElement Indicate if damages element exists
*   @property {SystemValue} damageElementID The damage element ID value
*   @property {boolean} isDamageVariance Indicate if damages variance exists
*   @property {SystemValue} damageVarianceFormula The damage variance formula 
*   value
*   @property {boolean} isDamageCritical Indicate if damages critical exists
*   @property {SystemValue} damageCriticalFormula The damage critical formula 
*   value
*   @property {boolean} isDamagePrecision Indicate if damages precision exists
*   @property {SystemValue} damagePrecisionFormula The damage precision formula 
*   value
*   @property {boolean} isDamageStockVariableID Indicate if damages stock 
*   variable ID exists
*   @property {SystemValue} damageStockVariableID The damage stock variable ID 
*   value
*   @property {boolean} isAddStatus Indicate if add status exists
*   @property {SystemValue} statusID The status ID value
*   @property {SystemValue} statusPrecisionFormula The status precision formula 
*   value
*   @property {boolean} isAddSkill Indicate if add skill exists
*   @property {SystemValue} addSkillID The add skill ID value
*   @property {SystemValue} performSkillID The perform skill ID value
*   @property {EventCommand} commonReaction The common reaction to execute
*   @property {EffectSpecialActionKind} specialActionKind The special action 
*   kind
*   @property {SystemValue} scriptFormula The script formula value
*   @property {boolean} isTemporarilyChangeTarget Indicate if temporarily 
*   change target exists
*   @property {SystemValue} temporarilyChangeTargetFormula The temporarily 
*   change target formula value
*   @param {Object} [json=undefined] Json object describing the effect
*/
class SystemEffect
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the effect
    *   @param {Object} json Json object describing the effect
    */
    read(json)
    {
        this.kind = RPM.defaultValue(json.k, EffectKind.Damages);
        switch (this.kind)
        {
        case EffectKind.Damages:
            this.damageKind = RPM.defaultValue(json.dk, DamagesKind.Stat);
            switch (this.damageKind)
            {
            case DamagesKind.Stat:
                this.damageStatisticID = SystemValue.readOrDefaultDatabase(json
                    .dsid);
                break;
            case DamagesKind.Currency:
                this.damageCurrencyID = SystemValue.readOrDefaultDatabase(json
                    .dcid);
                break;
            case DamagesKind.Variable:
                this.damageVariableID = RPM.defaultValue(json.dvid, 1);
                break;
            }
            this.damageFormula = SystemValue.readOrDefaultMessage(json.df);
            this.isDamagesMinimum = RPM.defaultValue(json.idmin, true);
            this.damagesMinimumFormula = SystemValue.readOrDefaultMessage(json
                .dmin, RPM.STRING_ZERO);
            this.isDamagesMaximum = RPM.defaultValue(json.idmax, false);
            this.damagesMaximumFormula = SystemValue.readOrDefaultMessage(json
                .dmax, RPM.STRING_ZERO);
            this.isDamageElement = RPM.defaultValue(json.ide, false);
            this.damageElementID = SystemValue.readOrDefaultDatabase(json.deid);
            this.isDamageVariance = RPM.defaultValue(json.idv, false);
            this.damageVarianceFormula = SystemValue.readOrDefaultMessage(json
                .dvf, RPM.STRING_ZERO);
            this.isDamageCritical = RPM.defaultValue(json.idc, false);
            this.damageCriticalFormula = SystemValue.readOrDefaultMessage(json
                .dcf, RPM.STRING_ZERO);
            this.isDamagePrecision = RPM.defaultValue(json.idp, false);
            this.damagePrecisionFormula = SystemValue.readOrDefaultMessage(json
                .dpf, RPM.numToString(100));
            this.isDamageStockVariableID = RPM.defaultValue(json.idsv, false);
            this.damageStockVariableID = RPM.defaultValue(json.dsv, 1);
            break;
        case EffectKind.Status:
            this.isAddStatus = RPM.defaultValue(json.iast, true);
            this.statusID = SystemValue.readOrDefaultDatabase(json.sid);
            this.statusPrecisionFormula = SystemValue.readOrDefaultMessage(json
                .spf, RPM.numToString(100));
            break;
        case EffectKind.AddRemoveSkill:
            this.isAddSkill = RPM.defaultValue(json.iask, true);
            this.addSkillID = SystemValue.readOrDefaultDatabase(json.asid);
            break;
        case EffectKind.PerformSkill:
            this.performSkillID = SystemValue.readOrDefaultDatabase(json.psid);
            break;
        case EffectKind.CommonReaction:
            this.commonReaction = RPM.isUndefined(json.cr) ? null : EventCommand
                .getEventCommand(json.cr);
            break;
        case EffectKind.SpecialActions:
            this.specialActionKind = RPM.defaultValue(json.sak, 
                EffectSpecialActionKind.ApplyWeapons);
            break;
        case EffectKind.Script:
            this.scriptFormula = SystemValue.readOrDefaultMessage(json.sf);
            break;
        }
        this.isTemporarilyChangeTarget = RPM.defaultValue(json.itct, false);
        this.temporarilyChangeTargetFormula = SystemValue.readOrDefaultMessage(
            json.tctf);
    }

    // -------------------------------------------------------
    /** Execute the effect
    *   @returns {boolean} 
    */
    execute()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        RPM.currentMap.tempTargets = RPM.currentMap.targets;
        if (this.isTemporarilyChangeTarget)
        {
            RPM.currentMap.targets = RPM.evaluateFormula(this
                .temporarilyChangeTargetFormula.getValue(), user, null);
        }
        let targets = RPM.currentMap.targets;
        let result = false;
        switch (this.kind)
        {
        case EffectKind.Damages:
            let l = targets.length;
            RPM.currentMap.damages = new Array(l);
            let damage, miss, crit, target, precision, random, variance, fixRes, 
                percentRes, element, critical, stat, abbreviation, max, before,
                currencyID;
            for (let i = 0; i < l; i++)
            {
                damage = 0;
                miss = false;
                crit = false;
                target = RPM.currentMap.isBattleMap ? targets[i].character : 
                    targets[i];

                // Calculate damages
                if (this.isDamagePrecision)
                {
                    precision = RPM.evaluateFormula(this.damagePrecisionFormula
                        .getValue(), user, target);
                    random = RPM.random(0, 100);
                    if (precision < random)
                    {
                        damage = null;
                        miss = true;
                    }
                }
                if (damage !== null)
                {
                    damage = RPM.evaluateFormula(this.damageFormula.getValue(), 
                        user, target);
                    if (this.isDamageVariance)
                    {
                        variance = Math.round(damage * RPM.evaluateFormula(this
                            .damageVarianceFormula.getValue(), user, target) / 
                            100);
                        damage = RPM.random(damage - variance, damage + variance);
                    }
                    if (this.isDamageElement)
                    {
                        element = this.damageElementID.getValue();
                        fixRes = target[RPM.datasGame.battleSystem.statistics[
                            RPM.datasGame.battleSystem.statisticsElements[
                            element]].abbreviation];
                        percentRes = target[RPM.datasGame.battleSystem
                            .statistics[RPM.datasGame.battleSystem
                            .statisticsElementsPercent[element]].abbreviation]
                        damage -= (damage * percentRes / 100);
                        damage -= fixRes;
                    }
                    if (this.isDamageCritical)
                    {
                        critical = RPM.evaluateFormula(this.damageCriticalFormula
                            .getValue(), user, target);
                        random = RPM.random(0, 100);
                        if (random <= critical) {
                            damage = RPM.evaluateFormula(RPM.evaluateFormula(
                                RPM.datasGame.battleSystem.formulaCrit.getValue(),
                                user, target, damage));
                            crit = true;
                        }
                    }
                    if (this.isDamagesMinimum) {
                        damage = Math.max(damage, RPM.evaluateFormula(this
                            .damagesMinimumFormula.getValue(), user, target));
                    }
                    if (this.isDamagesMaximum) {
                        damage = Math.min(damage, RPM.evaluateFormula(this
                            .damagesMaximumFormula.getValue(), user, target));
                    }
                    damage = Math.round(damage);
                }
                if (this.isDamageStockVariableID)
                {
                    RPM.game.variables[this.damageStockVariableID] = damage === 
                        null ? 0 : damage;
                }

                // For diplaying result in HUD
                if (RPM.currentMap.isBattleMap)
                {
                    RPM.currentMap.damages[i] = [damage, crit, miss];
                }

                // Result accoring to damage kind
                switch (this.damageKind)
                {
                case DamagesKind.Stat:
                    stat = RPM.datasGame.battleSystem.statistics[this
                        .damageStatisticID.getValue()];
                    abbreviation = stat.abbreviation;
                    max = target[stat.getMaxAbbreviation()];
                    before = target[abbreviation];
                    target[abbreviation] -= damage;
                    if (target[abbreviation] < 0)
                    {
                        target[abbreviation] = 0;
                    }
                    if (!stat.isFix)
                    {
                        target[abbreviation] = Math.min(target[abbreviation], 
                            max);
                    }
                    result = result || (before !== max && damage !== 0);
                    break;
                case DamagesKind.Currency:
                    currencyID = this.damageCurrencyID.getValue();
                    if (target.k === CharacterKind.Hero)
                    {
                        before = RPM.game.currencies[currencyID];
                        RPM.game.currencies[currencyID] -= damage;
                        if (RPM.game.currencies[currencyID] < 0)
                        {
                            RPM.game.currencies[currencyID] = 0;
                        }
                        result = result || (before !== RPM.game.currencies[
                            currencyID] && damage !== 0);
                    }    
                    break;
                case DamagesKind.Variable:
                    before = RPM.game.variables[this.damageVariableID];
                    RPM.game.variables[this.damageVariableID] -= damage;
                    if (RPM.game.variables[this.damageVariableID] < 0)
                    {
                        RPM.game.variables[this.damageVariableID] = 0;
                    }
                    result = result || (before !== RPM.game.variables[this
                        .damageVariableID] && damage !== 0);
                    break;
                }
            }
            break;
        case EffectKind.Status:
            break;
        case EffectKind.AddRemoveSkill:
            break;
        case EffectKind.PerformSkill:
            break;
        case EffectKind.CommonReaction:
            RPM.currentMap.reactionInterpreters.push(new ReactionInterpreter(
                null, RPM.datasGame.commonEvents.commonReactions[this
                .commonReaction.commonReactionID], null, null, this
                .commonReaction.parameters));
            break;
        case EffectKind.SpecialActions:
            RPM.currentMap.battleCommandKind = this.specialActionKind;
            break;
        case EffectKind.Script:
            break;
        }
        return result;
    }

    // -------------------------------------------------------
    /** Check if the effect is animated
    *   @returns {boolean}
    */
    isAnimated()
    {
        return this.kind === EffectKind.Damages || this.kind === EffectKind
            .Status || this.kind === EffectKind.CommonReaction;
    }

    // -------------------------------------------------------
    /** Get the string representation of the effect
    *   @returns {boolean}
    */
    toString()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        let target = GamePlayer.getTemporaryPlayer();
        switch (this.kind)
        {
        case EffectKind.Damages:
            let damage = RPM.evaluateFormula(this.damageFormula.getValue(), user, target);
            if (damage === 0)
            {
                return RPM.STRING_EMPTY;
            }
            let precision = 100;
            let critical = 0;
            let variance = 0;
            if (this.isDamageVariance)
            {
                variance = Math.round(damage * RPM.evaluateFormula(this
                    .damageVarianceFormula.getValue(), user, target) / 100);
            }
            let min = damage - variance;
            let max = damage + variance;
            if (damage < 0)
            {
                let temp = min;
                min = -max;
                max = -temp;
            }
            let options = [];
            if (this.isDamagePrecision)
            {
                precision = RPM.evaluateFormula(this.damagePrecisionFormula
                    .getValue(), user, target);
                options.push("precision: " + precision + "%");
            }
            if (this.isDamageCritical)
            {
                critical = RPM.evaluateFormula(this.damageCriticalFormula
                    .getValue(), user, target);
                options.push("critical: " + critical + "%");
            }
            let damageName = RPM.STRING_EMPTY;
            switch (this.damageKind)
            {
            case DamagesKind.Stat:
                damageName = RPM.datasGame.battleSystem.statistics[this
                    .damageStatisticID.getValue()].name;
                break;
            case DamagesKind.Currency:
                damageName = RPM.datasGame.system.currencies[this
                    .damageCurrencyID.getValue()].name;
                break;
            case DamagesKind.Variable:
                damageName = RPM.datasGame.variablesNames[this.damageVariableID];
                break;
            }
            return (damage > 0 ? "Damage" : "Heal") + " " + damageName + ": " + 
                (min === max ? min : min + " - " + max) + (options.length > 0 ? 
                " [" + options.join(" - ") +  "]" : "");
        case EffectKind.Status:
            return (this.isAddStatus ? "Add" : "Remove") + " " + " [precision: " 
                + RPM.evaluateFormula(this.statusPrecisionFormula.getValue(), 
                user, target) + "%]";
        case EffectKind.AddRemoveSkill:
            return (this.isAddSkill ? "Add" : "Remove") + " skill " + RPM
                .datasGame.skills.list[this.addSkillID.getValue()].name;
        case EffectKind.PerformSkill:
            return "Perform skill " + RPM.datasGame.skills.list[this
                .performSkillID.getValue()].name;
        default:
            return RPM.STRING_EMPTY;
        }
    }
}
