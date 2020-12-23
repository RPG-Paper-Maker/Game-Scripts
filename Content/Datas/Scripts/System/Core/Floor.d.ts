import { Land } from "./Land.js";
import { Position } from "./Position.js";
import { StructMapElementCollision } from "./MapElement.js";
/** @class
 *  A floor in the map.
 *  @extends Land
 *  @param {Record<string, any>} [json=undefined] Json object describing the floor
 */
declare class Floor extends Land {
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the floor.
     *  @param {Record<string, any>} json Json object describing the floor
     */
    read(json: Record<string, any>): void;
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
    updateGeometry(geometry: THREE.Geometry, position: Position, width: number, height: number, count: number): StructMapElementCollision;
}
export { Floor };
