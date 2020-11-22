/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the shapes datas
 *   @property {SystemShape[]} list List of all the shapes of the game
 *   according to ID and ShapeKind
 */
class DatasShapes {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to shapes
     */
    async read() {
        let json = (await RPM.parseFileJSON(RPM.FILE_SHAPES_DATAS)).list;
        let l = RPM.countFields(CustomShapeKind) - 1;
        this.list = new Array(l);
        let j, m, n, jsonHash, k, jsonList, jsonShape, id, list, shape;
        for (let i = 0; i < l; i++) {
            jsonHash = json[i];
            k = jsonHash.k;
            jsonList = jsonHash.v;

            // Get the max ID
            m = jsonList.length;
            n = 0;
            for (j = 0; j < m; j++) {
                jsonShape = jsonList[j];
                id = jsonShape.id;
                if (id > n) {
                    n = id;
                }
            }

            // Fill the shapes list
            list = new Array(n + 1);
            for (j = 0; j < n + 1; j++) {
                jsonShape = jsonList[j];
                if (jsonShape) {
                    id = jsonShape.id;
                    shape = new SystemShape(jsonShape, k);
                    if (k === CustomShapeKind.OBJ) {
                        await shape.loadObjectCustom();
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
    }

    // -------------------------------------------------------
    /** Get the corresponding shape
     *   @param {CustomShapeKind} kind The shape kind
     *   @param {number} id The shape id
     *   @returns {SystemShape}
     */
    get(kind, id) {
        return this.list[kind][id];
    }
}