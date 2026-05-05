/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, Constants, PICTURE_KIND, ScreenResolution } from '../Common';
import { Frame, Picture2D, Player } from '../Core';
import { Status } from '../Core/Status';
import { Data, Graphic, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  The graphic displaying all the stats in the player description state menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 */
class PlayerDescription extends Base {
	public player: Player;
	public graphicNameCenter: Graphic.Text;
	public graphicName: Graphic.Text;
	public graphicDescription: Graphic.Text;
	public graphicClass: Graphic.Text;
	public graphicLevelName: Graphic.Text;
	public graphicLevel: Graphic.Text;
	public graphicExpName: Graphic.Text;
	public graphicExp: Graphic.Text;
	public listStatsNames: Graphic.Text[];
	public listStats: Graphic.Text[];
	public battler: Picture2D;
	public battlerFrame: Frame;
	public listStatsProgression: Graphic.Text[];
	public maxLength: number;

	constructor(player: Player) {
		super();

		this.player = player;

		// Informations
		const system = this.player.system;
		const cl = this.player.getClass();
		const levelStat = Data.BattleSystems.getLevelStatistic();
		const expStat = Data.BattleSystems.getExpStatistic();

		// All the graphics
		this.graphicNameCenter = new Graphic.Text(this.player.name, { align: ALIGN.CENTER });
		this.graphicName = new Graphic.Text(this.player.name);
		((this.graphicDescription = new Graphic.Text(system.description.name(), {
			fontSize: Constants.MEDIUM_FONT_SIZE,
		})),
			(this.graphicClass = new Graphic.Text(cl.name(), { fontSize: Constants.MEDIUM_FONT_SIZE })));
		this.graphicLevelName = new Graphic.Text(levelStat.name());
		this.graphicLevel = new Graphic.Text(String(player[levelStat.abbreviation]));
		if (expStat === null) {
			this.graphicExpName = null;
		} else {
			this.graphicExpName = new Graphic.Text(expStat.name(), { fontSize: Constants.MEDIUM_FONT_SIZE });
			this.graphicExp = new Graphic.Text(player.getBarAbbreviation(expStat), {
				fontSize: Constants.MEDIUM_FONT_SIZE,
			});
		}

		// Adding stats
		this.listStatsNames = [];
		this.listStats = [];
		let id: number, statistic: Model.Statistic, graphicName: Graphic.Text, txt: string;
		for (let i = 0, j = 0, l = Data.BattleSystems.statisticsIDs.length; i < l; i++) {
			id = Data.BattleSystems.statisticsIDs[i];
			if (id !== Data.BattleSystems.idLevelStatistic && id !== Data.BattleSystems.idExpStatistic) {
				statistic = Data.BattleSystems.getStatistic(id);
				if (statistic.isRes) {
					continue;
				}
				graphicName = new Graphic.Text(statistic.name() + ':');
				this.listStatsNames.push(graphicName);
				txt = String(this.player[statistic.abbreviation]);
				if (!statistic.isFix) {
					txt += '/' + this.player[statistic.getMaxAbbreviation()];
				}
				this.listStats.push(new Graphic.Text(txt));
				j++;
			}
		}

		// Battler
		this.battler = Data.Pictures.getPictureCopy(PICTURE_KIND.BATTLERS, player.getBattlerID());
		this.battlerFrame = new Frame(250, { frames: Data.Systems.battlersFrames });
	}

	/**
	 *  Initialize the statistic progression
	 */
	initializeStatisticProgression() {
		this.listStatsProgression = [];
		let id: number, statistic: Model.Statistic, value: number, graphic: Graphic.Text;
		for (let i = 0, l = Data.BattleSystems.statisticsIDs.length; i < l; i++) {
			id = Data.BattleSystems.statisticsIDs[i];
			if (id !== Data.BattleSystems.idLevelStatistic && id !== Data.BattleSystems.idExpStatistic) {
				statistic = Data.BattleSystems.getStatistic(id);
				if (statistic.isRes) {
					continue;
				}
				let txt: string;
				if (value > 0) {
					txt = '+';
				} else if (value < 0) {
					txt = '-';
				} else {
					txt = '';
				}
				value = this.player[statistic.abbreviation] - this.player[statistic.getBeforeAbbreviation()];
				graphic = new Graphic.Text(txt + value);
				if (value > 0) {
					graphic.color = Model.Color.GREEN;
				} else if (value < 0) {
					graphic.color = Model.Color.RED;
				}
				this.listStatsProgression.push(graphic);
			}
		}
	}

	/**
	 *  Update the statistic progression.
	 */
	updateStatisticProgression() {
		this.listStatsNames = [];
		this.listStats = [];
		this.maxLength = 0;
		let id: number, statistic: Model.Statistic, graphicName: Graphic.Text, txt: string;
		for (let i = 0, l = Data.BattleSystems.statisticsIDs.length; i < l; i++) {
			id = Data.BattleSystems.statisticsIDs[i];
			if (id !== Data.BattleSystems.idLevelStatistic && id !== Data.BattleSystems.idExpStatistic) {
				statistic = Data.BattleSystems.getStatistic(id);
				graphicName = new Graphic.Text(statistic.name() + ':');
				this.maxLength = Math.max(graphicName.textWidth, this.maxLength);
				this.listStatsNames.push(graphicName);
				txt = '';
				if (this.player.stepLevelUp === 0) {
					txt += statistic.isFix
						? this.player[statistic.getBeforeAbbreviation()]
						: this.player[statistic.abbreviation];
					if (!statistic.isFix) {
						txt += '/' + this.player[statistic.getBeforeAbbreviation()];
					}
					txt += ' -> ';
				}
				txt += this.player[statistic.abbreviation];
				if (!statistic.isFix) {
					txt += '/' + this.player[statistic.getMaxAbbreviation()];
				}
				this.listStats.push(new Graphic.Text(txt));
			}
		}
	}

	/**
	 *  Update the battler frame.
	 */
	updateBattler() {
		if (this.battlerFrame.update()) {
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Drawing the statistic progression.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawStatisticProgression(x: number, y: number, w: number, h: number) {
		for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
			this.listStatsNames[i].draw(x, y * ScreenResolution.getScreenY(30), 0, 0);
			this.listStats[i].draw(
				x + this.maxLength + ScreenResolution.getScreenX(10),
				i * ScreenResolution.getScreenY(30),
				0,
				0,
			);
		}
	}

	/**
	 *  Drawing the player in choice box
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		this.graphicNameCenter.draw(x, y, w, h);
	}

	/**
	 *  Drawing the player description
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		const xCharacter = x + ScreenResolution.getScreenX(160);
		let yName = y + ScreenResolution.getScreenY(30);
		const coef = Constants.BASIC_SQUARE_SIZE / Data.Systems.SQUARE_SIZE;
		const wBattler = this.battler.w / Data.Systems.battlersFrames;
		const hBattler = this.battler.h / Data.Systems.battlersColumns;
		const owBattler = this.battler.oW / Data.Systems.battlersFrames;
		const ohBattler = this.battler.oH / Data.Systems.battlersColumns;

		// Battler
		this.battler.draw({
			x: x + (ScreenResolution.getScreenX(160) - wBattler * coef) / 2,
			y: y + ScreenResolution.getScreenY(120) - hBattler * coef - ScreenResolution.getScreenY(23),
			w: owBattler * coef,
			h: ohBattler * coef,
			sx: this.battlerFrame.value * owBattler,
			sy: 0,
			sw: owBattler,
			sh: ohBattler,
		});

		// Name, level, description, exp
		yName = y + ScreenResolution.getScreenY(15);
		this.graphicName.draw(xCharacter, yName, 0, 0);
		const xLevelName = xCharacter + this.graphicName.textWidth + ScreenResolution.getScreenX(10);
		this.graphicLevelName.draw(xLevelName, yName, 0, 0);
		const xLevel = xLevelName + this.graphicLevelName.textWidth;
		this.graphicLevel.draw(xLevel, yName, 0, 0);
		const xStatus = xLevel + this.graphicLevel.textWidth;
		Status.drawList(this.player.status, xStatus, yName);
		const yClass = yName + ScreenResolution.getScreenY(Constants.HUGE_SPACE);
		this.graphicClass.draw(xCharacter, yClass, 0, 0);
		const yExp = yClass + ScreenResolution.getScreenY(Constants.HUGE_SPACE);
		let yDescription = yExp;
		if (this.graphicExpName !== null) {
			this.graphicExpName.draw(xCharacter, yExp, 0, 0);
			this.graphicExp.draw(
				xCharacter + this.graphicExpName.textWidth + ScreenResolution.getScreenX(Constants.LARGE_SPACE),
				yExp,
				0,
				0,
			);
			yDescription += ScreenResolution.getScreenY(Constants.HUGE_SPACE);
		}
		this.graphicDescription.draw(xCharacter, yDescription, ScreenResolution.getScreenX(900), 0);
		const yStats =
			yDescription + this.graphicDescription.textHeight + ScreenResolution.getScreenY(Constants.HUGE_SPACE);

		// Stats
		let xStat: number, yStat: number;
		if (this.listStats.length > 0) {
			const space = ScreenResolution.getScreenY(45);
			const rows = Math.floor((h - yStats + y) / space);
			for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
				xStat = x + ScreenResolution.getScreenX(Math.floor(i / rows) * 380);
				yStat = yStats + (i % rows) * space;
				this.listStatsNames[i].draw(xStat, yStat, 0, 0);
				this.listStats[i].draw(
					xStat +
						ScreenResolution.getScreenX(160) +
						ScreenResolution.getScreenX(Constants.LARGE_SPACE),
					yStat,
					0,
					0,
				);
			}
		}
	}
}

export { PlayerDescription };
