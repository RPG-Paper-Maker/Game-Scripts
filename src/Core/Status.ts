/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { stat } from "fs";
import { Datas, System } from "..";
import { Constants, Enum, ScreenResolution } from "../Common";
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

    static drawList(statusList: Status[], x: number, y: number, align: Enum
        .Align = Enum.Align.Left) {
        let totalWidth: number = 0;
        let maxHeight: number = 0;
        let maxWidth: number = 0;
        let i: number, l: number, s: Status, h: number, w: number;
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
        let xOffset: number = 0;
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
    draw(x: number, y: number) {
        this.picture.draw(x, y);
    }
}

export { Status }