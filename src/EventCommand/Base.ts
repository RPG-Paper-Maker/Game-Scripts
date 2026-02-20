/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject } from '../Core';

interface StructIterator {
	i: number;
}

/**
 *  @class
 *  An abstract event command.
 */
abstract class Base {
	public parallel: boolean;
	public disabled: boolean;

	constructor() {
		this.parallel = false;
		this.disabled = false;
	}

	/**
	 * Initialize the current state.
	 * @returns {Object} The current state
	 */
	initialize(): object {
		return null;
	}

	/**
	 * Update and check if the event is finished.
	 * @param {Record<string, any>} - currentState The current state of the event
	 * @param {MapObject} object - The current object reacting
	 * @param {number} state - The state ID
	 * @returns {number} The number of node to pass
	 */
	update(currentState?: Record<string, any>, object?: MapObject, state?: number): number {
		return 1;
	}

	/**
	 *  First key press handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} key - The key ID pressed
	 */
	onKeyPressed(currentState: object, key: string) {}

	/**
	 *  First key release handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} key - The key ID pressed
	 */
	onKeyReleased(currentState: object, key: string) {}

	/**
	 *  Key pressed repeat handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} key - The key ID pressed
	 *  @returns {boolean}
	 */
	onKeyPressedRepeat(currentState: object, key: string): boolean {
		return true;
	}

	/**
	 *  Key pressed repeat handle for the current stack, but with
	 *  a small wait after the first pressure (generally used for menus).
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} key - The key ID pressed
	 *  @returns {boolean}
	 */
	onKeyPressedAndRepeat(currentState: object, key: string): boolean {
		return true;
	}

	/**
	 *  Mouse down handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseDown(currentState: object, x: number, y: number) {}

	/**
	 *  Mouse move handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseMove(currentState: object, x: number, y: number) {}

	/**
	 *  Mouse up handle for the current stack.
	 *  @param {Object} currentState - The current state of the event
	 *  @param {number} x - The x mouse position on screen
	 *  @param {number} y - The y mouse position on screen
	 */
	onMouseUp(currentState: object, x: number, y: number) {}

	/**
	 *  Draw the HUD.
	 *  @param {Object} currentState - The current state of the event
	 */
	drawHUD(currentState?: object) {}
}

export { Base, StructIterator };
