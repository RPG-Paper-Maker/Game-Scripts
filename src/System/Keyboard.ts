/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Translatable } from "./Translatable";
import { KeyEvent } from "../Common";

/** @class
 *  A key shortcut of the game.
 *  @extends {System.Translatable}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  keyboard
 */
class Keyboard extends Translatable {

    public id: number;
    public sc: number[][];

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the keyboard.
     *  @param {Record<string, any>} - json Json object describing the keyboard
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.id = json.id;
        this.sc = json.sc;
        let list: number[];
        let i: number, j: number, l: number, m: number;
        for (i = 0, l = this.sc.length; i < l; i++) {
            list = this.sc[i];
            for (j = 0, m = list.length; j < m; j++) {
                list[j] = KeyEvent.qtToDOM(list[j]);
            }
        }
    }

    /** 
     *  Get the string representation of the keyboard.
     *  @returns {string}
     */
    toString(): string {
        let l = this.sc.length;
        let stringList = new Array(l);
        let j: number, m: number, originalSubList: number[], subList: string[];
        for (let i = 0; i < l; i++) {
            originalSubList = this.sc[i];
            m = originalSubList.length;
            subList = new Array(m);
            for (j = 0; j < m; j++) {
                subList[j] = KeyEvent.getKeyString(originalSubList[j]);
            }
            stringList[i] = subList.join(" + ");
        }
        return stringList.join(" | ");
    }
}

export { Keyboard }