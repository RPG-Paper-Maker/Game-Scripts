/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A scene in the menu for describing players statistics
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "State" text
*   @property {WindowTabs} windowChoicesTabs Window for each tabs
*   @property {WindowBox} windowInformations Window for skill informations
*/
class SceneDescriptionState extends SceneGame
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

        // All the windows
        this.windowTop = new WindowBox(20, 20, 200, 30, 
            {
                content: new GraphicText("State", { align: Align.Center })
            }
        );
        this.windowChoicesTabs = new WindowChoices(50, 60, 110, RPM
            .SMALL_SLOT_HEIGHT, listHeroes,
            {
                orientation: OrientationWindow.Horizontal,
                nbItemsMax: 4
            }
        );
        this.windowInformations = new WindowBox(20, 100, 600, 340,
            {
                padding: RPM.HUGE_PADDING_BOX
            }
        );
        this.synchronize();

        this.loading = false;
        RPM.requestPaintHUD = true;
    }

    /** Synchronize informations with selected hero.
    */
    synchronize()
    {
        this.windowInformations.content = this.windowChoicesTabs
            .getCurrentContent();
    }

    // -------------------------------------------------------

    update()
    {
        SceneGame.prototype.update.call(RPM.currentMap);

        this.windowInformations.content.updateBattler();
    }

    // -------------------------------------------------------

    onKeyPressed(key)
    {
        SceneGame.prototype.onKeyPressed.call(RPM.currentMap, key);

        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Cancel) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .MainMenu))
        {
            RPM.datasGame.system.soundCancel.playSound();
            RPM.gameStack.pop();
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

        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        this.synchronize();
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
        this.windowInformations.draw();
    }
}