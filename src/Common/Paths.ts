/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from './Platform';

/**
 * Centralized registry of engine-relative file and directory paths.
 *
 * All paths are built relative to {@link Platform.ROOT_DIRECTORY}, unless
 * otherwise noted. This class is static-only.
 */
export class Paths {
	// -------------------------------------------------------------------------
	// Generic
	// -------------------------------------------------------------------------

	/** Prefix for `file://` URLs (used in desktop contexts). */
	static readonly FILES = 'file:///';

	/** Root test folder. */
	static readonly TEST = Platform.ROOT_DIRECTORY + 'Test/';

	/** Test configuration JSON. */
	static readonly FILE_TEST = Paths.TEST + 'test.json';

	/** Protection flag file. */
	static readonly FILE_PROTECT = Platform.ROOT_DIRECTORY + '.protect';

	// -------------------------------------------------------------------------
	// Data JSON files
	// -------------------------------------------------------------------------

	static readonly FILE_MAPS = Platform.ROOT_DIRECTORY + 'Maps/';
	static readonly FILE_MAP_INFOS = '/infos.json';
	static readonly FILE_PICTURES = Platform.ROOT_DIRECTORY + 'pictures.json';
	static readonly FILE_VIDEOS = Platform.ROOT_DIRECTORY + 'videos.json';
	static readonly FILE_FONTS = Platform.ROOT_DIRECTORY + 'fonts.json';
	static readonly FILE_SONGS = Platform.ROOT_DIRECTORY + 'songs.json';
	static readonly FILE_SHAPES = Platform.ROOT_DIRECTORY + 'shapes.json';
	static readonly FILE_COMMON_EVENTS = Platform.ROOT_DIRECTORY + 'commonEvents.json';
	static readonly FILE_ITEMS = Platform.ROOT_DIRECTORY + 'items.json';
	static readonly FILE_SKILLS = Platform.ROOT_DIRECTORY + 'skills.json';
	static readonly FILE_WEAPONS = Platform.ROOT_DIRECTORY + 'weapons.json';
	static readonly FILE_ARMORS = Platform.ROOT_DIRECTORY + 'armors.json';
	static readonly FILE_HEROES = Platform.ROOT_DIRECTORY + 'heroes.json';
	static readonly FILE_MONSTERS = Platform.ROOT_DIRECTORY + 'monsters.json';
	static readonly FILE_TROOPS = Platform.ROOT_DIRECTORY + 'troops.json';
	static readonly FILE_BATTLE_SYSTEM = Platform.ROOT_DIRECTORY + 'battleSystem.json';
	static readonly FILE_TITLE_SCREEN_GAME_OVER = Platform.ROOT_DIRECTORY + 'titlescreenGameover.json';
	static readonly FILE_KEYBOARD = Platform.ROOT_DIRECTORY + 'keyboard.json';
	static readonly FILE_SYSTEM = Platform.ROOT_DIRECTORY + 'system.json';
	static readonly FILE_CLASSES = Platform.ROOT_DIRECTORY + 'classes.json';
	static readonly FILE_TILESETS = Platform.ROOT_DIRECTORY + 'tilesets.json';
	static readonly FILE_SPECIAL_ELEMENTS = Platform.ROOT_DIRECTORY + 'specialElements.json';
	static readonly FILE_VARIABLES = Platform.ROOT_DIRECTORY + 'variables.json';
	static readonly FILE_SETTINGS = Platform.ROOT_DIRECTORY + 'settings.json';
	static readonly FILE_DLCS = Platform.ROOT_DIRECTORY + 'dlcs.json';
	static readonly FILE_ANIMATIONS = Platform.ROOT_DIRECTORY + 'animations.json';
	static readonly FILE_STATUS = Platform.ROOT_DIRECTORY + 'status.json';
	static readonly FILE_SCRIPTS = Platform.ROOT_DIRECTORY + 'scripts.json';
	static readonly FILE_LANGS = Platform.ROOT_DIRECTORY + 'langs.json';

	// -------------------------------------------------------------------------
	// Asset folders
	// -------------------------------------------------------------------------

	// Media types
	static readonly PICTURES = 'Images';
	static readonly VIDEOS = 'Videos';
	static readonly FONTS = 'Fonts';
	static readonly SONGS = 'Songs/';
	static readonly SHAPES = 'Shapes/';

	// HUD and UI
	static readonly HUD = Paths.PICTURES + '/HUD/';
	static readonly TEXTURES2D = Paths.PICTURES + '/Textures2D/';
	static readonly BARS = Paths.HUD + 'Bars';
	static readonly FACESETS = Paths.HUD + 'Facesets';
	static readonly ICONS = Paths.HUD + 'Icons';
	static readonly WINDOW_SKINS = Paths.HUD + 'WindowSkins';
	static readonly TITLE_SCREEN = Paths.HUD + 'TitleScreen';
	static readonly GAME_OVER = Paths.HUD + 'GameOver';
	static readonly HUD_PICTURES = Paths.HUD + 'Pictures';
	static readonly ANIMATIONS = Paths.HUD + 'Animations';

	// Textures
	static readonly AUTOTILES = Paths.TEXTURES2D + 'Autotiles';
	static readonly CHARACTERS = Paths.TEXTURES2D + 'Characters';
	static readonly TILESETS = Paths.TEXTURES2D + 'Tilesets';
	static readonly WALLS = Paths.TEXTURES2D + 'Walls';
	static readonly BATTLERS = Paths.TEXTURES2D + 'Battlers';
	static readonly OBJECTS_3D = Paths.TEXTURES2D + 'Objects3D';
	static readonly MOUNTAINS = Paths.TEXTURES2D + 'Mountains';
	static readonly SKYBOXES = Paths.TEXTURES2D + 'SkyBoxes';
	static readonly PARTICLES = Paths.TEXTURES2D + 'Particles';

	// Audio
	static readonly MUSICS = Paths.SONGS + 'Musics';
	static readonly BACKGROUND_SOUNDS = Paths.SONGS + 'BackgroundSounds';
	static readonly SOUNDS = Paths.SONGS + 'Sounds';
	static readonly MUSIC_EFFECTS = Paths.SONGS + 'MusicEffects';

	// Shapes
	static readonly OBJ = Paths.SHAPES + 'OBJ';
	static readonly MTL = Paths.SHAPES + 'MTL';
	static readonly OBJ_COLLISIONS = Paths.SHAPES + 'Collisions';
	static readonly GLTF = Paths.SHAPES + 'GLTF';

	// -------------------------------------------------------------------------
	// Scripts, plugins, shaders, saves
	// -------------------------------------------------------------------------

	/** Base path for game scripts (adjusted for web builds). */
	static readonly SCRIPTS =
		(Platform.WEB_DEV && !Platform.IS_DESKTOP
			? '.' + window.location.pathname
			: Platform.IS_DESKTOP
				? ''
				: Platform.ROOT_DIRECTORY) + 'Scripts/';
	static readonly PLUGINS = Platform.ROOT_DIRECTORY + 'Plugins/';
	static readonly SHADERS = Paths.SCRIPTS + 'Shaders/';
	static readonly SAVES = Platform.ROOT_DIRECTORY + 'Saves';
	static readonly FILE_PLUGIN_CODE = 'code.js';
	static readonly FILE_PLUGIN_DETAILS = 'details.json';
}
