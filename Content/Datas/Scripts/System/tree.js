/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   Datas structure of tree
*   @property {Node} root Node representing the root of the tree
*/
class Tree
{
    constructor(data)
    {
        this.root = new Node(null, data);
    }

    /** Add a new child
    *   @param {Object} data Data of the new child
    *   @returns {Node} The new child
    */
    add(data)
    {
        return this.root.add(data);
    }
}