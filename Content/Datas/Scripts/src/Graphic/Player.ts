/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Graphic, Core, Datas, System, Manager } from "..";
import { Picture2D, Frame, Battler } from "../Core";
import { Base } from "./Base";
import { Utils, Constants, Platform, Enum } from "../Common";
import PictureKind = Enum.PictureKind;

/** @class
 *  The graphic displaying the player minimal stats informations.
 *  @extends Graphic.Base
 *  @param {Player} player The current selected player
 *  @param {boolean} [reverse=false] Indicate if the faceset should be reversed
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
    public listStatsNames: Graphic.Text[];
    public listStats: Graphic.Text[];
    public maxStatNamesLength: number;
    public maxStatLength: number;
    public faceset: Picture2D;
    public battler: Picture2D;
    public battlerFrame: Frame;
    public graphicLevelUp: Graphic.Text;
    public displayNameLevel: boolean;

    constructor(player: Core.Player, reverse = false) {
        super();

        this.player = player;
        this.reverse = reverse;

        // Informations
        let hero = this.player.system;
        let cl = Datas.Classes.get(hero.idClass);
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        let expStat = Datas.BattleSystems.getExpStatistic();

        // All the graphics
        this.graphicName = new Graphic.Text(hero.name);
        this.graphicClass = new Graphic.Text(cl.name(), { fontSize: 10 });
        this.graphicLevelName = new Graphic.Text(levelStat.name);
        this.graphicLevel = new Graphic.Text(Utils.numToString(this.player[
            levelStat.abbreviation]));
        if (expStat === null) {
            this.graphicExpName = null;
        } else {
            this.graphicExpName = new Graphic.Text(expStat.name, { fontSize: 
                Constants.MEDIUM_FONT_SIZE });
            this.graphicExp = new Graphic.Text(this.player.getBarAbbreviation
                (expStat), { fontSize: Constants.MEDIUM_FONT_SIZE });
        }

        // Adding stats
        this.listStatsNames = [];
        this.listStats = [];
        this.maxStatNamesLength = 0;
        this.maxStatLength = 0;
        let id: number, statistic: System.Statistic, graphic: Graphic.Text, c: 
            number, txt: string;
        for (let i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; 
            i++)
        {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
                statistic = Datas.BattleSystems.getStatistic(id);

                // Only display bars
                if (!statistic.isFix) {
                    graphic = new Graphic.Text(statistic.name + Constants
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
        } else {
            this.faceset.setRight();
        }
        this.faceset.setBot(Datas.Systems.getCurrentWindowSkin().borderBotRight[
            3]);
        this.faceset.reverse = this.reverse;

        // Battler
        this.battler = Datas.Pictures.getPictureCopy(PictureKind.Battlers, hero
            .idBattler);
        this.battlerFrame = new Frame(250);

        // Level up
        this.graphicLevelUp = new Graphic.Text("Level up!");
        this.displayNameLevel = true;
    }

    /** 
     *  Update the reverse value for faceset.
     *  @param {boolean} reverse The reverse value
     */
    updateReverse(reverse: boolean) {
        if (reverse) {
            this.faceset.setLeft();
        } else {
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
        let hero = this.player.system;
        let cl = Datas.Classes.get(hero.idClass);
        let levelStat = Datas.BattleSystems.getLevelStatistic();

        // All the graphics
        this.graphicName.setText(hero.name);
        this.graphicClass.setText(cl.name());
        this.graphicLevelName.setText(levelStat.name);
        this.graphicLevel.setText(Utils.numToString(this.player[levelStat
            .abbreviation]));

        // Adding stats
        let id: number, statistic: System.Statistic, txt: string;
        for (let i = 0, j = 0, l = Datas.BattleSystems.statisticsOrder.length; i 
            < l; i++)
        {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
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
     *  @param {boolean} [noDisplayNameLevel=false] Indicate if the level up 
     *  should be displayed or not
     */
    initializeCharacter(noDisplayNameLevel: boolean = false) {
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
     *  Drawing the character.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawCharacter(x: number, y: number, w: number, h: number) {
        // Measure widths
        Platform.ctx.font = this.graphicName.font;
        let wName = Platform.ctx.measureText(this.graphicName.text).width;
        let wLevelName = Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        let xLevelName = x + wName + 10;
        let xLevel = xLevelName + wLevelName;

        // Battler
        let yName = y + 100;
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.oW / Datas.Systems.FRAMES;
        let hBattler = this.battler.oH / Battler.STEPS;
        this.battler.draw(x, yName - (hBattler * coef) - 15, wBattler * coef,
            hBattler * coef, this.battlerFrame.value * wBattler, 0, wBattler, 
            hBattler);

        // Stats
        let yStats = yName;
        if (this.displayNameLevel) {
            this.graphicName.draw(x, yName, 0, 0);
            this.graphicName.updateContextFont();
            this.graphicLevelName.draw(xLevelName, yName, 0, 0);
            this.graphicLevelName.updateContextFont();
            this.graphicLevel.draw(xLevel, yName, 0, 0);
            this.graphicLevel.updateContextFont();
            yStats += 15;
        }
        let yStat: number;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            yStat = yStats + (i * 12);
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxStatNamesLength + 10, yStat, 0, 
                0);
        }
    }

    /** 
     *  Drawing the player in choice box in the main menu.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number) {
        let xCharacter = x + 80;
        let yName = y + 20;
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.oW / Datas.Systems.FRAMES;
        let hBattler = this.battler.oH / Battler.STEPS;

        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + h - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame
            .value * wBattler, 0, wBattler, hBattler);

        // Stats
        this.graphicName.draw(xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont();
        let xLevelName = xCharacter + Platform.ctx.measureText(this.graphicName
            .text).width + 10;
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        let xLevel = xLevelName + Platform.ctx.measureText(this.graphicLevelName
            .text).width;
        this.graphicLevel.draw(xLevel, yName, 0, 0);

        // Level up
        if (this.player.levelingUp) {
            this.graphicLevelUp.draw(xLevel + Platform.ctx.measureText(this
                .graphicLevel.text).width + 10, yName, 0, 0);
        }

        let yClass = yName + 15;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        let yExp = yClass + 29;
        if (this.graphicExpName !== null) {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + Platform.ctx.measureText(this
                .graphicExpName.text).width + 10, yExp, 0, 0);
        }
    }

    /** 
     *  Drawing the player informations in battles.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number) {
        // Measure widths
        this.graphicName.updateContextFontReal();
        this.graphicLevelName.updateContextFontReal();
        this.graphicLevel.updateContextFontReal();
        let wName = Platform.ctx.measureText(this.graphicName.text).width;
        let wLevelName = Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        let xLevelName = x + wName + 10;
        let xLevel = xLevelName + wLevelName;
        let firstLineLength = xLevel + Platform.ctx.measureText(this
            .graphicLevel.text).width;
        let xOffset = this.reverse ? w - Math.max(firstLineLength, this
            .maxStatNamesLength + 10 + this.maxStatLength) : 0;
        
        let yName = y + 10;
        this.graphicName.draw(x + xOffset, yName, 0, 0);
        this.graphicName.updateContextFont();
        this.graphicLevelName.draw(xLevelName + xOffset, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        this.graphicLevel.draw(xLevel + xOffset, yName, 0, 0);
        let yStats = yName + 20;

        // Stats
        let xStat: number, yStat: number;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            xStat = x + xOffset;
            yStat = yStats + (i*20);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.maxStatNamesLength + 10, yStat, 
                0, 0);
        }

        // Faceset
        this.faceset.draw();
    }
}

export { Player }