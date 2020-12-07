/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   The key event class used to convert Qt keys to web keys.
 */
class KeyEvent {

    static keysPressed: number[] = [];
    static DOM_VK_CANCEL = 3;
    static DOM_VK_HELP = 6;
    static DOM_VK_BACK_SPACE = 8;
    static DOM_VK_TAB = 9;
    static DOM_VK_CLEAR = 12;
    static DOM_VK_RETURN = 13;
    static DOM_VK_ENTER = 14;
    static DOM_VK_SHIFT = 16;
    static DOM_VK_CONTROL = 17;
    static DOM_VK_ALT = 18;
    static DOM_VK_PAUSE = 19;
    static DOM_VK_CAPS_LOCK = 20;
    static DOM_VK_ESCAPE = 27;
    static DOM_VK_SPACE = 32;
    static DOM_VK_PAGE_UP = 33;
    static DOM_VK_PAGE_DOWN = 34;
    static DOM_VK_END = 35;
    static DOM_VK_HOME = 36;
    static DOM_VK_LEFT = 37;
    static DOM_VK_UP = 38;
    static DOM_VK_RIGHT = 39;
    static DOM_VK_DOWN = 40;
    static DOM_VK_PRINTSCREEN = 44;
    static DOM_VK_INSERT = 45;
    static DOM_VK_DELETE = 46;
    static DOM_VK_0 = 48;
    static DOM_VK_1 = 49;
    static DOM_VK_2 = 50;
    static DOM_VK_3 = 51;
    static DOM_VK_4 = 52;
    static DOM_VK_5 = 53;
    static DOM_VK_6 = 54;
    static DOM_VK_7 = 55;
    static DOM_VK_8 = 56;
    static DOM_VK_9 = 57;
    static DOM_VK_SEMICOLON = 59;
    static DOM_VK_EQUALS = 61;
    static DOM_VK_A = 65;
    static DOM_VK_B = 66;
    static DOM_VK_C = 67;
    static DOM_VK_D = 68;
    static DOM_VK_E = 69;
    static DOM_VK_F = 70;
    static DOM_VK_G = 71;
    static DOM_VK_H = 72;
    static DOM_VK_I = 73;
    static DOM_VK_J = 74;
    static DOM_VK_K = 75;
    static DOM_VK_L = 76;
    static DOM_VK_M = 77;
    static DOM_VK_N = 78;
    static DOM_VK_O = 79;
    static DOM_VK_P = 80;
    static DOM_VK_Q = 81;
    static DOM_VK_R = 82;
    static DOM_VK_S = 83;
    static DOM_VK_T = 84;
    static DOM_VK_U = 85;
    static DOM_VK_V = 86;
    static DOM_VK_W = 87;
    static DOM_VK_X = 88;
    static DOM_VK_Y = 89;
    static DOM_VK_Z = 90;
    static DOM_VK_NUMPAD0 = 96;
    static DOM_VK_NUMPAD1 = 97;
    static DOM_VK_NUMPAD2 = 98;
    static DOM_VK_NUMPAD3 = 99;
    static DOM_VK_NUMPAD4 = 100;
    static DOM_VK_NUMPAD5 = 101;
    static DOM_VK_NUMPAD6 = 102;
    static DOM_VK_NUMPAD7 = 103;
    static DOM_VK_NUMPAD8 = 104;
    static DOM_VK_NUMPAD9 = 105;
    static DOM_VK_MULTIPLY = 106;
    static DOM_VK_ADD = 107;
    static DOM_VK_SEPARATOR = 108;
    static DOM_VK_SUBTRACT = 109;
    static DOM_VK_DECIMAL = 110;
    static DOM_VK_DIVIDE = 111;
    static DOM_VK_F1 = 112;
    static DOM_VK_F2 = 113;
    static DOM_VK_F3 = 114;
    static DOM_VK_F4 = 115;
    static DOM_VK_F5 = 116;
    static DOM_VK_F6 = 117;
    static DOM_VK_F7 = 118;
    static DOM_VK_F8 = 119;
    static DOM_VK_F9 = 120;
    static DOM_VK_F10 = 121;
    static DOM_VK_F11 = 122;
    static DOM_VK_F12 = 123;
    static DOM_VK_F13 = 124;
    static DOM_VK_F14 = 125;
    static DOM_VK_F15 = 126;
    static DOM_VK_F16 = 127;
    static DOM_VK_F17 = 128;
    static DOM_VK_F18 = 129;
    static DOM_VK_F19 = 130;
    static DOM_VK_F20 = 131;
    static DOM_VK_F21 = 132;
    static DOM_VK_F22 = 133;
    static DOM_VK_F23 = 134;
    static DOM_VK_F24 = 135;
    static DOM_VK_NUM_LOCK = 144;
    static DOM_VK_SCROLL_LOCK = 145;
    static DOM_VK_COMMA = 188;
    static DOM_VK_PERIOD = 190;
    static DOM_VK_SLASH = 191;
    static DOM_VK_BACK_QUOTE = 192;
    static DOM_VK_OPEN_BRACKET = 219;
    static DOM_VK_BACK_SLASH = 220;
    static DOM_VK_CLOSE_BRACKET = 221;
    static DOM_VK_QUOTE = 222;
    static DOM_VK_META = 224;
    static SQUARE = 178;
    static AMPERSAND = 38;
    static E_ACCENT_RIGHT = 201;
    static TILDE = 126;
    static HASH = 35;
    static APOSTROPHE = 39;
    static LEFT_PARENTHESIS = 40;
    static LEFT_BRACES = 123;
    static RIGHT_BRACES = 126;
    static E_ACCENT_LEFT = 200;
    static UNDERSCORE = 95;
    static C_UNDER = 199;
    static CARAT = 94;
    static A_ACCENT = 192;
    static AT = 64;
    static RIGHT_PARENTHESIS = 41;
    static DEGREE = 176;
    static TREMA = 16781911;
    static CARAT_2 = 16781906;
    static POUND = 163;
    static DOLLAR = 36;
    static YEN = 164;
    static U_GRAVE = 217;
    static PERCENT = 37;
    static MU = 924;
    static QUESTION = 63;
    static POINT = 46;
    static COLON = 58;
    static SECTION_SIGN = 167;
    static EXCLAMATION = 33;
    static ALT_GR = 16781571;
    static LESS_THAN = 60;
    static GREATER_THAN = 62;

    /** Convert Qt key to DOM.
     *   @static
     *   @param {number} key The qt key to convert
     *   @returns {number}
     */
    static qtToDOM(key: number): number {
        switch (key) {
            case 16777219:
                return KeyEvent.DOM_VK_BACK_SPACE;
            case 16777217:
                return KeyEvent.DOM_VK_TAB;
            case 16777220:
                return KeyEvent.DOM_VK_RETURN;
            case 16777221:
                return KeyEvent.DOM_VK_ENTER;
            case 16777248:
                return KeyEvent.DOM_VK_SHIFT;
            case 16777249:
                return KeyEvent.DOM_VK_CONTROL;
            case 16777251:
                return KeyEvent.DOM_VK_ALT;
            case 16777224:
                return KeyEvent.DOM_VK_PAUSE;
            case 16777252:
                return KeyEvent.DOM_VK_CAPS_LOCK;
            case 16777216:
                return KeyEvent.DOM_VK_ESCAPE;
            case 16777238:
                return KeyEvent.DOM_VK_PAGE_UP;
            case 16777239:
                return KeyEvent.DOM_VK_PAGE_DOWN;
            case 16777233:
                return KeyEvent.DOM_VK_END;
            case 16777250:
                return KeyEvent.DOM_VK_HOME;
            case 16777234:
                return KeyEvent.DOM_VK_LEFT;
            case 16777235:
                return KeyEvent.DOM_VK_UP;
            case 16777236:
                return KeyEvent.DOM_VK_RIGHT;
            case 16777237:
                return KeyEvent.DOM_VK_DOWN;
            case 16777222:
                return KeyEvent.DOM_VK_INSERT;
            case 16777223:
                return KeyEvent.DOM_VK_DELETE;
            case 42:
                return KeyEvent.DOM_VK_MULTIPLY;
            case 43:
                return KeyEvent.DOM_VK_ADD;
            case 124:
                return KeyEvent.DOM_VK_SEPARATOR;
            case 45:
                return KeyEvent.DOM_VK_SUBTRACT;
            case 16777223:
                return KeyEvent.DOM_VK_DECIMAL;
            case 47:
                return KeyEvent.DOM_VK_DIVIDE;
            case 16777264:
                return KeyEvent.DOM_VK_F1;
            case 16777265:
                return KeyEvent.DOM_VK_F2;
            case 16777266:
                return KeyEvent.DOM_VK_F3;
            case 16777267:
                return KeyEvent.DOM_VK_F4;
            case 16777268:
                return KeyEvent.DOM_VK_F5;
            case 16777269:
                return KeyEvent.DOM_VK_F6;
            case 16777270:
                return KeyEvent.DOM_VK_F7;
            case 16777271:
                return KeyEvent.DOM_VK_F8;
            case 16777272:
                return KeyEvent.DOM_VK_F9;
            case 16777273:
                return KeyEvent.DOM_VK_F10;
            case 16777274:
                return KeyEvent.DOM_VK_F11;
            case 16777275:
                return KeyEvent.DOM_VK_F12;
            case 16777276:
                return KeyEvent.DOM_VK_F13;
            case 16777277:
                return KeyEvent.DOM_VK_F14;
            case 16777278:
                return KeyEvent.DOM_VK_F15;
            case 16777279:
                return KeyEvent.DOM_VK_F16;
            case 16777280:
                return KeyEvent.DOM_VK_F17;
            case 16777281:
                return KeyEvent.DOM_VK_F18;
            case 16777282:
                return KeyEvent.DOM_VK_F19;
            case 16777283:
                return KeyEvent.DOM_VK_F20;
            case 16777284:
                return KeyEvent.DOM_VK_F21;
            case 16777285:
                return KeyEvent.DOM_VK_F22;
            case 16777286:
                return KeyEvent.DOM_VK_F23;
            case 16777287:
                return KeyEvent.DOM_VK_F24;
            case 16777253:
                return KeyEvent.DOM_VK_NUM_LOCK;
            case 44:
                return KeyEvent.DOM_VK_COMMA;
            case 96:
                return KeyEvent.DOM_VK_BACK_QUOTE;
            case 91:
                return KeyEvent.DOM_VK_OPEN_BRACKET;
            case 92:
                return KeyEvent.DOM_VK_BACK_SLASH;
            case 93:
                return KeyEvent.DOM_VK_CLOSE_BRACKET;
            case 34:
                return KeyEvent.DOM_VK_QUOTE;
            default:
                return key;
        }
    }

    /** Check if the pressed key is a PAD number.
     *   @static
     *   @param {number} key The key ID
     *   @returns {boolean}
     */
    static isKeyNumberPADPressed(key: number): boolean {
        return key >= KeyEvent.DOM_VK_NUMPAD0 && key <= KeyEvent.DOM_VK_NUMPAD9;
    }

    /** Check if the pressed key is a number with shift.
     *   @static
     *   @param {number} key The key ID
     *   @returns {boolean}
     */
    static isKeyNumberTopPressed(key: number): boolean {
        let shift = KeyEvent.keysPressed.indexOf(KeyEvent.DOM_VK_SHIFT) !== -1;
        return shift && key >= KeyEvent.DOM_VK_0 && key <= KeyEvent.DOM_VK_9;
    }

    /** Check if the pressed key is a number.
     *   @static
     *   @param {number} key The key ID
     *   @returns {boolean}
     */
    static isKeyNumberPressed(key: number): boolean {
        return KeyEvent.isKeyNumberPADPressed(key) || KeyEvent
            .isKeyNumberTopPressed(key);
    }

    /** Get the char associated to the key.
     *   @static
     *   @param {number} key The key ID
     *   @returns {string}
     */
    static getKeyChar(key: number): string {
        // Character
        if (key >= KeyEvent.DOM_VK_A && key <= KeyEvent.DOM_VK_Z) {
            return String.fromCharCode(key);
        }

        // Numbers (PADNUM)
        if (KeyEvent.isKeyNumberPADPressed(key)) {
            return "" + (key - KeyEvent.DOM_VK_NUMPAD0);
        }

        // Numbers
        if (KeyEvent.isKeyNumberTopPressed(key)) {
            return String.fromCharCode(key);
        } else {
            return "";
        }
    }

    /** Get the string associated to the key
     *   @static
     *   @param {number} key The key ID
     *   @returns {string}
     */
    static getKeyString(key: number): string {
        let text = KeyEvent.getKeyChar(key);
        if (!text) {
            switch (key) {
                case KeyEvent.DOM_VK_CANCEL:
                    return "CANCEL";
                case KeyEvent.DOM_VK_HELP:
                    return "HELP";
                case KeyEvent.DOM_VK_BACK_SPACE:
                    return "BACKSPACE";
                case KeyEvent.DOM_VK_TAB:
                    return "TAB";
                case KeyEvent.DOM_VK_CLEAR:
                    return "CLEAR";
                case KeyEvent.DOM_VK_RETURN:
                    return "RETURN";
                case KeyEvent.DOM_VK_ENTER:
                    return "ENTER";
                case KeyEvent.DOM_VK_SHIFT:
                    return "SHIFT";
                case KeyEvent.DOM_VK_CONTROL:
                    return "CTRL";
                case KeyEvent.DOM_VK_ALT:
                    return "ALT";
                case KeyEvent.DOM_VK_PAUSE:
                    return "PAUSE";
                case KeyEvent.DOM_VK_CAPS_LOCK:
                    return "CAPSLOCK";
                case KeyEvent.DOM_VK_ESCAPE:
                    return "ESCAPE";
                case KeyEvent.DOM_VK_SPACE:
                    return "SPACE";
                case KeyEvent.DOM_VK_PAGE_UP:
                    return "PAGEUP";
                case KeyEvent.DOM_VK_PAGE_DOWN:
                    return "PAGEDOWN";
                case KeyEvent.DOM_VK_END:
                    return "END";
                case KeyEvent.DOM_VK_HOME:
                    return "HOME";
                case KeyEvent.DOM_VK_LEFT:
                    return "LEFT";
                case KeyEvent.DOM_VK_UP:
                    return "UP";
                case KeyEvent.DOM_VK_RIGHT:
                    return "RIGHT";
                case KeyEvent.DOM_VK_DOWN:
                    return "DOWN";
                case KeyEvent.DOM_VK_PRINTSCREEN:
                    return "PRINTSCREEN";
                case KeyEvent.DOM_VK_INSERT:
                    return "INSERT";
                case KeyEvent.DOM_VK_DELETE:
                    return "DELETE";
                case KeyEvent.DOM_VK_SEMICOLON:
                    return ";";
                case KeyEvent.DOM_VK_EQUALS:
                    return "=";
                case KeyEvent.DOM_VK_MULTIPLY:
                    return "*";
                case KeyEvent.DOM_VK_ADD:
                    return "+";
                case KeyEvent.DOM_VK_SEPARATOR:
                    return "|";
                case KeyEvent.DOM_VK_SUBTRACT:
                    return "-";
                case KeyEvent.DOM_VK_DECIMAL:
                    return ".";
                case KeyEvent.DOM_VK_DIVIDE:
                    return "/";
                case KeyEvent.DOM_VK_F1:
                    return "F1";
                case KeyEvent.DOM_VK_F2:
                    return "F2";
                case KeyEvent.DOM_VK_F3:
                    return "F3";
                case KeyEvent.DOM_VK_F4:
                    return "F4";
                case KeyEvent.DOM_VK_F5:
                    return "F5";
                case KeyEvent.DOM_VK_F6:
                    return "F6";
                case KeyEvent.DOM_VK_F7:
                    return "F7";
                case KeyEvent.DOM_VK_F8:
                    return "F8";
                case KeyEvent.DOM_VK_F9:
                    return "F9";
                case KeyEvent.DOM_VK_F10:
                    return "F10";
                case KeyEvent.DOM_VK_F11:
                    return "F11";
                case KeyEvent.DOM_VK_F12:
                    return "F12";
                case KeyEvent.DOM_VK_F13:
                    return "F13";
                case KeyEvent.DOM_VK_F14:
                    return "F14";
                case KeyEvent.DOM_VK_F15:
                    return "F15";
                case KeyEvent.DOM_VK_F16:
                    return "F16";
                case KeyEvent.DOM_VK_F17:
                    return "F17";
                case KeyEvent.DOM_VK_F18:
                    return "F18";
                case KeyEvent.DOM_VK_F19:
                    return "F19";
                case KeyEvent.DOM_VK_F20:
                    return "F20";
                case KeyEvent.DOM_VK_F21:
                    return "F21";
                case KeyEvent.DOM_VK_F22:
                    return "F22";
                case KeyEvent.DOM_VK_F23:
                    return "F23";
                case KeyEvent.DOM_VK_F24:
                    return "F24";
                case KeyEvent.DOM_VK_NUM_LOCK:
                    return "NUMLOCK";
                case KeyEvent.DOM_VK_SCROLL_LOCK:
                    return "SCROLLLOCK";
                case KeyEvent.DOM_VK_COMMA:
                    return ",";
                case KeyEvent.DOM_VK_PERIOD:
                    return "PERIOD";
                case KeyEvent.DOM_VK_SLASH:
                    return "/";
                case KeyEvent.DOM_VK_BACK_QUOTE:
                    return "`";
                case KeyEvent.DOM_VK_OPEN_BRACKET:
                    return "[";
                case KeyEvent.DOM_VK_BACK_SLASH:
                    return "\\";
                case KeyEvent.DOM_VK_CLOSE_BRACKET:
                    return "]";
                case KeyEvent.DOM_VK_QUOTE:
                    return '"';
                case KeyEvent.DOM_VK_META:
                    return "META";
                case KeyEvent.SQUARE:
                    return "²";
                case KeyEvent.AMPERSAND:
                    return "&";
                case KeyEvent.E_ACCENT_RIGHT:
                    return "É";
                case KeyEvent.TILDE:
                    return "~";
                case KeyEvent.HASH:
                    return "#"
                case KeyEvent.APOSTROPHE:
                    return "'";
                case KeyEvent.LEFT_PARENTHESIS:
                    return "(";
                case KeyEvent.LEFT_BRACES:
                    return "{";
                case KeyEvent.RIGHT_BRACES:
                    return "}";
                case KeyEvent.E_ACCENT_LEFT:
                    return "È";
                case KeyEvent.UNDERSCORE:
                    return "_";
                case KeyEvent.C_UNDER:
                    return "ç";
                case KeyEvent.CARAT:
                    return "^";
                case KeyEvent.A_ACCENT:
                    return "À";
                case KeyEvent.AT:
                    return "@";
                case KeyEvent.RIGHT_PARENTHESIS:
                    return ")";
                case KeyEvent.DEGREE:
                    return "°";
                case KeyEvent.TREMA:
                    return "¨";
                case KeyEvent.CARAT_2:
                    return "^";
                case KeyEvent.POUND:
                    return "£";
                case KeyEvent.DOLLAR:
                    return "$";
                case KeyEvent.YEN:
                    return "¤";
                case KeyEvent.U_GRAVE:
                    return "ù";
                case KeyEvent.PERCENT:
                    return "%";
                case KeyEvent.MU:
                    return "µ";
                case KeyEvent.QUESTION:
                    return "?";
                case KeyEvent.POINT:
                    return ".";
                case KeyEvent.COLON:
                    return ":";
                case KeyEvent.SECTION_SIGN:
                    return "§";
                case KeyEvent.EXCLAMATION:
                    return "!"
                case KeyEvent.ALT_GR:
                    return "ALT GR";
                case KeyEvent.LESS_THAN:
                    return "<";
                case KeyEvent.GREATER_THAN:
                    return ">";
            }
            return "? [ID=" + key + "]";
        }
        return text;
    }
}

export { KeyEvent }