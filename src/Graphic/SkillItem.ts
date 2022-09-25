/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Graphic, Datas } from "../index";
import { Picture2D } from "../Core";
import { Constants, Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;
import PictureKind = Enum.PictureKind;
import AlignVertical = Enum.AlignVertical;

/** @class
 *  The graphic for skill or item displaying.
 *  @extends Graphic.Base
 *  @param {System.CommonSkillItem} system
 */
class SkillItem extends Base {

    public system: System.CommonSkillItem;
    public graphicElements: Picture2D[];
    public graphicName: Graphic.TextIcon;
    public graphicType: Graphic.Text;
    public graphicDescription: Graphic.Text;
    public graphicTarget: Graphic.Text;
    public graphicEffects: Graphic.Text[];
    public graphicCharacteristics: Graphic.Text[];

    constructor(system: System.CommonSkillItem) {
        super();

        this.system = system;
        // All the graphics
        this.graphicElements = [];
        this.graphicName = Graphic.TextIcon.createFromSystem(system.name(), this
            .system);
        if (this.system.hasType) {
            this.graphicType = new Graphic.Text(system.getType().name(), { 
                fontSize: Constants.MEDIUM_FONT_SIZE });
        }
        this.graphicDescription = new Graphic.Text(system.description.name(), { 
            verticalAlign: AlignVertical.Top });
        if (this.system.hasTargetKind) {
            this.graphicTarget = new Graphic.Text("Target: " + system
                .getTargetKindString(), { align: Align.Right, fontSize: 
                Constants.MEDIUM_FONT_SIZE });
        }
        this.graphicEffects = [];
        let i: number, l: number, effect: System.Effect, txt: string, graphic: 
            Graphic.Text, graphicIcon: Picture2D;
        for (i = 0, l = this.system.effects.length; i < l; i++) {
            effect = this.system.effects[i];
            txt = effect.toString();
            if (txt) {
                graphic = new Graphic.Text(txt, { fontSize: Constants
                    .MEDIUM_FONT_SIZE });
                this.graphicEffects.push(graphic);
            }
            if (effect.isDamageElement) {
                let element = Datas.BattleSystems.getElement(effect.damageElementID
                    .getValue());
                graphicIcon = Datas.Pictures.getPictureCopy(PictureKind.Icons, 
                    element.pictureID);
                graphicIcon.sx = element.pictureIndexX * Datas.Systems.iconsSize;
                graphicIcon.sy = element.pictureIndexY * Datas.Systems.iconsSize;
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
                    fontSize: Constants.MEDIUM_FONT_SIZE }));
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
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /**
     *  Drawing the skill description.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        let offsetY = 0;
        this.graphicName.draw(x, y, w, 0);
        offsetY += this.graphicName.getMaxHeight();
        if (this.system.hasTargetKind) {
            this.graphicTarget.draw(x, y + offsetY, w, 0);
        }
        let offsetX = x + this.graphicName.getWidth() + this.graphicName.space;
        let i: number, l: number, graphic: Picture2D;
        for (i = 0, l = this.graphicElements.length; i < l; i++) {
            graphic = this.graphicElements[i];
            graphic.draw({ x: offsetX, y: y - ScreenResolution.getScreenMinXY(
                Datas.Systems.iconsSize), sw: Datas.Systems.iconsSize, sh: Datas
                .Systems.iconsSize, w: ScreenResolution.getScreenMinXY(Datas
                .Systems.iconsSize), h: ScreenResolution.getScreenMinXY(Datas
                .Systems.iconsSize) });
            offsetX += ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize) + 
                this.graphicName.space;
        }
        if (this.system.hasType) {
            this.graphicType.draw(x + ScreenResolution.getScreenMinXY(Datas
                .Systems.iconsSize) + this.graphicName.space, y + offsetY, w, 0);
        }
        offsetY += ScreenResolution.getScreenMinXY(Constants.MEDIUM_FONT_SIZE + 
            Constants.LARGE_SPACE);
        this.graphicDescription.draw(x, y + offsetY, w, h);
        offsetY += this.graphicDescription.textHeight + ScreenResolution
            .getScreenMinXY(Constants.LARGE_SPACE);
        let graphicText: Graphic.Text, pictureIcon: Picture2D;
        for (i = 0, l = this.graphicEffects.length; i < l; i++) {
            graphicText = this.graphicEffects[i];
            graphicText.draw(x, y + offsetY, w, 0);
            pictureIcon = graphicText['elementIcon'];
            if (pictureIcon) {
                graphicText.measureText();
                pictureIcon.draw({ x: x + graphicText.textWidth + ScreenResolution
                    .getScreenMinXY(Constants.MEDIUM_SPACE), y: y + offsetY - 
                    ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize), sw: 
                    Datas.Systems.iconsSize, sh: Datas.Systems.iconsSize, w: 
                    ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize), h: 
                    ScreenResolution.getScreenMinXY(Datas.Systems.iconsSize) });
            }
            offsetY += graphicText.fontSize + ScreenResolution.getScreenMinXY(
                Constants.MEDIUM_SPACE);
        }
        offsetY += ScreenResolution.getScreenMinXY(Constants.LARGE_SPACE);
        for (i = 0, l = this.graphicCharacteristics.length; i < l; i++) {
            graphicText = this.graphicCharacteristics[i];
            graphicText.draw(x, y + offsetY, w, 0);
            offsetY += graphicText.fontSize + ScreenResolution.getScreenMinXY(
                Constants.MEDIUM_SPACE);
        }
    }
}

export { SkillItem }