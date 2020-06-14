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
//  CLASS GraphicText : Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for all the texts to display in screen.
*   @extends Bitmap
*   @property {string} text The brut text to display.
*   @property {Align} align Alignement of the text.
*   @property {string} font The font used for the text.
*   @property {number} fontSize The font height used for the text.
*   @param {string} text The brut text to display.
*   @param {Align} [align=Align.Center] - Alignement of the text.
*   @param {number} [fontSize=RPM.fontSize] - The font height used for the text.
*   @param {string} [fontName=RPM.fontName] - The font name used for the text.
*   @param {number} x The x coords of the text.
*   @param {number} y The y coords of the text.
*   @param {number} w The w coords of the text.
*   @param {number} h The h coords of the text.
*/
function GraphicText(text, opt) {
    opt = RPM.defaultValue(opt, {});

    Bitmap.call(this, opt.x, opt.y, opt.w, opt.h);

    this.align = RPM.defaultValue(opt.align, Align.Left);
    this.fontSize = RPM.defaultValue(opt.fontSize, RPM.defaultValue(RPM.datasGame
        .system.dbOptions.vtSize, RPM.fontSize));
    this.fontName = RPM.defaultValue(opt.fontName, RPM.defaultValue(RPM.datasGame
        .system.dbOptions.vtFont, RPM.fontName));
    this.verticalAlign = RPM.defaultValue(opt.verticalAlign, Align.Center);
    this.color = RPM.defaultValue(opt.color, RPM.defaultValue(RPM.datasGame.system
        .dbOptions.vtcText, RPM.COLOR_WHITE));
    this.bold = RPM.defaultValue(opt.bold, false);
    this.italic = RPM.defaultValue(opt.italic, false);
    this.backColor = RPM.defaultValue(opt.backColor, RPM.defaultValue(RPM.datasGame
        .system.dbOptions.vtcBackground, null));
    this.strokeColor = RPM.defaultValue(opt.strokeColor, RPM.defaultValue(
        RPM.datasGame.system.dbOptions.tOutline, false)? RPM.defaultValue(
        RPM.datasGame.system.dbOptions.vtcOutline, null) : null);
    this.updateFontSize(this.fontSize);
    this.setText(RPM.defaultValue(text, ""));
}

GraphicText.prototype = {

    setX: function(x){
        Bitmap.prototype.setX.call(this, x);
    },

    // -------------------------------------------------------

    setY: function(y){
        Bitmap.prototype.setY.call(this, y);
    },

    // -------------------------------------------------------

    setW: function(w){
        Bitmap.prototype.setW.call(this, w);
    },

    // -------------------------------------------------------

    setH: function(h){
        Bitmap.prototype.setH.call(this, h);
    },

    // -------------------------------------------------------

    setCoords: function(x, y, w, h){
        Bitmap.prototype.setCoords.call(this, x, y, w, h);
    },

    // -------------------------------------------------------

    setText: function(text) {
        if (this.text !== text) {
            this.text = text;
            this.measureText();
            RPM.requestPaintHUD = true;
        }
    },

    /** Update the context font (without window resizing). This function is
    *   used before a context.measureText.
    */
    updateContextFontReal: function(){
        Platform.ctx.font = this.font;
    },

    updateContextFont: function(){
        Platform.ctx.font = this.fontWithoutResize;
    },

    measureText: function() {
        var w;

        this.updateContextFont();
        w = Platform.ctx.measureText(this.text);
        this.textWidth = w.width;
        this.textHeight = RPM.getScreenMinXY(this.fontSize);

        return w.width;
    },

    // -------------------------------------------------------

    updateFontSize: function(fontSize) {
        this.fontSize = fontSize;
        this.fontWithoutResize = RPM.createFont(fontSize, this.fontName, this
            .bold, this.italic);
        fontSize = RPM.getScreenMinXY(fontSize);
        this.font = RPM.createFont(fontSize, this.fontName, this.bold, this
            .italic);
    },

    // -------------------------------------------------------

    updateFont: function() {
        this.updateFontSize(this.fontSize);
    },

    // -------------------------------------------------------

    /** Drawing the text in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        var lineHeight, lines, xBack;
        var i, l, yOffset, textWidth, textHeight, color;

        // Default values
        if (typeof x === 'undefined') x = this.oX;
        if (typeof y === 'undefined') y = this.oY;
        if (typeof w === 'undefined') w = this.oW;
        if (typeof h === 'undefined') h = this.oH;

        x = RPM.getScreenX(x);
        y = RPM.getScreenY(y);
        w = RPM.getScreenX(w);
        h = RPM.getScreenY(h);

        // Correcting x and y according to alignment
        xBack = x;
        textWidth = RPM.getScreenX(this.textWidth);
        textHeight = RPM.getScreenY(this.textHeight);
        switch(this.align) {
        case Align.Left:
            break;
        case Align.Right:
            x += w;
            xBack = x - textWidth;
            break;
        case Align.Center:
            x += (w / 2);
            xBack = x - (textWidth / 2);
            break;
        }
        y += RPM.getScreenY(this.fontSize) / 3;
        switch(this.verticalAlign) {
        case Align.Right:
            y += h; break;
        case Align.Center:
            y += (h / 2); break;
        }

        // Draw background color
        if (this.backColor !== null) {
            Platform.ctx.fillStyle = this.backColor.rgb;
            Platform.ctx.fillRect(xBack, y - textHeight, textWidth, textHeight);
        }

        // Set context options
        Platform.ctx.font = this.font;
        Platform.ctx.textAlign = this.align;
        lineHeight = this.fontSize * 2;
        lines = this.text.split("\n");
        l = lines.length;

        // Stroke text
        if (this.strokeColor !== null) {
            Platform.ctx.strokeStyle = this.strokeColor.rgb;
            yOffset = 0;
            for (i = 0; i < l; ++i) {
                Platform.ctx.strokeText(lines[i], x - 1, y - 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x - 1, y  + 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x + 1, y - 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x + 1, y + 1 + yOffset);
                yOffset += lineHeight;
            }
        }

        // Drawing the text
        Platform.ctx.fillStyle = this.color.rgb;
        yOffset = 0;
        for (i = 0; i < l; ++i) {
            Platform.ctx.fillText(lines[i], x, y + yOffset);
            yOffset += lineHeight;
        }
    },

    // -------------------------------------------------------

    /** Drawing the text in choice box.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h){
        this.draw(x, y, w, h);
    }
}
