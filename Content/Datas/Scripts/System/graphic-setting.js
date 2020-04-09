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
//  CLASS GraphicSetting
//
// -------------------------------------------------------

/** @class
*   A class for all settings to display in screen.
*/
function GraphicSetting(id) {
    var textLeft, textInformation;

    // Left text
    this.id = id;
    switch (id) {
    case TitleSettingKind.KeyboardAssigment:
        textLeft = "Keyboard assignement";
        textInformation = "Update keyboard assignement preferences.";
        this.graphicRight = new GraphicText("...", { align: Align.Center });
        break;
    }

    this.graphicTextLeft = new GraphicText(textLeft);
    this.graphicTextInformation = new GraphicText(textInformation, { align:
        Align.Center });
}

// -------------------------------------------------------

GraphicSetting.prototype.draw = function(x, y, w, h) {
    this.graphicTextLeft.draw(x, y, w, h);
    this.graphicRight.draw(x + (w / 2), y, w / 2, h);
};

// -------------------------------------------------------

GraphicSetting.prototype.drawInformations = function(x, y, w, h) {
    this.graphicTextInformation.draw(x, y, w, h);
}
