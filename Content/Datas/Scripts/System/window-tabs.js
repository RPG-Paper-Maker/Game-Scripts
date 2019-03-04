/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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
//  CLASS WindowTabs : Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for window tabs.
*   @extends Bitmap
*   @property {OrientationWindow} orientation The orientation of the window.
*   (horizontal or vertical).
*   @property {number[]} dimension The dimension of one tab box.
*   @property {function[]} listCallbacks List of all the callback functions to
*   excecute when pressed.
*   @property {WindowBox[]} listWindows List of all the windows to display.
*   @property {number} currentSelectedIndex The current selected index.
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
*   @param {number} [currentSelectedIndex=0] - The current selected
*   index.
*/
function WindowTabs(orientation, x, y, w, h, nbItemsMax, listContents,
                    listCallBacks, padding, space, currentSelectedIndex)
{

    // Default values
    if (typeof padding === 'undefined') padding = [0,0,0,0];
    if (typeof space === 'undefined') space = 0;
    if (typeof currentSelectedIndex === 'undefined') currentSelectedIndex = 0;

    Bitmap.call(this, x, y, w, h);

    this.orientation = orientation;
    this.choiceWidth = w;
    this.choiceHeight = h;
    this.currentSelectedIndex = currentSelectedIndex;
    this.offsetSelectedIndex = 0;
    this.space = space;
    this.listContents = listContents;
    this.nbItemsMax = nbItemsMax;
    this.padding = padding;

    WindowTabs.prototype.setContentsCallbacks.call(this, listContents,
        listCallBacks);
}

WindowTabs.prototype = {

    updateContentSize: function() {
        // Getting the main box size
        var boxWidth, boxHeight;
        var totalNb = this.listContents.length;
        this.size = totalNb > this.nbItemsMax ? this.nbItemsMax : totalNb;
        if (this.orientation === OrientationWindow.Horizontal) {
            boxWidth = (this.choiceWidth + this.space) * this.size - this.space;
            boxHeight = this.choiceHeight;
        }
        else {
            boxWidth = this.choiceWidth;
            boxHeight = (this.choiceHeight + this.space) * this.size - this.space;
        }
        this.setW(boxWidth);
        this.setH(boxHeight);

        // Create a new windowBox for each choice and according to the orientation
        this.listWindows = new Array(totalNb);
        for (var i = 0; i < totalNb; i++) {
            if (this.orientation === OrientationWindow.Horizontal) {
                this.listWindows[i] = new WindowBox(this.oX + (i * this
                    .choiceWidth) + (i * this.space), this.oY, this.choiceWidth,
                    this.choiceHeight, this.listContents[i], this.padding);
            } else {
                this.listWindows[i] = new WindowBox(this.oX, this.oY + (i * this
                    .choiceHeight) + (i * this.space), this.choiceWidth, this
                    .choiceHeight, this.listContents[i], this.padding);
            }
        }

        if (this.size > 0) {
            if (this.currentSelectedIndex >= this.size) {
                this.currentSelectedIndex = 0;
                this.offsetSelectedIndex = 0;
            }
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = true;
            }
        } else {
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
        }

        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    setX: function(x){
        Bitmap.prototype.setX.call(this, x);
    },

    // -------------------------------------------------------

    setY: function(y){
        Bitmap.prototype.setY.call(this, y);
    },

    // -------------------------------------------------------

    setW: function(w){
        Bitmap.prototype.setW.call(this, w);
    },

    // -------------------------------------------------------

    setH: function(h){
        Bitmap.prototype.setH.call(this, h);
    },

    // -------------------------------------------------------

    /** Get the current selected content.
    *   @returns {Object}
    */
    getCurrentContent: function(){
        return WindowTabs.prototype.getContent.call(this, this
            .currentSelectedIndex);
    },

    // -------------------------------------------------------

    /** Get the content at a specific index.
    *   @param {number} i The index.
    *   @returns {Object}
    */
    getContent: function(i) {
        var window = this.listWindows[i];
        return window ? window.content : null;
    },

    // -------------------------------------------------------

    /** Set the content at a specific index.
    *   @param {number} i The index.
    *   @param {Object} content The new content.
    */
    setContent: function(i, content){
        this.listWindows[i].content = content;
    },

    // -------------------------------------------------------

    /** Set all the contents.
    *   @param {Object[]} contents All the contents.
    */
    setContents: function(contents) {
        for (var i = 0, l = this.listWindows.length; i < l; i++) {
            WindowTabs.prototype.setContent.call(this, i, contents[i]);
        }
    },

    // -------------------------------------------------------

    /** Set all the contents.
    *   @param {Object[]} contents All the contents.
    */
    setCallbacks: function(callbacks) {
        if (callbacks === null) {
            var i, l;
            this.listCallBacks = new Array(l);
            for (i = 0, l = this.listContents.length; i < l; i++)
                this.listCallBacks[i] = null;
        } else {
             this.listCallBacks = callbacks;
        }
    },


    // -------------------------------------------------------

    /** Set all the contents.
    *   @param {Object[]} contents All the contents.
    */
    setContentsCallbacks: function(contents, callbacks) {
        var i, l;

        this.listContents = contents;
        WindowTabs.prototype.updateContentSize.call(this);
        WindowTabs.prototype.setCallbacks.call(this, callbacks);
    },

    // -------------------------------------------------------

    /** Unselect a choice.
    */
    unselect: function(){
        if (this.currentSelectedIndex !== -1) {
            this.listWindows[this.currentSelectedIndex].selected = false;
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
        }
        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    /** Select a choice.
    *   @param {number} i The index of the choice.
    */
    select: function(i) {
        this.currentSelectedIndex = i;
        this.listWindows[this.currentSelectedIndex].selected = true;
        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    /** Select the current choice.
    */
    selectCurrent: function(){
        WindowTabs.prototype.select.call(this, this.currentSelectedIndex);
    },

    // -------------------------------------------------------

    /** When going up.
    */
    goUp: function(){
        if (this.currentSelectedIndex > 0) {
            this.currentSelectedIndex--;
            if (this.offsetSelectedIndex > 0) {
                this.offsetSelectedIndex--;
            }
        } else if (this.currentSelectedIndex === 0) {
            this.currentSelectedIndex = this.listWindows.length - 1;
            this.offsetSelectedIndex = this.size - 1;
        }
        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    /** When going down.
    */
    goDown: function(){
        if (this.currentSelectedIndex < this.listWindows.length - 1 && this
            .currentSelectedIndex >= 0) {
            this.currentSelectedIndex++;
            if (this.offsetSelectedIndex < this.size - 1) {
                this.offsetSelectedIndex++;
            }
        }
        else if (this.currentSelectedIndex === this.listWindows.length - 1) {
            this.currentSelectedIndex = 0;
            this.offsetSelectedIndex = 0;
        }
        $requestPaintHUD = true;
    },

    // -------------------------------------------------------

    /** First key press handle.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key, base){
        if (this.currenSelectedIndex !== -1) {
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                .Action))
            {
                var callback = this.listCallBacks[this.currentSelectedIndex];
                if (callback !== null) {
                    callback.call(base);
                }
            }
        }
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key) {
        if (this.currentSelectedIndex !== -1) {
            this.listWindows[this.currentSelectedIndex].selected = false;

            if (this.orientation === OrientationWindow.Vertical) {
                if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                    .menuControls.Down))
                {
                    WindowTabs.prototype.goDown.call(this);
                } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                    .menuControls.Up))
                {
                    WindowTabs.prototype.goUp.call(this);
                }
            } else {
                if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                    .menuControls.Right))
                {
                    WindowTabs.prototype.goDown.call(this);
                }
                else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                    .menuControls.Left))
                {
                    WindowTabs.prototype.goUp.call(this);
                }
            }

            WindowTabs.prototype.selectCurrent.call(this);
        }
    },

    // -------------------------------------------------------

    /** Draw the windows
    *   @param {Canvas.Context} context The canvas context.
    */
    draw: function() {
        var i, index, offset;

        offset = this.currentSelectedIndex === -1 ? -1 : this.offsetSelectedIndex;
        for (i = 0; i < this.size; i++) {
            index = i + this.currentSelectedIndex - offset;
            this.listWindows[index].draw(true, this.listWindows[i].windowDimension,
                this.listWindows[i].contentDimension);
        }
    }
}
