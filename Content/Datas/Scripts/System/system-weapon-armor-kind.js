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
//  CLASS SystemWeaponArmorKind
//
// -------------------------------------------------------

/** @class
*   A weapon/armor kind of the game.
*   @property {string} name The name of the weapon / armor kind.
*   @property {boolean[]} equipments List of booleans indicating which equipment
*   is ok.
*/
function SystemWeaponArmorKind(){

}

SystemWeaponArmorKind.prototype = {

    /** Read the JSON associated to the weapon / armor kind.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.name = json.names[1];
        this.equipments = json.equipment;
        this.equipments.unshift(false);
    }
}
