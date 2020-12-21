/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, System, Core, Datas } from "..";
import { Enum } from "../Common";
import Align = Enum.Align;

/** @class
 *  The graphic displaying the player skills informations in skill menu.
 *  @extends Graphic.Base
 *  @param {Skill} skill The current selected skill
 */
class Skill extends Base {

    public system: System.Skill;
    public graphicName: Graphic.TextIcon;
    public graphicCost: Graphic.Text;
    public graphicInformations: Graphic.SkillItem;

    constructor(skill: Core.Skill) {
        super();

        this.system = Datas.Skills.get(skill.id);
        this.graphicName = new Graphic.TextIcon(this.system.name(), this.system
            .pictureID);
        this.graphicCost = new Graphic.Text(this.system.getCostString(), { align
            : Align.Right });
        this.graphicInformations = new Graphic.SkillItem(this.system);
    }

    /** 
     *  Drawing the skill in choice box.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.graphicName.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, h);
    }

    /** 
     *  Drawing the skill description.
     *  @param {number} x The x position to draw graphic
     *  @param {number} y The y position to draw graphic
     *  @param {number} w The width dimention to draw graphic
     *  @param {number} h The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        this.graphicInformations.draw(x, y, w, h);
        this.graphicCost.draw(x, y, w, 0);
    }
}

export { Skill }