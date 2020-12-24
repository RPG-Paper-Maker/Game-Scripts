
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battle } from "./Battle";

// -------------------------------------------------------
//
//  CLASS BattleSelection
//
//  Step 1 :
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------
class BattleSelection {
    battle: Battle
    public constructor(battle: Battle) {
        this.battle = battle;
    }


    // -------------------------------------------------------
    /** Initialize step
    */
    public initialize() {
        // Check if everyone is dead to avoid infinite looping
        if (this.battle.isLose()) {
            this.battle.winning = false;
            this.battle.changeStep(4);
            return;
        }
        this.battle.battleCommandKind = EffectSpecialActionKind.None;
        this.battle.windowTopInformations.content = new GraphicText("Select an ally", {
            align: Align.Center
        });
        this.battle.selectedUserIndex = this.battle.selectFirstIndex(CharacterKind.Hero, 0);
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.attackingGroup = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.battle.targets = [];
        this.battle.moveArrow();
        this.battle.battlers[this.battle.kindSelection][this.battle.selectedUserTargetIndex()]
            .updateArrowPosition(this.battle.camera);
        this.battle.listSkills = [];
        this.battle.listItems = [];

        // Items
        let ownedItem, item;
        for (let i = 0, l = RPM.game.items.length; i < l; i++) {
            ownedItem = RPM.game.items[i];
            item = RPM.datasGame.items.list[ownedItem.id];
            if (ownedItem.k === ItemKind.Item && item.consumable && (item
                .avaialableKind === AvailableKind.Battle || item.availableKind ===
                AvailableKind.Always)) {
                this.battle.listItems.push(new GraphicItem(ownedItem));
            }
        }
        this.battle.windowChoicesItems.setContentsCallbacks(this.battle.listItems);
        this.battle.windowItemDescription.content = this.battle.windowChoicesItems
            .getCurrentContent();
    }

    // -------------------------------------------------------
    /** Register the last command index and offset in the user
    */
    public registerLastCommandIndex() {
        this.battle.battle.user.lastCommandIndex = this.battle.windowChoicesBattleCommands
            .currentSelectedIndex;
        this.battle.user.lastCommandOffset = this.battle.windowChoicesBattleCommands
            .offsetSelectedIndex;
    }

    // -------------------------------------------------------
    /** Register the laster skill index and offset in the user
    */
    public registerLastSkillIndex() {
        this.battle.user.lastSkillIndex = this.battle.windowChoicesSkills.currentSelectedIndex;
        this.battle.user.lastSkillOffset = this.battle.windowChoicesSkills.offsetSelectedIndex;
    }

    // -------------------------------------------------------
    /** Register the last item index and offset in the user
    */
    public registerLastItemIndex() {
        this.battle.user.lastItemIndex = this.battle.windowChoicesItems.currentSelectedIndex;
        this.battle.user.lastItemOffset = this.battle.windowChoicesItems.offsetSelectedIndex;
    }

    // -------------------------------------------------------
    /** Select a target
    *   @param {TargetKind} targetKind The target kind 
    */
    public selectTarget(targetKind: TargetKind) {
        this.battle.subStep = 2;
        switch (targetKind) {
            case TargetKind.User:
                this.battle.kindSelection = CharacterKind.Hero;
                this.battle.userTarget = true;
                this.battle.selectedTargetIndex = this.battle.battlers[this.battle.kindSelection].indexOf(
                    this.battle.user);
                break;
            case TargetKind.Enemy:
                this.battle.kindSelection = CharacterKind.Monster;
                break;
            case TargetKind.Ally:
                this.battle.kindSelection = CharacterKind.Hero;
                break;
            case TargetKind.AllEnemies:
                this.battle.kindSelection = CharacterKind.Monster;
                this.battle.all = true;
                break;
            case TargetKind.AllAllies:
                this.battle.kindSelection = CharacterKind.Hero;
                this.battle.all = true;
                break;
        }
        this.battle.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, this
            .selectedUserIndex);
        if (!this.battle.userTarget) {
            this.battle.selectedTargetIndex = this.selectFirstIndex(this.battle.kindSelection, 0);
        }
        this.moveArrow();
    }

    // -------------------------------------------------------
    /** Select the first index according to target kind
    *   @param {TargetKind} kind The target kind
    *   @param {number} index The index (last registered)
    */
    public selectFirstIndex(kind: TargetKind, index: number) {
        while (!this.battle.isDefined(kind, index)) {
            if (index < (this.battle.battlers[kind].length - 1)) {
                index++;
            } else if (index === (this.battle.battlers[kind].length - 1)) {
                index = 0;
            }
        }
        RPM.datasGame.system.soundCursor.playSound();
        return index;
    }

    // -------------------------------------------------------
    /** Get the index of the array after going up
    *   @returns {number}
    */
    public indexArrowUp(): number {
        let index = this.selectedUserTargetIndex();
        do {
            if (index > 0) {
                index--;
            }
            else if (index === 0) {
                index = this.battle.battlers[this.battle.kindSelection].length - 1;
            }
        } while (!this.battle.isDefined(this.battle.kindSelection, index, this.battle.subStep === 2));
        return index;
    }

    // -------------------------------------------------------
    /** Get the index of the array after going down
    *   @returns {number}
    */
    public indexArrowDown(): number {
        let index = this.selectedUserTargetIndex();
        do {
            if (index < (this.battle.battlers[this.battle.kindSelection].length - 1)) {
                index++;
            } else if (index === (this.battle.battlers[this.battle.kindSelection].length - 1)) {
                index = 0;
            }
        } while (!this.battle.isDefined(this.battle.kindSelection, index, this.battle.subStep === 2));
        return index;
    }

    // -------------------------------------------------------
    /** Move the arrow
    */
    public moveArrow() {
        // Updating window informations
        let window = this.battle.subStep === 2 ? this.battle.windowTargetInformations
            : this.battle.windowUserInformations;
        let graphics = this.battle.graphicPlayers[this.battle.kindSelection][this
            .selectedUserTargetIndex()];
        window.content = this.battle.subStep === 2 ? graphics.target : graphics.user;
        window.content.update();
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Get the index of the target
    *   @returns {number}
    */
    public selectedUserTargetIndex(): number {
        return (this.battle.subStep === 2) ? this.battle.selectedTargetIndex : this
            .battle.selectedUserIndex;
    }

    // -------------------------------------------------------
    /** When an ally is selected
    */
    public onAllySelected() {
        this.battle.subStep = 1;
        this.battle.user = this.battle.battlers[CharacterKind.Hero][this.battle.selectedUserIndex];
        this.battle.user.setSelected(true);
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.windowChoicesBattleCommands.select(this.battle.user.lastCommandIndex);
        this.battle.windowChoicesBattleCommands.offsetSelectedIndex = this.battle.user
            .lastCommandOffset;

        // Update skills list
        let skills = this.battle.user.character.sk;
        this.battle.listSkills = [];
        let ownedSkill, availableKind;
        for (let i = 0, l = skills.length; i < l; i++) {
            ownedSkill = skills[i];
            availableKind = RPM.datasGame.skills.list[ownedSkill.id]
                .availableKind;
            if (availableKind === AvailableKind.Always || availableKind ===
                AvailableKind.Battle) {
                this.battle.listSkills.push(new GraphicSkill(ownedSkill));
            }
        }
        this.battle.windowChoicesSkills.setContentsCallbacks(this.battle.listSkills);
        this.battle.windowSkillDescription.content = this.battle.windowChoicesSkills
            .getCurrentContent();
        this.battle.windowChoicesSkills.unselect();
        this.battle.windowChoicesSkills.offsetSelectedIndex = this.battle.user.lastSkillOffset;
        this.battle.windowChoicesSkills.select(this.battle.user.lastSkillIndex);
        this.battle.windowChoicesItems.unselect();
        this.battle.windowChoicesItems.offsetSelectedIndex = this.battle.user.lastItemOffset;
        this.battle.windowChoicesItems.select(this.battle.user.lastItemIndex);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** When an ally is unselected
    */
    public onAllyUnselected() {
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                this.registerLastSkillIndex();
                break;
            case EffectSpecialActionKind.OpenItems:
                this.registerLastItemIndex();
                break;
            default:
                this.battle.subStep = 0;
                this.battle.user.setSelected(false);
                this.registerLastCommandIndex();
                break;
        }
        this.battle.battleCommandKind = EffectSpecialActionKind.None;
    }

    // -------------------------------------------------------
    /** When a command is selected
    *   @param {number} key The key pressed ID
    */
    public onCommandSelected(key: number) {
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                if (this.battle.windowChoicesSkills.getCurrentContent().skill.isPossible()) {
                    this.selectTarget(this.battle.windowSkillDescription.content.skill
                        .targetKind);
                    this.registerLastSkillIndex();
                }
                return;
            case EffectSpecialActionKind.OpenItems:
                this.selectTarget(this.battle.windowItemDescription.content.item.targetKind);
                this.registerLastItemIndex();
                return;
            default:
                break;
        }
        this.battle.windowChoicesBattleCommands.onKeyPressed(key, this
            this.battle.windowChoicesBattleCommands.getCurrentContent().skill);
        let i, l;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                // Check weapon targetKind
                this.battle.attackSkill = this.battle.windowChoicesBattleCommands.getCurrentContent()
                    .skill;
                let targetKind = null;
                let equipments = this.battle.user.character.equip;
                let gameItem;
                for (i = 0, l = equipments.length; i < l; i++) {
                    gameItem = equipments[i];
                    if (gameItem && gameItem.k === ItemKind.Weapon) {
                        targetKind = gameItem.getItemInformations().targetKind;
                        break;
                    }
                }
                // If no weapon
                if (targetKind === null) {
                    targetKind = this.battle.attackSkill.targetKind;
                }
                this.selectTarget(targetKind);
                break;
            case EffectSpecialActionKind.OpenSkills:
                if (this.battle.listSkills.length === 0) {
                    this.battle.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.OpenItems:
                if (this.battle.listItems.length === 0) {
                    this.battle.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.Escape:
                if (this.battle.canEscape) {
                    this.battle.step = 4;
                    this.battle.subStep = 3;
                    this.battle.transitionEnded = false;
                    this.battle.time = new Date().getTime();
                    this.battle.winning = true;
                    RPM.escaped = true;
                    RPM.songsManager.initializeProgressionMusic(SystemPlaySong
                        .currentPlayingMusic.volume, 0, 0, SceneBattle
                        .TIME_LINEAR_MUSIC_END);
                    for (i = 0, l = this.battle.battlers[CharacterKind.Hero].length; i < l; i++) {
                        this.battle.battlers[CharacterKind.Hero][i].setEscaping();
                    }
                }
                return;
            case EffectSpecialActionKind.EndTurn:
                this.battle.windowChoicesBattleCommands.unselect();
                this.battle.changeStep(2);
                return;
            default:
                break;
        }
        this.registerLastCommandIndex();
    }

    // -------------------------------------------------------
    /** When targets are selected
    */
    public onTargetsSelected() {
        if (this.battle.all) {
            for (let i = 0, l = this.battle.battlers[this.battle.kindSelection].length; i < l; i++) {
                this.battle.targets.push(this.battle.battlers[this.battle.kindSelection][i]);
            }
        } else {
            this.battle.targets.push(this.battle.battlers[this.battle.kindSelection][this
                .selectedUserTargetIndex()]);
        }
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.changeStep(2);
    }

    // -------------------------------------------------------
    /** When targets are unselected
    */
    public onTargetsUnselected() {
        this.battle.subStep = 1;
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.moveArrow();
    }

    // -------------------------------------------------------
    /** Update the battle
    */
    public update() {

    }

    // -------------------------------------------------------
    /** Handle key pressed
    *   @param {number} key The key ID 
    */
    public onKeyPressedStep(key: number) {
        switch (this.battle.subStep) {
            case 0:
                if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                    .Action)) {
                    RPM.datasGame.system.soundConfirmation.playSound();
                    this.onAllySelected();
                }
                break;
            case 1:
                if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                    .Action)) {
                    this.onCommandSelected(key);
                } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                    .menuControls.Cancel)) {
                    RPM.datasGame.system.soundCancel.playSound();
                    this.onAllyUnselected();
                }
                break;
            case 2:
                if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                    .Action)) {
                    RPM.datasGame.system.soundConfirmation.playSound();
                    this.onTargetsSelected();
                } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                    .menuControls.Cancel)) {
                    RPM.datasGame.system.soundCancel.playSound();
                    this.onTargetsUnselected();
                }
                break;
        }
    }

    // -------------------------------------------------------
    /** Handle key released
    *   @param {number} key The key ID 
    */
    public onKeyReleasedStep(key: number) {

    }

    // -------------------------------------------------------
    /** Handle key repeat pressed
    *   @param {number} key The key ID 
    */
    public onKeyPressedRepeatStep(key: number) {

    }

    // -------------------------------------------------------
    /** Handle key pressed and repeat
    *   @param {number} key The key ID 
    */
    public onKeyPressedAndRepeatStep(key: number) {
        var index = this.selectedUserTargetIndex();
        switch (this.battle.subStep) {
            case 0:
            case 2:
                if (!this.battle.userTarget) {
                    if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                        .Up) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                            .menuControls.Left)) {
                        index = this.indexArrowUp();
                    } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Down) || DatasKeyBoard.isKeyEqual(key, RPM
                            .datasGame.keyBoard.menuControls.Right)) {
                        index = this.indexArrowDown();
                    }
                }
                if (this.battle.subStep === 0) {
                    if (this.battle.selectedUserIndex !== index) {
                        RPM.datasGame.system.soundCursor.playSound();
                    }
                    this.battle.selectedUserIndex = index;
                } else {
                    if (this.battle.selectedUserIndex !== index) {
                        RPM.datasGame.system.soundCursor.playSound();
                    }
                    this.battle.selectedTargetIndex = index;
                }
                this.moveArrow();
                break;
            case 1:
                switch (this.battle.battleCommandKind) {
                    case EffectSpecialActionKind.OpenSkills:
                        this.battle.windowChoicesSkills.onKeyPressedAndRepeat(key);
                        this.battle.windowSkillDescription.content = this.battle.windowChoicesSkills
                            .getCurrentContent();
                        break;
                    case EffectSpecialActionKind.OpenItems:
                        this.battle.windowChoicesItems.onKeyPressedAndRepeat(key);
                        this.battle.windowItemDescription.content = this.battle.windowChoicesItems
                            .getCurrentContent();
                        break;
                    default:
                        this.battle.windowChoicesBattleCommands.onKeyPressedAndRepeat(key);
                        break;
                }
                break;
        }
    }

    // -------------------------------------------------------
    /** Draw the battle HUD
    */
    public drawHUDStep() {
        this.battle.windowTopInformations.draw();

        // Draw heroes window informations
        this.battle.windowUserInformations.draw();
        if (this.battle.subStep === 2) {
            this.battle.windowTargetInformations.draw();
        }

        // Arrows
        if (this.battle.all) {
            for (let i = 0, l = this.battle.battlers[this.battle.kindSelection].length; i < l; i++) {
                this.battle.battlers[this.battle.kindSelection][i].drawArrow();
            }
        } else {
            this.battle.battlers[this.battle.kindSelection][this.selectedUserTargetIndex()]
                .drawArrow();
        }
        // Commands
        if (this.battle.subStep === 1) {
            this.battle.windowChoicesBattleCommands.draw();
            switch (this.battle.battleCommandKind) {
                case EffectSpecialActionKind.OpenSkills:
                    this.battle.windowChoicesSkills.draw();
                    this.battle.windowSkillDescription.draw();
                    break;
                case EffectSpecialActionKind.OpenItems:
                    this.battle.windowChoicesItems.draw();
                    this.battle.windowItemDescription.draw();
                    break;
            }
        }
    }

}
export { BattleSelection }