/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Data, Manager, Scene } from '..';
import { Main } from '../main';

/**
 * Enumeration for mouse button codes.
 */
enum MOUSE_BUTTON {
	LEFT,
	MIDDLE,
	RIGHT,
}

/**
 *  Handles inputs for keyboard and mouse.
 */
export class Inputs {
	/** Currently pressed keys (by key string). */
	public static keysPressed: Set<string> = new Set();

	/** Locked keys mapped to the camera angle at which they were pressed. */
	public static lockedKeys: Map<string, number> = new Map();

	/** Whether the left mouse button is currently pressed. */
	public static mouseLeftPressed = false;

	/** Whether the right mouse button is currently pressed. */
	public static mouseRightPressed = false;

	/** X coordinate of the first mouse/touch press. */
	public static mouseFirstPressX = -1;

	/** Y coordinate of the first mouse/touch press. */
	public static mouseFirstPressY = -1;

	/** Current X coordinate of the mouse/touch. */
	public static mouseX = -1;

	/** Current Y coordinate of the mouse/touch. */
	public static mouseY = -1;

	/**
	 * Checks if a specific key is currently pressed.
	 * @param key The key string to check
	 */
	static isKeyPressed(key: string): boolean {
		return this.keysPressed.has(key);
	}

	/**
	 * Returns whether the game is in a ready state to process inputs.
	 * Ensures the main game is loaded and not in a loading transition.
	 */
	private static isReady(): boolean {
		return Main.loaded && !Manager.Stack.isLoading();
	}

	/**
	 * Static utility class responsible for handling all user input:
	 * - Keyboard events
	 * - Mouse events
	 * - Touch events
	 */
	static initialize() {
		this.initializeKeyboard();
		this.initializeMouse();
	}

	static clear() {
		this.keysPressed.clear();
		this.lockedKeys.clear();
		this.mouseLeftPressed = false;
		this.mouseRightPressed = false;
	}

	/**
	 * Sets up all keyboard-related event listeners.
	 */
	static initializeKeyboard() {
		document.addEventListener('keydown', this.onKeyDown.bind(this), false);
		document.addEventListener('keyup', this.onKeyUp.bind(this), false);
	}

	/**
	 * Sets up all mouse and touch-related event listeners.
	 */
	static initializeMouse() {
		document.addEventListener('contextmenu', (e) => e.preventDefault(), false); // Prevent context menu on right click
		document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		document.addEventListener('touchstart', this.onTouchStart.bind(this), false);
		document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
		document.addEventListener('touchmove', this.onTouchMove.bind(this), false);
	}

	/**
	 * Handles `keydown` events:
	 * - Detects fullscreen toggle
	 * - Adds keys to the pressed state if not repeating.
	 * - Calls stack methods for pressed and repeat.
	 */
	private static onKeyDown(event: KeyboardEvent) {
		if (!this.isReady()) {
			return;
		}
		const key = event.key;

		// Fullscreen toggle
		if (key === 'F4' || (event.code === 'Enter' && (event.altKey || event.shiftKey))) {
			Data.Systems.switchFullscreen();
			event.preventDefault();
			return;
		}

		// Only register first non-repeated press
		if (!event.repeat && !this.keysPressed.has(key)) {
			this.keysPressed.add(key);
			Manager.Stack.onKeyPressed(key);
			if (Manager.Stack.isLoading()) {
				// If a scene was created
				return;
			}
		}

		Manager.Stack.onKeyPressedAndRepeat(key);
	}

	/**
	 * Handles `keyup` events:
	 * - Removes released keys from pressed/locked sets.
	 * - Calls stack release handler.
	 */
	private static onKeyUp(event: KeyboardEvent) {
		if (this.isReady()) {
			const key = event.key;
			this.keysPressed.delete(key);
			this.lockedKeys.delete(key);
			Manager.Stack.onKeyReleased(key);
		} else {
			this.keysPressed.clear();
		}
	}

	/**
	 * Handles `mousedown` events:
	 * - Tracks left/right button state.
	 * - Saves first press position.
	 * - Calls stack mouse down handler.
	 */
	private static onMouseDown(event: MouseEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		if (event.button === MOUSE_BUTTON.LEFT) {
			this.mouseLeftPressed = true;
		}
		if (event.button === MOUSE_BUTTON.RIGHT) {
			this.mouseRightPressed = true;
		}
		this.mouseFirstPressX = event.clientX;
		this.mouseFirstPressY = event.clientY;
		Manager.Stack.onMouseDown(event.clientX, event.clientY);
	}

	/**
	 * Handles `mouseup` events:
	 * - Tracks left/right button release.
	 * - Calls stack mouse up handler.
	 */
	private static onMouseUp(event: MouseEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		Manager.Stack.onMouseUp(event.clientX, event.clientY);
		if (event.button === MOUSE_BUTTON.LEFT) {
			this.mouseLeftPressed = false;
		}
		if (event.button === MOUSE_BUTTON.RIGHT) {
			this.mouseRightPressed = false;
		}
	}

	/**
	 * Handles `mousemove` events:
	 * - Updates mouse coordinates.
	 * - Calls stack mouse move handler.
	 */
	private static onMouseMove(event: MouseEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
		Manager.Stack.onMouseMove(event.clientX, event.clientY);
	}

	/**
	 * Handles `touchstart` events:
	 * - Simulates left mouse button press.
	 * - Saves first press coordinates.
	 * - Calls stack mouse down handler.
	 */
	private static onTouchStart(event: TouchEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		this.mouseLeftPressed = true;
		this.mouseFirstPressX = event.touches[0].pageX;
		this.mouseFirstPressY = event.touches[0].pageY;
		Manager.Stack.onMouseDown(this.mouseFirstPressX, this.mouseFirstPressY);
	}

	/**
	 * Handles `touchmove` events:
	 * - Updates current touch coordinates.
	 * - Calls stack mouse move handler.
	 */
	private static onTouchMove(event: TouchEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		this.mouseX = event.touches[0].pageX;
		this.mouseY = event.touches[0].pageY;
		Manager.Stack.onMouseMove(this.mouseX, this.mouseY);
	}

	/**
	 * Handles `touchend` events:
	 * - Simulates mouse button release.
	 * - Calls stack mouse up handler.
	 */
	private static onTouchEnd(_event: TouchEvent) {
		if (!this.isReady() || !Data.Systems.isMouseControls) {
			return;
		}
		Manager.Stack.onMouseUp(this.mouseX, this.mouseY);
		this.mouseLeftPressed = false;
	}

	/**
	 * Updates locked keys according to a new camera angle.
	 * Prevents undesired movement input when the camera rotates.
	 * @param angle Camera angle before it changed.
	 */
	static updateLockedKeysAngles(angle: number) {
		if (Scene.Map.current.camera.horizontalAngle !== angle) {
			for (const key of this.keysPressed) {
				if (!this.lockedKeys.has(key)) {
					this.lockedKeys.set(key, angle);
				}
			}
		}
	}
}
