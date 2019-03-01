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
    this.kind = json.k;

    switch (this.kind) {
    case CaractericticKind.IncreaseDecrease:
        this.isIncreaseDecrease = json.iid;
        this.increaseDecreaseKind = json.idk;
        switch (this.increaseDecreaseKind) {
        case IncreaseDecreaseKind.StatValue:
            this.statisticValueID = new SystemValue();
            this.statisticValueID.read(json.svid);
            break;
        case IncreaseDecreaseKind.ElementRes:
            this.elementResID = new SystemValue();
            this.elementResID.read(json.erid);
            break;
        case IncreaseDecreaseKind.StatusRes:
            this.statusResID = new SystemValue();
            this.statusResID.read(json.strid);
            break;
        case IncreaseDecreaseKind.CurrencyGain:
            this.currencyGainID = new SystemValue();
            this.currencyGainID.read(json.cgid);
            break;
        case IncreaseDecreaseKind.SkillCost:
            this.skillCostID = new SystemValue();
            this.skillcostID.read(json.scid);
            this.isAllSkillCost = json.iasc;
            break;
        case IncreaseDecreaseKind.Variable:
            this.variableID = json.vid;
            break;
        }
        this.operation = json.o;
        this.value = new SystemValue();
        this.value.read(json.v);
        this.unit = json.u;
        break;
    case CaractericticKind.Script:
        this.script = new SystemValue();
        this.script.read(json.s);
        break;
    case CaractericticKind.AllowForbidEquip:
        this.isAllowEquip = json.iae;
        this.isAllowEquipWeapon = json.iaew;
        this.equipWeaponTypeID = new SystemValue();
        this.equipWeaponTypeID.read(json.ewtid);
        this.equipArmorTypeID = new SystemValue();
        this.equipArmorTypeID.read(json.eatid);
        break;
    case CaractericticKind.AllowForbidChange:
        this.isAllowChangeEquipment = json.iace;
        this.changeEquipmentID = new SystemValue();
        this.changeEquipmentID.read(json.ceid);
        break;
    case CaractericticKind.BeginEquipment:
        this.beginEquipmentID = new SystemValue();
        this.beginEquipmentID.read(json.beid);
        this.isBeginWeapon = json.ibw;
        this.beginWeaponArmorID = json.bwaid;
        break;
    }
}
