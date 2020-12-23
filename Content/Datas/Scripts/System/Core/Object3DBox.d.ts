import { StructMapElementCollision } from "./MapElement";
import { System } from "..";
import { Position } from "./Position";
import { Object3D } from "./Object3D";
import { Vector3 } from "./Vector3";
/** @class
 *  A 3D object box in the map.
 *  @extends Object3D
 *  @param {Record<string, any>} json Json object describing the object 3D
 *  custom
 *  @param {System.Object3D} datas The System object 3D
 */
declare class Object3DBox extends Object3D {
    static VERTICES: Vector3[];
    static NB_VERTICES: number;
    static TEXTURES: number[][];
    static TEXTURES_VALUES: number[];
    static INDEXES: number[];
    id: number;
    datas: System.Object3D;
    constructor(json?: Record<string, any>, datas?: System.Object3D);
    /**
     *  Read the JSON associated to the object 3D box.
     *  @param {Record<string, any>} json Json object describing the object 3D
     *  box
    */
    read(json: Record<string, any>): void;
    /**
     *  Update the geometry of a group of object 3D with the same material.
     *  @param {THREE.Geometry} geometry Geometry of the object 3D
     *  @param {Position} position The position of object 3D
     *  @param {number} count The faces count
     *  @return {[number, StructMapElementCollision[]]}
    */
    updateGeometry(geometry: THREE.Geometry, position: Position, count: number): [number, StructMapElementCollision[]];
}
export { Object3DBox };
