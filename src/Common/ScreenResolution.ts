/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 * Provides quick access to screen resolution variables and transformation
 * functions.
 *
 * This class is static-only and is responsible for converting normalized
 * coordinates to screen pixels (and vice versa).
 */
export class ScreenResolution {
	// -------------------------------------------------------------------------
	// Base resolution
	// -------------------------------------------------------------------------

	/** Default screen width in pixels. */
	static readonly SCREEN_X = 640;

	/** Default screen height in pixels. */
	static readonly SCREEN_Y = 480;

	// -------------------------------------------------------------------------
	// Dynamic resolution values
	// (set externally at runtime, e.g., when resizing window)
	// -------------------------------------------------------------------------

	/** Actual canvas width in pixels. */
	static CANVAS_WIDTH: number;

	/** Actual canvas height in pixels. */
	static CANVAS_HEIGHT: number;

	/** Horizontal scaling factor (normalized → screen). */
	static WINDOW_X: number;

	/** Vertical scaling factor (normalized → screen). */
	static WINDOW_Y: number;

	// -------------------------------------------------------------------------
	// Conversion methods
	// -------------------------------------------------------------------------

	/**
	 * Convert a normalized X coordinate to screen pixels (rounded up).
	 * @param x - Normalized X position.
	 */
	static getScreenX(x: number): number {
		return Math.ceil(ScreenResolution.getDoubleScreenX(x));
	}

	/**
	 * Convert a normalized Y coordinate to screen pixels (rounded up).
	 * @param y - Normalized Y position.
	 */
	static getScreenY(y: number): number {
		return Math.ceil(ScreenResolution.getDoubleScreenY(y));
	}

	/**
	 * Convert a screen X coordinate back to normalized value.
	 * @param x - Screen X position in pixels.
	 */
	static getScreenXReverse(x: number): number {
		return Math.floor(x / ScreenResolution.WINDOW_X);
	}

	/**
	 * Convert a screen Y coordinate back to normalized value.
	 * @param y - Screen Y position in pixels.
	 */
	static getScreenYReverse(y: number): number {
		return Math.floor(y / ScreenResolution.WINDOW_Y);
	}

	/**
	 * Convert a normalized XY value using the average of width and height
	 * scaling factors.
	 * @param xy - Normalized coordinate.
	 */
	static getScreenXY(xy: number): number {
		return ((ScreenResolution.WINDOW_X + ScreenResolution.WINDOW_Y) / 2) * xy;
	}

	/**
	 * Convert a normalized XY value using the smaller of width and height
	 * scaling factors.
	 * @param xy - Normalized coordinate.
	 */
	static getScreenMinXY(xy: number): number {
		return xy * Math.min(ScreenResolution.WINDOW_X, ScreenResolution.WINDOW_Y);
	}

	/**
	 * Convert a normalized X coordinate to screen pixels (without rounding).
	 * @param x - Normalized X position.
	 */
	static getDoubleScreenX(x: number): number {
		return ScreenResolution.WINDOW_X * x;
	}

	/**
	 * Convert a normalized Y coordinate to screen pixels (without rounding).
	 * @param y - Normalized Y position.
	 */
	static getDoubleScreenY(y: number): number {
		return ScreenResolution.WINDOW_Y * y;
	}
}
