/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the videos datas
*   @property {SystemVideo[]} list List of all the videos of the game
*   according to ID
*/
class DatasVideos
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to videos
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_VIDEOS_DATAS)).list;
        this.list = RPM.readJSONSystemList(json, SystemVideo);
    }
}
