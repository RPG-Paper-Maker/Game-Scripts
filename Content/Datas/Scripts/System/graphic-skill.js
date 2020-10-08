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
*   @property {GraphicText} graphicName The skill name graphic
*   @param {GameSkill} gameSkill The current selected skill
*/
class GraphicSkill
{
    constructor(gameSkill)
    {
        this.gameSkill = gameSkill;
    }

    async load()
    {
        this.skill = RPM.datasGame.skills.list[this.gameSkill.id];

        // All the graphics
        this.graphicName = await GraphicTextIcon.create(this.skill.name(), this
            .skill.pictureID);
        this.graphicCost = new GraphicText(this.skill.getCostString(), { align:
            Align.Right });
        this.graphicInformations = await GraphicSkillItem.create(this.skill);
    }

    static async create(gameSkill)
    {
        let graphic = new GraphicSkill(gameSkill);
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

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
