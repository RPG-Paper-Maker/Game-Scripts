/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from './Platform';

/**
 * The static class containing all the files paths.
 *
 * @class Paths
 */
class Paths {
	public static readonly ROOT_DIRECTORY_LOCAL = '.';
	public static readonly FILES = 'file:///';
	public static readonly TEST = Platform.ROOT_DIRECTORY + '/Test/';
	public static readonly FILE_MAPS = Platform.ROOT_DIRECTORY + 'Maps/';
	public static readonly FILE_MAP_INFOS = '/infos.json';
	public static readonly FILE_MAP_OBJECTS = '/objects.json';
	public static readonly FILE_PICTURES = Platform.ROOT_DIRECTORY + 'pictures.json';
	public static readonly FILE_VIDEOS = Platform.ROOT_DIRECTORY + 'videos.json';
	public static readonly FILE_FONTS = Platform.ROOT_DIRECTORY + 'fonts.json';
	public static readonly FILE_SONGS = Platform.ROOT_DIRECTORY + 'songs.json';
	public static readonly FILE_SHAPES = Platform.ROOT_DIRECTORY + 'shapes.json';
	public static readonly FILE_COMMON_EVENTS = Platform.ROOT_DIRECTORY + 'commonEvents.json';
	public static readonly FILE_ITEMS = Platform.ROOT_DIRECTORY + 'items.json';
	public static readonly FILE_SKILLS = Platform.ROOT_DIRECTORY + 'skills.json';
	public static readonly FILE_WEAPONS = Platform.ROOT_DIRECTORY + 'weapons.json';
	public static readonly FILE_ARMORS = Platform.ROOT_DIRECTORY + 'armors.json';
	public static readonly FILE_HEROES = Platform.ROOT_DIRECTORY + 'heroes.json';
	public static readonly FILE_MONSTERS = Platform.ROOT_DIRECTORY + 'monsters.json';
	public static readonly FILE_TROOPS = Platform.ROOT_DIRECTORY + 'troops.json';
	public static readonly FILE_BATTLE_SYSTEM = Platform.ROOT_DIRECTORY + 'battleSystem.json';
	public static readonly FILE_TITLE_SCREEN_GAME_OVER = Platform.ROOT_DIRECTORY + 'titlescreenGameover.json';
	public static readonly FILE_KEYBOARD = Platform.ROOT_DIRECTORY + 'keyBoard.json';
	public static readonly FILE_SYSTEM = Platform.ROOT_DIRECTORY + 'system.json';
	public static readonly FILE_CLASSES = Platform.ROOT_DIRECTORY + 'classes.json';
	public static readonly FILE_TILESETS = Platform.ROOT_DIRECTORY + 'tilesets.json';
	public static readonly FILE_SPECIAL_ELEMENTS = Platform.ROOT_DIRECTORY + 'specialElements.json';
	public static readonly FILE_VARIABLES = Platform.ROOT_DIRECTORY + 'variables.json';
	public static readonly FILE_SETTINGS = Platform.ROOT_DIRECTORY + 'settings.json';
	public static readonly FILE_DLCS = Platform.ROOT_DIRECTORY + 'dlcs.json';
	public static readonly FILE_ANIMATIONS = Platform.ROOT_DIRECTORY + 'animations.json';
	public static readonly FILE_STATUS = Platform.ROOT_DIRECTORY + 'status.json';
	public static readonly FILE_SCRIPTS = Platform.ROOT_DIRECTORY + 'scripts.json';
	public static readonly FILE_LANGS = Platform.ROOT_DIRECTORY + 'langs.json';
	public static readonly FILE_PROTECT = Platform.ROOT_DIRECTORY + '.protect';
	public static readonly FILE_TEST = Paths.TEST + 'test.json';
	public static readonly FILE_PLUGIN_CODE = 'code.js';
	public static readonly FILE_PLUGIN_DETAILS = 'details.json';
	public static readonly PICTURES = '/Images';
	public static readonly VIDEOS = '/Videos';
	public static readonly FONTS = '/Fonts';
	public static readonly HUD = Paths.PICTURES + '/HUD/';
	public static readonly TEXTURES2D = Paths.PICTURES + '/Textures2D/';
	public static readonly BARS = Paths.HUD + 'Bars';
	public static readonly FACESETS = Paths.HUD + 'Facesets';
	public static readonly ICONS = Paths.HUD + 'Icons';
	public static readonly WINDOW_SKINS = Paths.HUD + 'WindowSkins';
	public static readonly TITLE_SCREEN = Paths.HUD + 'TitleScreen';
	public static readonly GAME_OVER = Paths.HUD + 'GameOver';
	public static readonly HUD_PICTURES = Paths.HUD + 'Pictures';
	public static readonly ANIMATIONS = Paths.HUD + 'Animations';
	public static readonly AUTOTILES = Paths.TEXTURES2D + 'Autotiles';
	public static readonly CHARACTERS = Paths.TEXTURES2D + 'Characters';
	public static readonly TILESETS = Paths.TEXTURES2D + 'Tilesets';
	public static readonly WALLS = Paths.TEXTURES2D + 'Walls';
	public static readonly BATTLERS = Paths.TEXTURES2D + 'Battlers';
	public static readonly OBJECTS_3D = Paths.TEXTURES2D + 'Objects3D';
	public static readonly MOUNTAINS = Paths.TEXTURES2D + 'Mountains';
	public static readonly SKYBOXES = Paths.TEXTURES2D + 'SkyBoxes';
	public static readonly PARTICLES = Paths.TEXTURES2D + 'Particles';
	public static readonly SONGS = '/Songs/';
	public static readonly MUSICS = Paths.SONGS + 'Musics';
	public static readonly BACKGROUND_SOUNDS = Paths.SONGS + 'BackgroundSounds';
	public static readonly SOUNDS = Paths.SONGS + 'Sounds';
	public static readonly MUSIC_EFFECTS = Paths.SONGS + 'MusicEffects';
	public static readonly SHAPES = '/Shapes/';
	public static readonly OBJ = Paths.SHAPES + 'OBJ';
	public static readonly MTL = Paths.SHAPES + 'MTL';
	public static readonly OBJ_COLLISIONS = Paths.SHAPES + 'Collisions';
	public static readonly SCRIPTS = (Platform.WEB_DEV ? '.' + window.location.pathname : '') + 'Scripts/';
	public static readonly PLUGINS = Paths.SCRIPTS + 'Plugins/';
	public static readonly SYSTEM = Paths.SCRIPTS + 'System/';
	public static readonly SHADERS = Paths.SCRIPTS + 'Shaders/';
	public static readonly SAVES = Platform.ROOT_DIRECTORY + 'Saves';

	constructor() {
		throw new Error('This is a static class');
	}
}

export { Paths };
