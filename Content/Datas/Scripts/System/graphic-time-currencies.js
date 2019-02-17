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
//  CLASS GraphicTimeCurrencies
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all currencies and play time in scene menu.
*/
function GraphicTimeCurrencies() {
    var currency, id;

    this.height = 0;

    // Currencies
    this.currencies = [];
    for (id in $game.currencies) {
        this.currencies.push(new GraphicTextIcon("" + $game.currencies[id], id,
            Align.Right, Align.Right));
    }

    // Time
    this.time = $game.playTime;
    this.graphicPlayTime = new GraphicText(RPM.getStringDate(this.time),
        Align.Right);
}

GraphicTimeCurrencies.prototype = {

    isLoaded: function() {
        var i, l, currency, result;

        result = true;
        for (i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            if (!currency.isIconLoaded()) {
                currency.checkIcon();
                result = false;
            }
        }

        if (result) {
            this.calculateHeight();
        }

        return result;
    },

    // -------------------------------------------------------

    calculateHeight: function() {
        var i, l, currency;

        for (i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            this.height = i * (Math.max(currency.textIcon.text.fontSize,
                currency.textIcon.icon.h) + 5);
        }
        this.height += 20 + this.graphicPlayTime.fontSize;
    },

    // -------------------------------------------------------

    update: function() {
        if ($game.playTime !== this.time) {
            this.graphicPlayTime.setText(RPM.getStringDate($game.playTime));
        }
    },

    /** Drawing the content.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        var i, l, currency, previousCurrency;

        previousCurrency = null;
        for (i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            this.offset = i * (previousCurrency ? previousCurrency.getMaxHeight()
                + 5 : 0);
            currency.draw(x, y + this.offset, w, 0);
            previousCurrency = currency;
        }
        this.offset += currency.getMaxHeight() + 20;
        this.graphicPlayTime.draw(x, y + this.offset, w, 0);
        this.offset += this.graphicPlayTime.fontSize;
    }
}
