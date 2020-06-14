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
//  CLASS GraphicXPProgression
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the progression for each character.
*/
function GraphicXPProgression() {
    var i, l, player;

    l = RPM.game.teamHeroes.length
    this.graphicCharacters = new Array(l);
    for (i = 0; i < l; i++) {
        player = new GraphicPlayer(RPM.game.teamHeroes[i]);
        this.graphicCharacters[i] = player;
    }
}

GraphicXPProgression.prototype = {

    updateExperience: function() {
        for (var i = 0, l = RPM.game.teamHeroes.length; i < l; i++) {
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
