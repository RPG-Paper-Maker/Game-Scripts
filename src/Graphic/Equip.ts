/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Player } from "../Core";
import { Graphic, Datas, System } from "../index";
import { Constants, ScreenResolution } from "../Common";

/** @class
 *  The graphic displaying all the equipment information in the equip menu.
 *  @extends Graphic.Base
 *  @param {Player} player - The current selected player
 *  @param {number} id - The equipment ID
 *  @param {number} length - Max length of equipment kind name
 */
class Equip extends Base {

    public length: number;
    public isPossible: boolean;
    public graphicEquipmentName: Graphic.Text;
    public graphicEquipment: Graphic.Text;

    constructor(player: Player, id: number, length: number, isPossible: boolean) {
        super();

        this.length = ScreenResolution.getScreenMinXY(length);
        this.isPossible = isPossible;
        let equiped = player.equip[id];

        // All the graphics
        this.graphicEquipmentName = new Graphic.Text(Datas.BattleSystems
            .getEquipment(id).name(), isPossible ? {} : { color: System.Color.GREY });
        this.graphicEquipment = new Graphic.Text(equiped === null ? "-" : 
            equiped.system.name(), isPossible ? {} : { color: System.Color.GREY });
    }

    /** 
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.graphicEquipmentName.draw(x, y, w, h);
        this.graphicEquipment.draw(x + this.length + ScreenResolution
            .getScreenMinXY(Constants.LARGE_SPACE), y, w, h);
    }

    /** 
     *  Drawing the equipment kind and equipment name.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number) {
        this.drawChoice(x, y, w, h);
    }
}

export { Equip }