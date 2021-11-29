/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Datas } from "../index";
import { Utils, Enum, Mathf, Constants, ScreenResolution } from "../Common";
import Align = Enum.Align;
import { Game } from "../Core";

/** @class
 *  The graphic displaying all currencies and play time in scene menu.
 *  @extends Graphic.Base
 */
class TimeCurrencies extends Base {

    public currencies: Graphic.TextIcon[];
    public time: number;
    public graphicPlayTime: Graphic.Text;
    public height: number;
    public offset: number;

    constructor() {
        super();

        // Currencies
        this.currencies = [];
        let graphic: Graphic.TextIcon;
        for (let id in Game.current.currencies) {
            graphic = Graphic.TextIcon.createFromSystem(Mathf.numberWithCommas(
                Game.current.currencies[id]), Datas.Systems.getCurrency(parseInt(id)), {
                    side: Align.Right,
                    align: Align.Right
                }
            );
            this.currencies.push(graphic);
        }

        // Time
        this.time = Game.current.playTime.getSeconds();
        this.graphicPlayTime = new Graphic.Text(Utils.getStringDate(this.time), { 
                align : Align.Right
            }
        );

        // Calculate height
        var currency: Graphic.TextIcon;
        this.height = 0;
        for (let i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            this.height = i * (Math.max(currency.graphicText.fontSize, 
                ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize) + 
                ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE)));
        }
        this.height += ScreenResolution.getScreenMinXY(Constants.HUGE_SPACE) + 
            this.graphicPlayTime.fontSize;
        this.offset = 0;
    }

    /** 
     *  Update the play time
     */
    update() {
        if (Game.current.playTime.getSeconds() !== this.time) {
            this.graphicPlayTime.setText(Utils.getStringDate(Game.current
                .playTime.getSeconds()));
        }
    }

    /** 
     *  Drawing the content choice.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the content.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
    */
    draw(x: number, y: number, w: number, h: number) {
        let previousCurrency = null;
        let currency: Graphic.TextIcon;
        for (let i = 0, l = this.currencies.length; i < l; i++) {
            currency = this.currencies[i];
            this.offset = i * (previousCurrency ? previousCurrency
                .getMaxHeight() + ScreenResolution.getScreenMinXY(Constants
                .MEDIUM_SPACE) : 0);
            currency.draw(x, y + this.offset, w, 0);
            previousCurrency = currency;
        }
        this.offset += currency.getMaxHeight() + ScreenResolution.getScreenMinXY(
            Constants.HUGE_SPACE);
        this.graphicPlayTime.draw(x, y + this.offset, w, 0);
        this.offset += this.graphicPlayTime.fontSize;
    }
}

export { TimeCurrencies }