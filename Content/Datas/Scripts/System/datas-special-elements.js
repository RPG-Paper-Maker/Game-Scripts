/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the special elements datas
*   @property {SystemSpecialElement[]} autotiles List of all the autotiles of 
*   the game according to ID
*   @property {SystemSpecialElement[]} walls List of all the walls of the game
*   according to ID
*   @property {SystemMountain[]} mountains List of all the mountains of 
*   the game according to ID
*   @property {SystemObject3D[]} objects List of all the objects of the 
*   game according to ID
*/
class DatasSpecialElements
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to special elements
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_SPECIAL_ELEMENTS));
        this.autotiles = RPM.readJSONSystemList(json.autotiles, 
            SystemSpecialElement);
        this.walls = RPM.readJSONSystemList(json.walls, SystemSpecialElement);
        this.mountains = RPM.readJSONSystemList(json.m, SystemMountain);
        this.objects = RPM.readJSONSystemList(json.o, SystemObject3D);
    }
}