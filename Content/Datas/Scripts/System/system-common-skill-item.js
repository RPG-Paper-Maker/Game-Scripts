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
}

SystemCommonSkillItem.prototype = Object.create(SystemIcon.prototype);

// -------------------------------------------------------

SystemCommonSkillItem.prototype.readJSON = function(json) {
    SystemIcon.prototype.readJSON.call(this, json);
    var jsonCosts, jsonEffects, jsonCaracteristics, cost, effect, caracteristic;
    var i, l;

    this.type = json.t;
    this.consumable = json.con;
    this.oneHand = json.oh;
    this.description = new SystemLang();
    this.description.readJSON(json.d);
    this.targetKind = json.tk;
    this.targetConditionFormula = new SystemValue();
    this.targetConditionFormula.read(json.tcf);
    this.conditionFormula = new SystemValue();
    this.conditionFormula.read(json.cf);
    this.availableKind = json.ak;
    this.sound = new SystemPlaySong(SongKind.sound);
    this.sound.readJSON(json.s);
    this.animationUserID = new SystemValue();
    this.animationUserID.read(json.auid);
    this.animationTargeyID = new SystemValue();
    this.animationTargetID.read(json.atid);
    this.price = new SystemValue();
    this.price.read(json.p);

    jsonCosts = json.cos;
    l = jsonCosts.length;
    this.costs = new Array(l);
    for (i = 0; i < l; i++) {
        cost = new SystemCost();
        cost.read(jsonCosts[i]);
        this.costs[i] = cost;
    }
    jsonEffects = json.e;
    l = jsonEffects.length;
    this.effects = new Array(l);
    for (i = 0; i < l; i++) {
        effect = new SystemEffect();
        effect.read(jsonEffects[i]);
        this.effects[i] = effect;
    }
    jsonCaracteristics = json.car;
    l = jsonCaracteristics.length;
    this.caracteristics = new Array(l);
    for (i = 0; i < l; i++) {
        caracteristic = new SystemCaracteristic();
        caracteristic.read(jsonCaracteristics[i]);
        this.caracteristics[i] = caracteristic;
    }
}
