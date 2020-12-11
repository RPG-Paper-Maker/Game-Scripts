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
    constructor() {
        throw new Error("This is a static class!");
    }
}
Constants.DEFAULT_FONT_SIZE = 13;
Constants.DEFAULT_FONT_NAME = "sans-serif";
Constants.BASIC_SQUARE_SIZE = 32;
Constants.SMALL_FONT_SIZE = 8;
Constants.MEDIUM_FONT_SIZE = 10;
Constants.SMALL_SLOT_HEIGHT = 30;
Constants.MEDIUM_SLOT_WIDTH = 200;
Constants.MEDIUM_SLOT_HEIGHT = 40;
Constants.LARGE_SLOT_HEIGHT = 60;
Constants.MEDIUM_SPACE = 5;
Constants.LARGE_SPACE = 10;
Constants.HUGE_SPACE = 20;
Constants.PORTIONS_RAY_FAR = 0;
Constants.PORTION_SIZE = 16;
Constants.MAX_PICTURE_SIZE = 4096;
Constants.NONE_PADDING = [0, 0, 0, 0];
Constants.VERY_SMALL_PADDING_BOX = [5, 5, 5, 5];
Constants.SMALL_PADDING_BOX = [10, 10, 10, 10];
Constants.MEDIUM_PADDING_BOX = [20, 20, 20, 20];
Constants.HUGE_PADDING_BOX = [30, 30, 30, 30];
Constants.DIALOG_PADDING_BOX = [30, 50, 30, 50];
Constants.SMALL_SLOT_PADDING = [10, 5, 10, 5];
Constants.ONE_SECOND_MILLI = 1000;
Constants.NUM_BOOL_TRUE = 1;
Constants.NUM_BOOL_FALSE = 0;
Constants.COEF_TEX = 0.2;
Constants.CLASS_HIDDEN = "hidden";
Constants.STRING_RGBA = "rgba";
Constants.STRING_PARENTHESIS_LEFT = "(";
Constants.STRING_PARENTHESIS_RIGHT = ")";
Constants.STRING_BRACKET_LEFT = "[";
Constants.STRING_BRACKET_RIGHT = "]";
Constants.STRING_COMA = ",";
Constants.STRING_COLON = ":";
Constants.STRING_SLASH = "/";
Constants.STRING_NEW_LINE = "\n";
Constants.STRING_EQUAL = "=";
Constants.STRING_DASH = "-";
Constants.STRING_SPACE = " ";
Constants.STRING_ZERO = "0";
Constants.UNDEFINED = 'undefined';
Constants.NUMBER = "number";
Constants.STRING = "string";
Constants.JSON_KEY = "k";
Constants.JSON_VALUE = "v";
Constants.EXTENSION_JSON = ".json";
export { Constants };
