/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import {
	COMMAND_MOVE_KIND,
	ELEMENT_MAP_KIND,
	EVENT_COMMAND_KIND,
	Inputs,
	Mathf,
	ORIENTATION,
	Platform,
	Utils,
} from '../Common';
import { Game, MapObject, ReactionInterpreter, StructSearchResult } from '../Core';
import { Datas, EventCommand, Manager, Scene, System } from '../index';
import { Base } from './Base';

/** @class
 *  An event command for moving object.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class MoveObject extends Base {
	public static lockedInputs = false; // TEMP: to remove after adding the locked option
	public static followGrid = false; // TEMP: to remove after adding the option

	public objectID: System.DynamicValue;
	public isIgnore: boolean;
	public isWaitEnd: boolean;
	public isCameraOrientation: boolean;
	public moves: Function[];
	public parameters: Record<string, any>[];
	public kind: COMMAND_MOVE_KIND;

	constructor(command: any[]) {
		super();

		const iterator = {
			i: 0,
		};
		const l = command.length;

		// Object ID
		this.objectID = System.DynamicValue.createValueCommand(command, iterator);

		// Options
		this.isIgnore = Utils.numToBool(command[iterator.i++]);
		this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
		this.isCameraOrientation = Utils.numToBool(command[iterator.i++]);

		// List of move commands
		this.moves = [];
		this.parameters = [];
		let permanent: boolean;
		while (iterator.i < l) {
			this.kind = command[iterator.i++];
			if (this.kind >= COMMAND_MOVE_KIND.MOVE_NORTH && this.kind <= COMMAND_MOVE_KIND.MOVE_BACK) {
				this.parameters.push({
					square: !Utils.numToBool(command[iterator.i++]),
				});
				switch (this.kind) {
					case COMMAND_MOVE_KIND.MOVE_NORTH:
						this.moves.push(this.moveNorth);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH:
						this.moves.push(this.moveSouth);
						break;
					case COMMAND_MOVE_KIND.MOVE_WEST:
						this.moves.push(this.moveWest);
						break;
					case COMMAND_MOVE_KIND.MOVE_EAST:
						this.moves.push(this.moveEast);
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_WEST:
						this.moves.push(this.moveNorthWest);
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_EAST:
						this.moves.push(this.moveNorthEast);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_WEST:
						this.moves.push(this.moveSouthWest);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_EAST:
						this.moves.push(this.moveSouthEast);
						break;
					case COMMAND_MOVE_KIND.MOVE_RANDOM:
						this.moves.push(this.moveRandom);
						break;
					case COMMAND_MOVE_KIND.MOVE_HERO:
						this.moves.push(this.moveHero);
						break;
					case COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO:
						this.moves.push(this.moveOppositeHero);
						break;
					case COMMAND_MOVE_KIND.MOVE_FRONT:
						this.moves.push(this.moveFront);
						break;
					case COMMAND_MOVE_KIND.MOVE_BACK:
						this.moves.push(this.moveBack);
						break;
					case COMMAND_MOVE_KIND.JUMP:
						this.moves.push(this.jump);
						break;
				}
			} else if (this.kind === COMMAND_MOVE_KIND.JUMP) {
				const square = !Utils.numToBool(command[iterator.i++]);
				const x = System.DynamicValue.createValueCommand(command, iterator);
				const y = System.DynamicValue.createValueCommand(command, iterator);
				const yPlus = System.DynamicValue.createValueCommand(command, iterator);
				const z = System.DynamicValue.createValueCommand(command, iterator);
				const peakY = System.DynamicValue.createValueCommand(command, iterator);
				const peakYPlus = System.DynamicValue.createValueCommand(command, iterator);
				const time = System.DynamicValue.createValueCommand(command, iterator);
				this.parameters.push({
					square: square,
					x: x,
					y: y,
					yPlus: yPlus,
					z: z,
					peakY: peakY,
					peakYPlus: peakYPlus,
					time: time,
				});
				this.moves.push(this.jump);
			} else if (this.kind === COMMAND_MOVE_KIND.CHANGE_GRAPHICS) {
				permanent = Utils.numToBool(command[iterator.i++]);
				const dontChangeOrientation = Utils.numToBool(command[iterator.i++]);
				const indexKind = command[iterator.i++];
				let kind = ELEMENT_MAP_KIND.NONE;
				switch (indexKind) {
					case 0:
						kind = ELEMENT_MAP_KIND.NONE;
						break;
					case 1:
						kind = ELEMENT_MAP_KIND.SPRITES_FIX;
						break;
					case 2:
						kind = ELEMENT_MAP_KIND.SPRITES_FACE;
						break;
					case 3:
						kind = ELEMENT_MAP_KIND.OBJECT_3D;
						break;
				}
				const pictureID = System.DynamicValue.createValueCommand(command, iterator);
				iterator.i++;
				const indexX = command[iterator.i++];
				const indexY = command[iterator.i++];
				const width = command[iterator.i++];
				const height = command[iterator.i++];
				this.parameters.push({
					permanent: permanent,
					dontChangeOrientation: dontChangeOrientation,
					kind: kind,
					pictureID: pictureID,
					indexX: indexX,
					indexY: indexY,
					width: width,
					height: height,
				});
				this.moves.push(this.changeGraphics);
			} else if (
				this.kind >= COMMAND_MOVE_KIND.TURN_NORTH &&
				this.kind <= COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE
			) {
				this.parameters.push({});
				switch (this.kind) {
					case COMMAND_MOVE_KIND.TURN_NORTH:
						this.moves.push(this.turnNorth);
						break;
					case COMMAND_MOVE_KIND.TURN_SOUTH:
						this.moves.push(this.turnSouth);
						break;
					case COMMAND_MOVE_KIND.TURN_WEST:
						this.moves.push(this.turnWest);
						break;
					case COMMAND_MOVE_KIND.TURN_EAST:
						this.moves.push(this.turnEast);
						break;
					case COMMAND_MOVE_KIND.TURN_90_RIGHT:
						this.moves.push(this.turn90Right);
						break;
					case COMMAND_MOVE_KIND.TURN_90_LEFT:
						this.moves.push(this.turn90Left);
						break;
					case COMMAND_MOVE_KIND.LOOK_AT_HERO:
						this.moves.push(this.lookAtHero);
						break;
					case COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE:
						this.moves.push(this.lookAtHeroOpposite);
						break;
				}
			} else if (
				this.kind === COMMAND_MOVE_KIND.CHANGE_SPEED ||
				this.kind === COMMAND_MOVE_KIND.CHANGE_FREQUENCY
			) {
				const permanent = Utils.numToBool(command[iterator.i++]);
				const value = System.DynamicValue.createValueCommand(command, iterator);
				this.parameters.push({
					permanent: permanent,
					value: value,
				});
				if (this.kind === COMMAND_MOVE_KIND.CHANGE_SPEED) {
					this.moves.push(this.changeSpeed);
				} else {
					this.moves.push(this.changeFrequency);
				}
			} else if (this.kind >= COMMAND_MOVE_KIND.MOVE_ANIMATION && this.kind <= COMMAND_MOVE_KIND.KEEP_POSITION) {
				const onOff = Utils.numToBool(command[iterator.i++]);
				const permanent = Utils.numToBool(command[iterator.i++]);
				this.parameters.push({
					onOff: onOff,
					permanent: permanent,
				});
				switch (this.kind) {
					case COMMAND_MOVE_KIND.MOVE_ANIMATION:
						this.moves.push(this.moveAnimation);
						break;
					case COMMAND_MOVE_KIND.STOP_ANIMATION:
						this.moves.push(this.stopAnimation);
						break;
					case COMMAND_MOVE_KIND.CLIMB_ANIMATION:
						this.moves.push(this.climbAnimation);
						break;
					case COMMAND_MOVE_KIND.FIX_DIRECTION:
						this.moves.push(this.directionFix);
						break;
					case COMMAND_MOVE_KIND.THROUGH:
						this.moves.push(this.through);
						break;
					case COMMAND_MOVE_KIND.SET_WITH_CAMERA:
						this.moves.push(this.setWithCamera);
						break;
					case COMMAND_MOVE_KIND.PIXEL_OFFSET:
						this.moves.push(this.pixelOffset);
						break;
					case COMMAND_MOVE_KIND.KEEP_POSITION:
						this.moves.push(this.keepPosition);
						break;
				}
			} else if (this.kind >= COMMAND_MOVE_KIND.WAIT && this.kind <= COMMAND_MOVE_KIND.SCRIPT) {
				let kind: EVENT_COMMAND_KIND, l: number;
				switch (this.kind) {
					case COMMAND_MOVE_KIND.WAIT:
						kind = EVENT_COMMAND_KIND.WAIT;
						l = 2;
						break;
					case COMMAND_MOVE_KIND.PLAY_SOUND:
						kind = EVENT_COMMAND_KIND.PLAY_SOUND;
						l = 12;
						break;
					case COMMAND_MOVE_KIND.SCRIPT:
						kind = EVENT_COMMAND_KIND.SCRIPT;
						l = Utils.numToBool(command[iterator.i]) ? 3 : 2;
						break;
				}
				const commandList = command.slice(iterator.i, iterator.i + l);
				iterator.i += l;
				const eventCommand = Manager.Events.getEventCommand({
					kind: kind,
					command: commandList,
				});
				this.parameters.push({
					command: eventCommand,
				});
				this.moves.push(this.useCommand);
			}
		}
		this.parallel = !this.isWaitEnd;
	}

	/**
	 *  Get the opposite orientation.
	 *  @static
	 *  @param {Orientation} orientation - The orientation
	 *  @returns {Orientation} The current state
	 */
	static oppositeOrientation(orientation: ORIENTATION): ORIENTATION {
		switch (orientation) {
			case ORIENTATION.SOUTH:
				return ORIENTATION.NORTH;
			case ORIENTATION.WEST:
				return ORIENTATION.EAST;
			case ORIENTATION.NORTH:
				return ORIENTATION.SOUTH;
			case ORIENTATION.EAST:
				return ORIENTATION.WEST;
			case ORIENTATION.SOUTH_WEST:
				return ORIENTATION.NORTH_EAST;
			case ORIENTATION.SOUTH_EAST:
				return ORIENTATION.NORTH_WEST;
			case ORIENTATION.NORTH_WEST:
				return ORIENTATION.SOUTH_EAST;
			case ORIENTATION.NORTH_EAST:
				return ORIENTATION.SOUTH_WEST;
		}
	}

	/**
	 *  Initialize the current state.
	 *  @returns {Record<string, any>} The current state
	 */
	initialize(): Record<string, any> {
		return {
			parallel: this.isWaitEnd,
			index: 0,
			distance: 0,
			normalDistance: 0,
			position: null,
			waitingPosition: false,
			moved: false,
			object: null,
			random: Mathf.random(0, 3),
			moveHeroOrientation: null,
			pause: false,
			currentTime: -1,
			commandState: null,
		};
	}

	getLockedOrientation(orientation: ORIENTATION) {
		if (this.isCameraOrientation && Inputs.lockedKeys.size > 0) {
			const currentEvent = ReactionInterpreter.currentReaction.currentReaction.event;
			if (currentEvent && currentEvent.idEvent === 3 && currentEvent.isSystem) {
				const pressedKey = ReactionInterpreter.currentParameters[1].getValue();
				const lockedAngle = Inputs.lockedKeys.get(pressedKey);
				if (lockedAngle !== undefined) {
					const dif = lockedAngle - Scene.Map.current.camera.horizontalAngle;
					const angleDif = Math.round(dif / 90);
					return Mathf.mod(orientation + angleDif, 4);
				}
			}
		}
		return orientation;
	}

	/**
	 *  Function to move north.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {bool} square - Indicate if it is a square move
	 *  @param {Orientation} orientation - The orientation where to move
	 *  @returns {boolean}
	 */
	move(currentState: Record<string, any>, object: MapObject, square: boolean, orientation: ORIENTATION): boolean {
		if (object.moveFrequencyTick > 0) {
			return false;
		}
		if (MoveObject.lockedInputs) {
			orientation = this.getLockedOrientation(orientation);
		}
		const angle = this.isCameraOrientation
			? MoveObject.followGrid
				? Math.round(Scene.Map.current.camera.horizontalAngle / 90) * 90
				: Scene.Map.current.camera.horizontalAngle
			: -90.0;
		if (currentState.position === null && square) {
			currentState.position = object.getFuturPosition(orientation, Datas.Systems.SQUARE_SIZE, angle)[0];
		}
		if (object.previousMoveCommand === null && object.previousOrientation === null) {
			object.previousMoveCommand = this;
			object.previousOrientation = orientation;
		} else if (object.previousMoveCommand === this) {
			if (object.otherMoveCommand) {
				this.moveFrequency(object);
				return true;
			}
		} else if (object.previousMoveCommand && object.otherMoveCommand && object.otherMoveCommand !== this) {
			this.moveFrequency(object);
			return true;
		} else if (object.previousMoveCommand !== this) {
			object.otherMoveCommand = this;
		}
		const distances = object.move(
			orientation,
			Datas.Systems.SQUARE_SIZE - currentState.distance,
			angle,
			this.isCameraOrientation
		);
		currentState.distance += distances[0];
		currentState.normalDistance += distances[1];
		if (
			!square ||
			(square && currentState.normalDistance >= Datas.Systems.SQUARE_SIZE) ||
			(square && currentState.distance >= Datas.Systems.SQUARE_SIZE) ||
			distances[0] === 0
		) {
			if (distances[0] === 0 && square && !this.isIgnore) {
				currentState.position = null;
				object.moving = true;
				return false;
			}
			if (square && currentState.distance === currentState.normalDistance) {
				object.position = currentState.position;
			}
			object.previousOrientation = null;
			object.previousMoveCommand = null;
			object.otherMoveCommand = null;
			this.moveFrequency(object);
			return true;
		}
		return false;
	}

	/**
	 *  Change the frequency tick of the object.
	 *  @param {MapObject} object - The object to move
	 */
	moveFrequency(object: MapObject) {
		object.moveFrequencyTick = object.frequency.getValue() * 1000;
	}

	/**
	 *  Function to move north.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveNorth(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		return object ? this.move(currentState, object, parameters.square, ORIENTATION.NORTH) : ORIENTATION.NORTH;
	}

	/**
	 *  Function to move south.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveSouth(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			return this.move(currentState, object, parameters.square, ORIENTATION.SOUTH);
		}
		return ORIENTATION.SOUTH;
	}

	/**
	 *  Function to move west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveWest(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			return this.move(currentState, object, parameters.square, ORIENTATION.WEST);
		}
		return ORIENTATION.WEST;
	}

	/**
	 *  Function to move east.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveEast(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			return this.move(currentState, object, parameters.square, ORIENTATION.EAST);
		}
		return ORIENTATION.EAST;
	}

	/**
	 *  Function to move north west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveNorthWest(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.previousOrientation = ORIENTATION.NORTH;
		}
		const orientation = this.moveWest(currentState, object, parameters);
		return object ? orientation : ORIENTATION.NORTH;
	}

	/**
	 *  Function to move north west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveNorthEast(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.previousOrientation = ORIENTATION.NORTH;
		}
		const orientation = this.moveEast(currentState, object, parameters);
		return object ? orientation : ORIENTATION.NORTH;
	}

	/**
	 *  Function to move north west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveSouthWest(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.previousOrientation = ORIENTATION.SOUTH;
		}
		const orientation = this.moveWest(currentState, object, parameters);
		return object ? orientation : ORIENTATION.SOUTH;
	}

	/**
	 *  Function to move north west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveSouthEast(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.previousOrientation = ORIENTATION.SOUTH;
		}
		const orientation = this.moveEast(currentState, object, parameters);
		return object ? orientation : ORIENTATION.SOUTH;
	}

	/**
	 *  Function to move random.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveRandom(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		switch (currentState.random) {
			case COMMAND_MOVE_KIND.MOVE_NORTH:
				return this.moveNorth(currentState, object, parameters);
			case COMMAND_MOVE_KIND.MOVE_SOUTH:
				return this.moveSouth(currentState, object, parameters);
			case COMMAND_MOVE_KIND.MOVE_WEST:
				return this.moveWest(currentState, object, parameters);
			case COMMAND_MOVE_KIND.MOVE_EAST:
				return this.moveEast(currentState, object, parameters);
		}
	}

	/**
	 *  Function to move hero.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveHero(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		return this.moveHeroAndOpposite(currentState, object, parameters, false);
	}

	/**
	 *  Function to move opposite to hero.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveOppositeHero(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		return this.moveHeroAndOpposite(currentState, object, parameters, true);
	}

	/**
	 *  Function to move hero and opposite hero.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Object} parameters - The parameters
	 *  @param {boolean} opposite - Indicate if opposite
	 *  @returns {Orientation}
	 */
	moveHeroAndOpposite(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>,
		opposite: boolean
	): ORIENTATION | boolean {
		if (object) {
			let orientation =
				currentState.moveHeroOrientation === null
					? this.getHeroOrientation(object)
					: currentState.moveHeroOrientation;
			currentState.moveHeroOrientation = orientation;
			if (opposite) {
				orientation = EventCommand.MoveObject.oppositeOrientation(orientation);
			}
			switch (orientation) {
				case ORIENTATION.SOUTH_WEST:
					return this.moveSouthWest(currentState, object, parameters);
				case ORIENTATION.SOUTH_EAST:
					return this.moveSouthEast(currentState, object, parameters);
				case ORIENTATION.NORTH_WEST:
					return this.moveNorthWest(currentState, object, parameters);
				case ORIENTATION.NORTH_EAST:
					return this.moveNorthEast(currentState, object, parameters);
				default:
					return this.move(currentState, object, parameters.square, orientation);
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to move front.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveFront(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			const orientation =
				currentState.moveHeroOrientation === null ? object.orientationEye : currentState.moveHeroOrientation;
			currentState.moveHeroOrientation = orientation;
			return this.move(currentState, object, parameters.square, currentState.moveHeroOrientation);
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to move back.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveBack(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			const orientation =
				currentState.moveHeroOrientation === null
					? EventCommand.MoveObject.oppositeOrientation(object.orientationEye)
					: currentState.moveHeroOrientation;
			currentState.moveHeroOrientation = orientation;
			return this.move(currentState, object, parameters.square, currentState.moveHeroOrientation);
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to jump.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	jump(currentState: Record<string, any>, object: MapObject, parameters: Record<string, any>): ORIENTATION | boolean {
		if (object) {
			if (currentState.currentTime === -1) {
				currentState.currentTime = 0;
				currentState.startJump = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
				const square = parameters.square ? Datas.Systems.SQUARE_SIZE : 1;
				currentState.endJump = new THREE.Vector3(
					parameters.x.getValue() * square + currentState.startJump.x,
					parameters.y.getValue() * square + parameters.yPlus.getValue() + currentState.startJump.y,
					parameters.z.getValue() * square + currentState.startJump.z
				);
				currentState.peak =
					parameters.peakY.getValue() * Datas.Systems.SQUARE_SIZE + parameters.peakYPlus.getValue();
				if (currentState.peak < currentState.endJump.y) {
					Platform.showErrorMessage(
						'Move object command: jump peak cannot be lower than final y position offset. Final position=' +
							currentState.endJump.y +
							'px, Peak position=' +
							currentState.peak +
							'px'
					);
				}
				currentState.time = parameters.time.getValue() * 1000;
			}
			currentState.currentTime = object.jump(
				currentState.startJump,
				currentState.endJump,
				currentState.peak,
				currentState.currentTime,
				currentState.time
			);
			if (currentState.currentTime === currentState.time) {
				currentState.currentTime = -1;
				return true;
			} else {
				return false;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to look at north.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turnNorth(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((ORIENTATION.NORTH + (this.isCameraOrientation ? Scene.Map.current.orientation : 0)) % 4);
			return true;
		}
		return ORIENTATION.NORTH;
	}

	/**
	 *  Function to look at south.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turnSouth(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((ORIENTATION.SOUTH + (this.isCameraOrientation ? Scene.Map.current.orientation : 0)) % 4);
			return true;
		}
		return ORIENTATION.SOUTH;
	}

	/**
	 *  Function to look at west.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turnWest(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((ORIENTATION.WEST + (this.isCameraOrientation ? Scene.Map.current.orientation : 0)) % 4);
			return true;
		}
		return ORIENTATION.WEST;
	}

	/**
	 *  Function to look at east.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turnEast(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((ORIENTATION.EAST + (this.isCameraOrientation ? Scene.Map.current.orientation : 0)) % 4);
			return true;
		}
		return ORIENTATION.EAST;
	}

	/**
	 *  Function to look at 90° right.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turn90Right(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((object.orientationEye + 1) % 4);
			return true;
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to look at 90° left.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	turn90Left(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((object.orientationEye - 1) % 4);
			return true;
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to look at hero.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	lookAtHero(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt(object.getOrientationBetween(Game.current.hero));
			return true;
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to look at hero opposite.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	lookAtHeroOpposite(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			object.lookAt((object.getOrientationBetween(Game.current.hero) + 2) % 4);
			return true;
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to change graphics.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 */
	changeGraphics(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.previousGraphicKind = object.currentStateInstance.graphicKind;
			object.currentStateInstance.graphicKind = parameters.kind;
			object.currentStateInstance.graphicID = parameters.pictureID.getValue();
			if (object.currentStateInstance.graphicID === 0) {
				object.currentStateInstance.rectTileset = [
					parameters.indexX,
					parameters.indexY,
					parameters.width,
					parameters.height,
				];
			} else {
				object.currentStateInstance.indexX = parameters.indexX;
				object.currentStateInstance.indexY = parameters.dontChangeOrientation
					? object.orientationEye
					: parameters.indexY;
			}

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.gid = object.currentStateInstance.graphicID;
				options.gk = object.currentStateInstance.graphicKind;
				options.gt = object.currentStateInstance.rectTileset;
				options.gix = object.currentStateInstance.indexX;
				options.giy = object.currentStateInstance.indexY;
			}

			// Graphic update
			object.changeState();
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to change speed.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	changeSpeed(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.speedID = parameters.value.getValue();

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.sid = object.currentStateInstance.speedID;
			}
			object.currentStateInstance.indexX = object.frame.value;
			object.currentStateInstance.indexY = object.orientationEye;
			object.changeState();
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to change frequency.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	changeFrequency(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.frequencyID = parameters.value.getValue();

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.fid = object.currentStateInstance.frequencyID;
			}
			object.currentStateInstance.indexX = object.frame.value;
			object.currentStateInstance.indexY = object.orientationEye;
			object.changeState();
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to move animation.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	moveAnimation(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.moveAnimation = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.ma = object.currentStateInstance.moveAnimation;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to stop animation.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	stopAnimation(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.stopAnimation = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.sa = object.currentStateInstance.stopAnimation;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to climb animation.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	climbAnimation(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.climbAnimation = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.ca = object.currentStateInstance.climbAnimation;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to direction fix.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	directionFix(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.directionFix = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.df = object.currentStateInstance.directionFix;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to through.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	through(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.through = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.t = object.currentStateInstance.through;
			}
			// Update bounding box
			object.updateBB(object.position);
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to set with camera.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	setWithCamera(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.setWithCamera = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.swc = object.currentStateInstance.setWithCamera;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to pixel offset.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	pixelOffset(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.pixelOffset = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.po = object.currentStateInstance.pixelOffset;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to keep position.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	keepPosition(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			// Change object current state value
			object.currentStateInstance.keepPosition = parameters.onOff;

			// Permanent change
			if (parameters.permanent) {
				const options = this.getPermanentOptions(object);
				if (options === null) {
					return;
				}
				options.kp = object.currentStateInstance.keepPosition;
			}
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Function to wait, play a sound, and script.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The object to move
	 *  @param {Record<string, any>} - parameters The parameters
	 *  @returns {Orientation}
	 */
	useCommand(
		currentState: Record<string, any>,
		object: MapObject,
		parameters: Record<string, any>
	): ORIENTATION | boolean {
		if (object) {
			if (currentState.commandState === null) {
				currentState.commandState = parameters.command.initialize();
			}
			if (parameters.command.update(currentState.commandState, object) != 0) {
				currentState.commandState = null;
				return true;
			}
			return false;
		}
		return ORIENTATION.NONE;
	}

	/**
	 *  Get the hero orientation.
	 *  @param {MapObject} object - The object to move
	 *  @returns {Orientation}
	 */
	getHeroOrientation(object: MapObject): ORIENTATION {
		const xDif = object.position.x - Game.current.hero.position.x;
		const zDif = object.position.z - Game.current.hero.position.z;
		let orientationX = ORIENTATION.NONE;
		let orientationZ = ORIENTATION.NONE;
		if (xDif > 1) {
			orientationX = ORIENTATION.WEST;
		} else if (xDif < -1) {
			orientationX = ORIENTATION.EAST;
		}
		if (zDif > 1) {
			orientationZ = ORIENTATION.NORTH;
		} else if (zDif < -1) {
			orientationZ = ORIENTATION.SOUTH;
		}
		switch (orientationX) {
			case ORIENTATION.NONE: {
				return orientationZ;
			}
			case ORIENTATION.WEST: {
				switch (orientationZ) {
					case ORIENTATION.NONE:
						return ORIENTATION.WEST;
					case ORIENTATION.NORTH:
						return ORIENTATION.NORTH_WEST;
					case ORIENTATION.SOUTH:
						return ORIENTATION.SOUTH_WEST;
				}
				break;
			}
			case ORIENTATION.EAST: {
				switch (orientationZ) {
					case ORIENTATION.NONE:
						return ORIENTATION.EAST;
					case ORIENTATION.NORTH:
						return ORIENTATION.NORTH_EAST;
					case ORIENTATION.SOUTH:
						return ORIENTATION.SOUTH_EAST;
				}
			}
		}
	}

	/**
	 *  Get the current orientation.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @returns {Orientation}
	 */
	getCurrentOrientation(currentState: Record<string, any>): ORIENTATION {
		if (this.moves.length === 0) {
			return ORIENTATION.NONE;
		}
		return this.moves[currentState.index].call(this, currentState);
	}

	/**
	 *  Get the permanent options. Returns null if startup object.
	 *  @param {Core.MapObject} - currentState The current state of the event
	 *  @returns {Record<string, any>}
	 */
	getPermanentOptions(object: MapObject): Record<string, any> {
		let statesOptions: Record<string, any>[];
		if (object.isHero) {
			statesOptions = Game.current.heroStatesOptions;
		} else if (object.isStartup) {
			return null;
		} else {
			const portion = Scene.Map.current.mapProperties.allObjects[object.system.id].getGlobalPortion();
			const portionDatas = Game.current.getPortionDatas(Scene.Map.current.id, portion);
			const indexProp = portionDatas.soi.indexOf(object.system.id);
			if (indexProp === -1) {
				statesOptions = [];
				portionDatas.soi.push(object.system.id);
				portionDatas.so.push(statesOptions);
			} else {
				statesOptions = portionDatas.so[indexProp];
			}
		}
		let options = statesOptions[object.currentState.id - 1];
		if (!options) {
			options = {};
			statesOptions[object.currentState.id - 1] = options;
		}
		return options;
	}

	/**
	 *  Update and check if the event is finished.
	 *  @param {Record<string, any>} - currentState The current state of the event
	 *  @param {MapObject} object - The current object reacting
	 *  @param {number} state - The state ID
	 *  @returns {number} The number of node to pass
	 */
	update(currentState: Record<string, any>, object: MapObject, state: number): number {
		if (currentState.pause) {
			return 0;
		}
		if (currentState.parallel && this.moves.length > 0) {
			if (!currentState.waitingObject) {
				const objectID = this.objectID.getValue();
				MapObject.search(
					objectID,
					(result: StructSearchResult) => {
						currentState.object = result.object;
					},
					object
				);
				currentState.waitingObject = true;
			}
			if (currentState.object !== null) {
				const finished = this.moves[currentState.index].call(
					this,
					currentState,
					currentState.object,
					this.parameters[currentState.index]
				);

				if (finished) {
					currentState.distance = 0;
					currentState.normalDistance = 0;
					currentState.index = currentState.index + 1;
					currentState.random = Mathf.random(0, 3);
					currentState.position = null;
					currentState.moveHeroOrientation = null;
					// Check random battle steps
					if (object && object.isHero) {
						Scene.Map.current.mapProperties.checkRandomBattle();
					}
				}
				return this.moves[currentState.index] == null ? 1 : 0;
			}
			return 0;
		}
		return 1;
	}
}

export { MoveObject };
