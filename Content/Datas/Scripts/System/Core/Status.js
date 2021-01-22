/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Enum } from "../Common/index.js";
/** @class
 *  A status affected to a player.
 *  @param {number} id - The ID of the status
 */
class Status {
    constructor(id, turn = 0) {
        this.system = Datas.Status.get(id);
        this.turn = turn;
        this.picture = Datas.Pictures.getPictureCopy(Enum.PictureKind.Icons, this.system.pictureID);
    }
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    drawBattler(x, y) {
        this.picture.x = x;
        this.picture.y = y;
        this.picture.draw();
    }
}
export { Status };
