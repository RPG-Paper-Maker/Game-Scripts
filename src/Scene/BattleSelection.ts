
/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene, Graphic, System, Manager, Datas } from "..";
import { Enum, Interpreter } from "../Common";
import BattleStep = Enum.BattleStep;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import CharacterKind = Enum.CharacterKind;
import Align = Enum.Align;
import ItemKind = Enum.ItemKind;
import AvailableKind = Enum.AvailableKind;
import TargetKind = Enum.TargetKind;
import { Item, Skill, Game, Battler } from "../Core";

// -------------------------------------------------------
//
//  CLASS BattleSelection
//
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------

class BattleSelection {

    public battle: Scene.Battle

    constructor(battle: Scene.Battle) {
        this.battle = battle;
    }

    /** 
     *  Initialize step.
     */
    public initialize() {
        // Check if everyone is dead to avoid infinite looping
        if (this.battle.isLose()) {
            this.battle.winning = false;
            this.battle.changeStep(BattleStep.Victory);
            return;
        } else if (this.battle.isWin()) {
            this.battle.winning = true;
            this.battle.activeGroup();
            this.battle.changeStep(BattleStep.Victory);
        }

        // Check if everyone is defined
        let exists = false;
        for (let i = 0, l = this.battle.battlers[Enum.CharacterKind.Hero].length; 
            i < l; i++) {
            if (this.battle.isDefined(Enum.CharacterKind.Hero, i)) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this.battle.changeStep(Enum.BattleStep.EndTurn);
            return;
        }

        this.battle.battleCommandKind = EffectSpecialActionKind.None;
        (<Graphic.Text>this.battle.windowTopInformations.content).setText(
            "Select an ally");
        this.battle.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero, 0);
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.battle.targets = [];
        this.moveArrow();
        this.battle.battlers[this.battle.kindSelection][this
            .selectedUserTargetIndex()].updateArrowPosition(this.battle.camera);
        this.battle.listSkills = [];
        this.battle.listItems = [];

        // Items
        let ownedItem: Item, item: System.Item;
        for (let i = 0, l = Game.current.items.length; i < l; i++) {
            ownedItem = Game.current.items[i];
            if (ownedItem.kind === ItemKind.Item) {
                item = <System.Item>ownedItem.system;
                if (item.consumable && (item.availableKind === AvailableKind
                    .Battle || item.availableKind  === AvailableKind.Always)) {
                    this.battle.listItems.push(new Graphic.Item(ownedItem));
                }
            }
        }
        this.battle.windowChoicesItems.setContentsCallbacks(this.battle.listItems);
        this.battle.windowItemDescription.content = this.battle.windowChoicesItems
            .getCurrentContent();
    }

    /** 
     *  Register the last command index and offset in the user.
     */
    public registerLastCommandIndex() {
        this.battle.user.lastCommandIndex = this.battle
            .windowChoicesBattleCommands.currentSelectedIndex;
        this.battle.user.lastCommandOffset = this.battle
            .windowChoicesBattleCommands.offsetSelectedIndex;
    }

    /** 
     *  Register the laster skill index and offset in the user.
     */
    public registerLastSkillIndex() {
        this.battle.user.lastSkillIndex = this.battle.windowChoicesSkills
            .currentSelectedIndex;
        this.battle.user.lastSkillOffset = this.battle.windowChoicesSkills
            .offsetSelectedIndex;
    }

    /** 
     *  Register the last item index and offset in the user.
     */
    public registerLastItemIndex() {
        this.battle.user.lastItemIndex = this.battle.windowChoicesItems
            .currentSelectedIndex;
        this.battle.user.lastItemOffset = this.battle.windowChoicesItems
            .offsetSelectedIndex;
    }

    /** 
     *  Select a target.
     *  @param {TargetKind} targetKind - The target kind 
     */
    public selectTarget(targetKind: TargetKind) {
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
        this.battle.selectedUserIndex = this.selectFirstIndex(CharacterKind.Hero
            , this.battle.selectedUserIndex);
        if (!this.battle.userTarget) {
            this.battle.selectedTargetIndex = this.selectFirstIndex(this.battle
                .kindSelection, 0);
        }
        this.moveArrow();
    }

    /** 
     *  Select the first index according to target kind.
     *  @param {CharacterKind} kind - The target kind
     *  @param {number} index - The index (last registered)
     */
    public selectFirstIndex(kind: CharacterKind, index: number) {
        while (!this.battle.isDefined(kind, index, this.battle.subStep === 2)) {
            if (index < (this.battle.battlers[kind].length - 1)) {
                index++;
            } else if (index === (this.battle.battlers[kind].length - 1)) {
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
    public indexArrowUp(): number {
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
    public indexArrowDown(): number {
        let index = this.selectedUserTargetIndex();
        do {
            if (index < (this.battle.battlers[this.battle.kindSelection].length 
                - 1)) {
                index++;
            } else if (index === (this.battle.battlers[this.battle.kindSelection
                ].length - 1)) {
                index = 0;
            }
        } while (!this.battle.isDefined(this.battle.kindSelection, index, this
            .battle.subStep === 2));
        return index;
    }

    /** 
     *  Move the arrow.
     */
    public moveArrow() {
        // Updating window informations
        let window = this.battle.subStep === 2 ? this.battle
            .windowTargetInformations : this.battle.windowUserInformations;
        window.content = this.battle.graphicPlayers[this.battle.kindSelection]
            [this.selectedUserTargetIndex()];
        window.content.update();
        Manager.Stack.requestPaintHUD = true;
    }

    /** 
     *  Get the index of the target.
     *  @returns {number}
     */
    public selectedUserTargetIndex(): number {
        return (this.battle.subStep === 2) ? this.battle.selectedTargetIndex : 
            this.battle.selectedUserIndex;
    }

    /** 
     *  When an ally is selected.
     */
    public onAllySelected() {
        this.battle.subStep = 1;
        this.battle.user = this.battle.battlers[CharacterKind.Hero][this.battle
            .selectedUserIndex];
        this.battle.user.setSelected(true);
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.windowChoicesBattleCommands.select(this.battle.user
            .lastCommandIndex);
        this.battle.windowChoicesBattleCommands.offsetSelectedIndex = this
            .battle.user.lastCommandOffset;
        this.battle.skill = null;

        // Update skills list
        let skills = this.battle.user.player.skills;
        this.battle.listSkills = [];
        let ownedSkill: Skill, skill: System.Skill;
        for (let i = 0, l = skills.length; i < l; i++) {
            ownedSkill = skills[i];
            skill = Datas.Skills.get(ownedSkill.id);
            if ((skill.availableKind === AvailableKind.Always || skill
                .availableKind === AvailableKind.Battle) && Interpreter
                .evaluate(skill.conditionFormula.getValue(), { user: this.battle
                .user.player }) && this.battle.battlers[CharacterKind.Monster]
                .every((battler) => { return Interpreter.evaluate(skill
                .conditionFormula.getValue(), { user: this.battle.user.player, 
                target: battler.player}) })) {
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

    /** 
     *  When a command is selected.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    public onCommandSelected(isKey: boolean, options: { key?: number, x?: number, 
        y?: number } = {}) {
        switch (this.battle.battleCommandKind) {
            case EffectSpecialActionKind.OpenSkills:
                let skill = (<Graphic.Skill>this.battle.windowChoicesSkills
                    .getCurrentContent()).system;
                if (skill.isPossible()) {
                    this.battle.skill = skill;
                    this.selectTarget(skill.targetKind);
                    this.registerLastSkillIndex();
                }
                return;
            case EffectSpecialActionKind.OpenItems:
                let item = (<Graphic.Item>this.battle.windowItemDescription
                    .content).item.system;
                if (item.isPossible()) {
                    this.battle.skill = item;
                    this.selectTarget(item.targetKind);
                    this.registerLastItemIndex();
                }
                return;
            default:
                this.battle.battleCommandKind = EffectSpecialActionKind.None;
                break;
        }
        let system = (<Graphic.TextIcon>this.battle.windowChoicesBattleCommands
            .getCurrentContent()).system;
        if (isKey) {
            this.battle.windowChoicesBattleCommands.onKeyPressed(options.key, system);
        } else {
            this.battle.windowChoicesBattleCommands.onMouseUp(options.x, options
                .y, system);
        }
        let i: number, l: number;
        switch (<Enum.EffectSpecialActionKind> this.battle.battleCommandKind) {
            case EffectSpecialActionKind.ApplyWeapons:
                // Check weapon TargetKind
                this.battle.attackSkill = (<Graphic.Skill>this.battle
                    .windowChoicesBattleCommands.getCurrentContent()).system;
                this.battle.skill = this.battle.attackSkill;
                let targetKind = null;
                let equipments = this.battle.user.player.equip;
                let gameItem: Item;
                for (i = 0, l = equipments.length; i < l; i++) {
                    gameItem = equipments[i];
                    if (gameItem && gameItem.kind === ItemKind.Weapon) {
                        targetKind = gameItem.system.targetKind;
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
                if (this.battle.listSkills.length === 0 || this.battle.user
                    .containsRestriction(Enum.StatusRestrictionsKind.CantUseSkills)) {
                    this.battle.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.OpenItems:
                if (this.battle.listItems.length === 0 || this.battle.user
                    .containsRestriction(Enum.StatusRestrictionsKind.CantUseItems)) {
                    this.battle.battleCommandKind = EffectSpecialActionKind.None;
                }
                break;
            case EffectSpecialActionKind.Escape:
                if (this.battle.user.containsRestriction(Enum.StatusRestrictionsKind
                    .CantEscape)) {
                    this.battle.battleCommandKind = EffectSpecialActionKind.None;
                    break;
                }
                if (this.battle.canEscape) {
                    this.battle.step = Enum.BattleStep.Victory;
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
                this.battle.changeStep(Enum.BattleStep.Animation);
                return;
            case EffectSpecialActionKind.None: // If any other skill that is not a special action
                let skill = <System.Skill>(<Graphic.TextIcon>this.battle
                    .windowChoicesBattleCommands.getCurrentContent()).system;
                if (skill.isPossible()) {
                    this.battle.skill = skill;
                    this.selectTarget(skill.targetKind);
                }
                break;
            default:
                break;
        }
        this.registerLastCommandIndex();
    }

    /** 
     *  When targets are selected.
     */
    public onTargetsSelected() {
        this.battle.skill = null;
        let player = this.battle.battlers[this.battle.kindSelection];
        if (this.battle.all) {
            for (let i = 0, l = player.length; i < l; i++) {
                this.battle.targets.push(player[i]);
            }
        } else {
            this.battle.targets.push(player[this.selectedUserTargetIndex()]);
        }
        this.battle.windowChoicesBattleCommands.unselect();
        this.battle.changeStep(BattleStep.Animation);
    }

    /** 
     *  When targets are unselected.
     */
    public onTargetsUnselected() {
        this.battle.skill = null;
        this.battle.subStep = 1;
        this.battle.kindSelection = CharacterKind.Hero;
        this.battle.userTarget = false;
        this.battle.all = false;
        this.moveArrow();
    }

    /** 
     *  A scene action.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    action(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        switch (this.battle.subStep) {
            case 0:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.onAllySelected();
                }
                break;
            case 1:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    this.onCommandSelected(isKey, options);
                } else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                    Datas.Systems.soundCancel.playSound();
                    this.onAllyUnselected();
                }
                break;
            case 2:
                if (Scene.MenuBase.checkActionMenu(isKey, options)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.onTargetsSelected();
                } else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
                    Datas.Systems.soundCancel.playSound();
                    this.onTargetsUnselected();
                }
                break;
        }
    }

    /** 
     *  A scene move.
     *  @param {boolean} isKey
     *  @param {{ key?: number, x?: number, y?: number }} [options={}]
     */
    move(isKey: boolean, options: { key?: number, x?: number, y?: number } = {}) {
        let index = this.selectedUserTargetIndex();
        switch (this.battle.subStep) {
            case 0:
            case 2:
                if (!this.battle.userTarget) {
                    if (isKey) {
                        if (Datas.Keyboards.isKeyEqual(options.key, Datas
                            .Keyboards.menuControls.Up) || Datas.Keyboards
                            .isKeyEqual(options.key, Datas.Keyboards.menuControls
                            .Left)) {
                            index = this.indexArrowUp();
                        } else if (Datas.Keyboards.isKeyEqual(options.key, Datas
                            .Keyboards.menuControls.Down) || Datas.Keyboards
                            .isKeyEqual(options.key, Datas.Keyboards.menuControls
                            .Right)) {
                            index = this.indexArrowDown();
                        }
                    } else {
                        let battler: Battler;
                        for (let i = 0, l = this.battle.battlers[this.battle
                            .kindSelection].length; i < l; i++) {
                            battler = this.battle.battlers[this.battle.kindSelection][i];
                            if (battler.isInside(options.x, options.y) && this
                                .battle.isDefined(this.battle.kindSelection, i, 
                                this.battle.subStep === 2)) {
                                index = i;
                                break;
                            }
                        }
                    }
                }
                if (this.battle.subStep === 0) {
                    if (this.battle.selectedUserIndex !== index) {
                        Datas.Systems.soundCursor.playSound();
                    }
                    this.battle.selectedUserIndex = index;
                } else {
                    if (this.battle.selectedTargetIndex !== index) {
                        Datas.Systems.soundCursor.playSound();
                    }
                    this.battle.selectedTargetIndex = index;
                }
                this.moveArrow();
                break;
            case 1:
                switch (this.battle.battleCommandKind) {
                    case EffectSpecialActionKind.OpenSkills:
                        if (isKey) {
                            this.battle.windowChoicesSkills.onKeyPressedAndRepeat(options.key);
                        } else {
                            this.battle.windowChoicesSkills.onMouseMove(options.x, options.y);
                        }
                        this.battle.windowSkillDescription.content = this.battle
                            .windowChoicesSkills.getCurrentContent();
                        break;
                    case EffectSpecialActionKind.OpenItems:
                        if (isKey) {
                            this.battle.windowChoicesItems.onKeyPressedAndRepeat(options.key);
                        } else {
                            this.battle.windowChoicesItems.onMouseMove(options.x, options.y);
                        }
                        this.battle.windowItemDescription.content = this.battle
                            .windowChoicesItems.getCurrentContent();
                        break;
                    default:
                        if (isKey) {
                            this.battle.windowChoicesBattleCommands.onKeyPressedAndRepeat(options.key);
                        } else {
                            this.battle.windowChoicesBattleCommands.onMouseMove(options.x, options.y);
                        }
                        break;
                }
                break;
        }
    }

    /** 
     *  Update the battle.
     */
    public update() {
        this.battle.windowChoicesBattleCommands.update();
        this.battle.windowChoicesItems.update();
        this.battle.windowChoicesSkills.update();
    }

    /** 
     *  Handle key pressed.
     *  @param {number} key - The key ID 
     */
    public onKeyPressedStep(key: number) {
        this.action(true, { key: key });
    }

    /** 
     *  Handle key released.
     *  @param {number} key - The key ID 
     */
    public onKeyReleasedStep(key: number) {

    }

    /** 
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID 
     *  @returns {boolean}
     */
    public onKeyPressedRepeatStep(key: number): boolean {
        return true;
    }

    /** 
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    public onKeyPressedAndRepeatStep(key: number): boolean {
        this.move(true, { key: key });
        return true;
    }

    /** 
     *  @inheritdoc
     */
    onMouseMoveStep(x: number, y: number) {
        this.move(false, { x: x, y: y });
    }

    /** 
     *  @inheritdoc
     */
    onMouseUpStep(x: number, y: number) {
        this.action(false, { x: x, y: y });
    }

    /** 
     *  Draw the battle HUD.
     */
    public drawHUDStep() {
        this.battle.windowTopInformations.draw();

        // Draw heroes window informations
        this.battle.windowUserInformations.draw();
        if (this.battle.subStep === 2) {
            (<Graphic.Player>this.battle.windowTargetInformations.content)
                .updateReverse(true);
            this.battle.windowTargetInformations.draw();
            (<Graphic.Player>this.battle.windowTargetInformations.content)
                .updateReverse(false);
        }

        // Arrows
        let player = this.battle.battlers[this.battle.kindSelection];
        if (this.battle.all) {
            for (let i = 0, l = player.length; i < l; i++) {
                player[i].drawArrow();
            }
        } else {
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
export { BattleSelection }