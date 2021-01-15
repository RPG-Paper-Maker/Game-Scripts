/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject } from "../Core";

interface StructIterator {
    i: number
}

/** @class
 *  An abstract event command.
 */
abstract class Base {

    public isDirectNode: boolean;
    public parallel: boolean;

    constructor() {
        this.isDirectNode = true;
        this.parallel = false;
    }

    /** 
     * Initialize the current state.
     * @returns {Object} The current state
     */
    initialize(): Object {
        return null;
    }

    /** 
     * Update and check if the event is finished.
     * @param {Record<string, any>} - currentState The current state of the event
     * @param {MapObject} object - The current object reacting
     * @param {number} state - The state ID
     * @returns {number} The number of node to pass
     */
    update(currentState?: Record<string, any>, object?: MapObject, state?: 
        number): number
    {
        return 1;
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Object, key: number) {

    }

    /** 
     *  First key release handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
    */
    onKeyReleased(currentState: Object, key: number) {

    }

    /** 
     *  Key pressed repeat handle for the current stack.
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedRepeat(currentState: Object, key: number): boolean {
        return true;
    }

    /** 
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Object} currentState - The current state of the event
     *  @param {number} key - The key ID pressed
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(currentState: Object, key: number): boolean {
        return true;
    }

    /** 
     *  Draw the HUD.
     *  @param {Object} currentState - The current state of the event
     */
    drawHUD(currentState?: Object) {

    }
}

export { StructIterator, Base }
