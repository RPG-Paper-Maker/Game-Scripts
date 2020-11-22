import {Platform} from "../core";


/**
 * The static class containing Path related constant
 * can be accessed through import
 * @example import {Path} from "../Constants";
 */
export class Paths {

    public static readonly BR = "";
    public static readonly ROOT_DIRECTORY_LOCAL = "."
    public static readonly FILES = "file:///";
    public static readonly DATAS = Platform.ROOT_DIRECTORY + "/Content/Datas/";

    public static readonly FILE_MAPS = Paths.DATAS + "Maps";
    public static readonly FILE_MAP_INFOS = "/infos.json";
    public static readonly FILE_MAP_OBJECTS = "/objects.json";
    public static readonly FILE_PICTURES_DATAS = Paths.DATAS + "pictures.json";
    public static readonly FILE_VIDEOS_DATAS = Paths.DATAS + "videos.json";
    public static readonly FILE_SONGS_DATAS = Paths.DATAS + "songs.json";
    public static readonly FILE_SHAPES_DATAS = Paths.DATAS + "shapes.json";
    public static readonly FILE_COMMON_EVENTS = Paths.DATAS + "commonEvents.json";

    public static readonly FILE_ITEMS = Paths.DATAS + "items.json";
    static FILE_SKILLS = Paths.DATAS + "skills.json";
    static FILE_WEAPONS = Paths.DATAS + "weapons.json";
    static FILE_ARMORS = Paths.DATAS + "armors.json";
    static FILE_HEROES = Paths.DATAS + "heroes.json";
    static FILE_MONSTERS = Paths.DATAS + "monsters.json";
    static FILE_TROOPS = Paths.DATAS + "troops.json";
    static FILE_BATTLE_SYSTEM = Paths.DATAS + "battleSystem.json";
    static FILE_TITLE_SCREEN_GAME_OVER = Paths.DATAS + "titlescreenGameover.json";
    static FILE_KEYBOARD = RPM.PATH_DATAS + "keyBoard" + RPM.EXTENSION_JSON;
    static FILE_SYSTEM = RPM.PATH_DATAS + "system" + RPM.EXTENSION_JSON;
    static FILE_CLASSES = RPM.PATH_DATAS + "classes" + RPM.EXTENSION_JSON;
    static FILE_TILESETS_DATAS = RPM.PATH_DATAS + "tilesets" + RPM
        .EXTENSION_JSON;
    static FILE_SPECIAL_ELEMENTS = RPM.PATH_DATAS + "specialElements" + RPM
        .EXTENSION_JSON;
    static FILE_VARIABLES = RPM.PATH_DATAS + "variables" + RPM.EXTENSION_JSON;
    static FILE_SETTINGS = RPM.PATH_DATAS + "settings" + RPM.EXTENSION_JSON;
    static FILE_DLCS = RPM.PATH_DATAS + "dlcs" + RPM.EXTENSION_JSON;
    static FILE_ANIMATIONS = RPM.PATH_DATAS + "animations" + RPM.EXTENSION_JSON;

    constructor() {
        throw new Error("This is a static class");
    }
}