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

    this.message = message;
    this.faceset = Picture2D.createImage($datasGame.pictures.get(PictureKind
        .Facesets, facesetID), PictureKind.Facesets);
    this.graphics = [];
    this.positions = [];
    this.setMessage(message);
}

// -------------------------------------------------------

GraphicMessage.prototype = Object.create(Bitmap.prototype);

// -------------------------------------------------------

GraphicMessage.prototype.setMessage = function(message) {
    var i, l, c, cr, lastC, ll, lines, line, tree, root, ch, tag, node, currentNode, open;

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

                } else if (tag === RPM.TAG_LEFT) {
                    currentNode = this.updateTag(currentNode,TagKind.Left, null,
                        open);
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
        do {
            currentNode = currentNode.parent;
        } while (currentNode !== null && currentNode.data !== null &&
            currentNode.data[0] !== tag);
    }

    return currentNode;
}

// -------------------------------------------------------

GraphicMessage.prototype.update = function() {
    var i, l, graphics, positions, height, node, datas, graphic, result;

    l = this.lines.length;
    this.graphics = new Array(l);
    this.positions = new Array(l);
    this.heights = new Array(l);
    for (i = 0; i < l; i++) {
        graphics = [];
        positions = [];
        result = {
            g: graphics,
            p: positions,
            h: $fontSize,
            a: Align.Left
        };

        node = this.lines[i].root.firstChild;
        this.updateNodes(node, result);

        this.graphics[i] = graphics;
        this.positions[i] = positions;
        this.heights[i] = result.h;
    }
};

// -------------------------------------------------------

GraphicMessage.prototype.updateNodes = function(node, result) {
    var graphic;

    switch (node.data[0]) {
    case TagKind.Text:
        graphic = new GraphicText(node.data[1], Align.Left);
        result.g.push(graphic);
        result.p.push(graphic.measureText());
        if (graphic.fontSize > result.h) {
            result.h = graphic.fontSize;
        }
        break;
    case TagKind.Left:
        result.a = Align.left;
        break;
    }
    if (node.firstChild !== null) {
        this.updateNodes(node.firstChild, result);
    } else if (node.next !== null) {
        this.updateNodes(node.next, result);
    }
}

// -------------------------------------------------------

GraphicMessage.prototype.draw = function(x, y, w, h) {
    var i, j, l, ll, newX, offsetX, offsetY, graphics, positions;

    x = RPM.defaultValue(x, this.oX);
    y = RPM.defaultValue(y, this.oY);
    w = RPM.defaultValue(w, this.oW);
    h = RPM.defaultValue(h, this.oH);

    this.faceset.draw(x, y - ((this.faceset.oH - h) / 2));
    newX = x + this.faceset.w + RPM.HUGE_SPACE;
    offsetY = 0;

    // Draw each lines
    for (i = 0, l = this.graphics.length; i < l; i ++) {
        offsetX = 0;
        graphics = this.graphics[i];
        positions = this.positions[i];
        for (j = 0, ll = graphics.length; j < ll; j++) {
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
