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
//  CLASS GraphicMessage : Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for message show text command.
*   @extends Bitmap
*/
function GraphicMessage(message, facesetID) {
    Bitmap.call(this);

    this.message = message;
    this.faceset = Picture2D.createImage($datasGame.pictures.get(PictureKind
        .Facesets, facesetID), PictureKind.Facesets);
    this.graphics = [];
    this.positions = [];
    this.setMessage(this.message);
}

// -------------------------------------------------------

GraphicMessage.prototype = Object.create(Bitmap.prototype);

// -------------------------------------------------------

GraphicMessage.prototype.setMessage = function(message) {
    var i, l, c, cr, lastC, ll, root, ch, tag, node, currentNode, open,
        notClosed, tagKind, split;

    this.tree = new Tree(null);
    root = this.tree.root;
    currentNode = root;
    lastC = 0;
    notClosed = [];
    for (c = 0, ll = message.length; c < ll; c++) {
        ch = message.charAt(c);

        if (ch === RPM.STRING_NEW_LINE) {
            // If text before..
            if (c > lastC) {
                currentNode = this.updateTag(currentNode, TagKind.Text, message
                    .substring(lastC, c), true, notClosed)
            }

            lastC = c + 1;
            currentNode = this.updateTag(currentNode, TagKind.NewLine, null,
                true, notClosed)
        } else if (ch === RPM.STRING_BRACKET_LEFT) {
            open = message.charAt(c + 1) !== RPM.STRING_SLASH;

            // If text before..
            if (c > lastC) {
                currentNode = this.updateTag(currentNode, TagKind.Text, message
                    .substring(lastC, c), true, notClosed);
            }

            cr = c;
            do {
                cr++;
                ch = message.charAt(cr);
            } while (cr < ll && ch !== RPM.STRING_BRACKET_RIGHT);
            tag = message.substring(c + (open ? 1 : 2), cr);
            if (tag === RPM.TAG_BOLD) {
                tagKind = TagKind.Bold;
            } else if (tag === RPM.TAG_ITALIC) {
                tagKind = TagKind.Italic;
            } else if (tag === RPM.TAG_LEFT) {
                tagKind = TagKind.Left;
            } else if (tag === RPM.TAG_CENTER) {
                tagKind = TagKind.Center;
            } else if (tag === RPM.TAG_RIGHT) {
                tagKind = TagKind.Right;
            } else if (tag.includes(RPM.TAG_SIZE)) {
                tagKind = TagKind.Size;
            } else if (tag.includes(RPM.TAG_FONT)) {
                tagKind = TagKind.Font;
            } else if (tag.includes(RPM.TAG_TEXT_COLOR)) {
                tagKind = TagKind.TextColor;
            } else if (tag.includes(RPM.TAG_BACK_COLOR)) {
                tagKind = TagKind.BackColor;
            } else if (tag.includes(RPM.TAG_STROKE_COLOR)) {
                tagKind = TagKind.StrokeColor;
            } else if (tag.includes(RPM.TAG_VARIABLE)) {
                tagKind = TagKind.Variable;
            } else if (tag.includes(RPM.TAG_PARAMETER)) {
                tagKind = TagKind.Parameter;
            } else if (tag.includes(RPM.TAG_PROPERTY)) {
                tagKind = TagKind.Property;
            } else if (tag.includes(RPM.TAG_HERO_NAME)) {
                tagKind = TagKind.HeroName;
            } else if (tag.includes(RPM.TAG_ICON)) {
                tagKind = TagKind.Icon;
            } else {
                tagKind = TagKind.Text;
            }
            if (tagKind === TagKind.Text) {
                currentNode = this.updateTag(currentNode, TagKind.Text, message
                    .substring(c, cr + 1), true, notClosed);
            } else {
                split = tag.split(RPM.STRING_EQUAL);
                currentNode = this.updateTag(currentNode, tagKind, open && split
                    .length > 1 ? parseInt(split[1]) : null, open, notClosed);
            }

            lastC = cr + 1;
            c = cr;
        }
    }
    if (ll === 0 || c > lastC) {
        currentNode = this.updateTag(currentNode, TagKind.Text, message
            .substring(lastC, c), true, notClosed);
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.updateTag = function(currentNode, tag, value, open,
    notClosed)
{
    if (open) {
        var i;

        for (i = notClosed.length - 1; i >= 0; i--) {
            currentNode = currentNode.add(notClosed[i]);
            notClosed.splice(i, 1);
        }
        switch (tag) {
        case TagKind.Variable:
        case TagKind.HeroName:
            value = SystemValue.createVariable(value); break;
        case TagKind.Parameter:
            value = SystemValue.createParameter(value); break;
        case TagKind.Property:
            value = SystemValue.createProperty(value); break;
        }
        currentNode.add([tag, value]);
        if (tag !== TagKind.Text && tag !== TagKind.NewLine && tag !== TagKind
            .Variable)
        {
            currentNode = currentNode.lastChild;
        }
    } else {
        while (currentNode !== null && currentNode.data !== null && currentNode
            .data[0] !== tag)
        {
            notClosed.push(currentNode.data);
            currentNode = currentNode.parent;
        }
        currentNode = currentNode.parent;
    }

    return currentNode;
}

// -------------------------------------------------------

GraphicMessage.prototype.update = function() {
    var i, c, l, result, align, currentAlign, width;

    this.graphics = [];
    this.positions = [];
    this.heights = [];
    this.aligns = [];
    this.heights.push(0);
    result = {
        g: this.graphics,
        p: this.positions,
        a: this.aligns,
        h: this.heights,
        ca: Align.Left,
        cb: false,
        ci: false,
        cs: RPM.defaultValue($datasGame.system.dbOptions.vtSize, $fontSize),
        cf: RPM.defaultValue($datasGame.system.dbOptions.vtFont, $fontName),
        ctc: RPM.defaultValue($datasGame.system.dbOptions.vtcText, RPM.COLOR_WHITE),
        cbc: RPM.defaultValue($datasGame.system.dbOptions.vtcBackground, null),
        csc: RPM.defaultValue($datasGame.system.dbOptions.vtOutline, false) ? RPM
            .defaultValue($datasGame.system.dbOptions.vtcOutline, null) : null
    };

    // Update nodes
    this.updateNodes(this.tree.root.firstChild, result);

    // Calculate width of align blocks for aligns settings
    l = this.graphics.length;
    this.totalWidths = [];
    for (i = 0; i < l; i++) {
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
};

// -------------------------------------------------------

GraphicMessage.prototype.updateNodes = function(node, result) {
    var graphic, align, bold, italic, size, font, textColor, backColor,
        strokeColor, tag, value;

    tag = node.data[0];
    value = node.data[1];
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
    case TagKind.HeroName:
        var text;

        switch (node.data[0]) {
        case TagKind.Text:
            text = value; break;
        case TagKind.Variable:
            text = "" + value.getValue(); break;
        case TagKind.Parameter:
            text = "" + value.getValue(); break;
        case TagKind.Property:
            text = "" + value.getValue(); break;
        case TagKind.HeroName:
            text = "" + $game.getHeroByInstanceID(value.getValue()).name; break;
        }
        graphic = new GraphicText(text, { bold: result.cb, italic:
            result.ci, fontSize: result.cs, fontName: result.cf, color: result
            .ctc, backColor: result.cbc, strokeColor: result.csc } );
        result.g.push(graphic);
        result.p.push(graphic.measureText());
        result.a.push(result.ca);
        if (graphic.fontSize > result.h[0]) {
            result.h[0] = graphic.fontSize;
        }
        break;
    case TagKind.Icon:
        graphic = $datasGame.pictures.get(PictureKind.Icons, value).picture;
        result.g.push(graphic);
        result.p.push(graphic.oW);
        result.a.push(result.ca);
        if ($fontSize > result.h[0]) {
            result.h[0] = $fontSize;
        }
        break;
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
        result.cs = $datasGame.system.fontSizes[value].getValue();
        break;
    case TagKind.Font:
        font = result.cf;
        result.cf = $datasGame.system.fontNames[value].getValue();
        break;
    case TagKind.TextColor:
        textColor = result.ctc;
        result.ctc = $datasGame.system.colors[value];
        break;
    case TagKind.BackColor:
        backColor = result.cbc;
        result.cbc = $datasGame.system.colors[value];
        break;
    case TagKind.StrokeColor:
        strokeColor = result.csc;
        result.csc = $datasGame.system.colors[value];
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

// -------------------------------------------------------

GraphicMessage.prototype.drawBehind = function(x, y, w, h) {
    if (!$datasGame.system.dbOptions.vfPosAbove) {
        this.drawFaceset(x, y, w, h);
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.drawFaceset = function(x, y, w, h) {
    this.faceset.draw(x + RPM.defaultValue($datasGame.system.dbOptions.fX, 0),
        y - ((this.faceset.oH - h) / 2) + RPM.defaultValue($datasGame.system
        .dbOptions.fY, 0));
}

// -------------------------------------------------------

GraphicMessage.prototype.draw = function(x, y, w, h) {
    var i, j, c, l, newX, offsetX, offsetY, align, graphic;

    x = RPM.defaultValue(x, this.oX);
    y = RPM.defaultValue(y, this.oY);
    w = RPM.defaultValue(w, this.oW);
    h = RPM.defaultValue(h, this.oH);

    if ($datasGame.system.dbOptions.vfPosAbove) {
        this.drawFaceset(x, y, w, h);
    }
    newX = x + this.faceset.oW + RPM.HUGE_SPACE;
    offsetY = RPM.HUGE_SPACE;
    align = -1;
    c = this.heights.length - 1;
    j = 0;

    // Draw each graphics
    for (i = 0, l = this.graphics.length; i < l; i ++) {
        graphic = this.graphics[i];

        // New line
        if (graphic === null) {
            offsetY += this.heights[c--] * 2;
            align = -1;
        } else {
            if (align !== this.aligns[i]) {
                align = this.aligns[i];
                switch (align) {
                case Align.Left:
                    offsetX = 0;
                    break;
                case Align.Center:
                    offsetX = (w - newX - this.totalWidths[j]) / 2;
                    break;
                case Align.Right:
                    offsetX = x + w - newX - this.totalWidths[j];
                    break;
                }
                j++;
            }
            graphic.draw(newX + offsetX, y + offsetY - (graphic.path ? graphic
                .oH / 2 : 0));
            offsetX += this.positions[i];
        }
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.drawInformations = function(x, y, w, h) {
    this.draw(x, y, w, h);
};
