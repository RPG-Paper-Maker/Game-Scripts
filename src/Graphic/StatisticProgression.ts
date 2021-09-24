/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Player } from "../Core";
import { Graphic, System, Datas } from "..";
import { Constants, Platform, ScreenResolution, Utils } from "../Common";
import { Base } from "./Base";

/** @class
 *  The graphic displaying all the stats in the player description state menu.
 *  @param {GamePlayer} gamePlayer - The current selected player
 */
class StatisticProgression extends Base {

    public player: Player;
    public listStatsProgression: Graphic.Text[];
    public listStatsNames: Graphic.Text[];
    public listStats: Graphic.Text[];
    public maxLength: number;
    public maxProgressionLength: number;

    constructor(player: Player) {
        super();

        this.player = player;
        this.listStatsProgression = new Array;
        let id: number, statistic: System.Statistic, value: number, txt: string, 
            graphic: Graphic.Text;
        for (let i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                value = this.player[statistic.getAbbreviationNext()] - this
                    .player[statistic.getBeforeAbbreviation()];
                txt = value >= 0 ? "+" : "-";
                graphic = new Graphic.Text(txt + value);
                if (value > 0) {
                    graphic.color = System.Color.GREEN;
                } else if (value < 0) {
                    graphic.color = System.Color.RED;
                }
                this.listStatsProgression.push(graphic);
            }
        }
        this.updateStatisticProgression();
    }

    /**
     *  Update the statistic progression graphics.
     */
    updateStatisticProgression() {
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        this.maxProgressionLength = 0;
        let id: number, statistic: System.Statistic, graphic: Graphic.Text, txt: 
            string;
        for (let i = 0, l = Datas.BattleSystems.statisticsOrder.length; i < l; i++) {
            id = Datas.BattleSystems.statisticsOrder[i];
            if (id !== Datas.BattleSystems.idLevelStatistic && id !== Datas
                .BattleSystems.idExpStatistic) {
                statistic = Datas.BattleSystems.getStatistic(id);
                if (statistic.isRes) {
                    continue;
                }
                graphic = new Graphic.Text(statistic.name() + Constants.STRING_COLON);
                this.maxLength = Math.max(graphic.textWidth, this.maxLength);
                this.listStatsNames.push(graphic);
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
                txt += Utils.numToString(this.player[statistic.abbreviation]);
                if (!statistic.isFix) {
                    txt += Constants.STRING_SLASH + this.player[statistic
                        .getMaxAbbreviation()];
                }
                graphic = new Graphic.Text(txt);
                this.maxProgressionLength = Math.max(graphic.textWidth, this
                    .maxProgressionLength);
                this.listStats.push(graphic);
            }
        }
    }

    /** 
     *  Get the stat names list height.
     *  @returns {number}
     */
    getHeight(): number {
        return this.listStatsNames.length * ScreenResolution.getScreenMinXY(
            Constants.HUGE_SPACE);
    }

    /** 
     *  Drawing the player description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the player description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        let yStat: number;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++) {
            yStat = y + ScreenResolution.getScreenMinXY(i * Constants.HUGE_SPACE);
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxLength + ScreenResolution
                .getScreenMinXY(Constants.LARGE_SPACE) , yStat, 0, 0);
            if (this.player.stepLevelUp === 0) {
                this.listStatsProgression[i].draw(x + this.maxLength + this
                    .maxProgressionLength + ScreenResolution.getScreenMinXY(
                    Constants.HUGE_SPACE), yStat, 0, 0);
            }
        }
    }
}

export { StatisticProgression }