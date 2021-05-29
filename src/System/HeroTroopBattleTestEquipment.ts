/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, System } from "..";
import { Enum, Utils } from "../Common";
import { Item, Player } from "../Core";
import { Base } from "./Base";

/** @class
 *  An hero equipment troop battle test.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  equipment
 */
class HeroTroopBattleTestEquipment extends Base {

    public id: number;
    public kind: number;
    public weaponArmorID: number;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the equipment.
     *  @param {Record<string, any>} - json Json object describing the equipment
     */
    read(json: Record<string, any>) {
        this.id = json.id;
        this.kind = Utils.defaultValue(json.kind, 0);
        this.weaponArmorID = Utils.defaultValue(json.weaponArmorID, 1);
    }

    /** 
     *  Equip the equipments to a player.
     *  @param {Player} player
     */
    equip(player: Player) {
        if (this.kind !== 0) {
            player.equip[this.id] = new Item(this.kind === 1 ? Enum.ItemKind
                .Weapon : Enum.ItemKind.Armor, this.weaponArmorID, 1);
        }
    }
}

export { HeroTroopBattleTestEquipment }