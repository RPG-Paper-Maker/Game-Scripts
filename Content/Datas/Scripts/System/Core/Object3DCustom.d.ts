import { StructMapElementCollision } from "./MapElement.js";
import { System } from "../index.js";
import { Position } from "./Position.js";
import { Object3D } from "./Object3D.js";
/** @class
 *  A 3D object custom in the map.
 *  @extends Object3D
 *  @param {Record<string, any>} json Json object describing the object 3D custom
 *  @param {System.Object3D} datas The System object 3D
 */
declare class Object3DCustom extends Object3D {
    id: number;
    datas: System.Object3D;
    constructor(json?: Record<string, any>, datas?: System.Object3D);
    /**
     *  Read the JSON associated to the object 3D custom.
     *  @param {Record<string, any>} json Json object describing the object 3D
     *  custom
     */
    read(json: Record<string, any>): void;
    /**
     *  Update the geometry of a group of objects 3D cutom with the same
     *  material.
     *  @param {THREE.Geometry} geometry Geometry of the object 3D custom
     *  @param {Position} position The position of the object 3D custom
     *  @param {number} count The faces count
     *  @return {any[]}
    */
    updateGeometry(geometry: THREE.Geometry, position: Position, count: number): [number, StructMapElementCollision[]];
}
export { Object3DCustom };
