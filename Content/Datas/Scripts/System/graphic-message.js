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
    this.message = "[l]left[/l][c]hello[b]test[/b][/c][r]right[/r]";
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
    var i, l, c, cr, lastC, ll, lines, line, tree, root, ch, tag, node,
        currentNode, open;

    lines = message.split("\n");
    l = lines.length;
    this.lines = new Array(l);
    for (i = 0; i < l; i++) {
        tree = new Tree(null);
        root = tree.root;
        currentNode = root;
        line = lines[i];
        lastC = 0;
        for (c = 0, ll = line.length; c < ll; c++) {
            ch = line.charAt(c);
            if (ch === RPM.STRING_BRACKET_LEFT) {
                open = line.charAt(c + 1) !== RPM.STRING_SLASH;

                // If text before..
                if (c > lastC) {
                    currentNode.add([TagKind.Text, line.substring(lastC, c)]);
                }

                cr = c;
                do {
                    cr++;
                    ch = line.charAt(cr);
                } while (cr < ll && ch !== RPM.STRING_BRACKET_RIGHT);
                tag = line.substring(c + (open ? 1 : 2), cr);
                if (tag === RPM.TAG_BOLD) {
                    currentNode = this.updateTag(currentNode, TagKind.Bold, null
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
                } else {
                    currentNode.add([TagKind.Text, line.substring(c, cr + 1)]);
                }

                lastC = cr + 1;
                c = cr;
            }
        }
        if (c > lastC) {
            currentNode.add([TagKind.Text, line.substring(lastC, c)]);
        }

        this.lines[i] = tree;
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
    var i, j, c, l, ll, graphics, positions, aligns, height, node, datas,
        graphic, result, totalWidths, align, currentAlign, width;

    l = this.lines.length;
    this.graphics = new Array(l);
    this.positions = new Array(l);
    this.heights = new Array(l);
    this.aligns = new Array(l);
    this.totalWidths = new Array(l);
    for (i = 0; i < l; i++) {
        graphics = [];
        positions = [];
        aligns = [];
        result = {
            g: graphics,
            p: positions,
            a: aligns,
            h: 0,
            ca: Align.Left
        };

        node = this.lines[i].root.firstChild;
        this.updateNodes(node, result);

        // Stock results
        this.graphics[i] = graphics;
        this.positions[i] = positions;
        this.aligns[i] = aligns;
        this.heights[i] = result.h === 0 ? $fontSize : result.h;

        // Calculate width of align blocks for aligns settings
        ll = graphics.length;
        totalWidths = new Array(l);
        for (j = 0; j < ll; j++) {
            align = aligns[j];
            currentAlign = align;
            c = j;
            width = 0;
            while (c < ll) {
                align = aligns[c];
                if (align !== currentAlign) {
                    c--;
                    break;
                }
                width += positions[c];
                c++;
            }
            while (j < c) {
                totalWidths[j] = width;
                j++;
            }
        }
        this.totalWidths[i] = totalWidths;
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.updateNodes = function(node, result) {
    var graphic, align;

    switch (node.data[0]) {
    case TagKind.Text:
        graphic = new GraphicText(node.data[1], Align.Left);
        result.g.push(graphic);
        result.p.push(graphic.measureText());
        result.a.push(result.ca);
        if (graphic.fontSize > result.h) {
            result.h = graphic.fontSize;
        }
        break;
    case TagKind.Bold:
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
    }
    if (node.firstChild !== null) {
        this.updateNodes(node.firstChild, result);
    }
    if (node.next !== null) {
        this.updateNodes(node.next, result);
    }
    switch (node.data[0]) {
    case TagKind.Left:
    case TagKind.Center:
    case TagKind.Right:
        result.ca = align;
        break;
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.draw = function(x, y, w, h) {
    var i, j, l, ll, newX, offsetX, offsetY, graphics, positions, aligns,
        totalWidths, align;

    x = RPM.defaultValue(x, this.oX);
    y = RPM.defaultValue(y, this.oY);
    w = RPM.defaultValue(w, this.oW);
    h = RPM.defaultValue(h, this.oH);

    this.faceset.draw(x, y - ((this.faceset.oH - h) / 2));
    newX = x + this.faceset.oW + RPM.HUGE_SPACE;
    offsetY = 0;

    // Draw each lines
    for (i = 0, l = this.graphics.length; i < l; i ++) {
        offsetX = 0;
        align = -1;
        graphics = this.graphics[i];
        positions = this.positions[i];
        aligns = this.aligns[i];
        totalWidths = this.totalWidths[i];
        for (j = 0, ll = graphics.length; j < ll; j++) {
            if (align !== aligns[j]) {
                align = aligns[j];
                switch (align) {
                case Align.Left:
                    offsetX = 0;
                    break;
                case Align.Center:
                    offsetX = (w - newX - totalWidths[j]) / 2;
                    break;
                case Align.Right:
                    offsetX = x + w - newX - totalWidths[j];
                    break;
                }
            }
            graphics[j].draw(newX + offsetX, y + offsetY);
            offsetX += positions[j];
        }
        offsetY += this.heights[i] * 2;
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.drawInformations = function(x, y, w, h) {
    this.draw(x, y, w, h);
};
