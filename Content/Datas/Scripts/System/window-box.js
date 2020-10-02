/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

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
class WindowBox extends Bitmap
{
    constructor(x, y, w, h, content, padding, limitContent)
    {
        super(x, y, w, h);

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

    updateDimensions() {


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
    }

    setX(x){
        super.setX(x);
        if (this.padding)
        {
            this.updateDimensions();
        }
    }

    // -------------------------------------------------------

    setY(y){
        super.setY(y);
        if (this.padding)
        {
            this.updateDimensions();
        }
    }

    // -------------------------------------------------------

    setW(w){
        super.setW(w);
        if (this.padding)
        {
            this.updateDimensions();
        }
    }

    // -------------------------------------------------------

    setH(h){
        super.setH(h);
        if (this.padding)
        {
            this.updateDimensions();
        }
    }

    update() {
        if (this.content !== null) {
            this.content.update();
        }
    }

    // -------------------------------------------------------

    /** Draw the window
    *   @param {Canvas.Context} context The canvas context.
    *   @param {boolean} [isChoice=false] - Indicate if this window box is used
    *   for a window choices.
    */
    draw(isChoice, windowDimension, contentDimension) {
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
            RPM.datasGame.system.getWindowSkin().drawBox(windowDimension, this
                .selected, this.bordersVisible);

            // Draw content
            if (this.content !== null) {
                if (!isChoice && this.limitContent) {
                    Platform.ctx.save();
                    Platform.ctx.beginPath();
                    Platform.ctx.rect(RPM.getScreenX(contentDimension[0]), RPM
                        .getScreenY(contentDimension[1] - (this.padding[3] / 2))
                        , RPM.getScreenX(contentDimension[2]), RPM.getScreenY(
                        contentDimension[3] + this.padding[3]));
                    Platform.ctx.clip();
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
                    Platform.ctx.restore();
                }
            }
        }
    }
}
