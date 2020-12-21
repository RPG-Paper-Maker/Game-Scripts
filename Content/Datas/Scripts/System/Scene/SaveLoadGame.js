/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { WindowBox, WindowChoices, Game } from "../Core/index.js";
import { ScreenResolution } from "../Common/index.js";
import { Graphic, Datas, Manager } from "../index.js";
/** @class
 *  Abstract class for the game save and loading menus.
 *  @extends Scene.Base
 */
class SaveLoadGame extends Base {
    constructor() {
        super();
    }
    /**
     *  Load async stuff
     */
    async load() {
        // Initialize games
        this.gamesDatas = [null, null, null, null];
        let currentGame = Manager.Stack.game;
        for (let i = 1; i <= 4; i++) {
            Manager.Stack.game = new Game(i);
            await Manager.Stack.game.load();
            this.initializeGame(Manager.Stack.game);
        }
        Manager.Stack.game = currentGame;
        // Initialize windows
        this.windowTop = new WindowBox(20, 20, ScreenResolution.SCREEN_X - 40, 30);
        this.windowInformations = new WindowBox(120, 100, 500, 300, {
            padding: WindowBox.MEDIUM_PADDING_BOX
        });
        this.windowChoicesSlots = new WindowChoices(10, 100, 100, 50, this
            .gamesDatas, {
            nbItemsMax: 4,
            padding: WindowBox.NONE_PADDING
        });
        this.windowBot = new WindowBox(20, ScreenResolution.SCREEN_Y - 50, ScreenResolution.SCREEN_X - 40, 30);
        this.updateInformations(this.windowChoicesSlots.currentSelectedIndex);
    }
    /**
     *  Initialize a game displaying.
     *   @param {Game} game The game
     */
    initializeGame(game) {
        this.gamesDatas[game.slot - 1] = new Graphic.Save(game);
    }
    /**
     *  Set the contents in the bottom and top bars.
     *  @param {Graphic.Base} top A graphic content for top
     *  @param {Graphic.Base} bot A graphic content for bot
     */
    setContents(top, bot) {
        this.windowTop.content = top;
        this.windowBot.content = bot;
    }
    /**
     *  Update the information to display inside the save informations.
     *  @param {number} i The slot index
     */
    updateInformations(i) {
        this.windowInformations.content = this.gamesDatas[i];
    }
    /**
     *  Update the scene.
     */
    update() {
        if (!this.windowInformations.content.game.isEmpty) {
            this.windowInformations.content.update();
        }
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Cancel)
            || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls
                .MainMenu)) {
            Datas.Systems.soundCancel.playSound();
            Manager.Stack.pop();
        }
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        this.windowChoicesSlots.onKeyPressedAndRepeat(key);
        this.updateInformations.call(this, this.windowChoicesSlots
            .currentSelectedIndex);
        return true;
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
export { SaveLoadGame };
