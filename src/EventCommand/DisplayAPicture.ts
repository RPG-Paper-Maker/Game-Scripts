/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { PICTURE_KIND, ScreenResolution, Utils } from '../Common';
import { MapObject, Picture2D } from '../Core';
import { Data, Manager, Model } from '../index';
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
		const picture = Data.Pictures.getPictureCopy(PICTURE_KIND.PICTURES, this.pictureID.getValue() as number);

		const xVal = this.x.getValue() as number;
		const yVal = this.y.getValue() as number;

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
			const offsetX = (ScreenResolution.CANVAS_WIDTH - ScreenResolution.SCREEN_X * minScale) / 2;
			const offsetY = (ScreenResolution.CANVAS_HEIGHT - ScreenResolution.SCREEN_Y * minScale) / 2;
			if (this.centered) {
				picture.oX = Data.Systems.windowWidth / 2 + xVal;
				picture.x = Math.round(ScreenResolution.CANVAS_WIDTH / 2 + ScreenResolution.getScreenMinXY(xVal));
				picture.oY = Data.Systems.windowHeight / 2 + yVal;
				picture.y = Math.round(ScreenResolution.CANVAS_HEIGHT / 2 + ScreenResolution.getScreenMinXY(yVal));
			} else {
				picture.oX = xVal;
				picture.x = Math.round(offsetX + ScreenResolution.getScreenMinXY(xVal));
				picture.oY = yVal;
				picture.y = Math.round(offsetY + ScreenResolution.getScreenMinXY(yVal));
			}
		}

		picture.centered = this.centered;
		picture.zoom = (this.zoom.getValue() as number) / 100;
		picture.opacity = (this.opacity.getValue() as number) / 100;
		picture.angle = this.angle.getValue() as number;
		if (!picture.empty && picture.loaded) {
			if (this.stretch) {
				picture.stretch = true;
				picture.oW = picture.image.width;
				picture.w = ScreenResolution.CANVAS_WIDTH;
				picture.oH = picture.image.height;
				picture.h = ScreenResolution.CANVAS_HEIGHT;
			} else {
				picture.oW = picture.image.width;
				picture.w = Math.round(ScreenResolution.getScreenMinXY(picture.image.width));
				picture.oH = picture.image.height;
				picture.h = Math.round(ScreenResolution.getScreenMinXY(picture.image.height));
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
}

export { DisplayAPicture };
