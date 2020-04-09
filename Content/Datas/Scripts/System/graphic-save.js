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
//  CLASS GraphicSave
//
// -------------------------------------------------------

/** @class
*/
function GraphicSave(game) {
    var player;

    this.game = game;
    this.graphicSlot = new GraphicText("Slot " + game.currentSlot, { align:
        Align.Center });

    if (game.isNull) {
        this.graphicEmpty = new GraphicText("Empty", { align: Align.Center });
    } else {
        this.graphicTimer = new GraphicText(RPM.getStringDate(game.playTime),
            { align: Align.Right });
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
