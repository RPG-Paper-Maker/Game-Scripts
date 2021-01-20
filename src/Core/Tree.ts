/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Node } from "./Node";

/** @class
 *  Datas structure of tree.
 *  @param {any} data - The data
 */
class Tree {
    public root: Node;

    /**
     * The data of the visual tree.
     * @param {any} data
     */
    constructor(data: any) {
        this.root = new Node(null, data);
    }

    /**
     * Add a new child.
     * @param {Record<string, any>} - data
     * @returns {Node}
     */
    public add(data: Record<string, any>): Node {
        return this.root.add(data);
    }
}

export { Tree }