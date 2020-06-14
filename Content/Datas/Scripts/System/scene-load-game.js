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
//  CLASS SceneLoadGame : SceneSaveLoadGame
//
// -------------------------------------------------------

/** @class
*   @extends SceneSaveLoadGame
*   A scene in the menu for loading a game.
*/
function SceneLoadGame() {
    SceneSaveLoadGame.call(this);

    SceneSaveLoadGame.prototype.setContents.call(this, new GraphicText(
        "Load a game", { align: Align.Center }), new GraphicText(
        "Select a slot you want to load.", { align: Align.Center }));
    if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
        this.pictureBackground = Picture2D.createImageWithID(RPM.datasGame
            .titlescreenGameover.titleBackgroundImageID, PictureKind.TitleScreen);
        this.pictureBackground.cover = true;
    }
}

SceneLoadGame.prototype = {

    update: function(){
        SceneSaveLoadGame.prototype.update.call(this);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        SceneSaveLoadGame.prototype.onKeyPressed.call(this, key);

        // If action, load the selected slot
        if (DatasKeyBoard.isKeyEqual(key,
                                     RPM.datasGame.keyBoard.menuControls.Action))
        {
            RPM.game = this.windowChoicesSlots.getCurrentContent().game;
            if (!RPM.game.isNull) {
                RPM.datasGame.system.soundConfirmation.playSound();

                // Initialize properties for hero
                RPM.game.hero.initializeProperties();

                // Stop video if existing
                if (!RPM.datasGame.titlescreenGameover.isTitleBackgroundVideo) {
                    Platform.canvasVideos.classList.add("hidden");
                    Platform.canvasVideos.pause();
                    Platform.canvasVideos.src = "";
                }

                // Pop load and title screen from the stack
                RPM.gameStack.pop()
                RPM.gameStack.replace(new SceneMap(RPM.game.currentMapId));
            } else {
                RPM.datasGame.system.soundImpossible.playSound();
            }
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        SceneSaveLoadGame.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function(){
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }

        SceneSaveLoadGame.prototype.drawHUD.call(this);
    }
}
