/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DISPLAY_PICTURE_KIND, PICTURE_KIND, ScreenResolution, Utils } from '../Common';
import { MapObject, Picture2D } from '../Core';
import { Data, Graphic, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for displaying a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class DisplayAPicture extends Base {
	public pictureID: Model.DynamicValue;
	public index: Model.DynamicValue;
	public centered: boolean;
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public zoom: Model.DynamicValue;
	public opacity: Model.DynamicValue;
	public angle: Model.DynamicValue;
	public stretch: boolean;
	public pictureKind: PICTURE_KIND;
	public indexX: number;
	public indexY: number;
	public indexWidth: number;
	public indexHeight: number;
	public displayKind: DISPLAY_PICTURE_KIND;
	public text: string;
	public textWidth: number;
	public offsetX: Model.DynamicValue;
	public offsetY: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.pictureID = Model.DynamicValue.createValueCommand(command, iterator);
		iterator.i++;
		this.index = Model.DynamicValue.createValueCommand(command, iterator);
		this.centered = Utils.numberToBool(command[iterator.i++]);
		this.x = Model.DynamicValue.createValueCommand(command, iterator);
		this.y = Model.DynamicValue.createValueCommand(command, iterator);
		this.zoom = Model.DynamicValue.createValueCommand(command, iterator);
		this.opacity = Model.DynamicValue.createValueCommand(command, iterator);
		this.angle = Model.DynamicValue.createValueCommand(command, iterator);
		this.stretch = Utils.numberToBool(command[iterator.i++]);
		this.pictureKind = command[iterator.i++] ?? PICTURE_KIND.PICTURES;
		this.indexX = command[iterator.i++] ?? 0;
		this.indexY = command[iterator.i++] ?? 0;
		this.indexWidth = command[iterator.i++] ?? 1;
		this.indexHeight = command[iterator.i++] ?? 1;
		this.displayKind = command[iterator.i++] ?? DISPLAY_PICTURE_KIND.PICTURE;
		const texts = new Map<number, string>();
		this.textWidth = 1280;
		this.offsetX = Model.DynamicValue.createNumberDouble(0);
		this.offsetY = Model.DynamicValue.createNumberDouble(0);
		while (iterator.i < command.length) {
			const languageID = command[iterator.i++];
			if (languageID === -3) {
				this.offsetX = Model.DynamicValue.createValueCommand(command, iterator);
				this.offsetY = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			}
			const value = command[iterator.i++];
			if (languageID === -1) {
				this.textWidth = value || 1280;
			} else if (languageID !== -2) {
				texts.set(languageID, value);
			}
		}
		this.text = texts.get(Data.Languages.getMainLanguageID()) ?? [...texts.values()][0] ?? '';
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		const currentIndex = this.index.getValue() as number;
		const picture =
			this.displayKind === DISPLAY_PICTURE_KIND.TEXT
				? this.createTextPicture()
				: Data.Pictures.getPictureCopy(this.pictureKind, this.pictureID.getValue() as number);

		const xVal = this.x.getValue() as number;
		const yVal = this.y.getValue() as number;
		const offsetX = this.offsetX.getValue() as number;
		const offsetY = this.offsetY.getValue() as number;

		if (this.stretch) {
			const scaleX = ScreenResolution.CANVAS_WIDTH / Data.Systems.windowWidth;
			const scaleY = ScreenResolution.CANVAS_HEIGHT / Data.Systems.windowHeight;
			if (this.centered) {
				picture.oX = Data.Systems.windowWidth / 2 + xVal;
				picture.x = Math.round(ScreenResolution.CANVAS_WIDTH / 2 + xVal * scaleX);
				picture.oY = Data.Systems.windowHeight / 2 + yVal;
				picture.y = Math.round(ScreenResolution.CANVAS_HEIGHT / 2 + yVal * scaleY);
			} else {
				picture.oX = xVal;
				picture.x = Math.round(xVal * scaleX);
				picture.oY = yVal;
				picture.y = Math.round(yVal * scaleY);
			}
		} else {
			const minScale = Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
			const screenOffsetX = (ScreenResolution.CANVAS_WIDTH - ScreenResolution.SCREEN_X * minScale) / 2;
			const screenOffsetY = (ScreenResolution.CANVAS_HEIGHT - ScreenResolution.SCREEN_Y * minScale) / 2;
			if (this.centered) {
				picture.oX = Data.Systems.windowWidth / 2 + xVal;
				picture.x = Math.round(ScreenResolution.CANVAS_WIDTH / 2 + ScreenResolution.getScreenX(xVal));
				picture.oY = Data.Systems.windowHeight / 2 + yVal;
				picture.y = Math.round(ScreenResolution.CANVAS_HEIGHT / 2 + ScreenResolution.getScreenY(yVal));
			} else {
				picture.oX = xVal;
				picture.x = Math.round(screenOffsetX + ScreenResolution.getScreenX(xVal));
				picture.oY = yVal;
				picture.y = Math.round(screenOffsetY + ScreenResolution.getScreenY(yVal));
			}
		}

		picture.minPositionOffsetX = offsetX;
		picture.minPositionOffsetY = offsetY;
		picture.x += ScreenResolution.getScreenMinXY(offsetX);
		picture.y += ScreenResolution.getScreenMinXY(offsetY);
		picture.centered = this.centered;
		picture.zoom = (this.zoom.getValue() as number) / 100;
		picture.opacity = (this.opacity.getValue() as number) / 100;
		picture.angle = this.angle.getValue() as number;
		if (this.displayKind === DISPLAY_PICTURE_KIND.TEXT) {
			picture.oW = picture.image.width;
			picture.oH = picture.image.height;
			if (this.stretch) {
				picture.stretch = true;
				picture.w = ScreenResolution.CANVAS_WIDTH;
				picture.h = ScreenResolution.CANVAS_HEIGHT;
			} else {
				picture.w = Math.round(ScreenResolution.getScreenMinXY(picture.oW));
				picture.h = Math.round(ScreenResolution.getScreenMinXY(picture.oH));
			}
		} else if (!picture.empty && picture.loaded) {
			const isIcon = this.pictureKind === PICTURE_KIND.ICONS;
			const isFaceset = this.pictureKind === PICTURE_KIND.FACESETS;
			const isCharacter = this.pictureKind === PICTURE_KIND.CHARACTERS;
			const isBattler = this.pictureKind === PICTURE_KIND.BATTLERS;
			const isTileset = this.pictureKind === PICTURE_KIND.TILESETS;
			const sourceWidth = isIcon
				? Data.Systems.iconsSize
				: isFaceset
					? Data.Systems.facesetsSizeWidth
					: isCharacter
						? picture.image.width / Data.Systems.FRAMES
						: isBattler
							? picture.image.width / Data.Systems.battlersFrames
							: isTileset
								? this.indexWidth * Data.Systems.SQUARE_SIZE
								: picture.image.width;
			const sourceHeight = isIcon
				? Data.Systems.iconsSize
				: isFaceset
					? Data.Systems.facesetsSizeHeight
					: isCharacter
						? picture.image.height /
							Data.Pictures.get(this.pictureKind, this.pictureID.getValue() as number).getRows()
						: isBattler
							? picture.image.height / Data.Systems.battlersColumns
							: isTileset
								? this.indexHeight * Data.Systems.SQUARE_SIZE
								: picture.image.height;
			const hasSelectionGrid = isIcon || isFaceset || isCharacter || isBattler || isTileset;
			picture.sx = isTileset
				? this.indexX * Data.Systems.SQUARE_SIZE
				: hasSelectionGrid
					? this.indexX * sourceWidth
					: 0;
			picture.sy = isTileset
				? this.indexY * Data.Systems.SQUARE_SIZE
				: hasSelectionGrid
					? this.indexY * sourceHeight
					: 0;
			if (this.stretch) {
				picture.stretch = true;
				picture.oW = sourceWidth;
				picture.w = ScreenResolution.CANVAS_WIDTH;
				picture.oH = sourceHeight;
				picture.h = ScreenResolution.CANVAS_HEIGHT;
			} else {
				picture.oW = sourceWidth;
				picture.w = Math.round(ScreenResolution.getScreenMinXY(sourceWidth));
				picture.oH = sourceHeight;
				picture.h = Math.round(ScreenResolution.getScreenMinXY(sourceHeight));
			}
		}
		const value: [number, Picture2D] = [currentIndex, picture];
		let ok = false;
		let index: number;
		for (let i = 0, l = Manager.Stack.displayedPictures.length; i < l; i++) {
			index = Manager.Stack.displayedPictures[i][0];
			if (currentIndex === index) {
				Manager.Stack.displayedPictures[i] = value;
				ok = true;
				break;
			} else if (currentIndex < index) {
				Manager.Stack.displayedPictures.splice(i, 0, value);
				ok = true;
				break;
			}
		}
		if (!ok) {
			Manager.Stack.displayedPictures.push(value);
		}
		Manager.Stack.requestPaintHUD = true;
		return 1;
	}

	private createTextPicture(): Picture2D {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d')!;
		const text = this.text.replace(/\[[^\]]+\]/g, '');
		context.font = '24px sans-serif';
		canvas.width = Math.max(1, Math.ceil(context.measureText(text).width));
		canvas.height = 30;
		context.font = '24px sans-serif';
		context.textBaseline = 'top';
		context.fillStyle = '#FFFFFF';
		context.fillText(text, 0, 0);
		const picture = new Picture2D();
		picture.image = canvas as unknown as HTMLImageElement;
		picture.loaded = true;
		picture.empty = false;
		const textPicture = picture as Picture2D & { textMessage?: Graphic.Message; textWidth?: number };
		textPicture.textMessage = new Graphic.Message(this.text, -1, 0, 0);
		textPicture.textMessage.update();
		textPicture.textWidth = this.textWidth;
		return picture;
	}
}

export { DisplayAPicture };
