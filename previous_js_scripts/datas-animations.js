/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the animations datas
*   @property {SystemAnimation[]} list List of all the animations of the game
*   according to ID
*/
class DatasAnimations
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to troops.
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_ANIMATIONS)).animations;
        this.list = RPM.readJSONSystemList(json, SystemAnimation);
    }
}