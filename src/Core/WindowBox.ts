/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Bitmap } from "./Bitmap";
import { Graphic, Datas } from "../index";
import { Platform, ScreenResolution, Utils } from "../Common";


/**
 * the window box options
 *
 * @interface WindowBoxOptions
 */
interface WindowBoxOptions {
    /**
     *  The contents displayed inside the window.
     *
     *  @type {Graphic.Base}
     *  @default null
     *  @memberof WindowBoxOption
     */
    content?: Graphic.Base;
    /**
     *  The window padding
     *
     *  @type {number[]}
     *  @default [0,0,0,0]
     *  @memberof WindowBoxOption
     */
    padding?: number[];
    /**
     *  If enabled the contents will be cut according to the padding size.
     *
     *  @type {boolean}
     *  @default true
     *  @memberof WindowBoxOption
     */
    limitContent?: boolean;
    /**
     *  Indicate if selected.
     *
     *  @type {boolean}
     *  @default false
     *  @memberof WindowBoxOption
     */
    selected?: boolean;
}

/**
 * The class for window boxes.
 *
 * @class WindowBox
 * @extends {Bitmap}
 */
class WindowBox extends Bitmap {

    public static readonly NONE_PADDING = [0, 0, 0, 0];
    public static readonly VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
    public static readonly SMALL_PADDING_BOX = [10, 10, 10, 10];
    public static readonly MEDIUM_PADDING_BOX = [20, 20, 20, 20];
    public static readonly HUGE_PADDING_BOX = [30, 30, 30, 30];
    public static readonly DIALOG_PADDING_BOX = [30, 50, 30, 50];
    public static readonly SMALL_SLOT_PADDING = [10, 5, 10, 5];
    public static readonly SMALL_SLOT_HEIGHT = 30;
    public static readonly LARGE_SLOT_WIDTH = 250;
    public static readonly MEDIUM_SLOT_WIDTH = 200;
    public static readonly SMALL_SLOT_WIDTH = 100;
    public static readonly MEDIUM_SLOT_HEIGHT = 40;
    public static readonly LARGE_SLOT_HEIGHT = 60;

    public content: Graphic.Base;
    public padding: number[];
    public limitContent: boolean;
    public bordersOpacity: number;
    public backgroundOpacity: number;
    public selected: boolean;
    public bordersVisible: boolean;
    public contentDimension: number[];
    public windowDimension: number[];

    /**
     * 
     * @param {number} x - The x coordinates
     * @param {number} y - The y coordinates
     * @param {number} w - The width coordinates
     * @param {number} h - The height coordinates
     * @param {WindowBoxOption} [options={}] - the window options
     * @memberof WindowBox
     */
    constructor(x: number, y: number, w: number, h: number, options: WindowBoxOptions = {}) {
        super(x, y, w, h);
        this.content = Utils.defaultValue(options.content, null);
        this.padding = Utils.defaultValue(options.padding, [0, 0, 0, 0]);
        this.limitContent = Utils.defaultValue(options.limitContent, true);
        this.selected = Utils.defaultValue(options.selected, false);
        this.updateDimensions();
        this.bordersOpacity = 1;
        this.backgroundOpacity = 1;
        this.bordersVisible = true;
    }

    /** 
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x: number) {
        super.setX(x);
        if (this.padding) {
            this.updateDimensions();
        }
    }

    /** 
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y: number) {
        super.setY(y);
        if (this.padding) {
            this.updateDimensions();
        }
    }

    /** 
     *  Set the w value.
     *  @param {number} w - The w value
     */
    setW(w: number) {
        super.setW(w);
        if (this.padding) {
            this.updateDimensions();
        }
    }

    /** 
     *  Set the h value.
     *  @param {number} h - The h value
     */
    setH(h: number) {
        super.setH(h);
        if (this.padding) {
            this.updateDimensions();
        }
    }

    /** 
     *  Update the content and window dimensions.
     */
    updateDimensions() {
        // Setting content dimensions
        this.contentDimension = [
            this.oX + this.padding[0],
            this.oY + this.padding[1],
            this.oW - (2 * this.padding[2]),
            this.oH - (2 * this.padding[3])
        ];

        // Adjusting dimensions
        this.windowDimension = [
            this.oX,
            this.oY,
            this.oW,
            this.oH
        ];
    }

    /** 
     *  Update the content.
     */
    update() {
        if (this.content) {
            this.content.update();
        }
    }

    /** 
     *  Draw the window.
     *  @param {boolean} [isChoice=false] - Indicate if this window box is used
     *  for a window choices
     *  @param {number[]} [windowDimension - = this.windowDimension] Dimensions 
     *  of the window
     *  @param {number[]} [contentDimension - = this.contentDimension] Dimension 
     *  of content
     */
    draw(isChoice: boolean = false, windowDimension: number[] = this
        .windowDimension, contentDimension: number[] = this.contentDimension) {
        // Content behind
        if (this.content) {
            this.content.drawBehind(contentDimension[0], contentDimension[1],
                contentDimension[2], contentDimension[3]);
        }

        // Draw box
        Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this
            .selected, this.bordersVisible);

        // Draw content
        if (this.content) {
            if (!isChoice && this.limitContent) {
                Platform.ctx.save();
                Platform.ctx.beginPath();
                Platform.ctx.rect(ScreenResolution.getScreenX(contentDimension
                [0]), ScreenResolution.getScreenY(contentDimension[1] - (
                    this.padding[3] / 2)), ScreenResolution.getScreenX(
                        contentDimension[2]), ScreenResolution.getScreenY(
                            contentDimension[3] + this.padding[3]));
                Platform.ctx.clip();
            }
            if (isChoice) {
                this.content.drawChoice(contentDimension[0], contentDimension[1],
                    contentDimension[2], contentDimension[3]);
            } else {
                this.content.draw(contentDimension[0], contentDimension[1],
                    contentDimension[2], contentDimension[3]);
            }
            if (!isChoice && this.limitContent) {
                Platform.ctx.restore();
            }
        }
    }
}

export { WindowBox, WindowBoxOptions }