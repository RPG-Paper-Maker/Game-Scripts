/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
