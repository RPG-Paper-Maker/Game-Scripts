/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene in the menu for describing players skills
*   @extends SceneGame
*   @property {Object[]} positionChoice The position choices index + offset for 
*   each player
*   @property {WindowBox} windowTop Window on top with "Skills" text
*   @property {WindowTabs} windowChoicesTabs Window for each tabs
*   @property {WindowChoices} windowChoicesList Window for each skill
*   @property {WindowBox} windowInformations Window for skill informations
*   @property {WindowBox} windowEmpty The window box empty
*   @property {WindowBox} windowBoxUseSkill The window box for using skill
*   @property {number} substep The subset for using skill
*/
class SceneMenuSkills extends SceneGame
{   
    constructor()
    {
        super(false);

        // Tab heroes
        let nbHeroes = RPM.game.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        this.positionChoice = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++)
        {
            listHeroes[i] = new GraphicPlayerDescription(RPM.game.teamHeroes[i]);
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, 
            {
                content: new GraphicText("Skills", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, RPM
            .SMALL_SLOT_HEIGHT, listHeroes, 
            {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 4,
                padding: [0, 0, 0, 0]
            }
        );
        this.windowChoicesList = new WindowChoices(20, 100, 200, RPM
            .SMALL_SLOT_HEIGHT, [],
            {
                nbItemsMax: SceneMenu.nbItemsToDisplay
            }
        );
        this.windowInformations = new WindowBox(240, 100, 360, 200, 
            {
                padding: RPM.HUGE_PADDING_BOX
            }
        );
        this.windowEmpty = new WindowBox(10, 100, RPM.SCREEN_X - 20, RPM
            .SMALL_SLOT_HEIGHT,
            {
                content: new GraphicText("Empty", { align: Align.Center }),
                padding: RPM.SMALL_SLOT_PADDING
            }
        );
        this.windowBoxUseSkill = new WindowBox(240, 320, 360, 140,
            {
                content: new GraphicUseSkillItem(),
                padding: RPM.SMALL_PADDING_BOX
            }
        );

        // Update for changing tab
        this.substep = 0;
        this.updateForTab();
        this.synchronize();
    }

    // -------------------------------------------------------
    /** Synchronize informations with selected hero
    */
    synchronize()
    {
        this.windowInformations.content = this.windowChoicesList
            .getCurrentContent();
    }

    // -------------------------------------------------------
    /** Update tab
    */
    updateForTab()
    {
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        RPM.currentMap.user = RPM.game.teamHeroes[indexTab];
        let skills = RPM.currentMap.user.sk;

        // Get the first skills of the hero
        let list = [];
        for (let i = 0, l = skills.length; i < l; i++)
        {
            list.push(new GraphicSkill(skills[i]));
        }

        // Update the list
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[
            indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
        RPM.currentMap.user = RPM.game.teamHeroes[indexTab];
    }

    // -------------------------------------------------------
    /** Move tab according to key
    *   @param {number} key The key ID 
    */
    moveTabKey(key)
    {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
        {
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

    // -------------------------------------------------------
    /** Update the scene
    */
    update()
    {
        SceneGame.prototype.update.call(RPM.currentMap);

        if (this.windowChoicesList.currentSelectedIndex !== -1)
        {
            this.windowBoxUseSkill.update();
        }
    }

    // -------------------------------------------------------
    /** Handle scene key pressed
    *   @param {number} key The key ID
    */
    onKeyPressed(key)
    {
        SceneGame.prototype.onKeyPressed.call(RPM.currentMap, key);

        switch (this.substep)
        {
        case 0:
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                if (this.windowInformations.content === null)
                {
                    return;
                }
                let targetKind = this.windowInformations.content.skill
                    .targetKind;
                let availableKind = this.windowInformations.content.skill
                    .availableKind;
                if (this.windowInformations.content.skill.isPossible() && (
                    targetKind === TargetKind.Ally || targetKind === TargetKind
                    .AllAllies) && (availableKind === AvailableKind.Always ||
                    availableKind === AvailableKind.MainMenu))
                {
                    RPM.datasGame.system.soundConfirmation.playSound();
                    this.substep = 1;
                    this.windowBoxUseSkill.content.setAll(targetKind ===
                        TargetKind.AllAllies);
                    RPM.requestPaintHUD = true;
                } else
                {
                    RPM.datasGame.system.soundImpossible.playSound();
                }
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                RPM.currentMap.user = null;
                RPM.gameStack.pop();
            }
            break;
        case 1:
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                if (this.windowInformations.content.skill.use())
                {
                    this.windowInformations.content.skill.sound.playSound();
                    this.windowBoxUseSkill.content.updateStats();
                    if (!this.windowInformations.content.skill.isPossible())
                    {
                        this.substep = 0;
                    }
                    RPM.requestPaintHUD = true;
                }
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key,
                RPM.datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                this.substep = 0;
                RPM.requestPaintHUD = true;
            }
            break;
        }
    }

    // -------------------------------------------------------
    /** Handle scene key released
    *   @param {number} key The key ID
    */
    onKeyReleased(key)
    {
        SceneGame.prototype.onKeyReleased.call(RPM.currentMap, key);
    }

    // -------------------------------------------------------
    /** Handle scene pressed repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedRepeat(key)
    {
        SceneGame.prototype.onKeyPressedRepeat.call(RPM.currentMap, key);
    }

    // -------------------------------------------------------
    /** Handle scene pressed and repeat key
    *   @param {number} key The key ID
    *   @returns {boolean}
    */
    onKeyPressedAndRepeat(key)
    {
        SceneGame.prototype.onKeyPressedAndRepeat.call(RPM.currentMap, key);
        
        switch (this.substep)
        {
        case 0:
            this.moveTabKey(key);
            break;
        case 1:
            this.windowBoxUseSkill.content.onKeyPressedAndRepeat(key);
            break;
        }
    }

    // -------------------------------------------------------
    /** Draw the 3D scene
    */
    draw3D()
    {
        RPM.currentMap.draw3D();
    }

    // -------------------------------------------------------
    /** Draw the HUD scene
    */
    drawHUD()
    {
        // Draw the local map behind
        RPM.currentMap.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesList.draw();
        if (this.windowChoicesList.listWindows.length > 0)
        {
            this.windowInformations.draw();
            if (this.substep === 1)
            {
                this.windowBoxUseSkill.draw();
            }
        } else
        {
            this.windowEmpty.draw();
        }
    }
}