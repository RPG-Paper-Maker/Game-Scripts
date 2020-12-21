/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Player, Picture2D, Frame, Battler } from "../Core";
import { Graphic, Datas, System, Manager } from "..";
import { Enum, Constants, Utils, Platform } from "../Common";
import Align = Enum.Align;
import PictureKind = Enum.PictureKind;

/** @class
 *  The graphic displaying all the stats in the player description state menu.
 *  @extends Graphic.Base
 *  @param {Player} player The current selected player
 */
class PlayerDescription extends Base {

    public player: Player;
    public graphicNameCenter: Graphic.Text;
    public graphicName: Graphic.Text;
    public graphicClass: Graphic.Text;
    public graphicLevelName: Graphic.Text;
    public graphicLevel: Graphic.Text;
    public graphicExpName: Graphic.Text;
    public graphicExp: Graphic.Text;
    public listStatsNames: Graphic.Text[];
    public listStats: Graphic.Text[];
    public listLength: number[];
    public battler: Picture2D;
    public battlerFrame: Frame;
    public listStatsProgression: Graphic.Text[];
    public maxLength: number;

    constructor(player: Player) {
        super();

        this.player = player;

        // Informations
        let system = this.player.system;
        let cl = Datas.Classes.get(system.idClass);
        let levelStat = Datas.BattleSystems.getLevelStatistic();
        let expStat = Datas.BattleSystems.getExpStatistic();

        // All the graphics
        this.graphicNameCenter = new Graphic.Text(system.name, { align: Align
            .Center });
        this.graphicName = new Graphic.Text(system.name);
        this.graphicClass = new Graphic.Text(cl.name(), { fontSize: Constants
            .MEDIUM_FONT_SIZE });
        this.graphicLevelName = new Graphic.Text(levelStat.name);
        this.graphicLevel = new Graphic.Text(Utils.numToString(player[levelStat
            .abbreviation]));
        if (expStat === null) {
            this.graphicExpName = null;
        } else {
            this.graphicExpName = new Graphic.Text(expStat.name, { fontSize: 
                Constants.MEDIUM_FONT_SIZE });
            this.graphicExp = new Graphic.Text(player.getBarAbbreviation(expStat
                ), { fontSize: Constants.MEDIUM_FONT_SIZE });
        }

        // Adding stats
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.listLength = new Array;
        let maxLength = 0;
        let id: number, statistic: System.Statistic, graphicName: Graphic.Text, 
            txt: string;
        for (let i = 0, j = 0, l = Datas.BattleSystems.statisticsOrder.length; i
            < l; i++)
        {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
                statistic = Datas.BattleSystems.getStatistic(id);
                if (statistic.isRes) {
                    continue;
                }
                graphicName = new Graphic.Text(statistic.name + Constants
                    .STRING_COLON);
                Platform.ctx.font = graphicName.font;
                graphicName.updateContextFont();
                maxLength = Math.max(Platform.ctx.measureText(graphicName.text)
                    .width, maxLength)
                if (j % 7 === 6) {
                    this.listLength.push(maxLength);
                    maxLength = 0;
                }
                this.listStatsNames.push(graphicName);
                txt = Utils.numToString(this.player[statistic.abbreviation]);
                if (!statistic.isFix) {
                    txt += Constants.STRING_SLASH + this.player[statistic
                        .getMaxAbbreviation()];
                }
                this.listStats.push(new Graphic.Text(txt));
                j++;
            }
        }
        this.listLength.push(maxLength);

        // Battler
        this.battler = Datas.Pictures.getPictureCopy(PictureKind.Battlers, 
            system.idBattler);
        this.battlerFrame = new Frame(250);
    }

    /** 
     *  Initialize the statistic progression
     */
    initializeStatisticProgression() {
        this.listStatsProgression = new Array;
        let id: number, statistic: System.Statistic, value: number, graphic: 
            Graphic.Text;
        for (let i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
                statistic = Datas.BattleSystems.getStatistic(id);
                if (statistic.isRes) {
                    continue;
                }
                let txt: string;
                if (value > 0) {
                    txt = "+";
                } else if (value < 0) {
                    txt = "-";
                } else {
                    txt = "";
                }
                value = this.player[statistic.abbreviation] - this.player[
                    statistic.getBeforeAbbreviation()];
                graphic = new Graphic.Text(txt + value);
                if (value > 0) {
                    graphic.color = System.Color.GREEN;
                } else if (value < 0) {
                    graphic.color = System.Color.RED;
                }
                this.listStatsProgression.push(graphic);
            }
        }
    }

    /** 
     *  Update the statistic progression.
     */
    updateStatisticProgression() {
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        let id: number, statistic: System.Statistic, graphicName: Graphic.Text, 
            txt: string;
        for (let i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic)
            {
                statistic = Datas.BattleSystems.getStatistic(id);
                graphicName = new Graphic.Text(statistic.name + Constants
                    .STRING_COLON);
                Platform.ctx.font = graphicName.font;
                graphicName.updateContextFont();
                this.maxLength = Math.max(Platform.ctx.measureText(graphicName
                    .text).width, this.maxLength);
                this.listStatsNames.push(graphicName);
                txt = "";
                if (this.player.stepLevelUp === 0) {
                    txt += statistic.isFix ? this.player[statistic
                        .getBeforeAbbreviation()] : this.player[statistic
                        .abbreviation];
                    if (!statistic.isFix) {
                        txt += Constants.STRING_SLASH + this.player[statistic
                            .getBeforeAbbreviation()];
                    }
                    txt += " -> ";
                }
                txt += this.player[statistic.abbreviation];
                if (!statistic.isFix) {
                    txt += Constants.STRING_SLASH + this.player[statistic
                        .getMaxAbbreviation()];
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
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawStatisticProgression(x: number, y: number, w: number, h: number) {
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            this.listStatsNames[i].draw(x, y * 30, 0, 0);
            this.listStats[i].draw(x + this.maxLength + 10 , i * 30, 0, 0);
        }
    }

    /** 
     *  Drawing the player in choice box
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.graphicNameCenter.draw(x, y, w, h);
    }

    /**
     *  Drawing the player description
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        let xCharacter = x + 80;
        let yName = y + 20;
        let coef = Constants.BASIC_SQUARE_SIZE / Datas.Systems.SQUARE_SIZE;
        let wBattler = this.battler.oW / Datas.Systems.FRAMES;
        let hBattler = this.battler.oH / Battler.STEPS;

        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + 80 - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame
            .value * wBattler, 0, wBattler, hBattler);

        // Name, level, exp
        yName = y + 10;
        this.graphicName.draw(xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont();
        let xLevelName = xCharacter + Platform.ctx.measureText(this.graphicName
            .text).width + 10;
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        let xLevel = xLevelName + Platform.ctx.measureText(this.graphicLevelName
            .text).width;
        this.graphicLevel.draw(xLevel, yName, 0, 0);
        let yClass = yName + 20;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        let yExp = yClass + 20;
        if (this.graphicExpName !== null) {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + Platform.ctx.measureText(this
                .graphicExpName.text).width + 10, yExp, 0, 0);
        }
        let yStats = yExp + 30;

        // Stats
        let xStat: number, yStat: number;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            xStat = x + (Math.floor(i/7)*190);
            yStat = yStats + ((i%7)*30);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.listLength[Math.floor(i/7)] + 10
                , yStat, 0, 0);
        }
    }
}

export { PlayerDescription }