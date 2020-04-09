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
//  CLASS SceneMenuEquip : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players equipments.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Equip" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for equip stats
*   informations.
*   @property {WindowChoices} windowChoicesEquipment Window for each equipment
*   slot.
*   @property {WindowChoices} windowChoicesList Window for each weapon/armor.
*   @property {number} selectedEquipment Index of selected equipment.
*/
function SceneMenuEquip() {
    SceneGame.call(this);

    var nbHeroes, nbEquipments, nbEquipChoice, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // Equipment
    nbEquipments = $datasGame.battleSystem.equipments.length - 1;
    nbEquipChoice = SceneMenu.nbItemsToDisplay - nbEquipments - 1;

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("Equip", {
        align: Align.Center }));
    this.windowChoicesTabs = new WindowTabs(OrientationWindow.Horizontal, 50,
        60, 110, RPM.SMALL_SLOT_HEIGHT, 4, listHeroes, null);
    this.windowChoicesEquipment = new WindowChoices(OrientationWindow.Vertical,
        20, 100, 290, RPM.SMALL_SLOT_HEIGHT, nbEquipments, new Array(
        nbEquipments), null, RPM.SMALL_SLOT_PADDING);
    this.windowChoicesList = new WindowChoices(OrientationWindow.Vertical, 20,
        100 + (nbEquipments + 1) * RPM.SMALL_SLOT_HEIGHT, 290, RPM
        .SMALL_SLOT_HEIGHT, nbEquipChoice, [], null, RPM.SMALL_SLOT_PADDING, 0,
        -1);
    this.windowInformations = new WindowBox(330, 100, 285, 350, null, RPM
        .SMALL_PADDING_BOX);

    // Updates
    this.updateForTab();
    this.updateEquipmentList();
    this.updateInformations();
}

SceneMenuEquip.prototype = {

    /** Update tab.
    */
    updateForTab: function(){
        var equipLength, i, l;
        var list;

        // update equipment
        equipLength = GamePlayer.getEquipmentLength();
        l = $datasGame.battleSystem.equipmentsOrder.length;
        list = new Array(l);
        for (i = 0; i < l; i++){
            list[i] =
                    new GraphicEquip(
                        $game.teamHeroes
                        [this.windowChoicesTabs.currentSelectedIndex],
                        $datasGame.battleSystem.equipmentsOrder[i],
                        equipLength);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        this.updateEquipmentList();
        this.updateInformations();
    },

    // -------------------------------------------------------

    /** Update the equipment list.
    */
    updateEquipmentList: function(){
        var idEquipment, nb, i, l, c, ll, k, lll, nbItem;
        var list, type, systemItem, item, character;

        idEquipment = $datasGame.battleSystem.equipmentsOrder
                [this.windowChoicesEquipment.currentSelectedIndex];
        nb = this.windowChoicesList.listWindows.length;
        list = [new GraphicText("[Remove]")];
        for (i = 0, l = $game.items.length; i < l; i++){
            item = $game.items[i];
            if (item.k !== ItemKind.Item) {
                systemItem = item.getItemInformations();
                type = systemItem.getType();
                if (type.equipments[idEquipment]) {
                    nbItem = item.nb;
                    if (nbItem > 0){
                        list.push(new GraphicItem(item, nbItem));
                    }
                }
            }
        }

        // Set contents
        this.windowChoicesList.setContentsCallbacks(list, null, -1);
    },

    // -------------------------------------------------------

    /** Update the informations to display for equipment stats.
    */
    updateInformations: function(){
        var result, gamePlayer, item;
        var i, j, k, l, ll;

        gamePlayer = $game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1)
            this.list = [];
        else{
            item = this.windowChoicesList.getCurrentContent();

            if (item === null) {
                this.list = [];
            } else {
                result = gamePlayer.getEquipmentStatsAndBonus(item.item,
                    $datasGame.battleSystem.equipmentsOrder[this
                    .windowChoicesEquipment.currentSelectedIndex]);
                this.list = result[0];
                this.bonus = result[1];
            }
        }

        this.windowInformations.content = new GraphicEquipStats(gamePlayer, this
            .list);
    },

    /** Remove the equipment of the character.
    */
    remove: function(){
        var i, l, character, id, prev, item;

        character = $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex];
        id = $datasGame.battleSystem.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        prev = character.equip[id];
        character.equip[id] = null;
        if (prev) {
            prev.add(1);
        }

        this.updateStats();
    },

    // -------------------------------------------------------

    /** Equip the selected equipment.
    */
    equip: function() {
        var i, l, gameItem, item, index, character, id, prev;

        index = this.windowChoicesTabs.currentSelectedIndex;
        character = $game.teamHeroes[index];
        gameItem = this.windowChoicesList.getCurrentContent().gameItem;
        id = $datasGame.battleSystem.equipmentsOrder[this.windowChoicesEquipment
            .currentSelectedIndex];
        prev = character.equip[id];
        character.equip[id] = gameItem;

        // Remove one equip from inventory
        for (i = 0, l = $game.items.length; i < l; i++) {
            item = $game.items[i];
            if (item.k === gameItem.k && item.id === gameItem.id) {
                item.remove(1);
            }
        }
        if (prev) {
            prev.add(1);
        }

        this.updateStats();
    },

    // -------------------------------------------------------

    updateStats: function() {
        $game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex]
            .updateEquipmentStats(this.list, this.bonus);
    },

    // -------------------------------------------------------

    update: function(){

    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (this.selectedEquipment === -1){
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                $datasGame.system.soundCancel.playSound();
                $gameStack.pop();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                $datasGame.system.soundConfirmation.playSound();
                this.selectedEquipment =
                     this.windowChoicesEquipment.currentSelectedIndex;
                this.windowChoicesList.currentSelectedIndex = 0;
                this.updateInformations();
                this.windowChoicesList.selectCurrent();
            }
        }
        else{
            if (DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.menuControls
                                         .Cancel) ||
                DatasKeyBoard.isKeyEqual(key,
                                         $datasGame.keyBoard.MainMenu))
            {
                $datasGame.system.soundCancel.playSound();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            }
            else if (DatasKeyBoard.isKeyEqual(key,
                                              $datasGame.keyBoard.menuControls
                                              .Action))
            {
                if (this.windowChoicesList.getCurrentContent() !== null){
                    $datasGame.system.soundConfirmation.playSound();
                    if (this.windowChoicesList.currentSelectedIndex === 0)
                        this.remove();
                    else
                        this.equip();
                    this.selectedEquipment = -1;
                    this.windowChoicesList.unselect();
                    this.updateForTab();
                } else {
                    $datasGame.system.soundImpossible.playSound();
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

        // Tab
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
            this.updateForTab();

        // Equipment
        if (this.selectedEquipment === -1){
            var indexEquipment =
                    this.windowChoicesEquipment.currentSelectedIndex;
            this.windowChoicesEquipment.onKeyPressedAndRepeat(key);
            if (indexEquipment !==
                    this.windowChoicesEquipment.currentSelectedIndex)
                this.updateEquipmentList();
        }
        else{
            var indexList = this.windowChoicesList.currentSelectedIndex;
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            if (indexList !== this.windowChoicesList.currentSelectedIndex)
                this.updateInformations();
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function(context){

        // Draw the local map behind
        $currentMap.drawHUD(context);

        // Draw the menu
        this.windowTop.draw(context);
        this.windowChoicesTabs.draw(context);
        this.windowChoicesEquipment.draw(context);
        this.windowChoicesList.draw(context);
        this.windowInformations.draw(context);
    }
}
