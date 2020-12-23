import { Base } from "./Base.js";
import { System } from "../index.js";
import { Player, MapObject } from "../Core/index.js";
/** @class
 *  An event command for condition event command block.
 *  @extends EventCommand.Base
 *  @param {any[]} command Direct JSON command to parse
 */
declare class If extends Base {
    hasElse: boolean;
    kind: number;
    variableParamProp: System.DynamicValue;
    variableParamPropOperationKind: number;
    variableParamPropValue: System.DynamicValue;
    heroesSelection: number;
    heroInstanceID: System.DynamicValue;
    heroesInTeam: boolean;
    heroesInTeamSelection: number;
    heroesKind: number;
    heroesNamed: System.DynamicValue;
    heroesInTeamValue: number;
    heroesSkillID: System.DynamicValue;
    heroesEquipedKind: number;
    heroesEquipedWeaponID: System.DynamicValue;
    heroesEquipedArmorID: System.DynamicValue;
    heroesStatusID: System.DynamicValue;
    heroesStatisticID: System.DynamicValue;
    heroesStatisticOperation: number;
    heroesStatisticValue: System.DynamicValue;
    currencyID: System.DynamicValue;
    operationCurrency: number;
    currencyValue: System.DynamicValue;
    itemID: System.DynamicValue;
    operationItem: number;
    itemValue: System.DynamicValue;
    weaponID: System.DynamicValue;
    operationWeapon: number;
    weaponValue: System.DynamicValue;
    weaponEquiped: boolean;
    armorID: System.DynamicValue;
    operationArmor: number;
    armorValue: System.DynamicValue;
    armorEquiped: boolean;
    keyID: System.DynamicValue;
    keyValue: System.DynamicValue;
    script: System.DynamicValue;
    constructor(command: any[]);
    /**
     *  Apply callback with all the heroes.
     *  @param {Player[]} tab The heroes list
     *  @param {Function} callback The callback
     *  @returns {boolean}
     */
    allTheHeroes(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with none of the heroes.
     *  @param {Player[]} tab The heroes list
     *  @param {Function} callback The callback
     *  @returns {boolean}
     */
    noneOfTheHeroes(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with at least one hero.
     *  @param {Player[]} tab The heroes list
     *  @param {Function} callback The callback
     *  @returns {boolean}
     */
    atLeastOneHero(tab: Player[], callback: Function): boolean;
    /**
     *  Apply callback with the hero with instance ID.
     *  @param {Player[]} tab The heroes list
     *  @param {number} id The hero instance id
     *  @param {Function} callback The callback
     *  @returns {boolean}
     */
    theHeroeWithInstanceID(tab: Player[], id: number, callback: Function): boolean;
    /**
     *  Apply callback according to heroes selection.
     *  @param {Player[]} tab The heroes list
     *  @param {Function} callback The callback
     *  @returns {boolean}
    */
    getResult(tab: Player[], callback: Function): boolean;
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} currentState The current state of the event
     *  @param {MapObject} object The current object reacting
     *  @param {number} state The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState: Record<string, any>, object: MapObject, state: number): number;
    /**
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number;
}
export { If };
