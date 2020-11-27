/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/


/** @class
*   All the heroes datas
*   @property {Hero[]} list List of all the heroes of the game according
*   to ID
*/
class DatasHeroes
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to heroes
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_HEROES)).heroes;
        this.list = RPM.readJSONSystemList(json, Hero);
    }
}