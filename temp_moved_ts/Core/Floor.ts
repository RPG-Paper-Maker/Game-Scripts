/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A floor in the map
 *   @extends Land
 *   @param {Object} [json=undefined] Json object describing the floor
 */

import {Land} from ".";

export class Floor extends Land {
    constructor(json?) {
        super();

        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the floor
     *   @param {Object} json Json object describing the floor
     */
    read(json) {
        super.read(json);
    }

    // -------------------------------------------------------
    /** Update the geometry associated to this floor and return the
     *   collision result
     *   @param {THREE.Geometry} geometry The geometry asoociated to the
     *   autotiles
     *   @param {number[]} position The json position
     *   @param {number} width The texture total width
     *   @param {number} height The texture total height
     *   @param {number} count The faces count
     *   @returns {Object}
     */
    updateGeometry(geometry, position, width, height, count) {
        return (width === 0 || height === 0) ? null : super.updateGeometry(
            geometry, RPM.currentMap.mapProperties.tileset.picture
                .getCollisionAt(this.texture), position, width, height, (this
            .texture[0] * RPM.SQUARE_SIZE) / width, (this.texture[1] * RPM
            .SQUARE_SIZE) / height, (this.texture[2] * RPM.SQUARE_SIZE) / width,
            (this.texture[3] * RPM.SQUARE_SIZE) / height, count);
    }
}