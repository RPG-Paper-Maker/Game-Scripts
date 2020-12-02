/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/**
 * The static class containing Path related constant
 * can be accessed through import
 * @example import {Path} from "../Constants";
 */
export class Paths {

    public static readonly ROOT_DIRECTORY_LOCAL = "."
    public static readonly FILES = "file:///";
    public static readonly DATAS = "/Content/Datas/";
    public static readonly FILE_MAPS = Paths.DATAS + "Maps";
    public static readonly FILE_MAP_INFOS = "/infos.json";
    public static readonly FILE_MAP_OBJECTS = "/objects.json";
    public static readonly FILE_PICTURES_DATAS = Paths.DATAS + "pictures.json";
    public static readonly FILE_VIDEOS_DATAS = Paths.DATAS + "videos.json";
    public static readonly FILE_SONGS_DATAS = Paths.DATAS + "songs.json";
    public static readonly FILE_SHAPES_DATAS = Paths.DATAS + "shapes.json";
    public static readonly FILE_COMMON_EVENTS = Paths.DATAS + "commonEvents.json";
    public static readonly FILE_ITEMS = Paths.DATAS + "items.json";
    public static readonly FILE_SKILLS = Paths.DATAS + "skills.json";
    public static readonly FILE_WEAPONS = Paths.DATAS + "weapons.json";
    public static readonly FILE_ARMORS = Paths.DATAS + "armors.json";
    public static readonly FILE_HEROES = Paths.DATAS + "heroes.json";
    public static readonly FILE_MONSTERS = Paths.DATAS + "monsters.json";
    public static readonly FILE_TROOPS = Paths.DATAS + "troops.json";
    public static readonly FILE_BATTLE_SYSTEM = Paths.DATAS + "battleSystem.json";
    public static readonly FILE_TITLE_SCREEN_GAME_OVER = Paths.DATAS + "titlescreenGameover.json";
    public static readonly FILE_KEYBOARD = Paths.DATAS + "keyBoard.json";
    public static readonly FILE_SYSTEM = Paths.DATAS + "system.json";
    public static readonly FILE_CLASSES = Paths.DATAS + "classes.json";
    public static readonly FILE_TILESETS_DATAS = Paths.DATAS + "tilesets.json";
    public static readonly FILE_SPECIAL_ELEMENTS = Paths.DATAS + "specialElements.json";
    public static readonly FILE_VARIABLES = Paths.DATAS + "variables.json";
    public static readonly FILE_SETTINGS = Paths.DATAS + "settings.json";
    public static readonly FILE_DLCS = Paths.DATAS + "dlcs.json";
    public static readonly FILE_ANIMATIONS = Paths.DATAS + "animations.json";

    constructor() {
        throw new Error("This is a static class");
    }
}