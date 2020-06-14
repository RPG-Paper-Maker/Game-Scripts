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
    var character, cl, levelStat, expStat, id, statistic, textName, text, c, txt;

    this.gamePlayer = gamePlayer;
    this.reverse = reverse;

    // Informations
    character = gamePlayer.getCharacterInformations();
    cl = RPM.datasGame.classes.list[character.idClass];
    levelStat = RPM.datasGame.battleSystem.getLevelStatistic();
    expStat = RPM.datasGame.battleSystem.getExpStatistic();

    // All the graphics
    this.graphicName = new GraphicText(character.name);
    this.graphicClass = new GraphicText(cl.name, { fontSize: 10 });
    this.graphicLevelName = new GraphicText(levelStat.name);
    this.graphicLevel = new GraphicText("" + gamePlayer[levelStat.abbreviation]);
    this.graphicExpName = new GraphicText(expStat.name, { fontSize: RPM
        .MEDIUM_FONT_SIZE });
    this.graphicExp = new GraphicText(gamePlayer.getBarAbbreviation(expStat),
        { fontSize: RPM.MEDIUM_FONT_SIZE });

    // Adding stats
    this.listStatsNames = [];
    this.listStats = [];
    this.maxStatNamesLength = 0;
    this.maxStatLength = 0;
    var i, l = RPM.datasGame.battleSystem.statisticsOrder.length;
    for (i = 0; i < l; i++) {
        id = RPM.datasGame.battleSystem.statisticsOrder[i];
        if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !== RPM.datasGame
            .battleSystem.idExpStatistic)
        {
            statistic = RPM.datasGame.battleSystem.statistics[id];

            // Only display bars
            if (!statistic.isFix) {
                textName = new GraphicText(statistic.name + ":");
                Platform.ctx.font = textName.font;
                textName.updateContextFont(Platform.ctx);
                c = Platform.ctx.measureText(textName.text).width;
                if (c > this.maxStatNamesLength) {
                    this.maxStatNamesLength = c;
                }
                this.listStatsNames.push(textName);
                txt = "" + gamePlayer[statistic.abbreviation];
                if (!statistic.isFix)
                    txt += "/" + gamePlayer[statistic.getMaxAbbreviation()];
                text = new GraphicText(txt);
                c = Platform.ctx.measureText(text.text).width;
                if (c > this.maxStatNamesLength) {
                    this.maxStatLength = c;
                }
                this.listStats.push(text);
            }
        }
    }

    // Faceset
    this.faceset = Picture2D.createImage(RPM.datasGame.pictures.get(PictureKind
        .Facesets, character.idFaceset), PictureKind.Facesets, function() {
        if (reverse) {
            this.setLeft();
        } else {
            this.setRight();
        }
        this.setBot(RPM.datasGame.system.getWindowSkin().borderBotRight[3]);
    });
    this.faceset.reverse = reverse;

    // Battler
    this.battler = Picture2D.createImage(RPM.datasGame.pictures.get(PictureKind
        .Battlers, character.idBattler), PictureKind.Battlers);
    this.battlerFrame = 0;
    this.battlerFrameTick = 0;
    this.battlerFrameDuration = 250;

    // Level up
    this.graphicLevelUp = new GraphicText("Level up!");

    this.displayNameLevel = true;
}

GraphicPlayer.prototype = {

    updateReverse: function(reverse) {
        if (reverse) {
            this.faceset.setLeft();
        } else {
            this.faceset.setRight();
        }
        this.faceset.reverse = reverse;
        this.reverse = reverse;
    },

    // -------------------------------------------------------

    update: function() {
        var character, cl, levelStat, id, statistic, txt;

        // Informations
        character = this.gamePlayer.getCharacterInformations();
        cl = RPM.datasGame.classes.list[character.idClass];
        levelStat = RPM.datasGame.battleSystem.getLevelStatistic();

        // All the graphics
        this.graphicName.setText(character.name);
        this.graphicClass.setText(cl.name);
        this.graphicLevelName.setText(levelStat.name);
        this.graphicLevel.setText("" + this.gamePlayer[levelStat.abbreviation]);

        // Adding stats
        var i, j = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length;
        for (i = 0; i < l; i++) {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !==
                RPM.datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];

                // Only display bars
                if (!statistic.isFix){
                    txt = "" + this.gamePlayer[statistic.abbreviation];
                    if (!statistic.isFix) {
                        txt += "/" + this.gamePlayer["max" + statistic
                            .abbreviation];
                    }
                    this.listStats[j++].setText(txt);
                }
            }
        }
    },

    // -------------------------------------------------------

    updateExperience: function() {
        this.graphicLevel.setText("" + this.gamePlayer[RPM.datasGame.battleSystem
            .getLevelStatistic().abbreviation]);
        this.graphicExp.setText("" + this.gamePlayer.getBarAbbreviation(RPM.datasGame
            .battleSystem.getExpStatistic()));
    },

    // -------------------------------------------------------

    initializeCharacter: function(noDisplayNameLevel) {
        if (noDisplayNameLevel) {
            this.displayNameLevel = false;
        }

        this.graphicName.updateFontSize(RPM.MEDIUM_FONT_SIZE);
        this.graphicLevelName.updateFontSize(RPM.MEDIUM_FONT_SIZE);
        this.graphicLevel.updateFontSize(RPM.MEDIUM_FONT_SIZE);
        var i, l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            this.listStatsNames[i].updateFontSize(RPM.SMALL_FONT_SIZE);
            this.listStats[i].updateFontSize(RPM.SMALL_FONT_SIZE);
        }
    },

    // -------------------------------------------------------

    updateBattler: function() {
        var frame = this.battlerFrame;
        this.battlerFrameTick += RPM.elapsedTime;
        if (this.battlerFrameTick >= this.battlerFrameDuration) {
            this.battlerFrame = (this.battlerFrame + 1) % RPM.FRAMES;
            this.battlerFrameTick = 0;
        }
        if (frame !== this.battlerFrame) {
            RPM.requestPaintHUD = true;
        }
    },

    // -------------------------------------------------------

    drawCharacter: function(x, y, w, h) {
        var yName, xLevelName, xLevel, yStats, xStat, yStat, wName, wLevelName,
            wLevel, wStats, wStat, firstLineLength, xOffset, fontSize, coef,
            wBattler, hBattler;

        // Measure widths
        Platform.ctx.font = this.graphicName.font;
        wName = Platform.ctx.measureText(this.graphicName.text).width;
        wLevelName = Platform.ctx.measureText(this.graphicLevelName.text).width;
        wLevel = Platform.ctx.measureText(this.graphicLevelName.text).width;
        xLevelName = x + wName + 10;
        xLevel = xLevelName + wLevelName;
        firstLineLength = xLevel + Platform.ctx.measureText(this.graphicLevel.text)
            .width;

        // Battler
        yName = y + 100;
        coef = RPM.BASIC_SQUARE_SIZE / RPM.SQUARE_SIZE;
        wBattler = this.battler.oW / RPM.FRAMES;
        hBattler = this.battler.oH / RPM.BATLLER_STEPS;
        this.battler.draw(x, yName - (hBattler * coef) - 15, wBattler * coef,
            hBattler * coef, this.battlerFrame * wBattler, 0, wBattler,
            hBattler);

        // Stats
        yStats = yName;
        if (this.displayNameLevel) {
            this.graphicName.draw(x, yName, 0, 0);
            this.graphicName.updateContextFont();
            this.graphicLevelName.draw(xLevelName, yName, 0, 0);
            this.graphicLevelName.updateContextFont();
            this.graphicLevel.draw(xLevel, yName, 0, 0);
            this.graphicLevel.updateContextFont();
            yStats += 15;
        }
        var i, l = this.listStatsNames.length;
        for (i = 0; i < l; i++) {
            xStat = x;
            yStat = yStats + (i * 12);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.maxStatNamesLength +
                10, yStat, 0, 0);
        }
    },

    // -------------------------------------------------------

    /** Drawing the player in choice box in the main menu.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        var xCharacter, yName, xLevelName, xLevel, yClass, coef, wBattler,
            hBattler, xExp, yExp, xLevelUp;
        xCharacter = x + 80;
        yName = y + 20;
        coef = RPM.BASIC_SQUARE_SIZE / RPM.SQUARE_SIZE;
        wBattler = this.battler.oW / RPM.FRAMES;
        hBattler = this.battler.oH / RPM.BATLLER_STEPS;

        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + h - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame *
            wBattler, 0, wBattler, hBattler);

        // Stats
        this.graphicName.draw(xCharacter, yName, 0, 0);
        this.graphicName.updateContextFont();
        xLevelName = xCharacter + Platform.ctx.measureText(this.graphicName.text)
            .width + 10;
        this.graphicLevelName.draw(xLevelName, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        xLevel = xLevelName + Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        this.graphicLevel.draw(xLevel, yName, 0, 0);

        // Level up
        if (this.gamePlayer.levelingUp) {
            xLevelUp = xLevel + Platform.ctx.measureText(this.graphicLevel.text)
                .width + 10;
            this.graphicLevelUp.draw(xLevelUp, yName, 0, 0);
        }

        yClass = yName + 15;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        yExp = yClass + 29;
        this.graphicExpName.draw(xCharacter, yExp, 0, 0);
        xExp = xCharacter + Platform.ctx.measureText(this.graphicExpName.text).width
            + 10;
        this.graphicExp.draw(xExp, yExp, 0, 0);
    },

    /** Drawing the player informations in battles.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        var yName, xLevelName, xLevel, yStats, xStat, yStat, wName, wLevelName,
            wLevel, wStats, wStat, firstLineLength, xOffset;

        // Measure widths
        this.graphicName.updateContextFontReal();
        this.graphicLevelName.updateContextFontReal();
        this.graphicLevel.updateContextFontReal();
        wName = Platform.ctx.measureText(this.graphicName.text).width;
        wLevelName = Platform.ctx.measureText(this.graphicLevelName.text).width;
        wLevel = Platform.ctx.measureText(this.graphicLevelName.text).width;
        xLevelName = x + wName + 10;
        xLevel = xLevelName + wLevelName;
        firstLineLength = xLevel + Platform.ctx.measureText(this.graphicLevel.text)
            .width;
        xOffset = this.reverse ? w - Math.max(firstLineLength, this
            .maxStatNamesLength + 10 + this.maxStatLength) : 0;

        yName = y + 10;
        this.graphicName.draw(x + xOffset, yName, 0, 0);
        this.graphicName.updateContextFont();
        this.graphicLevelName.draw(xLevelName + xOffset, yName, 0, 0);
        this.graphicLevelName.updateContextFont();
        this.graphicLevel.draw(xLevel + xOffset, yName, 0, 0);
        yStats = yName + 20;

        // Stats
        var i, l = this.listStatsNames.length;
        for (i = 0; i < l; i++){
            xStat = x + xOffset;
            yStat = yStats + (i*20);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.maxStatNamesLength +
                10, yStat, 0, 0);
        }

        // Faceset
        this.faceset.draw();
    }
}
