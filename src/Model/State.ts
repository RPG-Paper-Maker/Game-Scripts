/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, Utils } from '../Common';
import { Rectangle } from '../Core';
import { EventCommand, Manager } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Reaction, ReactionCommandJSON } from './Reaction';

/**
 * JSON structure describing a state.
 */
export type StateJSON = {
	id: number;
	gid: number;
	gk: number;
	rt?: number[];
	x?: number;
	y?: number;
	omk?: OBJECT_MOVING_KIND;
	ecr?: ReactionCommandJSON;
	s?: number;
	f?: number;
	move: boolean;
	stop: boolean;
	climb: boolean;
	dir: boolean;
	through: boolean;
	cam: boolean;
	pix: boolean;
	pos: boolean;
	ecd?: ReactionCommandJSON;
	cx?: DynamicValueJSON;
	cz?: DynamicValueJSON;
	ax?: DynamicValueJSON;
	ay?: DynamicValueJSON;
	az?: DynamicValueJSON;
	sx?: DynamicValueJSON;
	sy?: DynamicValueJSON;
	sz?: DynamicValueJSON;
	l?: StateLightJSON[];
};

export type StateLightJSON = {
	id?: number;
	k?: DynamicValueJSON | number;
	fo?: DynamicValueJSON | number;
	c?: DynamicValueJSON | string;
	gc?: DynamicValueJSON | string;
	i?: DynamicValueJSON | number;
	io?: DynamicValueJSON | number;
	it?: DynamicValueJSON | number;
	x?: DynamicValueJSON | number;
	y?: DynamicValueJSON | number;
	z?: DynamicValueJSON | number;
	d?: DynamicValueJSON | number;
	a?: DynamicValueJSON | number;
	p?: DynamicValueJSON | number;
	tx?: DynamicValueJSON | number;
	ty?: DynamicValueJSON | number;
	tz?: DynamicValueJSON | number;
};

/** A light attached to a map object state. */
export class StateLight {
	public id: number;
	public kind: DynamicValue;
	public followOrientation: DynamicValue;
	public color: DynamicValue;
	public groundColor: DynamicValue;
	public intensity: DynamicValue;
	public intensityOffset: DynamicValue;
	public intensityTime: DynamicValue;
	public x: DynamicValue;
	public y: DynamicValue;
	public z: DynamicValue;
	public distance: DynamicValue;
	public angle: DynamicValue;
	public penumbra: DynamicValue;
	public targetX: DynamicValue;
	public targetY: DynamicValue;
	public targetZ: DynamicValue;

	constructor(json: StateLightJSON) {
		this.id = json.id ?? 0;
		this.kind = StateLight.readNumber(json.k, 0);
		const kind = typeof json.k === 'number' ? json.k : ((json.k as { v?: number } | undefined)?.v ?? 0);
		this.followOrientation = StateLight.readNumber(json.fo, kind === 1 ? 1 : 0);
		this.color = StateLight.readText(json.c, '#ffffff');
		this.groundColor = StateLight.readText(json.gc, '#444444');
		this.intensity = StateLight.readNumber(json.i, 5);
		this.intensityOffset = StateLight.readNumber(json.io, 0);
		this.intensityTime = StateLight.readNumber(json.it, 0);
		this.x = StateLight.readNumber(json.x, 0);
		this.y = StateLight.readNumber(json.y, 1);
		this.z = StateLight.readNumber(json.z, 0);
		this.distance = StateLight.readNumber(json.d, 2);
		this.angle = StateLight.readNumber(json.a, 45);
		this.penumbra = StateLight.readNumber(json.p, 0);
		this.targetX = StateLight.readNumber(json.tx, 0);
		this.targetY = StateLight.readNumber(json.ty, 0);
		this.targetZ = StateLight.readNumber(json.tz, -16);
	}

	createCopy(): StateLight {
		const light = new StateLight({ id: this.id });
		light.kind = this.kind.createCopy();
		light.followOrientation = this.followOrientation.createCopy();
		light.color = this.color.createCopy();
		light.groundColor = this.groundColor.createCopy();
		light.intensity = this.intensity.createCopy();
		light.intensityOffset = this.intensityOffset.createCopy();
		light.intensityTime = this.intensityTime.createCopy();
		light.x = this.x.createCopy();
		light.y = this.y.createCopy();
		light.z = this.z.createCopy();
		light.distance = this.distance.createCopy();
		light.angle = this.angle.createCopy();
		light.penumbra = this.penumbra.createCopy();
		light.targetX = this.targetX.createCopy();
		light.targetY = this.targetY.createCopy();
		light.targetZ = this.targetZ.createCopy();
		return light;
	}

	private static readNumber(json: DynamicValueJSON | number | undefined, fallback: number): DynamicValue {
		return typeof json === 'number'
			? DynamicValue.createNumberDouble(json)
			: DynamicValue.readOrDefaultNumberDouble(json, fallback);
	}

	private static readText(json: DynamicValueJSON | string | undefined, fallback: string): DynamicValue {
		return typeof json === 'string'
			? DynamicValue.createMessage(json)
			: DynamicValue.readOrDefaultMessage(json, fallback);
	}
}

/**
 * Structure of a plain state copy (returned by copyInstance).
 */
export type StateInstance = {
	graphicID: number;
	graphicKind: number;
	previousGraphicKind?: number;
	rectTileset: Rectangle | null;
	indexX: number;
	indexY: number;
	speedID: number;
	frequencyID: number;
	moveAnimation: boolean;
	stopAnimation: boolean;
	climbAnimation: boolean;
	directionFix: boolean;
	through: boolean;
	setWithCamera: boolean;
	pixelOffset: boolean;
	keepPosition: boolean;
	centerX: DynamicValue;
	centerZ: DynamicValue;
	angleX: DynamicValue;
	angleY: DynamicValue;
	angleZ: DynamicValue;
	scaleX: DynamicValue;
	scaleY: DynamicValue;
	scaleZ: DynamicValue;
	lights: StateLight[];
};

/**
 * Represents a possible state of an object.
 */
export class State extends Base {
	public id: number;
	public graphicID: number;
	public graphicKind: number;
	public rectTileset: Rectangle;
	public indexX: number;
	public indexY: number;
	public objectMovingKind: OBJECT_MOVING_KIND;
	public route: Reaction;
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
	public detection: EventCommand.Base | null;
	public centerX: DynamicValue;
	public centerZ: DynamicValue;
	public angleX: DynamicValue;
	public angleY: DynamicValue;
	public angleZ: DynamicValue;
	public scaleX: DynamicValue;
	public scaleY: DynamicValue;
	public scaleZ: DynamicValue;
	public lights: StateLight[];

	constructor(json?: StateJSON) {
		super(json);
	}

	/**
	 * Create a new plain object instance of this state.
	 */
	copyInstance(): StateInstance {
		return {
			graphicID: this.graphicID,
			graphicKind: this.graphicKind,
			rectTileset: this.rectTileset ? this.rectTileset.clone() : null,
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
			lights: this.lights.map((light) => light.createCopy()),
		};
	}

	/**
	 * Initialize this state from JSON data.
	 */
	read(json: StateJSON): void {
		this.id = json.id;
		this.graphicID = json.gid;
		this.graphicKind = json.gk;
		if (this.graphicID === 0) {
			this.rectTileset = Rectangle.createFromArray(json.rt);
		} else {
			this.indexX = json.x;
			this.indexY = json.y;
		}
		this.objectMovingKind = Utils.valueOrDefault(json.omk, OBJECT_MOVING_KIND.FIX);
		this.route = new Reaction({
			bh: false,
			c: [
				Utils.valueOrDefault(json.ecr, {
					kind: EVENT_COMMAND_KIND.MOVE_OBJECT,
					command: [DYNAMIC_VALUE_KIND.DATABASE, -1, 1, 1, 0, COMMAND_MOVE_KIND.MOVE_RANDOM, 0],
				}),
			],
		});
		this.speedID = Utils.valueOrDefault(json.s, 1);
		this.frequencyID = Utils.valueOrDefault(json.f, 1);
		this.moveAnimation = json.move;
		this.stopAnimation = json.stop;
		this.climbAnimation = json.climb;
		this.directionFix = json.dir;
		this.through = json.through;
		this.setWithCamera = json.cam;
		this.pixelOffset = json.pix;
		this.keepPosition = json.pos;
		const jsonDetection = Utils.valueOrDefault(json.ecd, null);
		this.detection = jsonDetection === null ? null : Manager.Events.getEventCommand(jsonDetection);
		this.centerX = DynamicValue.readOrDefaultNumberDouble(json.cx, 50);
		this.centerZ = DynamicValue.readOrDefaultNumberDouble(json.cz, 50);
		this.angleX = DynamicValue.readOrDefaultNumberDouble(json.ax, 0);
		this.angleY = DynamicValue.readOrDefaultNumberDouble(json.ay, 0);
		this.angleZ = DynamicValue.readOrDefaultNumberDouble(json.az, 0);
		this.scaleX = DynamicValue.readOrDefaultNumberDouble(json.sx, 1);
		this.scaleY = DynamicValue.readOrDefaultNumberDouble(json.sy, 1);
		this.scaleZ = DynamicValue.readOrDefaultNumberDouble(json.sz, 1);
		this.lights = (json.l ?? []).map((light) => new StateLight(light));
	}
}
