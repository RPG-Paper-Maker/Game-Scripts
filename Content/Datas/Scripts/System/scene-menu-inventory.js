/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SceneMenuInventory : GameState
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing inventory.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Inventory" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for item informations.
*   @property {WindowChoices} windowChoicesList Window for each items.
*/
function SceneMenuInventory() {
    SceneGame.call(this);

    var menuKind;
    var i, l;

    // Initializing the top menu for item kinds
    menuKind = [
        new GraphicText("All"),
        new GraphicText("Consumables"),
        new GraphicText($datasGame.system.itemsTypes[1]),
        new GraphicText($datasGame.system.itemsTypes[2]),
        new GraphicText("Weapons"),
        new GraphicText("Armors")
    ];

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30,
                                   new GraphicText("Inventory"));
    this.windowChoicesTabs = new WindowTabs(OrientationWindow.Horizontal, 5, 60,
        105, RPM.SMALL_SLOT_HEIGHT, 6, menuKind, null);
    this.windowChoicesList = new WindowChoices(OrientationWindow.Vertical, 20,
        100, 200, RPM.SMALL_SLOT_HEIGHT, SceneMenu.nbItemsToDisplay, [], null,
        RPM.SMALL_SLOT_PADDING);
    this.windowInformations = new WindowBox(240, 100, 360, 200, null, RPM
        .HUGE_PADDING_BOX);
    this.windowEmpty = new WindowBox(10, 100, $SCREEN_X - 20, RPM
        .SMALL_SLOT_HEIGHT, new GraphicText("Empty"), RPM.SMALL_SLOT_PADDING);
    l = menuKind.length;

    // Update for changing tab
    this.updateForTab();

    this.synchronize();
}

SceneMenuInventory.prototype = {

    /** Update informations to display.
    */
    synchronize: function(){
        this.windowInformations.content =
             this.windowChoicesList.getCurrentContent();
    },

    // -------------------------------------------------------

    /** Update tab.
    */
    updateForTab: function(){
        var i, list;
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        var nbItems = $game.items.length;

        list = [];
        for (i = 0; i < nbItems; i++){
            var ownedItem = $game.items[i];
            var item = $datasGame.items.list[ownedItem.id];
            if (indexTab === 0 ||
                (indexTab === 1 && (ownedItem.k === ItemKind.Item
                                    && item.consumable)) ||
                (indexTab === 2 && (ownedItem.k === ItemKind.Item
                                    && item.idType === 1)) ||
                (indexTab === 3 && (ownedItem.k === ItemKind.Item
                                    && item.idType === 2)) ||
                (indexTab === 4 && ownedItem.k === ItemKind.Weapon) ||
                (indexTab === 5 && ownedItem.k === ItemKind.Armor))
            {
                list.push(new GraphicItem(ownedItem));
            }
        }

        this.windowChoicesList.setContentsCallbacks(list);
    },

    // -------------------------------------------------------

    update: function() {

    },

    // -------------------------------------------------------

    onKeyPressed: function(key) {
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Cancel) ||
            DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.MainMenu))
        {
            $gameStack.pop();
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        // Tab
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
            this.updateForTab();
        }

        // List
        this.windowChoicesList.onKeyPressedAndRepeat(key);

        this.synchronize();
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
        this.windowChoicesList.draw(context);
        if (this.windowChoicesList.listWindows.length > 0) {
            this.windowInformations.draw(context);
        } else {
            this.windowEmpty.draw(context);
        }
    }
}
