/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying the player minimal stats informations
*   @property {GamePlayer} gamePlayer The current selected player
*   @property {boolean} reverse Indicate if the faceset should be reversed
*   @property {GraphicText} graphicName The player's name graphic
*   @property {GraphicText} graphicClass The player's class name graphic
*   @property {GraphicText} graphicLevelName The player's level name graphic
*   @property {GraphicText} graphicLevel The player's level graphic
*   @property {GraphicText} graphicExpName The graphic text for experience name
*   @property {GraphicText} graphicExp The graphic text for experience stat
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics
*   @property {GraphicText} listStats All the player's stats values
*   graphics
*   @property {number} maxStatNamesLength The max length of the stats namles 
*   for each column
*   @property {number} maxStatLength The max length of the stats for each column
*   @property {Picture2D} faceset The player faceset
*   @property {Picture2D} battler The player battler
*   @property {Frame} battlerFrame The battler frame
*   @property {GraphicText} graphicLevelUp The graphic text for level up
*   @property {boolean} displayNameLevel Indicate if leveling up should be 
*   displayed
*   @param {GamePlayer} gamePlayer The current selected player
*   @param {boolean} [reverse=false] Indicate if the faceset should be reversed
*/
class GraphicPlayer
{
    constructor(gamePlayer, reverse = false)
    {
        this.gamePlayer = gamePlayer;
        this.reverse = reverse;

        // Informations
        let character = this.gamePlayer.getCharacterInformations();
        let cl = RPM.datasGame.classes.list[character.idClass];
        let levelStat = RPM.datasGame.battleSystem.getLevelStatistic();
        let expStat = RPM.datasGame.battleSystem.getExpStatistic();

        // All the graphics
        this.graphicName = new GraphicText(character.name);
        this.graphicClass = new GraphicText(cl.name(), { fontSize: 10 });
        this.graphicLevelName = new GraphicText(levelStat.name);
        this.graphicLevel = new GraphicText(RPM.numToString(this.gamePlayer[
            levelStat.abbreviation]));
        if (expStat === null)
        {
            this.graphicExpName = null;
        } else
        {
            this.graphicExpName = new GraphicText(expStat.name, { fontSize: RPM
                .MEDIUM_FONT_SIZE });
            this.graphicExp = new GraphicText(this.gamePlayer.getBarAbbreviation
                (expStat), { fontSize: RPM.MEDIUM_FONT_SIZE });
        }

        // Adding stats
        this.listStatsNames = [];
        this.listStats = [];
        this.maxStatNamesLength = 0;
        this.maxStatLength = 0;
        let id, statistic, textName, c, txt, text;
        for (let i = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length; i
            < l; i++)
        {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !== RPM
                .datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];

                // Only display bars
                if (!statistic.isFix)
                {
                    textName = new GraphicText(statistic.name + RPM.STRING_COLON);
                    Platform.ctx.font = textName.font;
                    textName.updateContextFont(Platform.ctx);
                    c = Platform.ctx.measureText(textName.text).width;
                    if (c > this.maxStatNamesLength)
                    {
                        this.maxStatNamesLength = c;
                    }
                    this.listStatsNames.push(textName);
                    txt = RPM.numToString(this.gamePlayer[statistic.abbreviation]);
                    if (!statistic.isFix)
                    {
                        txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                            .getMaxAbbreviation()];
                    }
                    text = new GraphicText(txt);
                    c = Platform.ctx.measureText(text.text).width;
                    if (c > this.maxStatNamesLength)
                    {
                        this.maxStatLength = c;
                    }
                    this.listStats.push(text);
                }
            }
        }

        // Faceset
        this.faceset = RPM.datasGame.pictures.getPictureCopy(PictureKind
            .Facesets, character.idFaceset);
        if (this.reverse)
        {
            this.faceset.setLeft();
        } else
        {
            this.faceset.setRight();
        }
        this.faceset.setBot(RPM.datasGame.system.getWindowSkin().borderBotRight[
            3]);
        this.faceset.reverse = this.reverse;

        // Battler
        this.battler = RPM.datasGame.pictures.getPictureCopy(PictureKind
            .Battlers, character.idBattler);
        this.battlerFrame = new Frame(250);

        // Level up
        this.graphicLevelUp = new GraphicText("Level up!");

        this.displayNameLevel = true;
    }

    // -------------------------------------------------------
    /** Update the reverse value for faceset
    *   @param {boolean} reverse The reverse value
    */
    updateReverse(reverse)
    {
        if (reverse)
        {
            this.faceset.setLeft();
        } else
        {
            this.faceset.setRight();
        }
        this.faceset.reverse = reverse;
        this.reverse = reverse;
    }

    // -------------------------------------------------------
    /** Update the graphics
    */
    update()
    {
        // Informations
        let character = this.gamePlayer.getCharacterInformations();
        let cl = RPM.datasGame.classes.list[character.idClass];
        let levelStat = RPM.datasGame.battleSystem.getLevelStatistic();

        // All the graphics
        this.graphicName.setText(character.name);
        this.graphicClass.setText(cl.name);
        this.graphicLevelName.setText(levelStat.name);
        this.graphicLevel.setText(RPM.numToString(this.gamePlayer[levelStat
            .abbreviation]));

        // Adding stats
        let id, statistic, txt;
        for (let i = 0, j = 0, l = RPM.datasGame.battleSystem.statisticsOrder
            .length; i < l; i++)
        {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic && id !==
                RPM.datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];

                // Only display bars
                if (!statistic.isFix)
                {
                    txt = RPM.numToString(this.gamePlayer[statistic.abbreviation]);
                    if (!statistic.isFix)
                    {
                        txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                            .getMaxAbbreviation()];
                    }
                    this.listStats[j++].setText(txt);
                }
            }
        }
    }

    // -------------------------------------------------------
    /** Update experience graphics
    */
    updateExperience()
    {
        this.graphicLevel.setText(RPM.numToString(this.gamePlayer[RPM.datasGame
            .battleSystem.getLevelStatistic().abbreviation]));
        this.graphicExp.setText(RPM.numToString(this.gamePlayer
            .getBarAbbreviation(RPM.datasGame.battleSystem.getExpStatistic())));
    }

    // -------------------------------------------------------
    /** Initialize character graphics font size
    *   @param {boolean} noDisplayNameLevel Indicate if the level up should be 
    *   displayed or not
    */
    initializeCharacter(noDisplayNameLevel)
    {
        if (noDisplayNameLevel)
        {
            this.displayNameLevel = false;
        }
        this.graphicName.setFontSize(RPM.MEDIUM_FONT_SIZE);
        this.graphicLevelName.setFontSize(RPM.MEDIUM_FONT_SIZE);
        this.graphicLevel.setFontSize(RPM.MEDIUM_FONT_SIZE);
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            this.listStatsNames[i].setFontSize(RPM.SMALL_FONT_SIZE);
            this.listStats[i].setFontSize(RPM.SMALL_FONT_SIZE);
        }
    }

    // -------------------------------------------------------
    /** Update battler frame
    */
    updateBattler()
    {
        if (this.battlerFrame.update()) 
        {
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Drawing the character
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawCharacter(x, y, w, h)
    {
        // Measure widths
        Platform.ctx.font = this.graphicName.font;
        let wName = Platform.ctx.measureText(this.graphicName.text).width;
        let wLevelName = Platform.ctx.measureText(this.graphicLevelName.text)
            .width;
        let xLevelName = x + wName + 10;
        let xLevel = xLevelName + wLevelName;

        // Battler
        let yName = y + 100;
        let coef = RPM.BASIC_SQUARE_SIZE / RPM.SQUARE_SIZE;
        let wBattler = this.battler.oW / RPM.FRAMES;
        let hBattler = this.battler.oH / RPM.BATLLER_STEPS;
        this.battler.draw(x, yName - (hBattler * coef) - 15, wBattler * coef,
            hBattler * coef, this.battlerFrame * wBattler, 0, wBattler, hBattler);

        // Stats
        let yStats = yName;
        if (this.displayNameLevel)
        {
            this.graphicName.draw(x, yName, 0, 0);
            this.graphicName.updateContextFont();
            this.graphicLevelName.draw(xLevelName, yName, 0, 0);
            this.graphicLevelName.updateContextFont();
            this.graphicLevel.draw(xLevel, yName, 0, 0);
            this.graphicLevel.updateContextFont();
            yStats += 15;
        }
        let yStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            yStat = yStats + (i * 12);
            this.listStatsNames[i].draw(x, yStat, 0, 0);
            this.listStats[i].draw(x + this.maxStatNamesLength + 10, yStat, 0, 
                0);
        }
    }

    // -------------------------------------------------------
    /** Drawing the player in choice box in the main menu
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h)
    {
        let xCharacter = x + 80;
        let yName = y + 20;
        let coef = RPM.BASIC_SQUARE_SIZE / RPM.SQUARE_SIZE;
        let wBattler = this.battler.oW / RPM.FRAMES;
        let hBattler = this.battler.oH / RPM.BATLLER_STEPS;

        // Battler
        this.battler.draw(x + (80 - (wBattler * coef)) / 2, y + h - (hBattler *
            coef) - 15, wBattler * coef, hBattler * coef, this.battlerFrame *
            wBattler, 0, wBattler, hBattler);

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
        if (this.gamePlayer.levelingUp)
        {
            this.graphicLevelUp.draw(xLevel + Platform.ctx.measureText(this
                .graphicLevel.text).width + 10, yName, 0, 0);
        }

        let yClass = yName + 15;
        this.graphicClass.draw(xCharacter, yClass, 0, 0);
        let yExp = yClass + 29;
        if (this.graphicExpName !== null)
        {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + Platform.ctx.measureText(this
                .graphicExpName.text).width + 10, yExp, 0, 0);
        }
    }

    // -------------------------------------------------------
    /** Drawing the player informations in battles
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
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
        let xStat, yStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
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