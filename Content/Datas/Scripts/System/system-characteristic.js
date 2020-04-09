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
//  CLASS SystemCaracterisitic
//
// -------------------------------------------------------

/** @class
*   A characteristic of a common skill item.
*/
function SystemCharacteristic() {

}

// -------------------------------------------------------

SystemCharacteristic.prototype.readJSON = function(json) {
    this.kind = typeof json.k !== 'undefined' ? json.k : CharacteristicKind
        .IncreaseDecrease;

    switch (this.kind) {
    case CharacteristicKind.IncreaseDecrease:
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
    case CharacteristicKind.Script:
        this.script = SystemValue.readOrDefaultMessage(json.s);
        break;
    case CharacteristicKind.AllowForbidEquip:
        this.isAllowEquip = typeof json.iae !== 'undefined' ? json.iae : true;
        this.isAllowEquipWeapon = typeof json.iaew ? json.iaew : true;
        this.equipWeaponTypeID = SystemValue.readOrDefaultDatabase(json.ewtid);
        this.equipArmorTypeID = SystemValue.readOrDefaultDatabase(json.eatid);
        break;
    case CharacteristicKind.AllowForbidChange:
        this.isAllowChangeEquipment = typeof json.iace !== 'undefined' ? json
            .iace : true;
        this.changeEquipmentID = SystemValue.readOrDefaultDatabase(json.ceid);
        break;
    case CharacteristicKind.BeginEquipment:
        this.beginEquipmentID = SystemValue.readOrDefaultDatabase(json.beid);
        this.isBeginWeapon = typeof json.ibw !== 'undefined' ? json.ibw : true;
        this.beginWeaponArmorID = SystemValue.readOrDefaultDatabase(json.bwaid);
        break;
    }
}

// -------------------------------------------------------

SystemCharacteristic.prototype.getNewStatValue = function(gamePlayer) {
    var statID, stat, value, baseStatValue;

    switch (this.kind) {
    case CharacteristicKind.IncreaseDecrease:
        switch (this.increaseDecreaseKind) {
        case IncreaseDecreaseKind.StatValue:
            statID = this.statisticValueID.getValue();
            stat = $datasGame.battleSystem.statistics[statID];
            value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : - 1);
            baseStatValue = gamePlayer[stat.getAbbreviationNext()] - gamePlayer[
                stat.getBonusAbbreviation()];
            if (this.operation) { // *
                value = this.unit ? baseStatValue * Math.round(baseStatValue *
                    value / 100) : baseStatValue * value; // % / Fix
            } else { // +
                value = this.unit ? Math.round(baseStatValue * value / 100) :
                    value; // % / Fix
            }
            return [statID, value];
        case IncreaseDecreaseKind.ElementRes:
            statID = this.unit ? $datasGame.battleSystem
                .statisticsElementsPercent[this.elementResID.getValue()] :
                $datasGame.battleSystem.statisticsElements[this.elementResID
                .getValue()];
            stat = $datasGame.battleSystem.statistics[statID];
            value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : - 1);
            if (this.operation) { // *
                value *= gamePlayer[stat.getAbbreviationNext()] - gamePlayer[
                    stat.getBonusAbbreviation()];
            }
            return [statID, value];
        default:
            return null;
        }
    default:
        return null;
    }
}

// -------------------------------------------------------

SystemCharacteristic.prototype.toString = function() {
    var user, target, result;

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    /*
    target = $currentMap.targets && $currentMap.targets.length > 0 ? $currentMap
        .targets[$currentMap.selectedUserTargetIndex()] : GamePlayer
        .getTemporaryPlayer();
    */
    target = GamePlayer.getTemporaryPlayer();

    result = "";
    switch (this.kind) {
    case CharacteristicKind.IncreaseDecrease:
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
    case CharacteristicKind.Script:
    case CharacteristicKind.AllowForbidEquip:
    case CharacteristicKind.AllowForbidChange:
    case CharacteristicKind.BeginEquipment:
        break;
    }

    return result;
}
