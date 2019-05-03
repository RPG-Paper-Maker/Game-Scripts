/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    var jsonCosts, jsonEffects, jsonCharacteristics, cost, effect, characteristic;
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
    this.price = SystemValue.readOrDefaultNumber(json.p);

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
    jsonCharacteristics = json.car;
    l = jsonCharacteristics ? jsonCharacteristics.length : 0;
    this.characteristics = new Array(l);
    for (i = 0; i < l; i++) {
        characteristic = new SystemCharacteristic();
        characteristic.readJSON(jsonCharacteristics[i]);
        this.characteristics[i] = characteristic;
    }
}

// -------------------------------------------------------

SystemCommonSkillItem.prototype.use = function() {
    var i, l, isDoingSomething;

    isDoingSomething = false;
    for (i = 0, l = this.effects.length; i < l; i++) {
        isDoingSomething = isDoingSomething || this.effects[i].execute();
    }
    if (isDoingSomething) {
        for (i = 0, l = this.costs.length; i < l; i++) {
            this.costs[i].use();
        }
    }

    return isDoingSomething;
}

// -------------------------------------------------------

SystemCommonSkillItem.prototype.cost = function() {
    var i, l;

    for (i = 0, l = this.costs.length; i < l; i++) {
        this.costs[i].use();
    }
}

// -------------------------------------------------------

SystemCommonSkillItem.prototype.isPossible = function() {
    var i, l;

    for (i = 0, l = this.costs.length; i < l; i++) {
        if (!this.costs[i].isPossible()) {
            return false;
        }
    }

    return true;
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
