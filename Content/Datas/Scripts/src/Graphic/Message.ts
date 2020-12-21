/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Bitmap, Picture2D, Tree, Node } from "../Core";
import { Datas, System, Graphic, Manager } from "..";
import { Enum, Constants, Utils, ScreenResolution } from "../Common";
import PictureKind = Enum.PictureKind;
import TagKind = Enum.TagKind;
import Align = Enum.Align;

/** @class
 *  A class for message show text command.
 *  @extends Bitmap
 *  @param {string} message The complete text to parse
 *  @param {number} facesetID The faceset picture ID
 */
class Message extends Graphic.Base {

    public static readonly TAG_BOLD = "b";
    public static readonly TAG_ITALIC = "i";
    public static readonly TAG_LEFT = "l";
    public static readonly TAG_CENTER = "c";
    public static readonly TAG_RIGHT = "r";
    public static readonly TAG_SIZE = "size";
    public static readonly TAG_FONT = "font";
    public static readonly TAG_TEXT_COLOR = "textcolor";
    public static readonly TAG_BACK_COLOR = "backcolor";
    public static readonly TAG_STROKE_COLOR = "strokecolor";
    public static readonly TAG_VARIABLE = "var";
    public static readonly TAG_PARAMETER = "par";
    public static readonly TAG_PROPERTY = "pro";
    public static readonly TAG_HERO_NAME = "hname";
    public static readonly TAG_ICON = "ico";

    public message: string;
    public faceset: Picture2D;
    public graphics: Bitmap[];
    public positions: number[];
    public tree: Tree;
    public heights: number[];
    public aligns: Align[];
    public totalWidths: number[];
        
    constructor(message: string, facesetID: number) {
        super();

        this.message = message;
        this.faceset = Datas.Pictures.getPictureCopy(PictureKind.Facesets, 
            facesetID);
        this.graphics = [];
        this.positions = [];
        this.setMessage(this.message);
    }

    /** 
     *  Set message (parse).
     *  @param {string} message The message to parse
     */
    setMessage(message: string) {
        this.tree = new Tree(null);
        let root = this.tree.root;
        let currentNode = root;
        let lastC = 0;
        let notClosed = [];
        let c: number, l: number, ch: string, open: boolean, cr: number, tag: 
            string, tagKind: TagKind, split: string[];
        for (c = 0, l = message.length; c < l; c++) {
            ch = message.charAt(c);
            if (ch === Constants.STRING_NEW_LINE) {
                // If text before..
                if (c > lastC) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, 
                        message.substring(lastC, c), true, notClosed);
                }
                lastC = c + 1;
                currentNode = this.updateTag(currentNode, TagKind.NewLine, null,
                    true, notClosed);
            } else if (ch === Constants.STRING_BRACKET_LEFT) {
                open = message.charAt(c + 1) !== Constants.STRING_SLASH;

                // If text before..
                if (c > lastC) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, 
                        message.substring(lastC, c), true, notClosed);
                }
                cr = c;
                do {
                    cr++;
                    ch = message.charAt(cr);
                } while (cr < l && ch !== Constants.STRING_BRACKET_RIGHT);
                tag = message.substring(c + (open ? 1 : 2), cr);
                if (tag === Message.TAG_BOLD) {
                    tagKind = TagKind.Bold;
                } else if (tag === Message.TAG_ITALIC) {
                    tagKind = TagKind.Italic;
                } else if (tag === Message.TAG_LEFT) {
                    tagKind = TagKind.Left;
                } else if (tag === Message.TAG_CENTER) {
                    tagKind = TagKind.Center;
                } else if (tag === Message.TAG_RIGHT) {
                    tagKind = TagKind.Right;
                } else if (tag.includes(Message.TAG_SIZE)) {
                    tagKind = TagKind.Size;
                } else if (tag.includes(Message.TAG_FONT)) {
                    tagKind = TagKind.Font;
                } else if (tag.includes(Message.TAG_TEXT_COLOR)) {
                    tagKind = TagKind.TextColor;
                } else if (tag.includes(Message.TAG_BACK_COLOR)) {
                    tagKind = TagKind.BackColor;
                } else if (tag.includes(Message.TAG_STROKE_COLOR)) {
                    tagKind = TagKind.StrokeColor;
                } else if (tag.includes(Message.TAG_VARIABLE)) {
                    tagKind = TagKind.Variable;
                } else if (tag.includes(Message.TAG_PARAMETER)) {
                    tagKind = TagKind.Parameter;
                } else if (tag.includes(Message.TAG_PROPERTY)) {
                    tagKind = TagKind.Property;
                } else if (tag.includes(Message.TAG_HERO_NAME)) {
                    tagKind = TagKind.HeroName;
                } else if (tag.includes(Message.TAG_ICON)) {
                    tagKind = TagKind.Icon;
                } else {
                    tagKind = TagKind.Text;
                }
                if (tagKind === TagKind.Text) {
                    currentNode = this.updateTag(currentNode, TagKind.Text, 
                        message.substring(c, cr + 1), true, notClosed);
                } else {
                    split = tag.split(Constants.STRING_EQUAL);
                    currentNode = this.updateTag(currentNode, tagKind, open && 
                        split.length > 1 ? split[1] : null, open, notClosed);
                }
                lastC = cr + 1;
                c = cr;
            }
        }
        if (l === 0 || c > lastC) {
            currentNode = this.updateTag(currentNode, TagKind.Text, message
                .substring(lastC, c), true, notClosed);
        }
    }
    
    /** 
     *  Update tag.
     *  @param {Node} currentNode The current node
     *  @param {TagKind} tag The tag kind
     *  @param {string} value The tag value
     *  @param {boolean} open Indicate if open tag
     *  @param {Node[]} notClosed List of unclosed nodes
     *  @returns {Node} 
     */
    updateTag(currentNode: Node, tag: TagKind, value: string, open: boolean, 
        notClosed: Node[]): Node
    {
        if (open) {
            for (let i = notClosed.length - 1; i >= 0; i--) {
                currentNode = currentNode.add(notClosed[i]);
                notClosed.splice(i, 1);
            }
            let nodeValue = <any> value;
            switch (tag) {
            case TagKind.Variable:
            case TagKind.HeroName:
                nodeValue = System.DynamicValue.createVariable(parseInt(value));
                break;
            case TagKind.Parameter:
                nodeValue = System.DynamicValue.createParameter(parseInt(value));
                break;
            case TagKind.Property:
                nodeValue = System.DynamicValue.createProperty(parseInt(value));
                break;
            }
            currentNode.add([tag, nodeValue]);
            if (tag !== TagKind.Text && tag !== TagKind.NewLine && tag !== 
                TagKind.Variable && tag !== TagKind.Icon && tag !== TagKind
                .Property && tag !== TagKind.Parameter && tag !== TagKind
                .HeroName)
            {
                currentNode = currentNode.lastChild;
            }
        } else {
            while (currentNode !== null && currentNode.data !== null && 
                currentNode.data[0] !== tag)
            {
                notClosed.push(currentNode.data);
                currentNode = currentNode.parent;
            }
            currentNode = currentNode.parent;
        }
        return currentNode;
    }
    
    /** 
     *  Update all.
     */
    update() {
        this.graphics = [];
        this.positions = [];
        this.heights = [];
        this.aligns = [];
        this.heights.push(0);
        let result = {
            g: this.graphics,
            p: this.positions,
            a: this.aligns,
            h: this.heights,
            ca: Align.Left,
            cb: false,
            ci: false,
            cs: Utils.defaultValue(Datas.Systems.dbOptions.v_tSize, Constants
                .DEFAULT_FONT_SIZE),
            cf: Utils.defaultValue(Datas.Systems.dbOptions.v_tFont, Constants
                .DEFAULT_FONT_NAME),
            ctc: Utils.defaultValue(Datas.Systems.dbOptions.v_tcText, System
                .Color.WHITE),
            cbc: Utils.defaultValue(Datas.Systems.dbOptions.v_tcBackground, null),
            csc: Utils.defaultValue(Datas.Systems.dbOptions.v_tOutline, false) ? 
                Utils.defaultValue(Datas.Systems.dbOptions.v_tcOutline, null) : 
                null
        };
    
        // Update nodes
        this.updateNodes(this.tree.root.firstChild, result);
    
        // Calculate width of align blocks for aligns settings
        this.totalWidths = [];
        let currentAlign: Align, c: number, width: number, align: Align;
        for (let i = 0, l = this.graphics.length; i < l; i++) {
            currentAlign = this.aligns[i];
            c = i;
            width = 0;
            while (c < l) {
                align = this.aligns[c];
                if (align !== currentAlign) {
                    break;
                }
                width += this.positions[c];
                c++;
            }
            this.totalWidths.push(width);
            i = c - 1;
        }
    }
    
    /** 
     *  Update the nodes.
     *  @param {Node} node The current node
     *  @param {Record<string, any>} result The result object
     */
    updateNodes(node: Node, result: Record<string, any>)
    {
        let tag = node.data[0];
        let value = node.data[1];
        let bold: boolean, italic: boolean, align: Align, size: number, font: 
            string, textColor: System.Color, backColor: System.Color, 
            strokeColor: System.Color;
        switch (tag) {
        case TagKind.NewLine:
            result.g.push(null);
            result.p.push(0);
            result.a.push(-1);
            if (result.h[0] === 0) {
                result.h[0] = result.cs;
            }
            result.h.unshift(0);
            break;
        case TagKind.Text:
        case TagKind.Variable:
        case TagKind.Parameter:
        case TagKind.Property:
        case TagKind.HeroName: {
            let text: string;
            switch (node.data[0]) {
            case TagKind.Text:
                text = value;
                break;
            case TagKind.Variable:
                text = Utils.numToString(value.getValue());
                break;
            case TagKind.Parameter:
                text = Utils.numToString(value.getValue());
                break;
            case TagKind.Property:
                text = Utils.numToString(value.getValue());
                break;
            case TagKind.HeroName:
                text = Manager.Stack.game.getHeroByInstanceID(value.getValue())
                    .name;
                break;
            }
            let graphic = new Graphic.Text(text, 
                {
                    bold: result.cb,
                    italic: result.ci,
                    fontSize: result.cs,
                    fontName: result.cf,
                    color: result.ctc,
                    backColor: result.cbc,
                    strokeColor: result.csc
                }
            );
            result.g.push(graphic);
            result.p.push(graphic.measureText());
            result.a.push(result.ca);
            if (graphic.fontSize > result.h[0]) {
                result.h[0] = graphic.fontSize;
            }
            break;
        }
        case TagKind.Icon: {
            let graphic = Datas.Pictures.getPictureCopy(PictureKind.Icons, value);
            result.g.push(graphic);
            result.p.push(graphic.oW);
            result.a.push(result.ca);
            if (Constants.DEFAULT_FONT_SIZE > result.h[0]) {
                result.h[0] = Constants.DEFAULT_FONT_SIZE;
            }
            break;
        }
        case TagKind.Bold:
            bold = result.cb;
            result.cb = true;
            break;
        case TagKind.Italic:
            italic = result.ci;
            result.ci = true;
            break;
        case TagKind.Left:
            align = result.ca;
            result.ca = Align.Left;
            break;
        case TagKind.Center:
            align = result.ca;
            result.ca = Align.Center;
            break;
        case TagKind.Right:
            align = result.ca;
            result.ca = Align.Right;
            break;
        case TagKind.Size:
            size = result.cs;
            result.cs = Datas.Systems.getFontSize(value).getValue();
            break;
        case TagKind.Font:
            font = result.cf;
            result.cf = Datas.Systems.getFontName(value).getValue();
            break;
        case TagKind.TextColor:
            textColor = result.ctc;
            result.ctc = Datas.Systems.getColor(value);
            break;
        case TagKind.BackColor:
            backColor = result.cbc;
            result.cbc = Datas.Systems.getColor(value);
            break;
        case TagKind.StrokeColor:
            strokeColor = result.csc;
            result.csc = Datas.Systems.getColor(value);
            break;
        }
        if (node.firstChild !== null) {
            this.updateNodes(node.firstChild, result);
        }
        // Handle closures
        switch (node.data[0]) {
        case TagKind.Bold:
            result.cb = bold;
            break;
        case TagKind.Italic:
            result.ci = italic;
            break;
        case TagKind.Left:
        case TagKind.Center:
        case TagKind.Right:
            result.ca = align;
            break;
        case TagKind.Size:
            result.cs = size;
            break;
        case TagKind.Font:
            result.cf = font;
            break;
        case TagKind.TextColor:
            result.ctc = textColor;
            break;
        case TagKind.BackColor:
            result.cbc = backColor;
            break;
        case TagKind.StrokeColor:
            result.csc = strokeColor;
            break;
        }
        // Go next if possible
        if (node.next !== null) {
            this.updateNodes(node.next, result);
        }
    }
    
    /** 
     *  Drawing the faceset behind.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawBehind(x: number, y: number, w: number, h: number) {
        if (!Datas.Systems.dbOptions.v_fPosAbove) {
            this.drawFaceset(x, y, w, h);
        }
    }
    
    /** 
     *  Drawing the faceset.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawFaceset(x: number, y: number, w: number, h: number) {
        this.faceset.draw(x + Utils.defaultValue(Datas.Systems.dbOptions.v_fX, 0
            ), y - ((this.faceset.oH - h) / 2) + Utils.defaultValue(Datas
            .Systems.dbOptions.v_fX, 0));
    }
    
    /** 
     *  Drawing the message box.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x: number = this.oX, y: number = this.oY, w: number = this.oW, h: 
        number = this.oH, positionResize: boolean = true)
    {
        this.draw(x, y, w, h, positionResize);
    }

    /** 
     *  Drawing the message.
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
        if (Datas.Systems.dbOptions.v_fPosAbove) {
            this.drawFaceset(x, y, w, h);
        }
        let newX = ScreenResolution.getScreenX(x + this.faceset.oW + Constants
            .HUGE_SPACE);
        let newY = ScreenResolution.getScreenY(y + Constants.HUGE_SPACE);
        let offsetY = 0;
        let align = Align.None;
        let c = this.heights.length - 1;

        // Draw each graphics
        let graphic: Bitmap, offsetX: number;
        for (let i = 0, j = 0, l = this.graphics.length; i < l; i ++) {
            graphic = this.graphics[i];
    
            // New line
            if (graphic === null) {
                offsetY += ScreenResolution.getScreenMinXY(this.heights[c--] * 2);
                align = Align.None;
                j++;
            } else {
                if (align !== this.aligns[i]) {
                    align = this.aligns[i];
                    switch (align) {
                    case Align.Left:
                        offsetX = 0;
                        break;
                    case Align.Center:
                        offsetX = (ScreenResolution.getScreenX(w) - 
                            ScreenResolution.getScreenMinXY(this.totalWidths[j])
                            - newX) / 2;
                        break;
                    case Align.Right:
                        offsetX = ScreenResolution.getScreenX(w) - 
                            ScreenResolution.getScreenMinXY(this.totalWidths[j])
                            - newX;
                        break;
                    }
                    j++;
                }
                if (graphic instanceof Picture2D) {
                    graphic.draw(newX + offsetX, newY - (graphic.h / 2) + 
                        offsetY,  graphic.oW, graphic.oH, 0, 0, graphic.oW, 
                        graphic.oH, false);
                } else {
                    (<Graphic.Base>graphic).draw(newX + offsetX, newY + offsetY,
                        graphic.oW, graphic.oH, false);
                }
                offsetX += ScreenResolution.getScreenMinXY(this.positions[i]);
            }
        }
    }
}

export { Message }