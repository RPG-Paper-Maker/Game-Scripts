/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GraphicSkillItem
//
// -------------------------------------------------------

/** @class
*/
function GraphicSkillItem(skillItem) {
    var i, l, effect, txt;
    this.skillItem = skillItem;

    // All the graphics
    this.graphicName = new GraphicTextIcon(skillItem.name, skillItem.pictureID);
    if (skillItem.hasType) {
        this.graphicType = new GraphicText(skillItem.getType().name, Align.Left,
            RPM.MEDIUM_FONT_SIZE);
    }
    this.graphicDescription = new GraphicText(skillItem.description.name, Align
        .Left);
    if (skillItem.hasTargetKind) {
        this.graphicTarget = new GraphicText("Target: " + skillItem
            .getTargetKindString(), Align.Right, RPM.MEDIUM_FONT_SIZE);
    }
    this.graphicEffects = [];
    for (i = 0, l = this.skillItem.effects.length; i < l; i++) {
        txt = this.skillItem.effects[i].toString();
        if (txt) {
            this.graphicEffects.push(new GraphicText(txt, Align.Left, RPM
                .MEDIUM_FONT_SIZE));
        }
    }
}

GraphicSkillItem.prototype = {

    /** Drawing the skill description.
    *   @param {Canvas.Context} context The canvas context.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        var i, l, offsetY, graphic;

        offsetY = 0;
        this.graphicName.draw(x, y + offsetY, w, 0);
        offsetY += this.graphicName.getMaxHeight();
        if (this.skillItem.hasTargetKind) {
            this.graphicTarget.draw(x, y + offsetY, w, 0);
        }
        if (this.skillItem.hasType) {
            this.graphicType.draw(x + this.graphicName.textIcon.icon.w + this
                .graphicName.space, y + offsetY, w, 0);
        }
        offsetY += RPM.MEDIUM_FONT_SIZE + RPM.LARGE_SPACE;
        this.graphicDescription.draw(x, y + offsetY, w, 0);
        offsetY += this.graphicDescription.fontSize + RPM.LARGE_SPACE;
        for (i = 0, l = this.graphicEffects.length; i < l; i++) {
            graphic = this.graphicEffects[i];
            graphic.draw(x, y + offsetY, w, 0);
            offsetY += graphic.fontSize + RPM.MEDIUM_SPACE;
        }
    }
}
