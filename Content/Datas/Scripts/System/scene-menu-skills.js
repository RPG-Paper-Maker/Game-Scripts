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
//  CLASS SceneMenuSkills : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players skills.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Skills" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for skill informations.
*   @property {WindowChoices} windowChoicesList Window for each skill.
*/
function SceneMenuSkills() {
    SceneGame.call(this);

    var nbHeroes, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    this.positionChoice = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++) {
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);
        this.positionChoice[i] = {
            index: 0,
            offset: 0
        };
    }

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("Skills"));
    this.windowChoicesTabs = new WindowTabs(OrientationWindow.Horizontal, 50,
        60, 110, RPM.SMALL_SLOT_HEIGHT, 4, listHeroes, null);
    this.windowChoicesList = new WindowChoices(OrientationWindow.Vertical, 20,
        100, 200, RPM.SMALL_SLOT_HEIGHT, SceneMenu.nbItemsToDisplay, [], null,
        RPM.SMALL_SLOT_PADDING);
    this.windowInformations = new WindowBox(240, 100, 360, 200, null, RPM
        .HUGE_PADDING_BOX);
    this.windowEmpty = new WindowBox(10, 100, $SCREEN_X - 20, RPM
        .SMALL_SLOT_HEIGHT, new GraphicText("Empty"), RPM.SMALL_SLOT_PADDING);
    this.windowBoxUseSkill = new WindowBox(240, 320, 360, 140, new
        GraphicUserSkillItem(), RPM.SMALL_PADDING_BOX);

    // Update for changing tab
    this.substep = 0;
    this.updateForTab();

    this.synchronize();
}

SceneMenuSkills.prototype = {

    /** Synchronize informations with selected hero.
    */
    synchronize: function(){
        this.windowInformations.content =
             this.windowChoicesList.getCurrentContent();
    },

    // -------------------------------------------------------

    /** Update tab.
    */
    updateForTab: function(){
        var i, l;
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        $currentMap.user = $game.teamHeroes[indexTab];
        var skills = $currentMap.user.sk;
        var list;

        // Get the first skills of the hero
        list = [];
        for (i = 0, l = skills.length; i < l; i++) {
            list.push(new GraphicSkill(skills[i]));
        }

        // Update the list
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[
            indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
        $currentMap.user = $game.teamHeroes[indexTab];
    },

    // -------------------------------------------------------

    update: function(){
        if (this.windowChoicesList.currentSelectedIndex !== -1) {
            this.windowBoxUseSkill.update();
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        switch (this.substep) {
        case 0:
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                .Action))
            {
                var targetKind, availableKind;

                targetKind = this.windowInformations.content.skill.targetKind;
                availableKind = this.windowInformations.content.skill
                    .availableKind;
                if (this.windowInformations.content.skill.isPossible() && (
                    targetKind === TargetKind.Ally || targetKind === TargetKind
                    .AllAllies) && (availableKind === AvailableKind.Always ||
                    availableKind === AvailableKind.MainMenu))
                {
                    this.substep = 1;
                    this.windowBoxUseSkill.content.setAll(targetKind ===
                        TargetKind.AllAllies);
                    $requestPaintHUD = true;
                }
            } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key,
                $datasGame.keyBoard.MainMenu))
            {
                $currentMap.user = null;
                $gameStack.pop();
            }
            break;
        case 1:
            if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
                .Action))
            {
                if (this.windowInformations.content.skill.use()) {
                    this.windowBoxUseSkill.content.updateStats();
                    if (!this.windowInformations.content.skill.isPossible()) {
                        this.substep = 0;
                    }
                    $requestPaintHUD = true;
                }
            } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key,
                $datasGame.keyBoard.MainMenu))
            {
                this.substep = 0;
                $requestPaintHUD = true;
            }
            break;
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        switch (this.substep) {
        case 0:
            var position;

            // Tab
            var indexTab = this.windowChoicesTabs.currentSelectedIndex;
            this.windowChoicesTabs.onKeyPressedAndRepeat(key);
            if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
                this.updateForTab();

            // List
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            position = this.positionChoice[this.windowChoicesTabs
                .currentSelectedIndex];
            position.index = this.windowChoicesList.currentSelectedIndex;
            position.offset = this.windowChoicesList.offsetSelectedIndex;
            break;
        case 1:
            this.windowBoxUseSkill.content.onKeyPressedAndRepeat(key);
            break;
        }

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
            this.windowInformations.draw();
            if (this.substep === 1) {
                this.windowBoxUseSkill.draw();
            }
        } else {
            this.windowEmpty.draw();
        }
    }
}
