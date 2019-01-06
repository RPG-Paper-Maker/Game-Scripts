/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GraphicPlayer
//
// -------------------------------------------------------

/** @class
*   The graphic displaying the player minimal stats informations.
*   @property {GraphicText} graphicName The player's name graphic.
*   @property {GraphicText} graphicClass The player's class name graphic.
*   @property {GraphicText} graphicLevelName The player's level name graphic.
*   @property {GraphicText} graphicLevel The player's level graphic.
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics.
*   @property {GraphicText} listStats All the player's stats values
*   graphics.
*   @property {number} maxStatNamesLength The max length of the stats for each column.
*   @param {GamePlayer} gamePlayer The current selected player.
*/
function GraphicPlayer(gamePlayer, reverse) {
    var character, cl, levelStat, id, statistic, textName, text, c, txt;
    var context;

    this.gamePlayer = gamePlayer;
    this.reverse = reverse;

    // Informations
    character = gamePlayer.getCharacterInformations();
    cl = $datasGame.classes.list[character.idClass];
    levelStat = $datasGame.battleSystem.getLevelStatistic();

    // All the graphics
    this.graphicName = new GraphicText(character.name, Align.Left);
    this.graphicClass = new GraphicText(cl.name, Align.Left, 10);
    this.graphicLevelName = new GraphicText(levelStat.name, Align.Left);
    this.graphicLevel = new GraphicText("" + gamePlayer[levelStat.abbreviation],
                                        Align.Left);

    // Adding stats
    context = $canvasHUD.getContext('2d');
    this.listStatsNames = [];
    this.listStats = [];
    this.maxStatNamesLength = 0;
    this.maxStatLength = 0;
    var i, l = $datasGame.battleSystem.statisticsOrder.length;
    for (i = 0; i < l; i++){
        id = $datasGame.battleSystem.statisticsOrder[i];
        if (id !== $datasGame.battleSystem.idLevelStatistic && id !== $datasGame
            .battleSystem.idExpStatistic)
        {
            statistic = $datasGame.battleSystem.statistics[id];

            // Only display bars
            if (!statistic.isFix){
                textName = new GraphicText(statistic.name + ":", Align.Left);
                context.font = textName.font;
                textName.updateContextFont(context);
                c = context.measureText(textName.text).width;
                if (c > this.maxStatNamesLength) {
                    this.maxStatNamesLength = c;
                }
                this.listStatsNames.push(textName);
                txt = "" + gamePlayer[statistic.abbreviation];
                if (!statistic.isFix)
                    txt += "/" + gamePlayer["max" + statistic.abbreviation];
                text = new GraphicText(txt, Align.Left);
                c = context.measureText(text.text).width;
                if (c > this.maxStatNamesLength) {
                    this.maxStatLength = c;
                }
                this.listStats.push(text);
            }
        }
    }

    // Faceset
    this.faceset = Picture2D.createImage($datasGame.pictures.get(PictureKind
        .Facesets, character.idFaceset), PictureKind.Facesets, function() {
        if (reverse) {
            this.setLeft();
        } else {
            this.setRight();
        }
        this.setBot();
    });
    this.faceset.reverse = reverse;
}

GraphicPlayer.prototype = {

    update: function() {
        var character, cl, levelStat, id, statistic, txt;

        // Informations
        character = this.gamePlayer.getCharacterInformations();
        cl = $datasGame.classes.list[character.idClass];
        levelStat = $datasGame.battleSystem.getLevelStatistic();

        // All the graphics
        this.graphicName.text = character.name;
        this.graphicClass.text = cl.name;
        this.graphicLevelName.text = levelStat.name;
        this.graphicLevel.text = "" + this.gamePlayer[levelStat.abbreviation];

        // Adding stats
        var i, j = 0, l = $datasGame.battleSystem.statisticsOrder.length;
        for (i = 0; i < l; i++) {
            id = $datasGame.battleSystem.statisticsOrder[i];
            if (id !== $datasGame.battleSystem.idLevelStatistic && id !==
                $datasGame.battleSystem.idExpStatistic)
            {
                statistic = $datasGame.battleSystem.statistics[id];

                // Only display bars
                if (!statistic.isFix){
                    txt = "" + this.gamePlayer[statistic.abbreviation];
                    if (!statistic.isFix) {
                        txt += "/" + this.gamePlayer["max" + statistic
                            .abbreviation];
                    }
                    this.listStats[j++].text = txt;
                }
            }
        }
    },

    /** Drawing the player in choice box in the main menu.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(context, x, y, w, h){
        var xCharacter, yName, xLevelName, xLevel, yClass;

        xCharacter = x + 80;
        yName = y + 20;
        this.graphicName.draw(context, xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont(context);
        xLevelName = xCharacter +
                context.measureText(this.graphicName.text).width + 10;
        this.graphicLevelName.draw(context, xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont(context);
        xLevel = xLevelName +
                context.measureText(this.graphicLevelName.text).width;
        this.graphicLevel.draw(context, xLevel, yName, 0, 0);
        yClass = yName + 20;
        this.graphicClass.draw(context, xCharacter, yClass, 0, 0);
    },

    /** Drawing the player informations in battles.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(context, x, y, w, h){
        var yName, xLevelName, xLevel, yStats, xStat, yStat, wName, wLevelName,
            wLevel, wStats, wStat, firstLineLength, xOffset;

        // Measure widths
        wName = context.measureText(this.graphicName.text).width;
        wLevelName = context.measureText(this.graphicLevelName.text).width;
        wLevel = context.measureText(this.graphicLevelName.text).width;
        xLevelName = x + wName + 10;
        xLevel = xLevelName + wLevelName;
        firstLineLength = xLevel + context.measureText(this.graphicLevel.text)
            .width;
        xOffset = this.reverse ? w - Math.max(firstLineLength, this
            .maxStatNamesLength + 10 + this.maxStatLength) : 0;

        yName = y + 10;
        this.graphicName.draw(context, x + xOffset, yName, 0, 0);
        this.graphicName.updateContextFont(context);
        this.graphicLevelName.draw(context, xLevelName + xOffset, yName, 0, 0);
        this.graphicLevelName.updateContextFont(context);
        this.graphicLevel.draw(context, xLevel + xOffset, yName, 0, 0);
        yStats = yName + 20;

        // Stats
        var i, l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            xStat = x + xOffset;
            yStat = yStats + (i*20);
            this.listStatsNames[i].draw(context, xStat, yStat, 0, 0);
            this.listStats[i].draw(context, xStat + this.maxStatNamesLength +
                10, yStat, 0, 0);
        }

        // Faceset
        this.faceset.draw(context);
    }
}
