/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   @extends SceneSaveLoadGame
*   A scene in the menu for saving a game
*/
class SceneSaveGame extends SceneSaveLoadGame
{
    constructor()
    {
        super();
    }

    async load()
    {
        await super.load();

        this.setContents.call(this, new GraphicText("Save a game", { align: 
            Align.Center }), new GraphicText(
            "Select a slot where you want to save.", { align: Align.Center }));
        this.loading = false;
    }

    // -------------------------------------------------------

    onKeyPressed(key)
    {
        super.onKeyPressed(key);

        // If action, save in the selected slot
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            RPM.datasGame.system.soundConfirmation.playSound();
            RPM.game.write(this.windowChoicesSlots.currentSelectedIndex + 1);

            // Pop to return in the precedent state
            RPM.gameStack.pop();
        }
    }

    // -------------------------------------------------------

    draw3D()
    {
        RPM.currentMap.draw3D();
    }
}