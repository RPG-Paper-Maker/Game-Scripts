/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
import { Constants, Enum } from "../Common/index.js";
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
    static drawList(statusList, x, y, align = Enum.Align.Left) {
        let totalWidth = 0;
        let maxHeight = 0;
        let maxWidth = 0;
        let i, l, s, h, w;
        for (let i = 0, l = statusList.length; i < l; i++) {
            totalWidth += statusList[i].picture.oW;
            w = statusList[i].picture.oW;
            if (w > maxWidth) {
                maxWidth = w;
            }
            h = statusList[i].picture.oH;
            if (h > maxHeight) {
                maxHeight = h;
            }
        }
        if (l > 1) {
            totalWidth += (l - 1) * Constants.MEDIUM_SPACE;
        }
        let xOffset = 0;
        switch (align) {
            case Enum.Align.Left:
                totalWidth = 0;
                break;
            case Enum.Align.Center:
                totalWidth /= 2;
                break;
        }
        for (i = 0, l = statusList.length; i < l; i++) {
            s = statusList[i];
            xOffset += s.picture.oW;
            s.draw(x - totalWidth + xOffset + (i * Constants.MEDIUM_SPACE) -
                maxWidth, y - (maxHeight / 2));
        }
    }
    /**
     *  Draw the status on top of battler.
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     */
    draw(x, y) {
        this.picture.draw(x, y);
    }
}
export { Status };
