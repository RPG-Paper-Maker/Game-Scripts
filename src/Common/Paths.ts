/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from "./index.js";

/**
 * The static class containing Path related constant
 * can be accessed through import
 * @example import {Path} from "../Constants";
 */
export class Paths {

    public static readonly BR: string;
    public static readonly ROOT_DIRECTORY_LOCAL: string = "."
    public static readonly FILES: string = "file:///";
    public static readonly DATAS: string = Platform.ROOT_DIRECTORY + "/Content/Datas/";
    public static readonly FILE_MAPS: string = Paths.DATAS + "Maps";
    public static readonly FILE_MAP_INFOS: string = "/infos.json";
    public static readonly FILE_MAP_OBJECTS: string = "/objects.json";
    public static readonly FILE_PICTURES_DATAS: string = Paths.DATAS + "pictures.json";
    public static readonly FILE_VIDEOS_DATAS: string = Paths.DATAS + "videos.json";
    public static readonly FILE_SONGS_DATAS: string = Paths.DATAS + "songs.json";
    public static readonly FILE_SHAPES_DATAS: string = Paths.DATAS + "shapes.json";
    public static readonly FILE_COMMON_EVENTS: string = Paths.DATAS + "commonEvents.json";
    public static readonly FILE_ITEMS: string = Paths.DATAS + "items.json";
    public static readonly FILE_SKILLS: string = Paths.DATAS + "skills.json";
    public static readonly FILE_WEAPONS: string = Paths.DATAS + "weapons.json";
    public static readonly FILE_ARMORS: string = Paths.DATAS + "armors.json";
    public static readonly FILE_HEROES: string = Paths.DATAS + "heroes.json";
    public static readonly FILE_MONSTERS: string = Paths.DATAS + "monsters.json";
    public static readonly FILE_TROOPS: string = Paths.DATAS + "troops.json";
    public static readonly FILE_BATTLE_SYSTEM: string = Paths.DATAS + "battleSystem.json";
    public static readonly FILE_TITLE_SCREEN_GAME_OVER: string = Paths.DATAS + "titlescreenGameover.json";
    public static readonly FILE_KEYBOARD: string = Paths.DATAS + "keyBoard.json";
    public static readonly FILE_SYSTEM: string = Paths.DATAS + "system.json";
    public static readonly FILE_CLASSES: string = Paths.DATAS + "classes.json";
    public static readonly FILE_TILESETS_DATAS: string = Paths.DATAS + "tilesets.json";
    public static readonly FILE_SPECIAL_ELEMENTS: string = Paths.DATAS + "specialElements.json";
    public static readonly FILE_VARIABLES: string = Paths.DATAS + "variables.json";
    public static readonly FILE_SETTINGS: string = Paths.DATAS + "settings.json";
    public static readonly FILE_DLCS: string = Paths.DATAS + "dlcs.json";
    public static readonly FILE_ANIMATIONS: string = Paths.DATAS + "animations.json";

    constructor() {
        throw new Error("This is a static class");
    }
}