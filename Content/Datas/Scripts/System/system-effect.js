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
    this.kind = json.k;

    switch (this.kind) {
    case EffectKind.Damages:
        this.damageKind = json.dk;
        switch (this.kind) {
        case DamagesKind.Stat:
            this.damageStatisticID = new SystemValue();
            this.damageStatisticID.read(json.dsid);
            break;
        case DamagesKind.Currency:
            this.damageCurrencyID = new SystemValue();
            this.damageCurrencyID.read(json.dcid);
            break;
        case DamagesKind.Variable:
            this.damageVariableID = json.dvid;
            break;
        }
        this.damageFormula = new SystemValue();
        this.damageFormula.read(json.df);
        this.isDamageElement = json.ide;
        this.damageElementID = new SystemValue();
        this.damageElementID.read(json.deid);
        this.isDamageVariance = json.idv;
        this.damageVarianceFormula = new SystemValue();
        this.damageVarianceFormula.read(json.dvf);
        this.isDamageCritical = json.idc;
        this.damageCriticalFormula = new SystemValue();
        this.damageCriticalFormula.read(json.dcf);
        this.isDamagePrecision = json.idp;
        this.damagePrecisionFormula = new SystemValue();
        this.damagePrecisionFormula.read(json.dpf);
        break;
    case EffectKind.Status:
        this.isAddStatus = json.iast;
        this.statusID = new SystemValue();
        this.statusID.read(json.sid);
        this.statusPrecisionFormula = new SystemValue();
        this.statusPrecisionFormula.read(json.spf);
        break;
    case EffectKind.AddRemoveSkill:
        this.isAddSkill = json.iask;
        this.addSkillID = new SystemValue();
        this.addSkillID.read(json.asid);
        break;
    case EffectKind.PerformSkill:
        this.performSkillID = new SystemValue();
        this.performSkillID.read(json.psid);
        break;
    case EffectKind.CommonReaction:
        this.commonReactionID = new SystemValue();
        this.commonReactionID.read(json.crid);
        break;
    case EffectKind.SpecialActions:
        this.specialActionKind = json.sak;
        break;
    case EffectKind.Script:
        this.scriptFormula = new SystemValue();
        this.scriptFormula.read(json.sf);
        break;
    }
}
