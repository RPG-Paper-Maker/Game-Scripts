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
    this.kind = json.k ? json.k : EffectKind.Damages;

    switch (this.kind) {
    case EffectKind.Damages:
        this.damageKind = json.dk ? json.dk : DamagesKind.Stat;
        switch (this.damageKind) {
        case DamagesKind.Stat:
            this.damageStatisticID = SystemValue.readOrDefaultDatabase(json.dsid);
            break;
        case DamagesKind.Currency:
            this.damageCurrencyID = SystemValue.readOrDefaultDatabase(json.dcid);
            break;
        case DamagesKind.Variable:
            this.damageVariableID = json.dvid ? json.dvid : 1;
            break;
        }
        this.damageFormula = SystemValue.readOrDefaultMessage(json.df);
        this.isDamageElement = json.ide ? json.ide : false;
        this.damageElementID = SystemValue.readOrDefaultDatabase(json.deid);
        this.isDamageVariance = json.idv ? json.idv : false;
        this.damageVarianceFormula = SystemValue.readOrDefaultMessage(json.dvf,
            "0");
        this.isDamageCritical = json.idc ? json.idc : false;
        this.damageCriticalFormula = SystemValue.readOrDefaultMessage(json.dcf,
            "0");
        this.isDamagePrecision = json.idp ? json.idp : false;
        this.damagePrecisionFormula = SystemValue.readOrDefaultMessage(json.dpf,
            "100");
        break;
    case EffectKind.Status:
        this.isAddStatus = json.iast ? json.iast : true;
        this.statusID = SystemValue.readOrDefaultDatabase(json.sid);
        this.statusPrecisionFormula = SystemValue.readOrDefaultMessage(json.spf,
            "100");
        break;
    case EffectKind.AddRemoveSkill:
        this.isAddSkill = json.iask ? json.iask : true;
        this.addSkillID = SystemValue.readOrDefaultDatabase(json.asid);
        break;
    case EffectKind.PerformSkill:
        this.performSkillID = SystemValue.readOrDefaultDatabase(json.psid);
        break;
    case EffectKind.CommonReaction:
        this.commonReactionID = SystemValue.readOrDefaultDatabase(json.crid);
        break;
    case EffectKind.SpecialActions:
        this.specialActionKind = json.sak ? json.sak : EffectSpecialActionKind
            .ApplyWeapons;
        break;
    case EffectKind.Script:
        this.scriptFormula = SystemValue.readOrDefaultMessage(json.sf);
        break;
    }
}

// -------------------------------------------------------

SystemEffect.prototype.execute = function(json) {
    switch (this.kind) {
    case EffectKind.Damages:
        switch (this.damageKind) {
        case DamagesKind.Stat:
            break;
        case DamagesKind.Currency:
            break;
        case DamagesKind.Variable:
            break;
        }
        break;
    case EffectKind.Status:
        break;
    case EffectKind.AddRemoveSkill:
        break;
    case EffectKind.PerformSkill:
        break;
    case EffectKind.CommonReaction:
        break;
    case EffectKind.SpecialActions:
        $currentMap.battleCommandKind = this.specialActionKind;
        break;
    case EffectKind.Script:
        break;
    }
}
