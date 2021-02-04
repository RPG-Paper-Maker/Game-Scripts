/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Manager, Datas, Scene } from "../index";
import { Mathf } from "../Common";
import { Battler, Game } from "../Core";

/** @class
 *  The graphic displaying a skill or an item use.
 *  @extends Graphic.Base
 */
class UseSkillItem extends Base {

    public graphicCharacters: Graphic.Player[];
    public all: boolean;
    public indexArrow: number;
    public hideArrow: boolean;

    constructor(hideArrow: boolean = false) {
        super();

        this.graphicCharacters = new Array;
        let player: Graphic.Player;
        for (let i = 0, l = Game.current.teamHeroes.length; i < l; i++) {
            player = new Graphic.Player(Game.current.teamHeroes[i]);
            player.initializeCharacter(true);
            this.graphicCharacters.push(player);
        }
        this.hideArrow = hideArrow;
        this.setAll(false);
    }

    /** 
     *  Set if all targets are selected or not.
     *  @param {boolean} b - Indicate if all the targets are selected
     */
    setAll(b: boolean) {
        this.all = b;
        if (b) {
            let l = Game.current.teamHeroes.length;
            Scene.Map.current.targets = new Array(l);
            for (let i = 0; i < l; i++) {
                Scene.Map.current.targets[i] = new Battler(Game.current
                    .teamHeroes[i]);
            }
        } else {
            this.indexArrow = 0;
            Scene.Map.current.targets = [new Battler(Game.current
                .teamHeroes[this.indexArrow])];
        }
    }

    /** 
     *  Update the battler frame.
     */
    update() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateBattler();
        }
    }

    /** 
     *  Udpate the battler.
     */
    updateStats() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].update();
        }
    }

    /** 
     *  Move arrow left.
     */
    goLeft() {
        this.moveArrow(this.indexArrow - 1);
    }

    /** 
     *  Move arrow right.
     */
    goRight() {
        this.moveArrow(this.indexArrow + 1);
    }

    /** 
     *  Move an arrow according to index.
     *  @param {number} index - The corresponding index
     */
    moveArrow(index: number) {
        if (!this.all) {
            if (this.indexArrow !== index) {
                Datas.Systems.soundCursor.playSound();
            }
            this.indexArrow = Mathf.mod(index, this.graphicCharacters.length);
            Scene.Map.current.targets = [new Battler(Game.current
                .teamHeroes[this.indexArrow])];
            Manager.Stack.requestPaintHUD = true;
        }
    }

    /**
     *  Key pressed repeat handle, but with a small wait after the first 
     *  pressure.
     *  @param {number} key - The key ID pressed
     */
    onKeyPressedAndRepeat(key: number) {
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Right)) {
            this.goRight();
        } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
            .Left))
        {
            this.goLeft();
        }
    }

    /** 
     *  Draw an arrow at a specific index.
     *  @param {number} index - The corresponding index
     *  @param {number} x - The x position
     *  @param {number} y - The y position
     *  @param {number} h - The h size
     */
    drawArrowAtIndex(index: number, x: number, y: number, h: number) {
        Datas.Systems.getCurrentWindowSkin().drawArrowTarget(this
            .graphicCharacters[index].battlerFrame.value, x + 32 + (index * 85), 
            y + h - 20, true);
    }

    /** 
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x: number, y: number, w: number, h: number) {
        this.draw(x, y, w, h);
    }

    /** 
     *  Drawing the skill or item use informations.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    draw(x: number, y: number, w: number, h: number)
    {
        let i: number, l: number;
        for (i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].drawCharacter(x + 5 + (i * 85), y - 32, w,
                h);
        }
        if (!this.hideArrow) {
            if (this.all) {
                for (i = 0; i < l; i++) {
                    this.drawArrowAtIndex(i, x, y, h);
                }
            } else {
                this.drawArrowAtIndex(this.indexArrow, x, y, h);
            }
        }
    }
}

export { UseSkillItem }