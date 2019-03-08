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
//  CLASS SceneBattle
//
//  Step 1 :
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep1 = function(){
    this.battleCommandKind = EffectSpecialActionKind.None;
    this.windowTopInformations.content = new GraphicText("Select an ally");
    this.selectedUserIndex = 0;
    this.kindSelection = CharacterKind.Hero;
    this.attackingGroup = CharacterKind.Hero;
    this.targets = [];
    var index = this.selectedUserTargetIndex();
    this.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, this
        .selectedUserIndex);
    this.selectedTargetIndex = this.selectFirstIndex(CharacterKind.Monster, this
        .selectedTargetIndex);
    this.windowCharacterInformations.setX($SCREEN_X - 300);
    this.moveArrow();
    this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
        .updateArrowPosition(this.camera);
    this.listSkills = [];
    this.listItems = [];

    // Items
    var ownedItem, item;
    for (var i = 0, l = $game.items.length; i < l; i++) {
        ownedItem = $game.items[i];
        item = $datasGame.items.list[ownedItem.id];
        if (ownedItem.k === ItemKind.Item && item.consumable) {
            this.listItems.push(new GraphicItem(ownedItem));
        }
    }
    this.windowChoicesItems.setContentsCallbacks(this.listItems);
    this.windowItemDescription.content = this.windowChoicesItems
        .getCurrentContent();
};

// -------------------------------------------------------

SceneBattle.prototype.registerLastCommandIndex = function() {
    this.user.lastCommandIndex = this.windowChoicesBattleCommands
        .currentSelectedIndex;
    this.user.lastCommandOffset = this.windowChoicesBattleCommands
        .offsetSelectedIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.registerLastSkillIndex = function() {
    this.user.lastSkillIndex = this.windowChoicesSkills.currentSelectedIndex;
    this.user.lastSkillOffset = this.windowChoicesSkills.offsetSelectedIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.registerLastItemIndex = function() {
    this.user.lastItemIndex = this.windowChoicesItems.currentSelectedIndex;
    this.user.lastItemOffset = this.windowChoicesItems.offsetSelectedIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.selectTarget = function() {
    this.subStep = 2;
    this.kindSelection = CharacterKind.Monster;
    this.windowCharacterInformations.setX(0);
    this.moveArrow();
};

// -------------------------------------------------------

SceneBattle.prototype.selectFirstIndex = function(kind, index) {
    while (!this.isDefined(kind, index)) {
        if (index < (this.battlers[kind].length - 1)) {
            index++;
        } else if (index === (this.battlers[kind].length - 1)) {
            index = 0;
        }
    }

    return index;
};

// -------------------------------------------------------

/** Return the index of the array after going up.
*   @returns {number}
*/
SceneBattle.prototype.indexArrowUp = function() {
    var index = this.selectedUserTargetIndex();
    do {
        if (index > 0)
            index--;
        else if (index === 0)
            index = this.battlers[this.kindSelection].length - 1;
    } while (!this.isDefined(this.kindSelection, index));

    return index;
};

// -------------------------------------------------------

/** Return the index of the array after going down.
*   @returns {number}
*/
SceneBattle.prototype.indexArrowDown = function() {
    var index = this.selectedUserTargetIndex();
    do {
        if (index < (this.battlers[this.kindSelection].length - 1))
            index++;
        else if (index === (this.battlers[this.kindSelection].length - 1))
            index = 0;
    } while (!this.isDefined(this.kindSelection, index));

    return index;
};

// -------------------------------------------------------

/** Move the arrow.
*/
SceneBattle.prototype.moveArrow = function() {

    // Updating window informations
    this.windowCharacterInformations.content = this.graphicPlayers[this
        .kindSelection][this.selectedUserTargetIndex()];
    this.windowCharacterInformations.content.update();
    $requestPaintHUD = true;
};

// -------------------------------------------------------

/** Return the index of the target.
*   @returns {number}
*/
SceneBattle.prototype.selectedUserTargetIndex = function(){
    return (this.subStep === 2) ? this.selectedTargetIndex : this
        .selectedUserIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep1 = function(){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep1 = function(key) {
    var i, l;

    switch (this.subStep) {
    case 0:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            this.subStep = 1;
            this.user = this.battlers[CharacterKind.Hero][this.selectedUserIndex];
            this.user.selected = true;
            this.windowChoicesBattleCommands.unselect();
            this.windowChoicesBattleCommands.select(this.user.lastCommandIndex);
            this.windowChoicesBattleCommands.offsetSelectedIndex = this.user
                .lastCommandOffset;

            // Update skills list
            var skills = this.user.character.sk;
            var ownedSkill, availableKind;
            this.listSkills = [];
            for (i = 0, l = skills.length; i < l; i++) {
                ownedSkill = skills[i];
                availableKind = $datasGame.skills.list[ownedSkill.id]
                    .availableKind;
                if (availableKind === AvailableKind.Always || availableKind
                    === AvailableKind.Battle)
                {
                    this.listSkills.push(new GraphicSkill(ownedSkill));
                }
            }
            this.windowChoicesSkills.setContentsCallbacks(this.listSkills);
            this.windowSkillDescription.content = this.windowChoicesSkills
                .getCurrentContent();
            this.windowChoicesSkills.unselect();
            this.windowChoicesSkills.offsetSelectedIndex = this.user
                .lastSkillOffset;
            this.windowChoicesSkills.select(this.user.lastSkillIndex);
            this.windowChoicesItems.unselect();
            this.windowChoicesItems.offsetSelectedIndex = this.user
                .lastItemOffset;
            this.windowChoicesItems.select(this.user.lastItemIndex);

            $requestPaintHUD = true;
        }
        break;
    case 1:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            switch (this.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                this.selectTarget();
                this.registerLastSkillIndex();
                return;
            case EffectSpecialActionKind.OpenItems:
                this.selectTarget();
                this.registerLastItemIndex();
                return;
            default:
                break;
            }
            this.windowChoicesBattleCommands.onKeyPressed(key, this
                .windowChoicesBattleCommands.getCurrentContent().skill);
            switch (this.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                this.selectTarget();
                this.attackSkill = this.windowChoicesBattleCommands
                    .getCurrentContent().skill;
                break;
            case EffectSpecialActionKind.OpenSkills:
                if (this.listSkills.length === 0) {
                    this.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.OpenItems:
                if (this.listItems.length === 0) {
                    this.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.Escape:
                this.step = 4;
                this.subStep = 3;
                for (i = 0, l = this.battlers[CharacterKind.Hero].length; i < l;
                     i++)
                {
                    this.battlers[CharacterKind.Hero][i].setEscaping();
                }
                return;
            case EffectSpecialActionKind.EndTurn:
                this.windowChoicesBattleCommands.unselect();
                this.changeStep(2);
                return;
            default:
                break;
            }
            this.registerLastCommandIndex();
        } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
            .menuControls.Cancel))
        {
            switch (this.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                this.registerLastSkillIndex();
                break;
            case EffectSpecialActionKind.OpenItems:
                this.registerLastItemIndex();
                break;
            default:
                this.subStep = 0;
                this.user.selected = false;
                this.registerLastCommandIndex();
                break;
            }
            this.battleCommandKind = EffectSpecialActionKind.None;
        }
        break;
    case 2:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            this.targets.push(this.battlers[this.kindSelection][this
                .selectedUserTargetIndex()]);
            this.windowChoicesBattleCommands.unselect();
            this.changeStep(2);
        } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
            .menuControls.Cancel))
        {
            this.subStep = 1;
            this.kindSelection = CharacterKind.Hero;
            this.windowCharacterInformations.setX($SCREEN_X - 300);
            this.moveArrow();
        }
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep1 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep1 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep1 = function(key){
    var index = this.selectedUserTargetIndex();
    switch (this.subStep){
    case 0:
    case 2:
        if (DatasKeyBoard.isKeyEqual(key,$datasGame.keyBoard.menuControls.Up) ||
            DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls.Left))
        {
            index = this.indexArrowUp();
        }
        else if
        (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls.Down) ||
         DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls.Right))
        {
            index = this.indexArrowDown();
        }

        if (this.subStep === 0)
            this.selectedUserIndex = index;
        else
            this.selectedTargetIndex = index;
        this.moveArrow();

        break;
    case 1:
        switch (this.battleCommandKind) {
        case EffectSpecialActionKind.OpenSkills:
            this.windowChoicesSkills.onKeyPressedAndRepeat(key);
            this.windowSkillDescription.content = this.windowChoicesSkills
                .getCurrentContent();
            break;
        case EffectSpecialActionKind.OpenItems:
            this.windowChoicesItems.onKeyPressedAndRepeat(key);
            this.windowItemDescription.content = this.windowChoicesItems
                .getCurrentContent();
            break;
        default:
            this.windowChoicesBattleCommands.onKeyPressedAndRepeat(key);
            break;
        }
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep1 = function() {
    this.windowTopInformations.draw();

    // Draw heroes window informations
    this.windowCharacterInformations.draw();

    // Arrows
    this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
        .drawArrow();

    // Commands
    if (this.subStep === 1) {
        this.windowChoicesBattleCommands.draw();
        switch (this.battleCommandKind) {
        case EffectSpecialActionKind.OpenSkills:
            this.windowChoicesSkills.draw();
            this.windowSkillDescription.draw();
            break;
        case EffectSpecialActionKind.OpenItems:
            this.windowChoicesItems.draw();
            this.windowItemDescription.draw();
            break;
        }
    }
};
