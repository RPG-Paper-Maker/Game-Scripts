/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { WindowBox, WindowChoices, Game } from "../Core";
import { Inputs, ScreenResolution } from "../Common";
import { Graphic, Datas, Manager, Scene } from "../index";

/** @class
 *  Abstract class for the game save and loading menus.
 *  @extends Scene.Base
 */
class SaveLoadGame extends Base {

    public windowTop: WindowBox;
    public windowChoicesSlots: WindowChoices;
    public windowInformations: WindowBox;
    public windowBot: WindowBox;
    public gamesDatas: Graphic.Save[];

    constructor() {
        super();
    }

    /** 
     *  Load async stuff
     */
    async load() {
        // Initialize games
        this.gamesDatas = [];
        let currentGame = Game.current;
        for (let i = 1; i <= Datas.Systems.saveSlots; i++) {
            this.gamesDatas.push(null);
            Game.current = new Game(i);
            await Game.current.load();
            this.initializeGame(Game.current);
        }
        Game.current = currentGame;

        // Initialize windows
        this.windowTop = new WindowBox(20, 20, ScreenResolution.SCREEN_X - 40, 
            30);
        this.windowInformations = new WindowBox(120, 100, 500, 300, {
                padding: WindowBox.MEDIUM_PADDING_BOX
            }
        );
        this.windowChoicesSlots = new WindowChoices(10, 100, 100, 50, this
            .gamesDatas, {
                nbItemsMax: 6,
                padding: WindowBox.NONE_PADDING
            }
        );
        this.windowBot = new WindowBox(20, ScreenResolution.SCREEN_Y - 50, 
            ScreenResolution.SCREEN_X - 40, 30);
        this.updateInformations(this.windowChoicesSlots.currentSelectedIndex);
    }

    /** 
     *  Initialize a game displaying.
     *   @param {Game} game - The game 
     */
    initializeGame(game: Game) {
        this.gamesDatas[game.slot - 1] = new Graphic.Save(game);
    }

    /** 
     *  Set the contents in the bottom and top bars.
     *  @param {Graphic.Base} top - A graphic content for top
     *  @param {Graphic.Base} bot - A graphic content for bot
     */
    setContents(top: Graphic.Base, bot: Graphic.Base) {
        this.windowTop.content = top;
        this.windowBot.content = bot;
    }

    /** 
     *  Update the information to display inside the save informations.
     *  @param {number} i - The slot index 
     */
    updateInformations(i: number) {
        this.windowInformations.content = this.gamesDatas[i];
    }

    /** 
     *  Slot cancel.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    cancel(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }

    /** 
     *  Slot move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        if (isKey) {
            this.windowChoicesSlots.onKeyPressedAndRepeat(options.key);
        } else {
            this.windowChoicesSlots.onMouseMove(options.x, options.y);
        }
        this.updateInformations.call(this, this.windowChoicesSlots
            .currentSelectedIndex);
    }

    /** 
     *  Update the scene.
     */
    update() {
        this.windowChoicesSlots.update();
        if (!(<Graphic.Save> this.windowInformations.content).game.isEmpty) {
            this.windowInformations.content.update();
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        this.cancel(true, { key: key });
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        this.move(true, { key: key });
        return true;
    }

    /** 
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number) {
        this.move(false, { x: x, y: y });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number) {
        this.cancel(false, { x: x, y: y });
    }

    /** 
     *  Draw the HUD scene
     */
    drawHUD() {
        this.windowTop.draw();
        this.windowChoicesSlots.draw();
        this.windowInformations.draw();
        this.windowBot.draw();
    }
}

export { SaveLoadGame }