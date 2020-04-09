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
//  CLASS WindowBox
//
// -------------------------------------------------------

/** @class
*   A class for window boxes.
*   @extends Bitmap
*   @property {number[]} windowDimension Dimensions of the window (rectangle).
*   @property {Object} content Content (containing a draw function) to display
*   inside the window.
*   @property {number[]} padding Padding of the box.
*   @property {number[]} contentDimension Dimension of content.
*   @param {number} x The x coords.
*   @param {number} y The y coords.
*   @param {number} w The w coords.
*   @param {number} h The h coords.
*   @param {Object} [content=null] - Content (containing a draw function) to
*   display inside the window.
*   @param {number[]} [padding=[0,0,0,0]] - Padding of the box.
*/
function WindowBox(x, y, w, h, content, padding, limitContent) {
    Bitmap.call(this, x, y, w, h);

    // Default values
    if (typeof content === 'undefined') content = null;
    if (typeof padding === 'undefined') padding = [0,0,0,0];
    if (typeof limitContent === 'undefined') {
        limitContent = true;
    }

    this.padding = padding;
    this.content = content;
    this.limitContent = limitContent;
    this.updateDimensions();
    this.bordersOpacity = 1;
    this.backgroundOpacity = 1;
    this.selected = false;
    this.contentLoaded = true;
    this.bordersVisible = true;
}

WindowBox.prototype = {

    updateDimensions: function() {

        // Setting content dimensions
        this.contentDimension = [
            this.oX + this.padding[0],
            this.oY + this.padding[1],
            this.oW - (2 * this.padding[2]),
            this.oH - (2 * this.padding[3])
        ];

        // Adjusting dimensions
        this.windowDimension = [
            this.oX,
            this.oY,
            this.oW,
            this.oH
        ];
    },

    setX: function(x){
        Bitmap.prototype.setX.call(this, x);
        this.updateDimensions();
    },

    // -------------------------------------------------------

    setY: function(y){
        Bitmap.prototype.setY.call(this, y);
        this.updateDimensions();
    },

    // -------------------------------------------------------

    setW: function(w){
        Bitmap.prototype.setW.call(this, w);
        this.updateDimensions();
    },

    // -------------------------------------------------------

    setH: function(h){
        Bitmap.prototype.setH.call(this, h);
        this.updateDimensions();
    },

    update: function() {
        if (this.content !== null) {
            this.content.update();
        }
    },

    // -------------------------------------------------------

    /** Draw the window
    *   @param {Canvas.Context} context The canvas context.
    *   @param {boolean} [isChoice=false] - Indicate if this window box is used
    *   for a window choices.
    */
    draw: function(isChoice, windowDimension, contentDimension) {
        if (this.contentLoaded) {
            // Default values
            if (typeof isChoice === 'undefined') {
                isChoice = false;
            }
            if (typeof windowDimension === 'undefined') {
                windowDimension = this.windowDimension;
            }
            if (typeof contentDimension === 'undefined') {
                contentDimension = this.contentDimension;
            }

            // Content behind
            if (this.content && this.content.drawBehind) {
                this.content.drawBehind(contentDimension[0], contentDimension[1]
                    , contentDimension[2], contentDimension[3]);
            }

            // Draw box
            $datasGame.system.getWindowSkin().drawBox(windowDimension, this
                .selected, this.bordersVisible);

            // Draw content
            if (this.content !== null) {
                if (!isChoice && this.limitContent) {
                    $context.save();
                    $context.beginPath();
                    $context.rect(RPM.getScreenX(contentDimension[0]), RPM
                        .getScreenY(contentDimension[1] - (this.padding[3] / 2))
                        , RPM.getScreenX(contentDimension[2]), RPM.getScreenY(
                        contentDimension[3] + this.padding[3]));
                    $context.clip();
                }
                if (isChoice){
                    this.content.draw(
                         contentDimension[0],
                         contentDimension[1],
                         contentDimension[2],
                         contentDimension[3]
                    );
                } else {
                    this.content.drawInformations(
                         contentDimension[0],
                         contentDimension[1],
                         contentDimension[2],
                         contentDimension[3]
                    );
                }
                if (this.limitContent) {
                    $context.restore();
                }
            }
        }
    }
}
