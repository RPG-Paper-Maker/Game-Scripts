/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Graphic } from "../index.js";
import { Bitmap } from "./Bitmap.js";
import { WindowBox } from "./WindowBox.js";
import { WindowChoices } from "./WindowChoices.js";
/**
 * The class for window boxes.
 * @class
 * @extends {Bitmap}
 */
class SpinBox extends Bitmap {
    /**
     *  @param {number} x - The x coordinates
     *  @param {number} y - The y coordinates
     */
    constructor(x, y, { w = SpinBox.DEFAULT_WIDTH, h = SpinBox
        .DEFAULT_HEIGHT, value = 1, min = 1, max = 100, active = false } = {}) {
        super(x, y, w, h);
        this.value = value;
        this.min = min;
        this.max = max;
        this.active = active;
        const graphic = new Graphic.SpinBox(value);
        const options = {
            content: graphic,
            padding: WindowBox.MEDIUM_PADDING_BOX,
            selected: true
        };
        this.windowBox = new WindowBox(x, y, w, h, options);
        this.startTime = new Date().getTime();
    }
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x) {
        super.setX(x);
        if (this.windowBox) {
            this.windowBox.setX(x);
        }
    }
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y) {
        super.setY(y);
        if (this.windowBox) {
            this.windowBox.setY(y);
        }
    }
    /**
     *  Set the w value.
     *  @param {number} w - The w value
     */
    setW(w) {
        super.setW(w);
        if (this.windowBox) {
            this.windowBox.setW(w);
        }
    }
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     */
    setH(h) {
        super.setH(h);
        if (this.windowBox) {
            this.windowBox.setH(h);
        }
    }
    /**
     *  Update value.
     *  @param {number} value
     */
    updateValue(value) {
        if (value !== this.value) {
            this.value = value;
            Datas.Systems.soundCursor.playSound();
            this.windowBox.content.setValue(value);
        }
    }
    /**
     *  Update when going down.
     */
    goDown() {
        let value = this.value;
        if (this.value > this.min) {
            value--;
        }
        this.updateValue(value);
    }
    /**
     *  Update when going up.
     */
    goUp() {
        let value = this.value;
        if (this.value < this.max) {
            value++;
        }
        this.updateValue(value);
    }
    /**
     *  Update when going left.
     */
    goLeft() {
        this.updateValue(Math.max(this.value - 10, this.min));
    }
    /**
     *  Update when going right.
     */
    goRight() {
        this.updateValue(Math.min(this.value + 10, this.max));
    }
    /**
     *  Key pressed repeat handle, but with a small wait after the first
     *  pressure (generally used for menus).
     *  @param {number} key - The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    onKeyPressedAndRepeat(key) {
        let t = new Date().getTime();
        if (t - this.startTime >= WindowChoices.TIME_WAIT_PRESS) {
            this.startTime = t;
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Down)) {
                this.goDown();
            }
            else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Up)) {
                this.goUp();
            }
            else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Right)) {
                this.goRight();
            }
            else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Left)) {
                this.goLeft();
            }
        }
        return true;
    }
    /**
     *  Draw the spin box.
     */
    draw() {
        this.windowBox.draw();
        let windowSkin = Datas.Systems.getCurrentWindowSkin();
        if (this.value < this.max) {
            windowSkin.drawArrowUp(this.oX + (this.oW - windowSkin.arrowUpDown[2])
                / 2, this.oY - (windowSkin.arrowUpDown[3] / 2) - 1);
        }
        if (this.value > this.min) {
            windowSkin.drawArrowDown(this.oX + (this.oW - windowSkin.arrowUpDown[2])
                / 2, this.oY + this.oH + 1);
        }
    }
}
SpinBox.DEFAULT_WIDTH = 150;
SpinBox.DEFAULT_HEIGHT = 50;
export { SpinBox };
