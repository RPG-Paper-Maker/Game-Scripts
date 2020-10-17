/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A class for all keyboard assign to display in screen
*   @property {SystemKeyBoard} kb The system keyboard
*   @property {GraphicText} graphicTextName The graphic text for name
*   @property {GraphicText} graphicTextShort The graphic text for short
*   @property {GraphicText} graphicTextInformation The graphic text for 
*   information
*/
class GraphicKeyboard
{
    constructor(kb)
    {
        this.kb = kb;
        this.graphicTextName = new GraphicText(kb.name());
        this.graphicTextShort = new GraphicText(kb.toString(), { align: Align
            .Center });
        this.graphicTextInformation = new GraphicText("Press any keys...", { 
            align: Align.Center });
    }

    // -------------------------------------------------------
    /** Update short sc
    *   @param {number[]} sh The short list 
    */
    updateShort(sh)
    {
        this.kb.sc = sh;
        this.graphicTextShort.setText(this.kb.toString());
    }

    // -------------------------------------------------------
    /** Drawing the keyboard in choice box
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice (x, y, w, h)
    {
        this.graphicTextName.draw(x, y, w, h);
        this.graphicTextShort.draw(x + (w / 2), y, w / 2, h);
    }

    // -------------------------------------------------------
    /** Drawing the keyboard description
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        this.graphicTextInformation.draw(x, y, w, (h / 2));
        this.graphicTextShort.draw(x, y + (h / 2), w, (h / 2));
    }
}