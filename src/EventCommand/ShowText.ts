/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, Utils } from '../Common';
import { MapObject, WindowBox } from '../Core';
import { Data, Graphic, Manager, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for displaying text.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class ShowText extends Base {
	public interlocutor: Model.DynamicValue;
	public facesetID: number;
	public facesetIndexX: number;
	public facesetIndexY: number;
	public message: string;
	public windowMain: WindowBox;
	public windowInterlocutor: WindowBox;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.interlocutor = Model.DynamicValue.createValueCommand(command, iterator);
		this.facesetID = command[iterator.i++];
		this.facesetIndexX = command[iterator.i++];
		this.facesetIndexY = command[iterator.i++];
		const lang = new Model.Localization();
		while (iterator.i < command.length) {
			lang.getCommand(command, iterator);
		}
		this.message = lang.name();
		this.windowMain = new WindowBox(0, 0, 0, 0, {
			content: new Graphic.Message(this.message, this.facesetID, this.facesetIndexX, this.facesetIndexY),
			padding: WindowBox.HUGE_PADDING_BOX,
		});
		this.windowInterlocutor = new WindowBox(
			this.windowMain.oX + WindowBox.MEDIUM_SLOT_HEIGHT / 2,
			this.windowMain.oY - WindowBox.MEDIUM_SLOT_HEIGHT / 2,
			WindowBox.MEDIUM_SLOT_WIDTH,
			WindowBox.MEDIUM_SLOT_HEIGHT,
			{
				content: new Graphic.Text('', { align: ALIGN.CENTER }),
				padding: WindowBox.SMALL_SLOT_PADDING,
			}
		);
	}

	/**
	 *  An event action.
	 *  @param {Record<string ,any>} currentState
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	action(currentState: Record<string, any>, isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		if (
			Scene.MenuBase.checkActionMenu(isKey, options) &&
			(isKey || (!isKey && this.windowMain.isInside(options.x, options.y)))
		) {
			currentState.clicked = true;
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		this.windowMain.setX(Utils.valueOrDefault(Data.Systems.dbOptions.v_x, 0));
		this.windowMain.setY(Utils.valueOrDefault(Data.Systems.dbOptions.v_y, 0));
		this.windowMain.setW(Utils.valueOrDefault(Data.Systems.dbOptions.v_w, 0));
		this.windowMain.setH(Utils.valueOrDefault(Data.Systems.dbOptions.v_h, 0));
		this.windowInterlocutor.setX(this.windowMain.oX + WindowBox.MEDIUM_SLOT_HEIGHT / 2);
		this.windowInterlocutor.setY(this.windowMain.oY - WindowBox.MEDIUM_SLOT_HEIGHT / 2);
		this.windowMain.padding[0] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pLeft, 0);
		this.windowMain.padding[1] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pTop, 0);
		this.windowMain.padding[2] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pRight, 0);
		this.windowMain.padding[3] = Utils.valueOrDefault(Data.Systems.dbOptions.v_pBottom, 0);
		this.windowMain.updateDimensions();
		this.windowMain.content.update();
		(<Graphic.Text>this.windowInterlocutor.content).setText(this.interlocutor.getValue() as string);
		return {
			clicked: false,
			frame: 0,
			frameTick: 0,
			frameDuration: 150,
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
		if (currentState.clicked) {
			return 1;
		}
		currentState.frameTick += Manager.Stack.elapsedTime;
		if (currentState.frameTick >= currentState.frameDuration) {
			currentState.frame = (currentState.frame + 1) % Data.Systems.FRAMES;
			currentState.frameTick = 0;
			Manager.Stack.requestPaintHUD = true;
		}
		(<Graphic.Text>this.windowInterlocutor.content).setText(this.interlocutor.getValue() as string);
		return 0;
	}

	/**
	 *  First key press handle for the current stack
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {number} key - The key ID pressed
	 */
	onKeyPressed(currentState: Record<string, any>, key: string) {
		this.action(currentState, true, { key: key });
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(currentState: Record<string, any>, x: number, y: number) {
		this.action(currentState, false, { x: x, y: y });
	}

	/**
	 *  Draw the HUD
	 *  @param {Record<string ,any>} - currentState The current state of the event
	 */
	drawHUD(currentState?: Record<string, any>) {
		this.windowMain.draw();
		if ((<Graphic.Text>this.windowInterlocutor.content).text) {
			this.windowInterlocutor.draw();
		}
		if (currentState) {
			Data.Systems.getCurrentWindowSkin().drawArrowMessage(
				currentState.frame,
				this.windowMain.oX + this.windowMain.oW / 2,
				this.windowMain.oY + (this.windowMain.oH - 40)
			);
		}
	}
}

export { ShowText };
