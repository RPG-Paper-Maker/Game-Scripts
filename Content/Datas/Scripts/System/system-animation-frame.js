/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An animation frame
*/
class SystemAnimationFrame
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------

    read(json)
    {
        this.elements = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.e, 
            []), SystemAnimationFrameElement);
        this.effects = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.ef, 
            []), SystemAnimationFrameEffect);
    }

    // -------------------------------------------------------

    playSounds(condition)
    {
        for (let i = 0, l = this.effects.length; i < l; i++)
        {
            this.effects[i].playSE(condition);
        }
    }

    // -------------------------------------------------------

    draw = function(picture, position, rows, cols) {
        for (let i = 0, l = this.elements.length; i < l; i++)
        {
            this.elements[i].draw(picture, position, rows, cols);
        }
    }
}
