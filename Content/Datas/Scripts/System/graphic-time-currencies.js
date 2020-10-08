/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all currencies and play time in scene menu.
*/
class GraphicTimeCurrencies
{
    constructor()
    {

    }

    async load()
    {
        // Currencies
        this.currencies = [];
        let graphic;
        for (let id in RPM.game.currencies)
        {
            graphic = await GraphicTextIcon.create(RPM.numToString(RPM.game
                .currencies[id]), RPM.datasGame.system.currencies[id].pictureID,
                {
                    side: Align.Right,
                    align: Align.Right
                }
            );
            this.currencies.push(graphic);
        }

        // Time
        this.time = RPM.game.playTime.getSeconds();
        this.graphicPlayTime = new GraphicText(RPM.getStringDate(this.time), { 
            align : Align.Right });

        // Calculate height
        var currency;
        this.height = 0;
        for (let i = 0, l = this.currencies.length; i < l; i++)
        {
            currency = this.currencies[i];
            this.height = i * (Math.max(currency.graphicText.fontSize, currency
                .graphicIcon.h) + 5);
        }
        this.height += 20 + this.graphicPlayTime.fontSize;
    }

    static async create()
    {
        let graphic = new GraphicTimeCurrencies();
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

    // -------------------------------------------------------

    update()
    {
        if (RPM.game.playTime.getSeconds() !== this.time)
        {
            this.graphicPlayTime.setText(RPM.getStringDate(RPM.game.playTime
                .getSeconds()));
        }
    }

    /** Drawing the content
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        let previousCurrency = null;
        let currency;
        for (let i = 0, l = this.currencies.length; i < l; i++)
        {
            currency = this.currencies[i];
            this.offset = i * (previousCurrency ? previousCurrency
                .getMaxHeight() + 5 : 0);
            currency.draw(x, y + this.offset, w, 0);
            previousCurrency = currency;
        }
        this.offset += currency.getMaxHeight() + 20;
        this.graphicPlayTime.draw(x, y + this.offset, w, 0);
        this.offset += this.graphicPlayTime.fontSize;
    }
}