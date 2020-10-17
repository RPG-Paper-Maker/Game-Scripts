/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all the equipment information in the equip menu
*   @property {number} length Max length of equipment kind name
*   @property {GraphicText} graphicEquipmentName All the equipment kind names
*   graphics
*   @property {GraphicText} graphicEquipment All the equipment names graphics
*   @param {GamePlayer} gamePlayer The current selected player
*   @param {number} id The equipment ID
*   @param {number} length Max length of equipment kind name
*/
class GraphicEquip
{
    constructor(gamePlayer, id, length)
    {
        this.length = length;
        let equiped = gamePlayer.equip[id];

        // All the graphics
        this.graphicEquipmentName = new GraphicText(RPM.datasGame
            .battleSystem.equipments[id]);
        this.graphicEquipment = new GraphicText(equiped === null ? "-" : equiped
            .getItemInformations().name());
    }

    // -------------------------------------------------------
    /** Drawing the equipment kind and equipment name
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h)
    {
        this.graphicEquipmentName.draw(x, y, w, h);
        this.graphicEquipment.draw(x + this.length + 10, y, w, h);
    }
}
