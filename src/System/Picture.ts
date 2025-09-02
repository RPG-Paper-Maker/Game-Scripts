/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths, PICTURE_KIND, Platform, Utils } from '../Common';
import { CollisionSquare, Picture2D } from '../Core';
import { Datas } from '../index';
import { Base } from './Base';

/** @class
 *  A picture of the game.
 *  @extends {System.Base}
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  picture
 *  @param {PICTURE_KIND} [kind=PICTURE_KIND.Pictures] - The kind of picture
 */
class Picture extends Base {
	public id: number;
	public kind: PICTURE_KIND;
	public name: string;
	public isBR: boolean;
	public dlc: string;
	public base64: string;
	public jsonCollisions: Record<string, any>[];
	public collisionsRepeat: boolean;
	public collisions: CollisionSquare[];
	public picture: Picture2D;
	public width: number;
	public height: number;
	public isStopAnimation: boolean;
	public isClimbAnimation: boolean;
	public borderLeft: number;
	public borderRight: number;

	constructor(json?: Record<string, any>, kind: PICTURE_KIND = PICTURE_KIND.PICTURES) {
		super(json, kind);
	}

	/**
	 *  Assign the default members.
	 *  @param {any[]} args
	 */
	public setup(args: any[]) {
		this.kind = args[0];
	}

	/**
	 *  Get string of picture kind.
	 *  @param {PICTURE_KIND} kind - The picture kind
	 *  @returns {string}
	 */
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

	/**
	 *  Get the folder associated to a kind of picture.
	 *  @static
	 *  @param {PICTURE_KIND} kind - The kind of picture
	 *  @param {boolean} isBR - Indicate if the picture is a BR
	 *  @param {string} dlc - The picture DLC name (if exists)
	 *  @returns {string}
	 */
	static getFolder(kind: PICTURE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR ? Datas.Systems.PATH_BR : dlc ? Datas.Systems.PATH_DLCS + '/' + dlc : Platform.ROOT_DIRECTORY) +
			this.getLocalFolder(kind)
		);
	}

	/**
	 *  Get the local folder associated to a kind of picture.
	 *  @static
	 *  @param {PICTURE_KIND} kind - The kind of picture
	 *  @returns {string}
	 */
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

	/**
	 *  Read the JSON associated to the picture.
	 *  @param {Object} json - Json object describing the picture
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.name = json.name;
		this.isBR = json.br;
		this.dlc = Utils.defaultValue(json.d, '');
		this.base64 = json.base64;
		this.jsonCollisions = Utils.defaultValue(json.col, []);
		this.collisionsRepeat = Utils.defaultValue(json.rcol, false);
		this.isStopAnimation = Utils.defaultValue(json.isStopAnimation, false);
		this.isClimbAnimation = Utils.defaultValue(json.ica, false);
	}

	/**
	 *  Read the JSON associated to the picture.
	 *  @async
	 */
	async load() {
		this.picture = await Picture2D.create(this);
		if (this.base64) {
			this.base64 = '';
		}
	}

	/**
	 *  Get the number of rows for the picture (used for characters).
	 *  @returns {number}
	 */
	getRows(): number {
		switch (this.kind) {
			case PICTURE_KIND.CHARACTERS:
				return 4 + (this.isStopAnimation ? 4 : 0) + (this.isClimbAnimation ? 4 : 0);
			default:
				return 1;
		}
	}

	/**
	 *  Get the absolute path associated to this picture.
	 *  @returns {string}
	 */
	getPath(): string {
		if (this.base64) {
			return this.base64;
		}
		if (this.picture) {
			return this.picture.path;
		}
		return this.id === -1 || !this.name ? '' : Picture.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}

	/**
	 *  Read collisions according to image size.
	 *  @param {HTMLImageElement} image - The image texture
	 */
	readCollisionsImage(image: HTMLImageElement) {
		this.width = Math.floor(image.width / Datas.Systems.SQUARE_SIZE);
		this.height = Math.floor(image.height / Datas.Systems.SQUARE_SIZE);
		this.readCollisions();
	}

	/**
	 *  Read collisions, we assume that this.width and this.height had been
	 *  edited.
	 */
	readCollisions() {
		if (!this.jsonCollisions) {
			return;
		}

		// Initialize
		const w = this.width / Datas.Systems.FRAMES;
		const h = this.height / this.getRows();
		this.collisions = new Array(this.width * this.height);
		let i: number, l: number;
		for (i = 0, l = this.width * this.height; i < l; i++) {
			this.collisions[i] = null;
		}

		// Insert collision
		let j: number,
			k: number,
			jsonTab: Record<string, any>,
			jsonKey: number[],
			jsonVal: Record<string, any>,
			index: number,
			collision: CollisionSquare;
		for (i = 0, l = this.jsonCollisions.length; i < l; i++) {
			jsonTab = this.jsonCollisions[i];
			jsonKey = jsonTab.k;
			jsonVal = jsonTab.v;
			index = jsonKey[0] + jsonKey[1] * this.width;
			collision = new CollisionSquare();
			collision.read(jsonVal);
			this.collisions[index] = collision;
			if (this.collisionsRepeat) {
				for (j = 0; j < Datas.Systems.FRAMES; j++) {
					for (k = 0; k < 4; k++) {
						this.collisions[jsonKey[0] + j * w + (jsonKey[1] + k * h) * this.width] = collision;
					}
				}
			}
		}
		this.jsonCollisions = null;
	}

	/**
	 *  Get a specific collision square according to texture.
	 *  @param {number[]} pos - Texture position
	 *  @returns {CollisionSquare}
	 */
	getCollisionAt(pos: number[]): CollisionSquare {
		return this.getCollisionAtPos(pos[0], pos[1]);
	}

	/**
	 *  Get a specific collision square according to texture.
	 *  @param {number} x - Texture x position
	 *  @param {number} y - Texture y position
	 *  @returns {CollisionSquare}
	 */
	getCollisionAtPos(x: number, y: number): CollisionSquare {
		return this.collisions[x + y * this.width];
	}

	/**
	 *  Get a specific collision square according to index.
	 *  @param {number} index - The index positions
	 *  @returns {CollisionSquare}
	 */
	getCollisionAtIndex(index: number): CollisionSquare {
		return this.getCollisionAtPos(index % this.width, Math.floor(index / this.width));
	}

	/**
	 *  Get a specific collision for wall.
	 *  @param {number[]} texture - Texture position
	 *  @returns {number[][]}
	 */
	getSquaresForWall(texture: number[]): number[][] {
		const w = texture[2];
		const h = texture[3];
		const l = w * h;
		const squares = new Array(l);
		let x: number, y: number, leftSquare: CollisionSquare, rightSquare: CollisionSquare, square: CollisionSquare;
		for (let i = 0; i < l; i++) {
			x = texture[0] + (i % w);
			y = texture[1] + Math.floor(i / w);
			if (x === 3) {
				leftSquare = this.getCollisionAtPos(0, y);
				rightSquare = this.getCollisionAtPos(2, y);
				if (leftSquare === null && rightSquare === null) {
					squares[i] = null;
				} else if (leftSquare === null || rightSquare === null) {
					square = leftSquare === null ? rightSquare : leftSquare;
					if (!square) {
						Platform.showErrorMessage(
							'Your wall image ' +
								this.name +
								' is not using a correct template. Your image ' +
								'should be this size: WIDTH: 3 * SQUARE_SIZE, ' +
								'HEIGHT: as you wish. There should be left wall, ' +
								'middle wall, and right wall for the 3 width ' +
								'squares.'
						);
						return;
					}
					squares[i] = square.rect;
				} else {
					squares[i] = [0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems.SQUARE_SIZE];
				}
			} else {
				square = this.getCollisionAtPos(x, y);
				squares[i] = square ? square.rect : null;
			}
		}
		return CollisionSquare.unionSquares(squares, l, w, h);
	}

	/**
	 *  Get a specific collision square according to texture.
	 *  @param {number[]} texture - Texture position
	 *  @returns {number[][]}
	 */
	getSquaresForTexture(texture: number[]): number[][] {
		const w = texture[2];
		const h = texture[3];
		const l = w * h;
		const squares = new Array(l);
		let square: CollisionSquare;
		for (let i = 0; i < l; i++) {
			square = this.getCollisionAtPos(texture[0] + (i % w), texture[1] + Math.floor(i / w));
			squares[i] = square ? square.rect : null;
		}
		return CollisionSquare.unionSquares(squares, l, w, h);
	}

	/**
	 *  Get a specific collision square according to texture
	 *  @param {THREE.Image} image - The image texture
	 *  @returns {number[][][]}
	 */
	getSquaresForStates(image: any): number[][] {
		const w = Math.floor(image.width / Datas.Systems.SQUARE_SIZE / Datas.Systems.FRAMES);
		const h = Math.floor(image.height / Datas.Systems.SQUARE_SIZE / this.getRows());
		const states = new Array(Datas.Systems.FRAMES * 4);
		let j: number;
		for (let i = 0; i < Datas.Systems.FRAMES; i++) {
			for (j = 0; j < 4; j++) {
				states[i + j * Datas.Systems.FRAMES] = this.getSquaresForTexture([i * w, j * h, w, h]);
			}
		}
		return states;
	}

	/**
	 *  Check the borders to cut for filled bar.
	 */
	checkBarBorder() {
		if (this.picture.image) {
			Platform.ctxr.drawImage(this.picture.image, 0, 0);
			let x = this.picture.image.width / 2;
			let y = 0;
			let isTransparent = true;
			for (; x < this.picture.image.width; x++) {
				for (y = 0; y < this.picture.image.height; y++) {
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
				for (y = 0; y < this.picture.image.height; y++) {
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

	getSquaresClimbing(texture: number[]): [number, number][] {
		const w = texture[2];
		const h = texture[3];
		const squares = [];
		let square: CollisionSquare, x: number, y: number;
		for (let i = w * h - 1; i >= 0; i--) {
			x = i % w;
			y = Math.floor(i / w);
			square = this.getCollisionAtPos(texture[0] + x, texture[1] + y);
			if (square && square.climbing) {
				squares.push([x, y]);
			}
		}
		return squares;
	}
}

export { Picture };
