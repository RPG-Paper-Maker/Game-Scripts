/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene for the title screen settings
*   @extends SceneGame
*   @property {Picture2D} pictureBackground The title screen background picture
*   @property {WindowBox} windowSettings The window box for displaying settings
*   @property {WindoBox} windowInformations The window box for displaying 
*   informations
*   @property {WindowChoices} windowChoicesMain The main window choices
*/
class SceneTitleSettings extends SceneGame
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
        // Creating background
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage)
        {
            this.pictureBackground = await Picture2D.createWithID(RPM.datasGame
                .titlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen);
            this.pictureBackground.cover = true;
        }

        // Creating windows
        this.windowSettings = new WindowBox(RPM.HUGE_SPACE, RPM.HUGE_SPACE, RPM
            .MEDIUM_SLOT_WIDTH, RPM.LARGE_SLOT_HEIGHT,
            {
                content: new GraphicText("SETTINGS", { align: Align.Center }),
                padding: RPM.SMALL_SLOT_PADDING
            }
        );
        this.windowInformations = new WindowBox(RPM.HUGE_SPACE + RPM
            .MEDIUM_SLOT_WIDTH + RPM.LARGE_SPACE, RPM.HUGE_SPACE, RPM.SCREEN_X -
            (2 * RPM.HUGE_SPACE) - RPM.MEDIUM_SLOT_WIDTH - RPM.LARGE_SPACE, RPM
            .LARGE_SLOT_HEIGHT,
            {
                padding: RPM.SMALL_SLOT_PADDING
            }
        );
        this.windowChoicesMain = new WindowChoices(RPM.HUGE_SPACE, RPM
            .HUGE_SPACE + RPM.LARGE_SLOT_HEIGHT + RPM.LARGE_SPACE, RPM.SCREEN_X 
            - (2 * RPM.HUGE_SPACE), RPM.MEDIUM_SLOT_HEIGHT, RPM.datasGame
            .titlescreenGameover.getSettingsCommandsContent(), 
            {
                nbItemsMax: 9,
                listCallbacks: RPM.datasGame.titlescreenGameover
                    .getSettingsCommandsActions(),
                bordersInsideVisible: false
            }
        );
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
        this.loading = false;
    }

    // -------------------------------------------------------
    /** Handle scene key pressed
    *   @param {number} key The key ID
    */
    onKeyPressed(key)
    {
        this.windowChoicesMain.onKeyPressed(key);
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Cancel) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .MainMenu))
        {
            RPM.datasGame.system.soundCancel.playSound();
            RPM.gameStack.pop();
        }
    }

    // -------------------------------------------------------
    /** Handle scene pressed and repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedAndRepeat(key)
    {
        this.windowChoicesMain.onKeyPressedAndRepeat(key);
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
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
        this.windowSettings.draw();
        this.windowInformations.draw();
        this.windowChoicesMain.draw();
    }
}