/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS GraphicEquip
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the equipment information in the equip menu.
*   @property {GraphicText} graphicEquipmentName All the equipment kind names
*   graphics.
*   @property {GraphicText} graphicEquipment All the equipment names graphics.
*   @property {number} equipmentLength The max length of the equipment names.
*   @param {GamePlayer} gamePlayer The current selected player.
*   @param {number} index Index of the equiped item.
*   @param {number} length Max length of equipment kind name.
*/
function GraphicEquip(gamePlayer, id, length){
    var character, equiped;

    character = gamePlayer.getCharacterInformations();
    equiped = gamePlayer.equip[id];
    this.equipmentLength = length;

    // All the graphics
    this.graphicEquipmentName =
         new GraphicText($datasGame.battleSystem.equipments[id], Align.Left);
    if (equiped === null)
        this.graphicEquipment = new GraphicText("-", Align.Left);
    else{
        this.graphicEquipment =
             new GraphicText(equiped.getItemInformations().name, Align.Left);
    }
}

GraphicEquip.prototype = {

    /** Drawing the equipment kind and equipment name.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h){
        this.graphicEquipmentName.draw(x, y, w, h);
        this.graphicEquipment.draw(x + this.equipmentLength + 10, y, w, h);
    }
}
