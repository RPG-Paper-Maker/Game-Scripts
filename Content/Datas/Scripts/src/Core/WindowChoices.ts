/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Bitmap } from "./Bitmap";
import { Enum } from "../Common";
import OrientationWindow = Enum.OrientationWindow;
import { Graphic, Manager, Datas } from "..";
import { WindowBox } from "./WindowBox";

/** @class
 *  A class for window choices.
 *  @extends Bitmap
 *  @param {number} x The x coords
 *  @param {number} y The y coords
 *  @param {number} w The w coords
 *  @param {number} h The h coords
 *  @param {Object[]} listContents List of all the contents to display
 *  @param {Object} [opts={}] Options
 *  @param {function[]} [opts.listCallbacks=null] List of all the callback 
 *  functions to excecute when pressed.
 *  @param {OrientationWindow} [opts.orientation=OrientationWindow.Vertical] The 
 *  orientation of the window (horizontal or vertical)
 *  @param {number} [opts.nbItemsMax = listContents.length] Max number of items 
 *  to display on the choice box
 *  @param {number[]} [opts.padding=RPM.SMALL_SLOT_PADDING] Padding of the box
 *  @param {number} [opts.space=0] Space between each choice in the box
 *  @param {number} [opts.currentSelectedIndex=0] The current selected index 
 *  position in the choice box
 *  @param {boolean} [opts.bordersInsideVisible=true] If checked, each choice 
 *  will have an individual window box
 */
class WindowChoices extends Bitmap {
    
    public static TIME_WAIT_PRESS = 50;

    public orientation: OrientationWindow;
    public nbItemsMax: number;
    public padding: number[];
    public space: number;
    public currentSelectedIndex: number;
    public bordersInsideVisible: boolean;
    public offsetSelectedIndex: number;
    public choiceWidth: number;
    public choiceHeight: number;
    public startTime: number;
    public listContents: Graphic.Base[];
    public listWindows: WindowBox[];
    public listCallBacks: Function[];
    public windowMain: WindowBox;
    public size: number;

    constructor (x: number, y: number, w: number, h: number, listContents, { 
        listCallbacks = null, orientation = OrientationWindow.Vertical, 
        nbItemsMax = listContents.length, padding = WindowBox.SMALL_SLOT_PADDING
        , space = 0, currentSelectedIndex = 0, bordersInsideVisible = true }: { 
        listCallbacks?: Function[], orientation?: OrientationWindow, nbItemsMax?
        : number, padding?: number[], space?: number, currentSelectedIndex?: 
        number, bordersInsideVisible?: boolean } = {})
    {
        super(x, y, w, h);

        // Parameters
        this.orientation = orientation;
        this.nbItemsMax = nbItemsMax;
        this.padding = padding;
        this.space = space;
        this.currentSelectedIndex = currentSelectedIndex;
        this.bordersInsideVisible = bordersInsideVisible;

        // Initialize values
        this.offsetSelectedIndex = 0;
        this.choiceWidth = w;
        this.choiceHeight = h;
        this.startTime = new Date().getTime();

        // Initialize contents choices and callbacks
        this.setContentsCallbacks(listContents, listCallbacks, 
            currentSelectedIndex);
    }

    /** 
     *  Set the x value.
     *  @param {number} x The x value
     */
    setX(x: number) {
        super.setX(x);
        if (this.listContents) {
            this.updateContentSize(this.currentSelectedIndex);
        }
    }

    /** 
     *  Set the y value.
     *  @param {number} y The y value
     */
    setY(y: number) {
        super.setY(y);
        if (this.listContents) {
            this.updateContentSize(this.currentSelectedIndex);
        }
    }

    /** 
     *  Get the content at a specific index.
     *  @param {number} i The index
     *  @returns {Graphic.Base}
     */
    getContent(i: number): Graphic.Base {
        let window = this.listWindows[i];
        return window ? window.content : null;
    }

    /** 
     *  Get the current selected content.
     *  @returns {Graphic.Base}
     */
    getCurrentContent(): Graphic.Base {
        return this.getContent(this.currentSelectedIndex);
    }

    /** 
     *  Update content size according to all the current settings.
     *  @param {number} [currentSelectedIndex=0] The current selected index 
     *  position
     */
    updateContentSize(currentSelectedIndex: number = 0) {

        // Getting the main box size
        let totalNb = this.listContents.length;
        this.size = totalNb > this.nbItemsMax ? this.nbItemsMax : totalNb;
        let boxWidth: number, boxHeight: number;
        if (this.orientation === OrientationWindow.Horizontal) {
            boxWidth = (this.choiceWidth + this.space) * this.size - this.space;
            boxHeight = this.choiceHeight;
        } else {
            boxWidth = this.choiceWidth;
            boxHeight = (this.choiceHeight + this.space) * this.size - this
                .space;
        }
        this.setW(boxWidth);
        this.setH(boxHeight);
        if (!this.bordersInsideVisible) {
            this.windowMain = new WindowBox(this.oX, this.oY, boxWidth, 
                boxHeight);
        }

        // Create a new windowBox for each choice and according to orientation
        this.listWindows = new Array(totalNb);
        let window: WindowBox;
        for (let i = 0; i < totalNb; i++) {
            if (this.orientation === OrientationWindow.Horizontal) {
                window = new WindowBox(this.oX + (i * this.choiceWidth) + (i *
                    this.space), this.oY, this.choiceWidth, this.choiceHeight,
                    {
                        content: this.listContents[i],
                        padding: this.padding
                    }
                );
            } else {
                window = new WindowBox(this.oX, this.oY + (i * this.choiceHeight
                    ) + (i * this.space), this.choiceWidth, this.choiceHeight,
                    {
                        content: this.listContents[i],
                        padding: this.padding
                    }
                );
            }
            window.bordersVisible = this.bordersInsideVisible;
            this.listWindows[i] = window;
        }
        // Select current selected index if number of choices > 0
        if (this.size > 0) {
            this.currentSelectedIndex = currentSelectedIndex;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = true;
            }
        } else {
            this.currentSelectedIndex = -1;
        }
        this.offsetSelectedIndex = 0;

        // Update HUD
        Manager.Stack.requestPaintHUD = true;
    }

    /** 
     *  Set the content at a specific index.
     *  @param {number} i The index
     *  @param {Graphic.Base} content The new content
     */
    setContent(i: number, content: Graphic.Base) {
        this.listWindows[i].content = content;
    }

    /** 
     *  Set all the graphic contents.
     *  @param {Graphic.Base[]} contents All the contents
     */
    setContents(contents: Graphic.Base[]) {
        for (let i = 0, l = this.listWindows.length; i < l; i++) {
            this.setContent(i, contents[i]);
        }
    }

    /** 
     *  Set all the callbacks for each choice.
     *  @param {Function[]} callbacks All the callbacks functions
     */
    setCallbacks(callbacks: Function[]) {
        if (callbacks === null) {
            
            // Create a complete empty list according to contents length
            let l = this.listContents.length;
            this.listCallBacks = new Array(l);
            for (let i = 0; i < l; i++) {
                this.listCallBacks[i] = null;
            }
        } else {
            this.listCallBacks = callbacks;
        }
    }

    /** 
     *  Set all the contents and callbacks.
     *  @param {Graphic.Base[]} contents All the contents
     *  @param {function[]} [callbacks=null] All the callbacks functions
     *  @param {number} [currentSelectedIndex=0] The current selected index 
     *  position
     */
    setContentsCallbacks(contents: Graphic.Base[], callbacks: Function[] = null, 
        currentSelectedIndex: number = 0)
    {
        this.listContents = contents;
        this.updateContentSize(currentSelectedIndex);
        this.setCallbacks(callbacks);
    }

    /** 
     *  Unselect a choice.
     */
    unselect() {
        if (this.currentSelectedIndex !== -1 && this.listWindows.length > 0) {
            this.listWindows[this.currentSelectedIndex].selected = false;
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Select a choice.
     *  @param {number} i The index of the choice
     */
    select(i: number) {
        if (this.listWindows.length > 0) {
            if (i >= this.listWindows.length) {
                i = this.listWindows.length - 1;
                this.offsetSelectedIndex = this.size - 1;
            }
            this.currentSelectedIndex = i;
            this.listWindows[this.currentSelectedIndex].selected = true;
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Select the current choice.
     */
    selectCurrent() {
        this.select(this.currentSelectedIndex);
    }

    /** 
     *  Go cursor up.
     */
    goUp() {
        let index = this.currentSelectedIndex;
        if (index > 0) {
            this.currentSelectedIndex--;
            if (this.offsetSelectedIndex > 0) {
                this.offsetSelectedIndex--;
            }
        } else if (index === 0) {
            this.currentSelectedIndex = this.listWindows.length - 1;
            this.offsetSelectedIndex = this.size - 1;
        }
        if (index !== this.currentSelectedIndex) {
            Datas.Systems.soundCursor.playSound();
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  Go cursor down.
     */
    goDown() {
        let index = this.currentSelectedIndex;
        if (index < this.listWindows.length - 1 && index >= 0) {
            this.currentSelectedIndex++;
            if (this.offsetSelectedIndex < this.size - 1) {
                this.offsetSelectedIndex++;
            }
        } else if (index === this.listWindows.length - 1) {
            this.currentSelectedIndex = 0;
            this.offsetSelectedIndex = 0;
        }
        if (index !== this.currentSelectedIndex) {
            Datas.Systems.soundCursor.playSound();
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /** 
     *  First key press handle.
     *  @param {number} key The key ID pressed
     *  @param {Object} base The base object to apply with callback
     */
    onKeyPressed(key: number, base?: Object)
    {
        if (this.currentSelectedIndex !== -1) {
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Action))
            {
                let callback = this.listCallBacks[this.currentSelectedIndex];
                if (callback !== null) {

                    // Play a sound according to callback result
                    if (callback.call(base)) {
                        Datas.Systems.soundConfirmation.playSound();
                    } else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                } else {
                    Datas.Systems.soundImpossible.playSound();
                }
            }
        }
    }

    /** 
     *  Key pressed repeat handle, but with a small wait after the first 
     *  pressure (generally used for menus).
     *  @param {number} key The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key: number): boolean {

        // Wait for a slower update
        let t = new Date().getTime();
        if (t - this.startTime >= WindowChoices.TIME_WAIT_PRESS) {
            this.startTime = t;
            if (this.currentSelectedIndex !== -1) {
                this.listWindows[this.currentSelectedIndex].selected = false;

                // Go up or go down according to key and orientation
                if (this.orientation === OrientationWindow.Vertical) {
                    if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Down))
                    {
                        this.goDown();
                    } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Up))
                    {
                        this.goUp();
                    }
                } else {
                    if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Right))
                    {
                        this.goDown();
                    }
                    else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Left))
                    {
                        this.goUp();
                    }
                }
                this.selectCurrent();
            }
        }
        return true;
    }

    /** 
     *  Draw the windows.
     */
    draw() {
        if (!this.bordersInsideVisible) {
            this.windowMain.draw();
        }
        let offset = this.currentSelectedIndex === -1 ? -1 : this
            .offsetSelectedIndex;
        let index: number;
        for (let i = 0; i < this.size; i++) {
            index = i + this.currentSelectedIndex - offset;
            this.listWindows[index].draw(true, this.listWindows[i]
                .windowDimension, this.listWindows[i].contentDimension);
        }
    }
}

export { WindowChoices }