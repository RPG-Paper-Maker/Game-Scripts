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
//  CLASS SceneLoading : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the loading.
*   @extends SceneGame
*/
function SceneLoading() {
    SceneGame.call(this);

    this.text = new GraphicText("Loading...", { align: Align.Right, x: 590, y:
        450, w: 40, h: 20 });
}

SceneLoading.prototype = {

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){

    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){

    },

    // -------------------------------------------------------

    draw3D: function(canvas){

    },

    // -------------------------------------------------------

    drawHUD: function() {
        this.text.draw();
    }
}
