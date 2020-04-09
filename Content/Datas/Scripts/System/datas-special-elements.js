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
//  CLASS DatasSpecialElements
//
// -------------------------------------------------------

/** @class
*   All the special elements datas.
*   @property {SystemSpecialElement[]} walls List of all the walls of the game
*   according to ID.
*   @property {SystemSpecialElement[]} autotiles List of all the autotiles of the game
*    according to ID.
*/
function DatasSpecialElements() {
    this.read();
}

DatasSpecialElements.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SPECIAL_ELEMENTS, true, function(res){
            var json, jsonSpecials, jsonSpecial;
            var autotile, wall, mountain, object;
            var i, l, id;

            json = JSON.parse(res);

            // Autotiles
            jsonSpecials = json.autotiles;
            l = jsonSpecials.length;
            this.autotiles = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonSpecial = jsonSpecials[i];
                id = jsonSpecial.id;
                autotile = new SystemSpecialElement();
                autotile.readJSON(jsonSpecial);
                this.autotiles[id] = autotile;
            }

            // Walls
            jsonSpecials = json.walls;
            l = jsonSpecials.length;
            this.walls = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonSpecial = jsonSpecials[i];
                id = jsonSpecial.id;
                wall = new SystemSpecialElement();
                wall.readJSON(jsonSpecial);
                this.walls[id] = wall;
            }

            // Mountains
            jsonSpecials = json.m;
            l = jsonSpecials.length;
            this.mountains = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonSpecial = jsonSpecials[i];
                id = jsonSpecial.id;
                object = new SystemMountain();
                object.readJSON(jsonSpecial);
                this.mountains[id] = object;
            }

            // Objects 3D
            jsonSpecials = json.o;
            l = jsonSpecials.length;
            this.objects = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonSpecial = jsonSpecials[i];
                id = jsonSpecial.id;
                object = new SystemObject3D();
                object.readJSON(jsonSpecial);
                this.objects[id] = object;
            }
        });
    }
}
