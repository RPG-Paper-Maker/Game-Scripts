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
//  CLASS GraphicSkill
//
// -------------------------------------------------------

/** @class
*   The graphic displaying the player skills informations in skill menu.
*   @property {GraphicText} graphicName The skill name graphic.
*   @param {GameSkill} gameSkill The current selected skill.
*/
function GraphicSkill(gameSkill){
    this.skill = $datasGame.skills.list[gameSkill.id];

    // All the graphics
    this.graphicName = new GraphicTextIcon(this.skill.name, this.skill.pictureID);
    this.graphicCost = new GraphicText(this.skill.getCostString(), { align:
        Align.Right });
    this.graphicInformations = new GraphicSkillItem(this.skill);
}

GraphicSkill.prototype = {

    /** Drawing the skill in choice box.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    draw: function(x, y, w, h) {
        this.graphicName.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, h);
    },

    /** Drawing the skill description.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        this.graphicInformations.drawInformations(x, y, w, h);
        this.graphicCost.draw(x, y, w, 0);
    }
}
