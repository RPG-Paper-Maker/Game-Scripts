/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all experience + currencies
*/
class GraphicRewardsTop
{
    constructor(xp, currencies)
    {
        this.xp = xp;
        this.currencies = currencies;
    }

    async load()
    {
        // Experience
        this.graphicXP = new GraphicText(RPM.datasGame.battleSystem
            .getExpStatistic().name + RPM.STRING_COLON + RPM.STRING_SPACE + this
            .xp);
        Platform.ctx.font = this.graphicXP.font;
        this.graphicXP.updateContextFont();
        this.graphicXPLength = Platform.ctx.measureText(this.graphicXP.text)
            .width;

        // Currencies
        this.graphicCurrencies = [];
        for (let id in this.currencies)
        {
            this.graphicCurrencies.push(await GraphicTextIcon.create(RPM
                .numToString(this.currencies[id]), RPM.datasGame.system
                .currencies[id].pictureID, Align.Left, Align.Left));
        }
    }

    static async create(xp, currencies)
    {
        let graphic = new GraphicRewardsTop(xp, currencies);
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

    // -------------------------------------------------------

    /** Drawing the progression
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        // Calculating offset for centering
        let offsetWidth = this.graphicXPLength + 10;
        let i, l;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++)
        {
            offsetWidth += this.graphicCurrencies[i].getWidth() + (i < l - 1 ? 
                10 : 0);
        }
        offsetWidth = ((w - offsetWidth) / 2);

        // Experience
        this.graphicXP.draw(x + offsetWidth, y, w, h);
        offsetWidth += this.graphicXPLength + 10;

        // Currencies
        let currency;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++)
        {
            currency = this.graphicCurrencies[i];
            currency.draw(x + offsetWidth, y, w, h);
            offsetWidth += currency.getWidth() + 10;
        }
    }
}