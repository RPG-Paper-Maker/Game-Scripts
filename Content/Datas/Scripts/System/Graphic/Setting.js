/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
/** @class
*   A class for all settings to display in screen
*    @property {GraphicText} graphicRight The graphic text on the right
*    @property {GraphicText} graphicTextLeft The graphic text on the left
*    @property {GraphicText} graphicTextInformation The graphic text information
*/
class Setting extends Base {
    constructor(id) {
        super();
        /*
        let textLeft,textInformation;
        switch (id)
        {
        case TitleSettingKind.KeyboardAssigment:
            textLeft = "Keyboard assignement";
            textInformation = "Update keyboard assignement preferences.";
            this.graphicRight = new GraphicText("...", { align: Align.Center });
            break;
        }
        this.graphicTextLeft = new GraphicText(textLeft);
        this.graphicTextInformation = new GraphicText(textInformation, { align:
            Align.Center });
            */
    }
    // -------------------------------------------------------
    /** Drawing the choice
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        /*
        this.graphicTextLeft.draw(x, y, w, h);
        this.graphicRight.draw(x + (w / 2), y, w / 2, h);
        */
    }
    // -------------------------------------------------------
    /** Drawing the settings informations
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h) {
        //this.graphicTextInformation.draw(x, y, w, h);
    }
    // -------------------------------------------------------
    /** Drawing the settings informations
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        this.drawChoice(x, y, w, h);
    }
}
export { Setting };
