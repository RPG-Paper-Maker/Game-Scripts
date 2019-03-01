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
//  CLASS GraphicRewardsTop
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all experience + currencies
*/
function GraphicRewardsTop(xp, currencies) {
    var id, currency;

    // Experience
    this.graphicXP = new GraphicText($datasGame.battleSystem.getExpStatistic()
        .name + ": " + xp, Align.Left);
    $context.font = this.graphicXP.font;
    this.graphicXP.updateContextFont();
    this.graphicXPLength = $context.measureText(this.graphicXP.text).width;

    // Currencies
    this.currencies = [];
    for (id in currencies) {
        this.currencies.push(new GraphicTextIcon("" + currencies[id], $datasGame
            .system.currencies[id].pictureID, Align.Left, Align.Left));
    }
}

GraphicRewardsTop.prototype = {

    checkIcons: function() {
        var i, l;

        for (i = 0, l = this.currencies.length; i < l; i++) {
            this.currencies[i].checkIcon();
        }
    },

    // -------------------------------------------------------

    /** Drawing the progression.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        var i, l, offsetWidth, completeWidth, currency;

        // Calculating offset for centering
        offsetWidth = this.graphicXPLength + 10;
        for (i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            offsetWidth += currency.getWidth() + (i < l - 1 ? 10 : 0);
        }
        offsetWidth = ((w - offsetWidth) / 2);

        // Experience
        this.graphicXP.draw(x + offsetWidth, y, w, h);
        offsetWidth += this.graphicXPLength + 10;

        // Currencies
        for (i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            currency.draw(x + offsetWidth, y, w, h);
            offsetWidth += currency.getWidth() + 10;
        }
    }
}
