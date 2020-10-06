/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class DatasDLCs
{
    constructor()
    {

    }

    /** Read the JSON file associated to dlcs
    */
    async read()
    {
        let json = await RPM.parseFileJSON(RPM.FILE_DLCS);
        RPM.PATH_DLCS = RPM.PATH_FILES + json.p;
    }
}
