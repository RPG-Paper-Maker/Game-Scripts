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
    this.kind = json.k ? json.k : CaracteristicKind.IncreaseDecrease;

    switch (this.kind) {
    case CaracteristicKind.IncreaseDecrease:
        this.isIncreaseDecrease = json.iid ? json.iid : true;
        this.increaseDecreaseKind = json.idk ? json.idk : IncreaseDecreaseKind
            .StatValue;
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
            this.isAllSkillCost = json.iasc ? json.iasc : true;
            break;
        case IncreaseDecreaseKind.Variable:
            this.variableID = json.vid ? json.vid : 1;
            break;
        }
        this.operation = json.o ? json.o : true;
        this.value = SystemValue.readOrDefaultMessage(json.v);
        this.unit = json.u ? json.u : true;
        break;
    case CaracteristicKind.Script:
        this.script = SystemValue.readOrDefaultMessage(json.s);
        break;
    case CaracteristicKind.AllowForbidEquip:
        this.isAllowEquip = json.iae ? json.iae : true;
        this.isAllowEquipWeapon = json.iaew ? json.iaew : true;
        this.equipWeaponTypeID = SystemValue.readOrDefaultDatabase(json.ewtid);
        this.equipArmorTypeID = SystemValue.readOrDefaultDatabase(json.eatid);
        break;
    case CaracteristicKind.AllowForbidChange:
        this.isAllowChangeEquipment = json.iace ? json.iace : true;
        this.changeEquipmentID = SystemValue.readOrDefaultDatabase(json.ceid);
        break;
    case CaracteristicKind.BeginEquipment:
        this.beginEquipmentID = SystemValue.readOrDefaultDatabase(json.beid);
        this.isBeginWeapon = json.ibw ? json.ibw : true;
        this.beginWeaponArmorID = SystemValue.readOrDefaultDatabase(json.bwaid);
        break;
    }
}
