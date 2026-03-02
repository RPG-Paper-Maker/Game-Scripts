/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three/webgpu';
import { Utils } from '../Common';
import { Data, Model } from '../index';
import { CustomGeometry } from './CustomGeometry';
import { MapElement, Sprite } from './index';
import { Position } from './Position';
import { TextureBundle } from './TextureBundle';

/**
 * A mountain in the map.
 *
 * @class Mountain
 * @extends {MapElement}
 */
class Mountain extends MapElement {
	public static X_LEFT_OFFSET = 0;
	public static X_MID_OFFSET = 1;
	public static X_RIGHT_OFFSET = 2;
	public static X_MIX_OFFSET = 3;
	public static Y_TOP_OFFSET = 0;
	public static Y_MID_OFFSET = 1;
	public static Y_BOT_OFFSET = 2;
	public static Y_MIX_OFFSET = 3;
	public static Y_MID_TOP_OFFSET = 4;
	public static Y_MID_MID_OFFSET = 5;
	public static Y_MID_BOT_OFFSET = 6;

	public mountainID: number;
	public widthSquaresBot: number;
	public widthPixelsBot: number;
	public widthSquaresTop: number;
	public widthPixelsTop: number;
	public widthSquaresLeft: number;
	public widthPixelsLeft: number;
	public widthSquaresRight: number;
	public widthPixelsRight: number;
	public heightSquares: number;
	public heightPixels: number;
	public top: boolean;
	public bot: boolean;
	public left: boolean;
	public right: boolean;
	public angle: number;

	constructor(json?: Record<string, any>) {
		super();

		if (json) {
			this.read(json);
		}
	}

	/**
	 *  Read the JSON associated to the mountain.
	 *  @param {Record<string, any>}  json - Json object describing the mountain
	 */
	read(json: Record<string, any>) {
		super.read(json);

		this.mountainID = Utils.valueOrDefault(json.sid, -1);

		// Backward compat: old format used single ws/wp for all sides
		const legacyWs = Utils.valueOrDefault(json.ws, 0);
		const legacyWp = Utils.valueOrDefault(json.wp, 0);

		this.widthSquaresBot = Utils.valueOrDefault(json.wsb, legacyWs);
		this.widthPixelsBot = Utils.valueOrDefault(json.wpb, legacyWp);
		this.widthSquaresTop = Utils.valueOrDefault(json.wst, legacyWs);
		this.widthPixelsTop = Utils.valueOrDefault(json.wpt, legacyWp);
		this.widthSquaresLeft = Utils.valueOrDefault(json.wsl, legacyWs);
		this.widthPixelsLeft = Utils.valueOrDefault(json.wpl, legacyWp);
		this.widthSquaresRight = Utils.valueOrDefault(json.wsr, legacyWs);
		this.widthPixelsRight = Utils.valueOrDefault(json.wpr, legacyWp);

		this.heightSquares = Utils.valueOrDefault(json.hs, 1);
		this.heightPixels = Utils.valueOrDefault(json.hp, 0);
		this.top = Utils.valueOrDefault(json.t, false);
		this.bot = Utils.valueOrDefault(json.b, false);
		this.left = Utils.valueOrDefault(json.l, false);
		this.right = Utils.valueOrDefault(json.r, false);

		// Calculate angle using bot side as reference
		const width = this.getWidthTotalPixelsForSide('bot');
		this.angle = width === 0 ? 90 : (Math.atan(this.getHeightTotalPixels() / width) * 180) / Math.PI;
	}

	/**
	 *  Get the total squares width (using max of all sides).
	 *  @returns {number}
	 */
	getTotalSquaresWidth(): number {
		const maxWs = Math.max(
			this.widthSquaresBot,
			this.widthSquaresTop,
			this.widthSquaresLeft,
			this.widthSquaresRight,
		);
		const maxPx = Math.max(
			this.getWidthOnlyPixelsPlusForSide('bot'),
			this.getWidthOnlyPixelsPlusForSide('top'),
			this.getWidthOnlyPixelsPlusForSide('left'),
			this.getWidthOnlyPixelsPlusForSide('right'),
		);
		return maxWs + (maxPx > 0 ? 1 : 0);
	}

	/** Get the total squares height.
	 *  @param {number} yPlus
	 *  @returns {number}
	 */
	getTotalSquaresHeight(yPlus: number): number {
		return this.heightSquares + (this.getHeightOnlyPixelsPlus() + yPlus > 0 ? 1 : 0);
	}

	/**
	 *  Get the pixel-only portion of width for a given side.
	 *  @param {'bot'|'top'|'left'|'right'} side
	 *  @returns {number}
	 */
	getWidthOnlyPixelsPlusForSide(side: 'bot' | 'top' | 'left' | 'right'): number {
		switch (side) {
			case 'bot':
				return Math.round((this.widthPixelsBot * Data.Systems.SQUARE_SIZE) / 100);
			case 'top':
				return Math.round((this.widthPixelsTop * Data.Systems.SQUARE_SIZE) / 100);
			case 'left':
				return Math.round((this.widthPixelsLeft * Data.Systems.SQUARE_SIZE) / 100);
			case 'right':
				return Math.round((this.widthPixelsRight * Data.Systems.SQUARE_SIZE) / 100);
		}
	}

	/**
	 *  Get the squares number height with pixels plus.
	 *  @returns {number}
	 */
	getHeightOnlyPixelsPlus(): number {
		return Math.round((this.heightPixels * Data.Systems.SQUARE_SIZE) / 100);
	}

	/**
	 *  Get the total width in pixels for a given side.
	 *  @param {'bot'|'top'|'left'|'right'} side
	 *  @returns {number}
	 */
	getWidthTotalPixelsForSide(side: 'bot' | 'top' | 'left' | 'right'): number {
		switch (side) {
			case 'bot':
				return this.widthSquaresBot * Data.Systems.SQUARE_SIZE + this.getWidthOnlyPixelsPlusForSide('bot');
			case 'top':
				return this.widthSquaresTop * Data.Systems.SQUARE_SIZE + this.getWidthOnlyPixelsPlusForSide('top');
			case 'left':
				return this.widthSquaresLeft * Data.Systems.SQUARE_SIZE + this.getWidthOnlyPixelsPlusForSide('left');
			case 'right':
				return this.widthSquaresRight * Data.Systems.SQUARE_SIZE + this.getWidthOnlyPixelsPlusForSide('right');
		}
	}

	/**
	 *  Get the total height in pixels.
	 *  @returns {number}
	 */
	getHeightTotalPixels(): number {
		return this.heightSquares * Data.Systems.SQUARE_SIZE + this.getHeightOnlyPixelsPlus();
	}

	/**
	 *  Get the System special element mountain.
	 *  @returns {System.SpecialElement}
	 */
	getSystem(): Model.SpecialElement {
		return Data.SpecialElements.getMountain(this.mountainID);
	}

	/**
	 *  Build face vectors for a given slope width and height.
	 */
	buildFaceVectors(
		wp: number,
		wpAdjacent: number,
		hp: number,
		localPosition: THREE.Vector3,
	): {
		xLeft: number;
		xRight: number;
		yTop: number;
		yBot: number;
		zFront: number;
		zBack: number;
		vecFrontA: THREE.Vector3;
		vecBackA: THREE.Vector3;
		vecFrontB: THREE.Vector3;
		vecBackB: THREE.Vector3;
	} {
		const xLeft = localPosition.x;
		const xRight = localPosition.x + Data.Systems.SQUARE_SIZE;
		const yTop = localPosition.y + hp;
		const yBot = localPosition.y;
		const zFront = localPosition.z + Data.Systems.SQUARE_SIZE + wp;
		const zBack = zFront - wp;
		const vecFrontA = new THREE.Vector3(xLeft - wpAdjacent, yBot, zBack);
		const vecBackA = new THREE.Vector3(xLeft, yTop, zBack);
		const vecFrontB = new THREE.Vector3(xLeft, yBot, zFront);
		const vecBackB = new THREE.Vector3(xLeft, yTop, zBack);
		return { xLeft, xRight, yTop, yBot, zFront, zBack, vecFrontA, vecBackA, vecFrontB, vecBackB };
	}

	/**
	 *  Draw the entire faces.
	 */
	drawEntireFaces(
		left: boolean,
		right: boolean,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		wp: number,
		xLeft: number,
		xRight: number,
		yTop: number,
		yBot: number,
		zFront: number,
		zBack: number,
		yOffset: number,
		vecFrontA: THREE.Vector3,
		vecBackA: THREE.Vector3,
		vecFrontB: THREE.Vector3,
		vecBackB: THREE.Vector3,
		geometry: CustomGeometry,
		count: number,
	): number {
		let xKind = Mountain.X_LEFT_OFFSET;
		const nbSteps = Math.ceil(faceHeight / Data.Systems.SQUARE_SIZE);
		const vecCenterA = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), 0.5);
		const vecCenterB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), 0.5);

		// Define x offset according to left / right stuff
		if (!left && right) {
			xKind = Mountain.X_LEFT_OFFSET;
		} else if (left && right) {
			xKind = Mountain.X_MID_OFFSET;
		} else if (left && !right) {
			xKind = Mountain.X_RIGHT_OFFSET;
		} else if (!left && !right) {
			xKind = Mountain.X_MIX_OFFSET;
		}

		// Draw all faces
		if (faceHeight === Data.Systems.SQUARE_SIZE) {
			// 1 Mix sprite
			// Mix
			count = this.drawSideCorner(
				xKind,
				Mountain.Y_MIX_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecFrontA.x,
				vecBackB.x,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA.z,
				vecFrontB.z,
				vecBackA.z,
				vecBackB.z,
				yOffset,
				geometry,
				count,
				0,
				vecFrontA.distanceTo(vecFrontB),
			);
		} else if (faceHeight <= 2 * Data.Systems.SQUARE_SIZE) {
			// 2 B / T sprites
			// Bottom
			count = this.drawSideCorner(
				xKind,
				Mountain.Y_BOT_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.floor(faceHeight / 2),
				wp,
				xLeft,
				xRight,
				vecCenterA.x,
				vecCenterB.x,
				vecFrontA.x,
				vecFrontB.x,
				vecCenterB.y,
				yBot,
				zFront,
				vecCenterB.z,
				vecFrontA.z,
				vecFrontB.z,
				vecCenterA.z,
				vecCenterB.z,
				yOffset,
				geometry,
				count,
				vecCenterA.distanceTo(vecCenterB),
				vecFrontA.distanceTo(vecFrontB),
			);

			// Top
			count = this.drawSideCorner(
				xKind,
				Mountain.Y_TOP_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.ceil(faceHeight / 2),
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecCenterA.x,
				vecCenterB.x,
				yTop,
				vecCenterB.y,
				vecCenterB.z,
				zBack,
				vecCenterA.z,
				vecCenterB.z,
				vecBackA.z,
				vecBackB.z,
				yOffset,
				geometry,
				count,
				0,
				vecCenterA.distanceTo(vecCenterB),
			);
		} else {
			// 3 B / M / T sprites
			// Bottom
			let vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), 1 / nbSteps);
			let vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), 1 / nbSteps);
			count = this.drawSideCorner(
				xKind,
				Mountain.Y_BOT_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.floor(faceHeight / nbSteps),
				wp,
				xLeft,
				xRight,
				vecStepLeftB.x,
				vecStepRightB.x,
				vecFrontA.x,
				vecFrontB.x,
				vecStepRightB.y,
				yBot,
				zFront,
				vecStepRightB.z,
				vecFrontA.z,
				vecFrontB.z,
				vecStepLeftB.z,
				vecStepRightB.z,
				yOffset,
				geometry,
				count,
				vecStepLeftB.distanceTo(vecStepRightB),
				vecFrontA.distanceTo(vecFrontB),
			);

			// Middle: add as many as middle blocks as possible
			let vecStepLeftA: THREE.Vector3, vecStepRightA: THREE.Vector3;
			for (let i = 2; i <= nbSteps - 1; i++) {
				vecStepLeftA = vecStepLeftB;
				vecStepRightA = vecStepRightB;
				vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), i / nbSteps);
				vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), i / nbSteps);
				count = this.drawSideCorner(
					xKind,
					Mountain.Y_MID_OFFSET,
					angle,
					center,
					width,
					height,
					w,
					Math.floor(faceHeight / nbSteps),
					wp,
					xLeft,
					xRight,
					vecStepLeftB.x,
					vecStepRightB.x,
					vecStepLeftA.x,
					vecStepRightA.x,
					vecStepRightB.y,
					vecStepRightA.y,
					vecStepRightA.z,
					vecStepRightB.z,
					vecStepLeftA.z,
					vecStepRightA.z,
					vecStepLeftB.z,
					vecStepRightB.z,
					yOffset,
					geometry,
					count,
					vecStepLeftB.distanceTo(vecStepRightB),
					vecStepLeftA.distanceTo(vecStepRightA),
				);
			}

			// Top
			count = this.drawSideCorner(
				xKind,
				Mountain.Y_TOP_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.ceil(faceHeight / nbSteps),
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecStepLeftB.x,
				vecStepRightB.x,
				yTop,
				vecStepRightB.y,
				vecStepRightB.z,
				zBack,
				vecStepLeftB.z,
				vecStepRightB.z,
				vecBackA.z,
				vecBackB.z,
				yOffset,
				geometry,
				count,
				0,
				vecStepLeftB.distanceTo(vecStepRightB),
			);
		}
		return count;
	}

	/**
	 *  Draw the side corner.
	 */
	drawSideCorner(
		xKind: number,
		yKind: number,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		wp: number,
		xLeft: number,
		xRight: number,
		xLeftTop: number,
		xRightTop: number,
		xLeftBot: number,
		xRightBot: number,
		yTop: number,
		yBot: number,
		zFront: number,
		zBack: number,
		zFrontLeft: number,
		zFrontRight: number,
		zBackLeft: number,
		zBackRight: number,
		yOffset: number,
		geometry: CustomGeometry,
		count: number,
		xCornerOffsetTop: number,
		xCornerOffsetBot: number,
	): number {
		count = this.drawFace(
			xKind,
			yKind,
			angle,
			center,
			width,
			height,
			w,
			faceHeight,
			xLeft,
			xRight,
			xLeft,
			xRight,
			yTop,
			yBot,
			zFront,
			zFront,
			zBack,
			zBack,
			yOffset,
			geometry,
			count,
			0,
			0,
			false,
		);

		// Draw corner if this face has a slope (right-end cap) or the adjacent face does (left-end cap)
		if (wp > 0 || xLeft > xLeftBot) {
			count = this.drawFace(
				xKind,
				yKind,
				angle,
				center,
				width,
				height,
				w,
				faceHeight,
				xLeftTop,
				xRightTop,
				xLeftBot,
				xRightBot,
				yTop,
				yBot,
				zFrontLeft,
				zFrontRight,
				zBackLeft,
				zBackRight,
				yOffset,
				geometry,
				count,
				xCornerOffsetTop,
				xCornerOffsetBot,
				true,
			);
		}
		return count;
	}

	/**
	 *  Draw a face.
	 */
	drawFace(
		xKind: number,
		yKind: number,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		xLeftTop: number,
		xRightTop: number,
		xLeftBot: number,
		xRightBot: number,
		yTop: number,
		yBot: number,
		zFrontLeft: number,
		zFrontRight: number,
		zBackLeft: number,
		zBackRight: number,
		yOffset: number,
		geometry: CustomGeometry,
		count: number,
		xCornerOffsetTop: number,
		xCornerOffsetBot: number,
		isCorner: boolean,
	): number {
		// Textures coordinates
		let x = (xKind * Data.Systems.SQUARE_SIZE) / width;
		let y =
			((isCorner ? Math.min(yKind + 4, Mountain.Y_MID_BOT_OFFSET) : yKind) * Data.Systems.SQUARE_SIZE +
				(yKind === Mountain.Y_BOT_OFFSET ? Data.Systems.SQUARE_SIZE - faceHeight : 0)) /
			height;
		let h = faceHeight / height;
		const coefX = MapElement.COEF_TEX / width;
		const coefY = MapElement.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;

		// Textures and vertices
		let texA: THREE.Vector2, texB: THREE.Vector2, texC: THREE.Vector2, texD: THREE.Vector2;
		if (isCorner) {
			texA = new THREE.Vector2(
				(Mountain.X_MID_OFFSET * Data.Systems.SQUARE_SIZE + (Data.Systems.SQUARE_SIZE - xCornerOffsetTop) / 2) /
					width +
					coefX,
				y,
			);
			texB = new THREE.Vector2(
				((Mountain.X_MID_OFFSET + 1) * Data.Systems.SQUARE_SIZE -
					(Data.Systems.SQUARE_SIZE - xCornerOffsetTop) / 2) /
					width -
					coefX,
				y,
			);
			texC = new THREE.Vector2(
				((Mountain.X_MID_OFFSET + 1) * Data.Systems.SQUARE_SIZE -
					(Data.Systems.SQUARE_SIZE - xCornerOffsetBot) / 2) /
					width -
					coefX,
				y + h,
			);
			texD = new THREE.Vector2(
				(Mountain.X_MID_OFFSET * Data.Systems.SQUARE_SIZE + (Data.Systems.SQUARE_SIZE - xCornerOffsetBot) / 2) /
					width +
					coefX,
				y + h,
			);
		} else {
			// Triangle form for corners
			texA = new THREE.Vector2(x, y);
			texB = new THREE.Vector2(x + w, y);
			texC = new THREE.Vector2(x + w, y + h);
			texD = new THREE.Vector2(x, y + h);
		}
		const texFaceA = [
			new THREE.Vector2(texA.x, texA.y),
			new THREE.Vector2(texB.x, texB.y),
			new THREE.Vector2(texC.x, texC.y),
		];
		const texFaceB = [
			new THREE.Vector2(texA.x, texA.y),
			new THREE.Vector2(texC.x, texC.y),
			new THREE.Vector2(texD.x, texD.y),
		];
		const vecA = new THREE.Vector3(xLeftTop, yTop, zBackLeft);
		const vecB = new THREE.Vector3(xRightTop, yTop, zBackRight);
		const vecC = new THREE.Vector3(xRightBot, yBot, zFrontRight);
		const vecD = new THREE.Vector3(xLeftBot, yBot, zFrontLeft);

		// Rotate and draw sprite side
		Sprite.rotateSprite(vecA, vecB, vecC, vecD, center, angle, Sprite.Y_AXIS);
		count = Sprite.addStaticSpriteToGeometry(geometry, vecA, vecB, vecC, vecD, texA, texB, texC, texD, count);
		return count;
	}

	/**
	 *  Update the geometry of a group of mountains with the same material.
	 */
	updateGeometry(
		geometry: CustomGeometry,
		texture: TextureBundle,
		position: Position,
		pictureID: number,
		count: number,
	): any[] {
		// General configurations
		const yOffset = texture.getOffset(pictureID, null) * 4 * Data.Systems.SQUARE_SIZE;
		const hp = this.getHeightTotalPixels();
		const width = 4 * Data.Systems.SQUARE_SIZE;
		const height = 7 * Data.Systems.SQUARE_SIZE;
		const w = Data.Systems.SQUARE_SIZE / width;
		const localPosition = position.toVector3(false);
		const center = new THREE.Vector3(
			localPosition.x + Data.Systems.SQUARE_SIZE / 2,
			localPosition.y + Data.Systems.SQUARE_SIZE / 2,
			localPosition.z + Data.Systems.SQUARE_SIZE / 2,
		);

		// Bot
		if (!this.bot) {
			const wpBot = this.getWidthTotalPixelsForSide('bot');
			const faceHeightBot = Math.sqrt(wpBot * wpBot + hp * hp);
			const fBot = this.buildFaceVectors(wpBot, this.getWidthTotalPixelsForSide('left'), hp, localPosition);
			count = this.drawEntireFaces(
				this.left,
				this.right,
				0,
				center,
				width,
				height,
				w,
				faceHeightBot,
				wpBot,
				fBot.xLeft,
				fBot.xRight,
				fBot.yTop,
				fBot.yBot,
				fBot.zFront,
				fBot.zBack,
				yOffset,
				fBot.vecFrontA,
				fBot.vecBackA,
				fBot.vecFrontB,
				fBot.vecBackB,
				geometry,
				count,
			);
		}
		// Top
		if (!this.top) {
			const wpTop = this.getWidthTotalPixelsForSide('top');
			const faceHeightTop = Math.sqrt(wpTop * wpTop + hp * hp);
			const fTop = this.buildFaceVectors(wpTop, this.getWidthTotalPixelsForSide('right'), hp, localPosition);
			count = this.drawEntireFaces(
				this.right,
				this.left,
				180,
				center,
				width,
				height,
				w,
				faceHeightTop,
				wpTop,
				fTop.xLeft,
				fTop.xRight,
				fTop.yTop,
				fTop.yBot,
				fTop.zFront,
				fTop.zBack,
				yOffset,
				fTop.vecFrontA,
				fTop.vecBackA,
				fTop.vecFrontB,
				fTop.vecBackB,
				geometry,
				count,
			);
		}
		// Left
		if (!this.left) {
			const wpLeft = this.getWidthTotalPixelsForSide('left');
			const faceHeightLeft = Math.sqrt(wpLeft * wpLeft + hp * hp);
			const fLeft = this.buildFaceVectors(wpLeft, this.getWidthTotalPixelsForSide('top'), hp, localPosition);
			count = this.drawEntireFaces(
				this.top,
				this.bot,
				-90,
				center,
				width,
				height,
				w,
				faceHeightLeft,
				wpLeft,
				fLeft.xLeft,
				fLeft.xRight,
				fLeft.yTop,
				fLeft.yBot,
				fLeft.zFront,
				fLeft.zBack,
				yOffset,
				fLeft.vecFrontA,
				fLeft.vecBackA,
				fLeft.vecFrontB,
				fLeft.vecBackB,
				geometry,
				count,
			);
		}
		// Right
		if (!this.right) {
			const wpRight = this.getWidthTotalPixelsForSide('right');
			const faceHeightRight = Math.sqrt(wpRight * wpRight + hp * hp);
			const fRight = this.buildFaceVectors(wpRight, this.getWidthTotalPixelsForSide('bot'), hp, localPosition);
			count = this.drawEntireFaces(
				this.bot,
				this.top,
				90,
				center,
				width,
				height,
				w,
				faceHeightRight,
				wpRight,
				fRight.xLeft,
				fRight.xRight,
				fRight.yTop,
				fRight.yBot,
				fRight.zFront,
				fRight.zBack,
				yOffset,
				fRight.vecFrontA,
				fRight.vecBackA,
				fRight.vecFrontB,
				fRight.vecBackB,
				geometry,
				count,
			);
		}

		// Collisions — store per-side widths; use max for bounding box extents
		const wpBot = this.getWidthTotalPixelsForSide('bot');
		const wpTop = this.getWidthTotalPixelsForSide('top');
		const wpLeft = this.getWidthTotalPixelsForSide('left');
		const wpRight = this.getWidthTotalPixelsForSide('right');
		const wpMax = Math.max(wpBot, wpTop, wpLeft, wpRight);
		const wpCollision = wpMax * 2 + Data.Systems.SQUARE_SIZE;
		const objCollision = [
			{
				p: position,
				l: localPosition,
				b: [center.x, center.y, center.z, wpCollision, hp, wpCollision, 0, 0, 0],
				w: this.getTotalSquaresWidth(),
				h: this.getTotalSquaresHeight(position[2]),
				d: this.getTotalSquaresWidth(),
				rw: wpMax,
				rwBot: wpBot,
				rwTop: wpTop,
				rwLeft: wpLeft,
				rwRight: wpRight,
				rh: this.getHeightTotalPixels(),
				m: Math.max(this.getTotalSquaresWidth(), this.getTotalSquaresHeight(position[2])),
				t: this,
				k: true,
			},
		];
		return [count, objCollision];
	}
}

export { Mountain };
