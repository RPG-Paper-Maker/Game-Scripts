/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Graphic, Core, Datas } from "../index";
import { Utils, Enum, Constants } from "../Common";
import Align = Enum.Align;

/** @class
 *  The graphic displaying all the items information in the inventory menu.
 *  @param {Item} item - The current selected item
 *  @param {number} nbItem - The number of occurence of the selected item
 */
class Item extends Base {

    public item: Core.Item;
    public graphicName: Graphic.TextIcon;
    public graphicNb: Graphic.Text;
    public graphicInformations: Graphic.SkillItem;
    public graphicCurrencies: Graphic.TextIcon[];

    constructor(item: Core.Item, nbItem?: number, possible: boolean = true) {
        super();

        this.item = item;

        // All the graphics
        nbItem = Utils.isUndefined(nbItem) ? item.nb : nbItem;
        this.graphicName = new Graphic.TextIcon("", this.item.system.pictureID, 
            {}, possible ? {} : { color: System.Color.GREY });
        this.updateName(nbItem);
        if (Utils.isUndefined(item.shop)) {
            this.graphicNb = new Graphic.Text("x" + nbItem, { align: Align.Right });
        }
        this.graphicInformations = new Graphic.SkillItem(this.item.system);
        this.graphicCurrencies = [];
        if (!Utils.isUndefined(item.shop)) {
            let price = item.shop.getPrice();
            this.graphicCurrencies = [];
            let graphic: Graphic.TextIcon;
            for (let id in price) {
                graphic = new Graphic.TextIcon(Utils.numToString(price[id]), 
                    Datas.Systems.getCurrency(parseInt(id)).pictureID, { align: 
                    Align.Right }, possible ? {} : { color: System.Color.GREY });
                this.graphicCurrencies.push(graphic);
            }
        }
    }

    /** 
     *  Update the item name (+ item number if shop).
     *  @param {number} [nbItem=undefined]
     */
    updateName(nbItem?: number) {
        nbItem = Utils.isUndefined(nbItem) ? this.item.nb : nbItem;
        this.graphicName.setText(this.item.system.name() + (!Utils.isUndefined(
            this.item.shop) && nbItem !== -1 ? Constants.STRING_SPACE + Constants
            .STRING_BRACKET_LEFT + nbItem + Constants.STRING_BRACKET_RIGHT : ""));
    }

    /** 
     *  Update the game item number.
     */
    updateNb() {
        this.graphicNb.setText("x" + this.item.nb);
    }

    /** 
     *  Drawing the item in choice box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.graphicName.draw(x, y, w, h);
        let offset = 0;
        let graphic: Graphic.TextIcon;
        for (let i = this.graphicCurrencies.length - 1; i >= 0; i--) {
            graphic = this.graphicCurrencies[i];
            graphic.draw(x - offset, y, w, h);
            offset += graphic.getWidth() + Constants.MEDIUM_SPACE;
        }
        if (this.graphicNb) {
            this.graphicNb.draw(x, y, w, h);
        }
    }

    /** 
     *  Drawing the item description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        this.graphicInformations.draw(x, y, w, h);
    }
}

export { Item }