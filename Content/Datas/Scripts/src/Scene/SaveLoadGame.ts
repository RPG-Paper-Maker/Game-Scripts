/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";

/** @class
 *  Abstract class for the game save and loading menus
 *  @extends SceneGame
 *  @property {WindowBox} windowTop A Window for displaying informations on top
 *  @property {WindowChoices} windowChoicesSlots A window choices for choosing
 *  a slot
 *  @property {WindowBox} windowInformations A Window for displaying
 *  informations about the selected slot
 *  @property {WindowBox} windowBot A Window for displaying informations on
 *  bottom
 *  @property {Game[]} gamesDatas List of all games datas
 */
class SaveLoadGame extends Base {

    constructor() {
        super();
    }

    // -------------------------------------------------------
    /** Load async stuff
    */
    async load()
    {
        /*
        // Initialize windows
        let games = [];
        let i;
        for (i = 1; i <= 4; i++)
        {
            games.push(this.getEmptyGame(i));
        }
        this.windowTop = new WindowBox(20, 20, RPM.SCREEN_X - 40, 30);
        this.windowChoicesSlots = new WindowChoices(10, 100, 100, 50, games,
            {
                nbItemsMax: 4,
                padding: RPM.NONE_PADDING
            }
        );
        this.windowInformations = new WindowBox(120, 100, 500, 300,
            {
                padding: RPM.MEDIUM_PADDING_BOX
            }
        );
        this.windowBot = new WindowBox(20, RPM.SCREEN_Y - 50, RPM.SCREEN_X - 40, 
            30);

        // Initialize games
        this.gamesDatas = [null, null, null, null];
        let json, game, path;
        for (i = 1; i <= 4; i++)
        {
            json = null;
            path = Game.getPathSave(i);
            if (RPM.fileExists(path))
            {
                json = JSON.parse(await RPM.openFile(path));
            }
            game = json === null ? { currentSlot: i, isNull: true } : new Game(i
                , json);
            this.initializeGame(game);
        }
        this.windowChoicesSlots.setContents(this.gamesDatas);
        */
    }

    // -------------------------------------------------------
    /** Get an object representing an empty game
    *   @param {number} i The slot number
    *   @returns {Object} 
    */
    getEmptyGame(i)
    {
        /*
        return {
            currentSlot: i,
            isNull: true
        };
        */
    }

    // -------------------------------------------------------
    /** Initialize a game displaying
    *   @param {Game} game The game 
    */
    initializeGame(game)
    {
        /*
        this.gamesDatas[game.currentSlot - 1] = new GraphicSave(game);
        if (game.currentSlot - 1 === this.windowChoicesSlots
            .currentSelectedIndex)
        {
            this.updateInformations(game.currentSlot - 1);
        }
        */
    }

    // -------------------------------------------------------
    /** Set the contents in the bottom and top bars
    *   @param {Object} top A graphic content for top
    *   @param {Object} bot A graphic content for bot
    */
    setContents(top, bot)
    {
        /*
        this.windowTop.content = top;
        this.windowBot.content = bot;
        */
    }

    // -------------------------------------------------------
    /** Update the information to display inside the save informations
    *   @param {number} i The slot index 
    */
    updateInformations(i)
    {
        //this.windowInformations.content = this.gamesDatas[i];
    }

    // -------------------------------------------------------
    /** Update the scene
    */
    update()
    {
        /*
        if (!this.windowInformations.content.game.isNull)
        {
            this.windowInformations.content.update();
        }
        */
    }

    // -------------------------------------------------------
    /** Handle scene key pressed
    *   @param {number} key The key ID
    */
    onKeyPressed(key)
    {
        /*
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Cancel) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .MainMenu))
        {
            RPM.datasGame.system.soundCancel.playSound();
            RPM.gameStack.pop();
        }
        */
    }

    // -------------------------------------------------------
    /** Handle scene pressed and repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedAndRepeat(key)
    {
        /*
        this.windowChoicesSlots.onKeyPressedAndRepeat(key);
        this.updateInformations.call(this, this.windowChoicesSlots
            .currentSelectedIndex);
            */
           return true;
    }

    // -------------------------------------------------------
    /** Draw the HUD scene
    */
    drawHUD()
    {
        /*
        this.windowTop.draw();
        this.windowChoicesSlots.draw();
        this.windowInformations.draw();
        this.windowBot.draw();
        */
    }
}

export { SaveLoadGame }