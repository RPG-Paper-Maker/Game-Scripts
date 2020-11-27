/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic for skill or item displaying
*   @property {SystemCommonSkillItem} skillItem The System skill / item
*   @property {Picture2D[]} graphicElements The Pictures 2D for elements
*   @property {GraphicTextIcon} graphicName The graphic text and icon for skill 
*   / item
*   @property {GraphicText} graphicType The graphic text for skill / item type
*   @property {GraphicText} graphicDescription The graphic text for skill / 
*   item description
*   @property {GraphicText} graphicTarget The graphic text for skill / item 
*   description
*   @property {GraphicText[]} graphicEffects The graphic text list for skill / 
*   item effects
*   @property {GraphicText[]} graphicCharacteristics The graphic text list for 
*   skill / item characteristics
*/
class GraphicSkillItem
{
    constructor(skillItem)
    {
        this.skillItem = skillItem;
        // All the graphics
        this.graphicElements = [];
        this.graphicName = new GraphicTextIcon(this.skillItem.name(), this
            .skillItem.pictureID);
        if (this.skillItem.hasType)
        {
            this.graphicType = new GraphicText(this.skillItem.getType().name, { 
                fontSize: RPM.MEDIUM_FONT_SIZE });
        }
        this.graphicDescription = new GraphicText(this.skillItem.description
            .name());
        if (this.skillItem.hasTargetKind)
        {
            this.graphicTarget = new GraphicText("Target: " + this.skillItem
                .getTargetKindString(), { align: Align.Right, fontSize: RPM
                .MEDIUM_FONT_SIZE });
        }
        this.graphicEffects = [];
        let i, l, effect, txt, graphic, graphicIcon;
        for (i = 0, l = this.skillItem.effects.length; i < l; i++)
        {
            effect = this.skillItem.effects[i];
            txt = effect.toString();
            if (txt)
            {
                graphic = new GraphicText(txt, { fontSize: RPM.MEDIUM_FONT_SIZE });
                this.graphicEffects.push(graphic);
            }
            if (effect.isDamageElement)
            {
                graphicIcon = RPM.datasGame.pictures.getPictureCopy(PictureKind
                    .Icons, RPM.datasGame.battleSystem.elements[effect
                    .damageElementID.getValue()].pictureID);
                this.graphicElements.push(graphicIcon);
                if (txt)
                {
                    graphic.elementIcon = graphicIcon;
                }
            }
        }
        this.graphicCharacteristics = [];
        for (i = 0, l = this.skillItem.characteristics.length; i < l; i++)
        {
            txt = this.skillItem.characteristics[i].toString();
            if (txt)
            {
                this.graphicCharacteristics.push(new GraphicText(txt, { 
                    fontSize: RPM.MEDIUM_FONT_SIZE }));
            }
        }
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
        let offsetY = 0;
        this.graphicName.draw(x, y + offsetY, w, 0);
        offsetY += this.graphicName.getMaxHeight();
        if (this.skillItem.hasTargetKind)
        {
            this.graphicTarget.draw(x, y + offsetY, w, 0);
        }
        let offsetX = x + this.graphicName.getWidth() + this.graphicName.space;
        let i, l, graphic;
        for (i = 0, l = this.graphicElements.length; i < l; i++) {
            graphic = this.graphicElements[i];
            graphic.draw(offsetX, y - (graphic.h / 2));
            offsetX += this.graphicElements.w + this.graphicName.space;
        }
        if (this.skillItem.hasType)
        {
            this.graphicType.draw(x + this.graphicName.graphicIcon.w + this
                .graphicName.space, y + offsetY, w, 0);
        }
        offsetY += RPM.MEDIUM_FONT_SIZE + RPM.LARGE_SPACE;
        this.graphicDescription.draw(x, y + offsetY, w, 0);
        offsetY += this.graphicDescription.fontSize + RPM.LARGE_SPACE;
        for (i = 0, l = this.graphicEffects.length; i < l; i++)
        {
            graphic = this.graphicEffects[i];
            graphic.draw(x, y + offsetY, w, 0);
            if (graphic.elementIcon)
            {
                graphic.elementIcon.draw(x + graphic.measureText(), y + offsetY
                    - (graphic.elementIcon.h / 2));
            }
            offsetY += graphic.fontSize + RPM.MEDIUM_SPACE;
        }
        offsetY += RPM.LARGE_SPACE;
        for (i = 0, l = this.graphicCharacteristics.length; i < l; i++)
        {
            graphic = this.graphicCharacteristics[i];
            graphic.draw(x, y + offsetY, w, 0);
            offsetY += graphic.fontSize + RPM.MEDIUM_SPACE;
        }
    }
}