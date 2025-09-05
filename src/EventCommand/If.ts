/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { CONDITION_HEROES_KIND, Inputs, Interpreter, ITEM_KIND, Mathf, ORIENTATION, Utils } from '../Common';
import { Game, Item, MapObject, Player, StructSearchResult } from '../Core';
import { Datas, Model, Scene } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for condition event command block.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class If extends Base {
	public hasElse: boolean;
	public kind: number;
	public variableParamProp: Model.DynamicValue;
	public variableParamPropOPERATION_KIND: number;
	public variableParamPropValue: Model.DynamicValue;
	public heroesSelection: number;
	public heroInstanceID: Model.DynamicValue;
	public heroesInTeam: boolean;
	public heroesInTeamSelection: number;
	public heroesKind: number;
	public heroesNamed: Model.DynamicValue;
	public heroesInTeamValue: number;
	public heroesSkillID: Model.DynamicValue;
	public heroesEquipedKind: number;
	public heroesEquipedWeaponID: Model.DynamicValue;
	public heroesEquipedArmorID: Model.DynamicValue;
	public heroesStatusID: Model.DynamicValue;
	public heroesStatisticID: Model.DynamicValue;
	public heroesStatisticOperation: number;
	public heroesStatisticValue: Model.DynamicValue;
	public currencyID: Model.DynamicValue;
	public operationCurrency: number;
	public currencyValue: Model.DynamicValue;
	public itemID: Model.DynamicValue;
	public operationItem: number;
	public itemValue: Model.DynamicValue;
	public weaponID: Model.DynamicValue;
	public operationWeapon: number;
	public weaponValue: Model.DynamicValue;
	public weaponEquiped: boolean;
	public armorID: Model.DynamicValue;
	public operationArmor: number;
	public armorValue: Model.DynamicValue;
	public armorEquiped: boolean;
	public keyID: Model.DynamicValue;
	public keyValue: Model.DynamicValue;
	public objectIDLookingAt: Model.DynamicValue;
	public orientationLookingAt: ORIENTATION;
	public chronometerID: Model.DynamicValue;
	public chronometerOperation: number;
	public chronometerSeconds: Model.DynamicValue;
	public script: Model.DynamicValue;
	public objectIDClimbing: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.hasElse = Utils.numberToBool(command[iterator.i++]);
		this.kind = command[iterator.i++];
		switch (this.kind) {
			case 0: // Variable / Param / Prop
				this.variableParamProp = Model.DynamicValue.createValueCommand(command, iterator);
				this.variableParamPropOPERATION_KIND = command[iterator.i++];
				this.variableParamPropValue = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 1: // Heroes
				this.heroesSelection = command[iterator.i++];
				if (this.heroesSelection === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
					this.heroInstanceID = Model.DynamicValue.createValueCommand(command, iterator);
				}
				this.heroesInTeam = Utils.numberToBool(command[iterator.i++]);
				if (this.heroesInTeam) {
					this.heroesInTeamSelection = command[iterator.i++];
				}
				this.heroesKind = command[iterator.i++];
				switch (this.heroesKind) {
					case 0:
						this.heroesNamed = Model.DynamicValue.createValueCommand(command, iterator);
						break;
					case 1:
						this.heroesInTeamValue = command[iterator.i++];
						break;
					case 2:
						this.heroesSkillID = Model.DynamicValue.createValueCommand(command, iterator);
						break;
					case 3:
						this.heroesEquipedKind = command[iterator.i++];
						switch (this.heroesEquipedKind) {
							case 0:
								this.heroesEquipedWeaponID = Model.DynamicValue.createValueCommand(command, iterator);
								break;
							case 1:
								this.heroesEquipedArmorID = Model.DynamicValue.createValueCommand(command, iterator);
								break;
						}
						break;
					case 4:
						this.heroesStatusID = Model.DynamicValue.createValueCommand(command, iterator);
						break;
					case 5:
						this.heroesStatisticID = Model.DynamicValue.createValueCommand(command, iterator);
						this.heroesStatisticOperation = command[iterator.i++];
						this.heroesStatisticValue = Model.DynamicValue.createValueCommand(command, iterator);
						break;
				}
				break;
			case 2:
				this.currencyID = Model.DynamicValue.createValueCommand(command, iterator);
				this.operationCurrency = command[iterator.i++];
				this.currencyValue = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 3:
				this.itemID = Model.DynamicValue.createValueCommand(command, iterator);
				this.operationItem = command[iterator.i++];
				this.itemValue = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 4:
				this.weaponID = Model.DynamicValue.createValueCommand(command, iterator);
				this.operationWeapon = command[iterator.i++];
				this.weaponValue = Model.DynamicValue.createValueCommand(command, iterator);
				this.weaponEquiped = Utils.numberToBool(command[iterator.i++]);
				break;
			case 5:
				this.armorID = Model.DynamicValue.createValueCommand(command, iterator);
				this.operationArmor = command[iterator.i++];
				this.armorValue = Model.DynamicValue.createValueCommand(command, iterator);
				this.armorEquiped = Utils.numberToBool(command[iterator.i++]);
				break;
			case 6:
				this.keyID = Model.DynamicValue.createValueCommand(command, iterator);
				this.keyValue = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 7:
				this.script = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 9:
				this.objectIDLookingAt = Model.DynamicValue.createValueCommand(command, iterator);
				this.orientationLookingAt = command[iterator.i++];
				break;
			case 10:
				this.chronometerID = Model.DynamicValue.createValueCommand(command, iterator);
				this.chronometerOperation = command[iterator.i++];
				this.chronometerSeconds = Model.DynamicValue.createValueCommand(command, iterator);
				break;
			case 11:
				this.objectIDClimbing = Model.DynamicValue.createValueCommand(command, iterator);
				break;
		}
	}

	/**
	 *  Get the hero instance ID.
	 *  @returns {number}
	 */
	getHeroInstanceID(): number {
		return this.heroInstanceID ? this.heroInstanceID.getValue() : 0;
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			waitingObject: false,
			object: null,
		};
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		let i: number,
			j: number,
			l: number,
			m: number,
			result: boolean,
			heroesSelection: Player[],
			id: number,
			equip: Item,
			stat: Model.Statistic,
			item: Item,
			value: number,
			nb: number;
		switch (this.kind) {
			case 0: // Variable / Param / Prop
				result = Mathf.OPERATORS_COMPARE[this.variableParamPropOPERATION_KIND](
					this.variableParamProp.getValue(),
					this.variableParamPropValue.getValue()
				);
				break;
			case 1:
				if (this.heroesInTeam) {
					heroesSelection = Game.current.getTeam(this.heroesInTeamSelection);
				} else {
					heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
					heroesSelection.concat(Game.current.hiddenHeroes);
				}
				switch (this.heroesKind) {
					case 0:
						const name = this.heroesNamed.getValue();
						result = Player.applySelection(
							this.heroesSelection,
							heroesSelection,
							this.getHeroInstanceID(),
							(hero: Player) => {
								return hero.name === name;
							}
						);
						break;
					case 1:
						const tab = Game.current.getTeam(this.heroesInTeamValue);
						result = Player.applySelection(
							this.heroesSelection,
							heroesSelection,
							this.getHeroInstanceID(),
							(hero: Player) => {
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
						result = Player.applySelection(
							this.heroesSelection,
							heroesSelection,
							this.getHeroInstanceID(),
							(hero: Player) => {
								for (i = 0, l = hero.skills.length; i < l; i++) {
									if (hero.skills[i].id === id) {
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
								result = Player.applySelection(
									this.heroesSelection,
									heroesSelection,
									this.getHeroInstanceID(),
									(hero: Player) => {
										for (i = 0, l = hero.equip.length; i < l; i++) {
											equip = hero.equip[i];
											if (equip && equip.kind === ITEM_KIND.WEAPON && equip.system.id === id) {
												return true;
											}
										}
										return false;
									}
								);
								break;
							case 1:
								id = this.heroesEquipedArmorID.getValue();
								result = Player.applySelection(
									this.heroesSelection,
									heroesSelection,
									this.getHeroInstanceID(),
									(hero: Player) => {
										for (i = 0, l = hero.equip.length; i < l; i++) {
											equip = hero.equip[i];
											if (equip && equip.kind === ITEM_KIND.ARMOR && equip.system.id === id) {
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
						result = Player.applySelection(
							this.heroesSelection,
							heroesSelection,
							this.getHeroInstanceID(),
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
						stat = Datas.BattleSystems.getStatistic(this.heroesStatisticID.getValue());
						value = this.heroesStatisticValue.getValue();
						result = Player.applySelection(
							this.heroesSelection,
							heroesSelection,
							this.getHeroInstanceID(),
							(hero: Player) => {
								return Mathf.OPERATORS_COMPARE[this.heroesStatisticOperation](
									hero[stat.abbreviation],
									value
								);
							}
						);
						break;
				}
				break;
			case 2:
				result = Mathf.OPERATORS_COMPARE[this.operationCurrency](
					Game.current.currencies[this.currencyID.getValue()],
					this.currencyValue.getValue()
				);
				break;
			case 3:
				nb = 0;
				id = this.itemID.getValue();
				for (i = 0, l = Game.current.items.length; i < l; i++) {
					item = Game.current.items[i];
					if (item.kind === ITEM_KIND.ITEM && item.system.id === id) {
						nb = item.nb;
						break;
					}
				}
				result = Mathf.OPERATORS_COMPARE[this.operationItem](nb, this.itemValue.getValue());
				break;
			case 4:
				nb = 0;
				id = this.weaponID.getValue();
				for (i = 0, l = Game.current.items.length; i < l; i++) {
					item = Game.current.items[i];
					if (item.kind === ITEM_KIND.WEAPON && item.system.id === id) {
						nb = item.nb;
						break;
					}
				}
				if (this.weaponEquiped) {
					heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
					heroesSelection.concat(Game.current.hiddenHeroes);
					let h: Player;
					for (i = 0, l = heroesSelection.length; i < l; i++) {
						h = heroesSelection[i];
						for (j = 0, m = h.equip.length; j < m; j++) {
							equip = h.equip[j];
							if (equip && equip.kind === ITEM_KIND.WEAPON && equip.system.id === id) {
								nb += 1;
							}
						}
					}
				}
				result = Mathf.OPERATORS_COMPARE[this.operationWeapon](nb, this.weaponValue.getValue());
				break;
			case 5:
				nb = 0;
				id = this.armorID.getValue();
				for (i = 0, l = Game.current.items.length; i < l; i++) {
					item = Game.current.items[i];
					if (item.kind === ITEM_KIND.ARMOR && item.system.id === id) {
						nb = item.nb;
						break;
					}
				}
				if (this.armorEquiped) {
					heroesSelection = Game.current.teamHeroes.concat(Game.current.reserveHeroes);
					heroesSelection.concat(Game.current.hiddenHeroes);
					let h: Player;
					for (i = 0, l = heroesSelection.length; i < l; i++) {
						h = heroesSelection[i];
						for (j = 0, m = h.equip.length; j < m; j++) {
							equip = h.equip[j];
							if (equip && equip.kind === ITEM_KIND.ARMOR && equip.system.id === id) {
								nb += 1;
							}
						}
					}
				}
				result = Mathf.OPERATORS_COMPARE[this.operationArmor](nb, this.armorValue.getValue());
				break;
			case 6:
				const key = Datas.Keyboards.get(this.keyID.getValue());
				const b = this.keyValue.getValue();
				result = !b;
				for (const pressedKey of Inputs.keysPressed) {
					if (Datas.Keyboards.isKeyEqual(pressedKey, key)) {
						result = b;
						break;
					}
				}
				break;
			case 7:
				result = Interpreter.evaluate(this.script.getValue(), {
					thisObject: object,
				}) as boolean;
				break;
			case 8:
				result = Scene.Battle.escapedLastBattle;
				break;
			case 9: {
				if (!currentState.waitingObject) {
					const objectID = this.objectIDLookingAt.getValue();
					MapObject.search(
						objectID,
						(result: StructSearchResult) => {
							currentState.object = result.object;
						},
						object
					);
					currentState.waitingObject = true;
				}
				if (currentState.object === null) {
					return 0;
				} else {
					result = currentState.object.orientationEye === this.orientationLookingAt;
					break;
				}
			}
			case 10:
				const index = Utils.indexOfProp(Game.current.chronometers as any, 'id', this.chronometerID.getValue());
				if (index === -1) {
					result = false;
					break;
				} else {
					const chrono = Game.current.chronometers[index];
					result = Mathf.OPERATORS_COMPARE[this.chronometerOperation](
						chrono.getSeconds(),
						this.chronometerSeconds.getValue()
					);
				}
				break;
			case 11: {
				if (!currentState.waitingObject) {
					const objectID = this.objectIDClimbing.getValue();
					MapObject.search(
						objectID,
						(result: StructSearchResult) => {
							currentState.object = result.object;
						},
						object
					);
					currentState.waitingObject = true;
				}
				if (currentState.object === null) {
					return 0;
				} else {
					result = currentState.object.isClimbing;
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

export { If };
