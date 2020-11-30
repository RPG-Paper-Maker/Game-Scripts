/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all the stats in the player description state menu
*   @property {GamePlayer} gamePlayer The current selected player
*   @property {GraphicText} listStatsProgression All the graphic text for stats 
*   progression
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics
*   @property {GraphicText} listStats All the player's stats values graphics
*   @property {number} maxLength The max length of the stats for each column
*   @property {number} maxProgressionLength The max stat progression length for 
*   each column
*   @param {GamePlayer} gamePlayer The current selected player
*/
class GraphicStatisticProgression
{
    constructor(gamePlayer)
    {
        this.gamePlayer = gamePlayer;
        this.listStatsProgression = new Array;
        let id, statistic, value, txt, graphic;
        for (let i = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length; 
            i < l; i++)
        {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !== RPM
                .datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];
                value = this.gamePlayer[statistic.getAbbreviationNext()] - this
                    .gamePlayer[statistic.getBeforeAbbreviation()];
                txt = value >= 0 ? "+" : "-";
                graphic = new GraphicText(txt + value);
                if (value > 0)
                {
                    graphic.color = RPM.COLOR_GREEN;
                } else if (value < 0)
                {
                    graphic.color = RPM.COLOR_RED;
                }
                this.listStatsProgression.push(graphic);
            }
        }
        this.updateStatisticProgression();
    }

    // -------------------------------------------------------
    /** Update the statistic progression graphics
    */
    updateStatisticProgression()
    {
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        this.maxProgressionLength = 0;
        let id, statistic, graphic, txt;
        for (let i = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length; 
            i < l; i++)
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
                graphic = new GraphicText(statistic.name + RPM.STRING_COLON);
                Platform.ctx.font = graphic.font;
                graphic.updateContextFont();
                this.maxLength = Math.max(Platform.ctx.measureText(graphic.text)
                    .width, this.maxLength);
                this.listStatsNames.push(graphic);
                txt = RPM.STRING_EMPTY;
                if (this.gamePlayer.stepLevelUp === 0)
                {
                    txt += statistic.isFix ? this.gamePlayer[statistic
                        .getBeforeAbbreviation()] : this.gamePlayer[statistic
                        .abbreviation];
                    if (!statistic.isFix)
                    {
                        txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                            .getBeforeAbbreviation()];
                    }
                    txt += " -> ";
                }
                txt += RPM.numToString(this.gamePlayer[statistic.abbreviation]);
                if (!statistic.isFix)
                {
                    txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                        .getMaxAbbreviation()];
                }
                graphic = new GraphicText(txt);
                Platform.ctx.font = graphic.font;
                graphic.updateContextFont();
                this.maxProgressionLength = Math.max(Platform.ctx.measureText(
                    graphic.text).width, this.maxProgressionLength);
                this.listStats.push(graphic);
            }
        }
    }

    // -------------------------------------------------------
    /** Get the stat names list height
    *   @returns {number}
    */
    getHeight()
    {
        return this.listStatsNames.length * 20;
    }

    // -------------------------------------------------------
    /** Drawing the player description
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        let yStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            yStat = y + (i * 20);
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxLength + 10 , yStat, 0, 0);
            if (this.gamePlayer.stepLevelUp === 0)
            {
                this.listStatsProgression[i].draw(x + this.maxLength + this
                    .maxProgressionLength + 20, yStat, 0, 0);
            }
        }
    }
}