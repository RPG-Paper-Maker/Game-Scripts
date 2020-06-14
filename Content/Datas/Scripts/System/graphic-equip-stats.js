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
//  CLASS GraphicEquipStats
//
// -------------------------------------------------------

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
function GraphicEquipStats(gamePlayer, newValues){
    var character, statistic;
    var graphicName, graphicValue;
    var i, j, l, id, c, maxLength, maxLengthValue, txt;

    character = gamePlayer.getCharacterInformations();
    this.isChanging = newValues.length !== 0;

    // All the graphics
    this.listStatsNames = new Array;
    this.listStats = new Array;
    this.listNewStats = new Array;
    j = 0;
    l = RPM.datasGame.battleSystem.statisticsOrder.length;
    maxLength = 0;
    maxLengthValue = 0;
    for (i = 0; i < l; i++){
        id = RPM.datasGame.battleSystem.statisticsOrder[i];
        if (id !== RPM.datasGame.battleSystem.idLevelStatistic &&
            id !== RPM.datasGame.battleSystem.idExpStatistic)
        {
            statistic = RPM.datasGame.battleSystem.statistics[id];
            if (statistic.isRes) {
                continue;
            }

            // Name of the stat
            graphicName = new GraphicText(statistic.name + ":");
            Platform.ctx.font = graphicName.font;
            graphicName.updateContextFont();
            c = Platform.ctx.measureText(graphicName.text).width;
            if (c > maxLength)
                maxLength = c;
            this.listStatsNames.push(graphicName);

            // Value of the stat
            txt = "" + gamePlayer[statistic.abbreviation];
            if (!statistic.isFix) {
               txt += "/" + gamePlayer[statistic.getMaxAbbreviation()];
            }
            graphicValue = new GraphicText(txt);
            Platform.ctx.font = graphicValue.font;
            graphicValue.updateContextFont();
            c = Platform.ctx.measureText(graphicValue.text).width;
            if (c > maxLengthValue)
                maxLengthValue = c;
            this.listStats.push(graphicValue);

            if (this.isChanging) {
                txt = newValues[id];
                if (statistic.isFix) {
                    txt = "" + newValues[id];
                } else {
                    txt = Math.min(gamePlayer[statistic.abbreviation], newValues
                        [id]) + "/" + newValues[id];
                }
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
    this.arrowLength = Platform.ctx.measureText(this.graphicArrow.text).width;
}

GraphicEquipStats.prototype = {

    /** Drawing the statistics modifications.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h){
        var xStats, yStats, yStat, xStat;
        var i, l;

        xStats = x + 10;
        yStats = y + 20;
        l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            yStat = yStats + (i*20);
            this.listStatsNames[i].draw(xStats, yStat, 0, 0);
            xStat = xStats + this.nameLength + 10;
            this.listStats[i].draw(xStat, yStat, 0, 0);

            if (this.isChanging){
                xStat += this.valueLength + 10;
                this.graphicArrow.draw(xStat, yStat, 0, 0);
                xStat += this.arrowLength + 20;
                this.listNewStats[i].draw(xStat, yStat, 0, 0);
            }
        }
    }
}
