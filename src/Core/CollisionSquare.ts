/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Datas } from '../index';
import { Rectangle } from './Rectangle';

/**
 * JSON structure describing a collision square in a texture.
 */
export type CollisionSquareJSON = {
	rec?: [number, number, number, number] | null;
	l?: boolean;
	r?: boolean;
	t?: boolean;
	b?: boolean;
	terrain?: number;
	c?: boolean;
};

/**
 * Represents collision settings inside a texture square.
 */
export class CollisionSquare {
	public rect: Rectangle | null;
	public left: boolean;
	public right: boolean;
	public top: boolean;
	public bot: boolean;
	public terrain: number;
	public climbing: boolean;

	constructor() {
		this.rect = new Rectangle(0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems.SQUARE_SIZE);
		this.left = true;
		this.right = true;
		this.top = true;
		this.bot = true;
		this.terrain = 0;
		this.climbing = false;
	}

	/**
	 * Merge contiguous collision squares into larger rectangles.
	 * @param squares Array of rectangles (or null) representing squares.
	 * @param l Total number of squares.
	 * @param w Width in squares.
	 * @param h Height in squares.
	 * @returns Merged rectangles.
	 */
	static unionSquares(squares: (Rectangle | null)[], l: number, w: number, h: number): Rectangle[] {
		const boolGrid = new Array<boolean>(l);
		const result = [];
		for (let j = 0; j < h; j++) {
			const k = j * w;
			for (let i = 0; i < w; i++) {
				const square = squares[i + k];
				if (square !== null) {
					if (
						square.x === 0 ||
						square.y === 0 ||
						square.x + square.width === Datas.Systems.SQUARE_SIZE ||
						square.y + square.height === Datas.Systems.SQUARE_SIZE
					) {
						boolGrid[i + k] = true;
					} else {
						square.x += Datas.Systems.SQUARE_SIZE * i;
						square.y += Datas.Systems.SQUARE_SIZE * j;
						result.push(square);
						boolGrid[i + k] = false;
					}
				} else {
					boolGrid[i + k] = false;
				}
			}
		}
		for (let j = 0; j < h; j++) {
			const k = j * w;
			for (let i = 0; i < w; i++) {
				if (boolGrid[i + k]) {
					const s = squares[i + k];
					const square = s.clone();
					square.x += Datas.Systems.SQUARE_SIZE * i;
					square.y += Datas.Systems.SQUARE_SIZE * j;
					boolGrid[i + k] = false;
					let tempW = -1;
					for (let a = i + 1; a < w && tempW === -1; a++) {
						let c = false;
						if (boolGrid[a + k]) {
							const previous = squares[a + k - 1];
							const current = squares[a + k];
							if (previous.x + previous.width === Datas.Systems.SQUARE_SIZE && current.x === 0) {
								if (current.y === previous.y && current.height === previous.height) {
									c = true;
									boolGrid[a + k] = false;
									square.width += current.width;
								}
							}
						}
						if (!c || a + 1 >= w) {
							tempW = a - i + (c ? 1 : 0);
						}
					}
					let tempH = -1;
					for (let b = j + 1; b < h && tempH === -1; b++) {
						const kk = b * w;
						let c = true;
						for (let a = i; a < i + tempW; a++) {
							const previous = squares[a + kk - w];
							const current = squares[a + kk];
							if (
								!boolGrid[a + kk] ||
								previous.y + previous.height !== Datas.Systems.SQUARE_SIZE ||
								current.y !== 0 ||
								current.x !== previous.x ||
								current.width !== previous.width
							) {
								c = false;
							}
						}
						if (c) {
							for (let m = i; m < i + tempW; m++) {
								boolGrid[m + kk] = false;
							}
							const tempArray = squares[i + kk];
							square.height += tempArray === null ? 0 : tempArray.height;
							boolGrid[i + kk] = false;
						}
						if (!c || b + 1 >= h) {
							tempH = b - j + (c ? 1 : 0);
						}
					}
					result.push(square);
				}
			}
		}
		return result;
	}

	/**
	 * Compute bounding box values from rect and grid size.
	 */
	static getBB(rect: Rectangle, w: number, h: number): number[] {
		return [
			(rect.x - (w * Datas.Systems.SQUARE_SIZE - rect.x - rect.width)) / 2,
			h * Datas.Systems.SQUARE_SIZE - rect.y - rect.height / 2,
			0,
			rect.width,
			rect.height,
			1,
			0,
			0,
			0,
		];
	}

	/**
	 * Whether the square allows passage from all directions.
	 */
	hasAllDirections(): boolean {
		return this.left && this.right && this.top && this.bot;
	}

	/**
	 * Load collision square data from JSON.
	 */
	read(json: CollisionSquareJSON) {
		const rect = json.rec;
		this.left = Utils.valueOrDefault(json.l, true);
		this.right = Utils.valueOrDefault(json.r, true);
		this.top = Utils.valueOrDefault(json.t, true);
		this.bot = Utils.valueOrDefault(json.b, true);
		this.terrain = Utils.valueOrDefault(json.terrain, 0);
		this.climbing = Utils.valueOrDefault(json.c, false);
		if (rect !== undefined) {
			this.rect =
				rect === null
					? null
					: new Rectangle(
							Math.round((rect[0] * Datas.Systems.SQUARE_SIZE) / 100),
							Math.round((rect[1] * Datas.Systems.SQUARE_SIZE) / 100),
							Math.round((rect[2] * Datas.Systems.SQUARE_SIZE) / 100),
							Math.round((rect[3] * Datas.Systems.SQUARE_SIZE) / 100)
					  );
		}
	}
}
