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
//  CLASS GraphicXPProgression
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the progression for each character.
*/
function GraphicXPProgression() {
    var i, l, player;

    l = $game.teamHeroes.length
    this.graphicCharacters = new Array(l);
    for (i = 0; i < l; i++) {
        player = new GraphicPlayer($game.teamHeroes[i]);
        this.graphicCharacters[i] = player;
    }
}

GraphicXPProgression.prototype = {

    updateExperience: function() {
        for (var i = 0, l = $game.teamHeroes.length; i < l; i++) {
            this.graphicCharacters[i].updateExperience();
        }
    },

    /** Drawing the progression.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        for (var i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].draw(x, y + (i * 90), w, 85);
        }
    }
}
