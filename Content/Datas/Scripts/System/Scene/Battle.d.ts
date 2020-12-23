import { Map } from "./Map";
/** @class
*   A scene for the loading
*   @extends SceneGame
*   @property {GraphicText} text The graphic text displaying loading
*/
declare class Battle extends Map {
    static escaped: boolean;
    user: any;
    constructor(id: number, isBattleMap: boolean);
}
export { Battle };
