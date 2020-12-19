/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic } from "../index.js";
import { Utils, Enum } from "../Common/index.js";
var Align = Enum.Align;
/** @class
 *  The graphic displaying all the items information in the inventory menu.
 *  @param {Item} item The current selected item
 *  @param {number} nbItem The number of occurence of the selected item
 */
class Item extends Base {
    constructor(item, nbItem) {
        super();
        this.item = item;
        this.system = item.getItemInformations();
        // All the graphics
        this.graphicName = new Graphic.TextIcon(this.system.name(), this.system
            .pictureID);
        this.graphicNb = new Graphic.Text("x" + (Utils.isUndefined(nbItem) ?
            item.nb : nbItem), { align: Align.Right });
        this.graphicInformations = new Graphic.SkillItem(this.system);
    }
    /**
     *  Update the game item number.
     */
    updateNb() {
        this.graphicNb.setText("x" + this.item.nb);
    }
    /**
     *  Drawing the item in choice box.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        this.graphicNb.draw(x, y, w, h);
    }
    /**
     *  Drawing the item description.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        this.graphicInformations.draw(x, y, w, h);
        this.graphicNb.draw(x, y, w, 0);
    }
}
export { Item };
