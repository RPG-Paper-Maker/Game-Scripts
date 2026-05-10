/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Model } from '..';
import { ALIGN, Constants, PICTURE_KIND, ScreenResolution } from '../Common';
import { Battler } from './Battler';
import { Picture2D } from './Picture2D';

/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
class Status {
	public id: number;
	public system: Model.Status;
	public turn: number;
	public picture: Picture2D;

	constructor(id: number, turn: number = 0) {
		this.id = id;
		this.system = Data.Status.get(id);
		this.turn = turn;
		this.picture = Data.Pictures.getPictureCopy(PICTURE_KIND.ICONS, this.system.pictureID);
	}

	/**
	 *  Get message and replace target name.
	 *  @static
	 *  @param {Model.DynamicValue} message
	 *  @param {Battler} target
	 *  @returns {string}
	 */
	static getMessage(message: Model.DynamicValue, target: Battler): string {
		return (message.getValue() as string).replace('[target]', target.player.name);
	}

	/**
	 *  Draw the status on top of battler.
	 *  @static
	 *  @param {Status[]} statusList
	 *  @param {number} x - The x position
	 *  @param {number} y - The y position
	 *  @param {Align} [align=ALIGN.LEFT]
	 */
	static drawList(statusList: Status[], x: number, y: number, align = ALIGN.LEFT) {
		const l = statusList.length;
		const iconSize = ScreenResolution.getScreenMinXY(Data.Systems.iconsSize);
		let totalWidth = l * iconSize;
		let s: Status;
		if (l > 1) {
			totalWidth += (l - 1) * ScreenResolution.getScreenX(Constants.MEDIUM_SPACE);
		}
		let xOffset: number = 0;
		switch (align) {
			case ALIGN.LEFT:
				totalWidth = 0;
				break;
			case ALIGN.CENTER:
				totalWidth /= 2;
				break;
		}
		const originalSize = ScreenResolution.getScreenMinXY(Data.Systems.iconsSize);
		for (let i = 0, l = statusList.length; i < l; i++) {
			s = statusList[i];
			xOffset += iconSize;
			s.draw(
				x - totalWidth + xOffset + ScreenResolution.getScreenX(i * Constants.MEDIUM_SPACE) - iconSize,
				y - originalSize,
			);
		}
	}

	/**
	 *  Get message when ally affected.
	 *  @param {Battler} target
	 *  @returns {string}
	 */
	getMessageAllyAffected(target: Battler): string {
		return Status.getMessage(this.system.messageAllyAffected, target);
	}

	/**
	 *  Get message when enemy affected.
	 *  @param {Battler} target
	 *  @returns {string}
	 */
	getMessageEnemyAffected(target: Battler): string {
		return Status.getMessage(this.system.messageEnemyAffected, target);
	}

	/**
	 *  Get message when healed.
	 *  @param {Battler} target
	 *  @returns {string}
	 */
	getMessageHealed(target: Battler): string {
		return Status.getMessage(this.system.messageStatusHealed, target);
	}

	/**
	 *  Get message when still affected.
	 *  @param {Battler} target
	 *  @returns {string}
	 */
	getMessageStillAffected(target: Battler): string {
		return Status.getMessage(this.system.messageStatusStillAffected, target);
	}

	/**
	 *  Draw the status on top of battler.
	 *  @param {number} x - The x position
	 *  @param {number} y - The y position
	 */
	draw(x: number, y: number) {
		const iconSize = ScreenResolution.getScreenMinXY(Data.Systems.iconsSize) * 1.5;
		this.picture.draw({
			x: x,
			y: y,
			sx: this.system.pictureIndexX * Data.Systems.iconsSize,
			sy: this.system.pictureIndexY * Data.Systems.iconsSize,
			sw: Data.Systems.iconsSize,
			sh: Data.Systems.iconsSize,
			w: iconSize,
			h: iconSize,
		});
	}
}

export { Status };
