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
//  CLASS SystemMonster : SystemHero
//
// -------------------------------------------------------

/** @class
*   A monster of the game.
*   @extends SystemHero
*/
function SystemMonster(){
    SystemHero.call(this);
}

SystemMonster.prototype = Object.create(SystemHero.prototype);

// -------------------------------------------------------

SystemMonster.prototype.readJSON = function(json) {
    var i, hash, currenciesLength, jsonCurrencies, progression, jsonLoots,
        lootsLength, loot, jsonActions, actionsLength, action;

    this.rewards = {};
    SystemHero.prototype.readJSON.call(this, json);

    jsonCurrencies = json.cur;
    currenciesLength = jsonCurrencies.length;
    jsonLoots = RPM.jsonDefault(json.loots, []);
    lootsLength = jsonLoots.length;
    jsonActions = RPM.jsonDefault(json.a, []);
    actionsLength = jsonActions.length;
    this.rewards.xp = new SystemProgressionTable(this.getProperty("finalLevel"));
    this.rewards.currencies = new Array(currenciesLength);
    this.rewards.loots = new Array(lootsLength);
    this.actions = new Array(actionsLength);

    // Experience
    this.rewards.xp.readJSON(json.xp);

    // Currencies
    for (i = 0; i < currenciesLength; i++) {
        hash = jsonCurrencies[i];
        progression = new SystemProgressionTable(hash.k);
        progression.readJSON(hash.v);
        this.rewards.currencies[i] = progression;
    }

    // Loots
    for (i = 0; i < lootsLength; i++) {
        loot = new SystemLoot();
        loot.readJSON(jsonLoots[i]);
        this.rewards.loots[i] = loot;
    }

    // Actions
    for (i = 0; i < actionsLength; i++) {
        action = new SystemMonsterAction();
        action.readJSON(jsonActions[i]);
        action.monster = this;
        this.actions[i] = action;
    }
}

// -------------------------------------------------------

SystemMonster.prototype.getRewardExperience = function(level) {
    return this.rewards.xp.getProgressionAt(level, this.getProperty(
        "finalLevel"));
}

// -------------------------------------------------------

SystemMonster.prototype.getRewardCurrencies = function(level) {
    var i, l, currencies, progression;
    currencies = {};
    for (i = 0, l = this.rewards.currencies.length; i < l; i++) {
        progression = this.rewards.currencies[i];
        currencies[progression.id] = progression.getProgressionAt(level, this
            .getProperty("finalLevel"));
    }

    return currencies;
}

// -------------------------------------------------------

SystemMonster.prototype.getRewardLoots = function(level) {
    var i, l, loots, loot, list;

    list = new Array(3);
    list[LootKind.Item] = {};
    list[LootKind.Weapon] = {};
    list[LootKind.Armor] = {};

    for (i = 0, l = this.rewards.loots.length; i < l; i++) {
        loot = this.rewards.loots[i].currenLoot(level);
        if (loot !== null) {
            loots = list[loot.k];
            if (loots.hasOwnProperty(loot.id)) {
                loots[loot.id] += loot.nb;
            } else {
                loots[loot.id] = loot.nb;
            }
        }
    }

    return list;
}
