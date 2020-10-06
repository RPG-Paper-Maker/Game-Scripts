/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A characteristic of a common skill item
*   @property {CharacteristicKind} kind The characterisitic kind
*   @property {boolean} isIncreaseDecrease Indicate if increase / decrease 
*   exists
*   @property {IncreaseDecreaseKind} increaseDecreaseKind The increase / 
*   decrease kind
*   @property {SystemValue} statisticValueID The statistic value ID
*   @property {SystemValue} elementResID The element res ID value
*   @property {SystemValue} statusResID The status res ID value
*   @property {SystemValue} currencyGainID The currency gain ID value
*   @property {SystemValue} skillCostID The skill cost ID value
*   @property {boolean} isAllSkillCost Indicate if all skill cost exists
*   @property {SystemValue} variableID The variable ID value
*   @property {boolean} operation Indicate operation exists
*   @property {SystemValue} value The value
*   @property {boolean} unit Indicate if unit exists
*   @property {SystemValue} script The script value
*   @property {boolean} isAllowEquip Indicate if allow equip exists
*   @property {boolean} isAllowEquipWeapon Indicate if allow equip weapon exists
*   @property {SystemValue} equipWeaponTypeID The equip weapon type ID value
*   @property {SystemValue} equipArmorTypeID The equip armor type ID value
*   @property {boolean} isAllowChangeEquipment Indicate if allow change 
*   equipment exists
*   @property {SystemValue} changeEquipmentID The change equipment ID value
*   @property {SystemValue} beginEquipmentID The begin equipment ID value
*   @property {boolean} isBeginWeapon Indicate if begin weapon exists
*   @property {SystemValue} beginWeaponArmorID The begin weapon armor ID value
*   @param {Object} [json=undefined] Json object describing the characteristic
*/
class SystemCharacteristic
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the characteristic
    *   @param {Object} json Json object describing the characteristic
    */
    read(json)
    {
        this.kind = RPM.defaultValue(json.k, CharacteristicKind.IncreaseDecrease);
        switch (this.kind)
        {
        case CharacteristicKind.IncreaseDecrease:
            this.isIncreaseDecrease = RPM.defaultValue(json.iid, true);
            this.increaseDecreaseKind = RPM.defaultValue(json.idk, 
                IncreaseDecreaseKind.StatValue);
            switch (this.increaseDecreaseKind)
            {
            case IncreaseDecreaseKind.StatValue:
                this.statisticValueID = SystemValue.readOrDefaultDatabase(json
                    .svid);
                break;
            case IncreaseDecreaseKind.ElementRes:
                this.elementResID = SystemValue.readOrDefaultDatabase(json
                    .erid);
                break;
            case IncreaseDecreaseKind.StatusRes:
                this.statusResID = SystemValue.readOrDefaultDatabase(json
                    .strid);
                break;
            case IncreaseDecreaseKind.CurrencyGain:
                this.currencyGainID = SystemValue.readOrDefaultDatabase(json
                    .cgid);
                break;
            case IncreaseDecreaseKind.SkillCost:
                this.skillCostID = SystemValue.readOrDefaultDatabase(json.scid);
                this.isAllSkillCost = RPM.defaultValue(json.iasc, true);
                break;
            case IncreaseDecreaseKind.Variable:
                this.variableID = RPM.defaultValue(json.vid, 1);
                break;
            }
            this.operation = RPM.defaultValue(json.o, true);
            this.value = SystemValue.readOrDefaultNumber(json.v);
            this.unit = RPM.defaultValue(json.u, true);
            break;
        case CharacteristicKind.Script:
            this.script = SystemValue.readOrDefaultMessage(json.s);
            break;
        case CharacteristicKind.AllowForbidEquip:
            this.isAllowEquip = RPM.defaultValue(json.iae, true);
            this.isAllowEquipWeapon = RPM.defaultValue(json.iaew, true);
            this.equipWeaponTypeID = SystemValue.readOrDefaultDatabase(json
                .ewtid);
            this.equipArmorTypeID = SystemValue.readOrDefaultDatabase(json
                .eatid);
            break;
        case CharacteristicKind.AllowForbidChange:
            this.isAllowChangeEquipment = RPM.defaultValue(json.iace, true);
            this.changeEquipmentID = SystemValue.readOrDefaultDatabase(json.ceid);
            break;
        case CharacteristicKind.BeginEquipment:
            this.beginEquipmentID = SystemValue.readOrDefaultDatabase(json.beid);
            this.isBeginWeapon = RPM.defaultValue(json.ibw, true);
            this.beginWeaponArmorID = SystemValue.readOrDefaultDatabase(json.bwaid);
            break;
        }
    }

    // -------------------------------------------------------
    /** Get the new stat value of a player with this characteristic bonus
    *   @param {GamePlayer} gamePlayer the player
    *   @returns {number[]}
    */
    getNewStatValue(gamePlayer)
    {
        let statID, stat, value, baseStatValue;
        switch (this.kind)
        {
        case CharacteristicKind.IncreaseDecrease:
            switch (this.increaseDecreaseKind)
            {
            case IncreaseDecreaseKind.StatValue:
                statID = this.statisticValueID.getValue();
                stat = RPM.datasGame.battleSystem.statistics[statID];
                value = this.value.getValue() * (this.isIncreaseDecrease ? 1 : 
                    -1);
                baseStatValue = gamePlayer[stat.getAbbreviationNext()] - 
                    gamePlayer[stat.getBonusAbbreviation()];
                if (this.operation) // *
                {
                    value = this.unit ? baseStatValue * Math.round(baseStatValue
                        * value / 100) : baseStatValue * value; // % / Fix
                } else // +
                {
                    value = this.unit ? Math.round(baseStatValue * value / 100) 
                        : value; // % / Fix
                }
                return [statID, value];
            case IncreaseDecreaseKind.ElementRes:
                statID = this.unit ? RPM.datasGame.battleSystem
                    .statisticsElementsPercent[this.elementResID.getValue()] :
                    RPM.datasGame.battleSystem.statisticsElements[this.elementResID
                    .getValue()];
                stat = RPM.datasGame.battleSystem.statistics[statID];
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
    /** Get the string representation of the characteristic
    *   @returns {string}
    */
    toString()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        let target = GamePlayer.getTemporaryPlayer();
        let result = RPM.STRING_EMPTY;
        switch (this.kind)
        {
        case CharacteristicKind.IncreaseDecrease:
            switch (this.increaseDecreaseKind)
            {
            case IncreaseDecreaseKind.StatValue:
                result += RPM.datasGame.battleSystem.statistics[RPM
                    .evaluateFormula(this.statisticValueID.getValue(), user, 
                    target)].name;
                break;
            case IncreaseDecreaseKind.ElementRes:
                result += RPM.datasGame.battleSystem.elements[this.elementResID
                    .getValue()].name + " res.";
                break;
            case IncreaseDecreaseKind.StatusRes:
                break;
            case IncreaseDecreaseKind.ExperienceGain:
                result += RPM.datasGame.battleSystem.getExpStatistic().name + 
                    " gain";
                break;
            case IncreaseDecreaseKind.CurrencyGain:
                result += RPM.datasGame.system.currencies[this.currencyGainID
                    .getValue()].name + " gain";
                break;
            case IncreaseDecreaseKind.SkillCost:
                if (this.isAllSkillCost)
                {
                    result += "All skills cost";
                } else
                {
                    result += RPM.datasGame.skills.list[this.skillCostID
                        .getValue()].name + " skill cost";
                }
                break;
            case IncreaseDecreaseKind.Variable:
                result += RPM.datasGame.variablesNames[this.variableID];
                break;
            }
            result += RPM.STRING_SPACE;
            let sign = this.isIncreaseDecrease ? 1 : -1;
            let value = this.value.getValue();
            sign *= Math.sign(value);
            if (this.operation)
            {
                result += "x";
                if (sign === -1)
                {
                    result += "-";
                }
            } else
            {
                if (sign === 1)
                {
                    result += "+";
                } else if (sign === -1)
                {
                    result += "-";
                }
            }
            result += Math.abs(value);
            if (this.unit)
            {
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
}