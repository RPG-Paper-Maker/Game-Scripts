/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, PICTURE_KIND, Platform, Utils } from '../Common';
import { CollisionSquare, CollisionSquareJSON, Picture2D, Rectangle } from '../Core';
import { Data } from '../index';
import { Base } from './Base';

export type PictureJSON = {
	id: number;
	name: string;
	br: boolean;
	d?: string;
	base64?: string;
	col?: CollisionJSON[];
	rcol?: boolean;
	isStopAnimation?: boolean;
	ica?: boolean;
};

export type CollisionJSON = {
	k: [number, number];
	v: CollisionSquareJSON;
};

/** Represents a picture in the game. */
class Picture extends Base {
	public id: number;
	public kind: PICTURE_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public jsonCollisions: CollisionJSON[];
	public collisionsRepeat: boolean;
	public collisions: CollisionSquare[];
	public picture: Picture2D;
	public width: number;
	public height: number;
	public isStopAnimation: boolean;
	public isClimbAnimation: boolean;
	public borderLeft: number;
	public borderRight: number;

	constructor(json?: PictureJSON) {
		super(json);
	}

	/** Convert a picture kind to a string. */
	static pictureKindToString(kind: PICTURE_KIND): string {
		switch (kind) {
			case PICTURE_KIND.BARS:
				return 'bar';
			case PICTURE_KIND.ICONS:
				return 'icon';
			case PICTURE_KIND.AUTOTILES:
				return 'autotile';
			case PICTURE_KIND.CHARACTERS:
				return 'character';
			case PICTURE_KIND.MOUNTAINS:
				return 'mountain';
			case PICTURE_KIND.TILESETS:
				return 'tileset';
			case PICTURE_KIND.WALLS:
				return 'wall';
			case PICTURE_KIND.BATTLERS:
				return 'battler';
			case PICTURE_KIND.FACESETS:
				return 'faceset';
			case PICTURE_KIND.WINDOW_SKINS:
				return 'window skin';
			case PICTURE_KIND.TITLE_SCREEN:
				return 'title screen';
			case PICTURE_KIND.OBJECTS_3D:
				return 'object 3D';
			case PICTURE_KIND.PICTURES:
				return 'picture';
			case PICTURE_KIND.ANIMATIONS:
				return 'animation';
			case PICTURE_KIND.SKYBOXES:
				return 'skybox';
			case PICTURE_KIND.PARTICLES:
				return 'particles';
		}
		return '';
	}

	/** Get the folder path for a picture kind. */
	static getFolder(kind: PICTURE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Data.Systems.PATH_BR : dlc ? Data.Systems.PATH_DLCS + '/' + dlc : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/** Get the local folder name for a picture kind. */
	static getLocalFolder(kind: PICTURE_KIND): string {
		switch (kind) {
			case PICTURE_KIND.BARS:
				return Paths.BARS;
			case PICTURE_KIND.ICONS:
				return Paths.ICONS;
			case PICTURE_KIND.AUTOTILES:
				return Paths.AUTOTILES;
			case PICTURE_KIND.CHARACTERS:
				return Paths.CHARACTERS;
			case PICTURE_KIND.MOUNTAINS:
				return Paths.MOUNTAINS;
			case PICTURE_KIND.TILESETS:
				return Paths.TILESETS;
			case PICTURE_KIND.WALLS:
				return Paths.WALLS;
			case PICTURE_KIND.BATTLERS:
				return Paths.BATTLERS;
			case PICTURE_KIND.FACESETS:
				return Paths.FACESETS;
			case PICTURE_KIND.WINDOW_SKINS:
				return Paths.WINDOW_SKINS;
			case PICTURE_KIND.TITLE_SCREEN:
				return Paths.TITLE_SCREEN;
			case PICTURE_KIND.OBJECTS_3D:
				return Paths.OBJECTS_3D;
			case PICTURE_KIND.PICTURES:
				return Paths.HUD_PICTURES;
			case PICTURE_KIND.ANIMATIONS:
				return Paths.ANIMATIONS;
			case PICTURE_KIND.SKYBOXES:
				return Paths.SKYBOXES;
			case PICTURE_KIND.PARTICLES:
				return Paths.PARTICLES;
			case PICTURE_KIND.GAME_OVER:
				return Paths.GAME_OVER;
		}
		return '';
	}

	/** Load the picture image. */
	async load(): Promise<void> {
		this.picture = await Picture2D.create(this);
		if (this.base64) {
			this.base64 = '';
		}
	}

	/** Get number of rows (for characters). */
	getRows(): number {
		return this.kind === PICTURE_KIND.CHARACTERS
			? 4 + (this.isStopAnimation ? 4 : 0) + (this.isClimbAnimation ? 4 : 0)
			: 1;
	}

	/** Get absolute path of the picture. */
	getPath(): string {
		if (this.base64) {
			return this.base64;
		}
		if (this.picture) {
			return this.picture.path;
		}
		return this.id === -1 || !this.name ? '' : `${Picture.getFolder(this.kind, this.isBR, this.dlc)}/${this.name}`;
	}

	/** Read collisions from image. */
	readCollisionsImage(image: HTMLImageElement): void {
		this.width = Math.floor(image.width / Data.Systems.SQUARE_SIZE);
		this.height = Math.floor(image.height / Data.Systems.SQUARE_SIZE);
		this.readCollisions();
	}

	/** Read collision data (requires width & height set). */
	readCollisions(): void {
		if (!this.jsonCollisions) {
			return;
		}
		const w = this.width / Data.Systems.FRAMES;
		const h = this.height / this.getRows();
		this.collisions = Array(this.width * this.height).fill(null);
		for (const jsonTab of this.jsonCollisions) {
			const [x, y] = jsonTab.k;
			const index = x + y * this.width;
			const collision = new CollisionSquare();
			collision.read(jsonTab.v);
			this.collisions[index] = collision;
			if (this.collisionsRepeat) {
				for (let j = 0; j < Data.Systems.FRAMES; j++) {
					for (let k = 0; k < 4; k++) {
						this.collisions[x + j * w + (y + k * h) * this.width] = collision;
					}
				}
			}
		}
		this.jsonCollisions = null;
	}

	/** Get collision at a texture position. */
	getCollisionAt(rectangle: Rectangle): CollisionSquare | undefined {
		return this.getCollisionAtPos(rectangle.x, rectangle.y);
	}

	/** Get collision at x, y position. */
	getCollisionAtPos(x: number, y: number): CollisionSquare | undefined {
		return this.collisions[x + y * this.width];
	}

	/** Get collision by index. */
	getCollisionAtIndex(index: number): CollisionSquare | undefined {
		return this.getCollisionAtPos(index % this.width, Math.floor(index / this.width));
	}

	/**
	 * Computes collision rectangles for a wall texture.
	 * Validates the left, middle, and right wall columns according
	 * to the expected 3×SQUARE_SIZE template. Returns merged collision
	 * rectangles for the given region.
	 * @param texture - Rectangle defining the texture region.
	 * @returns Array of merged collision rectangles.
	 */
	getSquaresForWall(texture: Rectangle): Rectangle[] {
		const w = texture.width;
		const h = texture.height;
		const l = w * h;
		const squares = new Array<Rectangle | null>(l);
		for (let i = 0; i < l; i++) {
			const x = texture.x + (i % w);
			const y = texture.y + Math.floor(i / w);
			if (x === 3) {
				const leftSquare = this.getCollisionAtPos(0, y);
				const rightSquare = this.getCollisionAtPos(2, y);
				if (leftSquare === null && rightSquare === null) {
					squares[i] = null;
				} else if (leftSquare === null || rightSquare === null) {
					const square = leftSquare === null ? rightSquare : leftSquare;
					if (!square) {
						Platform.showErrorMessage(
							`Your wall image ${this.name} is not using a correct template. 
							Your image should be this size: WIDTH: 3 * SQUARE_SIZE, HEIGHT: as you wish. 
							There should be left wall, middle wall, and right wall for the 3 width squares.`
						);
						return;
					}
					squares[i] = square.rect;
				} else {
					squares[i] = new Rectangle(0, 0, Data.Systems.SQUARE_SIZE, Data.Systems.SQUARE_SIZE);
				}
			} else {
				const square = this.getCollisionAtPos(x, y);
				squares[i] = square?.rect ?? null;
			}
		}
		return CollisionSquare.unionSquares(squares, l, w, h);
	}

	/**
	 * Computes collision rectangles for a texture region.
	 * Iterates over each cell of the given rectangle and collects
	 * collision data, merging them into larger rectangles.
	 * @param texture - Rectangle defining the texture region.
	 * @returns Array of merged collision rectangles.
	 */
	getSquaresForTexture(texture: Rectangle): (Rectangle | null)[] {
		const w = texture.width;
		const h = texture.height;
		const l = w * h;
		const squares = new Array<Rectangle | null>(l);
		for (let i = 0; i < l; i++) {
			const square = this.getCollisionAtPos(texture.x + (i % w), texture.y + Math.floor(i / w));
			squares[i] = square?.rect ?? null;
		}
		return CollisionSquare.unionSquares(squares, l, w, h);
	}

	/**
	 * Compute collision rectangles for all animation states of a character image.
	 * Divides the texture into frames and directions (up, down, left, right),
	 * then computes the collision squares for each state.
	 * @param image - Character spritesheet image.
	 * @returns Array of collision rectangles per state (frames × 4 directions).
	 */
	getSquaresForStates(image: HTMLImageElement): Rectangle[][] {
		const w = Math.floor(image.width / Data.Systems.SQUARE_SIZE / Data.Systems.FRAMES);
		const h = Math.floor(image.height / Data.Systems.SQUARE_SIZE / this.getRows());
		const states = new Array<(Rectangle | null)[]>(Data.Systems.FRAMES * 4);
		for (let i = 0; i < Data.Systems.FRAMES; i++) {
			for (let j = 0; j < 4; j++) {
				states[i + j * Data.Systems.FRAMES] = this.getSquaresForTexture(new Rectangle(i * w, j * h, w, h));
			}
		}
		return states;
	}

	/**
	 * Detects left and right transparent borders of a bar image
	 * and sets `borderLeft` / `borderRight` for scaling purposes.
	 */
	checkBarBorder(): void {
		if (this.picture.image) {
			Platform.ctxr.drawImage(this.picture.image, 0, 0);
			let isTransparent = true;
			let x: number;
			for (x = this.picture.image.width / 2; x < this.picture.image.width; x++) {
				for (let y = 0; y < this.picture.image.height; y++) {
					if (Platform.ctxr.getImageData(x, y, 1, 1).data[3] !== 0) {
						isTransparent = false;
						break;
					}
				}
				if (!isTransparent) {
					break;
				}
			}
			this.borderLeft = x - this.picture.image.width / 2;
			isTransparent = true;
			for (x = this.picture.image.width - 1; x >= 0; x--) {
				for (let y = 0; y < this.picture.image.height; y++) {
					if (Platform.ctxr.getImageData(x, y, 1, 1).data[3] !== 0) {
						isTransparent = false;
						break;
					}
				}
				if (!isTransparent) {
					break;
				}
			}
			this.borderRight = this.picture.image.width - x - 1;
		}
	}

	/**
	 * Gets the relative positions of all climbing squares in a texture region.
	 * @param texture Rectangle defining the texture area.
	 * @returns Array of [x, y] positions of climbing squares.
	 */
	getSquaresClimbing(texture: Rectangle): [number, number][] {
		const w = texture.width;
		const h = texture.height;
		const squares = [];
		for (let i = w * h - 1; i >= 0; i--) {
			const x = i % w;
			const y = Math.floor(i / w);
			const square = this.getCollisionAtPos(texture[0] + x, texture[1] + y);
			if (square && square.climbing) {
				squares.push([x, y]);
			}
		}
		return squares;
	}

	/** Read JSON data to initialize the picture. */
	read(json: PictureJSON): void {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.valueOrDefault(json.d, '');
		this.base64 = json.base64;
		this.jsonCollisions = Utils.valueOrDefault(json.col, []);
		this.collisionsRepeat = Utils.valueOrDefault(json.rcol, false);
		this.isStopAnimation = Utils.valueOrDefault(json.isStopAnimation, false);
		this.isClimbAnimation = Utils.valueOrDefault(json.ica, false);
	}
}

export { Picture };
