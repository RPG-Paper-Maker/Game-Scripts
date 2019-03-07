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
//  CLASS SystemCommonSkillItem
//
// -------------------------------------------------------

/** @class
*/
function SystemCommonSkillItem() {
    SystemIcon.call(this);

    this.hasType = true;
    this.hasTargetKind = true;
}

SystemCommonSkillItem.prototype = Object.create(SystemIcon.prototype);

// -------------------------------------------------------

SystemCommonSkillItem.prototype.readJSON = function(json) {
    SystemIcon.prototype.readJSON.call(this, json);
    var jsonCosts, jsonEffects, jsonCaracteristics, cost, effect, caracteristic;
    var i, l;

    this.type = typeof json.t !== 'undefined' ? json.t : 1;
    this.consumable = typeof json.con !== 'undefined' ? json.con : false;
    this.oneHand = typeof json.oh !== 'undefined' ? json.oh : true;
    this.description = new SystemLang();
    if (json.d) {
        this.description.readJSON(json.d);
    }
    this.targetKind = typeof json.tk !== 'undefined' ? json.tk : TargetKind.None;
    this.targetConditionFormula = SystemValue.readOrNone(json.tcf);
    this.conditionFormula = SystemValue.readOrNone(json.cf);
    this.availableKind = typeof json.ak !== 'undefined' ? json.ak : AvailableKind
        .Never;
    this.sound = new SystemPlaySong(SongKind.sound);
    this.sound.readJSON(json.s);
    this.animationUserID = SystemValue.readOrNone(json.auid);
    this.animationTargetID = SystemValue.readOrNone(json.atid);
    this.price = SystemValue.readOrDefaultNumber(json.p, 0);

    jsonCosts = json.cos;
    l = jsonCosts ? jsonCosts.length : 0;
    this.costs = new Array(l);
    for (i = 0; i < l; i++) {
        cost = new SystemCost();
        cost.readJSON(jsonCosts[i]);
        this.costs[i] = cost;
    }
    jsonEffects = json.e;
    l = jsonEffects ? jsonEffects.length : 0;
    this.effects = new Array(l);
    for (i = 0; i < l; i++) {
        effect = new SystemEffect();
        effect.readJSON(jsonEffects[i]);
        this.effects[i] = effect;
    }
    jsonCaracteristics = json.car;
    l = jsonCaracteristics ? jsonCaracteristics.length : 0;
    this.caracteristics = new Array(l);
    for (i = 0; i < l; i++) {
        caracteristic = new SystemCaracteristic();
        caracteristic.readJSON(jsonCaracteristics[i]);
        this.caracteristics[i] = caracteristic;
    }
}

// -------------------------------------------------------

SystemCommonSkillItem.prototype.useInBattle = function() {
    var i, l;

    for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].executeInBattle();
    }
}

// -------------------------------------------------------

SystemCommonSkillItem.prototype.getTargetKindString = function() {
    switch (this.targetKind) {
    case TargetKind.None:
        return "None";
    case TargetKind.User:
        return "The user";
    case TargetKind.Enemy:
        return "An enemy";
    case TargetKind.Ally:
        return "An ally";
    case TargetKind.AllEnemies:
        return "All enemies";
    case TargetKind.AllAllies:
        return "All allies";
    }

    return "";
}
