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
        .name + ": " + xp);
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
