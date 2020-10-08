/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all the progression for each character
*/
class GraphicXPProgression
{
    constructor()
    {

    }

    async load()
    {
        let l = RPM.game.teamHeroes.length
        this.graphicCharacters = new Array(l);
        for (let i = 0; i < l; i++)
        {
            this.graphicCharacters[i] = await GraphicPlayer.create(RPM.game
                .teamHeroes[i]);
        }
    }

    static async create()
    {
        let graphic = new GraphicXPProgression();
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

    updateExperience()
    {
        for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
        {
            this.graphicCharacters[i].updateExperience();
        }
    }

    /** Drawing the progression
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++)
        {
            this.graphicCharacters[i].drawChoice(x, y + (i * 90), w, 85);
        }
    }
}