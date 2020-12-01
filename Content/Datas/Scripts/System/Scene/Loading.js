/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import * as Scene from "./index.js";
import * as Graphic from "../Graphic/index.js";
import { Enum } from "../Common/index.js";
var Align = Enum.Align;
/** @class
*   A scene for the loading
*   @extends SceneGame
*   @property {GraphicText} text The graphic text displaying loading
*/
export class Loading extends Scene.Base {
    constructor() {
        super(false);
        this.text = new Graphic.Text("Loading...", { align: Align.Right, x: 590,
            y: 450, w: 40, h: 20 });
    }
    /** Draw the HUD scene
    */
    drawHUD() {
        this.text.draw();
    }
}
Loading.MIN_DELAY = 100;
