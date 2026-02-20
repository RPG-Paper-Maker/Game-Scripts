/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battler } from '.';
import { Data, Model } from '..';
import { ANIMATION_EFFECT_CONDITION_KIND, PICTURE_KIND } from '../Common';
import { Picture2D } from './Picture2D';

/**
 * Runtime instance of an animation (plays, loops, draws, triggers sounds).
 */
export class Animation {
	public model: Model.Animation;
	public picture: Picture2D;
	public frame: number;
	public loop: boolean;

	constructor(id: number, loop: boolean = false) {
		this.model = Data.Animations.get(id);
		if (this.model) {
			this.picture = Data.Pictures.getPictureCopy(PICTURE_KIND.ANIMATIONS, this.model.pictureID);
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
			this.frame %= this.model.maxFrameID;
		}
	}

	/**
	 *  Draw the animation on top of battler.
	 */
	playSounds(conditionKind: ANIMATION_EFFECT_CONDITION_KIND) {
		this.model?.playSounds(this.frame, conditionKind);
	}

	/**
	 *  Draw the animation on top of battler.
	 */
	draw(battler: Battler) {
		this.model?.draw(this.picture, this.frame, battler);
	}
}
