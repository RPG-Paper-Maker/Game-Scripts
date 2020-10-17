/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying a save
*   @property {Game} game The game save
*   @property {GraphicText} graphicSlot The graphic text slot
*   @property {GraphicText} graphicEmpty The graphic text empty
*   @property {GraphicText} graphicTimer The graphic text timer
*   @property {GraphicPlayer[]} graphicCharacters The graphic players list for 
*   characters
*/
class GraphicSave
{
    constructor(game)
    {
        this.game = game;
        this.graphicSlot = new GraphicText("Slot " + this.game.currentSlot, { 
            align: Align.Center });
        if (this.game.isNull)
        {
            this.graphicEmpty = new GraphicText("Empty", { align: Align.Center });
        } else
        {
            this.graphicTimer = new GraphicText(RPM.getStringDate(this.game
                .playTime.getSeconds()), { align: Align.Right });
            let l = this.game.teamHeroes.length;
            this.graphicCharacters = new Array(l);
            let player;
            for (let i = 0; i < l; i++)
            {
                player = new GraphicPlayer(this.game.teamHeroes[i]);
                player.initializeCharacter();
                this.graphicCharacters[i] = player;
            }
        }
    }

    // -------------------------------------------------------
    /** Update the battler graphics
    */
    update()
    {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++)
        {
            this.graphicCharacters[i].updateBattler();
        }
    }

    // -------------------------------------------------------
    /** Drawing the save slot
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h)
    {
        this.graphicSlot.draw(x, y, w, h);
    }

    // -------------------------------------------------------
    /** Drawing the save informations
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        if (this.game.isNull)
        {
            this.graphicEmpty.draw(x, y, w, h);
        } else
        {
            this.graphicTimer.draw(x, y, w, 20);
            for (let i = 0, l = this.graphicCharacters.length; i < l; i++)
            {
                this.graphicCharacters[i].drawCharacter(x + 5 + (i * 115),
                    y + 20, w, h);
            }
        }
    }
}