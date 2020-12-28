import { Player } from "./Player.js";
import { Item } from "./Item.js";
import { Chrono } from "./Chrono.js";
import { MapObject } from "./MapObject.js";
import { Enum } from "../Common/index.js";
import GroupKind = Enum.GroupKind;
import CharacterKind = Enum.CharacterKind;
import { Portion } from "./Portion.js";
/** @class
 *  All the global informations of a particular game.
 *  @param {number} slot The number of the slot to load
 */
declare class Game {
    static current: Game;
    slot: number;
    hero: MapObject;
    heroBattle: MapObject;
    playTime: Chrono;
    charactersInstances: number;
    variables: any[];
    items: Item[];
    currencies: number[];
    teamHeroes: Player[];
    reserveHeroes: Player[];
    hiddenHeroes: Player[];
    currentMapID: number;
    heroStates: number[];
    heroProperties: number[];
    heroStatesOptions: Record<string, any>[];
    startupStates: Record<string, any>;
    startupProperties: Record<string, any>;
    mapsDatas: Record<string, any>;
    isEmpty: boolean;
    constructor(slot?: number);
    /**
     *  Get the hero in a tab with instance ID.
     *  @static
     *  @param {Player[]} tab The heroes tab
     *  @param {number} id The instance ID
     *  @returns {GamePlayer}
     */
    static getHeroInstanceInTab(tab: Player[], id: number): Player;
    /**
     *  Load the game file.
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Save a game file.
     *  @async
     */
    save(slot?: number): Promise<void>;
    /**
     *  Get a compressed version of mapsDatas (don't retain meshs).
     *  @returns {Object}
     */
    getCompressedMapsDatas(): Object;
    /**
     *  Initialize a default game
     */
    initializeDefault(): void;
    /**
     *  Initialize the default variables.
     */
    initializeVariables(): void;
    /**
     *  Instanciate a new character in a group in the game.
     *  @param {GroupKind} groupKind In which group we should instanciate
     *  @param {CharacterKind} type The type of character to instanciate
     *  @param {number} id The ID of the character to instanciate
     *  @param {number} level The player level
     *  @param {number} stockID The ID of the variable where we will stock the
     *  instantiate ID
     */
    instanciateTeam(groupKind: GroupKind, type: CharacterKind, id: number, level: number, stockID: number): void;
    /**
     *  Get the teams list in a list.
     *  @returns {Player[][]}
     */
    getGroups(): Player[][];
    /**
     *  Get the path save according to slot.
     *  @param {number} [slot=undefined]
     *  @returns {string}
    */
    getPathSave(slot?: number): string;
    /**
     *  Get the variable by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getVariable(id: number): any;
    /**
     *  Get the currency by ID.
     *  @param {number} id
     *  @returns {any}
     */
    getCurrency(id: number): any;
    /**
     *  Get the hero with instance ID.
     *  @param {number} id The instance ID
     *  @returns {Player}
     */
    getHeroByInstanceID(id: number): Player;
    /**
     *  Use an item and remove it from inventory.
     *  @param {Item} item The item
    */
    useItem(item: Item): void;
    /**
     *  Get the team according to group kind.
     *  @param {GroupKind} kind The group kind
     *  @returns {Player[]}
     */
    getTeam(kind: GroupKind): Player[];
    /**
     *  Get the portions datas according to id and position.
     *  @param {number} id The map id
     *  @param {Portion} portion The portion
     *  @returns {Record<string, any>}
    */
    getPotionsDatas(id: number, portion: Portion): Record<string, any>;
}
export { Game };
