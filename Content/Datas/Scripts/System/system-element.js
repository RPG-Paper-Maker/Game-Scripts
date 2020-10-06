/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An element of the game
*   @property {string} name The name of the element
*/
class SystemElement extends SystemIcon
{
    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    read(json)
    {
        super.read(json);
    
        this.efficiency = RPM.readJSONSystemListHash(json.e, SystemValue);
    }    
}