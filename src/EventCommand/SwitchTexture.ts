/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model, Scene } from '..';
import { Utils } from '../Common';
import { Game, MapObject } from '../Core';
import { Base } from './Base';

/** @class
 *  An event command for switching texture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SwitchTexture extends Base {
	public isTilesetID: boolean;
	public tilesetID: Model.DynamicValue;
	public tilesetPictureID: Model.DynamicValue;
	public isAutotileID: boolean;
	public autotileID: Model.DynamicValue;
	public autotilePictureID: Model.DynamicValue;
	public isWallID: boolean;
	public wallID: Model.DynamicValue;
	public wallPictureID: Model.DynamicValue;
	public isObject3DID: boolean;
	public object3DID: Model.DynamicValue;
	public object3DPictureID: Model.DynamicValue;
	public isMountainID: boolean;
	public mountainID: Model.DynamicValue;
	public mountainPictureID: Model.DynamicValue;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		this.isTilesetID = Utils.numberToBool(command[iterator.i++]);
		if (this.isTilesetID) {
			this.tilesetID = Model.DynamicValue.createValueCommand(command, iterator);
			this.tilesetPictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
		this.isAutotileID = Utils.numberToBool(command[iterator.i++]);
		if (this.isAutotileID) {
			this.autotileID = Model.DynamicValue.createValueCommand(command, iterator);
			this.autotilePictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
		this.isWallID = Utils.numberToBool(command[iterator.i++]);
		if (this.isWallID) {
			this.wallID = Model.DynamicValue.createValueCommand(command, iterator);
			this.wallPictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
		this.isObject3DID = Utils.numberToBool(command[iterator.i++]);
		if (this.isObject3DID) {
			this.object3DID = Model.DynamicValue.createValueCommand(command, iterator);
			this.object3DPictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
		this.isMountainID = Utils.numberToBool(command[iterator.i++]);
		if (this.isMountainID) {
			this.mountainID = Model.DynamicValue.createValueCommand(command, iterator);
			this.mountainPictureID = Model.DynamicValue.createValueCommand(command, iterator);
			iterator.i++;
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			loading: false,
			loaded: false,
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
		if (!currentState.loading) {
			currentState.loading = true;
			if (this.isTilesetID) {
				Game.current.textures.tilesets[this.tilesetID.getValue() as number] =
					this.tilesetPictureID.getValue() as number;
			}
			if (this.isAutotileID) {
				Game.current.textures.autotiles[this.autotileID.getValue() as number] =
					this.autotilePictureID.getValue() as number;
			}
			if (this.isWallID) {
				Game.current.textures.walls[this.wallID.getValue() as number] = this.wallPictureID.getValue() as number;
			}
			if (this.isObject3DID) {
				Game.current.textures.objects3D[this.object3DID.getValue() as number] =
					this.object3DPictureID.getValue() as number;
			}
			if (this.isMountainID) {
				Game.current.textures.mountains[this.mountainID.getValue() as number] =
					this.mountainPictureID.getValue() as number;
			}
			//Scene.Map.current.close();
			Scene.Map.current.loading = true;
			(async () => {
				await Scene.Map.current.reloadTextures();
				currentState.loaded = true;
			})();
		}
		return currentState.loaded ? 1 : 0;
	}
}

export { SwitchTexture };
