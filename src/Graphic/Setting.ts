/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, TITLE_SETTING_KIND } from '../Common';
import { Data, Graphic, Manager } from '../index';
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
	private isAdvancedShadows = false;

	/** Texts used when the project's languages have no translation for the setting yet. */
	public static readonly DEFAULT_ADVANCED_SHADOWS = 'Advanced shadows';
	public static readonly DEFAULT_ADVANCED_SHADOWS_DESCRIPTION =
		'Colored, sharper shadows (strong GPU)';

	constructor(id: number) {
		super();

		let textLeft: string, textInformation: string;
		switch (id) {
			case TITLE_SETTING_KIND.KEYBOARD_ASSIGNMENT:
				textLeft = Data.Languages.extras.keyboardAssignment.name();
				textInformation = Data.Languages.extras.keyboardAssignmentDescription.name();
				this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
				break;
			case TITLE_SETTING_KIND.LANGUAGE:
				textLeft = Data.Languages.extras.language.name();
				textInformation = Data.Languages.extras.languageDescription.name();
				this.graphicRight = new Graphic.Text('...', { align: ALIGN.CENTER });
				break;
			case TITLE_SETTING_KIND.ADVANCED_SHADOWS:
				textLeft = Data.Languages.extras.advancedShadows.name() || Setting.DEFAULT_ADVANCED_SHADOWS;
				textInformation =
					Data.Languages.extras.advancedShadowsDescription.name() ||
					Setting.DEFAULT_ADVANCED_SHADOWS_DESCRIPTION;
				this.isAdvancedShadows = true;
				this.graphicRight = new Graphic.Text(Setting.getAdvancedShadowsText(), { align: ALIGN.CENTER });
				break;
		}
		this.graphicTextLeft = new Graphic.Text(textLeft);
		this.graphicTextInformation = new Graphic.Text(textInformation, { align: ALIGN.CENTER });
	}

	/** The text showing whether Advanced shadows is on. */
	static getAdvancedShadowsText(): string {
		return Manager.ShadowTint.advanced
			? Data.Languages.extras.yes.name() || 'Yes'
			: Data.Languages.extras.no.name() || 'No';
	}

	/**
	 *  Drawing the choice.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		if (this.isAdvancedShadows) {
			const text = Setting.getAdvancedShadowsText();
			if (this.graphicRight.text !== text) {
				this.graphicRight.setText(text);
			}
		}
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
