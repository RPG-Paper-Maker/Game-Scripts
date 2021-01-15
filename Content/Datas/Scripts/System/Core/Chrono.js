/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/** @class
 *  A chrono in the game.
 *  @param {number} start - The start time of the chrono (in milliseconds)
 */
class Chrono {
    constructor(start = 0) {
        this.time = start;
        this.lastTime = new Date().getTime();
    }
    /**
     *  Get time time in seconds.
     *  @returns {number}
     */
    getSeconds() {
        return Math.floor(this.time / 1000);
    }
    /**
     *  Update the chrono
     */
    update() {
        let date = new Date().getTime();
        this.time += date - this.lastTime;
        this.lastTime = date;
    }
}
export { Chrono };
