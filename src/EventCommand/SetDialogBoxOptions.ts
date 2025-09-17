/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { MapObject } from '../Core';
import { Data, Model } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for setting the dialog box options.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SetDialogBoxOptions extends Base {
	public windowSkinID: Model.DynamicValue;
	public x: Model.DynamicValue;
	public y: Model.DynamicValue;
	public w: Model.DynamicValue;
	public h: Model.DynamicValue;
	public pLeft: Model.DynamicValue;
	public pTop: Model.DynamicValue;
	public pRight: Model.DynamicValue;
	public pBottom: Model.DynamicValue;
	public fPosAbove: boolean;
	public fX: Model.DynamicValue;
	public fY: Model.DynamicValue;
	public tOutline: boolean;
	public tcText: Model.DynamicValue;
	public tcOutline: Model.DynamicValue;
	public tcBackground: Model.DynamicValue;
	public tSize: Model.DynamicValue;
	public tFont: Model.DynamicValue;
	public v_windowSkin: Model.WindowSkin;
	public v_x: number;
	public v_y: number;
	public v_w: number;
	public v_h: number;
	public v_pLeft: number;
	public v_pTop: number;
	public v_pRight: number;
	public v_pBottom: number;
	public v_fPosAbove: boolean;
	public v_fX: number;
	public v_fY: number;
	public v_tOutline: boolean;
	public v_tcText: Model.Color;
	public v_tcOutline: Model.Color;
	public v_tcBackground: Model.Color;
	public v_tSize: number;
	public v_tFont: string;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		if (Utils.numberToBool(command[iterator.i++])) {
			this.windowSkinID = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.x = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.y = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.w = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.h = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.pLeft = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.pTop = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.pRight = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.pBottom = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.fPosAbove = Utils.numberToBool(command[iterator.i++]);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.fX = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.fY = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tOutline = !Utils.numberToBool(command[iterator.i++]);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tcText = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tcOutline = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tcBackground = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tSize = Model.DynamicValue.createValueCommand(command, iterator);
		}
		if (Utils.numberToBool(command[iterator.i++])) {
			this.tFont = Model.DynamicValue.createValueCommand(command, iterator);
		}
	}

	/**
	 *  Update and check if the event is finished
	 *  @param {Object} currentState - The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState?: Record<string, any>, object?: MapObject, state?: number): number {
		if (this.windowSkinID !== undefined) {
			Data.Systems.dbOptions.v_windowSkin = Data.Systems.getWindowSkin(this.windowSkinID.getValue() as number);
		}
		if (this.x !== undefined) {
			Data.Systems.dbOptions.v_x = this.x.getValue() as number;
		}
		if (this.y !== undefined) {
			Data.Systems.dbOptions.v_y = this.y.getValue() as number;
		}
		if (this.w !== undefined) {
			Data.Systems.dbOptions.v_w = this.w.getValue() as number;
		}
		if (this.h !== undefined) {
			Data.Systems.dbOptions.v_h = this.h.getValue() as number;
		}
		if (this.pLeft !== undefined) {
			Data.Systems.dbOptions.v_pLeft = this.pLeft.getValue() as number;
		}
		if (this.pTop !== undefined) {
			Data.Systems.dbOptions.v_pTop = this.pTop.getValue() as number;
		}
		if (this.pRight !== undefined) {
			Data.Systems.dbOptions.v_pRight = this.pRight.getValue() as number;
		}
		if (this.pBottom !== undefined) {
			Data.Systems.dbOptions.v_pBottom = this.pBottom.getValue() as number;
		}
		if (this.fPosAbove !== undefined) {
			Data.Systems.dbOptions.v_fPosAbove = this.fPosAbove;
		}
		if (this.fX !== undefined) {
			Data.Systems.dbOptions.v_fX = this.fX.getValue() as number;
		}
		if (this.fY !== undefined) {
			Data.Systems.dbOptions.v_fY = this.fY.getValue() as number;
		}
		if (this.tOutline !== undefined) {
			Data.Systems.dbOptions.v_tOutline = this.tOutline;
		}
		if (this.tcText !== undefined) {
			Data.Systems.dbOptions.v_tcText = Data.Systems.getColor(this.tcText.getValue() as number);
		}
		if (this.tcOutline !== undefined) {
			Data.Systems.dbOptions.v_tcOutline = Data.Systems.getColor(this.tcOutline.getValue() as number);
		}
		if (this.tcBackground !== undefined) {
			Data.Systems.dbOptions.v_tcBackground = Data.Systems.getColor(this.tcBackground.getValue() as number);
		}
		if (this.tSize !== undefined) {
			Data.Systems.dbOptions.v_tSize = Data.Systems.getFontSize(
				this.tSize.getValue() as number
			).getValue() as number;
		}
		if (this.tFont !== undefined) {
			Data.Systems.dbOptions.v_tFont = Data.Systems.getFontName(this.tFont.getValue() as number).getName();
		}
		return 1;
	}
}

export { SetDialogBoxOptions };
