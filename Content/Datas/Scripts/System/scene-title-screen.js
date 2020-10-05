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
//  CLASS SceneTitleScreen : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the title screen.
*   @extends SceneGame
*   @property {WindowChoices} windowChoicesCommands A window choices for
*   choosing a command.
*/
function SceneTitleScreen() {
    var commandsNb;

    SceneGame.call(this);

    RPM.songsManager.stopAll();

    // Destroy pictures
    RPM.displayedPictures = [];

    // Creating background
    if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
        this.pictureBackground = Picture2D.createWithID(RPM.datasGame
            .titlescreenGameover.titleBackgroundImageID, PictureKind.TitleScreen);
        this.pictureBackground.cover = true;
    } else {
        Platform.canvasVideos.classList.remove('hidden');
        Platform.canvasVideos.src = RPM.datasGame.videos.list[RPM.datasGame
            .titlescreenGameover.titleBackgroundVideoID].getPath()[1];
        Platform.canvasVideos.play();
    }

    // Windows
    commandsNb = RPM.datasGame.titlescreenGameover.titleCommands.length;
    this.windowChoicesCommands = new WindowChoices(RPM.SCREEN_X / 2 - (
        RPM.MEDIUM_SLOT_WIDTH / 2), RPM.SCREEN_Y - RPM.HUGE_SPACE - (commandsNb 
        * RPM.MEDIUM_SLOT_HEIGHT), RPM.MEDIUM_SLOT_WIDTH, RPM.MEDIUM_SLOT_HEIGHT
        , RPM.datasGame.titlescreenGameover.getCommandsNames(),
        {
            nbItemsMax: commandsNb,
            listCallbacks: RPM.datasGame.titlescreenGameover.getCommandsActions(),
            padding: [0, 0, 0, 0]
        }
    );

    // Play title screen song
    RPM.datasGame.titlescreenGameover.titleMusic.playSong();
}

SceneTitleScreen.prototype = {

    update: function() {

    },

    // -------------------------------------------------------

    onKeyPressed: function(key) {
        this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands
            .getCurrentContent().datas);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas) {

    },

    // -------------------------------------------------------

    drawHUD: function() {
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }

        this.windowChoicesCommands.draw();
    },

    close: function()
    {

    }
}
