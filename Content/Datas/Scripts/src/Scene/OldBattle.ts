/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Map } from "./Map";

/** @class
*   A scene for the loading
*   @extends SceneGame
*   @property {GraphicText} text The graphic text displaying loading
*/
class Battle extends Map {

    public user: any;
    
    constructor(id: number, isBattleMap: boolean) {
        super(id, isBattleMap)
    }
}

export { Battle }