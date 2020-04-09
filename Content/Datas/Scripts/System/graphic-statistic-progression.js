/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS GraphicStatisticProgression
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the stats in the player description state menu.
*   @property {GraphicText} graphicNameCenter The player's name graphic (for
*   menu choices).
*   @property {GraphicText} graphicName The player's name graphic (for
*   menu description).
*   @property {GraphicText} graphicClass The player's class name graphic.
*   @property {GraphicText} graphicLevelName The player's level name graphic.
*   @property {GraphicText} graphicLevel The player's level graphic.
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics.
*   @property {GraphicText} listStats All the player's stats values
*   graphics.
*   @property {number} listLength The max length of the stats for each column.
*   @param {GamePlayer} gamePlayer The current selected player.
*/
function GraphicStatisticProgression(gamePlayer) {
    var i, l, id, statistic, value, txt, graphic;

    this.gamePlayer = gamePlayer;
    this.listStatsProgression = new Array;
    for (i = 0, l = $datasGame.battleSystem.statisticsOrder.length; i < l;
         i++)
    {
        id = $datasGame.battleSystem.statisticsOrder[i];
        if (id !== $datasGame.battleSystem.idLevelStatistic &&
            id !== $datasGame.battleSystem.idExpStatistic)
        {
            statistic = $datasGame.battleSystem.statistics[id];
            value = this.gamePlayer[statistic.getAbbreviationNext()] - this
                .gamePlayer[statistic.getBeforeAbbreviation()];
            txt = value >= 0 ? "+" : "-";
            graphic = new GraphicText(txt + value);
            if (value > 0) {
                graphic.color = RPM.COLOR_GREEN;
            } else if (value < 0) {
                graphic.color = RPM.COLOR_RED;
            }
            this.listStatsProgression.push(graphic);
        }
    }
    this.updateStatisticProgression();
}

GraphicStatisticProgression.prototype = {

    updateStatisticProgression: function() {
        var i, l, c, id, statistic, txt, graphicName, graphic;

        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        this.maxProgressionLength = 0;
        for (i = 0, l = $datasGame.battleSystem.statisticsOrder.length; i < l;
             i++)
        {
            id = $datasGame.battleSystem.statisticsOrder[i];
            if (id !== $datasGame.battleSystem.idLevelStatistic &&
                id !== $datasGame.battleSystem.idExpStatistic)
            {
                statistic = $datasGame.battleSystem.statistics[id];
                if (statistic.isRes) {
                    continue;
                }

                graphicName = new GraphicText(statistic.name + ":");
                $context.font = graphicName.font;
                graphicName.updateContextFont();
                c = $context.measureText(graphicName.text).width;
                if (c > this.maxLength) {
                    this.maxLength = c;
                }
                this.listStatsNames.push(graphicName);
                txt = "";
                if (this.gamePlayer.stepLevelUp === 0) {
                    txt += statistic.isFix ? this.gamePlayer[statistic
                        .getBeforeAbbreviation()] : this.gamePlayer[statistic
                        .abbreviation];
                    if (!statistic.isFix) {
                        txt += "/" + this.gamePlayer[statistic
                            .getBeforeAbbreviation()];
                    }
                    txt += " -> ";
                }
                txt += "" + this.gamePlayer[statistic.abbreviation];
                if (!statistic.isFix) {
                    txt += "/" + this.gamePlayer[statistic.getMaxAbbreviation()];
                }
                graphic = new GraphicText(txt);
                $context.font = graphic.font;
                graphic.updateContextFont();
                c = $context.measureText(graphic.text).width;
                if (c > this.maxProgressionLength) {
                    this.maxProgressionLength = c;
                }
                this.listStats.push(graphic);
            }
        }
    },

    // -------------------------------------------------------

    getHeight: function() {
        return this.listStatsNames.length * 20;
    },

    /** Drawing the player in choice box.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h){
        this.graphicNameCenter.draw(x, y, w, h);
    },

    // -------------------------------------------------------

    /** Drawing the player description.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h){
        var i, l, yStat;

        for (i = 0, l = this.listStatsNames.length; i < l; i++) {
            yStat = y + (i * 20);
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxLength + 10 , yStat, 0, 0);

            if (this.gamePlayer.stepLevelUp === 0) {
                this.listStatsProgression[i].draw(x + this.maxLength + this
                    .maxProgressionLength + 20, yStat, 0, 0);
            }
        }
    }
}
