/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Land } from "./Land";
import { Manager, Datas } from "..";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/** @class
 *  A floor in the map.
 *  @extends Land
 *  @param {Record<string, any>} [json=undefined] Json object describing the floor
 */
class Floor extends Land {
    constructor(json) {
        super();
        if (json) {
            this.read(json);
        }
    }
    /**
     *  Read the JSON associated to the floor.
     *  @param {Record<string, any>} json Json object describing the floor
     */
    read(json) {
        super.read(json);
    }
    /**
     *  Update the geometry associated to this floor and return the
     *  collision result.
     *  @param {THREE.Geometry} geometry The geometry asoociated to the
     *  autotiles
     *  @param {Position} position The position
     *  @param {number} width The texture total width
     *  @param {number} height The texture total height
     *  @param {number} count The faces count
     *  @returns {StructMapElementCollision}
     */
    updateGeometry(geometry, position, width, height, count) {
        return (width === 0 || height === 0) ? null : super.updateGeometryLand(geometry, Manager.Stack.currentMap.mapProperties.tileset.picture
            .getCollisionAt(this.texture), position, width, height, (this
            .texture[0] * Datas.Systems.SQUARE_SIZE) / width, (this.texture[1] *
            Datas.Systems.SQUARE_SIZE) / height, (this.texture[2] * Datas
            .Systems.SQUARE_SIZE) / width, (this.texture[3] * Datas.Systems
            .SQUARE_SIZE) / height, count);
    }
}
export { Floor };
