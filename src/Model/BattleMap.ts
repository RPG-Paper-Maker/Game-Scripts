/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Position } from '../Core';
import { Base } from './Base';

/**
 * JSON schema for a battle map.
 */
export type BattleMapJSON = {
	idm: number;
	p: number[];
};

/**
 * Represents a battle map in the game.
 * A battle map stores the map ID and a position where the battle takes place.
 */
export class BattleMap extends Base {
	public idMap: number;
	public position: Position;

	constructor(json?: BattleMapJSON) {
		super(json);
	}

	/**
	 * Creates a new {@link BattleMap} instance.
	 * @param idMap - The map ID.
	 * @param position - The battle start position.
	 * @returns A new battle map instance.
	 */
	static create(idMap: number, position: Position): BattleMap {
		const map = new BattleMap();
		map.idMap = idMap;
		map.position = position;
		return map;
	}

	/**
	 * Reads the JSON data describing the battle map.
	 */
	read(json: BattleMapJSON): void {
		this.idMap = json.idm;
		this.position = Position.createFromArray(json.p);
	}
}
