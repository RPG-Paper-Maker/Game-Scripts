/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
*   @property {SystemWall[]} walls List of all the walls of the game
*   according to ID.
*   @property {SystemAutotile[]} autotiles List of all the autotiles of the game
*    according to ID.
*/
function DatasSpecialElements(){
    this.read();
}

DatasSpecialElements.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SPECIAL_ELEMENTS, true, function(res){
            var json, jsonAutotiles, jsonAutotile, jsonWalls, jsonWall,
                jsonObjects, jsonObject;
            var autotile, wall, object;
            var i, l, id;

            json = JSON.parse(res);

            // Autotiles
            jsonAutotiles = json.autotiles;
            l = jsonAutotiles.length;
            this.autotiles = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonAutotile = jsonAutotiles[i];
                id = jsonAutotile.id;
                autotile = new SystemAutotile();
                autotile.readJSON(jsonAutotile);
                this.autotiles[id] = autotile;
            }

            // Walls
            jsonWalls = json.walls;
            l = jsonWalls.length;
            this.walls = new Array(l+1);
            for (i = 0; i < l; i++){
                jsonWall = jsonWalls[i];
                id = jsonWall.id;
                wall = new SystemWall();
                wall.readJSON(jsonWall);
                this.walls[id] = wall;
            }

            // Objects 3D
            jsonObjects = json.o;
            l = jsonObjects.length;
            this.objects = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonObject = jsonObjects[i];
                id = jsonObject.id;
                object = new SystemObject3D();
                object.readJSON(jsonObject);
                this.objects[id] = object;
            }
        });
    }
}
