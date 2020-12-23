/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Datas } from "..";

/** @class
 *  A frame for updating animations (characters, battlers, etc.).
 *  @param {number} duration The frame duration
 *  @param {number} [tick=0] The frame tick (= time spent since current frame)
 *  @param {number} [value=0] The current frame value
 */
class Frame {

    public duration: number;
    public tick: number;
    public value: number;

    constructor(duration: number, tick: number = 0, value: number = 0) {
        this.duration = duration;
        this.tick = tick;
        this.value = value;
    }

    /** 
     *  Update frame according to tick and duration, return true if frame is 
     *  different.
     *  @param {number} [duration=this.duration] The frame duration
     *  @returns {boolean}
     */
    update(duration: number = this.duration): boolean {
        let frame = this.value;
        this.tick += Manager.Stack.elapsedTime;
        if (this.tick >= duration) {
            this.value = (this.value + 1) % Datas.Systems.FRAMES;
            this.tick = 0;
        }
        return (frame !== this.value);
    }
}

export { Frame }