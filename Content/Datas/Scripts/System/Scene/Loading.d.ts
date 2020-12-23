import { Scene, Graphic } from "..";
/** @class
*   A scene for the loading.
*   @extends SceneGame
*/
declare class Loading extends Scene.Base {
    static readonly MIN_DELAY: number;
    text: Graphic.Text;
    constructor();
    /** Draw the HUD scene
    */
    drawHUD(): void;
}
export { Loading };
