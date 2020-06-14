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
//  CLASS SystemEffect
//
// -------------------------------------------------------

/** @class
*   An effect of a common skill item.
*/
function SystemEffect() {
    this.currentCommonReactionState = null;
}

// -------------------------------------------------------

SystemEffect.prototype.readJSON = function(json) {
    this.kind = typeof json.k !== 'undefined' ? json.k : EffectKind.Damages;

    switch (this.kind) {
    case EffectKind.Damages:
        this.damageKind = typeof json.dk !== 'undefined' ? json.dk : DamagesKind
            .Stat;
        switch (this.damageKind) {
        case DamagesKind.Stat:
            this.damageStatisticID = SystemValue.readOrDefaultDatabase(json.dsid);
            break;
        case DamagesKind.Currency:
            this.damageCurrencyID = SystemValue.readOrDefaultDatabase(json.dcid);
            break;
        case DamagesKind.Variable:
            this.damageVariableID = typeof json.dvid !== 'undefined' ? json.dvid
                : 1;
            break;
        }
        this.damageFormula = SystemValue.readOrDefaultMessage(json.df);
        this.isDamagesMinimum = RPM.defaultValue(json.idmin, true);
        this.damagesMinimumFormula = SystemValue.readOrDefaultMessage(json.dmin,
            "0");
        this.isDamagesMaximum = RPM.defaultValue(json.idmax, false);
        this.damagesMaximumFormula = SystemValue.readOrDefaultMessage(json.dmax,
            "0");
        this.isDamageElement = typeof json.ide !== 'undefined' ? json.ide :
            false;
        this.damageElementID = SystemValue.readOrDefaultDatabase(json.deid);
        this.isDamageVariance = typeof json.idv !== 'undefined' ? json.idv :
            false;
        this.damageVarianceFormula = SystemValue.readOrDefaultMessage(json.dvf,
            "0");
        this.isDamageCritical = typeof json.idc !== 'undefined' ? json.idc :
            false;
        this.damageCriticalFormula = SystemValue.readOrDefaultMessage(json.dcf,
            "0");
        this.isDamagePrecision = typeof json.idp !== 'undefined' ? json.idp :
            false;
        this.damagePrecisionFormula = SystemValue.readOrDefaultMessage(json.dpf,
            "100");
        this.isDamageStockVariableID = RPM.jsonDefault(json.idsv, false);
        this.damageStockVariableID = RPM.jsonDefault(json.dsv, 1);
        break;
    case EffectKind.Status:
        this.isAddStatus = typeof json.iast !== 'undefined' ? json.iast : true;
        this.statusID = SystemValue.readOrDefaultDatabase(json.sid);
        this.statusPrecisionFormula = SystemValue.readOrDefaultMessage(json.spf,
            "100");
        break;
    case EffectKind.AddRemoveSkill:
        this.isAddSkill = typeof json.iask !== 'undefined' ? json.iask : true;
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
        this.specialActionKind = typeof json.sak !== 'undefined' ? json.sak :
            EffectSpecialActionKind.ApplyWeapons;
        break;
    case EffectKind.Script:
        this.scriptFormula = SystemValue.readOrDefaultMessage(json.sf);
        break;
    }
    this.isTemporarilyChangeTarget = RPM.jsonDefault(json.itct, false);
    this.temporarilyChangeTargetFormula = SystemValue.readOrDefaultMessage(json
        .tctf);
}

// -------------------------------------------------------

SystemEffect.prototype.execute = function() {
    var user, targets, target, result;
    var i, l;

    user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM.currentMap.user
        .character : RPM.currentMap.user) : GamePlayer.getTemporaryPlayer();
    RPM.currentMap.tempTargets = RPM.currentMap.targets;
    if (this.isTemporarilyChangeTarget)
    {
        RPM.currentMap.targets = RPM.evaluateFormula(this
            .temporarilyChangeTargetFormula.getValue(), user, null)
    }
    targets = RPM.currentMap.targets;
    result = false;

    switch (this.kind) {
    case EffectKind.Damages:
        var j, ll, damage, miss, crit, element, variance, critical, precision,
            random, before;

        l = targets.length;
        RPM.currentMap.damages = new Array(l);
        for (i = 0; i < l; i++) {
            damage = 0;
            miss = false;
            crit = false;
            target = RPM.currentMap.isBattleMap ? targets[i].character : targets[i];
            if (this.isDamagePrecision) {
                precision = RPM.evaluateFormula(this.damagePrecisionFormula
                    .getValue(), user, target);
                random = RPM.random(0, 100);
                if (precision < random) {
                    damage = null;
                    miss = true;
                }
            }
            if (damage !== null) {
                damage = RPM.evaluateFormula(this.damageFormula.getValue(), user
                    , target);
                if (this.isDamageVariance) {
                    variance = Math.round(damage * RPM.evaluateFormula(this
                        .damageVarianceFormula.getValue(), user, target) / 100);
                    damage = RPM.random(damage - variance, damage + variance);
                }
                if (this.isDamageElement) {
                    var fixRes, percentRes;

                    element = this.damageElementID.getValue();
                    fixRes = target[RPM.datasGame.battleSystem.statistics[
                        RPM.datasGame.battleSystem.statisticsElements[element]]
                        .abbreviation]
                    percentRes = target[RPM.datasGame.battleSystem.statistics[
                        RPM.datasGame.battleSystem.statisticsElementsPercent[
                        element]].abbreviation]
                    damage -= (damage * percentRes / 100);
                    damage -= fixRes;
                }
                if (this.isDamageCritical) {
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
            }
            if (this.isDamageStockVariableID)
            {
                RPM.game.variables[this.damageStockVariableID] = damage === null ?
                    0 : damage;
            }

            // For diplaying result in HUD
            if (RPM.currentMap.isBattleMap) {
                RPM.currentMap.damages[i] = [damage, crit, miss];
            }

            switch (this.damageKind) {
            case DamagesKind.Stat:
                var stat = RPM.datasGame.battleSystem.statistics[this
                    .damageStatisticID.getValue()];
                var abbreviation = stat.abbreviation;
                var max = target[stat.getMaxAbbreviation()];

                before = target[abbreviation];
                target[abbreviation] -= damage;
                if (target[abbreviation] < 0) {
                    target[abbreviation] = 0;
                }
                if (!stat.isFix) {
                    target[abbreviation] = Math.min(target[abbreviation], max);
                }
                result = result || (before !== max && damage !== 0);
                break;
            case DamagesKind.Currency:
                var currencyID = this.damageCurrencyID.getValue();
                if (target.k === CharacterKind.Hero) {
                    before = RPM.game.currencies[currencyID];
                    RPM.game.currencies[currencyID] -= damage;
                    if (RPM.game.currencies[currencyID] < 0) {
                        RPM.game.currencies[currencyID] = 0;
                    }
                    result = result || (before !== RPM.game.currencies[currencyID]
                        && damage !== 0);
                }    
                break;
            case DamagesKind.Variable:
                before = RPM.game.variables[this.damageVariableID];
                RPM.game.variables[this.damageVariableID] -= damage;
                if (RPM.game.variables[this.damageVariableID] < 0) {
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
        RPM.currentMap.reactionInterpreters.push(new ReactionInterpreter(null, RPM.datasGame
                    .commonEvents.commonReactions[this.commonReaction.commonReactionID], null, null,
                    this.commonReaction.parameters));

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

SystemEffect.prototype.isAnimated = function() {
    return this.kind === EffectKind.Damages || this.kind === EffectKind.Status
        || this.kind === EffectKind.CommonReaction;
}

// -------------------------------------------------------

SystemEffect.prototype.toString = function() {
    var user, target, result;
    var i, l;

    user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM.currentMap.user
        .character : RPM.currentMap.user) : GamePlayer.getTemporaryPlayer();
    /*
    target = RPM.currentMap.targets && RPM.currentMap.targets.length > 0 ? (
        RPM.currentMap.isBattleMap ? RPM.currentMap.targets[RPM.currentMap
        .selectedUserTargetIndex()] : RPM.currentMap.target) : GamePlayer
        .getTemporaryPlayer();
    */
    target = GamePlayer.getTemporaryPlayer();

    switch (this.kind) {
    case EffectKind.Damages:
        var damage, variance, min, max, precision, critical, temp, options,
            damageName;
        damage = RPM.evaluateFormula(this.damageFormula.getValue(), user, target);
        if (damage === 0) {
            return "";
        }
        precision = 100;
        critical = 0;
        variance = 0;
        if (this.isDamageVariance) {
            variance = Math.round(damage * RPM.evaluateFormula(this
                .damageVarianceFormula.getValue(), user, target) / 100);
        }
        min = damage - variance;
        max = damage + variance;
        if (damage < 0) {
            temp = min;
            min = -max;
            max = -temp;
        }
        options = [];
        if (this.isDamagePrecision) {
            precision = RPM.evaluateFormula(this.damagePrecisionFormula
                .getValue(), user, target);
            options.push("precision: " + precision + "%");
        }
        if (this.isDamageCritical) {
            critical = RPM.evaluateFormula(this.damageCriticalFormula
                .getValue(), user, target);
            options.push("critical: " + critical + "%");
        }
        damageName = "";
        switch (this.damageKind) {
        case DamagesKind.Stat:
            damageName = RPM.datasGame.battleSystem.statistics[this
                .damageStatisticID.getValue()].name;
            break;
        case DamagesKind.Currency:
            damageName = RPM.datasGame.system.currencies[this.damageCurrencyID
                .getValue()].name;
            break;
        case DamagesKind.Variable:
            damageName = RPM.datasGame.variablesNames[this.damageVariableID];
            break;
        }
        return (damage > 0 ? "Damage" : "Heal") + " " + damageName + ": " + (min
            === max ? min : min + " - " + max) + (options.length > 0 ? " [" +
            options.join(" - ") +  "]" : "");
    case EffectKind.Status:
        return (this.isAddStatus ? "Add" : "Remove") + " " + " [precision: " +
            RPM.evaluateFormula(this.statusPrecisionFormula.getValue(), user,
            target) + "%]";
    case EffectKind.AddRemoveSkill:
        return (this.isAddSkill ? "Add" : "Remove") + " skill " + RPM.datasGame
            .skills.list[this.addSkillID.getValue()].name;
    case EffectKind.PerformSkill:
        return "Perform skill " + RPM.datasGame.skills.list[this.performSkillID
            .getValue()].name;
    default:
        return "";
    }
}
