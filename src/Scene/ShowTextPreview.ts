/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Common, EventCommand, Graphic, Manager } from '..';
import { Paths } from '../Common';
import { Game } from '../Core';
import { Base } from './Base';

/**
 *  Scene used for
 */
class ShowTextPreview extends Base {
	public eventCommand: EventCommand.ShowText;
	public currentState: Record<string, any>;
	public isLoading: boolean;
	public needRedraw: boolean;

	constructor() {
		super();
		Game.current = new Game();
		Game.current.initializeDefault();
		this.eventCommand = null;
		this.isLoading = false;
		this.needRedraw = true;
	}

	async updateCommand() {
		this.isLoading = true;
		let json = await Common.Platform.parseFileJSON(Paths.FILE_TEST);
		let eventCommand = <EventCommand.ShowText>Manager.Events.getEventCommand(json);
		if (
			eventCommand !== null &&
			(this.eventCommand === null ||
				(<Graphic.Text>this.eventCommand.windowInterlocutor.content).text !==
					eventCommand.interlocutor.getValue() ||
				this.eventCommand.message !== eventCommand.message ||
				this.eventCommand.facesetID !== eventCommand.facesetID)
		) {
			this.needRedraw = false;
			this.eventCommand = eventCommand;
			this.currentState = this.eventCommand.initialize();
			this.needRedraw = true;
		}
		this.isLoading = false;
	}

	update() {
		if (!this.isLoading) {
			this.updateCommand();
		}
		if (this.eventCommand !== null && this.needRedraw) {
			this.eventCommand.update(this.currentState, null, null);
		} else {
			Manager.Stack.requestPaintHUD = true;
		}
	}

	drawHUD() {
		if (this.eventCommand !== null && this.needRedraw) {
			this.eventCommand.drawHUD(this.currentState);
		} else {
			Manager.Stack.requestPaintHUD = true;
		}
	}
}

export { ShowTextPreview };
