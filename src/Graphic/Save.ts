/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, ScreenResolution, Utils } from '../Common';
import { Game } from '../Core';
import { Data, Graphic } from '../index';
import { Base } from './Base';

/** @class
 *  The graphic displaying a save.
 *  @extends Graphic.Base
 *  @param {Game} game
 */
class Save extends Base {
	public game: Game;
	public graphicSlot: Graphic.Text;
	public graphicEmpty: Graphic.Text;
	public graphicTimer: Graphic.Text;
	public graphicPlayers: Graphic.Player[];

	constructor(game: Game) {
		super();

		this.game = game;
		this.graphicSlot = new Graphic.Text(Data.Languages.extras.slot.name() + ' ' + this.game.slot, {
			align: ALIGN.CENTER,
		});
		if (this.game.isEmpty) {
			this.graphicEmpty = new Graphic.Text(Data.Languages.extras.empty.name(), { align: ALIGN.CENTER });
		} else {
			this.graphicTimer = new Graphic.Text(Utils.getStringDate(this.game.playTime.getSeconds()), {
				align: ALIGN.RIGHT,
			});
			const l = this.game.teamHeroes.length;
			this.graphicPlayers = new Array(l);
			let graphic: Graphic.Player;
			for (let i = 0; i < l; i++) {
				graphic = new Graphic.Player(this.game.teamHeroes[i]);
				graphic.initializeCharacter();
				this.graphicPlayers[i] = graphic;
			}
		}
	}

	/**
	 *  Update the battler graphics.
	 */
	update() {
		for (let i = 0, l = this.graphicPlayers.length; i < l; i++) {
			this.graphicPlayers[i].updateBattler();
		}
	}

	/**
	 *  Drawing the save slot.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		this.graphicSlot.draw(x, y, w, h);
	}

	/** Drawing the save informations.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		if (this.game.isEmpty) {
			this.graphicEmpty.draw(x, y, w, h);
		} else {
			this.graphicTimer.draw(x, y, w, ScreenResolution.getScreenY(30));
			const l = this.graphicPlayers.length;
			const maxPerRow = 4;
			const availableH = h - ScreenResolution.getScreenY(30);
			const rowH = l > maxPerRow ? availableH / 2 : availableH;
			const yOffset = l > maxPerRow
				? Math.round(ScreenResolution.getScreenY(150) * rowH / availableH)
				: Math.round(availableH / 2);
			const slotW = ScreenResolution.getScreenX(230);
			const heroW = l > 0 ? this.graphicPlayers[0].getCharacterWidth() : 0;
			for (let i = 0; i < l; i++) {
				const col = i % maxPerRow;
				const row = Math.floor(i / maxPerRow);
				const xStart = x;
				this.graphicPlayers[i].drawCharacter(
					xStart + col * slotW,
					y + ScreenResolution.getScreenY(30) + row * rowH,
					w,
					h,
					yOffset,
				);
			}
		}
	}
}

export { Save };
