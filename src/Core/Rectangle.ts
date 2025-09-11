/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *  The data class for anchors.
 *  @property {number} x
 *  @property {number} y
 *  @property {number} width
 *  @property {number} height
 *  @property {Anchor2D} anchor
 *  @param {number} [x=0]
 *  @param {number} [y=0]
 *  @param {number} [width=1]
 *  @param {number} [height=1]
 */
class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x = 0, y = 0, width = 1, height = 1) {
		this.setCoords(x, y, width, height);
	}

	/**
	 *  Create a rectangle from an array.
	 *  @static
	 *  @param {number[]} array
	 */
	static createFromArray(array: number[]): Rectangle {
		return new Rectangle(array[0], array[1], array[2], array[3]);
	}

	/**
	 *  Resize rectangle with width and height value.
	 *  @param {number} width
	 *  @param {number} height
	 */
	public resize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	/**
	 *  Set rectangle coords.
	 *  @param {number} x
	 *  @param {number} y
	 *  @param {number} width
	 *  @param {number} height
	 */
	public setCoords(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
	 *  Check if x and y are inside the rectangle.
	 *  @param {number} x
	 *  @param {number} y
	 *  @returns {boolean}
	 */
	isInside(x: number, y: number): boolean {
		return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
	}

	clone() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
}

export { Rectangle };
