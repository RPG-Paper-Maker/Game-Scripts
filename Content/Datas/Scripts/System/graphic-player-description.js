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
//  CLASS GraphicPlayerDescription
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
function GraphicPlayerDescription(gamePlayer) {
    var character, cl, levelStat, expStat;
    var i, j, l, c, maxLength, txt;
    var statistic, graphicName;

    // Informations
    this.gamePlayer = gamePlayer;
    character = gamePlayer.getCharacterInformations();
    cl = $datasGame.classes.list[character.idClass];
    levelStat = $datasGame.battleSystem.getLevelStatistic();
    expStat = $datasGame.battleSystem.getExpStatistic();

    // All the graphics
    this.graphicNameCenter = new GraphicText(character.name, { align: Align
        .Center });
    this.graphicName = new GraphicText(character.name);
    this.graphicClass = new GraphicText(cl.name, { fontSize: RPM
        .MEDIUM_FONT_SIZE });
    this.graphicLevelName = new GraphicText(levelStat.name);
    this.graphicLevel = new GraphicText("" + gamePlayer[levelStat.abbreviation]);
    this.graphicExpName = new GraphicText(expStat.name, { fontSize: RPM
        .MEDIUM_FONT_SIZE });
    this.graphicExp = new GraphicText("" + gamePlayer.getBarAbbreviation(expStat
        ), { fontSize: RPM.MEDIUM_FONT_SIZE });

    // Adding stats
    this.listStatsNames = new Array;
    this.listStats = new Array;
    this.listLength = new Array;
    j = 0;
    l = $datasGame.battleSystem.statisticsOrder.length;
    maxLength = 0;

    for (i = 0; i < l; i++){
        var id = $datasGame.battleSystem.statisticsOrder[i];
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
            if (c > maxLength) maxLength = c;
            if (j%7 === 6){
                this.listLength.push(maxLength);
                maxLength = 0;
            }
            this.listStatsNames.push(graphicName);
            txt = "" + gamePlayer[statistic.abbreviation];
            if (!statistic.isFix)
                txt += "/" + gamePlayer[statistic.getMaxAbbreviation()];
            this.listStats.push(new GraphicText(txt));
            j++;
        }
    }
    this.listLength.push(maxLength);

    // Battler
    this.battler = Picture2D.createImage($datasGame.pictures.get(PictureKind
        .Battlers, character.idBattler), PictureKind.Battlers);
    this.battlerFrame = 0;
    this.battlerFrameTick = 0;
    this.battlerFrameDuration = 250;
}

GraphicPlayerDescription.prototype = {

    initializeStatisticProgression: function() {
        var i, l, id, statistic, value, txt, graphic;

        this.listStatsProgression = new Array;
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
                if (value > 0) {
                    txt = "+";
                } else if (value < 0) {
                    txt = "-";
                } else {
                    txt = "";
                }
                value = this.gamePlayer[statistic.abbreviation] - this
                    .gamePlayer[statistic.getBeforeAbbreviation()];
                graphic = new GraphicText(txt + value);
                if (value > 0) {
                    graphic.color = RPM.COLOR_GREEN;
                } else if (value < 0) {
                    graphic.color = RPM.COLOR_RED;
                }
                this.listStatsProgression.push(graphic);
            }
        }
    },

    // -------------------------------------------------------

    updateStatisticProgression: function() {
        var i, l, c, id, statistic, txt, graphicName;

        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        for (i = 0, l = $datasGame.battleSystem.statisticsOrder.length; i < l;
             i++)
        {
            id = $datasGame.battleSystem.statisticsOrder[i];
            if (id !== $datasGame.battleSystem.idLevelStatistic &&
                id !== $datasGame.battleSystem.idExpStatistic)
            {
                statistic = $datasGame.battleSystem.statistics[id];
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
                this.listStats.push(new GraphicText(txt));
            }
        }
    },

    // -------------------------------------------------------

    updateBattler: function() {
        var frame = this.battlerFrame;
        this.battlerFrameTick += $elapsedTime;
        if (this.battlerFrameTick >= this.battlerFrameDuration) {
            this.battlerFrame = (this.battlerFrame + 1) % $FRAMES;
            this.battlerFrameTick = 0;
        }
        if (frame !== this.battlerFrame) {
            $requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    drawStatisticProgression: function(x, y, w, h) {
        var i, l;

        for (i = 0, l = this.listStatsNames.length; i < l; i++) {
            this.listStatsNames[i].draw(x, y * 30, 0, 0);
            this.listStats[i].draw(x + this.maxLength + 10 , i * 30, 0, 0);
        }
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

    /** Drawing the player description.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h){
        var xCharacter, yName, xLevelName, xLevel, yClass, xExp, yExp, yStats,
            xStat, yStat, coef, wBattler, hBattler;
        var i, l;
        xCharacter = x + 80;
        yName = y + 20;
        coef = RPM.BASIC_SQUARE_SIZE / $SQUARE_SIZE;
        wBattler = this.battler.oW / $FRAMES;
        hBattler = this.battler.oH / RPM.BATLLER_STEPS;

        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + 80 - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame *
            wBattler, 0, wBattler, hBattler);

        // Name, level, exp
        yName = y + 10;
        this.graphicName.draw(xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont();
        xLevelName = xCharacter + $context.measureText(this.graphicName.text)
            .width + 10;
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        xLevel = xLevelName + $context.measureText(this.graphicLevelName.text)
            .width;
        this.graphicLevel.draw(xLevel, yName, 0, 0);
        yClass = yName + 20;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        yExp = yClass + 20;
        this.graphicExpName.draw(xCharacter, yExp, 0, 0);
        xExp = xCharacter + $context.measureText(this.graphicExpName.text).width
            + 10;
        this.graphicExp.draw(xExp, yExp, 0, 0);
        yStats = yExp + 30;

        // Stats
        l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            xStat = x + (Math.floor(i/7)*190);
            yStat = yStats + ((i%7)*30);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.listLength[Math.floor(i/7)] + 10
                , yStat, 0, 0);
        }
    }
}
