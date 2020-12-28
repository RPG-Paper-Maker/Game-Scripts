/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, Graphic, System, Manager, Datas } from "../index.js";
import { Enum } from "../Common/index.js";
var BattleStep = Enum.BattleStep;
var EffectSpecialActionKind = Enum.EffectSpecialActionKind;
var CharacterKind = Enum.CharacterKind;
var Align = Enum.Align;
var ItemKind = Enum.ItemKind;
var AvailableKind = Enum.AvailableKind;
var TargetKind = Enum.TargetKind;
import { Game } from "../Core/index.js";
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
    constructor(battle) {
        this.battle = battle;
    }
    /**
     *  Initialize step.
     */
    initialize() {
        // Check if everyone is dead to avoid infinite looping
        if (this.battle.isLose()) {
            this.battle.winning = false;
            this.battle.changeStep(BattleStep.Victory);
            return;
        }
        this.battle.battleCommandKind = EffectSpecialActionKind.None;
        this.battle.windowTopInformations.content = new Graphic.Text("Select an ally", { align: Align.Center });
        this.battle.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, 0);
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.attackingGroup = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.battle.targets = [];
        this.moveArrow();
        this.battle.battlers[this.battle.kindSelection][this
            .selectedUserTargetIndex()].updateArrowPosition(this.battle.camera);
        this.battle.listSkills = [];
        this.battle.listItems = [];
        // Items
        let ownedItem, item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            ownedItem = Game.current.items[i];
            item = Datas.Items.get(ownedItem.id);
            if (ownedItem.kind === ItemKind.Item && item.consumable && (item
                .availableKind === AvailableKind.Battle || item.availableKind
                === AvailableKind.Always)) {
                this.battle.listItems.push(new Graphic.Item(ownedItem));
            }
        }
        this.battle.windowChoicesItems.setContentsCallbacks(this.battle
            .listItems);
        this.battle.windowItemDescription.content = this.battle
            .windowChoicesItems.getCurrentContent();
    }
    /**
     *  Register the last command index and offset in the user.
     */
    registerLastCommandIndex() {
        this.battle.user.lastCommandIndex = this.battle
            .windowChoicesBattleCommands.currentSelectedIndex;
        this.battle.user.lastCommandOffset = this.battle
            .windowChoicesBattleCommands.offsetSelectedIndex;
    }
    /**
     *  Register the laster skill index and offset in the user.
     */
    registerLastSkillIndex() {
        this.battle.user.lastSkillIndex = this.battle.windowChoicesSkills
            .currentSelectedIndex;
        this.battle.user.lastSkillOffset = this.battle.windowChoicesSkills
            .offsetSelectedIndex;
    }
    /**
     *  Register the last item index and offset in the user.
     */
    registerLastItemIndex() {
        this.battle.user.lastItemIndex = this.battle.windowChoicesItems
            .currentSelectedIndex;
        this.battle.user.lastItemOffset = this.battle.windowChoicesItems
            .offsetSelectedIndex;
    }
    /**
     *  Select a target.
     *  @param {TargetKind} targetKind The target kind
     */
    selectTarget(targetKind) {
        this.battle.subStep = 2;
        switch (targetKind) {
            case TargetKind.User:
                this.battle.kindSelection = CharacterKind.Hero;
                this.battle.userTarget = true;
                this.battle.selectedTargetIndex = this.battle.battlers[this
                    .battle.kindSelection].indexOf(this.battle.user);
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
        this.battle.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, this.battle.selectedUserIndex);
        if (!this.battle.userTarget) {
            this.battle.selectedTargetIndex = this.selectFirstIndex(this.battle
                .kindSelection, 0);
        }
        this.moveArrow();
    }
    /**
     *  Select the first index according to target kind.
     *  @param {CharacterKind} kind The target kind
     *  @param {number} index The index (last registered)
     */
    selectFirstIndex(kind, index) {
        while (!this.battle.isDefined(kind, index)) {
            if (index < (this.battle.battlers[kind].length - 1)) {
                index++;
            }
            else if (index === (this.battle.battlers[kind].length - 1)) {
                index = 0;
            }
        }
        Datas.Systems.soundCursor.playSound();
        return index;
    }
    /**
     *  Get the index of the array after going up.
     *  @returns {number}
     */
    indexArrowUp() {
        let index = this.selectedUserTargetIndex();
        do {
            if (index > 0) {
                index--;
            }
            else if (index === 0) {
                index = this.battle.battlers[this.battle.kindSelection].length -
                    1;
            }
        } while (!this.battle.isDefined(this.battle.kindSelection, index, this
            .battle.subStep === 2));
        return index;
    }
    /**
     *  Get the index of the array after going down.
     *  @returns {number}
     */
    indexArrowDown() {
        let index = this.selectedUserTargetIndex();
        do {
            if (index < (this.battle.battlers[this.battle.kindSelection].length
                - 1)) {
                index++;
            }
            else if (index === (this.battle.battlers[this.battle.kindSelection].length - 1)) {
                index = 0;
            }
        } while (!this.battle.isDefined(this.battle.kindSelection, index, this
            .battle.subStep === 2));
        return index;
    }
    /**
     *  Move the arrow.
     */
    moveArrow() {
        // Updating window informations
        let window = this.battle.subStep === 2 ? this.battle
            .windowTargetInformations : this.battle.windowUserInformations;
        window.content = this.battle.graphicPlayers[this.battle.kindSelection][this.selectedUserTargetIndex()];
        window.content.update();
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Get the index of the target.
     *  @returns {number}
     */
    selectedUserTargetIndex() {
        return (this.battle.subStep === 2) ? this.battle.selectedTargetIndex :
            this.battle.selectedUserIndex;
    }
    /**
     *  When an ally is selected.
     */
    onAllySelected() {
        this.battle.subStep = 1;
        this.battle.user = this.battle.battlers[CharacterKind.Hero][this.battle
            .selectedUserIndex];
        this.battle.user.setSelected(true);
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.windowChoicesBattleCommands.select(this.battle.user
            .lastCommandIndex);
        this.battle.windowChoicesBattleCommands.offsetSelectedIndex = this
            .battle.user.lastCommandOffset;
        // Update skills list
        let skills = this.battle.user.player.sk;
        this.battle.listSkills = [];
        let ownedSkill, availableKind;
        for (let i = 0, l = skills.length; i < l; i++) {
            ownedSkill = skills[i];
            availableKind = Datas.Skills.get(ownedSkill.id).availableKind;
            if (availableKind === AvailableKind.Always || availableKind ===
                AvailableKind.Battle) {
                this.battle.listSkills.push(new Graphic.Skill(ownedSkill));
            }
        }
        this.battle.windowChoicesSkills.setContentsCallbacks(this.battle
            .listSkills);
        this.battle.windowSkillDescription.content = this.battle
            .windowChoicesSkills.getCurrentContent();
        this.battle.windowChoicesSkills.unselect();
        this.battle.windowChoicesSkills.offsetSelectedIndex = this.battle.user
            .lastSkillOffset;
        this.battle.windowChoicesSkills.select(this.battle.user.lastSkillIndex);
        this.battle.windowChoicesItems.unselect();
        this.battle.windowChoicesItems.offsetSelectedIndex = this.battle.user
            .lastItemOffset;
        this.battle.windowChoicesItems.select(this.battle.user.lastItemIndex);
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  When an ally is unselected.
     */
    onAllyUnselected() {
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
    /**
     *  When a command is selected.
     *  @param {number} key The key pressed ID
     */
    onCommandSelected(key) {
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                let skill = this.battle.windowChoicesSkills
                    .getCurrentContent().system;
                if (skill.isPossible()) {
                    this.selectTarget(skill.targetKind);
                    this.registerLastSkillIndex();
                }
                return;
            case EffectSpecialActionKind.OpenItems:
                this.selectTarget(this.battle
                    .windowItemDescription.content.system.targetKind);
                this.registerLastItemIndex();
                return;
            default:
                break;
        }
        this.battle.windowChoicesBattleCommands.onKeyPressed(key, this.battle.windowChoicesBattleCommands.getCurrentContent()
            .system);
        let i, l;
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                // Check weapon TargetKind
                this.battle.attackSkill = this.battle
                    .windowChoicesBattleCommands.getCurrentContent().system;
                let targetKind = null;
                let equipments = this.battle.user.player.equip;
                let gameItem;
                for (i = 0, l = equipments.length; i < l; i++) {
                    gameItem = equipments[i];
                    if (gameItem && gameItem.kind === ItemKind.Weapon) {
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
            /*
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
                */
            case EffectSpecialActionKind.Escape:
                if (this.battle.canEscape) {
                    this.battle.step = 4;
                    this.battle.subStep = 3;
                    this.battle.transitionEnded = false;
                    this.battle.time = new Date().getTime();
                    this.battle.winning = true;
                    Scene.Battle.escapedLastBattle = true;
                    Manager.Songs.initializeProgressionMusic(System.PlaySong
                        .currentPlayingMusic.volume.getValue(), 0, 0, Scene
                        .Battle.TIME_LINEAR_MUSIC_END);
                    for (i = 0, l = this.battle.battlers[CharacterKind.Hero]
                        .length; i < l; i++) {
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
    /**
     *  When targets are selected.
     */
    onTargetsSelected() {
        let player = this.battle.battlers[this.battle.kindSelection];
        if (this.battle.all) {
            for (let i = 0, l = player.length; i < l; i++) {
                this.battle.targets.push(player[i]);
            }
        }
        else {
            this.battle.targets.push(player[this.selectedUserTargetIndex()]);
        }
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.changeStep(BattleStep.Animation);
    }
    /**
     *  When targets are unselected.
     */
    onTargetsUnselected() {
        this.battle.subStep = 1;
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.moveArrow();
    }
    /**
     *  Update the battle.
     */
    update() {
    }
    /**
     *  Handle key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressedStep(key) {
        switch (this.battle.subStep) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.onAllySelected();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    this.onCommandSelected(key);
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel)) {
                    Datas.Systems.soundCancel.playSound();
                    this.onAllyUnselected();
                }
                break;
            case 2:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.onTargetsSelected();
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel)) {
                    Datas.Systems.soundCancel.playSound();
                    this.onTargetsUnselected();
                }
                break;
        }
    }
    /**
     *  Handle key released.
     *  @param {number} key The key ID
     */
    onKeyReleasedStep(key) {
    }
    /**
     *  Handle key repeat pressed.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key) {
        return true;
    }
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key) {
        var index = this.selectedUserTargetIndex();
        switch (this.battle.subStep) {
            case 0:
            case 2:
                if (!this.battle.userTarget) {
                    if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Up) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Left)) {
                        index = this.indexArrowUp();
                    }
                    else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                        .menuControls.Down) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Right)) {
                        index = this.indexArrowDown();
                    }
                }
                if (this.battle.subStep === 0) {
                    if (this.battle.selectedUserIndex !== index) {
                        Datas.Systems.soundCursor.playSound();
                    }
                    this.battle.selectedUserIndex = index;
                }
                else {
                    if (this.battle.selectedUserIndex !== index) {
                        Datas.Systems.soundCursor.playSound();
                    }
                    this.battle.selectedTargetIndex = index;
                }
                this.moveArrow();
                break;
            case 1:
                switch (this.battle.battleCommandKind) {
                    case EffectSpecialActionKind.OpenSkills:
                        this.battle.windowChoicesSkills.onKeyPressedAndRepeat(key);
                        this.battle.windowSkillDescription.content = this.battle
                            .windowChoicesSkills.getCurrentContent();
                        break;
                    case EffectSpecialActionKind.OpenItems:
                        this.battle.windowChoicesItems.onKeyPressedAndRepeat(key);
                        this.battle.windowItemDescription.content = this.battle
                            .windowChoicesItems.getCurrentContent();
                        break;
                    default:
                        this.battle.windowChoicesBattleCommands
                            .onKeyPressedAndRepeat(key);
                        break;
                }
                break;
        }
        return true;
    }
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep() {
        this.battle.windowTopInformations.draw();
        // Draw heroes window informations
        this.battle.windowUserInformations.draw();
        if (this.battle.subStep === 2) {
            this.battle.windowTargetInformations.content
                .updateReverse(true);
            this.battle.windowTargetInformations.draw();
            this.battle.windowTargetInformations.content
                .updateReverse(false);
        }
        // Arrows
        let player = this.battle.battlers[this.battle.kindSelection];
        if (this.battle.all) {
            for (let i = 0, l = player.length; i < l; i++) {
                player[i].drawArrow();
            }
        }
        else {
            player[this.selectedUserTargetIndex()]
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
export { BattleSelection };
