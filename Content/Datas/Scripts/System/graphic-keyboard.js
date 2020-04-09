/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS GraphicKeybaord
//
// -------------------------------------------------------

/** @class
*   A class for all keyboard assign to display in screen.
*/
function GraphicKeyboard(kb) {
    this.kb = kb;
    this.graphicTextName = new GraphicText(kb.name);
    this.graphicTextShort = new GraphicText(kb.toString(), { align: Align.Center });
    this.graphicTextInformation = new GraphicText("Press any keys...", { align:
        Align.Center });
}

// -------------------------------------------------------

GraphicKeyboard.prototype.updateShort = function(sh) {
    this.kb.sc = sh;
    this.graphicTextShort.setText(this.kb.toString());
}

// -------------------------------------------------------

GraphicKeyboard.prototype.draw = function(x, y, w, h) {
    this.graphicTextName.draw(x, y, w, h);
    this.graphicTextShort.draw(x + (w / 2), y, w / 2, h);
};

// -------------------------------------------------------

GraphicKeyboard.prototype.drawInformations = function(x, y, w, h) {
    this.graphicTextInformation.draw(x, y, w, (h / 2));
    this.graphicTextShort.draw(x, y + (h / 2), w, (h / 2));
}
