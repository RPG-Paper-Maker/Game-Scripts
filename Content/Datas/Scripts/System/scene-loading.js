/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene for the loading
*   @extends SceneGame
*   @property {GraphicText} text The graphic text displaying loading
*/
class SceneLoading extends SceneGame
{
    constructor()
    {
        super(false);
        
        this.text = new GraphicText("Loading...", { align: Align.Right, x: 590, 
            y: 450, w: 40, h: 20 });
    }

    // -------------------------------------------------------
    /** Draw the HUD scene
    */
    drawHUD()
    {
        this.text.draw();
    }
}
