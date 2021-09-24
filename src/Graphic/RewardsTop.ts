/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Graphic, Datas } from "..";
import { Constants, Platform, Utils, Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;

/** @class
 *  The graphic displaying all experience + currencies
 */
class RewardsTop extends Base {
    
    public graphicXP: Graphic.Text;
    public graphicCurrencies: Graphic.TextIcon[];

    constructor(xp: number, currencies: Record<string, number>) {
        super();

        // Experience
        this.graphicXP = new Graphic.Text(Datas.BattleSystems.getExpStatistic()
            .name() + Constants.STRING_COLON + Constants.STRING_SPACE + xp);

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
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the progression.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        // Calculating offset for centering
        let offsetWidth = this.graphicXP.textWidth; + ScreenResolution
            .getScreenMinXY(Constants.LARGE_SPACE);
        let i: number, l: number;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++) {
            offsetWidth += this.graphicCurrencies[i].getWidth() + ScreenResolution
                .getScreenMinXY(i < l - 1 ? Constants.LARGE_SPACE : 0);
        }
        offsetWidth = ((w - offsetWidth) / 2);

        // Experience
        this.graphicXP.draw(x + offsetWidth, y, w, h);
        offsetWidth += this.graphicXP.textWidth + ScreenResolution
            .getScreenMinXY(Constants.LARGE_SPACE);

        // Currencies
        let currency: Graphic.TextIcon;
        for (i = 0, l = this.graphicCurrencies.length; i < l; i++) {
            currency = this.graphicCurrencies[i];
            currency.draw(x + offsetWidth, y, w, h);
            offsetWidth += currency.getWidth() + ScreenResolution.getScreenMinXY(
                Constants.LARGE_SPACE);
        }
    }
}

export { RewardsTop }