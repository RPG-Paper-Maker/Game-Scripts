import { Land } from "./Land.js";
import { TextureBundle } from "./TextureBundle.js";
import { Position } from "./Position.js";
import { StructMapElementCollision } from "./MapElement.js";
/** @class
 *  @extends Land
 *  An autotile in the map
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  autotile
 */
declare class Autotile extends Land {
    autotileID: number;
    tileID: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the autotile.
     *  @param {Record<string, any>} json Json object describing the autotile
     */
    read(json: Record<string, any>): void;
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
    updateGeometryAutotile(geometry: THREE.Geometry, texture: TextureBundle, position: Position, width: number, height: number, count: number): StructMapElementCollision;
}
export { Autotile };
