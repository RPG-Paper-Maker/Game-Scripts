/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Graphic, Datas, System, Manager } from "../index.js";
import { Frame, Rectangle } from "../Core/index.js";
import { Base } from "./Base.js";
import { Utils, Constants, Platform, Enum, ScreenResolution } from "../Common/index.js";
var PictureKind = Enum.PictureKind;
import { Status } from "../Core/Status.js";
/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {boolean} [reverse=false] - Indicate if the faceset should be reversed
 */
class Player extends Base {
    constructor(player, { isMainMenu = false, reverse = false } = {}) {
        super();
        this.battlerRect = new Rectangle();
        this.player = player;
        this.isMainMenu = isMainMenu;
        this.reverse = reverse;
        // Informations
        let hero = this.player.system;
        let cl = this.player.getClass();
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        let expStat = Datas.BattleSystems.getExpStatistic();
        // All the graphics
        this.graphicName = new Graphic.Text(this.player.name);
        this.graphicClass = new Graphic.Text(cl.name(), { fontSize: 10 });
        this.graphicLevelName = new Graphic.Text(levelStat.name());
        this.graphicLevel = new Graphic.Text(Utils.numToString(this.player[levelStat.abbreviation]));
        if (expStat === null) {
            this.graphicExpName = null;
        }
        else {
            this.graphicExpName = new Graphic.Text(expStat.name(), { fontSize: Constants.MEDIUM_FONT_SIZE });
            this.graphicExp = new Graphic.Text(this.player.getBarAbbreviation(expStat), { fontSize: Constants.MEDIUM_FONT_SIZE });
        }
        // Adding stats
        this.listStatsNames = [];
        this.listStats = [];
        this.maxStatNamesLength = 0;
        this.maxStatLength = 0;
        let statistics;
        let i, l;
        if (this.isMainMenu) {
            l = Datas.Systems.heroesStatistics.length;
            statistics = new Array(l);
            for (i = 0; i < l; i++) {
                statistics[i] = Datas.Systems.heroesStatistics[i].getValue();
            }
        }
        else {
            statistics = Datas.BattleSystems.statisticsOrder;
        }
        let id, statistic, graphic, c, txt;
        for (i = 0, l = statistics.length; i < l; i++) {
            id = statistics[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                // Only display bars
                if (!statistic.isFix) {
                    graphic = new Graphic.Text(statistic.name() + Constants
                        .STRING_COLON);
                    Platform.ctx.font = graphic.font;
                    graphic.updateContextFont();
                    c = Platform.ctx.measureText(graphic.text).width;
                    if (c > this.maxStatNamesLength) {
                        this.maxStatNamesLength = c;
                    }
                    this.listStatsNames.push(graphic);
                    txt = Utils.numToString(this.player[statistic.abbreviation]);
                    if (!statistic.isFix) {
                        txt += Constants.STRING_SLASH + this.player[statistic
                            .getMaxAbbreviation()];
                    }
                    graphic = new Graphic.Text(txt);
                    c = Platform.ctx.measureText(graphic.text).width;
                    if (c > this.maxStatNamesLength) {
                        this.maxStatLength = c;
                    }
                    this.listStats.push(graphic);
                }
            }
        }
        // Faceset
        this.faceset = Datas.Pictures.getPictureCopy(PictureKind.Facesets, hero
            .idFaceset);
        if (this.reverse) {
            this.faceset.setLeft();
        }
        else {
            this.faceset.setRight();
        }
        this.faceset.setBot(Datas.Systems.getCurrentWindowSkin().borderBotRight[3]);
        this.faceset.reverse = this.reverse;
        // Battler
        this.battler = Datas.Pictures.getPictureCopy(PictureKind.Battlers, hero
            .idBattler);
        this.battlerFrame = new Frame(250, { frames: Datas.Systems.battlersFrames });
        // Level up
        this.graphicLevelUp = new Graphic.Text("Level up!");
        this.displayNameLevel = true;
    }
    /**
     *  Update the reverse value for faceset.
     *  @param {boolean} reverse - The reverse value
     */
    updateReverse(reverse) {
        if (reverse) {
            this.faceset.setLeft();
        }
        else {
            this.faceset.setRight();
        }
        this.faceset.reverse = reverse;
        this.reverse = reverse;
    }
    /**
     *  Update the graphics
     */
    update() {
        // Informations
        let cl = this.player.getClass();
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        // All the graphics
        this.graphicName.setText(this.player.name);
        this.graphicClass.setText(cl.name());
        this.graphicLevelName.setText(levelStat.name());
        this.graphicLevel.setText(Utils.numToString(this.player[levelStat
            .abbreviation]));
        // Adding stats
        let statistics;
        let i, l;
        if (this.isMainMenu) {
            l = Datas.Systems.heroesStatistics.length;
            statistics = new Array(l);
            for (i = 0; i < l; i++) {
                statistics[i] = Datas.Systems.heroesStatistics[i].getValue();
            }
        }
        else {
            statistics = Datas.BattleSystems.statisticsOrder;
        }
        let id, statistic, txt;
        for (let i = 0, j = 0, l = statistics.length; i < l; i++) {
            id = statistics[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                // Only display bars
                if (!statistic.isFix) {
                    txt = Utils.numToString(this.player[statistic.abbreviation]);
                    if (!statistic.isFix) {
                        txt += Constants.STRING_SLASH + this.player[statistic
                            .getMaxAbbreviation()];
                    }
                    this.listStats[j++].setText(txt);
                }
            }
        }
    }
    /**
     *  Update experience graphics.
     */
    updateExperience() {
        this.graphicLevel.setText(Utils.numToString(this.player[Datas
            .BattleSystems.getLevelStatistic().abbreviation]));
        this.graphicExp.setText(this.player.getBarAbbreviation(Datas
            .BattleSystems.getExpStatistic()));
    }
    /**
     *  Initialize character graphics font size.
     *  @param {boolean} [noDisplayNameLevel=false] - Indicate if the level up
     *  should be displayed or not
     */
    initializeCharacter(noDisplayNameLevel = false) {
        if (noDisplayNameLevel) {
            this.displayNameLevel = false;
        }
        this.graphicName.setFontSize(Constants.MEDIUM_FONT_SIZE);
        this.graphicLevelName.setFontSize(Constants.MEDIUM_FONT_SIZE);
        this.graphicLevel.setFontSize(Constants.MEDIUM_FONT_SIZE);
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            this.listStatsNames[i].setFontSize(Constants.SMALL_FONT_SIZE);
            this.listStats[i].setFontSize(Constants.SMALL_FONT_SIZE);
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
    updateStatShort(weaponArmor) {
        let totalBonus = this.player.getBestWeaponArmorToReplace(weaponArmor)[0];
        if (totalBonus > 0) {
            this.graphicStatShort = new Graphic.Text("^", { color: System.Color.GREEN });
        }
        else if (totalBonus < 0) {
            this.graphicStatShort = new Graphic.Text("ˇ", { color: System.Color.RED });
        }
        else {
            this.graphicStatShort = new Graphic.Text("-", { color: System.Color.GREY });
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
    drawCharacter(x, y, w, h) {
        // Measure widths
        this.graphicName.updateContextFont();
        let wName = Platform.ctx.measureText(this.graphicName.text).width;
        this.graphicLevelName.updateContextFont();
        let wLevelName = Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        let xLevelName = x + wName + Constants.MEDIUM_SPACE;
        let xLevel = xLevelName + wLevelName;
        // Battler
        let yName = y + 100;
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.oW / Datas.Systems.battlersFrames;
        let hBattler = this.battler.oH / Datas.Systems.battlersColumns;
        this.battlerRect.setCoords(x, yName - (hBattler * coef) - 15, wBattler *
            coef, hBattler * coef);
        this.battler.draw(this.battlerRect.x, this.battlerRect.y, this.battlerRect
            .width, this.battlerRect.height, this.battlerFrame.value * wBattler, 0, wBattler, hBattler);
        this.battlerRect.setCoords(ScreenResolution.getScreenX(this.battlerRect
            .x), ScreenResolution.getScreenY(this.battlerRect.y), ScreenResolution
            .getScreenMinXY(this.battlerRect.width), ScreenResolution
            .getScreenMinXY(this.battlerRect.height));
        // Stats
        let yStats = yName;
        if (this.graphicStatShort) {
            this.graphicStatShort.draw(x, yStats - 15, 0, 0);
        }
        if (this.displayNameLevel) {
            this.graphicName.draw(x, yName, 0, 0);
            this.graphicLevelName.draw(xLevelName, yName, 0, 0);
            this.graphicLevel.draw(xLevel, yName, 0, 0);
            yStats += 15;
        }
        let yStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            yStat = yStats + i * 12;
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxStatNamesLength + 10, yStat, 0, 0);
        }
    }
    /**
     *  Drawing the player in choice box in the main menu.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x, y, w, h) {
        let xCharacter = x + 80;
        let yName = y + 20;
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.oW / Datas.Systems.battlersFrames;
        let hBattler = this.battler.oH / Datas.Systems.battlersColumns;
        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + h - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame
            .value * wBattler, 0, wBattler, hBattler);
        // Stats
        this.graphicName.draw(xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont();
        let xLevelName = xCharacter + Platform.ctx.measureText(this.graphicName
            .text).width + Constants.MEDIUM_SPACE;
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        let xLevel = xLevelName + Platform.ctx.measureText(this.graphicLevelName
            .text).width;
        this.graphicLevel.draw(xLevel, yName, 0, 0);
        this.graphicLevel.updateContextFont();
        let xStatus = xLevel + Platform.ctx.measureText(this.graphicLevel.text)
            .width;
        if (this.player.status.length > 0) {
            Status.drawList(this.player.status, xStatus, yName);
        }
        // Right stats
        if (this.isMainMenu) {
            let xStat = x + w - 125;
            let i, l, yStat;
            for (i = 0, l = this.listStatsNames.length; i < l; i++) {
                yStat = yName + (i * 20);
                this.listStatsNames[i].draw(xStat, yStat, 0, 0);
                this.listStats[i].draw(xStat + this.maxStatNamesLength + 10, yStat, 0, 0);
            }
        }
        // Level up
        if (this.player.levelingUp) {
            this.graphicLevelUp.draw(xLevel + Platform.ctx.measureText(this
                .graphicLevel.text).width + Constants.MEDIUM_SPACE, yName, 0, 0);
        }
        let yClass = yName + 15;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        let yExp = yClass + 29;
        if (this.graphicExpName !== null) {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + Platform.ctx.measureText(this
                .graphicExpName.text).width + Constants.MEDIUM_SPACE, yExp, 0, 0);
        }
    }
    /**
     *  Drawing the player informations in battles.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x, y, w, h) {
        // Measure widths
        this.graphicName.updateContextFont();
        let wName = Platform.ctx.measureText(this.graphicName.text).width;
        this.graphicLevelName.updateContextFont();
        let wLevelName = Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        let xLevelName = x + wName + Constants.MEDIUM_SPACE;
        let xLevel = xLevelName + wLevelName;
        this.graphicLevel.updateContextFont();
        let firstLineLength = xLevel + Platform.ctx.measureText(this
            .graphicLevel.text).width;
        let xOffset = this.reverse ? w - Math.max(firstLineLength, this
            .maxStatNamesLength + 10 + this.maxStatLength) : 0;
        // Name, level, status
        let yName = y + 10;
        this.graphicName.draw(x + xOffset, yName, 0, 0);
        this.graphicName.updateContextFont();
        this.graphicLevelName.draw(xLevelName + xOffset, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        this.graphicLevel.draw(xLevel + xOffset, yName, 0, 0);
        Status.drawList(this.player.status, firstLineLength, yName);
        let yStats = yName + 20;
        // Stats
        let i, l, xStat, yStat;
        for (i = 0, l = this.listStatsNames.length; i < l; i++) {
            xStat = x + xOffset;
            yStat = yStats + (i * 20);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.maxStatNamesLength + 10, yStat, 0, 0);
        }
        // Faceset
        this.faceset.draw();
    }
}
export { Player };
