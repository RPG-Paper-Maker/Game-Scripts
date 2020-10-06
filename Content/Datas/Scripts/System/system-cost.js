/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A cost of a common skill item
*   @property {DamagesKind} kind The kind of damage to apply cost
*   @property {number} statisticID The statistic ID to apply cost
*   @property {number} currencyID The currency ID to apply cost
*   @property {number} variableID The variable ID to apply cost
*   @property {string} valueFormula The formula to apply
*   @param {Object} [json=undefined] Json object describing the cost
*/
class SystemCost
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the cost
    *   @param {Object} json Json object describing the cost
    */
    read(json)
    {
        this.kind = RPM.defaultValue(json.k, DamagesKind.Stat);
        switch (this.kind)
        {
        case DamagesKind.Stat:
            this.statisticID = SystemValue.readOrDefaultDatabase(json.sid);
            break;
        case DamagesKind.Currency:
            this.currencyID = SystemValue.readOrDefaultDatabase(json.cid);
            break;
        case DamagesKind.Variable:
            this.variableID = RPM.defaultValue(json.vid, 1);
            break;
        }
        this.valueFormula = SystemValue.readOrDefaultMessage(json.vf);
    }
    
    // -------------------------------------------------------
    /** Use the cost
    */
    use()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        let target = GamePlayer.getTemporaryPlayer();
        let value = RPM.evaluateFormula(this.valueFormula.getValue(), user, 
            target);
        switch (this.kind)
        {
        case DamagesKind.Stat:
            user[RPM.datasGame.battleSystem.statistics[this.statisticID
                .getValue()].abbreviation] -= value;
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
    /** Check if the cost is possible
    *   @returns {boolean}
    */
    isPossible()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        let target = GamePlayer.getTemporaryPlayer();
        let value = RPM.evaluateFormula(this.valueFormula.getValue(), user, 
            target);
    
        switch (this.kind)
        {
        case DamagesKind.Stat:
            currentValue = user[RPM.datasGame.battleSystem.statistics[this
                .statisticID.getValue()].abbreviation];
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
    /** Get the string representing the cost
    *   @returns {string}
    */
    toString()
    {
        let user = RPM.currentMap.user ? (RPM.currentMap.isBattleMap ? RPM
            .currentMap.user.character : RPM.currentMap.user) : GamePlayer
            .getTemporaryPlayer();
        let target = GamePlayer.getTemporaryPlayer();
        let result = RPM.evaluateFormula(this.valueFormula.getValue(), user, 
            target) + RPM.STRING_SPACE;
        switch (this.kind)
        {
        case DamagesKind.Stat:
            result += RPM.datasGame.battleSystem.statistics[this.statisticID
                .getValue()].name;
            break;
        case DamagesKind.Currency:
            result += RPM.datasGame.system.currencies[this.currencyID.getValue()
                ].name;
            break;
        case DamagesKind.Variable:
            result += RPM.datasGame.variablesNames[this.variableID];
            break;
        }
        return result;
    }
}