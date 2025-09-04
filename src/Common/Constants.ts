/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 * Common constants used.
 */
export class Constants {
	/** Default UI font size in pixels. */
	public static readonly DEFAULT_FONT_SIZE = 13;

	/** Default font family used across the UI. */
	public static readonly DEFAULT_FONT_NAME = 'Arial';

	/** Base tile size in pixels. */
	public static readonly BASIC_SQUARE_SIZE = 32;

	/** Small font size in pixels. */
	public static readonly SMALL_FONT_SIZE = 8;

	/** Medium font size in pixels. */
	public static readonly MEDIUM_FONT_SIZE = 10;

	/** Standard medium spacing in UI layouts. */
	public static readonly MEDIUM_SPACE = 5;

	/** Standard large spacing in UI layouts. */
	public static readonly LARGE_SPACE = 10;

	/** Standard huge spacing in UI layouts. */
	public static readonly HUGE_SPACE = 20;

	/** Raycasting distance constant (far). */
	public static readonly PORTIONS_RAY_FAR = 0;

	/** Size of a map portion in tiles. */
	public static readonly PORTION_SIZE = 16;

	/**
	 * Maximum allowed texture/picture size in pixels.
	 * Prevents loading assets too large for the rendering pipeline.
	 */
	public static readonly MAX_PICTURE_SIZE = 4096;

	/** Key name `"k"` used in JSON data. */
	public static readonly JSON_KEY = 'k';

	/** Value name `"v"` used in JSON data. */
	public static readonly JSON_VALUE = 'v';
}
