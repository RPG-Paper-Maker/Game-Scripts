/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying the player skills informations in skill menu
*   @property {GraphicTextIcon} graphicName The graphic text icon for skill name
*   @property {GraphicText} graphicCost The graphic text for skill cost
*   @property {GraphicSkillItem} graphicInformations The graphic skill 
*   informations
*   @param {GameSkill} gameSkill The current selected skill
*/
class GraphicSkill
{
    constructor(gameSkill)
    {
        this.skill = RPM.datasGame.skills.list[gameSkill.id];

        // All the graphics
        this.graphicName = new GraphicTextIcon(this.skill.name(), this.skill
            .pictureID);
        this.graphicCost = new GraphicText(this.skill.getCostString(), { align: 
            Align.Right });
        this.graphicInformations = new GraphicSkillItem(this.skill);
    }

    // -------------------------------------------------------
    /** Drawing the skill in choice box
    *   @param {Canvas.Context} context The canvas context
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawChoice(x, y, w, h)
    {
        this.graphicName.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, h);
    }

    // -------------------------------------------------------
    /** Drawing the skill description
    *   @param {Canvas.Context} context The canvas context
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        this.graphicInformations.drawBox(x, y, w, h);
        this.graphicCost.draw(x, y, w, 0);
    }
}
