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
//  CLASS GraphicItem
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the items information in the inventory menu.
*   @property {GraphicText} graphicName The item name graphic.
*   @property {GraphicText} graphicNb The item numbers graphic.
*   @param {GameItem} gameItem The current selected item.
*   @param {number} nbItem The number of occurence of the selected item.
*/
function GraphicItem(gameItem, nbItem){
    this.gameItem = gameItem;
    this.item = gameItem.getItemInformations();

    // All the graphics
    this.graphicName = new GraphicTextIcon(this.item.name, this.item.pictureID);
    this.graphicNb = new GraphicText("x" + (typeof nbItem === 'undefined' ?
        gameItem.nb : nbItem), { align: Align.Right });
    this.graphicInformations = new GraphicSkillItem(this.item);
}

GraphicItem.prototype = {

    updateNb: function() {
        this.graphicNb.setText("x" + this.gameItem.nb);
    },

    // -------------------------------------------------------

    /** Drawing the item in choice box.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        this.graphicNb.draw(x, y, w, h);
    },

    /** Drawing the item description.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        this.graphicInformations.drawInformations(x, y, w, h);
        this.graphicNb.draw(x, y, w, 0);
    }
}
