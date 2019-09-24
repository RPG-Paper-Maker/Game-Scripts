/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

    //this.message = message;
    this.message = "[font=1]Size\nENcor[/font]e";
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
    var i, l, c, cr, lastC, ll, root, ch, tag, node,
        currentNode, open;

    this.tree = new Tree(null);
    root = this.tree.root;
    currentNode = root;
    lastC = 0;
    for (c = 0, ll = message.length; c < ll; c++) {
        ch = message.charAt(c);

        if (ch === RPM.STRING_NEW_LINE) {
            // If text before..
            if (c > lastC) {
                currentNode.add([TagKind.Text, message.substring(lastC, c)]);
            }

            lastC = c + 1;
            currentNode.add([TagKind.NewLine, null]);
        } else if (ch === RPM.STRING_BRACKET_LEFT) {
            open = message.charAt(c + 1) !== RPM.STRING_SLASH;

            // If text before..
            if (c > lastC) {
                currentNode.add([TagKind.Text, message.substring(lastC, c)]);
            }

            cr = c;
            do {
                cr++;
                ch = message.charAt(cr);
            } while (cr < ll && ch !== RPM.STRING_BRACKET_RIGHT);
            tag = message.substring(c + (open ? 1 : 2), cr);
            if (tag === RPM.TAG_BOLD) {
                currentNode = this.updateTag(currentNode, TagKind.Bold, null
                    , open);
            } else if (tag === RPM.TAG_ITALIC) {
                currentNode = this.updateTag(currentNode, TagKind.Italic, null
                    , open);
            } else if (tag === RPM.TAG_LEFT) {
                currentNode = this.updateTag(currentNode, TagKind.Left, null
                    , open);
            } else if (tag === RPM.TAG_CENTER) {
                currentNode = this.updateTag(currentNode, TagKind.Center,
                    null, open);
            } else if (tag === RPM.TAG_RIGHT) {
                currentNode = this.updateTag(currentNode, TagKind.Right,
                    null, open);
            } else if (tag.includes(RPM.TAG_SIZE)) {
                currentNode = this.updateTag(currentNode, TagKind.Size, open ?
                    parseInt(tag.split(RPM.STRING_EQUAL)[1]) : null, open);
            } else if (tag.includes(RPM.TAG_FONT)) {
                currentNode = this.updateTag(currentNode, TagKind.Font, open ?
                    parseInt(tag.split(RPM.STRING_EQUAL)[1]) : null, open);
            } else {
                currentNode.add([TagKind.Text, message.substring(c, cr + 1)]);
            }

            lastC = cr + 1;
            c = cr;
        }
    }
    if (ll === 0 || c > lastC) {
        currentNode.add([TagKind.Text, message.substring(lastC, c)]);
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.updateTag = function(currentNode, tag, value, open) {
    if (open) {
        currentNode.add([tag, value]);
        if (tag !== TagKind.Text) {
            currentNode = currentNode.lastChild;
        }
    } else {
        while (currentNode !== null && currentNode.data !== null && currentNode
            .data[0] !== tag)
        {
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
        cs: $fontSize,
        cf: $fontName
    };

    // Update nodes
    this.updateNodes(this.tree.root.firstChild, result);

    // Calculate width of align blocks for aligns settings
    l = this.graphics.length;
    this.totalWidths = new Array(l);
    for (i = 0; i < l; i++) {
        align = this.aligns[i];
        currentAlign = align;
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
        while (i < c) {
            this.totalWidths[i] = width;
            i++;
        }
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.updateNodes = function(node, result) {
    var graphic, align, bold, italic, size, font;

    switch (node.data[0]) {
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
        graphic = new GraphicText(node.data[1], { bold: result.cb, italic:
            result.ci, fontSize: result.cs, fontName: result.cf } );
        result.g.push(graphic);
        result.p.push(graphic.measureText());
        result.a.push(result.ca);
        if (graphic.fontSize > result.h[0]) {
            result.h[0] = graphic.fontSize;
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
        result.cs = $datasGame.system.fontSizes[node.data[1]].getValue();
        break;
    case TagKind.Font:
        font = result.cf;
        result.cf = $datasGame.system.fontNames[node.data[1]].getValue();
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
    }
    // Go next if possible
    if (node.next !== null) {
        this.updateNodes(node.next, result);
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.draw = function(x, y, w, h) {
    var i, c, l, newX, offsetX, offsetY, align, graphic;

    x = RPM.defaultValue(x, this.oX);
    y = RPM.defaultValue(y, this.oY);
    w = RPM.defaultValue(w, this.oW);
    h = RPM.defaultValue(h, this.oH);

    this.faceset.draw(x, y - ((this.faceset.oH - h) / 2));
    newX = x + this.faceset.oW + RPM.HUGE_SPACE;
    offsetY = RPM.HUGE_SPACE;
    align = -1;
    c = this.heights.length - 1;

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
                    offsetX = (w - newX - this.totalWidths[i]) / 2;
                    break;
                case Align.Right:
                    offsetX = x + w - newX - this.totalWidths[i];
                    break;
                }
            }
            graphic.draw(newX + offsetX, y + offsetY);
            offsetX += this.positions[i];
        }
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.drawInformations = function(x, y, w, h) {
    this.draw(x, y, w, h);
};
