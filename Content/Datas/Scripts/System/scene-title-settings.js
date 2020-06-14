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
//  CLASS SceneTitleSettings : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the title screen settings.
*   @extends SceneGame
*/
function SceneTitleSettings() {
    SceneGame.call(this);

    // Creating background
    if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
        this.pictureBackground = Picture2D.createImageWithID(RPM.datasGame
            .titlescreenGameover.titleBackgroundImageID, PictureKind.TitleScreen);
        this.pictureBackground.cover = true;
    }

    // Creating windows
    this.windowSettings = new WindowBox(RPM.HUGE_SPACE, RPM.HUGE_SPACE, RPM
        .MEDIUM_SLOT_WIDTH, RPM.LARGE_SLOT_HEIGHT, new GraphicText("SETTINGS", {
        align: Align.Center }), RPM.SMALL_SLOT_PADDING);
    this.windowInformations = new WindowBox(RPM.HUGE_SPACE + RPM
        .MEDIUM_SLOT_WIDTH + RPM.LARGE_SPACE, RPM.HUGE_SPACE, RPM.SCREEN_X - (2 *
        RPM.HUGE_SPACE) - RPM.MEDIUM_SLOT_WIDTH - RPM.LARGE_SPACE, RPM
        .LARGE_SLOT_HEIGHT, null, RPM.SMALL_SLOT_PADDING);
    this.windowChoicesMain = new WindowChoices(OrientationWindow.Vertical, RPM
        .HUGE_SPACE, RPM.HUGE_SPACE + RPM.LARGE_SLOT_HEIGHT + RPM.LARGE_SPACE,
        RPM.SCREEN_X - (2 * RPM.HUGE_SPACE), RPM.MEDIUM_SLOT_HEIGHT, 9, RPM.datasGame
        .titlescreenGameover.getSettingsCommandsContent(), RPM.datasGame
        .titlescreenGameover.getSettingsCommandsActions(), RPM
        .SMALL_SLOT_PADDING, 0, 0, false);

    this.windowInformations.content = this.windowChoicesMain.getCurrentContent();
}

SceneTitleSettings.prototype = {

    update: function() {

    },

    // -------------------------------------------------------

    onKeyPressed: function(key) {
        this.windowChoicesMain.onKeyPressed(key);

        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Cancel) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .MainMenu))
        {
            RPM.datasGame.system.soundCancel.playSound();
            RPM.gameStack.pop();
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        this.windowChoicesMain.onKeyPressedAndRepeat(key);
        this.windowInformations.content = this.windowChoicesMain
            .getCurrentContent();
    },

    // -------------------------------------------------------

    draw3D: function(canvas) {

    },

    // -------------------------------------------------------

    drawHUD: function() {
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowSettings.draw();
        this.windowInformations.draw();
        this.windowChoicesMain.draw();
    }
}
