/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, AVAILABLE_KIND, Constants, ORIENTATION_WINDOW, ScreenResolution, TARGET_KIND } from '../Common';
import { Battler, Game, Rectangle, WindowBox, WindowChoices } from '../Core';
import { Data, Graphic, Manager, Scene } from '../index';
import { Base } from './Base';
import { StructPositionChoice } from './Menu';

/** @class
 *  A scene in the menu for describing players skills.
 *  @extends Scene.Base
 */
class MenuSkills extends Base {
	public positionChoice: StructPositionChoice[];
	public windowTop: WindowBox;
	public windowChoicesTabs: WindowChoices;
	public windowChoicesList: WindowChoices;
	public windowBoxInformation: WindowBox;
	public windowEmpty: WindowBox;
	public windowBoxUseSkill: WindowBox;
	public substep: number;
	public title: string;

	constructor(title: string) {
		super(false);

		this.title = title;

		// Tab heroes
		const nbHeroes = Game.current.teamHeroes.length;
		const listHeroes = new Array(nbHeroes);
		this.positionChoice = new Array(nbHeroes);
		for (let i = 0; i < nbHeroes; i++) {
			listHeroes[i] = new Graphic.PlayerDescription(Game.current.teamHeroes[i]);
			this.positionChoice[i] = {
				index: 0,
				offset: 0,
			};
		}

		// All the windows
		this.windowTop = new WindowBox(20, 20, 200, 30, {
			content: new Graphic.Text(this.title, { align: ALIGN.CENTER }),
		});
		this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox.SMALL_SLOT_HEIGHT, listHeroes, {
			orientation: ORIENTATION_WINDOW.HORIZONTAL,
			nbItemsMax: 4,
			padding: [0, 0, 0, 0],
		});
		this.createWindowChoicesList();
		this.createWindowBoxInformation();
		this.windowEmpty = new WindowBox(10, 100, ScreenResolution.SCREEN_X - 20, WindowBox.SMALL_SLOT_HEIGHT, {
			content: new Graphic.Text(Data.Languages.extras.empty.name(), { align: ALIGN.CENTER }),
			padding: WindowBox.SMALL_SLOT_PADDING,
		});
		this.windowBoxUseSkill = new WindowBox(240, 320, 360, 140, {
			content: new Graphic.UseSkillItem(),
			padding: WindowBox.SMALL_PADDING_BOX,
		});

		// Update for changing tab
		this.substep = 0;
		this.updateForTab();
		this.synchronize();
	}

	/**
	 *  Create the choice list.
	 */
	createWindowChoicesList() {
		const rect = new Rectangle(
			Constants.HUGE_SPACE,
			Constants.HUGE_SPACE + (WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2,
			WindowBox.LARGE_SLOT_WIDTH,
			WindowBox.SMALL_SLOT_HEIGHT,
		);
		const options = {
			nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY,
		};
		this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, [], options);
	}

	/**
	 *  Create the information window.
	 */
	createWindowBoxInformation() {
		const width =
			ScreenResolution.SCREEN_X - Constants.HUGE_SPACE * 2 - WindowBox.LARGE_SLOT_WIDTH - Constants.LARGE_SPACE;
		const height = 200;
		const rect = new Rectangle(
			ScreenResolution.SCREEN_X - Constants.HUGE_SPACE - width,
			Constants.HUGE_SPACE + (WindowBox.SMALL_SLOT_HEIGHT + Constants.LARGE_SPACE) * 2,
			width,
			height,
		);
		const options = {
			padding: WindowBox.HUGE_PADDING_BOX,
		};
		this.windowBoxInformation = new WindowBox(rect.x, rect.y, rect.width, rect.height, options);
	}

	/**
	 *  Synchronize informations with selected hero.
	 */
	synchronize() {
		this.windowBoxInformation.content = this.windowChoicesList.getCurrentContent();
	}

	/**
	 *  Update tab
	 */
	updateForTab() {
		const indexTab = this.windowChoicesTabs.currentSelectedIndex;
		Scene.Map.current.user = new Battler(Game.current.teamHeroes[indexTab]);
		const skills = Scene.Map.current.user.player.skills;

		// Get the first skills of the hero
		const list = [];
		for (let i = 0, l = skills.length; i < l; i++) {
			list.push(new Graphic.Skill(skills[i]));
		}

		// Update the list
		this.windowChoicesList.setContentsCallbacks(list);
		this.windowChoicesList.unselect();
		this.windowChoicesList.offsetSelectedIndex = this.positionChoice[indexTab].offset;
		this.windowChoicesList.select(this.positionChoice[indexTab].index);
		Scene.Map.current.user = new Battler(Game.current.teamHeroes[indexTab]);
	}

	/**
	 *  Move tab according to key.
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	moveTabKey(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		// Tab
		const indexTab = this.windowChoicesTabs.currentSelectedIndex;
		if (isKey) {
			this.windowChoicesTabs.onKeyPressedAndRepeat(options.key);
		} else {
			this.windowChoicesTabs.onMouseMove(options.x, options.y);
		}
		if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
			this.updateForTab();
		}
		// List
		if (isKey) {
			this.windowChoicesList.onKeyPressedAndRepeat(options.key);
		} else {
			this.windowChoicesList.onMouseMove(options.x, options.y);
		}
		const position = this.positionChoice[this.windowChoicesTabs.currentSelectedIndex];
		position.index = this.windowChoicesList.currentSelectedIndex;
		position.offset = this.windowChoicesList.offsetSelectedIndex;
		this.synchronize();
	}

	/**
	 *  A scene action.
	 *  @param {boolean} isKey
	 *  @param {{ key?: string, x?: number, y?: number }} [options={}]
	 */
	action(isKey: boolean, options: { key?: string; x?: number; y?: number } = {}) {
		const graphic = <Graphic.Skill>this.windowBoxInformation.content;
		const graphicUse = <Graphic.UseSkillItem>this.windowBoxUseSkill.content;
		switch (this.substep) {
			case 0:
				if (Scene.MenuBase.checkActionMenu(isKey, options)) {
					if (this.windowBoxInformation.content === null) {
						return;
					}
					const targetKind = graphic.system.targetKind;
					const availableKind = graphic.system.availableKind;
					if (
						graphic.system.isPossible() &&
						(targetKind === TARGET_KIND.ALLY || targetKind === TARGET_KIND.ALL_ALLIES) &&
						(availableKind === AVAILABLE_KIND.ALWAYS || availableKind === AVAILABLE_KIND.MAIN_MENU)
					) {
						Data.Systems.soundConfirmation.playSound();
						this.substep = 1;
						graphicUse.setSkillItem(graphic.system);
						graphicUse.setAll(targetKind === TARGET_KIND.ALL_ALLIES);
						Manager.Stack.requestPaintHUD = true;
					} else {
						Data.Systems.soundImpossible.playSound();
					}
				} else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
					Data.Systems.soundCancel.playSound();
					Scene.Map.current.user = null;
					Manager.Stack.pop();
				}
				break;
			case 1:
				if (Scene.MenuBase.checkActionMenu(isKey, options)) {
					if (graphic.system.use()) {
						graphic.system.sound.playSound();
						(<Graphic.UseSkillItem>this.windowBoxUseSkill.content).updateStats();
						if (!graphic.system.isPossible()) {
							this.substep = 0;
						}
						Manager.Stack.requestPaintHUD = true;
					}
				} else if (Scene.MenuBase.checkCancelMenu(isKey, options)) {
					Data.Systems.soundCancel.playSound();
					this.substep = 0;
					Manager.Stack.requestPaintHUD = true;
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
		switch (this.substep) {
			case 0:
				this.moveTabKey(isKey, options);
				break;
			case 1:
				if (isKey) {
					(<Graphic.UseSkillItem>this.windowBoxUseSkill.content).onKeyPressedAndRepeat(options.key);
				} else {
					(<Graphic.UseSkillItem>this.windowBoxUseSkill.content).onMouseMove(options.x, options.y);
				}
				break;
		}
	}

	/**
	 *  Update the scene.
	 */
	update() {
		super.update();
		this.windowChoicesList.update();
		this.windowChoicesTabs.update();
		if (this.windowChoicesList.currentSelectedIndex !== -1) {
			this.windowBoxUseSkill.update();
		}
	}

	/**
	 *  Handle scene key pressed.
	 *  @param {number} key - The key ID
	 */
	onKeyPressed(key: string) {
		super.onKeyPressed(key);
		if (this.reactionInterpreters.length === 0) {
			this.action(true, { key: key });
		}
	}

	/**
	 *  Handle scene key released.
	 *  @param {number} key - The key ID
	 */
	onKeyReleased(key: string) {
		super.onKeyReleased(key);
	}

	/**
	 *  Handle scene pressed repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedRepeat(key: string): boolean {
		return super.onKeyPressedRepeat(key);
	}

	/**
	 *  Handle scene pressed and repeat key.
	 *  @param {number} key - The key ID
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(key: string): boolean {
		const res = super.onKeyPressedAndRepeat(key);
		if (this.reactionInterpreters.length === 0) {
			this.move(true, { key: key });
		}
		return res;
	}

	/**
	 *  @inheritdoc
	 */
	onMouseMove(x: number, y: number) {
		super.onMouseMove(x, y);
		if (this.reactionInterpreters.length === 0) {
			this.move(false, { x: x, y: y });
		}
	}

	/**
	 *  @inheritdoc
	 */
	onMouseUp(x: number, y: number) {
		super.onMouseUp(x, y);
		if (this.reactionInterpreters.length === 0) {
			this.action(false, { x: x, y: y });
		}
	}

	/**
	 *  Draw the HUD scene.
	 */
	drawHUD() {
		// Draw the local map behind
		Scene.Map.current.drawHUD();

		// Draw the menu
		this.windowTop.draw();
		this.windowChoicesTabs.draw();
		this.windowChoicesList.draw();
		if (this.windowChoicesList.listWindows.length > 0) {
			this.windowBoxInformation.draw();
			if (this.substep === 1) {
				this.windowBoxUseSkill.draw();
			}
		} else {
			this.windowEmpty.draw();
		}

		// Draw interpreters
		super.drawHUD();
	}
}

export { MenuSkills };
