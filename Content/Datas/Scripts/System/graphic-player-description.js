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
*   @property {GraphicText} graphicNameCenter The player's name graphic (for
*   menu choices)
*   @property {GraphicText} graphicName The player's name graphic (for
*   menu description)
*   @property {GraphicText} graphicClass The player's class name graphic
*   @property {GraphicText} graphicLevelName The player's level name graphic
*   @property {GraphicText} graphicLevel The player's level graphic
*   @property {GraphicText} graphicExpName The graphic text for experience name
*   @property {GraphicText} graphicExp The graphic text for experience stat
*   @property {GraphicText} listStatsNames All the player's stats names
*   graphics
*   @property {GraphicText} listStats All the player's stats values
*   graphics
*   @property {number} listLength The max length of the stats for each column
*   @property {Picture2D} battler The player battler
*   @property {Frame} battlerFrame The battler frame
*   @param {GamePlayer} gamePlayer The current selected player
*/
class GraphicPlayerDescription
{
    constructor(gamePlayer)
    {
        this.gamePlayer = gamePlayer;

        // Informations
        let character = this.gamePlayer.getCharacterInformations();
        let cl = RPM.datasGame.classes.list[character.idClass];
        let levelStat = RPM.datasGame.battleSystem.getLevelStatistic();
        let expStat = RPM.datasGame.battleSystem.getExpStatistic();

        // All the graphics
        this.graphicNameCenter = new GraphicText(character.name, { align: Align
            .Center });
        this.graphicName = new GraphicText(character.name);
        this.graphicClass = new GraphicText(cl.name(), { fontSize: RPM
            .MEDIUM_FONT_SIZE });
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
            this.graphicExp = new GraphicText(RPM.numToString(this.gamePlayer
                .getBarAbbreviation(expStat)), { fontSize: RPM.MEDIUM_FONT_SIZE });
        }

        // Adding stats
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.listLength = new Array;
        let maxLength = 0;
        let id, statistic, graphicName, txt;
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
                graphicName = new GraphicText(statistic.name + RPM.STRING_COLON);
                Platform.ctx.font = graphicName.font;
                graphicName.updateContextFont();
                maxLength = Math.max(Platform.ctx.measureText(graphicName.text)
                    .width, maxLength)
                if (j % 7 === 6)
                {
                    this.listLength.push(maxLength);
                    maxLength = 0;
                }
                this.listStatsNames.push(graphicName);
                txt = RPM.numToString(this.gamePlayer[statistic.abbreviation]);
                if (!statistic.isFix)
                {
                    txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                        .getMaxAbbreviation()];
                }
                this.listStats.push(new GraphicText(txt));
                j++;
            }
        }
        this.listLength.push(maxLength);

        // Battler
        this.battler = RPM.datasGame.pictures.getPictureCopy(PictureKind
            .Battlers, character.idBattler);
        this.battlerFrame = new Frame(250);
    }

    // -------------------------------------------------------
    /** Initialize the statistic progression
    */
    initializeStatisticProgression()
    {
        this.listStatsProgression = new Array;
        let id, statistic, value, graphic;
        for (let i = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length; i
            < l; i++)
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
                if (value > 0)
                {
                    txt = "+";
                } else if (value < 0) {
                    txt = "-";
                } else {
                    txt = "";
                }
                value = this.gamePlayer[statistic.abbreviation] - this
                    .gamePlayer[statistic.getBeforeAbbreviation()];
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
    }

    // -------------------------------------------------------
    /** Update the statistic progression
    */
    updateStatisticProgression()
    {
        this.listStatsNames = new Array;
        this.listStats = new Array;
        this.maxLength = 0;
        let id, statistic, graphicName, txt;
        for (let i = 0, l = RPM.datasGame.battleSystem.statisticsOrder.length; i
            < l; i++)
        {
            id = RPM.datasGame.battleSystem.statisticsOrder[i];
            if (id !== RPM.datasGame.battleSystem.idLevelStatistic &&
                id !== RPM.datasGame.battleSystem.idExpStatistic)
            {
                statistic = RPM.datasGame.battleSystem.statistics[id];
                graphicName = new GraphicText(statistic.name + RPM.STRING_COLON);
                Platform.ctx.font = graphicName.font;
                graphicName.updateContextFont();
                this.maxLength = Math.max(Platform.ctx.measureText(graphicName
                    .text).width, this.maxLength);
                this.listStatsNames.push(graphicName);
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
                txt += this.gamePlayer[statistic.abbreviation];
                if (!statistic.isFix)
                {
                    txt += RPM.STRING_SLASH + this.gamePlayer[statistic
                        .getMaxAbbreviation()];
                }
                this.listStats.push(new GraphicText(txt));
            }
        }
    }

    // -------------------------------------------------------
    /** Update the battler frame
    */
    updateBattler()
    {
        if (this.battlerFrame.update())
        {
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Drawing the statistic progression
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawStatisticProgression(x, y, w, h)
    {
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            this.listStatsNames[i].draw(x, y * 30, 0, 0);
            this.listStats[i].draw(x + this.maxLength + 10 , i * 30, 0, 0);
        }
    }

    // -------------------------------------------------------
    /** Drawing the player in choice box
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h)
    {
        this.graphicNameCenter.draw(x, y, w, h);
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
        let xCharacter = x + 80;
        let yName = y + 20;
        let coef = RPM.BASIC_SQUARE_SIZE / RPM.SQUARE_SIZE;
        let wBattler = this.battler.oW / RPM.FRAMES;
        let hBattler = this.battler.oH / RPM.BATLLER_STEPS;

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
        if (this.graphicExpName !== null)
        {
            this.graphicExpName.draw(xCharacter, yExp, 0, 0);
            this.graphicExp.draw(xCharacter + Platform.ctx.measureText(this
                .graphicExpName.text).width + 10, yExp, 0, 0);
        }
        let yStats = yExp + 30;

        // Stats
        let xStat, yStat;
        for (let i = 0, l = this.listStatsNames.length; i < l; i++)
        {
            xStat = x + (Math.floor(i/7)*190);
            yStat = yStats + ((i%7)*30);
            this.listStatsNames[i].draw(xStat, yStat, 0, 0);
            this.listStats[i].draw(xStat + this.listLength[Math.floor(i/7)] + 10
                , yStat, 0, 0);
        }
    }
}