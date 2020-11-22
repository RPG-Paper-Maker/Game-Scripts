/**
 * The common class for constant and static function
 */
export class Constants {

    static SMALL_FONT_SIZE = 8;
    static MEDIUM_FONT_SIZE = 10;
    static SQUARE_SIZE = 32;
    static BATLLER_STEPS = 9;
    static SMALL_SLOT_HEIGHT = 30;
    static MEDIUM_SLOT_WIDTH = 200;
    static MEDIUM_SLOT_HEIGHT = 40;
    static LARGE_SLOT_HEIGHT = 60;
    static MEDIUM_SPACE = 5;
    static LARGE_SPACE = 10;
    static HUGE_SPACE = 20;
    static PORTIONS_RAY_FAR = 0;
    static PORTION_SIZE = 16;
    static MAX_PICTURE_SIZE = 4096;
    static SCREEN_X = 640;
    static SCREEN_Y = 480;
    static NONE_PADDING = [0, 0, 0, 0];
    static VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
    static SMALL_PADDING_BOX = [10, 10, 10, 10];
    static MEDIUM_PADDING_BOX = [20, 20, 20, 20];
    static HUGE_PADDING_BOX = [30, 30, 30, 30];
    static DIALOG_PADDING_BOX = [30, 50, 30, 50];
    static SMALL_SLOT_PADDING = [10, 5, 10, 5];
    static ONE_SECOND_MILLI = 1000;
    static NUM_BOOL_TRUE = 1;
    static NUM_BOOL_FALSE = 0;
    static COEF_TEX = 0.2;
    static LOADING_MIN_DELAY = 100;
    static CLASS_HIDDEN = "hidden";
    static STRING_RGBA = "rgba";
    static STRING_EMPTY = "";
    static STRING_PARENTHESIS_LEFT = "(";
    static STRING_PARENTHESIS_RIGHT = ")";
    static STRING_BRACKET_LEFT = "[";
    static STRING_BRACKET_RIGHT = "]";
    static STRING_COMA = ",";
    static STRING_COLON = ":";
    static STRING_SLASH = "/";
    static STRING_NEW_LINE = "\n";
    static STRING_EQUAL = "=";
    static STRING_DASH = "-";
    static STRING_SPACE = " ";
    static STRING_ZERO = "0";
    static UNDEFINED = 'undefined';
    static NUMBER = "number";
    static STRING = "string";
    static TAG_BOLD = "b";
    static TAG_ITALIC = "i";
    static TAG_LEFT = "l";
    static TAG_CENTER = "c";
    static TAG_RIGHT = "r";
    static TAG_SIZE = "size";
    static TAG_FONT = "font";
    static TAG_TEXT_COLOR = "textcolor";
    static TAG_BACK_COLOR = "backcolor";
    static TAG_STROKE_COLOR = "strokecolor";
    static TAG_VARIABLE = "var";
    static TAG_PARAMETER = "par";
    static TAG_PROPERTY = "pro";
    static TAG_HERO_NAME = "hname";
    static TAG_ICON = "ico";
    static DEFAULT_FONT = "sans-serif";
    static JSON_KEY = "k";
    static JSON_VALUE = "v";

    constructor() {
        throw new Error("This is a static class!");
    }
}