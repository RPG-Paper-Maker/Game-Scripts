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
*/
class SceneLoading extends SceneGame
{
    constructor()
    {
        super();
        
        this.text = new GraphicText("Loading...", { align: Align.Right, x: 590, 
            y: 450, w: 40, h: 20 });
    }

    drawHUD()
    {
        this.text.draw();
    }
}
