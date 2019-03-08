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
//  CLASS SystemCaracterisitic
//
// -------------------------------------------------------

/** @class
*   A caracteristic of a common skill item.
*/
function SystemCaracteristic() {

}

// -------------------------------------------------------

SystemCaracteristic.prototype.readJSON = function(json) {
    this.kind = typeof json.k !== 'undefined' ? json.k : CaracteristicKind
        .IncreaseDecrease;

    switch (this.kind) {
    case CaracteristicKind.IncreaseDecrease:
        this.isIncreaseDecrease = typeof json.iid !== 'undefined' ? json.iid :
            true;
        this.increaseDecreaseKind = typeof json.idk !== 'undefined' ? json.idk :
            IncreaseDecreaseKind.StatValue;
        switch (this.increaseDecreaseKind) {
        case IncreaseDecreaseKind.StatValue:
            this.statisticValueID = SystemValue.readOrDefaultDatabase(json.svid);
            break;
        case IncreaseDecreaseKind.ElementRes:
            this.elementResID = SystemValue.readOrDefaultDatabase(json.erid);
            break;
        case IncreaseDecreaseKind.StatusRes:
            this.statusResID = SystemValue.readOrDefaultDatabase(json.strid);
            break;
        case IncreaseDecreaseKind.CurrencyGain:
            this.currencyGainID = SystemValue.readOrDefaultDatabase(json.cgid);
            break;
        case IncreaseDecreaseKind.SkillCost:
            this.skillCostID = SystemValue.readOrDefaultDatabase(json.scid);
            this.isAllSkillCost = typeof json.iasc !== 'undefined' ? json.iasc :
                true;
            break;
        case IncreaseDecreaseKind.Variable:
            this.variableID = typeof json.vid !== 'undefined' ? json.vid : 1;
            break;
        }
        this.operation = typeof json.o !== 'undefined' ? json.o : true;
        this.value = SystemValue.readOrDefaultNumber(json.v);
        this.unit = typeof json.u !== 'undefined' ? json.u : true;
        break;
    case CaracteristicKind.Script:
        this.script = SystemValue.readOrDefaultMessage(json.s);
        break;
    case CaracteristicKind.AllowForbidEquip:
        this.isAllowEquip = typeof json.iae !== 'undefined' ? json.iae : true;
        this.isAllowEquipWeapon = typeof json.iaew ? json.iaew : true;
        this.equipWeaponTypeID = SystemValue.readOrDefaultDatabase(json.ewtid);
        this.equipArmorTypeID = SystemValue.readOrDefaultDatabase(json.eatid);
        break;
    case CaracteristicKind.AllowForbidChange:
        this.isAllowChangeEquipment = typeof json.iace !== 'undefined' ? json
            .iace : true;
        this.changeEquipmentID = SystemValue.readOrDefaultDatabase(json.ceid);
        break;
    case CaracteristicKind.BeginEquipment:
        this.beginEquipmentID = SystemValue.readOrDefaultDatabase(json.beid);
        this.isBeginWeapon = typeof json.ibw !== 'undefined' ? json.ibw : true;
        this.beginWeaponArmorID = SystemValue.readOrDefaultDatabase(json.bwaid);
        break;
    }
}

// -------------------------------------------------------

SystemCaracteristic.prototype.getNewStatValue = function(gamePlayer) {
    var statID, stat, value, baseStatValue;

    switch (this.kind) {
    case CaracteristicKind.IncreaseDecrease:
        switch (this.increaseDecreaseKind) {
        case IncreaseDecreaseKind.StatValue:
            statID = this.statisticValueID.getValue();
            stat = $datasGame.battleSystem.statistics[statID];
            break;
        default:
            return null;
        }
        value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : - 1);
        baseStatValue = gamePlayer[stat.getAbbreviationNext()] - gamePlayer[
            stat.getBonusAbbreviation()];
        if (this.operation) {
            value = this.unit ? baseStatValue * Math.round(baseStatValue * value
                / 100) : baseStatValue * value;
        } else {
            value = this.unit ? Math.round(baseStatValue * value / 100) : value;
        }
        return [statID, value];
    default:
        return null;
    }
}

// -------------------------------------------------------

SystemCaracteristic.prototype.toString = function() {
    var user, target, result;

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = $currentMap.targets && $currentMap.targets.length > 0 ? $currentMap
        .targets[$currentMap.selectedUserTargetIndex()] : GamePlayer
        .getTemporaryPlayer();
    result = "";
    switch (this.kind) {
    case CaracteristicKind.IncreaseDecrease:
        var sign, value;

        switch (this.increaseDecreaseKind) {
        case IncreaseDecreaseKind.StatValue:
            result += $datasGame.battleSystem.statistics[RPM.evaluateFormula(
                this.statisticValueID.getValue(), user, target)].name;
            break;
        case IncreaseDecreaseKind.ElementRes:
            result += $datasGame.battleSystem.elements[this.elementResID
                .getValue()].name + " res.";
            break;
        case IncreaseDecreaseKind.StatusRes:
            break;
        case IncreaseDecreaseKind.ExperienceGain:
            result += $datasGame.battleSystem.getExpStatistic().name + " gain";
            break;
        case IncreaseDecreaseKind.CurrencyGain:
            result += $datasGame.system.currencies[this.currencyGainID
                .getValue()].name + " gain";
            break;
        case IncreaseDecreaseKind.SkillCost:
            if (this.isAllSkillCost) {
                result += "All skills cost";
            } else {
                result += $datasGame.skills.list[this.skillCostID.getValue()]
                    .name + " skill cost";
            }
            break;
        case IncreaseDecreaseKind.Variable:
            result += $datasGame.variablesNames[this.variableID];
            break;
        }
        result += " ";
        sign = this.isIncreaseDecrease ? 1 : -1;
        value = this.value.getValue();
        sign *= Math.sign(value);
        if (this.operation) {
            result += "x";
            if (sign === -1) {
                result += "-";
            }
        } else {
            if (sign === 1) {
                result += "+";
            } else if (sign === -1) {
                result += "-";
            }
        }
        result += Math.abs(value);
        if (this.unit) {
            result += "%";
        }
        break;
    case CaracteristicKind.Script:
    case CaracteristicKind.AllowForbidEquip:
    case CaracteristicKind.AllowForbidChange:
    case CaracteristicKind.BeginEquipment:
        break;
    }

    return result;
}
