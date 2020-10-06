/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A key shortcut of the game
*   @property {number[][]} sc The shortcut values
*/
class SystemKeyBoard extends SystemLang
{
    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    /** Read the JSON associated to the key
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        super.read(json);

        this.id = json.id;
        this.sc = json.sc;
        let list;
        let i, j, l, m;
        for (i = 0, l = this.sc.length; i < l; i++) 
        {
            list = this.sc[i];
            for (j = 0, m = list.length; j < m; j++) 
            {
                list[j] = KeyEvent.qtToDOM(list[j]);
            }
        }
    }

    // -------------------------------------------------------

    toString()
    {
        let l = this.sc.length;
        let stringList = new Array(l);
        let j, m, originalSubList, subList;
        for (let i = 0; i < l; i++)
        {
            originalSubList = this.sc[i];
            m = originalSubList.length;
            subList = new Array(m);
            for (j = 0; j < ll; j++)
            {
                subList[j] = KeyEvent.getKeyString(originalSubList[j]);
            }
            stringList[i] = subList.join(" + ");
        }
        return stringList.join(" | ");
    }
}