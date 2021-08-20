/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Graphic, Manager, Datas, Scene, System, Core } from "../index";
import { Mathf } from "../Common";
import { Battler, Game, Player } from "../Core";

/** @class
 *  The graphic displaying a skill or an item use.
 *  @extends Graphic.Base
 */
class UseSkillItem extends Base {

    public skillItem: System.CommonSkillItem;
    public graphicCharacters: Graphic.Player[];
    public all: boolean;
    public indexArrow: number;
    public hideArrow: boolean;

    constructor({ hideArrow = false }: { hideArrow?: boolean } = {}) {
        super();

        this.graphicCharacters = new Array;
        let player: Graphic.Player;
        for (let i = 0, l = Game.current.teamHeroes.length; i < l; i++) {
            player = new Graphic.Player(Game.current.teamHeroes[i]);
            player.initializeCharacter(true);
            this.graphicCharacters.push(player);
        }
        this.hideArrow = hideArrow;
    }

    /** 
     *  Get the selected player.
     *  @returns {Core.Player}
     */
    getSelectedPlayer(): Player {
        return this.graphicCharacters[this.indexArrow].player;
    }

    /** 
     *  Set skill item.
     *  @param {System.CommonSkillItem} skillItem
     */
    setSkillItem(skillItem: System.CommonSkillItem) {
        this.skillItem = skillItem;
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
            this.indexArrow = -1;
            this.goRight();
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
        this.moveArrow(-1);
    }

    /** 
     *  Move arrow right.
     */
    goRight() {
        this.moveArrow(1);
    }

    /** 
     *  Move an arrow according to index.
     *  @param {number} index - The corresponding index
     */
    moveArrow(index: number) {
        if (!this.all) {
            let target: Player;
            do {
                this.indexArrow = Mathf.mod(this.indexArrow + index, this
                    .graphicCharacters.length);
                target = Game.current.teamHeroes[this.indexArrow];
            } while (!this.skillItem.isPossible(target));
            Scene.Map.current.targets = [new Battler(target)];
            Manager.Stack.requestPaintHUD = true;
            Datas.Systems.soundCursor.playSound();
        }
    }

    /** 
     *  Update stat short.
     *  @param {number} equipmentID
     *  @param {System.CommonSkillItem} weaponArmor
     */
    updateStatShort(weaponArmor: System.CommonSkillItem) {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateStatShort(weaponArmor);
        }
    }

    /** 
     *  Update stat short to none.
     */
    updateStatShortNone() {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++) {
            this.graphicCharacters[i].updateStatShortNone();
        }
    }

    /** 
     *  A widget move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (isKey) {
            this.onKeyPressedAndRepeat(options.key);
        } else {
            this.onMouseMove(options.x, options.y);
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
     *  Mouse move handle for the current stack.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x: number, y: number) {
        if (!this.all) {
            let changed = false;
            let i: number, l: number;
            for (i = 0, l = this.graphicCharacters.length; i < l; i++) {
                if (this.graphicCharacters[i].battlerRect.isInside(x, y)) {
                    changed = true;
                    break;
                }
            }
            if (changed && i !== this.indexArrow) {
                let target = Game.current.teamHeroes[i];
                if (this.skillItem.isPossible(target)) {
                    this.indexArrow = i;
                    Scene.Map.current.targets = [new Battler(target)];
                    Manager.Stack.requestPaintHUD = true;
                    Datas.Systems.soundCursor.playSound();
                }
            }
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