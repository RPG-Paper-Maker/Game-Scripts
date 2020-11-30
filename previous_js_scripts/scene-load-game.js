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
*   A scene in the menu for loading a game
*   @property {Picture2D} pictureBackground The title screen background picture
*/
class SceneLoadGame extends SceneSaveLoadGame
{
    constructor()
    {
        super();
    }

    // -------------------------------------------------------
    /** Load async stuff
    */
    async load()
    {
        await super.load();

        this.setContents(new GraphicText("Load a game", { align: Align.Center })
            , new GraphicText("Select a slot you want to load.", { align: Align
            .Center }));
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage)
        {
            this.pictureBackground = await Picture2D.createWithID(RPM.datasGame
                .titlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen);
            this.pictureBackground.cover = true;
        }
        this.loading = false;
    }

    // -------------------------------------------------------
    /** Handle scene key pressed
    *   @param {number} key The key ID
    */
    onKeyPressed(key)
    {
        super.onKeyPressed(key);

        // If action, load the selected slot
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Action))
        {
            RPM.game = this.windowChoicesSlots.getCurrentContent().game;
            if (RPM.game.isNull)
            {
                RPM.game = null;
                RPM.datasGame.system.soundImpossible.playSound();
            } else
            {
                RPM.datasGame.system.soundConfirmation.playSound();

                // Initialize properties for hero
                RPM.game.hero.initializeProperties();

                // Stop video if existing
                if (!RPM.datasGame.titlescreenGameover.isTitleBackgroundVideo)
                {
                    Platform.canvasVideos.classList.add("hidden");
                    Platform.canvasVideos.pause();
                    Platform.canvasVideos.src = RPM.STRING_EMPTY;
                }

                // Pop load and title screen from the stack
                RPM.gameStack.pop();
                RPM.gameStack.replace(new SceneMap(RPM.game.currentMapID));
            }
        }
    }

    // -------------------------------------------------------
    /** Draw the HUD scene
    */
    drawHUD()
    {
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage)
        {
            this.pictureBackground.draw();
        }
        super.drawHUD();
    }
}