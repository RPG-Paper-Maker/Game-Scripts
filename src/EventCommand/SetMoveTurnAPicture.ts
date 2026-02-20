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
 *  An event command for setting / moving / turning a picture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SetMoveTurnAPicture extends Base {
	public index: Model.DynamicValue;
	public pictureID: Model.DynamicValue;
	public zoom: Model.DynamicValue;
	public opacity: Model.DynamicValue;
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public angle: Model.DynamicValue;
	public time: Model.DynamicValue;
	public waitEnd: boolean;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.index = Model.DynamicValue.createValueCommand(command, iterator);
		if (Utils.numberToBool(command[iterator.i++])) {
			this.pictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.zoom = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.opacity = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.x = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.y = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.angle = Model.DynamicValue.createValueCommand(command, iterator);
		}
		this.waitEnd = Utils.numberToBool(command[iterator.i++]);
		this.time = Model.DynamicValue.createValueCommand(command, iterator);
		this.parallel = !this.waitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		const time = (this.time.getValue() as number) * 1000;
		const index = this.index.getValue() as number;
		let obj: [number, Picture2D], picture: Picture2D;
		let i: number, l: number;
		for (i = 0, l = Manager.Stack.displayedPictures.length; i < l; i++) {
			obj = Manager.Stack.displayedPictures[i];
			if (index === obj[0]) {
				picture = obj[1];
				break;
			}
		}
		if (picture) {
			// If new picture ID, create a new picture
			if (this.pictureID) {
				let prevX = picture.oX;
				let prevY = picture.oY;
				const prevW = picture.oW;
				const prevH = picture.oH;
				const prevCentered = picture.centered;
				const prevZoom = picture.zoom;
				const prevOpacity = picture.opacity;
				const prevAngle = picture.angle;
				picture = Data.Pictures.getPictureCopy(PICTURE_KIND.PICTURES, this.pictureID.getValue() as number);
				if (prevCentered) {
					prevX += (prevW - picture.oW) / 2;
					prevY += (prevH - picture.oH) / 2;
				}
				picture.setX(prevX);
				picture.setY(prevY);
				picture.centered = prevCentered;
				picture.zoom = prevZoom;
				picture.opacity = prevOpacity;
				picture.angle = prevAngle;
				Manager.Stack.displayedPictures[i][1] = picture;
			}
		} else {
			return {};
		}
		return {
			parallel: this.waitEnd,
			picture: picture,
			finalDifZoom: this.zoom ? (this.zoom.getValue() as number) / 100 - picture.zoom : null,
			finalDifOpacity: this.opacity ? (this.opacity.getValue() as number) / 100 - picture.opacity : null,
			finalDifX: this.x
				? (picture.centered ? ScreenResolution.SCREEN_X / 2 : 0) + (this.x.getValue() as number) - picture.oX
				: null,
			finalDifY: this.y
				? (picture.centered ? ScreenResolution.SCREEN_Y / 2 : 0) + (this.y.getValue() as number) - picture.oY
				: null,
			finalDifAngle: this.angle ? (this.angle.getValue() as number) - picture.angle : null,
			time: time,
			timeLeft: time,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		// If no picture corresponds, go to next command
		if (!currentState.picture) {
			return 1;
		}
		if (currentState.parallel) {
			// Updating the time left
			let timeRate: number, dif: number;
			if (currentState.time === 0) {
				timeRate = 1;
			} else {
				dif = Manager.Stack.elapsedTime;
				currentState.timeLeft -= Manager.Stack.elapsedTime;
				if (currentState.timeLeft < 0) {
					dif += currentState.timeLeft;
					currentState.timeLeft = 0;
				}
				timeRate = dif / currentState.time;
			}

			// Set
			if (this.zoom) {
				currentState.picture.zoom += timeRate * currentState.finalDifZoom;
			}
			if (this.opacity) {
				currentState.picture.opacity += timeRate * currentState.finalDifOpacity;
			}

			// Move
			if (this.x) {
				currentState.picture.setX(currentState.picture.oX + timeRate * currentState.finalDifX);
			}
			if (this.y) {
				currentState.picture.setY(currentState.picture.oY + timeRate * currentState.finalDifY);
			}

			// Turn
			if (this.angle) {
				currentState.picture.angle += timeRate * currentState.finalDifAngle;
			}
			Manager.Stack.requestPaintHUD = true;

			// If time = 0, then this is the end of the command
			if (currentState.timeLeft === 0) {
				return 1;
			}
			return 0;
		}
		return 1;
	}
}

export { SetMoveTurnAPicture };
