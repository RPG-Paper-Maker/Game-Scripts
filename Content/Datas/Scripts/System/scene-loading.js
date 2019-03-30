/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    this.text = new GraphicText("Loading...", Align.Right, $fontSize, $fontName,
        590, 450, 40, 20);
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
