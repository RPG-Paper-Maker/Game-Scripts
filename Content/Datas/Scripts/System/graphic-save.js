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
//  CLASS GraphicSave
//
// -------------------------------------------------------

/** @class
*/
function GraphicSave(game) {
    var player;

    this.game = game;
    this.graphicSlot = new GraphicText("Slot " + game.currentSlot);

    if (game.isNull) {
        this.graphicEmpty = new GraphicText("Empty");
    } else {
        this.graphicTimer = new GraphicText(RPM.getStringDate(game.playTime),
            Align.Right);
        this.graphicCharacters = new Array;
        for (var i = 0, l = game.teamHeroes.length; i < l; i++) {
            player = new GraphicPlayer(game.teamHeroes[i]);
            player.initializeCharacter();
            this.graphicCharacters.push(player);
        }
    }
}

GraphicSave.prototype = {

    update: function() {
        for (var i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateBattler();
        }
    },

    /**
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        this.graphicSlot.draw(x, y, w, h);
    },

    /** Drawing the save informations.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        if (this.game.isNull) {
            this.graphicEmpty.draw(x, y, w, h);
        } else {
            this.graphicTimer.draw(x, y, w, 20);
            for (var i = 0, l = this.graphicCharacters.length; i < l; i++) {
                this.graphicCharacters[i].drawCharacter(x + 5 + (i * 115),
                    y + 20, w, h);
            }
        }
    }
}
