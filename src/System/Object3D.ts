/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { SpecialElement } from "./SpecialElement";
import { Enum, Utils } from "../Common";
import ShapeKind = Enum.ShapeKind;
import ObjectCollisionKind = Enum.ObjectCollisionKind;
import CustomShapeKind = Enum.CustomShapeKind;
import { Datas, System } from "../index";
import { Vector3 } from "../Core";

/** @class
 *  A 3D object of the game.
 *  @extends System.SpecialElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  object 3D
 */
class Object3D extends SpecialElement {

    public id: number;
    public shapeKind: ShapeKind;
    public objID: number;
    public mtlID: number;
    public collisionKind: ObjectCollisionKind;
    public collisionCustomID: number;
    public scale: number;
    public widthSquare: number;
    public widthPixel: number;
    public heightSquare: number;
    public heightPixel: number;
    public depthSquare: number;
    public depthPixel: number;
    public stretch: boolean;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the object 3D.
     *  @param {Record<string, any>} - json Json object describing the object 3D
     */
    read(json: Record<string, any>) {
        super.read(json);

        this.id = json.id;
        this.shapeKind = Utils.defaultValue(json.sk, ShapeKind.Box);
        this.objID = Utils.defaultValue(json.oid, -1);
        this.mtlID = Utils.defaultValue(json.mid, -1);
        this.collisionKind = Utils.defaultValue(json.ck, ObjectCollisionKind
            .None);
        this.collisionCustomID = Utils.defaultValue(json.ccid, -1);
        this.scale = Utils.defaultValue(json.s, 1);
        this.widthSquare = Utils.defaultValue(json.ws, 1);
        this.widthPixel = Utils.defaultValue(json.wp, 0);
        this.heightSquare = Utils.defaultValue(json.hs, 1);
        this.heightPixel = Utils.defaultValue(json.hp, 0);
        this.depthSquare = Utils.defaultValue(json.ds, 1);
        this.depthPixel = Utils.defaultValue(json.dp, 0);
        this.stretch = Utils.defaultValue(json.st, false);
    }

    /** 
     *  Get the width in pixels.
     *  @returns {number}
     */
    widthPixels(): number {
        return (this.widthSquare * Datas.Systems.SQUARE_SIZE) + (this.widthPixel
            * Datas.Systems.SQUARE_SIZE / 100);
    }

    /**
     *  Get the height in pixels.
     *  @returns {number}
     */
    heightPixels(): number {
        return (this.heightSquare * Datas.Systems.SQUARE_SIZE) + (this
            .heightPixel * Datas.Systems.SQUARE_SIZE / 100);
    }

    /** 
     *  Get the depth in pixels.
     *  @returns {number}
     */
    depthPixels(): number {
        return (this.depthSquare * Datas.Systems.SQUARE_SIZE) + (this.depthPixel
            * Datas.Systems.SQUARE_SIZE / 100);
    }

    /** 
     *  Get the width in squares.
     *  @returns {number}
     */
    width(): number {
        return this.widthSquare + (this.widthPixel > 0 ? 1 : 0);
    }

    /**
     *  Get the height in squares.
     *  @returns {number}
     */
    height(): number {
        return this.heightSquare + (this.heightPixel > 0 ? 1 : 0);
    }

    /** 
     *  Get the depth in squares.
     *  @returns {number}
     */
    depth(): number {
        return this.depthSquare + (this.depthPixel > 0 ? 1 : 0);
    }
    
    /** 
     *  Get the size vector.
     *  @returns {Vector3}
     */
    getSizeVector(): Vector3 {
        return new Vector3(this.widthPixels(), this.heightPixels(), this
            .depthPixels());
    }

    /** 
     *  Get the shape obj.
     *  @returns {System.Shape}
     */
    getObj(): System.Shape {
        return Datas.Shapes.get(CustomShapeKind.OBJ, this.objID);
    }

    /** 
     *  Get the collision shape obj.
     *  @returns {System.Shape}
     */
    getCollisionObj(): System.Shape {
        return Datas.Shapes.get(CustomShapeKind.Collisions, this.collisionCustomID);
    }
}

export { Object3D }