/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { Scene, Manager, Graphic, Datas } from "../index.js";
import { Enum, ScreenResolution } from "../Common/index.js";
var Align = Enum.Align;
import { WindowChoices, WindowBox } from "../Core/index.js";
;
/** @class
 *  A scene for the main menu.
 *  @extends Scene.Base
 */
class Menu extends Base {
    constructor() {
        super(false);
        Manager.Stack.isInMainMenu = true;
        // Initializing order index
        this.selectedOrder = -1;
        // Initializing the left menu commands (texts and actions)
        let menuCommands = [
            new Graphic.Text("Inventory", { align: Align.Center }),
            new Graphic.Text("Skills", { align: Align.Center }),
            new Graphic.Text("Equip", { align: Align.Center }),
            new Graphic.Text("State", { align: Align.Center }),
            new Graphic.Text("Order", { align: Align.Center }),
            new Graphic.Text("Save", { align: Align.Center }),
            new Graphic.Text("Quit", { align: Align.Center })
        ];
        let menuCommandsActions = [
            Scene.Menu.prototype.openInventory,
            Scene.Menu.prototype.openSkills,
            Scene.Menu.prototype.openEquip,
            Scene.Menu.prototype.openState,
            Scene.Menu.prototype.openOrder,
            Scene.Menu.prototype.openSave,
            Scene.Menu.prototype.exit
        ];
        // Initializing graphics for displaying heroes informations
        let nbHeroes = Manager.Stack.game.teamHeroes.length;
        let graphicsHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            graphicsHeroes[i] = new Graphic.Player(Manager.Stack.game.teamHeroes[i]);
        }
        // All the windows
        this.windowChoicesCommands = new WindowChoices(20, 20, 150, WindowBox
            .MEDIUM_SLOT_HEIGHT, menuCommands, {
            nbItemsMax: menuCommands.length,
            listCallbacks: menuCommandsActions,
            padding: [0, 0, 0, 0]
        });
        this.windowChoicesTeam = new WindowChoices(190, 20, 430, 95, graphicsHeroes, {
            nbItemsMax: 4,
            padding: WindowBox.VERY_SMALL_PADDING_BOX,
            space: 15,
            currentSelectedIndex: -1
        });
        this.windowTimeCurrencies = new WindowBox(20, 0, 150, 0, {
            content: new Graphic.TimeCurrencies(),
            padding: WindowBox.HUGE_PADDING_BOX
        });
        let h = this.windowTimeCurrencies.content
            .height + this.windowTimeCurrencies.padding[1] + this
            .windowTimeCurrencies.padding[3];
        this.windowTimeCurrencies.setY(ScreenResolution.SCREEN_Y - 20 - h);
        this.windowTimeCurrencies.setH(h);
        // Play a sound when opening the menu
        Datas.Systems.soundCursor.playSound();
    }
    /**
     *  Callback function for opening inventory.
     */
    openInventory() {
        Manager.Stack.push(new Scene.MenuInventory());
        return true;
    }
    /**
     *  Callback function for opening skills menu.
     */
    openSkills() {
        Manager.Stack.push(new Scene.MenuSkills());
        return true;
    }
    /**
     *  Callback function for opening equipment menu.
     */
    openEquip() {
        Manager.Stack.push(new Scene.MenuEquip());
        return true;
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
    /**
     *  Callback function for reordering heroes.
     */
    openOrder() {
        this.windowChoicesTeam.select(0);
        return true;
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
    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Manager.Stack.currentMap);
        this.windowTimeCurrencies.content.update();
        for (let i = 0, l = this.windowChoicesTeam.listWindows.length; i < l; i++) {
            this.windowChoicesTeam.listWindows[i].content
                .updateBattler();
        }
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key) {
        Scene.Base.prototype.onKeyPressed.call(Manager.Stack.currentMap, key);
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            this.windowChoicesCommands.onKeyPressed(key, this);
            // Quit the menu if cancelling + in window command
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .controls.MainMenu)) {
                Datas.Systems.soundCancel.playSound();
                Manager.Stack.pop();
            }
        }
        else {
            // If in reorder team window
            if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                .Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .controls.MainMenu)) {
                Datas.Systems.soundCancel.playSound();
                this.windowChoicesTeam.unselect();
            }
            else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                .menuControls.Action)) {
                Datas.Systems.soundConfirmation.playSound();
                // If selecting the first hero to interchange
                if (this.selectedOrder === -1) {
                    this.selectedOrder = this.windowChoicesTeam
                        .currentSelectedIndex;
                }
                else {
                    // If a hero is selected, interchange now !
                    // Change the current game order
                    let item1 = Manager.Stack.game.teamHeroes[this.selectedOrder];
                    let item2 = Manager.Stack.game.teamHeroes[this
                        .windowChoicesTeam.currentSelectedIndex];
                    Manager.Stack.game.teamHeroes[this.selectedOrder] = item2;
                    Manager.Stack.game.teamHeroes[this.windowChoicesTeam
                        .currentSelectedIndex] = item1;
                    let graphic1 = this.windowChoicesTeam.getContent(this
                        .selectedOrder);
                    let graphic2 = this.windowChoicesTeam.getContent(this
                        .windowChoicesTeam.currentSelectedIndex);
                    this.windowChoicesTeam.setContent(this.selectedOrder, graphic2);
                    this.windowChoicesTeam.setContent(this.windowChoicesTeam
                        .currentSelectedIndex, graphic1);
                    // Change background color
                    this.windowChoicesTeam.listWindows[this.selectedOrder]
                        .selected = false;
                    this.selectedOrder = -1;
                    this.windowChoicesTeam.select(this.windowChoicesTeam
                        .currentSelectedIndex);
                }
            }
        }
    }
    /**
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key) {
        Scene.Base.prototype.onKeyReleased.call(Manager.Stack.currentMap, key);
    }
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key) {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Manager.Stack
            .currentMap, key);
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        Scene.Base.prototype.onKeyPressedAndRepeat.call(Manager.Stack.currentMap, key);
        if (this.windowChoicesTeam.currentSelectedIndex === -1) {
            return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        }
        else {
            return this.windowChoicesTeam.onKeyPressedAndRepeat(key);
        }
    }
    /**
     *  Draw the HUD scene.
     */
    drawHUD() {
        // Draw the local map behind
        Manager.Stack.currentMap.drawHUD();
        // Draw the windows
        this.windowChoicesCommands.draw();
        this.windowChoicesTeam.draw();
        // Draw play time and currencies
        this.windowTimeCurrencies.draw();
    }
    /**
     *  Close the scene.
     */
    close() {
        Manager.Stack.isInMainMenu = false;
    }
}
Menu.SLOTS_TO_DISPLAY = 12;
export { Menu };
