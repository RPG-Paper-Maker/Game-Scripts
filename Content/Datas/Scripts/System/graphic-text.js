/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A class for all the texts to display in HUD
*   @extends Bitmap
*   @property {string} text The brut text to display
*   @property {Align} align Alignement of the text
*   @property {number} fontSize The font height used for the text
*   @property {string} fontName The font name used for the text
*   @property {AlignVertical} verticalAlign Vertical alignement of the text
*   @property {SystemColor} color The color used for the text
*   @property {boolean} bold If checked, make the text bold
*   @property {boolean} italic If checked, make the text italic
*   @property {SystemColor} backColor The background color behind the text
*   @property {SystemColor} strokeColor The stroke color of the text
*   @property {string} font The font used for the text (combining fontSize + 
*   fontName)
*   @property {number} textWidth The font text width (without resizing)
*   @param {string} [text=""] The brut text to display
*   @param {Object} [opts={}] Options
*   @param {number} [opts.x=0] The x coords of the text
*   @param {number} [opts.y=0] The y coords of the text
*   @param {number} [opts.w=0] The w coords of the text
*   @param {number} [opts.h=0] The h coords of the text
*   @param {Align} [opts.align=Align.Left] Alignement of the text
*   @param {number} [opts.fontSize=RPM.defaultValue(RPM.datasGame.system.dbOptions.vtSize, RPM.fontSize)] 
*   The font height used for the text
*   @param {string} [opts.fontName=RPM.defaultValue(RPM.datasGame.system.dbOptions.vtFont, RPM.fontName)]
*   The font name used for the text
*   @param {AlignVertical} [opts.verticalAlign=AlignVertical.Center] Vertical 
*   alignement of the text
*   @param {SystemColor} [opts.color=Align.Left] The color used for the text
*   @param {boolean} [opts.bold=Align.Left] If checked, make the text bold
*   @param {boolean} [opts.italic=Align.Left] If checked, make the text italic
*   @param {SystemColor} [opts.backColor=Align.Left] The background color 
*   behind the text
*   @param {SystemColor} [opts.strokeColor=Align.Left] The stroke color of the 
*   text
*/

class GraphicText extends Bitmap
{
    constructor(text = "", { x = 0, y = 0, w = 0, h = 0, align = Align.Left, 
        fontSize = RPM.defaultValue(RPM.datasGame.system.dbOptions.vtSize, RPM
        .fontSize), fontName = RPM.defaultValue(RPM.datasGame.system.dbOptions
        .vtFont, RPM.fontName), verticalAlign = AlignVertical.Center, color = 
        RPM.defaultValue(RPM.datasGame.system.dbOptions.vtcText, RPM.COLOR_WHITE
        ), bold = false, italic = false, backColor = RPM.defaultValue(RPM
        .datasGame.system.dbOptions.vtcBackground, null), strokeColor = RPM
        .defaultValue(RPM.datasGame.system.dbOptions.tOutline, false)? RPM
        .defaultValue(RPM.datasGame.system.dbOptions.vtcOutline, null) : null})
    {
        super(x, y, w, h);

        // Parameters
        this.align = align;
        this.fontName = fontName;
        this.verticalAlign = verticalAlign;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.backColor = backColor;
        this.strokeColor = strokeColor;

        this.setFontSize(fontSize);
        this.setText(RPM.defaultValue(text, ""));
    }

    // -------------------------------------------------------
    /** Set the font size and the final font
    *   @param {number} fontSize The new font size
    */
    setFontSize(fontSize)
    {
        this.fontSize = fontSize;

        // Create fonts without resizing (screen resolution) + with resize
        this.oFont = RPM.createFont(fontSize, this.fontName, this.bold, this
            .italic);
        this.font = RPM.createFont(RPM.getScreenMinXY(fontSize), this.fontName, 
        this.bold, this.italic);
    }

    // -------------------------------------------------------
    /** Set the current displayed text
    *   @param {string} text The new text
    */
    setText(text)
    {
        if (this.text !== text)
        {
            this.text = text;
            this.measureText();
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Update the context font (without window resizing), this function is
    *   used before a context.measureText
    */
    updateContextFont()
    {
        Platform.ctx.font = this.oFont;
    }

    // -------------------------------------------------------
    /** Update the context font with resizing
    */
    updateContextFontReal()
    {
        Platform.ctx.font = this.font;
    }

    // -------------------------------------------------------
    /** Measure text width and stock results in the instance
    */
    measureText()
    {
        this.updateContextFont();
        this.textWidth = Platform.ctx.measureText(this.text).width + (this
            .strokeColor === null ? 0 : 2);
        return this.textWidth;
    }

    // -------------------------------------------------------

    /** Drawing the text in choice box
    *   @param {number} [x=this.oX] The x position to draw graphic
    *   @param {number} [y=this.oY] The y position to draw graphic
    *   @param {number} [w=this.oW] The width dimention to draw graphic
    *   @param {number} [h=this.oH] The height dimention to draw graphic
    *   @param {boolean} [positionResize=true] If checked, resize postion 
    *   according to screen resolution
    */
    draw(x = this.oX, y = this.oY, w = this.oW, h = this.oH, positionResize = 
        true)
    {
        // If position resize checked, resize it
        if (positionResize)
        {
            x = RPM.getScreenX(x);
            y = RPM.getScreenY(y);
        }
        w = RPM.getScreenX(w);
        h = RPM.getScreenY(h);

        // Correcting x and y according to alignment
        let xBack = x;
        let textWidth = RPM.getScreenX(this.textWidth);
        let textHeight = RPM.getScreenY(this.fontSize + (this.strokeColor === 
            null ? 0 : 2));
        switch(this.align)
        {
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
        y += RPM.getScreenY(this.fontSize) / 3;
        switch(this.verticalAlign)
        {
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
        if (this.backColor !== null)
        {
            Platform.ctx.fillStyle = this.backColor.rgb;
            Platform.ctx.fillRect(xBack, y - textHeight, textWidth, textHeight);
        }

        // Set context options
        Platform.ctx.font = this.font;
        Platform.ctx.textAlign = this.align;
        let lineHeight = this.fontSize * 2;
        let lines = this.text.split("\n");
        let i, l = lines.length;

        // Stroke text
        let yOffset;
        if (this.strokeColor !== null)
        {
            Platform.ctx.strokeStyle = this.strokeColor.rgb;
            yOffset = 0;
            for (i = 0; i < l; i++)
            {
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
        for (i = 0; i < l; i++)
        {
            Platform.ctx.fillText(lines[i], x, y + yOffset);
            yOffset += lineHeight;
        }
    }

    // -------------------------------------------------------

    /** Drawing the text in choice box
    *   @param {number} [x=this.oX] The x position to draw graphic
    *   @param {number} [y=this.oY] The y position to draw graphic
    *   @param {number} [w=this.oW] The width dimention to draw graphic
    *   @param {number} [h=this.oH] The height dimention to draw graphic
    */
    drawInformations(x = this.oX, y = this.oY, w = this.oW, h = this.oH)
    {
        this.draw(x, y, w, h);
    }
}
