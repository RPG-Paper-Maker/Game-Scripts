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
    if ($datasGame.titlescreenGameover.isTitleBackgroundImage) {
        this.pictureBackground = Picture2D.createImageWithID($datasGame
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
                                     $datasGame.keyBoard.menuControls.Action))
        {
            $game = this.windowChoicesSlots.getCurrentContent().game;
            if (!$game.isNull) {
                $datasGame.system.soundConfirmation.playSound();

                // Initialize properties for hero
                $game.hero.initializeProperties();

                // Stop video if existing
                if (!$datasGame.titlescreenGameover.isTitleBackgroundVideo) {
                    $canvasVideos.stop();
                }

                // Pop load and title screen from the stack
                $gameStack.pop()
                $gameStack.replace(new SceneMap($game.currentMapId));
            } else {
                $datasGame.system.soundImpossible.playSound();
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
        if ($datasGame.titlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }

        SceneSaveLoadGame.prototype.drawHUD.call(this);
    }
}
