/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *  The common class for constants
 */
class Constants {

    public static readonly DEFAULT_FONT_SIZE = 13;
    public static readonly DEFAULT_FONT_NAME = "sans-serif";
    public static readonly BASIC_SQUARE_SIZE = 32;
    public static readonly SMALL_FONT_SIZE = 8;
    public static readonly MEDIUM_FONT_SIZE = 10;
    public static readonly MEDIUM_SPACE = 5;
    public static readonly LARGE_SPACE = 10;
    public static readonly HUGE_SPACE = 20;
    public static readonly PORTIONS_RAY_FAR = 0;
    public static readonly PORTION_SIZE = 16;
    public static readonly MAX_PICTURE_SIZE = 4096;
    public static readonly ONE_SECOND_MILLI = 1000;
    public static readonly NUM_BOOL_TRUE = 1;
    public static readonly NUM_BOOL_FALSE = 0;
    public static readonly CLASS_HIDDEN = "hidden";
    public static readonly STRING_RGBA = "rgba";
    public static readonly STRING_PARENTHESIS_LEFT = "(";
    public static readonly STRING_PARENTHESIS_RIGHT = ")";
    public static readonly STRING_BRACKET_LEFT = "[";
    public static readonly STRING_BRACKET_RIGHT = "]";
    public static readonly STRING_COMA = ",";
    public static readonly STRING_COLON = ":";
    public static readonly STRING_SLASH = "/";
    public static readonly STRING_NEW_LINE = "\n";
    public static readonly STRING_EQUAL = "=";
    public static readonly STRING_DASH = "-";
    public static readonly STRING_SPACE = " ";
    public static readonly STRING_ZERO = "0";
    public static readonly UNDEFINED = 'undefined';
    public static readonly NUMBER = "number";
    public static readonly STRING = "string";
    public static readonly JSON_KEY = "k";
    public static readonly JSON_VALUE = "v";
    public static readonly EXTENSION_JSON = ".json";

    constructor() {
        throw new Error("This is a static class!");
    }
}

export { Constants }