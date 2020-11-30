/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the keyBoard datas
*   @property {SystemKeyBoard[]} list List of all the keys of the game by ID
*   @property {SystemKeyBoard[]} listOrdered List of all the keys of the game 
*   by index
*   @property {Object} menuControls All the menu controls assigns
*/
class DatasKeyBoard
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Test if a key id can be equal to a keyboard System object
    *   @static
    *   @param {number} key The key id that needs to be compared
    *   @param {SystemKeyBoard} abr The keyBoard to compare to the key
    *   @returns {boolean}
    */
    static isKeyEqual(key, abr)
    {
        let sc = abr.sc;
        let ll;
        for (let i = 0, l = sc.length; i < l; i++)
        {
            ll = sc[i].length;
            if (ll === 1)
            {
                if (sc[i][0] === key)
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
        return false;
    }

    // -------------------------------------------------------
    /** Read the JSON file associated to keyboard
    */
    async read()
    {
        let json = await RPM.parseFileJSON(RPM.FILE_KEYBOARD);

        // Shortcuts
        let jsonList = json.list;
        let l = jsonList.length;
        this.list = new Array(l+1);
        this.listOrdered = new Array(l);
        let jsonKey, id, abbreviation, key, sc;
        for (let i = 0; i < l; i++)
        {
            jsonKey = jsonList[i];
            id = jsonKey.id;
            abbreviation = jsonKey.abr;
            key = new SystemKeyBoard(jsonKey);
            sc = RPM.settings.kb[id];
            if (sc) {
                key.sc = sc;
            }
            this.list[id] = key;
            this.listOrdered[i] = key;
            this[abbreviation] = key;
        }

        // Menu controls
        this.menuControls = {};
        this.menuControls["Action"] = this.list[json["a"]];
        this.menuControls["Cancel"] = this.list[json["c"]];
        this.menuControls["Up"] = this.list[json["u"]];
        this.menuControls["Down"] = this.list[json["d"]];
        this.menuControls["Left"] = this.list[json["l"]];
        this.menuControls["Right"] = this.list[json["r"]];
    }

    // -------------------------------------------------------
    /** Get the graphics commands
    *   @returns {GraphicKeyboard[]}
    */
    getCommandsGraphics()
    {
        let l = this.listOrdered.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++)
        {
            list[i] = new GraphicKeyboard(this.listOrdered[i]);
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the actions commands
    *   @returns {function[]}
    */
    getCommandsActions()
    {
        let l = this.listOrdered.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++)
        {
            list[i] = SceneKeyboardAssign.prototype.updateKey;
        }
        return list;
    }
}