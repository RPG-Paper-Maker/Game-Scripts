/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Bitmap } from "../Core/index.js"

/** @class
 *  The abstract class who model the Structure of graphics (inside window boxes).
 */
export abstract class Base extends Bitmap {
    abstract drawBox(x: number, y: number, w: number, h: number, positionResize: 
        boolean) :void;
    abstract draw(x: number, y: number, w: number, h: number, positionResize: 
        boolean) :void;
}