/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A battle map of the game
*/
class SystemBattleMap
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    static create(idMap, position)
    {
        this.idMap = idMap;
        this.position = position;
    }

    /** Read the JSON associated to the element
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        this.idMap = json.idm;
        this.position = json.p;
    }
}
