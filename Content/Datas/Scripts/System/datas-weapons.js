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
//  CLASS WeaponsDatas
//
// -------------------------------------------------------

/** @class
*   All the weapons datas.
*   @property {SystemWeapon[]} list List of all the weapons of the game
*   according to ID.
*/
function DatasWeapons(){
    this.read();
}

DatasWeapons.prototype = {

    /** Read the JSON file associated to weapons.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_WEAPONS, true, function(res){
            var json = JSON.parse(res).weapons;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the weapons according to the ID
            for (var i = 0; i < l; i++){
                var jsonWeapon = json[i];
                var id = jsonWeapon["id"];
                var weapon = new SystemWeapon();
                weapon.readJSON(jsonWeapon);
                this.list[id] = weapon;
            }
        });
    }
}
