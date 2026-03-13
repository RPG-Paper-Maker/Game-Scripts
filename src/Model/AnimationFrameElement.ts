/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Utils } from '../Common';
import { Picture2D } from '../Core';
import { Base } from './Base';

/**
 * JSON schema for an animation frame element.
 */
export type AnimationFrameElementJSON = {
	x?: number;
	y?: number;
	tr?: number;
	tc?: number;
	z?: number;
	a?: number;
	fv?: boolean;
	o?: number;
};

/**
 * Represents a single element (sprite) of an animation frame.
 * Each element defines its own position, texture region, transformations
 * (zoom, angle, flip), and opacity.
 */
class AnimationFrameElement extends Base {
	public x: number;
	public y: number;
	public texRow: number;
	public texCol: number;
	public zoom: number;
	public angle: number;
	public flip: boolean;
	public opacity: number;

	constructor(json?: AnimationFrameElementJSON) {
		super(json);
	}

	/**
	 * Draws the animation frame element on the screen.
	 * @param picture - The picture resource used for the animation.
	 * @param position - The position on screen where the element is drawn.
	 * @param rows - Total number of rows in the animation texture.
	 * @param cols - Total number of columns in the animation texture.
	 */
	draw(picture: Picture2D, position: THREE.Vector2, rows: number, cols: number): void {
		picture.zoom = this.zoom;
		picture.opacity = this.opacity;
		picture.angle = this.angle;
		picture.centered = true;
		picture.reverse = this.flip;
		const w = picture.oW / cols;
		const h = picture.oH / rows;
		picture.draw({
			x: position.x + this.x,
			y: position.y + this.y,
			w: w * this.zoom,
			h: h * this.zoom,
			sx: w * this.texCol,
			sy: h * this.texRow,
			sw: w,
			sh: h,
		});
	}

	/**
	 * Reads the JSON data associated with this frame element.
	 */
	read(json: AnimationFrameElementJSON): void {
		this.x = Utils.valueOrDefault(json.x, 0);
		this.y = Utils.valueOrDefault(json.y, 0);
		this.texRow = Utils.valueOrDefault(json.tr, 0);
		this.texCol = Utils.valueOrDefault(json.tc, 0);
		this.zoom = Utils.valueOrDefault(json.z, 100) / 100;
		this.angle = Utils.valueOrDefault(json.a, 0);
		this.flip = Utils.valueOrDefault(json.fv, false);
		this.opacity = Utils.valueOrDefault(json.o, 100) / 100;
	}
}

export { AnimationFrameElement };
