/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Enum, Constants, Platform } from "../Common/index.js";
var Align = Enum.Align;
var PictureKind = Enum.PictureKind;
import { Graphic, Datas } from "../index.js";
/** @class
 *  The graphic displaying a text and an icon.
 *  @extends Graphic.Base
 *  @param {string} text - The brut text to display
 *  @param {number} iconID - The icon ID
 *  @param {Object} [opts={}] - Options
 *  @param {Align} [opts.side=Align.Left] - The side to display icon
 *  @param {Align} [opts.align=Align.left] - The complete graphic align
 *  @param {number} [opts.space=RPM.MEDIUM_SPACE] - The space between icon and
 *  text
 */
class TextIcon extends Base {
    constructor(text, iconID, { side = Align.Left, align = Align
        .Left, space = Constants.MEDIUM_SPACE } = {}, textOptions = {}) {
        super();
        this.iconID = iconID;
        this.side = side;
        this.align = align;
        this.space = space;
        this.graphicIcon = Datas.Pictures.getPictureCopy(PictureKind.Icons, this
            .iconID);
        this.graphicText = new Graphic.Text("", textOptions);
        this.setText(text);
    }
    /**
     *  Get the max possible height.
     *  @returns {number}
     */
    getMaxHeight() {
        return Math.max(this.graphicText.fontSize, this.graphicIcon.oH);
    }
    /**
     *  Get the width.
     *  @returns {number}
     */
    getWidth() {
        return this.graphicIcon.oW + this.space + this.length;
    }
    /**
     *  Set the text.
     *  @param {string} text
     */
    setText(text) {
        if (this.text !== text) {
            this.text = text;
            this.graphicText.setText(text);
            Platform.ctx.font = this.graphicText.font;
            this.graphicText.updateContextFont();
            this.length = Platform.ctx.measureText(this.text).width;
        }
    }
    /**
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        let iconWidth = this.graphicIcon.oW;
        let iconHeight = this.graphicIcon.oH;
        // Align offset
        let offset;
        switch (this.align) {
            case Align.Left:
                offset = 0;
                break;
            case Align.Right:
                offset = w - this.getWidth();
                break;
            case Align.Center:
                offset = (w - this.getWidth()) / 2;
                break;
        }
        // Draw according to side
        if (this.side === Align.Left) {
            this.graphicIcon.draw(x + offset, y - (iconHeight / 2) + (h / 2));
            offset += iconWidth + this.space;
            this.graphicText.draw(x + offset, y, w, h);
        }
        else if (this.side === Align.Right) {
            this.graphicText.draw(x + offset, y, w, h);
            offset += this.length + this.space;
            this.graphicIcon.draw(x + offset, y - (iconHeight / 2) + (h / 2));
        }
    }
    /**
     *  Drawing the content.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.drawChoice(x, y, w, h);
    }
}
export { TextIcon };
