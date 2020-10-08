/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A loot of the game
*/
class SystemLoot
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    /** Read the JSON associated to the loot
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        this.kind = json.k;
        this.lootID = new SystemValue(json.lid);
        this.number = new SystemValue(json.n);
        this.probability = new SystemValue(json.p);
        this.initial = new SystemValue(json.i);
        this.final = new SystemValue(json.f);
    }

    // -------------------------------------------------------

    isAvailable(level)
    {
        return level >= this.initial.getValue() && level <= this.final.getValue();
    }

    // -------------------------------------------------------

    currenLoot(level)
    {
        if (!this.isAvailable(level))
        {
            return null;
        }

        // Calculate number with proba
        let proba = this.probability.getValue();
        let totalNumber = this.number.getValue();
        let i, rand, number;
        for (i = 0, number = 0; i < totalNumber; i++)
        {
            rand = RPM.random(0, 100);
            if (rand <= proba)
            {
                number++;
            }
        }
        return number > 0 ? new GameItem(this.kind, this.lootID.getValue(),
            number) : null;
    }
}