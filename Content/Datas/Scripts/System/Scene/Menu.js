/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Scene, Manager } from "../index.js";
/** @class
*   A scene for the main menu
*   @extends SceneGame
*   @property {WindowChoices} [SceneMenunbItemsToDisplay=12] The number of
*   slots to display
*   @property {number} selectedOrder Index of the selected hero to order
*   @property {WindowChoices} windowChoicesCommands The window choices for
*   choosing a command
*   @property {WindowChoices} windowChoicesTeam The window for displaying
*   informations about team
*   @property {WindowBox} windowTimeCurrencies The window for displaying time
*   and currencies
*   @property {number} selectedOrder Index of the selected hero to order
*/
class Menu extends Base {
    constructor() {
        super(false);
        /*
        RPM.isInMainMenu = true;

        // Initializing order index
        this.selectedOrder = -1;

        // Initializing the left menu commands (texts and actions)
        let menuCommands = [
            new GraphicText("Inventory", { align: Align.Center }),
            new GraphicText("Skills", { align: Align.Center }),
            new GraphicText("Equip", { align: Align.Center }),
            new GraphicText("State", { align: Align.Center }),
            new GraphicText("Order", { align: Align.Center }),
            new GraphicText("Save", { align: Align.Center }),
            new GraphicText("Quit", { align: Align.Center })
        ];
        let menuCommandsActions = [
            SceneMenu.prototype.openInventory,
            SceneMenu.prototype.openSkills,
            SceneMenu.prototype.openEquip,
            SceneMenu.prototype.openState,
            SceneMenu.prototype.openOrder,
            SceneMenu.prototype.openSave,
            SceneMenu.prototype.exit
        ];

        // Initializing graphics for displaying heroes informations
        let nbHeroes = RPM.game.teamHeroes.length;
        let graphicsHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++)
        {
            graphicsHeroes[i] = new GraphicPlayer(RPM.game.teamHeroes[i]);
        }

        // All the windows
        this.windowChoicesCommands = new WindowChoices(20, 20, 150, RPM
            .MEDIUM_SLOT_HEIGHT, menuCommands,
            {
                nbItemsMax: menuCommands.length,
                listCallbacks: menuCommandsActions,
                padding: [0, 0, 0, 0]
            }
        );
        this.windowChoicesTeam = new WindowChoices(190, 20, 430, 95,
            graphicsHeroes,
            {
                nbItemsMax: 4,
                padding: RPM.VERY_SMALL_PADDING_BOX,
                space: 15,
                currentSelectedIndex: -1
            }
        );
        this.windowTimeCurrencies = new WindowBox(20, 0, 150, 0,
            {
                content: new GraphicTimeCurrencies(),
                padding: RPM.HUGE_PADDING_BOX
            }
        );
        let h = this.windowTimeCurrencies.content.height + this
            .windowTimeCurrencies.padding[1] + this.windowTimeCurrencies
            .padding[3];
        this.windowTimeCurrencies.setY(RPM.SCREEN_Y - 20 - h);
        this.windowTimeCurrencies.setH(h);

        // Play a sound when opening the menu
        RPM.datasGame.system.soundCursor.playSound();
        */
    }
    // -------------------------------------------------------
    /** Callback function for opening inventory
    */
    openInventory() {
        /*
        RPM.gameStack.push(new SceneMenuInventory());
        return true;
        */
    }
    // -------------------------------------------------------
    /** Callback function for opening skills menu
    */
    openSkills() {
        /*
        RPM.gameStack.push(new SceneMenuSkills());
        return true;
        */
    }
    // -------------------------------------------------------
    /** Callback function for opening equipment menu
    */
    openEquip() {
        /*
        RPM.gameStack.push(new SceneMenuEquip());
        return true;
        */
    }
    // -------------------------------------------------------
    /** Callback function for opening player description state menu
    */
    openState() {
        /*
        RPM.gameStack.push(new SceneDescriptionState());
        return true;
        */
    }
    // -------------------------------------------------------
    /** Callback function for reordering heroes
    */
    openOrder() {
        /*
        this.windowChoicesTeam.select(0);
        return true;
        */
    }
    // -------------------------------------------------------
    /** Callback function for opening save menu
    */
    openSave() {
        /*
        if (RPM.allowSaves)
        {
            RPM.gameStack.push(new SceneSaveGame());
            return true;
        }
        return false;
        */
    }
    // -------------------------------------------------------
    /** Callback function for quiting the game
    */
    exit() {
        /*
        RPM.gameStack.replace(new SceneTitleScreen());
        return true;
        */
    }
    // -------------------------------------------------------
    /** Update the scene
    */
    update() {
        /*
        SceneGame.prototype.update.call(RPM.currentMap);

        this.windowTimeCurrencies.content.update();
        for (let i = 0, l = this.windowChoicesTeam.listWindows.length; i < l;
            i++)
        {
            this.windowChoicesTeam.listWindows[i].content.updateBattler();
        }
        */
    }
    // -------------------------------------------------------
    /** Handle scene key pressed
    *   @param {number} key The key ID
    */
    onKeyPressed(key) {
        /*
        SceneGame.prototype.onKeyPressed.call(RPM.currentMap, key);

        if (this.windowChoicesTeam.currentSelectedIndex === -1)
        {
            this.windowChoicesCommands.onKeyPressed(key, this);

            // Quit the menu if cancelling + in window command
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                RPM.gameStack.pop();
            }
        } else
        {
            // If in reorder team window
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                    .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                this.windowChoicesTeam.unselect();
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                RPM.datasGame.system.soundConfirmation.playSound();

                // If selecting the first hero to interchange
                if (this.selectedOrder === -1)
                {
                    this.selectedOrder = this.windowChoicesTeam
                        .currentSelectedIndex;
                    this.windowChoicesTeam.listWindows[this.selectedOrder].color
                        = "#ff4d4d";
                } else
                {   // If a hero is selected, interchange now !
                    // Change the current game order
                    let item1 = RPM.game.teamHeroes[this.selectedOrder];
                    let item2 = RPM.game.teamHeroes[this.windowChoicesTeam
                        .currentSelectedIndex];
                    RPM.game.teamHeroes[this.selectedOrder] = item2;
                    RPM.game.teamHeroes[this.windowChoicesTeam
                        .currentSelectedIndex] = item1;
                    item1 = this.windowChoicesTeam.getContent(this.selectedOrder);
                    item2 = this.windowChoicesTeam.getContent(this
                        .windowChoicesTeam.currentSelectedIndex);
                    this.windowChoicesTeam.setContent(this.selectedOrder, item2);
                    this.windowChoicesTeam.setContent(this.windowChoicesTeam
                        .currentSelectedIndex, item1);

                    // Change background color
                    this.windowChoicesTeam.listWindows[this.selectedOrder]
                        .selected = false;
                    this.selectedOrder = -1;
                    this.windowChoicesTeam.select(this.windowChoicesTeam
                        .currentSelectedIndex);
                }
            }
        }
        */
    }
    // -------------------------------------------------------
    /** Handle scene key released
    *   @param {number} key The key ID
    */
    onKeyReleased(key) {
        //SceneGame.prototype.onKeyReleased.call(RPM.currentMap, key);
    }
    // -------------------------------------------------------
    /** Handle scene pressed repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedRepeat(key) {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Manager.Stack
            .currentMap, key);
    }
    // -------------------------------------------------------
    /** Handle scene pressed and repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedAndRepeat(key) {
        return true;
        /*
        SceneGame.prototype.onKeyPressedAndRepeat.call(RPM.currentMap, key);

        if (this.windowChoicesTeam.currentSelectedIndex === -1)
        {
            this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        } else
        {
            this.windowChoicesTeam.onKeyPressedAndRepeat(key);
            if (this.selectedOrder !== -1)
            {
                this.windowChoicesTeam.listWindows[this.selectedOrder].color
                    = "#ff4d4d";
            }
        }
        */
    }
    // -------------------------------------------------------
    /** Draw the 3D scene
    */
    draw3D() {
        //RPM.currentMap.draw3D();
    }
    // -------------------------------------------------------
    /** Draw the HUD scene
    */
    drawHUD() {
        /*
        // Draw the local map behind
        RPM.currentMap.drawHUD();

        // Draw the windows
        this.windowChoicesCommands.draw();
        this.windowChoicesTeam.draw();

        // Draw play time and currencies
        this.windowTimeCurrencies.draw();
        */
    }
    // -------------------------------------------------------
    /** Close the scene
    */
    close() {
        //RPM.isInMainMenu = false;
    }
}
Menu.nbItemsToDisplay = 12;
export { Menu };
