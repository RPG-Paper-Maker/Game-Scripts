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
//  CLASS DatasShapes
//
// -------------------------------------------------------

/** @class
*   All the shapes datas.
*   @property {Object[]} list List of all the shapes of the game
*   according to ID and ShapeKind.
*/
function DatasShapes() {
    this.read();
}

DatasShapes.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function() {
        RPM.openFile(this, RPM.FILE_SHAPES_DATAS, true, function(res) {
            var json, jsonHash, jsonList, jsonShape, shape;
            var i, k, j, l, ll, lll, id;
            var list;

            json = JSON.parse(res).list;
            l = RPM.countFields(CustomShapeKind) - 1;
            this.list = new Array(l);
            for (i = 0; i < l; i++) {
                jsonHash = json[i];
                k = jsonHash.k;
                jsonList = jsonHash.v;

                // Get the max ID
                ll = jsonList.length;
                lll = 0;
                for (j = 0; j < ll; j++){
                    jsonShape = jsonList[j];
                    id = jsonShape.id;
                    if (id > lll) {
                        lll = id;
                    }
                }

                // Fill the shapes list
                list = new Array(lll + 1);
                for (j = 0; j < lll + 1; j++) {
                    jsonShape = jsonList[j];
                    if (jsonShape)
                    {
                        id = jsonShape.id;
                        shape = new SystemShape();
                        shape.readJSON(jsonShape);
                        if (k === CustomShapeKind.OBJ) {
                            shape.loadObjectCustom();
                        }

                        if (id !== 0) {
                            if (id === -1) {
                                id = 0;
                            }
                            list[id] = shape;
                        }
                    }
                }

                this.list[k] = list;
            }
        });
    },

    /** Get the corresponding shape.
    */
    get: function(kind, id){
        return this.list[kind][id];
    },
}
