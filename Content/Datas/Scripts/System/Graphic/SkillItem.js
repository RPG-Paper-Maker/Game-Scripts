/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Graphic, Datas } from "../index.js";
import { Constants, Enum } from "../Common/index.js";
var Align = Enum.Align;
var PictureKind = Enum.PictureKind;
var AlignVertical = Enum.AlignVertical;
/** @class
 *  The graphic for skill or item displaying.
 *  @extends Graphic.Base
 *  @param {System.CommonSkillItem} system
 */
class SkillItem extends Base {
    constructor(system) {
        super();
        this.system = system;
        // All the graphics
        this.graphicElements = [];
        this.graphicName = new Graphic.TextIcon(system.name(), this.system
            .pictureID);
        if (this.system.hasType) {
            this.graphicType = new Graphic.Text(system.getType().name(), {
                fontSize: Constants.MEDIUM_FONT_SIZE
            });
        }
        this.graphicDescription = new Graphic.Text(system.description.name(), {
            verticalAlign: AlignVertical.Top
        });
        if (this.system.hasTargetKind) {
            this.graphicTarget = new Graphic.Text("Target: " + system
                .getTargetKindString(), { align: Align.Right, fontSize: Constants.MEDIUM_FONT_SIZE });
        }
        this.graphicEffects = [];
        let i, l, effect, txt, graphic, graphicIcon;
        for (i = 0, l = this.system.effects.length; i < l; i++) {
            effect = this.system.effects[i];
            txt = effect.toString();
            if (txt) {
                graphic = new Graphic.Text(txt, { fontSize: Constants
                        .MEDIUM_FONT_SIZE });
                this.graphicEffects.push(graphic);
            }
            if (effect.isDamageElement) {
                graphicIcon = Datas.Pictures.getPictureCopy(PictureKind.Icons, Datas.BattleSystems.getElement(effect.damageElementID
                    .getValue()).pictureID);
                this.graphicElements.push(graphicIcon);
                if (txt) {
                    graphic['elementIcon'] = graphicIcon;
                }
            }
        }
        this.graphicCharacteristics = [];
        for (i = 0, l = this.system.characteristics.length; i < l; i++) {
            txt = this.system.characteristics[i].toString();
            if (txt) {
                this.graphicCharacteristics.push(new Graphic.Text(txt, {
                    fontSize: Constants.MEDIUM_FONT_SIZE
                }));
            }
        }
    }
    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x, y, w, h) {
        this.draw(x, y, w, h);
    }
    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x, y, w, h) {
        let offsetY = 0;
        this.graphicName.draw(x, y + offsetY, w, 0);
        offsetY += this.graphicName.getMaxHeight();
        if (this.system.hasTargetKind) {
            this.graphicTarget.draw(x, y + offsetY, w, 0);
        }
        let offsetX = x + this.graphicName.getWidth() + this.graphicName.space;
        let i, l, graphic;
        for (i = 0, l = this.graphicElements.length; i < l; i++) {
            graphic = this.graphicElements[i];
            graphic.draw(offsetX, y - (graphic.h / 2));
            offsetX += graphic.w + this.graphicName.space;
        }
        if (this.system.hasType) {
            this.graphicType.draw(x + this.graphicName.graphicIcon.w + this
                .graphicName.space, y + offsetY, w, 0);
        }
        offsetY += Constants.MEDIUM_FONT_SIZE + Constants.LARGE_SPACE;
        this.graphicDescription.draw(x, y + offsetY, w, h);
        offsetY += this.graphicDescription.textHeight + Constants.LARGE_SPACE;
        let graphicText;
        for (i = 0, l = this.graphicEffects.length; i < l; i++) {
            graphicText = this.graphicEffects[i];
            graphicText.draw(x, y + offsetY, w, 0);
            if (graphicText['elementIcon']) {
                graphicText.measureText();
                graphicText['elementIcon'].draw(x + graphicText.textWidth, y +
                    offsetY - (graphicText['elementIcon'].h / 2));
            }
            offsetY += graphicText.fontSize + Constants.MEDIUM_SPACE;
        }
        offsetY += Constants.LARGE_SPACE;
        for (i = 0, l = this.graphicCharacteristics.length; i < l; i++) {
            graphicText = this.graphicCharacteristics[i];
            graphicText.draw(x, y + offsetY, w, 0);
            offsetY += graphicText.fontSize + Constants.MEDIUM_SPACE;
        }
    }
}
export { SkillItem };
