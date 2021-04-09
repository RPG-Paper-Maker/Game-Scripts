/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Datas, Scene } from "../index";
import { Utils, Enum, Mathf, KeyEvent, Interpreter } from "../Common";
import ConditionHeroesKind = Enum.ConditionHeroesKind;
import ItemKind = Enum.ItemKind;
import { Player, MapObject, Item, Game, StructSearchResult } from "../Core";

/** @class
 *  An event command for condition event command block.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class If extends Base {

    public hasElse: boolean;
    public kind: number;
    public variableParamProp: System.DynamicValue;
    public variableParamPropOperationKind: number;
    public variableParamPropValue: System.DynamicValue;
    public heroesSelection: number;
    public heroInstanceID: System.DynamicValue;
    public heroesInTeam: boolean;
    public heroesInTeamSelection: number;
    public heroesKind: number;
    public heroesNamed: System.DynamicValue;
    public heroesInTeamValue: number;
    public heroesSkillID: System.DynamicValue;
    public heroesEquipedKind: number;
    public heroesEquipedWeaponID: System.DynamicValue;
    public heroesEquipedArmorID: System.DynamicValue;
    public heroesStatusID: System.DynamicValue;
    public heroesStatisticID: System.DynamicValue;
    public heroesStatisticOperation: number;
    public heroesStatisticValue: System.DynamicValue;
    public currencyID: System.DynamicValue;
    public operationCurrency: number;
    public currencyValue: System.DynamicValue;
    public itemID: System.DynamicValue;
    public operationItem: number;
    public itemValue: System.DynamicValue;
    public weaponID: System.DynamicValue;
    public operationWeapon: number;
    public weaponValue: System.DynamicValue;
    public weaponEquiped: boolean;
    public armorID: System.DynamicValue;
    public operationArmor: number;
    public armorValue: System.DynamicValue;
    public armorEquiped: boolean;
    public keyID: System.DynamicValue;
    public keyValue: System.DynamicValue;
    public objectIDLookingAt: System.DynamicValue;
    public orientationLookingAt: Enum.Orientation;
    public script: System.DynamicValue;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        }
        this.hasElse = Utils.numToBool(command[iterator.i++]);
        this.kind = command[iterator.i++];
        switch (this.kind) {
            case 0: // Variable / Param / Prop
                this.variableParamProp = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.variableParamPropOperationKind = command[iterator.i++];
                this.variableParamPropValue = System.DynamicValue
                    .createValueCommand(command, iterator);
                break;
            case 1: // Heroes
                this.heroesSelection = command[iterator.i++];
                if (this.heroesSelection === ConditionHeroesKind
                    .TheHeroeWithInstanceID)
                {
                    this.heroInstanceID = System.DynamicValue.createValueCommand
                        (command, iterator);
                }
                this.heroesInTeam = Utils.numToBool(command[iterator.i++]);
                if (this.heroesInTeam) {
                    this.heroesInTeamSelection = command[iterator.i++];
                }
                this.heroesKind = command[iterator.i++];
                switch (this.heroesKind) {
                    case 0:
                        this.heroesNamed = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 1:
                        this.heroesInTeamValue = command[iterator.i++];
                        break;
                    case 2:
                        this.heroesSkillID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 3:
                        this.heroesEquipedKind = command[iterator.i++];
                        switch (this.heroesEquipedKind) {
                            case 0:
                                this.heroesEquipedWeaponID = System.DynamicValue
                                    .createValueCommand(command, iterator);
                                break;
                            case 1:
                                this.heroesEquipedArmorID = System.DynamicValue
                                    .createValueCommand(command, iterator);
                                break;
                        }
                        break;
                    case 4:
                        this.heroesStatusID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                    case 5:
                        this.heroesStatisticID = System.DynamicValue
                            .createValueCommand(command, iterator);
                        this.heroesStatisticOperation = command[iterator.i++];
                        this.heroesStatisticValue = System.DynamicValue
                            .createValueCommand(command, iterator);
                        break;
                }
                break;
            case 2:
                this.currencyID = System.DynamicValue.createValueCommand(command
                    , iterator);
                this.operationCurrency = command[iterator.i++];
                this.currencyValue = System.DynamicValue.createValueCommand(
                    command, iterator);
                break;
            case 3:
                this.itemID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                this.operationItem = command[iterator.i++];
                this.itemValue = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case 4:
                this.weaponID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                this.operationWeapon = command[iterator.i++];
                this.weaponValue = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.weaponEquiped = Utils.numToBool(command[iterator.i++]);
                break;
            case 5:
                this.armorID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                this.operationArmor = command[iterator.i++];
                this.armorValue = System.DynamicValue.createValueCommand(command
                    , iterator);
                this.armorEquiped = Utils.numToBool(command[iterator.i++]);
                break;
            case 6:
                this.keyID = System.DynamicValue.createValueCommand(command, 
                    iterator);
                this.keyValue = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case 7:
                this.script = System.DynamicValue.createValueCommand(command, 
                    iterator);
                break;
            case 9:
                this.objectIDLookingAt = System.DynamicValue.createValueCommand(
                    command, iterator);
                this.orientationLookingAt = command[iterator.i++];
                break;
        }
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        return {
            waitingObject: false,
            object: null
        }
    }

    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        let i: number, j: number, l: number, m: number, result: boolean, 
            heroesSelection: Player[], id: number, equip: Item, stat: System
            .Statistic, item: Item, value: number, nb: number;
        switch (this.kind) {
            case 0: // Variable / Param / Prop
                result = Mathf.OPERATORS_COMPARE[this
                    .variableParamPropOperationKind](this.variableParamProp
                    .getValue(), this.variableParamPropValue.getValue());
                break;
            case 1:
                if (this.heroesInTeam) {
                    heroesSelection = Game.current.getTeam(this
                        .heroesInTeamSelection);
                } else {
                    heroesSelection = Game.current.teamHeroes.concat(
                        Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                }
                switch (this.heroesKind) {
                    case 0:
                        let name = this.heroesNamed.getValue();
                        result = Player.applySelection(this.heroesSelection, 
                            heroesSelection, this.heroInstanceID.getValue(), 
                            (hero: Player) => {
                                return hero.name === name;
                            }
                        );
                        break;
                    case 1:
                        let tab = Game.current.getTeam(this
                            .heroesInTeamValue);
                        result = Player.applySelection(this.heroesSelection, 
                            heroesSelection, this.heroInstanceID.getValue(), 
                            (hero:Player) => {
                                id = hero.instid;
                                for (i = 0, l = tab.length; i < l; i++) {
                                    if (tab[i].instid === id) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        );
                        break;
                    case 2:
                        id = this.heroesSkillID.getValue();
                        result = Player.applySelection(this.heroesSelection, 
                            heroesSelection, this.heroInstanceID.getValue(), 
                            (hero: Player) => {
                                for (i = 0, l = hero.sk.length; i < l; i++) {
                                    if (hero.sk[i].id === id) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        );
                        break;
                    case 3:
                        switch (this.heroesEquipedKind) {
                        case 0:
                            id = this.heroesEquipedWeaponID.getValue();
                            result = Player.applySelection(this.heroesSelection, 
                                heroesSelection, this.heroInstanceID.getValue(), 
                                (hero: Player) => {
                                    for (i = 0, l = hero.equip.length; i < l; i++) {
                                        equip = hero.equip[i];
                                        if (equip && equip.kind === ItemKind.Weapon 
                                            && equip.system.id === id)
                                        {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                            );
                            break;
                        case 1:
                            id = this.heroesEquipedArmorID.getValue();
                            result = Player.applySelection(this.heroesSelection, 
                                heroesSelection, this.heroInstanceID.getValue(), 
                                (hero: Player) => {
                                    for (i = 0, l = hero.equip.length; i < l; i++) {
                                        equip = hero.equip[i];
                                        if (equip && equip.kind === ItemKind.Armor 
                                            && equip.system.id === id)
                                        {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                            );
                            break;
                        }
                        break;
                    case 4:
                        id = this.heroesStatusID.getValue();
                        result = Player.applySelection(this.heroesSelection, 
                            heroesSelection, this.heroInstanceID.getValue(), 
                            (hero: Player) => {
                                for (i = 0, l = hero.status.length; i < l; i++) {
                                    if (id === hero.status[i].system.id) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        );
                        break;
                    case 5:
                        stat = Datas.BattleSystems.getStatistic(this
                            .heroesStatisticID.getValue());
                        value = this.heroesStatisticValue.getValue();
                        result = Player.applySelection(this.heroesSelection, 
                            heroesSelection, this.heroInstanceID.getValue(), 
                            (hero: Player) => {
                                return Mathf.OPERATORS_COMPARE[this
                                    .heroesStatisticOperation](hero[stat
                                    .abbreviation], value);
                            }
                        );
                        break;
                    }
                    break;
            case 2:
                result = Mathf.OPERATORS_COMPARE[this.operationCurrency](Game
                    .current.currencies[this.currencyID.getValue()], this
                    .currencyValue.getValue());
                break;
            case 3:
                nb = 0;
                id = this.itemID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Item && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationItem](nb, this
                    .itemValue.getValue());
                break;
            case 4:
                nb = 0;
                id = this.weaponID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Weapon && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                if (this.weaponEquiped) {
                    heroesSelection = Game.current.teamHeroes.concat(
                        Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                    let h: Player;
                    for (i = 0, l = heroesSelection.length; i < l; i++) {
                        h = heroesSelection[i];
                        for (j = 0, m = h.equip.length; j < m; j++) {
                            equip = h.equip[j];
                            if (equip && equip.kind === ItemKind.Weapon && equip
                                .system.id === id)
                            {
                                nb += 1;
                            }
                        }
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationWeapon](nb, this
                    .weaponValue.getValue());
                break;
            case 5:
                nb = 0;
                id = this.armorID.getValue();
                for (i = 0, l = Game.current.items.length; i < l; i++) {
                    item = Game.current.items[i];
                    if (item.kind === ItemKind.Armor && item.system.id === id) {
                        nb = item.nb;
                        break;
                    }
                }
                if (this.armorEquiped) {
                    heroesSelection = Game.current.teamHeroes.concat(
                        Game.current.reserveHeroes);
                    heroesSelection.concat(Game.current.hiddenHeroes);
                    let h: Player;
                    for (i = 0, l = heroesSelection.length; i < l; i++) {
                        h = heroesSelection[i];
                        for (j = 0, m = h.equip.length; j < m; j++) {
                            equip = h.equip[j];
                            if (equip && equip.kind === ItemKind.Armor && equip
                                .system.id === id)
                            {
                                nb += 1;
                            }
                        }
                    }
                }
                result = Mathf.OPERATORS_COMPARE[this.operationArmor](nb, this
                    .armorValue.getValue());
                break;
            case 6:
                let key = Datas.Keyboards.get(this.keyID.getValue());
                let b = this.keyValue.getValue();
                result = !b;
                for (i = 0, l = KeyEvent.keysPressed.length; i < l; i++) {
                    if (Datas.Keyboards.isKeyEqual(KeyEvent.keysPressed[i], key)) {
                        result = b;
                        break;
                    }
                }
                break;
            case 7:
                result = Interpreter.evaluate("return " + this.script.getValue()
                    , { thisObject: object });
                break;
            case 8:
                result = Scene.Battle.escapedLastBattle;
                break;
            case 9: {
                if (!currentState.waitingObject) {
                    let objectID = this.objectIDLookingAt.getValue();
                    MapObject.search(objectID, (result: StructSearchResult) => {
                            currentState.object = result.object;
                        }, object);
                    currentState.waitingObject = true;
                }
                if (currentState.object === null) {
                    return 0;
                } else {
                    result = currentState.object.orientationEye === this
                        .orientationLookingAt;
                    break;
                }
            }
            default:
                break;
        }
        if (result) {
            return -1;
        } else {
            return 1 + (this.hasElse ? 0 : 1);
        }
    }

    /** 
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number {
        return 2 + (this.hasElse ? 1 : 0);
    }
}

export { If }