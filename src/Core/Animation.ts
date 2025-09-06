/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battler } from '.';
import { Datas, Model } from '..';
import { ANIMATION_EFFECT_CONDITION_KIND, PICTURE_KIND } from '../Common';
import { Picture2D } from './Picture2D';

/** @class
 *  An animation instance.
 *  @param {number} id - The ID of the status
 */
class Animation {
	public system: Model.Animation;
	public picture: Picture2D;
	public frame: number;
	public loop: boolean;

	constructor(id: number, loop: boolean = false) {
		this.system = Datas.Animations.get(id);
		if (this.system) {
			this.picture = Datas.Pictures.getPictureCopy(PICTURE_KIND.ANIMATIONS, this.system.pictureID);
			this.frame = 0;
			this.loop = loop;
		}
	}

	/**
	 *  Update frame.
	 */
	update() {
		this.frame++;
		if (this.loop) {
			this.frame = this.frame % this.system.maxFrameID;
		}
	}

	/**
	 *  Draw the animation on top of battler.
	 */
	playSounds(conditionKind: ANIMATION_EFFECT_CONDITION_KIND) {
		if (this.system) {
			this.system.playSounds(this.frame, conditionKind);
		}
	}

	/**
	 *  Draw the animation on top of battler.
	 */
	draw(battler: Battler) {
		if (this.system) {
			this.system.draw(this.picture, this.frame, battler);
		}
	}
}

export { Animation };
