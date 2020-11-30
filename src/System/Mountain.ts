/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {Enum, RPM} from "../core";
import MountainCollisionKind = Enum.MountainCollisionKind;
import {SpecialElement} from ".";

/** @class
 *   A mountain of the game
 *   @extends SystemSpecialElement
 *   @property {number} id The ID
 *   @property {MountainCollisionKind} collisionKind The collision kind
 *   @param {Object} [json=undefined] Json object describing the mountain
 */
export class Mountain extends SpecialElement {

    id: number;
    collisionKind: number;

    constructor(json) {
        super(json);
    }

    public setup() {
        super.setup();
        this.id = 0;
        this.collisionKind = 0;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the mountain
     *   @param {Object} json Json object describing the mountain
     */
    read(json) {
        super.read(json);
        this.id = json.id;
        this.collisionKind = RPM.defaultValue(json.mck, MountainCollisionKind
            .Default);
    }

    // -------------------------------------------------------
    /** Check if the collision is always forced
     *   @returns {boolean}
     */
    forceAlways() {
        return this.collisionKind === MountainCollisionKind.Always;
    }

    // -------------------------------------------------------
    /** Check if the collision is never forced
     *   @returns {boolean}
     */
    forceNever() {
        return this.collisionKind === MountainCollisionKind.Never;
    }
}