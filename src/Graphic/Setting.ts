/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, TITLE_SETTING_KIND } from '../Common';
import { Datas, Graphic } from '../index';
import { Base } from './Base';

/** @class
 *  A class for all settings to display in screen.
 *  @extends Graphic.Base
 *  @param {number} id -
 */
class Setting extends Base {
	public graphicRight: Graphic.Text;
	public graphicTextLeft: Graphic.Text;
	public graphicTextInformation: Graphic.Text;

	constructor(id: number) {
		super();

		let textLeft: string, textInformation: string;
		switch (id) {
			case TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT:
				textLeft = Datas.Languages.extras.keyboardAssignment.name();
				textInformation = Datas.Languages.extras.keyboardAssignmentDescription.name();
				this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
				break;
			case TITLE_SETTING_KIND.LANGUAGE:
				textLeft = Datas.Languages.extras.language.name();
				textInformation = Datas.Languages.extras.languageDescription.name();
				this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
				break;
		}
		this.graphicTextLeft = new Graphic.Text(textLeft);
		this.graphicTextInformation = new Graphic.Text(textInformation, { align: ALIGN.CENTER });
	}

	/**
	 *  Drawing the choice.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		this.graphicTextLeft.draw(x, y, w, h);
		this.graphicRight.draw(x + w / 2, y, w / 2, h);
	}

	/**
	 *  Drawing the settings informations.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		this.graphicTextInformation.draw(x, y, w, h);
	}
}

export { Setting };
