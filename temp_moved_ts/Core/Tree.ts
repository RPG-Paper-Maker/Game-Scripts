/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/


import {Node} from ".";

/** @class
 *   Datas structure of tree
 *   @property {Node} root Node representing the root of the tree
 *   @param {Object} data The data
 */
export class Tree {
    public root: Node;

    /**
     * The data of the visual tree
     * @param {Record<string, any>} data
     */
    constructor(data: Record<string, any>) {
        this.root = new Node(null, data);
    }

    /**
     * Add a new child
     * @param {Record<string, any>} data
     * @returns {Node}
     */
    public add(data: Record<string, any>) {
        return this.root.add(data);
    }
}