import { System } from "../index.js";
/** @class
 *  All the special elements datas.
 *  @static
 */
declare class SpecialElements {
    static autotiles: System.Autotile[];
    static walls: System.SpecialElement[];
    static mountains: System.Mountain[];
    static objects: System.Object3D[];
    constructor();
    /**
     *  Read the JSON file associated to special elements.
     */
    static read(): Promise<void>;
    /**
     *  Get the autotile by ID.
     *  @param {number} id
     *  @returns {System.Autotile}
     */
    static getAutotile(id: number): System.Autotile;
    /**
     *  Get the wall by ID.
     *  @param {number} id
     *  @returns {System.SpecialElement}
     */
    static getWall(id: number): System.SpecialElement;
    /**
     *  Get the mountain by ID.
     *  @param {number} id
     *  @returns {System.Mountain}
     */
    static getMountain(id: number): System.Mountain;
    /**
     *  Get the object 3D by ID.
     *  @param {number} id
     *  @returns {System.Object3D}
     */
    static getObject3D(id: number): System.Object3D;
}
export { SpecialElements };
