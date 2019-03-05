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
        this.value = SystemValue.readOrDefaultMessage(json.v);
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
