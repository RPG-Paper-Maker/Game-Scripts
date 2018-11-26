/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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

    drawHUD: function(context){
        this.text.draw(context);
    }
}
