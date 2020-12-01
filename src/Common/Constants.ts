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
export class Constants {

    public static readonly SMALL_FONT_SIZE = 8;
    public static readonly MEDIUM_FONT_SIZE = 10;
    public static readonly SQUARE_SIZE = 32;
    public static readonly BATLLER_STEPS = 9;
    public static readonly SMALL_SLOT_HEIGHT = 30;
    public static readonly MEDIUM_SLOT_WIDTH = 200;
    public static readonly MEDIUM_SLOT_HEIGHT = 40;
    public static readonly LARGE_SLOT_HEIGHT = 60;
    public static readonly MEDIUM_SPACE = 5;
    public static readonly LARGE_SPACE = 10;
    public static readonly HUGE_SPACE = 20;
    public static readonly PORTIONS_RAY_FAR = 0;
    public static readonly PORTION_SIZE = 16;
    public static readonly MAX_PICTURE_SIZE = 4096;
    public static readonly NONE_PADDING = [0, 0, 0, 0];
    public static readonly VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
    public static readonly SMALL_PADDING_BOX = [10, 10, 10, 10];
    public static readonly MEDIUM_PADDING_BOX = [20, 20, 20, 20];
    public static readonly HUGE_PADDING_BOX = [30, 30, 30, 30];
    public static readonly DIALOG_PADDING_BOX = [30, 50, 30, 50];
    public static readonly SMALL_SLOT_PADDING = [10, 5, 10, 5];
    public static readonly ONE_SECOND_MILLI = 1000;
    public static readonly NUM_BOOL_TRUE = 1;
    public static readonly NUM_BOOL_FALSE = 0;
    public static readonly COEF_TEX = 0.2;
    public static readonly CLASS_HIDDEN = "hidden";
    public static readonly STRING_RGBA = "rgba";
    public static readonly STRING_EMPTY = "";
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
    public static readonly TAG_BOLD = "b";
    public static readonly TAG_ITALIC = "i";
    public static readonly TAG_LEFT = "l";
    public static readonly TAG_CENTER = "c";
    public static readonly TAG_RIGHT = "r";
    public static readonly TAG_SIZE = "size";
    public static readonly TAG_FONT = "font";
    public static readonly TAG_TEXT_COLOR = "textcolor";
    public static readonly TAG_BACK_COLOR = "backcolor";
    public static readonly TAG_STROKE_COLOR = "strokecolor";
    public static readonly TAG_VARIABLE = "var";
    public static readonly TAG_PARAMETER = "par";
    public static readonly TAG_PROPERTY = "pro";
    public static readonly TAG_HERO_NAME = "hname";
    public static readonly TAG_ICON = "ico";
    public static readonly DEFAULT_FONT = "sans-serif";
    public static readonly JSON_KEY = "k";
    public static readonly JSON_VALUE = "v";

    constructor() {
        throw new Error("This is a static class!");
    }
}