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
    listCallBacks, padding, space, currentSelectedIndex, bordersInsideVisible)
{

    // Default values
    if (typeof padding === 'undefined') padding = [0,0,0,0];
    if (typeof space === 'undefined') space = 0;
    if (typeof currentSelectedIndex === 'undefined') currentSelectedIndex = 0;
    if (typeof bordersInsideVisible === 'undefined') bordersInsideVisible = true;

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
    this.bordersInsideVisible = bordersInsideVisible;
    this.startTime = new Date().getTime();

    WindowTabs.prototype.setContentsCallbacks.call(this, listContents,
        listCallBacks, currentSelectedIndex);
}

WindowTabs.prototype = {

    updateContentSize: function(currentSelectedIndex) {
        var window;

        if (typeof currentSelectedIndex === 'undefined') {
            currentSelectedIndex = 0;
        }

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
        if (!this.bordersInsideVisible) {
            this.windowMain = new WindowBox(this.oX, this.oY, boxWidth,
                boxHeight);
        }

        // Create a new windowBox for each choice and according to the orientation
        this.listWindows = new Array(totalNb);
        for (var i = 0; i < totalNb; i++) {
            if (this.orientation === OrientationWindow.Horizontal) {
                window = new WindowBox(this.oX + (i * this.choiceWidth) + (i *
                    this.space), this.oY, this.choiceWidth, this.choiceHeight,
                    this.listContents[i], this.padding);
            } else {
                window = new WindowBox(this.oX, this.oY + (i * this.choiceHeight
                    ) + (i * this.space), this.choiceWidth, this.choiceHeight,
                    this.listContents[i], this.padding);
            }
            window.bordersVisible = this.bordersInsideVisible;
            this.listWindows[i] = window;
        }

        if (this.size > 0) {
            this.currentSelectedIndex = currentSelectedIndex;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = true;
            }
        } else {
            this.currentSelectedIndex = -1;
        }
        this.offsetSelectedIndex = 0;

        RPM.requestPaintHUD = true;
    },

    // -------------------------------------------------------

    setX: function(x) {
        Bitmap.prototype.setX.call(this, x);
        WindowTabs.prototype.updateContentSize.call(this, this
            .currentSelectedIndex);
    },

    // -------------------------------------------------------

    setY: function(y) {
        Bitmap.prototype.setY.call(this, y);
        WindowTabs.prototype.updateContentSize.call(this, this
            .currentSelectedIndex);
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
    setContentsCallbacks: function(contents, callbacks, currentSelectedIndex) {
        var i, l;

        this.listContents = contents;
        WindowTabs.prototype.updateContentSize.call(this, currentSelectedIndex);
        WindowTabs.prototype.setCallbacks.call(this, callbacks);
    },

    // -------------------------------------------------------

    /** Unselect a choice.
    */
    unselect: function(){
        if (this.currentSelectedIndex !== -1 && this.listWindows.length > 0) {
            this.listWindows[this.currentSelectedIndex].selected = false;
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
            RPM.requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    /** Select a choice.
    *   @param {number} i The index of the choice.
    */
    select: function(i) {
        if (this.listWindows.length > 0) {
            if (i >= this.listWindows.length) {
                i = this.listWindows.length - 1;
                this.offsetSelectedIndex = this.size - 1;
            }

            this.currentSelectedIndex = i;
            this.listWindows[this.currentSelectedIndex].selected = true;
            RPM.requestPaintHUD = true;
        }
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
    goUp: function() {
        var index;

        index = this.currentSelectedIndex;
        if (index > 0) {
            this.currentSelectedIndex--;
            if (this.offsetSelectedIndex > 0) {
                this.offsetSelectedIndex--;
            }
        } else if (index === 0) {
            this.currentSelectedIndex = this.listWindows.length - 1;
            this.offsetSelectedIndex = this.size - 1;
        }
        if (index !== this.currentSelectedIndex) {
            RPM.datasGame.system.soundCursor.playSound();
            RPM.requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    /** When going down.
    */
    goDown: function() {
        var index;

        index = this.currentSelectedIndex;
        if (index < this.listWindows.length - 1 && index >= 0) {
            this.currentSelectedIndex++;
            if (this.offsetSelectedIndex < this.size - 1) {
                this.offsetSelectedIndex++;
            }
        }
        else if (index === this.listWindows.length - 1) {
            this.currentSelectedIndex = 0;
            this.offsetSelectedIndex = 0;
        }
        if (index !== this.currentSelectedIndex) {
            RPM.datasGame.system.soundCursor.playSound();
            RPM.requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    /** First key press handle.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key, base){
        if (this.currenSelectedIndex !== -1) {
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                .Action))
            {
                var callback = this.listCallBacks[this.currentSelectedIndex];
                if (callback !== null) {
                    if (callback.call(base)) {
                        RPM.datasGame.system.soundConfirmation.playSound();
                    } else {
                        RPM.datasGame.system.soundImpossible.playSound();
                    }
                } else {
                    RPM.datasGame.system.soundImpossible.playSound();
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
        // Wait 50 ms for a slower update
        var t = new Date().getTime();
        if (t - this.startTime >= 50)
        {
            this.startTime = t;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = false;
    
                if (this.orientation === OrientationWindow.Vertical) {
                    if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Down))
                    {
                        WindowTabs.prototype.goDown.call(this);
                    } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Up))
                    {
                        WindowTabs.prototype.goUp.call(this);
                    }
                } else {
                    if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Right))
                    {
                        WindowTabs.prototype.goDown.call(this);
                    }
                    else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Left))
                    {
                        WindowTabs.prototype.goUp.call(this);
                    }
                }
    
                WindowTabs.prototype.selectCurrent.call(this);
            }
        } 
    },

    // -------------------------------------------------------

    /** Draw the windows
    *   @param {Canvas.Context} context The canvas context.
    */
    draw: function() {
        var i, index, offset;

        if (!this.bordersInsideVisible) {
            this.windowMain.draw();
        }

        offset = this.currentSelectedIndex === -1 ? -1 : this.offsetSelectedIndex;
        for (i = 0; i < this.size; i++) {
            index = i + this.currentSelectedIndex - offset;
            this.listWindows[index].draw(true, this.listWindows[i].windowDimension,
                this.listWindows[i].contentDimension);
        }
    }
}
