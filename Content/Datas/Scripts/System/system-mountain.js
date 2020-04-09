/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemMountain
//
// -------------------------------------------------------

/** @class
*   A mountain of the game.
*   @property {number} picutreID The picture ID of the mountain.
*/
function SystemMountain() {

}

SystemMountain.prototype = {

    /** Read the JSON associated to the mountain.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        SystemSpecialElement.prototype.readJSON.call(this, json);

        this.id = json.id;
        this.collisionKind = typeof json.mck === 'undefined' ?
            MountainCollisionKind.Default : json.mck;
    },

    // -------------------------------------------------------

    forceAlways: function() {
        return this.collisionKind === MountainCollisionKind.Always;
    },

    // -------------------------------------------------------

    forceNever: function() {
        return this.collisionKind === MountainCollisionKind.Never;
    }
}
