/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Manager, Graphic, Scene, Datas } from "../index";
import { StructPositionChoice } from "./index";
import { WindowBox, WindowChoices } from "../Core";
import { Enum, ScreenResolution } from "../Common";
import Align = Enum.Align;
import OrientationWindow = Enum.OrientationWindow;
import TargetKind = Enum.TargetKind;
import AvailableKind = Enum.AvailableKind;

/** @class
 *  A scene in the menu for describing players skills.
 *  @extends Scene.Base
 */
class MenuSkills extends Base {

    public positionChoice: StructPositionChoice[];
    public windowTop: WindowBox;
    public windowChoicesTabs: WindowChoices;
    public windowChoicesList: WindowChoices;
    public windowInformations: WindowBox;
    public windowEmpty: WindowBox;
    public windowBoxUseSkill: WindowBox;
    public substep: number;

    constructor() {
        super(false);

        // Tab heroes
        let nbHeroes = Manager.Stack.game.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        this.positionChoice = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++) {
            listHeroes[i] = new Graphic.PlayerDescription(Manager.Stack.game
                .teamHeroes[i]);
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, {
                content: new Graphic.Text("Skills", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, WindowBox
            .SMALL_SLOT_HEIGHT, listHeroes, {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 4,
                padding: [0, 0, 0, 0]
            }
        );
        this.windowChoicesList = new WindowChoices(20, 100, 200, WindowBox
            .SMALL_SLOT_HEIGHT, [], {
                nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY
            }
        );
        this.windowInformations = new WindowBox(240, 100, 360, 200, {
                padding: WindowBox.HUGE_PADDING_BOX
            }
        );
        this.windowEmpty = new WindowBox(10, 100, ScreenResolution.SCREEN_X - 20
            , WindowBox.SMALL_SLOT_HEIGHT, {
                content: new Graphic.Text("Empty", { align: Align.Center }),
                padding: WindowBox.SMALL_SLOT_PADDING
            }
        );
        this.windowBoxUseSkill = new WindowBox(240, 320, 360, 140, {
                content: new Graphic.UseSkillItem(),
                padding: WindowBox.SMALL_PADDING_BOX
            }
        );

        // Update for changing tab
        this.substep = 0;
        this.updateForTab();
        this.synchronize();
    }

    /** 
     *  Synchronize informations with selected hero.
     */
    synchronize() {
        this.windowInformations.content = this.windowChoicesList
            .getCurrentContent();
    }

    /** 
     *  Update tab
     */
    updateForTab() {
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        Manager.Stack.currentMap.user = Manager.Stack.game.teamHeroes[indexTab];
        let skills = Manager.Stack.currentMap.user.sk;

        // Get the first skills of the hero
        let list = [];
        for (let i = 0, l = skills.length; i < l; i++) {
            list.push(new Graphic.Skill(skills[i]));
        }

        // Update the list
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[
            indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
        Manager.Stack.currentMap.user = Manager.Stack.game.teamHeroes[indexTab];
    }

    /** 
     *  Move tab according to key.
     *  @param {number} key The key ID 
     */
    moveTabKey(key: number) {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex) {
            this.updateForTab();
        }

        // List
        this.windowChoicesList.onKeyPressedAndRepeat(key);
        let position = this.positionChoice[this.windowChoicesTabs
            .currentSelectedIndex];
        position.index = this.windowChoicesList.currentSelectedIndex;
        position.offset = this.windowChoicesList.offsetSelectedIndex;

        this.synchronize();
    }

    /**
     *  Update the scene.
     */
    update() {
        Scene.Base.prototype.update.call(Manager.Stack.currentMap);
        if (this.windowChoicesList.currentSelectedIndex !== -1) {
            this.windowBoxUseSkill.update();
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key The key ID
     */
    onKeyPressed(key: number) {
        Scene.Base.prototype.onKeyPressed.call(Manager.Stack.currentMap, key);
        let graphic = <Graphic.Skill> this.windowInformations.content;
        switch (this.substep) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action))
                {
                    if (this.windowInformations.content === null) {
                        return;
                    }
                    let targetKind = graphic.system.targetKind;
                    let availableKind = graphic.system.availableKind;
                    if (graphic.system.isPossible() && (targetKind === 
                        TargetKind.Ally || targetKind === TargetKind.AllAllies) 
                        && (availableKind === AvailableKind.Always || 
                        availableKind === AvailableKind.MainMenu))
                    {
                        Datas.Systems.soundConfirmation.playSound();
                        this.substep = 1;
                        (<Graphic.UseSkillItem> this.windowBoxUseSkill.content)
                            .setAll(targetKind === TargetKind.AllAllies);
                        Manager.Stack.requestPaintHUD = true;
                    } else {
                        Datas.Systems.soundImpossible.playSound();
                    }
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, 
                    Datas.Keyboards.controls.MainMenu))
                {
                    Datas.Systems.soundCancel.playSound();
                    Manager.Stack.currentMap.user = null;
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
                    .Action))
                {
                    if (graphic.system.use()) {
                        graphic.system.sound.playSound();
                        (<Graphic.UseSkillItem> this.windowBoxUseSkill.content)
                            .updateStats();
                        if (!graphic.system.isPossible()) {
                            this.substep = 0;
                        }
                        Manager.Stack.requestPaintHUD = true;
                    }
                } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key,
                    Datas.Keyboards.controls.MainMenu))
                {
                    Datas.Systems.soundCancel.playSound();
                    this.substep = 0;
                    Manager.Stack.requestPaintHUD = true;
                }
                break;
        }
    }

    /** 
     *  Handle scene key released.
     *  @param {number} key The key ID
     */
    onKeyReleased(key: number) {
        Scene.Base.prototype.onKeyReleased.call(Manager.Stack.currentMap, key);
    }

    /** 
     *  Handle scene pressed repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean {
        return Scene.Base.prototype.onKeyPressedRepeat.call(Manager.Stack
            .currentMap, key);
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = Scene.Base.prototype.onKeyPressedAndRepeat.call(Manager.Stack
            .currentMap, key);
        switch (this.substep) {
            case 0:
                this.moveTabKey(key);
                break;
            case 1:
                (<Graphic.UseSkillItem> this.windowBoxUseSkill.content)
                    .onKeyPressedAndRepeat(key);
                break;
        }
        return res;
    }

    /** 
     *  Draw the HUD scene
     */
    drawHUD() {
        // Draw the local map behind
        Manager.Stack.currentMap.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesList.draw();
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

export { MenuSkills }