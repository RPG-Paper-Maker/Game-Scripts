/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Graphic, Datas } from "..";
import { Constants, Platform, Utils, Enum } from "../Common";
import Align = Enum.Align;

/** @class
 *  The graphic displaying all experience + currencies
 */
class RewardsTop extends Base {
    
    public graphicXP: Graphic.Text;
    public graphicXPLength: number;
    public graphicCurrencies: Graphic.TextIcon[];

    constructor(xp: number, currencies: Record<string, number>) {
        super();

        // Experience
        this.graphicXP = new Graphic.Text(Datas.BattleSystems.getExpStatistic()
            .name + Constants.STRING_COLON + Constants.STRING_SPACE + xp);
        Platform.ctx.font = this.graphicXP.font;
        this.graphicXP.updateContextFont();
        this.graphicXPLength = Platform.ctx.measureText(this.graphicXP.text).width;

        // Currencies
        this.graphicCurrencies = [];
        for (let id in currencies) {
            this.graphicCurrencies.push(new Graphic.TextIcon(Utils.numToString(
                currencies[id]), Datas.Systems.getCurrency(parseInt(id))
                .pictureID, { align: Align.Left }));
        }
    }

    /** 
     *  Drawing the progression.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the progression.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        // Calculating offset for centering
        let offsetWidth = this.graphicXPLength + 10;
        let i: number, l: number;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++) {
            offsetWidth += this.graphicCurrencies[i].getWidth() + (i < l - 1 ? 10 : 0);
        }
        offsetWidth = ((w - offsetWidth) / 2);

        // Experience
        this.graphicXP.draw(x + offsetWidth, y, w, h);
        offsetWidth += this.graphicXPLength + 10;

        // Currencies
        let currency: Graphic.TextIcon;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++) {
            currency = this.graphicCurrencies[i];
            currency.draw(x + offsetWidth, y, w, h);
            offsetWidth += currency.getWidth() + 10;
        }
    }
}

export { RewardsTop }