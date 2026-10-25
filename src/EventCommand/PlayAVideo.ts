/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Graphic, Manager, Model } from '..';
import { Inputs, Utils } from '../Common';
import { MapObjectCommandType } from '../Common/Types';
import { Base } from './Base';

type PlayAVideoState = {
	parallel: boolean;
	started: boolean;
	finished: boolean;
	holdElapsed: number;
	skipKeyMustBeReleased: boolean;
	skipGraphic: Graphic.SkipHold | null;
};

/** @class
 *  An event command for playing a video.
 *  @extends EventCommand.Base
 *  @param {MapObjectCommandType[]} command - Direct JSON command to parse
 */
class PlayAVideo extends Base {
	public videoID: number;
	public operation: number;
	public isStart: boolean;
	public start: Model.DynamicValue;
	public isWaitEnd: boolean = true;
	public canSkip: boolean = false;
	public skipKeyID: Model.DynamicValue;
	public isMaintained: boolean = false;
	public maintainDuration: Model.DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.operation = command[iterator.i++] as number;
		if (this.operation === 0) {
			this.videoID = command[iterator.i++] as number;
			this.isStart = Utils.numberToBool(command[iterator.i++] as number);
			if (this.isStart) {
				this.start = Model.DynamicValue.createValueCommand(command, iterator);
			}
			this.isWaitEnd = Utils.numberToBool(command[iterator.i++] as number);
			if (iterator.i < command.length) {
				this.canSkip = Utils.numberToBool(command[iterator.i++] as number);
				if (this.canSkip) {
					this.skipKeyID = Model.DynamicValue.createValueCommand(command, iterator);
					this.isMaintained = Utils.numberToBool(command[iterator.i++] as number);
					if (this.isMaintained) {
						this.maintainDuration = Model.DynamicValue.createValueCommand(command, iterator);
					}
				}
			}
		}
		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {PlayAVideoState} The current state
	 */
	initialize(): PlayAVideoState {
		const skipGraphic =
			this.canSkip && this.isMaintained ? new Graphic.SkipHold(this.skipKeyID.getValue() as number) : null;
		return {
			parallel: this.isWaitEnd,
			started: false,
			finished: false,
			holdElapsed: 0,
			skipKeyMustBeReleased: this.canSkip && this.isSkipKeyHeld(),
			skipGraphic,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {PlayAVideoState} currentState - The current state of the event
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: PlayAVideoState): number {
		if (currentState.parallel) {
			if (!currentState.started) {
				switch (this.operation) {
					case 0:
						void Manager.Videos.play(
							Data.Videos.get(this.videoID).getPath() +
								(this.isStart ? '#t=' + (this.start.getValue() as number) : ''),
							() => {
								Manager.Videos.stop();
								currentState.finished = true;
							},
						);
						break;
					case 1:
						Manager.Videos.pause();
						currentState.finished = true;
						break;
					case 2:
						Manager.Videos.stop();
						currentState.finished = true;
						break;
				}
				currentState.started = true;
			}
			if (!currentState.finished && this.canSkip) {
				const keyHeld = this.isSkipKeyHeld();
				if (!keyHeld) currentState.skipKeyMustBeReleased = false;
				const skipKeyActive = keyHeld && !currentState.skipKeyMustBeReleased;
				if (this.isMaintained) {
					const duration = (this.maintainDuration.getValue() as number) * 1000;
					if (skipKeyActive) {
						currentState.holdElapsed += Manager.Stack.elapsedTime;
						if (currentState.holdElapsed >= duration) {
							Manager.Videos.stop();
							currentState.finished = true;
						}
						Manager.Stack.requestPaintHUD = true;
					} else if (currentState.holdElapsed > 0) {
						currentState.holdElapsed = 0;
						Manager.Stack.requestPaintHUD = true;
					}
				} else if (skipKeyActive) {
					Manager.Videos.stop();
					currentState.finished = true;
				}
			}
			return currentState.finished ? 1 : 0;
		}
		return 1;
	}

	private isSkipKeyHeld(): boolean {
		const keyboard = Data.Keyboards.get(this.skipKeyID.getValue() as number, '');
		for (const pressedKey of Inputs.keysPressed) {
			if (keyboard && Data.Keyboards.isKeyEqual(pressedKey, keyboard)) return true;
		}
		return false;
	}

	/**
	 *  Draw the HUD.
	 *  @param {PlayAVideoState} currentState - The current state of the event
	 */
	drawHUD(currentState: PlayAVideoState) {
		if (!this.canSkip || !this.isMaintained) return;
		currentState.skipGraphic.draw(currentState.holdElapsed, (this.maintainDuration.getValue() as number) * 1000);
	}
}

export { PlayAVideo };
