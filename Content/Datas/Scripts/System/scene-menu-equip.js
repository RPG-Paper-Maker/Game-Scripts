/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene in the menu for describing players equipments
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Equip" text
*   @property {WindowTabs} windowChoicesTabs Window for each tabs
*   @property {WindowBox} windowInformations Window for equip stats
*   informations
*   @property {WindowChoices} windowChoicesEquipment Window for each equipment
*   slot
*   @property {WindowChoices} windowChoicesList Window for each weapon/armor
*   @property {number} selectedEquipment Index of selected equipment
*/
class SceneMenuEquip extends SceneGame
{
    constructor()
    {
        super();
    }
    
    async load()
    {
        // Tab heroes
        let nbHeroes = RPM.game.teamHeroes.length;
        let listHeroes = new Array(nbHeroes);
        for (let i = 0; i < nbHeroes; i++)
        {
            listHeroes[i] = await GraphicPlayerDescription.create(RPM.game
                .teamHeroes[i]);
        }

        // Equipment
        let nbEquipments = RPM.datasGame.battleSystem.equipments.length - 1;
        let nbEquipChoice = SceneMenu.nbItemsToDisplay - nbEquipments - 1;

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30,
            {
                content: new GraphicText("Equip", { align: Align.Center })
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
        this.windowChoicesEquipment = new WindowChoices(20, 100, 290, RPM
            .SMALL_SLOT_HEIGHT, new Array(nbEquipments),
            {
                nbItemsMax: nbEquipments
            }
        );
        this.windowChoicesList = new WindowChoices(20, 100 + (nbEquipments + 1) * 
            RPM.SMALL_SLOT_HEIGHT, 290, RPM.SMALL_SLOT_HEIGHT, [],
            {
                nbItemsMax: nbEquipChoice,
                currentSelectedIndex: -1
            }
        );
        this.windowInformations = new WindowBox(330, 100, 285, 350,
            {
                padding: RPM.SMALL_PADDING_BOX
            }
        );

        // Updates
        await this.updateForTab();

        this.loading = false;
        RPM.requestPaintHUD = true;
    }

    /** Update tab
    */
    async updateForTab()
    {
        // update equipment
        let equipLength = GamePlayer.getEquipmentLength();
        let l = RPM.datasGame.battleSystem.equipmentsOrder.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++)
        {
            list[i] = new GraphicEquip(RPM.game.teamHeroes[this
                .windowChoicesTabs.currentSelectedIndex], RPM.datasGame
                .battleSystem.equipmentsOrder[i], equipLength);
        }
        this.windowChoicesEquipment.setContents(list);
        this.selectedEquipment = -1;
        this.windowChoicesList.unselect();
        await this.updateEquipmentList();
        this.updateInformations();
    }

    // -------------------------------------------------------
    /** Update the equipment list
    */
    async updateEquipmentList()
    {
        let idEquipment = RPM.datasGame.battleSystem.equipmentsOrder[this
            .windowChoicesEquipment.currentSelectedIndex];
        let list = [new GraphicText("[Remove]")];
        let item, systemItem, type, nbItem;
        for (let i = 0, l = RPM.game.items.length; i < l; i++)
        {
            item = RPM.game.items[i];
            if (item.k !== ItemKind.Item)
            {
                systemItem = item.getItemInformations();
                type = systemItem.getType();
                if (type.equipments[idEquipment])
                {
                    nbItem = item.nb;
                    if (nbItem > 0)
                    {
                        list.push(await GraphicItem.create(item, nbItem));
                    }
                }
            }
        }
        this.windowChoicesList.setContentsCallbacks(list, null, -1);
    }

    // -------------------------------------------------------
    /** Update the informations to display for equipment stats.
    */
    updateInformations()
    {
        let gamePlayer = RPM.game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        if (this.selectedEquipment === -1)
        {
            this.list = [];
        } else
        {
            let item = this.windowChoicesList.getCurrentContent();
            if (item === null)
            {
                this.list = [];
            } else
            {
                let result = gamePlayer.getEquipmentStatsAndBonus(item.item, RPM
                    .datasGame.battleSystem.equipmentsOrder[this
                    .windowChoicesEquipment.currentSelectedIndex]);
                this.list = result[0];
                this.bonus = result[1];
            }
        }
        this.windowInformations.content = new GraphicEquipStats(gamePlayer, this
            .list);
    }

    async moveTabKey(key)
    {
        // Tab
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        if (indexTab !== this.windowChoicesTabs.currentSelectedIndex)
        {
            await this.updateForTab();
        }

        // Equipment
        if (this.selectedEquipment === -1)
        {
            let indexEquipment = this.windowChoicesEquipment
                .currentSelectedIndex;
            this.windowChoicesEquipment.onKeyPressedAndRepeat(key);
            if (indexEquipment !== this.windowChoicesEquipment
                .currentSelectedIndex)
            {
                await this.updateEquipmentList();
            }
        } else
        {
            let indexList = this.windowChoicesList.currentSelectedIndex;
            this.windowChoicesList.onKeyPressedAndRepeat(key);
            if (indexList !== this.windowChoicesList.currentSelectedIndex)
            {
                this.updateInformations();
            }
        }
    }

    /** Remove the equipment of the character
    */
    remove()
    {
        let character = RPM.game.teamHeroes[this.windowChoicesTabs
            .currentSelectedIndex];
        let id = RPM.datasGame.battleSystem.equipmentsOrder[this
            .windowChoicesEquipment.currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = null;
        if (prev)
        {
            prev.add(1);
        }
        this.updateStats();
    }

    // -------------------------------------------------------
    /** Equip the selected equipment
    */
    equip()
    {
        let index = this.windowChoicesTabs.currentSelectedIndex;
        let character = RPM.game.teamHeroes[index];
        let gameItem = this.windowChoicesList.getCurrentContent().gameItem;
        let id = RPM.datasGame.battleSystem.equipmentsOrder[this
            .windowChoicesEquipment.currentSelectedIndex];
        let prev = character.equip[id];
        character.equip[id] = gameItem;

        // Remove one equip from inventory
        let item;
        for (let i = 0, l = RPM.game.items.length; i < l; i++)
        {
            item = RPM.game.items[i];
            if (item.k === gameItem.k && item.id === gameItem.id)
            {
                item.remove(1);
                break;
            }
        }
        if (prev)
        {
            prev.add(1);
        }
        this.updateStats();
    }

    // -------------------------------------------------------

    updateStats()
    {
        RPM.game.teamHeroes[this.windowChoicesTabs.currentSelectedIndex]
            .updateEquipmentStats(this.list, this.bonus);
    }

    // -------------------------------------------------------

    update()
    {
        SceneGame.prototype.update.call(RPM.currentMap);
    }

    // -------------------------------------------------------

    onKeyPressed(key)
    {
        SceneGame.prototype.onKeyPressed.call(RPM.currentMap, key);

        if (this.selectedEquipment === -1)
        {
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                RPM.gameStack.pop();
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                RPM.datasGame.system.soundConfirmation.playSound();
                this.selectedEquipment = this.windowChoicesEquipment
                    .currentSelectedIndex;
                this.windowChoicesList.currentSelectedIndex = 0;
                this.updateInformations();
                this.windowChoicesList.selectCurrent();
            }
        } else
        {
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                this.selectedEquipment = -1;
                this.windowChoicesList.unselect();
                this.updateInformations();
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                if (this.windowChoicesList.getCurrentContent() !== null)
                {
                    RPM.datasGame.system.soundConfirmation.playSound();
                    if (this.windowChoicesList.currentSelectedIndex === 0)
                    {
                        this.remove();
                    } else
                    {
                        this.equip();
                    }
                    this.selectedEquipment = -1;
                    this.windowChoicesList.unselect();
                    this.updateForTab();
                } else
                {
                    RPM.datasGame.system.soundImpossible.playSound();
                }
            }
        }
    }

    // -------------------------------------------------------

    onKeyReleased(key)
    {
        SceneGame.prototype.onKeyReleased.call(RPM.currentMap, key);
    }

    // -------------------------------------------------------

    onKeyPressedRepeat(key)
    {
        SceneGame.prototype.onKeyPressedRepeat.call(RPM.currentMap, key);
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(key)
    {
        SceneGame.prototype.onKeyPressedAndRepeat.call(RPM.currentMap, key);
        
        this.moveTabKey(key);
    }

    // -------------------------------------------------------

    draw3D()
    {
        RPM.currentMap.draw3D();
    }

    // -------------------------------------------------------

    drawHUD()
    {
        // Draw the local map behind
        RPM.currentMap.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowChoicesEquipment.draw();
        this.windowChoicesList.draw();
        this.windowInformations.draw();
    }
}
