/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, System } from "..";
import { Enum } from "../Common";
import { Picture2D } from "./Picture2D";

/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
class Status {

    public system: System.Status;
    public turn: number;
    public picture: Picture2D;

    constructor(id: number, turn: number = 0) {
        this.system = Datas.Status.get(id);
        this.turn = turn;
        this.picture = Datas.Pictures.getPictureCopy(Enum.PictureKind.Icons, 
            this.system.pictureID);
    }

    /** 
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawBattler(x: number, y: number) {
        this.picture.x = x;
        this.picture.y = y;
        this.picture.draw();
    }
}

export { Status }