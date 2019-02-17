/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GraphicTextIcon
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all currencies and play time in scene menu.
*/
function GraphicTextIcon(text, iconID, side, align) {
    // Default values
    if (typeof side === 'undefined') {
        side = Align.Left;
    }
    if (typeof align === 'undefined') {
        align = Align.Left;
    }
    this.side = side;
    this.align = align;

    this.textIcon = {};
    this.textIcon.icon = Picture2D.createImage($datasGame.pictures.getIcon(
        iconID), PictureKind.Icons);
    this.textIcon.text = new GraphicText(text, Align.Left);
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
        return Math.max(this.textIcon.text.fontSize, this.textIcon.icon.h);
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
        iconWidth = this.textIcon.icon.w;
        iconHeight = this.textIcon.icon.h;

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
            offset = w - iconWidth - this.textIcon.length;
            break;
        case Align.Center:
            offset = (w - iconWidth - this.textIcon.length) / 2;
            break;
        }

        // Draw according to side
        if (this.side === Align.left) {
            this.textIcon.icon.draw(x + offset, y - (iconHeight / 2));
            offset += iconWidth;
            this.textIcon.text.draw(x + offset, y, w, h);
        } else if (this.side === Align.Right) {
            this.textIcon.text.draw(x + offset, y, w, h);
            offset += this.textIcon.length;
            this.textIcon.icon.draw(x + offset, y - (iconHeight / 2));
        }
    }
}
