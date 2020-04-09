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
//  CLASS SceneBattle
//
//  Step 1 :
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep1 = function() {
    this.battleCommandKind = EffectSpecialActionKind.None;
    this.windowTopInformations.content = new GraphicText("Select an ally", {
        align: Align.Center });
    this.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, 0);
    this.kindSelection = CharacterKind.Hero;
    this.attackingGroup = CharacterKind.Hero;
    this.userTarget = false;
    this.all = false;
    this.targets = [];
    var index = this.selectedUserTargetIndex();
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
        if (ownedItem.k === ItemKind.Item && item.consumable && (item
            .avaialableKind === AvailableKind.Battle || item.availableKind ===
            AvailableKind.Always))
        {
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

SceneBattle.prototype.selectTarget = function(targetKind) {
    this.subStep = 2;

    switch (targetKind) {
    case TargetKind.User:
        this.kindSelection = CharacterKind.Hero;
        this.userTarget = true;
        this.selectedTargetIndex = this.battlers[this.kindSelection].indexOf(
            this.user);
        break;
    case TargetKind.Enemy:
        this.kindSelection = CharacterKind.Monster;
        break;
    case TargetKind.Ally:
        this.kindSelection = CharacterKind.Hero;
        break;
    case TargetKind.AllEnemies:
        this.kindSelection = CharacterKind.Monster;
        this.all = true;
        break;
    case TargetKind.AllAllies:
        this.kindSelection = CharacterKind.Hero;
        this.all = true;
        break;
    }
    this.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero,
        this.selectedUserIndex);
    if (!this.userTarget) {
        this.selectedTargetIndex = this.selectFirstIndex(this.kindSelection, 0);
    }
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

    $datasGame.system.soundCursor.playSound();

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
    } while (!this.isDefined(this.kindSelection, index, this.subStep === 2));

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
    } while (!this.isDefined(this.kindSelection, index, this.subStep === 2));

    return index;
};

// -------------------------------------------------------

/** Move the arrow.
*/
SceneBattle.prototype.moveArrow = function() {
    var window, graphics;

    // Updating window informations
    window = this.subStep === 2 ? this.windowTargetInformations : this
        .windowUserInformations;
    graphics = this.graphicPlayers[this.kindSelection][this
        .selectedUserTargetIndex()];
    window.content = this.subStep === 2 ? graphics.target : graphics.user;
    window.content.update();

    $requestPaintHUD = true;
};

// -------------------------------------------------------

/** Return the index of the target.
*   @returns {number}
*/
SceneBattle.prototype.selectedUserTargetIndex = function() {
    return (this.subStep === 2) ? this.selectedTargetIndex : this
        .selectedUserIndex;
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep1 = function() {
    // NOTHIN TO UPDATE
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep1 = function(key) {
    var i, l;

    switch (this.subStep) {
    case 0:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            $datasGame.system.soundConfirmation.playSound();
            this.onAllySelected();
        }
        break;
    case 1:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            this.onCommandSelected(key);
        } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
            .menuControls.Cancel))
        {
            $datasGame.system.soundCancel.playSound();
            this.onAllyUnselected();
        }
        break;
    case 2:
        if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard.menuControls
            .Action))
        {
            $datasGame.system.soundConfirmation.playSound();
            this.onTargetsSelected();
        } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
            .menuControls.Cancel))
        {
            $datasGame.system.soundCancel.playSound();
            this.onTargetsUnselected();
        }
        break;
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onAllySelected = function() {
    var i, l;

    this.subStep = 1;
    this.user = this.battlers[CharacterKind.Hero][this.selectedUserIndex];
    this.user.setSelected(true);
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
    this.windowChoicesSkills.offsetSelectedIndex = this.user.lastSkillOffset;
    this.windowChoicesSkills.select(this.user.lastSkillIndex);
    this.windowChoicesItems.unselect();
    this.windowChoicesItems.offsetSelectedIndex = this.user.lastItemOffset;
    this.windowChoicesItems.select(this.user.lastItemIndex);

    $requestPaintHUD = true;
};

// -------------------------------------------------------

SceneBattle.prototype.onAllyUnselected = function() {
    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.OpenSkills:
        this.registerLastSkillIndex();
        break;
    case EffectSpecialActionKind.OpenItems:
        this.registerLastItemIndex();
        break;
    default:
        this.subStep = 0;
        this.user.setSelected(false);
        this.registerLastCommandIndex();
        break;
    }
    this.battleCommandKind = EffectSpecialActionKind.None;
};

// -------------------------------------------------------

SceneBattle.prototype.onCommandSelected = function(key) {
    var i, l;

    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.OpenSkills:
        if (this.windowChoicesSkills.getCurrentContent().skill.isPossible()) {
            this.selectTarget(this.windowSkillDescription.content.skill
                .targetKind);
            this.registerLastSkillIndex();
        }
        return;
    case EffectSpecialActionKind.OpenItems:
        this.selectTarget(this.windowItemDescription.content.item.targetKind);
        this.registerLastItemIndex();
        return;
    default:
        break;
    }
    this.windowChoicesBattleCommands.onKeyPressed(key, this
        .windowChoicesBattleCommands.getCurrentContent().skill);
    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.ApplyWeapons:
        var targetKind, equipments, gameItem;

        // Check weapon targetKind
        this.attackSkill = this.windowChoicesBattleCommands.getCurrentContent()
            .skill;
        targetKind = null;
        equipments = this.user.character.equip;
        for (i = 0, l = equipments.length; i < l; i++) {
            gameItem = equipments[i];
            if (gameItem && gameItem.k === ItemKind.Weapon) {
                targetKind = gameItem.getItemInformations().targetKind;
                break;
            }
        }
        // If no weapon
        if (targetKind === null) {
            targetKind = this.attackSkill.targetKind;
        }
        this.selectTarget(targetKind);
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
        this.transitionEnded = false;
        this.time = new Date().getTime();
        $songsManager.initializeProgressionMusic(SystemPlaySong
            .currentPlayingMusic.volume, 0, 0, SceneBattle
            .TIME_LINEAR_MUSIC_END);
        for (i = 0, l = this.battlers[CharacterKind.Hero].length; i < l; i++) {
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
};

// -------------------------------------------------------

SceneBattle.prototype.onTargetsSelected = function() {
    var i, l;

    if (this.all) {
        for (i = 0, l = this.battlers[this.kindSelection].length; i < l; i++) {
            this.targets.push(this.battlers[this.kindSelection][i]);
        }
    } else {
        this.targets.push(this.battlers[this.kindSelection][this
            .selectedUserTargetIndex()]);
    }
    this.windowChoicesBattleCommands.unselect();
    this.changeStep(2);
};

// -------------------------------------------------------

SceneBattle.prototype.onTargetsUnselected = function() {
    this.subStep = 1;
    this.kindSelection = CharacterKind.Hero;
    this.userTarget = false;
    this.all = false;
    this.moveArrow();
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
    switch (this.subStep) {
    case 0:
    case 2:
        if (!this.userTarget) {
            if (DatasKeyBoard.isKeyEqual(key,$datasGame.keyBoard.menuControls.Up
                ) || DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                .menuControls.Left))
            {
                index = this.indexArrowUp();
            } else if (DatasKeyBoard.isKeyEqual(key, $datasGame.keyBoard
                .menuControls.Down) || DatasKeyBoard.isKeyEqual(key, $datasGame
                .keyBoard.menuControls.Right))
            {
                index = this.indexArrowDown();
            }
        }

        if (this.subStep === 0) {
            if (this.selectedUserIndex !== index) {
                $datasGame.system.soundCursor.playSound();
            }
            this.selectedUserIndex = index;
        } else {
            if (this.selectedUserIndex !== index) {
                $datasGame.system.soundCursor.playSound();
            }
            this.selectedTargetIndex = index;
        }
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
    var i, l;

    this.windowTopInformations.draw();

    // Draw heroes window informations
    this.windowUserInformations.draw();
    if (this.subStep === 2) {
        this.windowTargetInformations.draw();
    }

    // Arrows
    if (this.all) {
        for (i = 0, l = this.battlers[this.kindSelection].length; i < l; i++) {
            this.battlers[this.kindSelection][i].drawArrow();
        }
    } else {
        this.battlers[this.kindSelection][this.selectedUserTargetIndex()]
            .drawArrow();
    }
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
