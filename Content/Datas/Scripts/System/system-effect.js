/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
        this.commonReactionID = SystemValue.readOrDefaultDatabase(json.crid);
        break;
    case EffectKind.SpecialActions:
        this.specialActionKind = typeof json.sak !== 'undefined' ? json.sak :
            EffectSpecialActionKind.ApplyWeapons;
        break;
    case EffectKind.Script:
        this.scriptFormula = SystemValue.readOrDefaultMessage(json.sf);
        break;
    }
}

// -------------------------------------------------------

SystemEffect.prototype.execute = function(returnIsDoingSomething) {
    var user, targets, target;
    var i, l;
    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    targets = $currentMap.targets;

    switch (this.kind) {
    case EffectKind.Damages:
        var damage, miss, crit, element, variance, critical, precision, random;
        for (i = 0, l = targets.length; i < l; i++) {
            damage = 0;
            miss = false;
            crit = false;
            target = $currentMap.isBattleMap ? targets[i].character : targets[i];
            if (this.isDamagePrecision) {
                precision = RPM.evaluateFormula(this.damagePrecisionFormula
                    .getValue(), user, target);
                random = RPM.random(0, 100);
                if (precision > random) {
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
                    element = this.damageElementID.getValue();
                    // TODO
                }
                if (this.isDamageCritical) {
                    critical = RPM.evaluateFormula(this.damageCriticalFormula
                        .getValue(), user, target);
                    random = RPM.random(0, 100);
                    if (critical <= random) {
                        damage = damage * 2; // TODO Should be script
                        crit = true;
                    }
                }
            }

            if ($currentMap.isBattleMap) {
                $currentMap.damages[i] = [damage, crit, miss];
            }

            switch (this.damageKind) {
            case DamagesKind.Stat:
                var stat = $datasGame.battleSystem.statistics[this
                    .damageStatisticID.getValue()];
                var abbreviation = stat.abbreviation;
                var beforeStat = target[abbreviation];
                var max = target[stat.getMaxAbbreviation()];
                target[abbreviation] -= damage;
                if (target[abbreviation] < 0) {
                    target[abbreviation] = 0;
                }
                if (!stat.isFix) {
                    target[abbreviation] = Math.min(target[abbreviation], max);
                }
                if (returnIsDoingSomething) {
                    return beforeStat !== max && damage !== 0;
                }
                break;
            case DamagesKind.Currency:
                var currencyID = this.damageCurrencyID.getValue();
                if (target.k === CharacterKind.Hero) {
                    $game.currencies[currencyID] -= damage;
                    if ($game.currencies[currencyID] < 0) {
                        $game.currencies[currencyID] = 0;
                    }
                }
                break;
            case DamagesKind.Variable:
                $game.variables[this.damageVariableID] -= damage;
                if ($game.variables[this.damageVariableID] < 0) {
                    $game.variables[this.damageVariableID] = 0;
                }
                break;
            }
            break;
        }
        return true;
    case EffectKind.Status:
        return true;
    case EffectKind.AddRemoveSkill:
        return false;
    case EffectKind.PerformSkill:
        return false;
    case EffectKind.CommonReaction:
        return false;
    case EffectKind.SpecialActions:
        $currentMap.battleCommandKind = this.specialActionKind;
        return false;
    case EffectKind.Script:
        return false;
    }
}

// -------------------------------------------------------

SystemEffect.prototype.toString = function() {
    var user, target, result;
    var i, l;

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    /*
    target = $currentMap.targets && $currentMap.targets.length > 0 ? (
        $currentMap.isBattleMap ? $currentMap.targets[$currentMap
        .selectedUserTargetIndex()] : $currentMap.target) : GamePlayer
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
            damageName = $datasGame.battleSystem.statistics[this
                .damageStatisticID.getValue()].name;
            break;
        case DamagesKind.Currency:
            damageName = $datasGame.system.currencies[this.damageCurrencyID
                .getValue()].name;
            break;
        case DamagesKind.Variable:
            damageName = $datasGame.variablesNames[this.damageVariableID];
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
        return (this.isAddSkill ? "Add" : "Remove") + " skill " + $datasGame
            .skills.list[this.addSkillID.getValue()].name;
    case EffectKind.PerformSkill:
        return "Perform skill " + $datasGame.skills.list[this.performSkillID
            .getValue()].name;
    default:
        return "";
    }
}
