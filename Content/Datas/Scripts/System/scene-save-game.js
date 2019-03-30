/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SceneSaveGame : SceneSaveLoadGame
//
// -------------------------------------------------------

/** @class
*   @extends SceneSaveLoadGame
*   A scene in the menu for saving a game.
*/
function SceneSaveGame() {
    SceneSaveLoadGame.call(this);

    SceneSaveLoadGame.prototype.setContents.call(
                this,
                new GraphicText("Save a game"),
                new GraphicText("Select a slot where you want to save.")
                );
}

SceneSaveGame.prototype = {

    update: function(){
        SceneSaveLoadGame.prototype.update.call(this);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        var slot;

        SceneSaveLoadGame.prototype.onKeyPressed.call(this, key);

        // If action, save in the selected slot
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Action))
        {
            slot = this.windowChoicesSlots.currentSelectedIndex + 1;
            $game.write(slot);

            // Pop to return in the precedent state
            $gameStack.pop();
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
        SceneSaveLoadGame.prototype.drawHUD.call(this);
    }
}
