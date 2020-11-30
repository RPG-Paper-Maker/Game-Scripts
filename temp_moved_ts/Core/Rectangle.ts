import {Anchor2D} from ".";

export class Rectangle {

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    /**
     * The rectangle Anchor
     * @default {x: 0.5,y: 0}
     * @type {Anchor2D}
     */
    public anchor: Anchor2D;

    constructor(x = 0, y = 0, width = 10, height = 10) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        const anchorX = Anchor2D.MIDDLE_BOTTOM.x;
        const anchorY = Anchor2D.MIDDLE_BOTTOM.y;
        this.anchor = new Anchor2D(anchorX, anchorY);
    }

    public move(x, y) {
        this.x = x + (this.width * this.anchor.x);
        this.y = y + (this.height * this.anchor.y);
    }

    public resize(width, height) {
        this.width = width;
        this.height = height;
    }

    public set(x, y, width, height) {
        this.move(x, y);
        this.resize(width, height);
    }

    public setAnchor(x, y) {
        this.anchor.set({x, y});
    }

    public presetAnchor(anchorPreset: { x: number, y: number }) {
        this.anchor.set(anchorPreset);
    }
}



