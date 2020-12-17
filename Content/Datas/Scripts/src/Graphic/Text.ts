/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Utils, Constants, ScreenResolution, Platform } from "../Common";
import Align = Enum.Align;
import AlignVertical = Enum.AlignVertical;
import { Stack } from "../Manager";
import { Base } from "./Base";
import { Datas, System } from "..";

/** @class
 *  A class for all the texts to display in HUD.
 *  @extends Bitmap
 *  @param {string} [text=""] The brut text to display
 *  @param {Object} [opts={}] Options
 *  @param {number} [opts.x=0] The x coords of the text
 *  @param {number} [opts.y=0] The y coords of the text
 *  @param {number} [opts.w=0] The w coords of the text
 *  @param {number} [opts.h=0] The h coords of the text
 *  @param {Align} [opts.align=Align.Left] Alignement of the text
 *  @param {number} [opts.fontSize=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtSize, RPM.fontSize)]
 *  The font height used for the text
 *  @param {string} [opts.fontName=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtFont, RPM.fontName)]
 *  The font name used for the text
 *  @param {AlignVertical} [opts.verticalAlign=AlignVertical.Center] Vertical 
 *  alignement of the text
 *  @param {SystemColor} [opts.color=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcText]
 *  The color used for the text
 *  @param {boolean} [opts.bold=false] If checked, make the text bold
 *  @param {boolean} [opts.italic=false] If checked, make the text italic
 *  @param {SystemColor} [opts.backColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcBackground, null)]
 *  The background color behind the text
 *  @param {SystemColor} [opts.strokeColor=RPM.defaultValue(RPM.datasGame.System.dbOptions.tOutline, false)? RPM.defaultValue(RPM.datasGame.System.dbOptions.vtcOutline, null) : null]
 *  The stroke color of the text
 */
class Text extends Base {
    public text: string;
    public align: Align;
    public fontSize: number;
    public fontName: string;
    public verticalAlign: AlignVertical;
    public color: System.Color;
    public bold: boolean;
    public italic: boolean;
    public backColor: System.Color;
    public strokeColor: System.Color;
    public oFont: string;
    public font: string;
    public textWidth: number;
    public datas: any;

    constructor(text = "", { x = 0, y = 0, w = 0, h = 0, align = Align.Left, 
        fontSize = Utils.defaultValue(Datas.Systems.dbOptions.v_tSize, Constants
        .DEFAULT_FONT_SIZE), fontName = Utils.defaultValue(Datas.Systems
        .dbOptions.v_tFont, Constants.DEFAULT_FONT_NAME), verticalAlign = 
        AlignVertical.Center, color = Utils.defaultValue(Datas.Systems.dbOptions
        .v_tcText, System.Color.WHITE), bold = false, italic = false, backColor 
        = Utils.defaultValue(Datas.Systems.dbOptions.v_tcBackground, null), 
        strokeColor = Utils.defaultValue(Datas.Systems.dbOptions.tOutline, false
        ) ? Utils.defaultValue(Datas.Systems.dbOptions.v_tcOutline, null) : null
        } = {})
    {
        super(x, y, w, h);

        this.align = align;
        this.fontName = fontName;
        this.verticalAlign = verticalAlign;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.backColor = backColor;
        this.strokeColor = strokeColor;
        this.setFontSize(fontSize);
        this.setText(Utils.defaultValue(text, ""));
    }

    /** 
     *  Set the font size and the final font.
     *  @param {number} fontSize The new font size
     */
    setFontSize(fontSize: number) {
        this.fontSize = fontSize;

        // Create fonts without resizing (screen resolution) + with resize
        this.oFont = Utils.createFont(fontSize, this.fontName, this.bold, this
            .italic);
        this.font = Utils.createFont(ScreenResolution.getScreenMinXY(fontSize), 
            this.fontName, this.bold, this.italic);
    }

    /** 
     *  Set the current displayed text.
     *  @param {string} text The new text
     */
    setText(text: string) {
        if (this.text !== text) {
            this.text = text;
            this.measureText();
            Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Update the context font (without window resizing), this function is
     *  used before a context.measureText.
     */
    updateContextFont() {
        Platform.ctx.font = this.oFont;
    }

    /** 
     *  Update the context font with resizing.
     */
    updateContextFontReal()
    {
        Platform.ctx.font = this.font;
    }

    /** 
     *  Measure text width and stock results in the instance.
     */
    measureText(): number
    {
        this.updateContextFont();
        this.textWidth = Platform.ctx.measureText(this.text).width + (this
            .strokeColor === null ? 0 : 2);
        return this.textWidth;
    }

    /** 
     *  Drawing the text in choice box.
     *  @param {number} [x=this.oX] The x position to draw graphic
     *  @param {number} [y=this.oY] The y position to draw graphic
     *  @param {number} [w=this.oW] The width dimention to draw graphic
     *  @param {number} [h=this.oH] The height dimention to draw graphic
     *  @param {boolean} [positionResize=true] If checked, resize postion 
     *  according to screen resolution
     */
    drawChoice(x: number = this.oX, y: number = this.oY, w: number = this.oW, h:
        number = this.oH, positionResize: boolean = true): void
    {
        // If position resize checked, resize it
        if (positionResize) {
            x = ScreenResolution.getScreenX(x);
            y = ScreenResolution.getScreenY(y);
        }
        w = ScreenResolution.getScreenX(w);
        h = ScreenResolution.getScreenY(h);

        // Correcting x and y according to alignment
        let xBack = x;
        let textWidth = ScreenResolution.getScreenX(this.textWidth);
        let textHeight = ScreenResolution.getScreenY(this.fontSize + (this
            .strokeColor === null ? 0 : 2));
        switch(this.align) {
        case Align.Left:
            break;
        case Align.Right:
            x += w;
            xBack = x - textWidth;
            break;
        case Align.Center:
            x += (w / 2);
            xBack = x - (textWidth / 2);
            break;
        }
        y += ScreenResolution.getScreenY(this.fontSize) / 3;
        switch(this.verticalAlign) {
        case AlignVertical.Bot:
            y += h;
            break;
        case AlignVertical.Top:
            break;
        case AlignVertical.Center:
            y += (h / 2);
            break;
        }

        // Draw background color
        if (this.backColor !== null) {
            Platform.ctx.fillStyle = this.backColor.rgb;
            Platform.ctx.fillRect(xBack, y - textHeight, textWidth, textHeight);
        }

        // Set context options
        Platform.ctx.font = this.font;
        Platform.ctx.textAlign = <CanvasTextAlign> this.align;
        let lineHeight = this.fontSize * 2;
        let lines = this.text.split(Constants.STRING_NEW_LINE);
        let i: number, l = lines.length;

        // Stroke text
        let yOffset;
        if (this.strokeColor !== null) {
            Platform.ctx.strokeStyle = this.strokeColor.rgb;
            yOffset = 0;
            for (i = 0; i < l; i++) {
                Platform.ctx.strokeText(lines[i], x - 1, y - 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x - 1, y  + 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x + 1, y - 1 + yOffset);
                Platform.ctx.strokeText(lines[i], x + 1, y + 1 + yOffset);
                yOffset += lineHeight;
            }
        }

        // Drawing the text
        Platform.ctx.fillStyle = this.color.rgb;
        yOffset = 0;
        for (i = 0; i < l; i++) {
            Platform.ctx.fillText(lines[i], x, y + yOffset);
            yOffset += lineHeight;
        }
    }

    /** 
     *  Drawing the text in box (duplicate of drawChoice).
     *  @param {number} [x=this.oX] The x position to draw graphic
     *  @param {number} [y=this.oY] The y position to draw graphic
     *  @param {number} [w=this.oW] The width dimention to draw graphic
     *  @param {number} [h=this.oH] The height dimention to draw graphic
     *  @param {boolean} [positionResize=true] If checked, resize postion 
     *  according to screen resolution
     */
    draw(x: number = this.oX, y: number = this.oY, w: number = this.oW, h: 
        number = this.oH, positionResize: boolean = true)
    {
        this.drawChoice(x, y, w, h, positionResize);
    }
}

export { Text }