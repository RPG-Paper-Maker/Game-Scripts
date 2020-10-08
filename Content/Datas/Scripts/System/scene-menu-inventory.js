/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene in the menu for describing inventory
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "Inventory" text
*   @property {WindowTabs} windowChoicesTabs Window for each tabs
*   @property {WindowBox} windowInformations Window for item informations
*   @property {WindowChoices} windowChoicesList Window for each items
*/
class SceneMenuInventory extends SceneGame
{
    constructor()
    {
        super();
    }

    async load()
    {
        // Initializing the top menu for item kinds
        let menuKind = [
            new GraphicText("All", { align: Align.Center }),
            new GraphicText("Consumables", { align: Align.Center }),
            new GraphicText(RPM.datasGame.system.itemsTypes[1], { align: 
                Align.Center }),
            new GraphicText(RPM.datasGame.system.itemsTypes[2], { align: 
                Align.Center }),
            new GraphicText("Weapons", { align: Align.Center }),
            new GraphicText("Armors", { align: Align.Center })
        ];

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30,
            {
                content: new GraphicText("Inventory", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(5, 60, 105, RPM
            .SMALL_SLOT_HEIGHT, menuKind,
            {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 6
            }
        );
        this.windowChoicesList = new WindowChoices(20, 100, 200, RPM
            .SMALL_SLOT_HEIGHT, [],
            {
                nbItemsMax: SceneMenu.nbItemsToDisplay,
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
        this.windowBoxUseItem = new WindowBox(240, 320, 360, 140,
            {
                content: await GraphicUseSkillItem.create(),
                padding: RPM.SMALL_PADDING_BOX
            }
        );
        let l = menuKind.length;
        this.positionChoice = new Array(l);
        for (let i = 0; i < l; i++)
        {
            this.positionChoice[i] = {
                index: 0,
                offset: 0
            };
        }

        // Update for changing tab
        this.substep = 0;
        await this.updateForTab();
        this.synchronize();

        this.loading = false;
        RPM.requestPaintHUD = true;
    }

    /** Update informations to display.
    */
    synchronize()
    {
        this.windowInformations.content = this.windowChoicesList
            .getCurrentContent();
    }

    // -------------------------------------------------------
    /** Update tab.
    */
    async updateForTab()
    {
        let indexTab = this.windowChoicesTabs.currentSelectedIndex;
        let nbItems = RPM.game.items.length;
        let list = [];
        let ownedItem, item;
        for (let i = 0; i < nbItems; i++)
        {
            ownedItem = RPM.game.items[i];
            item = RPM.datasGame.items.list[ownedItem.id];
            if (indexTab === 0 || (indexTab === 1 && (ownedItem.k === ItemKind
                .Item && item.consumable)) || (indexTab === 2 && (ownedItem.k
                === ItemKind.Item && item.idType === 1)) || (indexTab === 3 && (
                ownedItem.k === ItemKind.Item && item.idType === 2)) || (
                indexTab === 4 && ownedItem.k === ItemKind.Weapon) || (indexTab 
                === 5 && ownedItem.k === ItemKind.Armor))
            {
                list.push(await GraphicItem.create(ownedItem));
            }
        }
        this.windowChoicesList.setContentsCallbacks(list);
        this.windowChoicesList.unselect();
        this.windowChoicesList.offsetSelectedIndex = this.positionChoice[
            indexTab].offset;
        this.windowChoicesList.select(this.positionChoice[indexTab].index);
    }

    async useItem()
    {
        RPM.game.useItem(this.windowInformations.content.gameItem);
        if (this.windowInformations.content.gameItem.nb > 0)
        {
            this.windowInformations.content.updateNb();
        } else
        {
            await this.updateForTab();
        }
        this.windowBoxUseItem.content.updateStats();
        RPM.requestPaintHUD = true;
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

        // List
        this.windowChoicesList.onKeyPressedAndRepeat(key);
        let position = this.positionChoice[this.windowChoicesTabs
            .currentSelectedIndex];
        position.index = this.windowChoicesList.currentSelectedIndex;
        position.offset = this.windowChoicesList.offsetSelectedIndex;

        this.synchronize();
    }

    // -------------------------------------------------------

    update()
    {
        SceneGame.prototype.update.call(RPM.currentMap);

        if (this.windowChoicesList.currentSelectedIndex !== -1)
        {
            this.windowBoxUseItem.update();
        }
    }

    // -------------------------------------------------------

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
                let targetKind = this.windowInformations.content.item.targetKind;
                let availableKind = this.windowInformations.content.item
                    .availableKind;
                if (this.windowInformations.content.item.consumable && (
                    targetKind === TargetKind.Ally || targetKind === TargetKind
                    .AllAllies) && (availableKind === AvailableKind.Always ||
                    availableKind === AvailableKind.MainMenu))
                {
                    RPM.datasGame.system.soundConfirmation.playSound();
                    this.substep = 1;
                    this.windowBoxUseItem.content.setAll(targetKind ===
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
                RPM.gameStack.pop();
            }
            break;
        case 1:
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                if (this.windowInformations.content.item.isPossible() && this
                    .windowInformations.content.item.use())
                {
                    this.useItem();
                }
            } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Cancel) || DatasKeyBoard.isKeyEqual(key, RPM
                .datasGame.keyBoard.MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                this.substep = 0;
                RPM.requestPaintHUD = true;
            }
            break;
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
        
        switch (this.substep)
        {
        case 0:
            this.moveTabKey(key);
            break;
        case 1:
            this.windowBoxUseItem.content.onKeyPressedAndRepeat(key);
            break;
        }
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
        this.windowChoicesList.draw();
        if (this.windowChoicesList.listWindows.length > 0)
        {
            this.windowInformations.draw();
            if (this.substep === 1)
            {
                this.windowBoxUseItem.draw();
            }
        } else
        {
            this.windowEmpty.draw();
        }
    }
}
