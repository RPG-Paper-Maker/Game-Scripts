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
*   @property {number} idMap The map ID
*   @property {number[]} position The json position
*   @param {Object} [json=undefined] Json object describing the battle map
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

    // -------------------------------------------------------
    /** Create a system battle map
    *   @static 
    *   @param {number} idMap The map ID
    *   @param {number[]} position The json position
    */
    static create(idMap, position)
    {
        this.idMap = idMap;
        this.position = position;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the battle map
    *   @param {Object} json Json object describing the battle map
    */
    read(json)
    {
        this.idMap = json.idm;
        this.position = json.p;
    }
}
