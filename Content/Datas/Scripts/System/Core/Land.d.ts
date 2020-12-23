import { MapElement } from "./MapElement";
import { CollisionSquare } from "./CollisionSquare";
import { Position } from "./Position";
import { StructMapElementCollision } from "./MapElement";
/** @class
 *  A land in the map.
 *  @extends MapElement
 */
declare class Land extends MapElement {
    up: boolean;
    texture: number[];
    constructor();
    /**
     *  Read the JSON associated to the land
     *  @param {Record<string, any>} json Json object describing the land
     */
    read(json: Record<string, any>): void;
    /**
     *  Return the rect index.
     *  @param {number} width
     *  @returns {number}
     */
    getIndex(width: number): number;
    /**
     *  Update the geometry associated to this land and return the collision
     *  result.
     *  @param {THREE.Geometry} geometry The geometry asoociated to the
     *  autotiles
     *  @param {CollisionSquare} collision The collision square
     *  @param {Position} position The position
     *  @param {number} width The texture total width
     *  @param {number} height The texture total height
     *  @param {number} x The x texture position
     *  @param {number} y The y texture position
     *  @param {number} w The w texture size
     *  @param {number} h The h texture size
     *  @param {number} count The faces count
     *  @returns {StructCollision}
     */
    updateGeometryLand(geometry: THREE.Geometry, collision: CollisionSquare, position: Position, width: number, height: number, x: number, y: number, w: number, h: number, count: number): StructMapElementCollision;
}
export { Land };
