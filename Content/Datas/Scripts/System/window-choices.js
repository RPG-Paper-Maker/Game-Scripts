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
//  CLASS WindowChoices : WindowTabs
//
// -------------------------------------------------------

/** @class
*   A class for window choices.
*   @extends WindowTabs
*   @property {WindowBox} windowMain The main window for the choices.
*   @param {OrientationWindow} orientation The orientation of the window.
*   @param {number} x The x coords.
*   @param {number} y The y coords.
*   @param {number} w The w coords.
*   @param {number} h The h coords.
*   @param {number} nbItemsMax Max number of items to display on screen.
*   @param {Object[]} listContents List of all the contents to display.
*   @param {function[]} listCallbacks List of all the callback functions to
*   excecute when pressed.
*   @param {number[]} [padding=[0,0,0,0]] - Padding of the boxes.
*   @param {number} [space=0] - Space between each choice.
*   @param {number} [currentSelectedIndex=[0,0,0,0]] - The current selected
*   index.
*/
function WindowChoices(orientation, x, y, w, h, nbItemsMax, listContents,
    listCallBacks, padding, space, currentSelectedIndex, bordersInsideVisible)
{
    WindowTabs.call(this, orientation, x, y, w, h, nbItemsMax, listContents,
        listCallBacks, padding, space, currentSelectedIndex,
        bordersInsideVisible);
}

WindowChoices.prototype = {

    setX: function(x){
        WindowTabs.prototype.setX.call(this, x);
    },

    // -------------------------------------------------------

    setY: function(y){
        WindowTabs.prototype.setY.call(this, y);
    },

    // -------------------------------------------------------

    setW: function(w){
        WindowTabs.prototype.setW.call(this, w);
    },

    // -------------------------------------------------------

    setH: function(h){
        WindowTabs.prototype.setH.call(this, h);
    },

    // -------------------------------------------------------

    getCurrentContent: function(){
        return WindowTabs.prototype.getCurrentContent.call(this);
    },

    // -------------------------------------------------------

    getContent: function(i){
        return WindowTabs.prototype.getContent.call(this, i);
    },

    // -------------------------------------------------------

    setContent: function(i, content){
        WindowTabs.prototype.setContent.call(this, i, content);
    },

    // -------------------------------------------------------

    setContents: function(contents){
        WindowTabs.prototype.setContents.call(this, contents);
    },

    setContentsCallbacks: function(contents, callbacks, currentSelectedIndex) {
        WindowTabs.prototype.setContentsCallbacks.call(this, contents, callbacks
            , currentSelectedIndex);
    },

    // -------------------------------------------------------

    unselect: function(){
        WindowTabs.prototype.unselect.call(this);
    },

    // -------------------------------------------------------

    select: function(i){
        WindowTabs.prototype.select.call(this, i);
    },

    // -------------------------------------------------------

    selectCurrent: function(){
        WindowTabs.prototype.selectCurrent.call(this);
    },

    // -------------------------------------------------------

    onKeyPressed: function(key, base){
        WindowTabs.prototype.onKeyPressed.call(this, key, base);
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        WindowTabs.prototype.onKeyPressedAndRepeat.call(this, key);
    },

    // -------------------------------------------------------

    /** Draw the windows
    *   @param {Canvas.Context} context The canvas context.
    */
    draw: function(){
        //this.windowMain.draw();

        WindowTabs.prototype.draw.call(this);
    }
}
