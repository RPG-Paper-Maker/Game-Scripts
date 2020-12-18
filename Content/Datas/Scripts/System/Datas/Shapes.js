/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Enum } from "../Common";
import { System, Datas } from "..";
var CustomShapeKind = Enum.CustomShapeKind;
/** @class
 *  All the shapes datas.
 *  @property {System.Shape[]} list List of all the shapes of the game
 *  according to ID and ShapeKind.
 */
class Shapes {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to shapes.
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_SHAPES)).list;
        let l = json.length;
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
                    shape = new System.Shape(jsonShape, k);
                    if (k === CustomShapeKind.OBJ) {
                        await shape.load();
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
    /**
     *  Get the corresponding shape
     *  @param {CustomShapeKind} kind The shape kind
     *  @param {number} id The shape id
     *  @returns {System.Shape}
     */
    static get(kind, id) {
        return kind === CustomShapeKind.None ? new System.Shape() : Datas.Base
            .get(id, this.list[kind], "song " + System.Shape
            .customShapeKindToString(kind));
    }
}
export { Shapes };
