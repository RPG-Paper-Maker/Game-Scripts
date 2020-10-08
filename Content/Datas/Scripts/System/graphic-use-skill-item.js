/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS GraphicUseSkillItem
//
// -------------------------------------------------------

/** @class
*/
class GraphicUseSkillItem
{
    constructor()
    {

    }

    async load()
    {
        this.graphicCharacters = new Array;
        let player;
        for (let i = 0, l = RPM.game.teamHeroes.length; i < l; i++)
        {
            player = await GraphicPlayer.create(RPM.game.teamHeroes[i]);
            player.initializeCharacter(true);
            this.graphicCharacters.push(player);
        }
        this.setAll(false);
    }

    static async create()
    {
        let graphic = new GraphicUseSkillItem();
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

    setAll(b)
    {
        this.all = b;
        if (b)
        {
            let l = RPM.game.teamHeroes.length;
            RPM.currentMap.targets = new Array(l);
            for (let i = 0; i < l; i++)
            {
                RPM.currentMap.targets[i] = RPM.game.teamHeroes[i];
            }
        } else
        {
            this.indexArrow = 0;
            RPM.currentMap.targets = [RPM.game.teamHeroes[this.indexArrow]];
        }
    }

    // -------------------------------------------------------

    update()
    {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++)
        {
            this.graphicCharacters[i].updateBattler();
        }
    }

    // -------------------------------------------------------

    updateStats()
    {
        for (let i = 0, l = this.graphicCharacters.length; i < l; i++)
        {
            this.graphicCharacters[i].update();
        }
    }

    // -------------------------------------------------------

    goLeft()
    {
        this.moveArrow(this.indexArrow - 1);
    }

    // -------------------------------------------------------

    goRight()
    {
        this.moveArrow(this.indexArrow + 1);
    }

    // -------------------------------------------------------

    moveArrow(index)
    {
        if (!this.isAll)
        {
            this.indexArrow = RPM.mod(index, this.graphicCharacters.length);
            if (this.indexArrow !== index)
            {
                RPM.datasGame.system.soundCursor.playSound();
            }
            RPM.currentMap.targets = [RPM.game.teamHeroes[this.indexArrow]];
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------

    onKeyPressedAndRepeat(key)
    {
        if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
            .Right))
        {
            this.goRight();
        } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
            .menuControls.Left))
        {
            this.goLeft();
        }
    }

    // -------------------------------------------------------

    drawArrowAtIndex(index, x, y, h)
    {
        RPM.datasGame.system.getWindowSkin().drawArrowTarget(this
            .graphicCharacters[index].battlerFrame, x + 32 + (index * 85), y + h
            - 20);
    }

    // -------------------------------------------------------
    /** Drawing the save informations
    *   @param {number} x The x position to draw graphic
    *   @param {number} y The y position to draw graphic
    *   @param {number} w The width dimention to draw graphic
    *   @param {number} h The height dimention to draw graphic
    */
    drawBox(x, y, w, h)
    {
        let i, l;
        for (i = 0, l = this.graphicCharacters.length; i < l; i++)
        {
            this.graphicCharacters[i].drawCharacter(x + 5 + (i * 85), y - 32, w,
                h);
        }
        if (this.all)
        {
            for (i = 0; i < l; i++)
            {
                this.drawArrowAtIndex(i, x, y, h);
            }
        } else
        {
            this.drawArrowAtIndex(this.indexArrow, x, y, h);
        }
    }
}