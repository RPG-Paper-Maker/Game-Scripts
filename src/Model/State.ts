/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, Utils } from '../Common';
import { EventCommand, Manager, Model } from '../index';
import { Base } from './Base';

/** @class
 *  A possible state of an object.
 *  @extends Model.Base
 *  @param {Record<string, any>} - json Json object describing the object state
 */
class State extends Base {
	public id: number;
	public graphicID: number;
	public graphicKind: number;
	public rectTileset: number[];
	public indexX: number;
	public indexY: number;
	public objectMovingKind: OBJECT_MOVING_KIND;
	public route: Model.Reaction;
	public speedID: number;
	public frequencyID: number;
	public moveAnimation: boolean;
	public stopAnimation: boolean;
	public climbAnimation: boolean;
	public directionFix: boolean;
	public through: boolean;
	public setWithCamera: boolean;
	public pixelOffset: boolean;
	public keepPosition: boolean;
	public detection: EventCommand.Base;
	public centerX: Model.DynamicValue;
	public centerZ: Model.DynamicValue;
	public angleX: Model.DynamicValue;
	public angleY: Model.DynamicValue;
	public angleZ: Model.DynamicValue;
	public scaleX: Model.DynamicValue;
	public scaleY: Model.DynamicValue;
	public scaleZ: Model.DynamicValue;

	constructor(json?: Record<string, any>) {
		super(json);
	}

	/**
	 *  Read the JSON associated to the object state.
	 *  @param {Record<string, any>} - json Json object describing the object
	 *  state
	 */
	read(json: Record<string, any>) {
		this.id = json.id;
		this.graphicID = json.gid;
		this.graphicKind = json.gk;
		if (this.graphicID === 0) {
			this.rectTileset = json.rt;
			if (this.rectTileset.length === 2) {
				this.rectTileset.push(1);
				this.rectTileset.push(1);
			}
		} else {
			this.indexX = json.x;
			this.indexY = json.y;
		}
		this.objectMovingKind = Utils.defaultValue(json.omk, OBJECT_MOVING_KIND.FIX);
		this.route = new Model.Reaction({
			bh: false,
			c: [
				Utils.defaultValue(json.ecr, {
					kind: EVENT_COMMAND_KIND.MOVE_OBJECT,
					command: [DYNAMIC_VALUE_KIND.DATABASE, -1, 1, 1, 0, COMMAND_MOVE_KIND.MOVE_RANDOM, 0],
				}),
			],
		});
		this.speedID = Utils.defaultValue(json.s, 1);
		this.frequencyID = Utils.defaultValue(json.f, 1);
		this.moveAnimation = json.move;
		this.stopAnimation = json.stop;
		this.climbAnimation = json.climb;
		this.directionFix = json.dir;
		this.through = json.through;
		this.setWithCamera = json.cam;
		this.pixelOffset = json.pix;
		this.keepPosition = json.pos;
		this.detection = Utils.defaultValue(json.ecd, null);
		if (this.detection !== null) {
			this.detection = Manager.Events.getEventCommand(this.detection);
		}
		this.centerX = Model.DynamicValue.readOrDefaultNumberDouble(json.cx, 50);
		this.centerZ = Model.DynamicValue.readOrDefaultNumberDouble(json.cz, 50);
		this.angleX = Model.DynamicValue.readOrDefaultNumberDouble(json.ax, 0);
		this.angleY = Model.DynamicValue.readOrDefaultNumberDouble(json.ay, 0);
		this.angleZ = Model.DynamicValue.readOrDefaultNumberDouble(json.az, 0);
		this.scaleX = Model.DynamicValue.readOrDefaultNumberDouble(json.sx, 1);
		this.scaleY = Model.DynamicValue.readOrDefaultNumberDouble(json.sy, 1);
		this.scaleZ = Model.DynamicValue.readOrDefaultNumberDouble(json.sz, 1);
	}

	/**
	 *  Create a new instance of the System object state.
	 *  @returns {Object}
	 */
	copyInstance(): Record<string, any> {
		return {
			graphicID: this.graphicID,
			graphicKind: this.graphicKind,
			rectTileset: this.rectTileset,
			indexX: this.indexX,
			indexY: this.indexY,
			speedID: this.speedID,
			frequencyID: this.frequencyID,
			moveAnimation: this.moveAnimation,
			stopAnimation: this.stopAnimation,
			climbAnimation: this.climbAnimation,
			directionFix: this.directionFix,
			through: this.through,
			setWithCamera: this.setWithCamera,
			pixelOffset: this.pixelOffset,
			keepPosition: this.keepPosition,
			centerX: this.centerX.createCopy(),
			centerZ: this.centerZ.createCopy(),
			angleX: this.angleX.createCopy(),
			angleY: this.angleY.createCopy(),
			angleZ: this.angleZ.createCopy(),
			scaleX: this.scaleX.createCopy(),
			scaleY: this.scaleY.createCopy(),
			scaleZ: this.scaleZ.createCopy(),
		};
	}
}

export { State };
