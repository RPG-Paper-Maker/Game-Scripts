/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { DynamicValue } from "./DynamicValue";
import { System } from "..";

/** @class
 *  A progression table.
 *  @property {number} id The ID
 *  @property {SystemValue} initialValue The initial value
 *  @property {SystemValue} finalValue The final value
 *  @property {number} equation The equation kind
 *  @property {Object} table The table progression
 *  @param {number} [id=undefined] The ID
 *  @param {Record<string, any>} [json=undefined] Json object describing the progression
 *  table
 */
class ProgressionTable extends Base {

    public id: number;
    public initialValue: DynamicValue;
    public finalValue: DynamicValue;
    public equation: number;
    public table: Record<string, any>;
    public start : number;
    public change: number;
    public duration: number;

    constructor(id?: number, json?: Record<string, any>) {
        super(json, id);
    }

    /** 
     *  Assign the default members.
     *  @param {number} id
     */
    public setup(id: number) {
        this.id = id;
    }

    /** 
     *  Create a new System progression table.
     *  @static
     *  @param {System.DynamicValue} i The initial value
     *  @param {System.DynamicValue} f The final value
     *  @param {number} equation The equation kind
     *  @returns {ProgressionTable}
     */
    static create(i: System.DynamicValue, f: System.DynamicValue, equation: 
        number): ProgressionTable
    {
        let progression = new ProgressionTable();
        progression.initialize(i, f, equation);
        return progression;
    }

    /** 
     *  Create a new System progression table from numbers values.
     *  @static
     *  @param {number} i The initial value
     *  @param {number} f The final value
     *  @param {number} equation The equation kind
     *  @returns {ProgressionTable}
     */
    static createFromNumbers(i: number, f: number, equation: number): 
        ProgressionTable
    {
        return this.create(DynamicValue.createNumber(i), DynamicValue
            .createNumber(f), equation);
    }

    /** 
     *  Read the JSON associated to the progression table.
     *  @param {Record<string, any>} json Json object describing the progression table
     */
    read(json: Record<string, any>) {
        this.initialValue = new DynamicValue(json.i);
        this.finalValue = new DynamicValue(json.f);
        this.equation = json.e;
        this.table = {};
        let jsonTable = json.t;
        if (jsonTable) {
            for (let i = 0, l = jsonTable.length; i < l; i++) {
                this.table[jsonTable[i].k] = jsonTable[i].v;
            }
        }
    }

    /** 
     *  Initialize this progression table.
     *  @param {System.DynamicValue} i The initial value
     *  @param {System.DynamicValue} f The final value
     *  @param {number} equation The equation kind
     */
    initialize(i: System.DynamicValue, f: System.DynamicValue, equation: number) {
        this.initialValue = i;
        this.finalValue = f;
        this.equation = equation;
        this.table = [];
    }

    /** 
     *  Get the progression at a current value.
     *  @param {number} current The current value
     *  @param {number} f The final value
     *  @param {boolean} [decimal=false] Indicate if the return should have
     *  decimal or not
     *  @returns {number}
     */
    getProgressionAt(current: number, f: number, decimal: boolean = false): 
        number
    {
        // Check if specific value
        let table = this.table[current];
        if (table) {
            return table;
        }

        // Update change and duration
        this.start = this.initialValue.getValue();
        this.change = this.finalValue.getValue() - this.initialValue.getValue();
        this.duration = f - 1;

        // Check according to equation
        let x = current - 1;
        let result: number;
        switch (this.equation) {
            case 0:
                result = this.easingLinear(x);
                break;
            case -1:
                result = this.easingQuadraticIn(x);
                break;
            case 1:
                result = this.easingQuadraticOut(x);
                break;
            case -2:
                result = this.easingCubicIn(x);
                break;
            case 2:
                result = this.easingCubicOut(x);
                break;
            case -3:
                result = this.easingQuarticIn(x);
                break;
            case 3:
                result = this.easingQuarticOut(x);
                break;
            case -4:
                result = this.easingQuinticIn(x);
                break;
            case 4:
                result = this.easingQuinticOut(x);
                break;
            default:
                result = 0;
                break;
        }
        if (!decimal) {
            result = Math.floor(result);
        }
        return result;
    }

    /** 
     *  The easing linear function
     *  @param {number} x
     *  @returns {number}
     */
    easingLinear(x: number): number {
        return this.change * x / this.duration + this.start;
    }

    /** 
     *  The easing quadratic in function.
     *   @param {number} x
     *   @returns {number}
     */
    easingQuadraticIn(x: number): number {
        x /= this.duration;
        return this.change * x * x + this.start;
    }

    /** 
     *  The easing quadratic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuadraticOut(x: number): number {
        x /= this.duration;
        return -this.change * x * (x - 2) + this.start;
    }

    /** 
     *  The easing cubic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingCubicIn(x: number): number {
        x /= this.duration;
        return this.change * x * x * x + this.start;
    }

    /** 
     *  The easing cubic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingCubicOut(x: number): number {
        x /= this.duration;
        x--;
        return this.change * (x * x * x + 1) + this.start;
    }

    /** 
     *  The easing quartic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuarticIn(x: number): number {
        x /= this.duration;
        return this.change * x * x * x * x + this.start;
    }

    /** 
     *  The easing quartic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuarticOut(x: number): number {
        x /= this.duration;
        x--;
        return -this.change * (x * x * x * x - 1) + this.start;
    }

    /** 
     *  The easing quintic in function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuinticIn(x: number): number {
        x /= this.duration;
        return this.change * x * x * x * x * x + this.start;
    }

    /** 
     *  The easing quintic out function.
     *  @param {number} x
     *  @returns {number}
     */
    easingQuinticOut(x: number): number {
        x /= this.duration;
        x--;
        return this.change * (x * x * x * x * x + 1) + this.start;
    }


}

export { ProgressionTable }