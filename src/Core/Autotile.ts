/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum } from "../Common";
import PictureKind = Enum.PictureKind;
import { Land } from "./Land";
import { TextureBundle } from "./TextureBundle";
import { Position } from "./Position";
import { StructMapElementCollision } from "./MapElement"
import { Datas } from "..";

/** @class
 *  @extends Land
 *  An autotile in the map
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  autotile
 */
class Autotile extends Land {

    public autotileID: number;
    public tileID: number;

    constructor(json?: Record<string, any>) {
        super();
        if (json) {
            this.read(json);
        }
    }

    /** 
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} json Json object describing the autotile
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.autotileID = json.id;
        this.tileID = json.tid;
    }

    /** 
     *  Update the geometry associated to this autotile and return the
     *  collision result.
     *  @param {THREE.Geometry} geometry The geometry asoociated to the
     *  autotiles
     *  @param {TextureBundle} texure The several texture used for this
     *  geometry
     *  @param {Position} position The json position
     *  @param {number} width The texture total width
     *  @param {number} height The texture total height
     *  @param {number} count The faces count
     *  @returns {StructMapElementCollision}
     */
    updateGeometryAutotile(geometry: THREE.Geometry, texture: 
        TextureBundle, position: Position, width: number, height: number, count: 
        number): StructMapElementCollision
    {
        let autotile = Datas.SpecialElements.getAutotile(this.autotileID);
        let picture = autotile ? Datas.Pictures.get(PictureKind.Autotiles, 
            autotile.pictureID) : null;
        return super.updateGeometryLand(geometry, picture ? picture
            .getCollisionAtIndex(Land.prototype.getIndex.call(this, picture
            .width)) : null, position, width, height, ((this.tileID % 64) * 
            Datas.Systems.SQUARE_SIZE) / width, ((Math.floor(this.tileID / 64) +
            (10 * texture.getOffset(this.autotileID, this.texture))) * Datas
            .Systems.SQUARE_SIZE) / height, Datas.Systems.SQUARE_SIZE / width, 
            Datas.Systems.SQUARE_SIZE / height, count);
    }
}

export { Autotile }