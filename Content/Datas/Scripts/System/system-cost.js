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
//  CLASS SystemCost
//
// -------------------------------------------------------

/** @class
*   A cost of a common skill item.
*/
function SystemCost() {

}

// -------------------------------------------------------

SystemCost.prototype.readJSON = function(json) {
    this.kind = typeof json.k !== 'undefined' ? json.k : DamagesKind.Stat;

    switch (this.kind) {
    case DamagesKind.Stat:
        this.statisticID = SystemValue.readOrDefaultDatabase(json.sid);
        break;
    case DamagesKind.Currency:
        this.currencyID = SystemValue.readOrDefaultDatabase(json.cid);
        break;
    case DamagesKind.Variable:
        this.variableID = typeof json.vid !== 'undefined' ? json.vid : 1;
        break;
    }
    this.valueFormula = SystemValue.readOrDefaultMessage(json.vf);
}

// -------------------------------------------------------

SystemCost.prototype.use = function() {
    var user, target, value, currentValue;

    user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM.currentMap.user
        .character : RPM.currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    value = RPM.evaluateFormula(this.valueFormula.getValue(), user, target);

    switch (this.kind) {
    case DamagesKind.Stat:
        user[RPM.datasGame.battleSystem.statistics[this.statisticID.getValue()]
            .abbreviation] -= value;
        break;
    case DamagesKind.Currency:
        RPM.game.currencies[this.currencyID.getValue()] -= value;
        break;
    case DamagesKind.Variable:
        RPM.game.variables[this.variableID] -= value;
        break;
    }
}

// -------------------------------------------------------

SystemCost.prototype.isPossible = function() {
    var user, target, value, currentValue;

    user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM.currentMap.user
        .character : RPM.currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    value = RPM.evaluateFormula(this.valueFormula.getValue(), user, target);

    switch (this.kind) {
    case DamagesKind.Stat:
        currentValue = user[RPM.datasGame.battleSystem.statistics[this.statisticID
            .getValue()].abbreviation];
        break;
    case DamagesKind.Currency:
        currentValue = RPM.game.currencies[this.currencyID.getValue()];
        break;
    case DamagesKind.Variable:
        currentValue = RPM.game.variables[this.variableID];
        break;
    }

    return (currentValue - value >= 0);
}

// -------------------------------------------------------

SystemCost.prototype.toString = function() {
    var result, user, target;

    user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM.currentMap.user
        .character : RPM.currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    result = RPM.evaluateFormula(this.valueFormula.getValue(), user, target) +
        " ";
    switch (this.kind) {
    case DamagesKind.Stat:
        result += RPM.datasGame.battleSystem.statistics[this.statisticID.getValue()
            ].name;
        break;
    case DamagesKind.Currency:
        result += RPM.datasGame.system.currencies[this.currencyID.getValue()].name;
        break;
    case DamagesKind.Variable:
        result += RPM.datasGame.variablesNames[this.variableID];
        break;
    }

    return result;
}
