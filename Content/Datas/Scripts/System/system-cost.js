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

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    value = RPM.evaluateFormula(this.valueFormula.getValue(), user, target);

    switch (this.kind) {
    case DamagesKind.Stat:
        user[$datasGame.battleSystem.statistics[this.statisticID.getValue()]
            .abbreviation] -= value;
        break;
    case DamagesKind.Currency:
        $game.currencies[this.currencyID.getValue()] -= value;
        break;
    case DamagesKind.Variable:
        $game.variables[this.variableID] -= value;
        break;
    }
}

// -------------------------------------------------------

SystemCost.prototype.isPossible = function() {
    var user, target, value, currentValue;

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    value = RPM.evaluateFormula(this.valueFormula.getValue(), user, target);

    switch (this.kind) {
    case DamagesKind.Stat:
        currentValue = user[$datasGame.battleSystem.statistics[this.statisticID
            .getValue()].abbreviation];
        break;
    case DamagesKind.Currency:
        currentValue = $game.currencies[this.currencyID.getValue()];
        break;
    case DamagesKind.Variable:
        currentValue = $game.variables[this.variableID];
        break;
    }

    return (currentValue - value >= 0);
}

// -------------------------------------------------------

SystemCost.prototype.toString = function() {
    var result, user, target;

    user = $currentMap.user ? ($currentMap.isBattleMap ? $currentMap.user
        .character : $currentMap.user) : GamePlayer.getTemporaryPlayer();
    target = GamePlayer.getTemporaryPlayer();
    result = RPM.evaluateFormula(this.valueFormula.getValue(), user, target) +
        " ";
    switch (this.kind) {
    case DamagesKind.Stat:
        result += $datasGame.battleSystem.statistics[this.statisticID.getValue()
            ].name;
        break;
    case DamagesKind.Currency:
        result += $datasGame.system.currencies[this.currencyID.getValue()].name;
        break;
    case DamagesKind.Variable:
        result += $datasGame.variablesNames[this.variableID];
        break;
    }

    return result;
}
