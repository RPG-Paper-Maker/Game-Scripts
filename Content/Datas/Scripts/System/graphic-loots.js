/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The graphic displaying all the items dropped at the end of a battle
*/
class GraphicLoots
{
    constructor(loots, nb)
    {
        this.loots = loots;
        this.nb = nb;
    }

    async load()
    {
        let order = [LootKind.Weapon, LootKind.Armor, LootKind.Item];
        this.graphicsLoots = new Array(this.nb);
        let list, id;
        for (let i = 0, j = 0, l = order.length; i < l; i++)
        {
            list = this.loots[order[i]];
            for (id in list)
            {
                this.graphicsLoots[j] = await GraphicItem.create(list[id]);
                j++;
            }
        }
    }

    static async create(loots, nb)
    {
        let graphic = new GraphicLoots(loots, nb);
        await RPM.tryCatch(graphic.load());
        return graphic;
    }

    /** Drawing the loots.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawBox(x, y, w, h)
    {
        for (let i = 0, l = this.graphicsLoots.length; i < l; i++)
        {
            this.graphicsLoots[i].drawChoice(x, y + (i * 30), w, 30);
        }
    }
}