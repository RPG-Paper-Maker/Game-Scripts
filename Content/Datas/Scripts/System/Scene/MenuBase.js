/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./index.js";
import { Graphic, Scene } from "../index.js";
import { Game } from "../Core/index.js";
/**
 * The superclass who handle menu related scenes
 *
 * @abstract
 * @class MenuBase
 * @extends {Base}
 */
class MenuBase extends Base {
    constructor() {
        super(false);
    }
    /**
     * Return the whole party array.
     *
     * @example
     * var size = this.party().length;
     *
     * @return {*}
     * @memberof MenuBase
     */
    party() {
        return Game.current.teamHeroes;
    }
    /**
     * Return the current active hero.
     *
     * @example
     * let level = this.hero().getCurrentLevel();
     *
     * @return {*}
     * @memberof MenuBase
     */
    hero() {
        return this.party()[this._activeHero];
    }
    /**
     * Return the current active hero index.
     *
     * @example
     * let id = this.heroID();
     * this.sprite = "Hero_" + id;
     *
     * @return {*}
     * @memberof MenuBase
     */
    heroID() {
        return this._activeHero;
    }
    /**
     * set the active hero index.
     *
     * @param {number} id - the hero index
     * @memberof MenuBase
     */
    setActiveHero(id) {
        if (id > this.party().length) {
            throw new Error("Out of bound error : The id is higher than the party array.");
        }
        this._activeHero = id;
    }
    /**
     * Return a array of the party graphics
     *
     * @todo maybe move that to the future new Party class once done?
     *
     * @example
     *  var hero_Battler1 = this.partyGraphics()[0].battler;
     *
     * @return {Graphic.Player[]}
     * @memberof MenuBase
     */
    partyGraphics() {
        let array = [];
        for (let i = 0; i < this.party().length; i++) {
            array[i] = new Graphic.Player(this.party()[i]);
        }
        return array;
    }
    /**
     * Return the active hero graphics.
     *
     * @example
     * var hero_battler = this.heroGraphics().battler;
     *
     * @return {Graphic.Player}
     * @memberof MenuBase
     */
    heroGraphics() {
        let id = this._activeHero;
        return this.partyGraphics()[id];
    }
    update() {
        Scene.Base.prototype.update.call(Scene.Map.current);
    }
}
/**
 * the slots to display in a menu.
 *
 * @static
 * @type {number}
 * @memberof MenuBase
 */
MenuBase.SLOTS_TO_DISPLAY = 12;
export { MenuBase };
/**
 * the class
 *
 * @class Test
 */
class Test {
    /**
     * Creates an instance of Test.
     * @param {number} x - the x-axis
     * @param {number} y - the y-axis
     * @memberof Test
     */
    constructor(x, y) {
        this.unit = [x, y];
    }
}
