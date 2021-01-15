/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Enum, Constants, Platform } from "../Common";
import Align = Enum.Align;
import PictureKind = Enum.PictureKind;
import { Picture2D } from "../Core";
import { Graphic, Datas, System } from "../index";

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

    public text: string;
    public iconID: number;
    public system: System.Base;
    public side: Align;
    public align: Align;
    public space: number;
    public graphicIcon: Picture2D;
    public graphicText: Graphic.Text;
    public length: number;

    constructor(text: string, iconID: number, { side = Align.Left, align = Align
        .Left, space = Constants.MEDIUM_SPACE } = {})
    {
        super();

        this.text = text;
        this.iconID = iconID;
        this.side = side;
        this.align = align;
        this.space = space;
        this.graphicIcon = Datas.Pictures.getPictureCopy(PictureKind.Icons, this
            .iconID);
        this.graphicText = new Graphic.Text(this.text);
        Platform.ctx.font = this.graphicText.font;
        this.graphicText.updateContextFont();
        this.length = Platform.ctx.measureText(this.text).width;
    }

    /** 
     *  Get the max possible height.
     *  @returns {number}
     */
    getMaxHeight(): number {
        return Math.max(this.graphicText.fontSize, this.graphicIcon.oH);
    }

    /** 
     *  Get the width.
     *  @returns {number}
     */
    getWidth(): number {
        return this.graphicIcon.oW + this.space + this.length;
    }

    /** 
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        let iconWidth = this.graphicIcon.oW;
        let iconHeight = this.graphicIcon.oH;

        // Align offset
        let offset: number;
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
        } else if (this.side === Align.Right) {
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
    draw(x: number, y: number, w: number, h: number) {
        this.drawChoice(x, y, w, h);
    }
}

export { TextIcon }