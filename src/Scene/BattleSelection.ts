/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic, Manager, Scene, System } from '..';
import {
	AVAILABLE_KIND,
	BATTLE_STEP,
	CHARACTER_KIND,
	EFFECT_SPECIAL_ACTION_KIND,
	Interpreter,
	ITEM_KIND,
	STATUS_RESTRICTIONS_KIND,
	TARGET_KIND,
} from '../Common';
import { Battler, Game, Item, Skill } from '../Core';

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
	public battle: Scene.Battle;

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
			this.battle.changeStep(BATTLE_STEP.VICTORY);
			return;
		} else if (this.battle.isWin()) {
			this.battle.winning = true;
			this.battle.activeGroup();
			this.battle.changeStep(BATTLE_STEP.VICTORY);
		}

		// Check if everyone is defined
		let exists = false;
		for (let i = 0, l = this.battle.battlers[CHARACTER_KIND.HERO].length; i < l; i++) {
			if (this.battle.isDefined(CHARACTER_KIND.HERO, i)) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			this.battle.changeStep(BATTLE_STEP.END_TURN);
			return;
		}

		this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
		(<Graphic.Text>this.battle.windowTopInformations.content).setText(Datas.Languages.extras.selectAnAlly.name());
		this.battle.selectedUserIndex = this.selectFirstIndex(CHARACTER_KIND.HERO, 0);
		this.battle.kindSelection = CHARACTER_KIND.HERO;
		this.battle.userTarget = false;
		this.battle.all = false;
		this.battle.targets = [];
		this.moveArrow();
		this.battle.battlers[this.battle.kindSelection][this.selectedUserTargetIndex()].updateArrowPosition(
			this.battle.camera
		);
		this.battle.listSkills = [];
		this.battle.listItems = [];

		// Items
		let ownedItem: Item, item: System.Item;
		for (let i = 0, l = Game.current.items.length; i < l; i++) {
			ownedItem = Game.current.items[i];
			if (ownedItem.kind === ITEM_KIND.ITEM) {
				item = <System.Item>ownedItem.system;
				if (
					item.consumable &&
					(item.availableKind === AVAILABLE_KIND.BATTLE || item.availableKind === AVAILABLE_KIND.ALWAYS)
				) {
					this.battle.listItems.push(new Graphic.Item(ownedItem));
				}
			}
		}
		this.battle.windowChoicesItems.setContentsCallbacks(this.battle.listItems);
		this.battle.windowItemDescription.content = this.battle.windowChoicesItems.getCurrentContent();
	}

	/**
	 *  Register the last command index and offset in the user.
	 */
	public registerLastCommandIndex() {
		this.battle.user.lastCommandIndex = this.battle.windowChoicesBattleCommands.currentSelectedIndex;
		this.battle.user.lastCommandOffset = this.battle.windowChoicesBattleCommands.offsetSelectedIndex;
	}

	/**
	 *  Register the laster skill index and offset in the user.
	 */
	public registerLastSkillIndex() {
		this.battle.user.lastSkillIndex = this.battle.windowChoicesSkills.currentSelectedIndex;
		this.battle.user.lastSkillOffset = this.battle.windowChoicesSkills.offsetSelectedIndex;
	}

	/**
	 *  Register the last item index and offset in the user.
	 */
	public registerLastItemIndex() {
		this.battle.user.lastItemIndex = this.battle.windowChoicesItems.currentSelectedIndex;
		this.battle.user.lastItemOffset = this.battle.windowChoicesItems.offsetSelectedIndex;
	}

	/**
	 *  Select a target.
	 *  @param {TARGET_KIND} targetKind - The target kind
	 */
	public selectTarget(targetKind: TARGET_KIND) {
		this.battle.subStep = 2;
		switch (targetKind) {
			case TARGET_KIND.USER:
				this.battle.kindSelection = CHARACTER_KIND.HERO;
				this.battle.userTarget = true;
				this.battle.selectedTargetIndex = this.battle.battlers[this.battle.kindSelection].indexOf(
					this.battle.user
				);
				break;
			case TARGET_KIND.ENEMY:
				this.battle.kindSelection = CHARACTER_KIND.MONSTER;
				break;
			case TARGET_KIND.ALLY:
				this.battle.kindSelection = CHARACTER_KIND.HERO;
				break;
			case TARGET_KIND.ALL_ENEMIES:
				this.battle.kindSelection = CHARACTER_KIND.MONSTER;
				this.battle.all = true;
				break;
			case TARGET_KIND.ALL_ALLIES:
				this.battle.kindSelection = CHARACTER_KIND.HERO;
				this.battle.all = true;
				break;
		}
		this.battle.selectedUserIndex = this.selectFirstIndex(CHARACTER_KIND.HERO, this.battle.selectedUserIndex);
		if (!this.battle.userTarget) {
			this.battle.selectedTargetIndex = this.selectFirstIndex(this.battle.kindSelection, 0);
		}
		this.moveArrow();
	}

	/**
	 *  Select the first index according to target kind.
	 *  @param {CHARACTER_KIND} kind - The target kind
	 *  @param {number} index - The index (last registered)
	 */
	public selectFirstIndex(kind: CHARACTER_KIND, index: number) {
		while (!this.battle.isDefined(kind, index, this.battle.subStep === 2)) {
			if (index < this.battle.battlers[kind].length - 1) {
				index++;
			} else if (index === this.battle.battlers[kind].length - 1) {
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
			} else if (index === 0) {
				index = this.battle.battlers[this.battle.kindSelection].length - 1;
			}
		} while (!this.battle.isDefined(this.battle.kindSelection, index, this.battle.subStep === 2));
		return index;
	}

	/**
	 *  Get the index of the array after going down.
	 *  @returns {number}
	 */
	public indexArrowDown(): number {
		let index = this.selectedUserTargetIndex();
		do {
			if (index < this.battle.battlers[this.battle.kindSelection].length - 1) {
				index++;
			} else if (index === this.battle.battlers[this.battle.kindSelection].length - 1) {
				index = 0;
			}
		} while (!this.battle.isDefined(this.battle.kindSelection, index, this.battle.subStep === 2));
		return index;
	}

	/**
	 *  Move the arrow.
	 */
	public moveArrow() {
		// Updating window informations
		const window =
			this.battle.subStep === 2 ? this.battle.windowTargetInformations : this.battle.windowUserInformations;
		window.content = this.battle.graphicPlayers[this.battle.kindSelection][this.selectedUserTargetIndex()];
		window.content.update();
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Get the index of the target.
	 *  @returns {number}
	 */
	public selectedUserTargetIndex(): number {
		return this.battle.subStep === 2 ? this.battle.selectedTargetIndex : this.battle.selectedUserIndex;
	}

	/**
	 *  When an ally is selected.
	 */
	public onAllySelected() {
		this.battle.subStep = 1;
		this.battle.user = this.battle.battlers[CHARACTER_KIND.HERO][this.battle.selectedUserIndex];
		this.battle.user.setSelected(true);
		this.battle.windowChoicesBattleCommands.unselect();
		this.battle.windowChoicesBattleCommands.select(this.battle.user.lastCommandIndex);
		this.battle.windowChoicesBattleCommands.offsetSelectedIndex = this.battle.user.lastCommandOffset;
		this.battle.skill = null;

		// Update skills list
		const skills = this.battle.user.player.skills;
		this.battle.listSkills = [];
		let ownedSkill: Skill, skill: System.Skill;
		for (let i = 0, l = skills.length; i < l; i++) {
			ownedSkill = skills[i];
			skill = Datas.Skills.get(ownedSkill.id);
			if (
				(skill.availableKind === AVAILABLE_KIND.ALWAYS || skill.availableKind === AVAILABLE_KIND.BATTLE) &&
				Interpreter.evaluate(skill.conditionFormula.getValue(), { user: this.battle.user.player }) &&
				this.battle.battlers[CHARACTER_KIND.MONSTER].every((battler) => {
					return Interpreter.evaluate(skill.conditionFormula.getValue(), {
						user: this.battle.user.player,
						target: battler.player,
					});
				})
			) {
				this.battle.listSkills.push(new Graphic.Skill(ownedSkill));
			}
		}
		this.battle.windowChoicesSkills.setContentsCallbacks(this.battle.listSkills);
		this.battle.windowSkillDescription.content = this.battle.windowChoicesSkills.getCurrentContent();
		this.battle.windowChoicesSkills.unselect();
		this.battle.windowChoicesSkills.offsetSelectedIndex = this.battle.user.lastSkillOffset;
		this.battle.windowChoicesSkills.select(this.battle.user.lastSkillIndex);
		this.battle.windowChoicesItems.unselect();
		this.battle.windowChoicesItems.offsetSelectedIndex = this.battle.user.lastItemOffset;
		this.battle.windowChoicesItems.select(this.battle.user.lastItemIndex);
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  When an ally is unselected.
	 */
	public onAllyUnselected() {
		switch (this.battle.battleCommandKind) {
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
				this.registerLastSkillIndex();
				break;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
				this.registerLastItemIndex();
				break;
			default:
				this.battle.subStep = 0;
				this.battle.user.setSelected(false);
				this.registerLastCommandIndex();
				break;
		}
		this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
	}

	/**
	 *  When a command is selected.
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	public onCommandSelected(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		switch (this.battle.battleCommandKind) {
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
				const skill = (<Graphic.Skill>this.battle.windowChoicesSkills.getCurrentContent()).system;
				if (skill.isPossible()) {
					this.battle.skill = skill;
					this.selectTarget(skill.targetKind);
					this.registerLastSkillIndex();
				}
				return;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
				const item = (<Graphic.Item>this.battle.windowItemDescription.content).item.system;
				if (item.isPossible()) {
					this.battle.skill = item;
					this.selectTarget(item.targetKind);
					this.registerLastItemIndex();
				}
				return;
			default:
				this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
				break;
		}
		const system = (<Graphic.TextIcon>this.battle.windowChoicesBattleCommands.getCurrentContent()).system;
		if (isKey) {
			this.battle.windowChoicesBattleCommands.onKeyPressed(options.key, system);
		} else {
			this.battle.windowChoicesBattleCommands.onMouseUp(options.x, options.y, system);
		}
		let i: number, l: number;
		switch (<EFFECT_SPECIAL_ACTION_KIND>this.battle.battleCommandKind) {
			case EFFECT_SPECIAL_ACTION_KIND.APPLY_WEAPONS:
				// Check weapon TARGET_KIND
				this.battle.attackSkill = (<Graphic.Skill>(
					this.battle.windowChoicesBattleCommands.getCurrentContent()
				)).system;
				this.battle.skill = this.battle.attackSkill;
				let targetKind = null;
				const equipments = this.battle.user.player.equip;
				let gameItem: Item;
				for (i = 0, l = equipments.length; i < l; i++) {
					gameItem = equipments[i];
					if (gameItem && gameItem.kind === ITEM_KIND.WEAPON) {
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
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
				if (
					this.battle.listSkills.length === 0 ||
					this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_USE_SKILLS)
				) {
					this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
				}
				break;
			case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
				if (
					this.battle.listItems.length === 0 ||
					this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_USE_ITEMS)
				) {
					this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
				}
				break;
			case EFFECT_SPECIAL_ACTION_KIND.ESCAPE:
				if (this.battle.user.containsRestriction(STATUS_RESTRICTIONS_KIND.CANT_ESCAPE)) {
					this.battle.battleCommandKind = EFFECT_SPECIAL_ACTION_KIND.NONE;
					break;
				}
				if (this.battle.canEscape) {
					this.battle.step = BATTLE_STEP.VICTORY;
					this.battle.subStep = 3;
					this.battle.transitionEnded = false;
					this.battle.time = new Date().getTime();
					this.battle.winning = true;
					Scene.Battle.escapedLastBattle = true;
					Manager.Songs.initializeProgressionMusic(
						System.PlaySong.currentPlayingMusic.volume.getValue(),
						0,
						0,
						Scene.Battle.TIME_LINEAR_MUSIC_END
					);
					for (i = 0, l = this.battle.battlers[CHARACTER_KIND.HERO].length; i < l; i++) {
						this.battle.battlers[CHARACTER_KIND.HERO][i].setEscaping();
					}
				}
				return;
			case EFFECT_SPECIAL_ACTION_KIND.END_TURN:
				this.battle.windowChoicesBattleCommands.unselect();
				this.battle.changeStep(BATTLE_STEP.ANIMATION);
				return;
			case EFFECT_SPECIAL_ACTION_KIND.NONE: // If any other skill that is not a special action
				const skill = <System.Skill>(
					(<Graphic.TextIcon>this.battle.windowChoicesBattleCommands.getCurrentContent()).system
				);
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
		const battlers = this.battle.battlers[this.battle.kindSelection];
		if (this.battle.all) {
			for (const battler of battlers) {
				if (
					!battler.hidden &&
					Interpreter.evaluate(this.battle.skill.targetConditionFormula.getValue(), {
						user: this.battle.user.player,
						target: battler.player,
					})
				) {
					this.battle.targets.push(battler);
				}
			}
		} else {
			this.battle.targets.push(battlers[this.selectedUserTargetIndex()]);
		}
		this.battle.skill = null;
		this.battle.windowChoicesBattleCommands.unselect();
		this.battle.changeStep(BATTLE_STEP.ANIMATION);
	}

	/**
	 *  When targets are unselected.
	 */
	public onTargetsUnselected() {
		this.battle.skill = null;
		this.battle.subStep = 1;
		this.battle.kindSelection = CHARACTER_KIND.HERO;
		this.battle.userTarget = false;
		this.battle.all = false;
		this.moveArrow();
	}

	/**
	 *  A scene action.
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	action(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
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
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	move(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		let index = this.selectedUserTargetIndex();
		switch (this.battle.subStep) {
			case 0:
			case 2:
				if (!this.battle.userTarget) {
					if (isKey) {
						if (
							Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards.menuControls.Up) ||
							Datas.Keyboards.isKeyEqual(
								options.key,
								this.battle.subStep === 0
									? Datas.Keyboards.menuControls.Left
									: Datas.Keyboards.menuControls.Right
							)
						) {
							index = this.indexArrowUp();
						} else if (
							Datas.Keyboards.isKeyEqual(options.key, Datas.Keyboards.menuControls.Down) ||
							Datas.Keyboards.isKeyEqual(
								options.key,
								this.battle.subStep === 0
									? Datas.Keyboards.menuControls.Right
									: Datas.Keyboards.menuControls.Left
							)
						) {
							index = this.indexArrowDown();
						}
					} else {
						let battler: Battler;
						for (let i = 0, l = this.battle.battlers[this.battle.kindSelection].length; i < l; i++) {
							battler = this.battle.battlers[this.battle.kindSelection][i];
							if (
								battler.isInside(options.x, options.y) &&
								this.battle.isDefined(this.battle.kindSelection, i, this.battle.subStep === 2)
							) {
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
					case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
						if (isKey) {
							this.battle.windowChoicesSkills.onKeyPressedAndRepeat(options.key);
						} else {
							this.battle.windowChoicesSkills.onMouseMove(options.x, options.y);
						}
						this.battle.windowSkillDescription.content =
							this.battle.windowChoicesSkills.getCurrentContent();
						break;
					case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
						if (isKey) {
							this.battle.windowChoicesItems.onKeyPressedAndRepeat(options.key);
						} else {
							this.battle.windowChoicesItems.onMouseMove(options.x, options.y);
						}
						this.battle.windowItemDescription.content = this.battle.windowChoicesItems.getCurrentContent();
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
	public onKeyPressedStep(key: string) {
		this.action(true, { key: key });
	}

	/**
	 *  Handle key released.
	 *  @param {number} key - The key ID
	 */
	public onKeyReleasedStep(key: string) {}

	/**
	 *  Handle key repeat pressed.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedRepeatStep(key: string): boolean {
		return true;
	}

	/**
	 *  Handle key pressed and repeat.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	public onKeyPressedAndRepeatStep(key: string): boolean {
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
			(<Graphic.Player>this.battle.windowTargetInformations.content).updateReverse(true);
			this.battle.windowTargetInformations.draw();
			(<Graphic.Player>this.battle.windowTargetInformations.content).updateReverse(false);
		}

		// Arrows
		const battlers = this.battle.battlers[this.battle.kindSelection];
		if (this.battle.all) {
			for (const battler of battlers) {
				battler.drawArrow();
			}
		} else {
			battlers[this.selectedUserTargetIndex()].drawArrow();
		}
		// Commands
		if (this.battle.subStep === 1) {
			this.battle.windowChoicesBattleCommands.draw();
			switch (this.battle.battleCommandKind) {
				case EFFECT_SPECIAL_ACTION_KIND.OPEN_SKILLS:
					this.battle.windowChoicesSkills.draw();
					this.battle.windowSkillDescription.draw();
					break;
				case EFFECT_SPECIAL_ACTION_KIND.OPEN_ITEMS:
					this.battle.windowChoicesItems.draw();
					this.battle.windowItemDescription.draw();
					break;
			}
		}
	}
}
export { BattleSelection };
