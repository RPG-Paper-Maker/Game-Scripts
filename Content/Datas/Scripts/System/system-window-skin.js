/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SystemWindowSkin
//
// -------------------------------------------------------

/** @class
*   A windowskin of the game.
*/
function SystemWindowSkin() {

}

SystemWindowSkin.prototype = {

    /** Read the JSON associated to the weapon.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.pictureID = json.pid;
        this.borderTopLeft = json.tl;
        this.borderTopRight = json.tr;
        this.borderBotLeft = json.bl;
        this.borderBotRight = json.br;
        this.borderLeft = json.l;
        this.borderRight = json.r;
        this.borderTop = json.t;
        this.borderBot = json.b;
        this.background = json.back;
        this.backgroundSelection = json.backs;
        this.backgroundRepeat = json.backr;
        this.arrowEndMessage = json.aem;
        this.arrowTargetSelection = json.ats;
        this.arrowUpDown = json.aud;
        this.textNormal = json.tn;
        this.textCritical = json.tc;
        this.textHeal = json.th;
        this.textMiss = json.tm;
    },

    // -------------------------------------------------------

    updatePicture: function() {
        this.picture = Picture2D.createImage($datasGame.pictures.get(PictureKind
            .WindowSkins, this.pictureID), PictureKind.WindowSkins);
    },

    // -------------------------------------------------------

    drawElement: function(r, x, y, w, h) {
        if (!w) {
            w = r[2];
        }
        if (!h) {
            h = r[3];
        }

        $context.drawImage(this.picture.path, r[0], r[1], r[2], r[3], x, y, w, h);
    },

    // -------------------------------------------------------

    drawBoxBackground: function(background, rect) {
        if (this.backgroundRepeat) {
            var x, y, w, h, l, m;
            for (x = rect[0] + this.borderTopLeft[2], l = rect[0] + rect[2] -
                 this.borderTopRight[2] - 1; x < l; x += background[2])
            {
                for (y = rect[1] + this.borderTopLeft[3], m = rect[1] + rect[3]
                     - this.borderBotLeft[3] - 1; y < m; y += background[3])
                {
                    w = x + background[2] < l ? background[2] : l - x + 1;
                    h = y + background[3] < m ? background[3] : m - y + 1;
                    this.drawElement(background, x, y, w, h);
                }
            }
        } else {
            this.drawElement(background, rect[0] + this
                .borderTopLeft[2], rect[1] + this.borderTopLeft[3], rect[2] -
                this.borderTopLeft[2] - this.borderBotRight[2], rect[3] - this
                .borderTopLeft[3] - this.borderBotRight[3]);
        }
    },

    // -------------------------------------------------------

    drawBox: function(rect, selected) {
        var x, y, w, h, l, m;

        // Corners
        this.drawElement(this.borderTopLeft, rect[0], rect[1]);
        this.drawElement(this.borderTopRight, rect[0] + rect[2] -
            this.borderTopRight[2], rect[1]);
        this.drawElement(this.borderBotLeft, rect[0], rect[1] +
            rect[3] - this.borderBotLeft[3]);
        this.drawElement(this.borderBotRight, rect[0] + rect[2] -
            this.borderBotRight[2], rect[1] + rect[3] - this.borderBotRight[3]);

        // Borders
        x = rect[0];
        for (y = rect[1] + this.borderTopLeft[3], l = rect[1] + rect[3] -
             this.borderBotLeft[3] - 1; y < l; y += this.borderLeft[3])
        {
            if (y + this.borderLeft[3] < l) {
                this.drawElement(this.borderLeft, x, y);
            } else {
                this.drawElement(this.borderLeft, x, y, this
                    .borderLeft[2], l - y + 1);
            }
        }
        x = rect[0] + rect[2] - this.borderTopRight[2];
        for (y = rect[1] + this.borderTopLeft[3], l = rect[1] + rect[3] -
             this.borderBotLeft[3] - 1; y < l; y += this.borderRight[3])
        {
            if (y + this.borderRight[3] < l) {
                this.drawElement(this.borderRight, x, y);
            } else {
                this.drawElement(this.borderRight, x, y, this
                    .borderRight[2], l - y + 1);
            }
        }
        y = rect[1];
        for (x = rect[0] + this.borderTopLeft[2], l = rect[0] + rect[2] -
             this.borderTopRight[2] - 1; x < l; x += this.borderTop[2])
        {
            if (x + this.borderTop[2] < l) {
                this.drawElement(this.borderTop, x, y);
            } else {
                this.drawElement(this.borderTop, x, y, l - x + 1,
                    this.borderTop[3]);
            }
        }
        y = rect[1] + rect[3] - this.borderBotLeft[3];
        for (x = rect[0] + this.borderBotLeft[2], l = rect[0] + rect[2] -
             this.borderBotRight[2] - 1; x < l; x += this.borderBot[2])
        {
            if (x + this.borderBot[2] < l) {
                this.drawElement(this.borderBot, x, y);
            } else {
                this.drawElement(this.borderBot, x, y, l - x + 1,
                    this.borderBot[3]);
            }
        }

        // Background
        this.drawBoxBackground(this.background, rect);
        if (selected) {
            this.drawBoxBackground(this.backgroundSelection, rect);
        }
    },

    // -------------------------------------------------------

    drawArrowTarget: function(frame, x, y) {
        var width = this.arrowTargetSelection[2] / $FRAMES;
        $context.drawImage(this.picture.path, this.arrowTargetSelection[0] +
            (frame * width), this.arrowTargetSelection[1], width, this
            .arrowTargetSelection[3], x - (width / 2), y, width, this
            .arrowTargetSelection[3]);
    },

    // -------------------------------------------------------

    drawArrowMessage: function(frame, x, y) {
        var width = this.arrowEndMessage[2] / $FRAMES;
        $context.drawImage(this.picture.path, this.arrowEndMessage[0] +
            (frame * width), this.arrowEndMessage[1], width, this
            .arrowEndMessage[3], x - (width / 2), y, width, this.arrowEndMessage
            [3]);
    },

    // -------------------------------------------------------

    drawDamagesNumber: function(damage, x, y, rect) {
        var digits = ("" + damage).split("").map(Number);
        var width = rect[2] / 10;
        var height = rect[3];
        for (var i = 0, l = digits.length; i < l; i++) {
            $context.drawImage(this.picture.path, rect[0] + (digits[i] * width),
                rect[1], width, height, x + ((i - (l / 2)) * (width + 1)), y,
                width, height);
        }
    },

    // -------------------------------------------------------

    drawDamages: function(damage, x, y, isCrit, isMiss) {
        if (isMiss) {
            this.drawElement(this.textMiss, x - this.textMiss[2] / 2, y);
        } else if (damage < 0) {
            this.drawDamagesNumber(damage, x, y, this.textHeal);
        } else if (isCrit) {
            this.drawDamagesNumber(damage, x, y, this.textCritical);
        } else {
            this.drawDamagesNumber(damage, x, y, this.textNormal);
        }
    }
}
