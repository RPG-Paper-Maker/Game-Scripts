/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Bitmap } from "./Bitmap.js";
import { Datas } from "../index.js";
import { Platform, ScreenResolution } from "../Common/index.js";
/** @class
 *  A class for window boxes.
 *  @extends Bitmap
 *  @param {number} x The x coords
 *  @param {number} y The y coords
 *  @param {number} w The w coords
 *  @param {number} h The h coords
 *  @param {Object} [opts={}] Options
 *  @param {Bitmap} [opts.content=null] Content (containing a draw function) to
 *  display inside the window.
 *  @param {number[]} [opts.padding=[0,0,0,0]] Padding of the box
 *  @param {boolean} [opts.limitContent=true] If checked, the content will be
 *  cut according to padding
 */
class WindowBox extends Bitmap {
    constructor(x, y, w, h, { content = null, padding = [0, 0, 0, 0], limitContent = true } = {}) {
        super(x, y, w, h);
        this.content = content;
        this.padding = padding;
        this.limitContent = limitContent;
        this.updateDimensions();
        this.bordersOpacity = 1;
        this.backgroundOpacity = 1;
        this.selected = false;
        this.bordersVisible = true;
    }
    /**
     *  Set the x value.
     *  @param {number} x The x value
     */
    setX(x) {
        super.setX(x);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the y value.
     *  @param {number} y The y value
     */
    setY(y) {
        super.setY(y);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the w value.
     *  @param {number} w The w value
     */
    setW(w) {
        super.setW(w);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Set the h value.
     *  @param {number} h The h value
     */
    setH(h) {
        super.setH(h);
        if (this.padding) {
            this.updateDimensions();
        }
    }
    /**
     *  Update the content and window dimensions.
     */
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
    /**
     *  Update the content.
     */
    update() {
        if (this.content) {
            this.content.update();
        }
    }
    /**
     *  Draw the window.
     *  @param {boolean} [isChoice=false] Indicate if this window box is used
     *  for a window choices
     *  @param {number[]} [windowDimension = this.windowDimension] Dimensions
     *  of the window
     *  @param {number[]} [contentDimension = this.contentDimension] Dimension
     *  of content
     */
    draw(isChoice = false, windowDimension = this
        .windowDimension, contentDimension = this.contentDimension) {
        // Content behind
        if (this.content) {
            this.content.drawBehind(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
        }
        // Draw box
        Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this
            .selected, this.bordersVisible);
        // Draw content
        if (this.content) {
            if (!isChoice && this.limitContent) {
                Platform.ctx.save();
                Platform.ctx.beginPath();
                Platform.ctx.rect(ScreenResolution.getScreenX(contentDimension[0]), ScreenResolution.getScreenY(contentDimension[1] - (this.padding[3] / 2)), ScreenResolution.getScreenX(contentDimension[2]), ScreenResolution.getScreenY(contentDimension[3] + this.padding[3]));
                Platform.ctx.clip();
            }
            if (isChoice) {
                this.content.drawChoice(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
            }
            else {
                this.content.draw(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
            }
            if (!isChoice && this.limitContent) {
                Platform.ctx.restore();
            }
        }
    }
}
WindowBox.NONE_PADDING = [0, 0, 0, 0];
WindowBox.VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
WindowBox.SMALL_PADDING_BOX = [10, 10, 10, 10];
WindowBox.MEDIUM_PADDING_BOX = [20, 20, 20, 20];
WindowBox.HUGE_PADDING_BOX = [30, 30, 30, 30];
WindowBox.DIALOG_PADDING_BOX = [30, 50, 30, 50];
WindowBox.SMALL_SLOT_PADDING = [10, 5, 10, 5];
WindowBox.SMALL_SLOT_HEIGHT = 30;
WindowBox.MEDIUM_SLOT_WIDTH = 200;
WindowBox.MEDIUM_SLOT_HEIGHT = 40;
WindowBox.LARGE_SLOT_HEIGHT = 60;
export { WindowBox };
