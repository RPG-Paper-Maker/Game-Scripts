import { Player, MapObject } from "../Core/index.js";
/** @class
 *  @static
 *  The interpreter to evaluate formulas or simple scripts without having to
 *  import.
 */
declare class Interpreter {
    private static common;
    private static core;
    private static datas;
    private static eventCommand;
    private static graphic;
    private static manager;
    private static scene;
    private static system;
    private static three;
    private static howl;
    constructor();
    /**
     *  Evaluate a formula.
     */
    static evaluate(formula: string, { user, target, damage, thisObject, addReturn }?: {
        user?: Player;
        target?: Player;
        damage?: number;
        thisObject?: MapObject;
        addReturn?: boolean;
    }): any;
}
export { Interpreter };
