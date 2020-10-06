/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A common class for skills, items, weapons, armors
*   @extends SystemIcon
*   @property {boolean} [hasType=true] Indicate if the common has a type
*   @property {boolean} [hasTargetKind=true] Indicate if the common has a 
*   target kind
*   @param {Object} [json=undefined] Json object describing the common
*/
class SystemCommonSkillItem extends SystemIcon
{
    constructor(json)
    {
        super();
        this.hasType = true;
        this.hasTargetKind = true;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the common
    *   @param {Object} json Json object describing the common
    */
    read(json)
    {
        super.read(json);

        this.type = RPM.defaultValue(json.t, 1);
        this.consumable = RPM.defaultValue(json.con, false);
        this.oneHand = RPM.defaultValue(json.oh, true);
        this.description = new SystemLang(RPM.defaultValue(json.d, SystemLang
            .EMPTY_NAMES));
        this.targetKind = RPM.defaultValue(json.tk, TargetKind.None);
        this.targetConditionFormula = SystemValue.readOrNone(json.tcf);
        this.conditionFormula = SystemValue.readOrNone(json.cf);
        this.availableKind = RPM.defaultValue(json.ak, AvailableKind.Never);
        this.sound = new SystemPlaySong(SongKind.sound, json.s);
        this.animationUserID = SystemValue.readOrNone(json.auid);
        this.animationTargetID = SystemValue.readOrNone(json.atid);
        this.price = SystemValue.readOrDefaultNumber(json.p);
        let costs = RPM.defaultValue(json.cos, []);
        this.costs = RPM.readJSONSystemListByIndex(costs, SystemCost);
        let effects = RPM.defaultValue(json.e, []);
        this.effects = RPM.readJSONSystemListByIndex(effects, SystemEffect);
        let characteristics = RPM.defaultValue(json.car, []);
        this.characteristics = RPM.readJSONSystemListByIndex(characteristics, 
            SystemCharacteristic);
    }
    
    // -------------------------------------------------------
    /** Use the command if possible
    *   @returns {boolean}
    */
    useCommand()
    {
        let possible = this.isPossible();
        if (possible)
        {
            this.use();
        }
        return possible;
    }
    
    // -------------------------------------------------------
    /** Execute the effects and costs
    *   @returns {boolean}
    */
    use()
    {
        letisDoingSomething = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++)
        {
            isDoingSomething = isDoingSomething || this.effects[i].execute();
        }
        if (isDoingSomething)
        {
            for (i = 0, l = this.costs.length; i < l; i++)
            {
                this.costs[i].use();
            }
        }
        return isDoingSomething;
    }
    
    // -------------------------------------------------------
    /** Use the costs
    */
    cost()
    {
        for (let i = 0, l = this.costs.length; i < l; i++)
        {
            this.costs[i].use();
        }
    }
    
    // -------------------------------------------------------
    /** Use the costs
    *   @returns {boolean}
    */
    isPossible()
    {
        for (let i = 0, l = this.costs.length; i < l; i++)
        {
            if (!this.costs[i].isPossible())
            {
                return false;
            }
        }
        return true;
    }
    
    // -------------------------------------------------------
    /** Get the target kind string
    *   @returns {string}
    */
    getTargetKindString()
    {
        switch (this.targetKind)
        {
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
        return RPM.STRING_EMPTY;
    }    
}