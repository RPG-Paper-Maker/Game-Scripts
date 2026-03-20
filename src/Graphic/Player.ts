/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, PICTURE_KIND, ScreenResolution } from '../Common';
import { Frame, Picture2D, Rectangle } from '../Core';
import { Status } from '../Core/Status';
import { Core, Data, Graphic, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
class Player extends Base {
	public player: Core.Player;
	public reverse: boolean;
	public graphicName: Graphic.Text;
	public graphicClass: Graphic.Text;
	public graphicLevelName: Graphic.Text;
	public graphicLevel: Graphic.Text;
	public graphicExpName: Graphic.Text;
	public graphicExp: Graphic.Text;
	public listStatistics: Graphic.Statistic[];
	public maxStatNamesLength: number;
	public maxStatLength: number;
	public faceset: Picture2D;
	public battler: Picture2D;
	public battlerFrame: Frame;
	public graphicLevelUp: Graphic.Text;
	public displayNameLevel: boolean;
	public graphicStatShort: Graphic.Text;
	public isMainMenu: boolean;
	public battlerRect: Rectangle = new Rectangle();

	constructor(
		player: Core.Player,
		{
			isMainMenu = false,
			reverse = false,
		}: {
			isMainMenu?: boolean;
			reverse?: boolean;
		} = {},
	) {
		super();

		this.player = player;
		this.isMainMenu = isMainMenu;
		this.reverse = reverse;

		// Informations
		const hero = this.player.system;
		const cl = this.player.getClass();
		const levelStat = Data.BattleSystems.getLevelStatistic();
		const expStat = Data.BattleSystems.getExpStatistic();

		// All the graphics
		this.graphicName = new Graphic.Text(this.player.name);
		this.graphicClass = new Graphic.Text(cl.name(), { fontSize: 10 });
		this.graphicLevelName = new Graphic.Text(levelStat.name());
		this.graphicLevel = new Graphic.Text(String(this.player[levelStat.abbreviation]));
		if (expStat === null) {
			this.graphicExpName = null;
		} else {
			this.graphicExpName = new Graphic.Text(expStat.name(), { fontSize: Constants.MEDIUM_FONT_SIZE });
			this.graphicExp = new Graphic.Text(this.player.getBarAbbreviation(expStat), {
				fontSize: Constants.MEDIUM_FONT_SIZE,
			});
		}

		// Adding stats
		this.listStatistics = [];
		this.maxStatNamesLength = 0;
		let statistics: number[];
		let i: number, l: number;
		if (this.isMainMenu) {
			l = Data.Systems.heroesStatistics.length;
			statistics = new Array(l);
			for (i = 0; i < l; i++) {
				statistics[i] = Data.Systems.heroesStatistics[i].getValue() as number;
			}
		} else {
			statistics = Data.BattleSystems.statisticsIDs;
		}
		let id: number, statistic: Model.Statistic, graphic: Graphic.Statistic;
		for (i = 0, l = statistics.length; i < l; i++) {
			id = statistics[i];
			if (id !== Data.BattleSystems.idLevelStatistic && id !== Data.BattleSystems.idExpStatistic) {
				statistic = Data.BattleSystems.getStatistic(id);

				// Only display bars
				if (!statistic.isFix) {
					graphic = new Graphic.Statistic(this.player, statistic);
					if (graphic.maxStatNamesLength > this.maxStatNamesLength) {
						this.maxStatNamesLength = graphic.maxStatNamesLength;
					}
					this.listStatistics.push(graphic);
				}
			}
		}
		for (graphic of this.listStatistics) {
			graphic.maxStatNamesLength = this.maxStatNamesLength;
		}

		// Faceset
		this.faceset = Data.Pictures.getPictureCopy(PICTURE_KIND.FACESETS, player.getFacesetID());
		if (this.reverse) {
			this.faceset.setLeft(Data.Systems.getCurrentWindowSkin().borderBotLeft.width);
		} else {
			this.faceset.setRight(true, Data.Systems.getCurrentWindowSkin().borderBotRight.width);
		}
		this.faceset.setBot(true, Data.Systems.getCurrentWindowSkin().borderBotRight.height);
		this.faceset.reverse = this.reverse;

		// Battler
		this.battler = Data.Pictures.getPictureCopy(PICTURE_KIND.BATTLERS, player.getBattlerID());
		this.battlerFrame = new Frame(250, { frames: Data.Systems.battlersFrames });

		// Level up
		this.graphicLevelUp = new Graphic.Text(Data.Languages.extras.levelUp.name());
		this.displayNameLevel = true;
	}

	/**
	 *  Update the reverse value for faceset.
	 *  @param {boolean} reverse - The reverse value
	 */
	updateReverse(reverse: boolean) {
		if (reverse) {
			this.faceset.setLeft(Data.Systems.getCurrentWindowSkin().borderBotLeft.width);
		} else {
			this.faceset.setRight(true, Data.Systems.getCurrentWindowSkin().borderBotRight.width);
		}
		this.faceset.reverse = reverse;
		this.reverse = reverse;
	}

	/**
	 *  Update the graphics
	 */
	update() {
		// Informations
		const cl = this.player.getClass();
		const levelStat = Data.BattleSystems.getLevelStatistic();

		// All the graphics
		this.graphicName.setText(this.player.name);
		this.graphicClass.setText(cl.name());
		this.graphicLevelName.setText(levelStat.name());
		this.graphicLevel.setText(String(this.player[levelStat.abbreviation]));
		for (const graphic of this.listStatistics) {
			graphic.update();
		}
	}

	/**
	 *  Update experience graphics.
	 */
	updateExperience() {
		this.graphicLevel.setText(String(this.player[Data.BattleSystems.getLevelStatistic().abbreviation]));
		this.graphicExp.setText(this.player.getBarAbbreviation(Data.BattleSystems.getExpStatistic()));
	}

	/**
	 *  Initialize character graphics font size.
	 *  @param {boolean} [noDisplayNameLevel=false] - Indicate if the level up
	 *  should be displayed or not
	 */
	initializeCharacter(noDisplayNameLevel: boolean = false) {
		if (noDisplayNameLevel) {
			this.displayNameLevel = false;
		}
		this.graphicName.setFontSize(Constants.MEDIUM_FONT_SIZE);
		this.graphicLevelName.setFontSize(Constants.MEDIUM_FONT_SIZE);
		this.graphicLevel.setFontSize(Constants.MEDIUM_FONT_SIZE);
		for (const graphic of this.listStatistics) {
			graphic.setFontSize(Constants.SMALL_FONT_SIZE);
		}
	}

	/**
	 *  Update battler frame.
	 */
	updateBattler() {
		if (this.battlerFrame.update()) {
			Manager.Stack.requestPaintHUD = true;
		}
	}

	/**
	 *  Update stat short.
	 *  @param {number} equipmentID
	 *  @param {System.CommonSkillItem} weaponArmor
	 */
	updateStatShort(weaponArmor: Model.CommonSkillItem) {
		const totalBonus = this.player.getBestWeaponArmorToReplace(weaponArmor)[0];
		if (totalBonus > 0) {
			this.graphicStatShort = new Graphic.Text('^', { color: Model.Color.GREEN });
		} else if (totalBonus < 0) {
			this.graphicStatShort = new Graphic.Text('ˇ', { color: Model.Color.RED });
		} else {
			this.graphicStatShort = new Graphic.Text('-', { color: Model.Color.GREY });
		}
	}

	/**
	 *  Update stat short to none.
	 */
	updateStatShortNone() {
		this.graphicStatShort = null;
	}

	/**
	 *  Drawing the character.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawCharacter(x: number, y: number, w: number, h: number) {
		// Battler
		let yOffset = ScreenResolution.getScreenMinXY(100);
		const coef = Constants.BASIC_SQUARE_SIZE / Data.Systems.SQUARE_SIZE;
		const wBattler = this.battler.w / Data.Systems.battlersFrames;
		const hBattler = this.battler.h / Data.Systems.battlersColumns;
		const owBattler = this.battler.oW / Data.Systems.battlersFrames;
		const ohBattler = this.battler.oH / Data.Systems.battlersColumns;
		this.battlerRect.setCoords(
			x,
			y + yOffset - hBattler * coef - ScreenResolution.getScreenMinXY(15),
			wBattler * coef,
			hBattler * coef,
		);
		this.battler.draw({
			x: this.battlerRect.x,
			y: this.battlerRect.y,
			w: owBattler * coef,
			h: ohBattler * coef,
			sx: this.battlerFrame.value * owBattler,
			sy: 0,
			sw: owBattler,
			sh: ohBattler,
		});

		// Stats
		let xOffset = this.graphicName.textWidth;
		if (this.graphicStatShort) {
			this.graphicStatShort.draw(x, y + yOffset - ScreenResolution.getScreenMinXY(15), 0, 0);
		}
		if (this.displayNameLevel) {
			this.graphicName.draw(x, y + yOffset, 0, 0);
			xOffset = this.graphicName.textWidth + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
			this.graphicLevelName.draw(x + xOffset, y + yOffset, 0, 0);
			xOffset += this.graphicLevelName.textWidth;
			this.graphicLevel.draw(x + xOffset, y + yOffset, 0, 0);
			yOffset += ScreenResolution.getScreenMinXY(15);
		}
		let yStat: number;
		for (let i = 0, l = this.listStatistics.length; i < l; i++) {
			yStat = yOffset + i * ScreenResolution.getScreenMinXY(12);
			this.listStatistics[i].draw(x, y + yStat, w, h);
		}
	}

	/**
	 *  Drawing the player in choice box in the main menu.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		const xCharacter = x + ScreenResolution.getScreenMinXY(80);
		const yName = y + ScreenResolution.getScreenMinXY(20);
		const coef = Constants.BASIC_SQUARE_SIZE / Data.Systems.SQUARE_SIZE;
		const wBattler = this.battler.w / Data.Systems.battlersFrames;
		const owBattler = this.battler.oW / Data.Systems.battlersFrames;
		const ohBattler = this.battler.oH / Data.Systems.battlersColumns;

		// Battler
		this.battler.draw({
			x: x + (ScreenResolution.getScreenMinXY(80) - wBattler * coef) / 2,
			y: y,
			w: owBattler * coef,
			h: ohBattler * coef,
			sx: this.battlerFrame.value * owBattler,
			sy: 0,
			sw: owBattler,
			sh: ohBattler,
		});

		// Stats
		this.graphicName.draw(xCharacter, yName, 0, 0);
		const xLevelName =
			xCharacter + this.graphicName.textWidth + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
		this.graphicLevelName.draw(xLevelName, yName, 0, 0);
		const xLevel = xLevelName + this.graphicLevelName.textWidth;
		this.graphicLevel.draw(xLevel, yName, 0, 0);
		const xStatus = xLevel + this.graphicLevel.textWidth;
		if (this.player.status.length > 0) {
			Status.drawList(this.player.status, xStatus, yName);
		}

		// Right stats
		if (this.isMainMenu) {
			const xStat = x + w - ScreenResolution.getScreenMinXY(125);
			let i: number, l: number, yStat: number;
			for (i = 0, l = this.listStatistics.length; i < l; i++) {
				yStat = yName + ScreenResolution.getScreenMinXY(i * 20);
				this.listStatistics[i].draw(xStat, yStat, w, h);
			}
		}

		// Level up
		if (this.player.levelingUp) {
			this.graphicLevelUp.draw(
				xLevel + this.graphicLevel.textWidth + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE),
				yName,
				0,
				0,
			);
		}

		const yClass = yName + ScreenResolution.getScreenMinXY(15);
		this.graphicClass.draw(xCharacter, yClass, 0, 0);
		const yExp = yClass + ScreenResolution.getScreenMinXY(29);
		if (this.graphicExpName !== null) {
			this.graphicExpName.draw(xCharacter, yExp, 0, 0);
			this.graphicExp.draw(
				xCharacter + this.graphicExpName.textWidth + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE),
				yExp,
				0,
				0,
			);
		}
	}

	/**
	 *  Drawing the player informations in battles.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		const wName = this.graphicName.textWidth;
		const wLevelName = this.graphicLevelName.textWidth;
		const xLevelName = x + wName + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
		const xLevel = xLevelName + wLevelName;
		const firstLineLength = xLevel + this.graphicLevel.textWidth;
		const xOffset = this.reverse ? ScreenResolution.getScreenMinXY(Data.Systems.facesetScalingWidth) : 0;

		// Name, level, status
		const yName = y + ScreenResolution.getScreenMinXY(10);
		this.graphicName.draw(x + xOffset, yName, 0, 0);
		this.graphicLevelName.draw(xLevelName + xOffset, yName, 0, 0);
		this.graphicLevel.draw(xLevel + xOffset, yName, 0, 0);
		Status.drawList(this.player.status, firstLineLength, yName);
		const yStats = yName + ScreenResolution.getScreenMinXY(20);

		// Stats
		let i: number, l: number, xStat: number, yStat: number;
		for (i = 0, l = this.listStatistics.length; i < l; i++) {
			xStat = x + xOffset;
			yStat = yStats + ScreenResolution.getScreenMinXY(i * 20);
			this.listStatistics[i].draw(xStat, yStat, w, h);
		}

		// Faceset
		this.faceset.draw({
			sx: this.player.getFacesetIndexX() * Data.Systems.facesetsSize,
			sy: this.player.getFacesetIndexY() * Data.Systems.facesetsSize,
			sw: Data.Systems.facesetsSize,
			sh: Data.Systems.facesetsSize,
			w: Data.Systems.facesetScalingWidth,
			h: Data.Systems.facesetScalingHeight,
		});
	}
}

export { Player };
