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
//  CLASS GraphicTextIcon
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all currencies and play time in scene menu.
*/
function GraphicTextIcon(text, iconID, side, align, space) {
    // Default values
    if (typeof side === 'undefined') {
        side = Align.Left;
    }
    if (typeof align === 'undefined') {
        align = Align.Left;
    }
    if (typeof space === 'undefined') {
        space = RPM.MEDIUM_SPACE;
    }
    this.side = side;
    this.align = align;
    this.space = space;

    this.textIcon = {};
    this.textIcon.icon = Picture2D.createImage($datasGame.pictures.getIcon(
        iconID), PictureKind.Icons);
    this.textIcon.text = new GraphicText(text);
    $context.font = this.textIcon.text.font;
    this.textIcon.text.updateContextFont();
    this.textIcon.length = $context.measureText(this.textIcon.text.text).width;
}

GraphicTextIcon.prototype = {

    isIconLoaded: function() {
        return this.textIcon.icon.w;
    },

    // -------------------------------------------------------

    checkIcon: function() {
        this.textIcon.icon.check();
    },

    // -------------------------------------------------------

    getMaxHeight: function() {
        return Math.max(this.textIcon.text.fontSize, this.textIcon.icon.oH);
    },

    // -------------------------------------------------------

    getWidth: function() {
        return this.textIcon.icon.oW + this.space + this.textIcon.length;
    },

    // -------------------------------------------------------

    /** Drawing the content.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        var iconWidth, iconHeight, offset, heightMax;
        iconWidth = this.textIcon.icon.oW;
        iconHeight = this.textIcon.icon.oH;

        // If icon not loaded, pass
        if (!iconWidth) {
            this.textIcon.icon.check();
            return;
        }

        // Align offset
        switch (this.align) {
        case Align.Left:
            offset = 0;
            break;
        case Align.Right:
            offset = w - this.getWidth();
            break;
        case Align.Center:
            offset = (w - this.getWidth()) / 2;
            break;
        }

        // Draw according to side
        if (this.side === Align.Left) {
            this.textIcon.icon.draw(x + offset, y - (iconHeight / 2) + (h / 2));
            offset += iconWidth + this.space;
            this.textIcon.text.draw(x + offset, y, w, h);
        } else if (this.side === Align.Right) {
            this.textIcon.text.draw(x + offset, y, w, h);
            offset += this.textIcon.length + this.space;
            this.textIcon.icon.draw(x + offset, y - (iconHeight / 2) + (h / 2));
        }
    }
}
