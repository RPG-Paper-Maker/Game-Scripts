/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS Chrono
//
// -------------------------------------------------------

/** @class
*   A chrono in the game.
*/
function Chrono(start) {
    this.time = start;
    this.lastTime = new Date().getTime();
}

Chrono.prototype = {
    update: function()
    {
        let date = new Date().getTime();
        this.time += date - this.lastTime;
        this.lastTime = date;
    },

    getSeconds: function()
    {
        return Math.floor(this.time / 1000);
    }
}
