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
//  CLASS CollisionSquare
//
// -------------------------------------------------------

/** @class
*   A collision settings in a texture square.
*   @property {number[]} rect Percentage of the rect limitation.
*   @property {boolean} left
*   @property {boolean} right
*   @property {boolean} top
*   @property {boolean} bot
*/
function CollisionSquare(){
    this.rect = [0, 0, $SQUARE_SIZE, $SQUARE_SIZE];
    this.left = true;
    this.right = true;
    this.top = true;
    this.bot = true;
    this.bb = null;
}

CollisionSquare.unionSquares = function(squares, l, w, h) {
    var boolGrid = new Array(l), result = new Array;
    var i, j, k, kk, a, b, c, m, tempW, tempH, temp;
    var square, s;

    for (j = 0; j < h; j++) {
        k = j * w;
        for (i = 0; i < w; i++) {
            square = squares[i + k];
            if (square !== null) {
                if (square[0] === 0 || square[1] === 0 ||
                    square[0] + square[2] === $SQUARE_SIZE ||
                    square[1] + square[3] === $SQUARE_SIZE)
                {
                    boolGrid[i + k] = true;
                } else {
                    square[0] = square[0] + $SQUARE_SIZE * i;
                    square[1] = square[1] + $SQUARE_SIZE * j;
                    result.push(square);
                    boolGrid[i + k] = false;
                }
            }
            else
                boolGrid[i + k] = false;
        }
    }
    for (j = 0; j < h; j++) {
        k = j * w;
        for (i = 0; i < w; i++) {
            if (boolGrid[i + k]) {
                s = squares[i + k];
                square = [s[0], s[1], s[2], s[3]];
                square[0] = square[0] + $SQUARE_SIZE * i;
                square[1] = square[1] + $SQUARE_SIZE * j;
                boolGrid[i + k] = false;
                tempW = -1;
                for (a = i +1; a < w && tempW === -1; a++) {
                    c = false;
                    if (boolGrid[a + k]) {
                        if (squares[a + k - 1][0] + squares[a + k - 1][2] ===
                            $SQUARE_SIZE && squares[a + k][0] === 0)
                        {
                            if (squares[a + k][1] === squares[a + k - 1][1] &&
                                squares[a + k][3] === squares[a + k - 1][3])
                            {
                                c = true;
                                boolGrid[a + k] = false;
                                square[2] = square[2] + squares[a + k][2];
                            }
                        }
                    }
                    if (!c || a + 1 >= w)
                        tempW = a - i + (c ? 1 : 0);
                }
                tempH = -1;
                for (b = j +1; b < h && tempH === -1; b++) {
                    kk = b * w;
                    c = true;
                    for (a = i; a < i + tempW; a++) {
                        if (!(boolGrid[a + kk] && squares[a + kk - w][1] +
                              squares[a + kk - w][3] === $SQUARE_SIZE &&
                              squares[a + kk][1] === 0 && squares[a + kk][0] ===
                              squares[a + kk - w][0] && squares[a + kk][2] ===
                              squares[a + kk - w][2]))
                        {
                            c = false;
                        }
                    }
                    if (c) {
                        for (m = i; m < i + tempW; m++) {
                            boolGrid[m + kk] = false;
                        }
                        temp = squares[i + kk];
                        if (temp === null) {
                            temp = 0;
                        } else {
                            temp = temp[3];
                        }

                        square[3] = square[3] + temp;
                        boolGrid[i + kk] = false;
                    }
                    if (!c || b + 1 >= h)
                        tempH = b - j + (c ? 1 : 0);
                }

                result.push(square);
            }
        }
    }

    return result;
}

CollisionSquare.getBB = function(rect, w, h) {
    return [
        (rect[0] - ((w * $SQUARE_SIZE) - rect[0] - rect[2])) / 2,
        (h * $SQUARE_SIZE) - rect[1] - (rect[3] / 2), 0, rect[2], rect[3], 1, 0,
        0, 0
    ];
}

CollisionSquare.prototype = {

    /** Read the JSON associated to the collision square.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        var rect = json.rec;
        var left = json.l;
        var right = json.r;
        var top = json.t;
        var bot = json.b;

        if (typeof rect !== 'undefined') {
            if (rect === null)
                this.rect = null;
            else {
                this.rect = [
                    Math.round(rect[0] * $SQUARE_SIZE / 100),
                    Math.round(rect[1] * $SQUARE_SIZE / 100),
                    Math.round(rect[2] * $SQUARE_SIZE / 100),
                    Math.round(rect[3] * $SQUARE_SIZE / 100)
                ];
            }
        }
        if (typeof left !== 'undefined')
            this.left = left;
        if (typeof right !== 'undefined')
            this.right = right;
        if (typeof top !== 'undefined')
            this.top = top;
        if (typeof bot !== 'undefined')
            this.bot = bot;
    },

    // -------------------------------------------------------

    hasAllDirections: function() {
        return this.left && this.right && this.top && this.bot;
    }
}
