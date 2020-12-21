/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { System, Datas } from "..";
import { Picture2D } from "../Core";
import { Enum, Utils, ScreenResolution } from "../Common";
import PictureKind = Enum.PictureKind;

/** @class
 *  A window skin of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the 
 *  window skin
 */
class WindowSkin extends System.Base {

    public pictureID: number;
    public borderTopLeft: number[];
    public borderTopRight: number[];
    public borderBotLeft: number[];
    public borderBotRight: number[];
    public borderLeft: number[];
    public borderRight: number[];
    public borderTop: number[];
    public borderBot: number[];
    public background: number[];
    public backgroundSelection: number[];
    public backgroundRepeat: number[];
    public arrowEndMessage: number[];
    public arrowTargetSelection: number[];
    public arrowUpDown: number[];
    public textNormal: number[];
    public textCritical: number[];
    public textHeal: number[];
    public textMiss: number[];
    public picture: Picture2D;

    constructor(json?: Record<string, any>) {
        super(json);
    }
    
    /** 
     *  Read the JSON associated to the window skin.
     *  @param {Record<string, any>} json Json object describing the window skin
     */
    read(json: Record<string, any>) {
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
    }

    /** 
     * Update the window skin picture ID.
     */
    async updatePicture()
    {
        this.picture = await Picture2D.create(Datas.Pictures.get(PictureKind
            .WindowSkins, this.pictureID), PictureKind.WindowSkins);
        this.picture.stretch = true;
    }

    /** 
     *  Draw any element of the window skin box with the cut picture.
     *  @param {number[]} r The rect source
     *  @param {number} x The x target
     *  @param {number} y The y target
     *  @param {number} [w=r[2]] The w target
     *  @param {number} [h=r[3]] The h target
     *  @param {number} [zoom=1.0] The zoom to apply of target size
     */
    drawElement(r: number[], x: number, y: number, w: number = r[2], h: number = 
        r[3], zoom: number = 1.0)
    {
        this.picture.draw(x, y, w * zoom, h * zoom, r[0], r[1], r[2], r[3]);
    }

    /** 
     *  Draw the background box.
     *  @param {number[]} background The background source rect
     *  @param {number[]} rect The final box rect
     */
    drawBoxBackground(background: number[], rect: number[])
    {
        if (this.backgroundRepeat) {
            let y: number, m: number, w: number, h: number;
            for (let x = rect[0] + this.borderTopLeft[2], l = rect[0] + rect[2] 
                - this.borderTopRight[2] - 1; x < l; x += background[2])
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
            this.drawElement(background, rect[0] + this.borderTopLeft[2], rect[1
                ] + this.borderTopLeft[3], rect[2] - this.borderTopLeft[2] - 
                this.borderBotRight[2], rect[3] - this.borderTopLeft[3] - this
                .borderBotRight[3]);
        }
    }

    /** 
     *  Draw the box
     *  @param {number[]} rect The final box rect
     *  @param {boolean} selected Indicate if the box is selected
     *  @param {boolean} bordersVisible Indicate if the borders of the box are visible
     */
    drawBox(rect: number[], selected: boolean, bordersVisible: boolean)
    {
        if (bordersVisible) {
            // Corners
            this.drawElement(this.borderTopLeft, rect[0], rect[1]);
            this.drawElement(this.borderTopRight, rect[0] + rect[2] - this
                .borderTopRight[2], rect[1]);
            this.drawElement(this.borderBotLeft, rect[0], rect[1] + rect[3] - 
                this.borderBotLeft[3]);
            this.drawElement(this.borderBotRight, rect[0] + rect[2] - this
                .borderBotRight[2], rect[1] + rect[3] - this.borderBotRight[3]);

            // Borders
            let x = rect[0];
            let y, l;
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
                    this.drawElement(this.borderRight, x, y, this.borderRight[2]
                        , l - y + 1);
                }
            }
            y = rect[1];
            for (x = rect[0] + this.borderTopLeft[2], l = rect[0] + rect[2] -
                this.borderTopRight[2] - 1; x < l; x += this.borderTop[2])
            {
                if (x + this.borderTop[2] < l) {
                    this.drawElement(this.borderTop, x, y);
                } else {
                    this.drawElement(this.borderTop, x, y, l - x + 1, this
                        .borderTop[3]);
                }
            }
            y = rect[1] + rect[3] - this.borderBotLeft[3];
            for (x = rect[0] + this.borderBotLeft[2], l = rect[0] + rect[2] -
                this.borderBotRight[2] - 1; x < l; x += this.borderBot[2])
            {
                if (x + this.borderBot[2] < l) {
                    this.drawElement(this.borderBot, x, y);
                } else {
                    this.drawElement(this.borderBot, x, y, l - x + 1, this
                        .borderBot[3]);
                }
            }
        }

        // Background
        this.drawBoxBackground(this.background, rect);
        if (selected) {
            this.drawBoxBackground(this.backgroundSelection, rect);
        }
    }

    /** 
     *  Draw the arrow for targets.
     *  @param {number} frame The current frame to draw
     *  @param {number} x The x position
     *  @param {number} y The y position
     *  @param {boolean} positionResize Indicate if the position picture needs 
     *  to be resize (resolution)
     */
    drawArrowTarget(frame: number, x: number, y: number, positionResize: boolean 
        = false)
    {
        let width = this.arrowTargetSelection[2] / Datas.Systems.FRAMES;
        this.picture.draw(x - (width / 2), y, width, this.arrowTargetSelection
            [3],this.arrowTargetSelection[0] + (frame * width), this
            .arrowTargetSelection[1], width, this.arrowTargetSelection[3],
            positionResize);
    }

    /** 
     *  Draw the arrow for end of messages.
     *  @param {number} frame The current frame to draw
     *  @param {number} x The x position
     *  @param {number} y The y position
     */
    drawArrowMessage(frame: number, x: number, y: number)
    {
        let width = this.arrowEndMessage[2] / Datas.Systems.FRAMES;
        this.picture.draw(x - (width / 2), y, width, this.arrowEndMessage[3],
            this.arrowEndMessage[0] + (frame * width), this.arrowEndMessage[1],
            width, this.arrowEndMessage[3]);
    }

    /** 
     *  Draw a damage number.
     *  @param {number} damage The damage number to display
     *  @param {number} x The x position
     *  @param {number} y The y position
     *  @param {number[]} rect The source rect
     *  @param {number} zoom The zoom to apply on damages
     */
    drawDamagesNumber(damage: number, x: number, y: number, rect: number[], zoom
        : number)
    {
        let digits = Utils.numToString(damage).split("").map(Number);
        let width = rect[2] / 10;
        let height = rect[3];
        this.picture.stretch = false;
        for (let i = 0, l = digits.length; i < l; i++)
        {
            this.picture.draw(x + ((i - ((l -1) / 2)) * (ScreenResolution
                .getScreenMinXY(width) * zoom)), y, width * zoom, height * zoom, 
                rect[0] + (digits[i] * width), rect[1], width, height, false);
        }
        this.picture.stretch = true;
    }

    /** 
     *  Draw a damage number according to the kind of damages.
     *  @param {number} damage The damage number to display
     *  @param {number} x The x position
     *  @param {number} y The y position
     *  @param {boolean} isCrit Indicate if the damages are a critical hit
     *  @param {boolean} isMiss Indicate if the damages are a missed hit
     *  @param {number} zoom The zoom to apply on damages
     */
    drawDamages(damage: number, x: number, y: number, isCrit: boolean, isMiss: 
        boolean, zoom: number)
    {
        if (isMiss) {
            this.drawElement(this.textMiss, x - this.textMiss[2] / 2, y, null,
                null, zoom);
        } else if (damage < 0) {
            this.drawDamagesNumber(damage, x, y, this.textHeal, zoom);
        } else if (isCrit) {
            this.drawDamagesNumber(damage, x, y, this.textCritical, zoom);
        } else {
            this.drawDamagesNumber(damage, x, y, this.textNormal, zoom);
        }
    }
}

export { WindowSkin }