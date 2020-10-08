/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all the stats modifications in the equip menu.
*   @property {boolean} isChanging Indicates if we are currently trying to
*   equip something.
*   @property {GraphicText} listStatsNames All the stats names graphics.
*   @property {GraphicText} listStats All the stats values graphics.
*   @property {GraphicText} graphicArrow A graphic for an arrow.
*   @property {GraphicText} listNewStats All the stats new values graphics.
*   @property {number} nameLength The max length of the stats names.
*   @property {number} valueLength The max length of the stats values.
*   @property {number} arrowLength The max length of the stats values.
*   @param {GamePlayer} gamePlayer The current selected player.
*   @param {number[]} newValues The new values of statistics with the
*   equipment we are currently trying to equip. This array is empty if we are
*   not trying to equip something.
*/
class GraphicEquipStats
{
    constructor(gamePlayer, newValues)
    {
        this.isChanging = newValues.length !== 0;

        // All the graphics
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.listNewStats = new Array;
        let maxLength = 0;
        let maxLengthValue = 0;
        let id, statistic, graphicName, txt, graphicValue;
        for (let i = 0, j = 0, l = RPM.datasGame.battleSystem.statisticsOrder
            .length; i < l; i++)
        {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !== RPM
                .datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];
                if (statistic.isRes)
                {
                    continue;
                }
                // Name of the stat
                graphicName = new GraphicText(statistic.name + RPM.STRING_COLON);
                Platform.ctx.font = graphicName.font;
                graphicName.updateContextFont();
                maxLength = Math.max(Platform.ctx.measureText(graphicName.text)
                    .width, maxLength);
                this.listStatsNames.push(graphicName);

                // Value of the stat
                txt = RPM.numToString(gamePlayer[statistic.abbreviation]);
                if (!statistic.isFix)
                {
                    txt += RPM.STRING_SLASH + gamePlayer[statistic
                        .getMaxAbbreviation()];
                }
                graphicValue = new GraphicText(txt);
                Platform.ctx.font = graphicValue.font;
                graphicValue.updateContextFont();
                maxLengthValue = Math.max(Platform.ctx.measureText(graphicValue
                    .text).width, maxLengthValue);
                this.listStats.push(graphicValue);
                if (this.isChanging)
                {
                    txt = statistic.isFix ? RPM.numToString(newValues[id]) : 
                        Math.min(gamePlayer[statistic.abbreviation], newValues[
                        id]) + RPM.STRING_SLASH + newValues[id];
                    this.listNewStats.push(new GraphicText(txt));
                }
                j++;
            }
        }

        // Lengths
        this.nameLength = maxLength;
        this.valueLength = maxLengthValue;

        // Arrow
        this.graphicArrow = new GraphicText("->");
        Platform.ctx.font = this.graphicArrow.font;
        this.graphicArrow.updateContextFont();
        this.arrowLength = Platform.ctx.measureText(this.graphicArrow.text)
            .width;
    }

    /** Drawing the statistics modifications.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawBox(x, y, w, h)
    {
        let xStats = x + 10;
        let yStats = y + 20;
        let yStat, xStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            yStat = yStats + (i * 20);
            this.listStatsNames[i].draw(xStats, yStat, 0, 0);
            xStat = xStats + this.nameLength + 10;
            this.listStats[i].draw(xStat, yStat, 0, 0);
            if (this.isChanging)
            {
                xStat += this.valueLength + 10;
                this.graphicArrow.draw(xStat, yStat, 0, 0);
                xStat += this.arrowLength + 20;
                this.listNewStats[i].draw(xStat, yStat, 0, 0);
            }
        }
    }
}