/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants, Paths, PICTURE_KIND, Platform, Utils } from '../Common';
import { Autotiles, Game, Picture2D, TextureBundle } from '../Core';
import { Data, Manager, Model, Scene } from '../index';

/** @class
 *  All the special elements datas.
 *  @static
 */
class SpecialElements {
	public static autotiles: Model.Autotile[];
	public static walls: Model.SpecialElement[];
	public static mountains: Model.Mountain[];
	public static objects: Model.Object3D[];
	public static texturesAutotiles: TextureBundle[][] = [];
	public static texturesWalls: THREE.MeshPhongMaterial[] = [];
	public static texturesObjects3D: THREE.MeshPhongMaterial[] = [];
	public static texturesMountains: TextureBundle[] = [];

	constructor() {
		throw new Error('This is a static class!');
	}

	/**
	 *  Read the JSON file associated to special elements.
	 */
	static async read() {
		const json = (await Platform.parseFileJSON(Paths.FILE_SPECIAL_ELEMENTS)) as any;
		this.autotiles = [];
		Utils.readJSONSystemList({ list: json.autotiles, listIDs: this.autotiles, cons: Model.Autotile });
		this.walls = [];
		Utils.readJSONSystemList({ list: json.walls, listIDs: this.walls, cons: Model.SpecialElement });
		this.mountains = [];
		Utils.readJSONSystemList({ list: json.m, listIDs: this.mountains, cons: Model.Mountain });
		this.objects = [];
		Utils.readJSONSystemList({ list: json.o, listIDs: this.objects, cons: Model.Object3D });
	}

	/**
	 *  Get the autotile by ID.
	 *  @param {number} id
	 *  @returns {System.Autotile}
	 */
	static getAutotile(id: number): Model.Autotile {
		return Data.Base.get(id, this.autotiles, 'autotile');
	}

	/**
	 *  Get the wall by ID.
	 *  @param {number} id
	 *  @returns {System.SpecialElement}
	 */
	static getWall(id: number): Model.SpecialElement {
		return Data.Base.get(id, this.walls, 'wall');
	}

	/**
	 *  Get the mountain by ID.
	 *  @param {number} id
	 *  @returns {System.Mountain}
	 */
	static getMountain(id: number): Model.Mountain {
		return Data.Base.get(id, this.mountains, 'mountain');
	}

	/**
	 *  Get the object 3D by ID.
	 *  @param {number} id
	 *  @returns {System.Object3D}
	 */
	static getObject3D(id: number): Model.Object3D {
		return Data.Base.get(id, this.objects, 'object 3D');
	}

	/**
	 *  Get the max possible offset of an autotile texture.
	 *  @returns {number}
	 */
	static getMaxAutotilesOffsetTexture(): number {
		return Math.floor(Constants.MAX_PICTURE_SIZE / (9 * Data.Systems.SQUARE_SIZE));
	}

	/**
	 *  Get the autotile texture.
	 *  @param {number} id
	 *  @returns {Promise<TextureBundle>}
	 */
	static async loadAutotileTexture(id: number): Promise<TextureBundle[]> {
		const autotile = this.getAutotile(id);
		let pictureID = Game.current.textures.autotiles[id];
		if (pictureID === undefined) {
			pictureID = autotile.pictureID;
		}
		let texturesAutotile = this.texturesAutotiles[pictureID];
		if (texturesAutotile === undefined) {
			let offset = 0;
			let result = null;
			let textureAutotile: TextureBundle = null;
			let texture = new THREE.Texture();
			texturesAutotile = [];
			this.texturesAutotiles[pictureID] = texturesAutotile;
			Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
			Platform.canvasRendering.width = 64 * Data.Systems.SQUARE_SIZE;
			Platform.canvasRendering.height = Constants.MAX_PICTURE_SIZE;
			if (autotile) {
				const picture = Data.Pictures.get(PICTURE_KIND.AUTOTILES, pictureID);
				if (picture) {
					result = await this.loadTextureAutotile(
						textureAutotile,
						texture,
						picture,
						offset,
						autotile.isAnimated
					);
					picture.readCollisions();
				} else {
					result = null;
				}
			} else {
				result = null;
			}
			if (result !== null) {
				textureAutotile = result[0];
				texture = result[1];
				offset = result[2];
			}
			if (offset > 0) {
				await this.updateTextureAutotile(textureAutotile, texture, pictureID);
			}
		}
		return texturesAutotile;
	}
	/**
	 *  Load an autotile ID and add it to context rendering.
	 *  @param {TextureBundle} textureAutotile - The autotile several texture
	 *  @param {THREE.Texture} texture - The texture to paint on
	 *  @param {System.Picture} picture - The picture to paint
	 *  @param {number} offset - The offset
	 *  @param {boolean} isAnimated
	 *  @returns {any[]}
	 */
	static async loadTextureAutotile(
		textureAutotile: TextureBundle,
		texture: THREE.Texture,
		picture: Model.Picture,
		offset: number,
		isAnimated: boolean
	): Promise<any[]> {
		const frames = isAnimated ? Data.Systems.autotilesFrames : 1;
		const picture2D = await Picture2D.create(picture);

		// Check if correct format size
		this.checkPictureSize(
			'autotile',
			picture.name,
			picture2D.image.width,
			picture2D.image.height,
			2 * Data.Systems.SQUARE_SIZE * frames,
			3 * Data.Systems.SQUARE_SIZE,
			false,
			false
		);

		// Get width and height
		const width = Math.floor(picture2D.image.width / 2 / Data.Systems.SQUARE_SIZE) / frames;
		const height = Math.floor(picture2D.image.height / 3 / Data.Systems.SQUARE_SIZE);
		const size = width * height;

		// Update picture width and height for collisions settings
		picture.width = width;
		picture.height = height;
		let j: number, point: number[], p: number[];
		for (let i = 0; i < size; i++) {
			point = [i % width, Math.floor(i / width)];
			if (isAnimated) {
				if (textureAutotile != null) {
					await this.updateTextureAutotile(textureAutotile, texture, picture.id);
					texture = new THREE.Texture();
					Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
					textureAutotile = null;
				}
				offset = 0;
			}
			if (offset === 0 && textureAutotile === null) {
				textureAutotile = new TextureBundle();
				textureAutotile.setBegin(picture.id, point);
				textureAutotile.isAnimated = isAnimated;
			}
			for (j = 0; j < frames; j++) {
				p = [point[0] * frames + j, point[1]];
				this.paintPictureAutotile(picture2D.image, offset, p);
				offset++;
			}
			textureAutotile.setEnd(picture.id, point);
			textureAutotile.addToList(picture.id, point);
			if (!isAnimated && offset === this.getMaxAutotilesOffsetTexture()) {
				await this.updateTextureAutotile(textureAutotile, texture, picture.id);
				texture = new THREE.Texture();
				Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
				textureAutotile = null;
				offset = 0;
			}
		}
		return [textureAutotile, texture, offset];
	}

	/**
	 *  Paint the picture in texture.
	 *  @param {Image} img - The image to draw
	 *  @param {number} offset - The offset
	 *  @param {number[]} point - The in several texture
	 *  @param {number} id - The autotile id
	 */
	static paintPictureAutotile(img: HTMLImageElement, offset: number, point: number[]) {
		let row = -1;
		const offsetX = point[0] * 2 * Data.Systems.SQUARE_SIZE;
		const offsetY = point[1] * 3 * Data.Systems.SQUARE_SIZE;
		const sDiv = Math.floor(Data.Systems.SQUARE_SIZE / 2);
		const y = offset * Autotiles.COUNT_LIST * 2;
		let a: number, b: number, c: number, d: number, count: number, lA: number, lB: number, lC: number, lD: number;
		for (a = 0; a < Autotiles.COUNT_LIST; a++) {
			lA = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_A[a]];
			count = 0;
			row++;
			for (b = 0; b < Autotiles.COUNT_LIST; b++) {
				lB = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_B[b]];
				for (c = 0; c < Autotiles.COUNT_LIST; c++) {
					lC = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_C[c]];
					for (d = 0; d < Autotiles.COUNT_LIST; d++) {
						lD = Autotiles.AUTOTILE_BORDER[Autotiles.LIST_D[d]];

						// Draw
						Platform.ctxr.drawImage(
							img,
							(lA % 4) * sDiv + offsetX,
							Math.floor(lA / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Data.Systems.SQUARE_SIZE,
							(row + y) * Data.Systems.SQUARE_SIZE,
							sDiv,
							sDiv
						);
						Platform.ctxr.drawImage(
							img,
							(lB % 4) * sDiv + offsetX,
							Math.floor(lB / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Data.Systems.SQUARE_SIZE + sDiv,
							(row + y) * Data.Systems.SQUARE_SIZE,
							sDiv,
							sDiv
						);
						Platform.ctxr.drawImage(
							img,
							(lC % 4) * sDiv + offsetX,
							Math.floor(lC / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Data.Systems.SQUARE_SIZE,
							(row + y) * Data.Systems.SQUARE_SIZE + sDiv,
							sDiv,
							sDiv
						);
						Platform.ctxr.drawImage(
							img,
							(lD % 4) * sDiv + offsetX,
							Math.floor(lD / 4) * sDiv + offsetY,
							sDiv,
							sDiv,
							count * Data.Systems.SQUARE_SIZE + sDiv,
							(row + y) * Data.Systems.SQUARE_SIZE + sDiv,
							sDiv,
							sDiv
						);
						count++;
						if (count === 64) {
							count = 0;
							row++;
						}
					}
				}
			}
		}
	}

	/**
	 *  Update texture of a TextureAutotile.
	 *  @param {TextureBundle} textureAutotile - The autotile several texture
	 *  @param {THREE.Texture} texture - The texture to paint on
	 *  @param {number} id - The autotile picture ID
	 */
	static async updateTextureAutotile(textureAutotile: TextureBundle, texture: THREE.Texture, id: number) {
		texture.image = await Picture2D.loadImage(Platform.canvasRendering.toDataURL());
		texture.needsUpdate = true;
		textureAutotile.material = Manager.GL.createMaterial({ texture: texture });
		textureAutotile.material.userData.uniforms.offset.value = textureAutotile.isAnimated
			? Scene.Map.autotilesOffset
			: new THREE.Vector2();
		this.texturesAutotiles[id].push(textureAutotile);
	}

	/**
	 *  Get the wall texture.
	 *  @param {number} id
	 *  @returns {Promise<THREE.MeshPhongMaterial>}
	 */
	static async loadWallTexture(id: number): Promise<THREE.MeshPhongMaterial> {
		const wall = this.getWall(id);
		let pictureID = Game.current.textures.walls[id];
		if (pictureID === undefined) {
			pictureID = wall.pictureID;
		}
		let textureWall = this.texturesWalls[pictureID];
		if (textureWall === undefined) {
			if (wall) {
				const picture = Data.Pictures.get(PICTURE_KIND.WALLS, pictureID);
				if (picture) {
					textureWall = await this.loadTextureWall(picture, id);
				} else {
					textureWall = Manager.GL.loadTextureEmpty();
				}
				picture.readCollisions();
			} else {
				textureWall = Manager.GL.loadTextureEmpty();
			}
			this.texturesWalls[pictureID] = textureWall;
		}
		return textureWall;
	}

	/**
	 *  Load a wall texture.
	 *  @param {System.Picture} picture - The picture to load
	 *  @param {number} id - The picture id
	 *  @returns {THREE.MeshPhongMaterial}
	 */
	static async loadTextureWall(picture: Model.Picture, id: number): Promise<THREE.MeshPhongMaterial> {
		const picture2D = await Picture2D.create(picture);
		const texture = new THREE.Texture();
		const w = picture2D.image.width;
		const h = picture2D.image.height;
		if (w === 0 || h === 0) {
			return Manager.GL.loadTextureEmpty();
		}

		// Check if correct format size
		this.checkPictureSize(
			'wall',
			picture.name,
			picture2D.image.width,
			picture2D.image.height,
			3 * Data.Systems.SQUARE_SIZE,
			Data.Systems.SQUARE_SIZE,
			true,
			false
		);

		// Update picture infos for collisions
		picture.width = Math.floor(w / Data.Systems.SQUARE_SIZE);
		picture.height = Math.floor(h / Data.Systems.SQUARE_SIZE);
		Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
		Platform.canvasRendering.width = w + Data.Systems.SQUARE_SIZE;
		Platform.canvasRendering.height = h;
		Platform.ctxr.drawImage(picture2D.image, 0, 0);
		const left = Platform.ctxr.getImageData(0, 0, Math.floor(Data.Systems.SQUARE_SIZE / 2), h);
		const right = Platform.ctxr.getImageData(
			w - Math.floor(Data.Systems.SQUARE_SIZE / 2),
			0,
			Math.floor(Data.Systems.SQUARE_SIZE / 2),
			picture2D.image.height
		);
		try {
			Platform.ctxr.putImageData(left, w, 0);
			Platform.ctxr.putImageData(right, w + Math.floor(Data.Systems.SQUARE_SIZE / 2), 0);
		} catch (e) {
			Platform.showErrorMessage(
				'Error: Wrong wall (with ID:' + id + ') parsing. Please verify that you have a 3 x 3 picture.'
			);
		}
		texture.image = await Picture2D.loadImage(Platform.canvasRendering.toDataURL());
		texture.needsUpdate = true;
		return Manager.GL.createMaterial({ texture: texture });
	}

	/**
	 *  Get the max possible offset of a mountain texture.
	 *  @returns {number}
	 */
	static getMaxMountainOffsetTexture(): number {
		return Math.floor(Constants.MAX_PICTURE_SIZE / (4 * Data.Systems.SQUARE_SIZE));
	}

	/**
	 *  Get the mountain texture.
	 *  @param {number} id
	 *  @returns {Promise<TextureBundle>}
	 */
	static async loadMountainTexture(id: number): Promise<TextureBundle> {
		const mountain = this.getMountain(id);
		let pictureID = Game.current.textures.mountains[id];
		if (pictureID === undefined) {
			pictureID = mountain.pictureID;
		}
		let textureMountain = this.texturesMountains[pictureID];
		if (textureMountain === undefined) {
			textureMountain = null;
			let offset = 0;
			let result = null;
			let texture = new THREE.Texture();
			Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
			Platform.canvasRendering.width = 4 * Data.Systems.SQUARE_SIZE;
			Platform.canvasRendering.height = 7 * Data.Systems.SQUARE_SIZE;
			this.texturesMountains = [];
			const picture = mountain ? Data.Pictures.get(PICTURE_KIND.MOUNTAINS, pictureID) : null;
			result = await this.loadTextureMountain(textureMountain, texture, picture, offset, id);
			if (result !== null) {
				textureMountain = result[0];
				texture = result[1];
				offset = result[2];
			}
			if (offset > 0) {
				await this.updateTextureMountain(textureMountain, texture, pictureID);
			}
		}
		return textureMountain;
	}

	/**
	 *  Load a mountain ID and add it to context rendering
	 *  @param {TextureBundle} textureMountain - The mountain several texture
	 *  @param {THREE.Texture} texture - The texture to paint on
	 *  @param {System.Picture} picture - The picture to paint
	 *  @param {number} offset - The offset
	 *  @param {number} id - The picture id
	 *  @returns {any[]}
	 */
	static async loadTextureMountain(
		textureMountain: TextureBundle,
		texture: THREE.Texture,
		picture: Model.Picture,
		offset: number,
		id: number
	): Promise<any[]> {
		const picture2D = await Picture2D.create(picture);
		const width = 3;
		const height = 3;
		const size = 9;

		// Check if correct format size
		this.checkPictureSize(
			'mountain',
			picture.name,
			picture2D.image.width,
			picture2D.image.height,
			3 * Data.Systems.SQUARE_SIZE,
			3 * Data.Systems.SQUARE_SIZE,
			true,
			true
		);

		// Update picture width and height for collisions settings
		if (picture) {
			picture.width = width;
			picture.height = height;
		}
		let point: number[];
		for (let i = 0; i < size; i++) {
			point = [i % width, Math.floor(i / width)];
			if (offset === 0 && textureMountain === null) {
				textureMountain = new TextureBundle();
				textureMountain.setBegin(picture.id, point);
			}
			if (picture) {
				this.paintPictureMountain(picture2D.image, offset, id);
			}
			textureMountain.setEnd(picture.id, point);
			textureMountain.addToList(picture.id, point);
			offset++;
			if (offset === this.getMaxMountainOffsetTexture()) {
				await this.updateTextureMountain(textureMountain, texture, picture.id);
				texture = new THREE.Texture();
				Platform.ctxr.clearRect(0, 0, Platform.canvasRendering.width, Platform.canvasRendering.height);
				textureMountain = null;
				offset = 0;
			}
		}
		return [textureMountain, texture, offset];
	}

	/**
	 *  Paint the picture in texture.
	 *  @param {HTMLImageElement} img - The image to draw
	 *  @param {number} offset - The offset
	 *  @param {number} id - The picture id
	 */
	static paintPictureMountain(img: HTMLImageElement, offset: number, id: number) {
		const y = offset * 4 * Data.Systems.SQUARE_SIZE;
		const sourceSize = 3 * Data.Systems.SQUARE_SIZE;
		const sDiv = Math.round(Data.Systems.SQUARE_SIZE / 2);

		// Draw original image
		Platform.ctxr.drawImage(img, 0, y);

		// Add left/right autos
		try {
			let i: number, l: number;
			for (i = 0, l = 3; i < l; i++) {
				Platform.ctxr.drawImage(
					img,
					0,
					i * Data.Systems.SQUARE_SIZE,
					sDiv,
					Data.Systems.SQUARE_SIZE,
					sourceSize,
					y + i * Data.Systems.SQUARE_SIZE,
					sDiv,
					Data.Systems.SQUARE_SIZE
				);
				Platform.ctxr.drawImage(
					img,
					sourceSize - sDiv,
					i * Data.Systems.SQUARE_SIZE,
					sDiv,
					Data.Systems.SQUARE_SIZE,
					sourceSize + sDiv,
					y + i * Data.Systems.SQUARE_SIZE,
					sDiv,
					Data.Systems.SQUARE_SIZE
				);
			}

			// Add top/bot autos
			for (i = 0, l = 3; i < l; i++) {
				Platform.ctxr.drawImage(
					img,
					i * Data.Systems.SQUARE_SIZE,
					0,
					Data.Systems.SQUARE_SIZE,
					sDiv,
					i * Data.Systems.SQUARE_SIZE,
					y + sourceSize,
					Data.Systems.SQUARE_SIZE,
					sDiv
				);
				Platform.ctxr.drawImage(
					img,
					i * Data.Systems.SQUARE_SIZE,
					sourceSize - sDiv,
					Data.Systems.SQUARE_SIZE,
					sDiv,
					i * Data.Systems.SQUARE_SIZE,
					y + sourceSize + sDiv,
					Data.Systems.SQUARE_SIZE,
					sDiv
				);
			}

			// Add all sides autos
			Platform.ctxr.drawImage(img, 0, 0, sDiv, sDiv, sourceSize, y + sourceSize, sDiv, sDiv);
			Platform.ctxr.drawImage(
				img,
				sourceSize - sDiv,
				0,
				sDiv,
				sDiv,
				sourceSize + sDiv,
				y + sourceSize,
				sDiv,
				sDiv
			);
			Platform.ctxr.drawImage(
				img,
				0,
				sourceSize - sDiv,
				sDiv,
				sDiv,
				sourceSize,
				y + sourceSize + sDiv,
				sDiv,
				sDiv
			);
			Platform.ctxr.drawImage(
				img,
				sourceSize - sDiv,
				sourceSize - sDiv,
				sDiv,
				sDiv,
				sourceSize + sDiv,
				y + sourceSize + sDiv,
				sDiv,
				sDiv
			);

			// Repeated mid (for corners)
			for (let i = 0, l = 3; i < l; i++) {
				for (let j = 0, m = 4; j < m; j++) {
					Platform.ctxr.drawImage(
						img,
						Data.Systems.SQUARE_SIZE,
						i * Data.Systems.SQUARE_SIZE,
						Data.Systems.SQUARE_SIZE,
						Data.Systems.SQUARE_SIZE,
						j * Data.Systems.SQUARE_SIZE,
						(4 + i) * Data.Systems.SQUARE_SIZE,
						Data.Systems.SQUARE_SIZE,
						Data.Systems.SQUARE_SIZE
					);
				}
			}
		} catch (e) {
			Platform.showErrorMessage(
				'Error: Wrong mountain (with ID:' + id + ') parsing. Please verify that you have a 3 x 3 picture.'
			);
		}
	}

	/**
	 *  Update texture of a TextureSeveral.
	 *  @param {TextureBundle} textureMountain - The mountain several texture
	 *  @param {THREE.Texture} texture - The texture to paint on
	 *  @param {number} id - The picture ID
	 */
	static async updateTextureMountain(textureMountain: TextureBundle, texture: THREE.Texture, id: number) {
		texture.image = await Picture2D.loadImage(Platform.canvasRendering.toDataURL());
		texture.needsUpdate = true;
		textureMountain.material = Manager.GL.createMaterial({ texture: texture, side: THREE.BackSide });
		this.texturesMountains[id] = textureMountain;
	}

	/**
	 *  Get the wall texture.
	 *  @param {number} id
	 *  @returns {Promise<THREE.MeshPhongMaterial>}
	 */
	static async loadObject3DTexture(id: number): Promise<THREE.MeshPhongMaterial> {
		const object3D = this.getObject3D(id);
		let pictureID = Game.current.textures.objects3D[id];
		if (pictureID === undefined) {
			pictureID = object3D.pictureID;
		}
		let textureObject3D = this.texturesObjects3D[pictureID];
		if (textureObject3D === undefined) {
			const picture = Data.Pictures.get(PICTURE_KIND.OBJECTS_3D, pictureID);
			if (picture) {
				const path = picture.getPath();
				textureObject3D = path ? await Manager.GL.loadTexture(path) : Manager.GL.loadTextureEmpty();
			} else {
				textureObject3D = Manager.GL.loadTextureEmpty();
			}
			this.texturesObjects3D[pictureID] = textureObject3D;
		}
		return textureObject3D;
	}

	/**
	 *  Check if a special element picture is in correct format size.
	 *  @param {string} type The type of special element as a string
	 *  @param {string} name The name of the picture
	 *  @param {number} w The picture width
	 *  @param {number} h The picture height
	 *  @param {number} cw The excepted width
	 *  @param {number} ch The excepted height
	 */
	static checkPictureSize(
		type: string,
		name: string,
		w: number,
		h: number,
		cw: number,
		ch: number,
		strictw: boolean,
		stricth: boolean
	) {
		const isOKW = strictw ? w === cw : w % cw === 0;
		const isOKH = stricth ? h === ch : h % ch === 0;
		let error = 'Wrong ' + type + ' size for ' + name + '. ';
		if (!isOKW) {
			error += 'Width should be ' + (strictw ? '' : 'a multiple of ') + cw + " but it's currently " + w + '.';
		}
		if (!isOKH) {
			error += 'Height should be ' + (stricth ? '' : 'a multiple of ') + ch + " but it's currently " + h + '.';
		}
		if (!isOKW || !isOKH) {
			Platform.showErrorMessage(error);
		}
	}
}

export { SpecialElements };
