/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SceneMenu : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the main menu.
*   @extends SceneGame
*   @property {WindowChoices} windowChoicesCommands A window choices for
*   choosing a command.
*   @property {WindowChoices} windowChoicesTeam A Window for displaying
*   informations about team.
*   @property {GraphicText} textPlayTime A text for displaying play time.
*   @property {number} selectedOrder Index of the selected hero to order.
*/
function SceneMenu() {
    SceneGame.call(this);

    var menuCommands, menuCommandsActions;
    var i, nbHeroes;
    var graphicsHeroes;

    // Initializing order index
    this.selectedOrder = -1;

    // Initializing the left menu commands (texts and actions)
    menuCommands = [
        new GraphicText("Inventory", { align: Align.Center }),
        new GraphicText("Skills", { align: Align.Center }),
        new GraphicText("Equip", { align: Align.Center }),
        new GraphicText("State", { align: Align.Center }),
        new GraphicText("Order", { align: Align.Center }),
        new GraphicText("Save", { align: Align.Center }),
        new GraphicText("Quit", { align: Align.Center })
    ];
    menuCommandsActions = [
        SceneMenu.prototype.openInventory,
        SceneMenu.prototype.openSkills,
        SceneMenu.prototype.openEquip,
        SceneMenu.prototype.openState,
        SceneMenu.prototype.openOrder,
        SceneMenu.prototype.openSave,
        SceneMenu.prototype.exit
    ];

    // Initializing graphics for displaying heroes informations
    nbHeroes = $game.teamHeroes.length;
    graphicsHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++) {
        graphicsHeroes[i] = new GraphicPlayer($game.teamHeroes[i]);
    }

    // All the windows
    this.windowChoicesCommands = new WindowChoices(OrientationWindow.Vertical,
        20, 20, 150, RPM.MEDIUM_SLOT_HEIGHT, menuCommands.length, menuCommands,
        menuCommandsActions);
    this.windowChoicesTeam = new WindowTabs(OrientationWindow.Vertical, 190, 20,
        430, 95, 4, graphicsHeroes, null, [5,5,5,5], 15, -1);
    this.windowTimeCurrencies = new WindowBox(20, 0, 150, 0, new
        GraphicTimeCurrencies(), RPM.HUGE_PADDING_BOX);
    this.windowTimeCurrencies.contentLoaded = false;

    // Play a sound when opening the menu
    $datasGame.system.soundCursor.playSound();
}

SceneMenu.nbItemsToDisplay = 12;

SceneMenu.prototype = {

    /** Callback function for opening inventory.
    */
    openInventory: function(){
        $gameStack.push(new SceneMenuInventory());

        return true;
    },

    // -------------------------------------------------------

    /** Callback function for opening skills menu.
    */
    openSkills: function(){
        $gameStack.push(new SceneMenuSkills());

        return true;
    },

    // -------------------------------------------------------

    /** Callback function for opening equipment menu.
    */
    openEquip: function(){
        $gameStack.push(new SceneMenuEquip());

        return true;
    },

    // -------------------------------------------------------

    /** Callback function for opening player description state menu.
    */
    openState: function(){
        $gameStack.push(new SceneDescriptionState());

        return true;
    },

    // -------------------------------------------------------

    /** Callback function for reordering heroes.
    */
    openOrder: function(){
        this.windowChoicesTeam.select(0);

        return true;
    },

    // -------------------------------------------------------

    /** Callback function for opening save menu.
    */
    openSave: function() {
        if ($allowSaves) {
            $gameStack.push(new SceneSaveGame());
            return true;
        }

        return false;
    },

    // -------------------------------------------------------

    /** Callback function for quiting the game.
    */
    exit: function(){
        $gameStack.pop();
        $gameStack.push(new SceneTitleScreen());

        return true;
    },

     // -------------------------------------------------------

    update: function() {
        var i, l, w;

        if (!this.windowTimeCurrencies.contentLoaded && this
            .windowTimeCurrencies.content.isLoaded())
        {
            w = this.windowTimeCurrencies.content.height + this
                .windowTimeCurrencies.padding[1] + this.windowTimeCurrencies
                .padding[3];
            this.windowTimeCurrencies.setY($SCREEN_Y - 20 - w);
            this.windowTimeCurrencies.setH(w);
            this.windowTimeCurrencies.contentLoaded = true;
        }

        this.windowTimeCurrencies.content.update();
        for (i = 0, l = this.windowChoicesTeam.listWindows.length; i < l; i++) {
            this.windowChoicesTeam.listWindows[i].content.updateBattler();
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (this.windowChoicesTeam.currentSelectedIndex === -1){
            this.windowChoicesCommands.onKeyPressed(key, this);

            // Quit the menu if cancelling + in window command
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
            {
                $datasGame.system.soundCancel.playSound();
                $gameStack.pop();
            }
        }
        else{

            // If in reorder team window
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
            {
                $datasGame.system.soundCancel.playSound();
                this.windowChoicesTeam.unselect();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                $datasGame.system.soundConfirmation.playSound();

                // If selecting the first hero to interchange
                if (this.selectedOrder === -1){
                    this.selectedOrder =
                         this.windowChoicesTeam.currentSelectedIndex;
                    this.windowChoicesTeam.listWindows[this.selectedOrder].color
                         = "#ff4d4d";
                }
                // If a hero is selected, interchange now !
                else{
                    var item1, item2;

                    // Change the current game order
                    item1 = $game.teamHeroes[this.selectedOrder];
                    item2 = $game.teamHeroes
                            [this.windowChoicesTeam.currentSelectedIndex];
                    $game.teamHeroes[this.selectedOrder] = item2;
                    $game.teamHeroes
                            [this.windowChoicesTeam.currentSelectedIndex]
                            = item1;
                    item1 =
                            this.windowChoicesTeam.getContent(
                                this.selectedOrder);
                    item2 =
                            this.windowChoicesTeam.getContent(
                                this.windowChoicesTeam.currentSelectedIndex);
                    this.windowChoicesTeam
                    .setContent(this.selectedOrder, item2);
                    this.windowChoicesTeam
                    .setContent(this.windowChoicesTeam.currentSelectedIndex,
                                item1);

                    // Change background color
                    this.windowChoicesTeam.listWindows[this.selectedOrder]
                        .selected = false;
                    this.selectedOrder = -1;
                    this.windowChoicesTeam
                    .select(this.windowChoicesTeam.currentSelectedIndex);
                }
            }
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        if (this.windowChoicesTeam.currentSelectedIndex === -1)
            this.windowChoicesCommands.onKeyPressedAndRepeat(key);
        else{
            this.windowChoicesTeam.onKeyPressedAndRepeat(key);
            if (this.selectedOrder !== -1){
                this.windowChoicesTeam.listWindows[this.selectedOrder].color
                     = "#ff4d4d";
            }
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function() {
        if (this.windowTimeCurrencies.contentLoaded) {
            // Draw the local map behind
            $currentMap.drawHUD();

            // Draw the windows
            this.windowChoicesCommands.draw();
            this.windowChoicesTeam.draw();

            // Draw play time and currencies
            this.windowTimeCurrencies.draw();
        }
    }
}
