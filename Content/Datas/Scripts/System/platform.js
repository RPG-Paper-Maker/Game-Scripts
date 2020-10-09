/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const electron = require('electron')
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const console = remote.getGlobal('console');
const Screen = remote.screen;
const app = remote.app;

class Platform
{
    static ROOT_DIRECTORY = app.getAppPath();
    static error = false;
    static screen = Screen.getPrimaryDisplay();
    static screenWidth = Platform.screen.bounds.width;
    static screenHeight = Platform.screen.bounds.height;
    static canvas3D = document.getElementById('three-d');
    static canvasHUD = document.getElementById('hud');
    static canvasVideos = document.getElementById('video-container');
    static canvasRendering = document.getElementById('rendering');
    static ctx = Platform.canvasHUD.getContext('2d');
    static ctxr = Platform.canvasRendering.getContext("2d");
    static DESKTOP = true;

    constructor()
    {
        throw new Error("This class is static.")
    }

    static setWindowTitle = function(title)
    {
        ipc.send('change-window-title', title);
    }

    static setWindowSize = function(w, h, f)
    {
        ipc.send('change-window-size', w, h, f);
    }

    static quit = function()
    {
        window.close();
    }
}

$that = this;

window.onerror = function (msg, url, line, column, err)
{
    let str = url ? url + ": " + line + "\n" : "";
    if (err.stack != null) 
    {
        str += err.stack;
    } else if (err.message != null) 
    {
        str += err.message;
    }
    const fs = require('fs');
    fs.writeFile("log.txt", "ERROR LOG:\n\n" + str, (e) => {
        if (e)
        {
            RPM.showError(e);
        }
    });

    // Send it to main process to open a dialog box
    ipc.send('window-error', str);
}

// -------------------------------------------------------
/** @class
*   The key events
*/
let KeyEvent = {
    DOM_VK_CANCEL: 3,
    DOM_VK_HELP: 6,
    DOM_VK_BACK_SPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_CLEAR: 12,
    DOM_VK_RETURN: 13,
    DOM_VK_ENTER: 14,
    DOM_VK_SHIFT: 16,
    DOM_VK_CONTROL: 17,
    DOM_VK_ALT: 18,
    DOM_VK_PAUSE: 19,
    DOM_VK_CAPS_LOCK: 20,
    DOM_VK_ESCAPE: 27,
    DOM_VK_SPACE: 32,
    DOM_VK_PAGE_UP: 33,
    DOM_VK_PAGE_DOWN: 34,
    DOM_VK_END: 35,
    DOM_VK_HOME: 36,
    DOM_VK_LEFT: 37,
    DOM_VK_UP: 38,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_PRINTSCREEN: 44,
    DOM_VK_INSERT: 45,
    DOM_VK_DELETE: 46,
    DOM_VK_0: 48,
    DOM_VK_1: 49,
    DOM_VK_2: 50,
    DOM_VK_3: 51,
    DOM_VK_4: 52,
    DOM_VK_5: 53,
    DOM_VK_6: 54,
    DOM_VK_7: 55,
    DOM_VK_8: 56,
    DOM_VK_9: 57,
    DOM_VK_SEMICOLON: 59,
    DOM_VK_EQUALS: 61,
    DOM_VK_A: 65,
    DOM_VK_B: 66,
    DOM_VK_C: 67,
    DOM_VK_D: 68,
    DOM_VK_E: 69,
    DOM_VK_F: 70,
    DOM_VK_G: 71,
    DOM_VK_H: 72,
    DOM_VK_I: 73,
    DOM_VK_J: 74,
    DOM_VK_K: 75,
    DOM_VK_L: 76,
    DOM_VK_M: 77,
    DOM_VK_N: 78,
    DOM_VK_O: 79,
    DOM_VK_P: 80,
    DOM_VK_Q: 81,
    DOM_VK_R: 82,
    DOM_VK_S: 83,
    DOM_VK_T: 84,
    DOM_VK_U: 85,
    DOM_VK_V: 86,
    DOM_VK_W: 87,
    DOM_VK_X: 88,
    DOM_VK_Y: 89,
    DOM_VK_Z: 90,
    DOM_VK_NUMPAD0: 96,
    DOM_VK_NUMPAD1: 97,
    DOM_VK_NUMPAD2: 98,
    DOM_VK_NUMPAD3: 99,
    DOM_VK_NUMPAD4: 100,
    DOM_VK_NUMPAD5: 101,
    DOM_VK_NUMPAD6: 102,
    DOM_VK_NUMPAD7: 103,
    DOM_VK_NUMPAD8: 104,
    DOM_VK_NUMPAD9: 105,
    DOM_VK_MULTIPLY: 106,
    DOM_VK_ADD: 107,
    DOM_VK_SEPARATOR: 108,
    DOM_VK_SUBTRACT: 109,
    DOM_VK_DECIMAL: 110,
    DOM_VK_DIVIDE: 111,
    DOM_VK_F1: 112,
    DOM_VK_F2: 113,
    DOM_VK_F3: 114,
    DOM_VK_F4: 115,
    DOM_VK_F5: 116,
    DOM_VK_F6: 117,
    DOM_VK_F7: 118,
    DOM_VK_F8: 119,
    DOM_VK_F9: 120,
    DOM_VK_F10: 121,
    DOM_VK_F11: 122,
    DOM_VK_F12: 123,
    DOM_VK_F13: 124,
    DOM_VK_F14: 125,
    DOM_VK_F15: 126,
    DOM_VK_F16: 127,
    DOM_VK_F17: 128,
    DOM_VK_F18: 129,
    DOM_VK_F19: 130,
    DOM_VK_F20: 131,
    DOM_VK_F21: 132,
    DOM_VK_F22: 133,
    DOM_VK_F23: 134,
    DOM_VK_F24: 135,
    DOM_VK_NUM_LOCK: 144,
    DOM_VK_SCROLL_LOCK: 145,
    DOM_VK_COMMA: 188,
    DOM_VK_PERIOD: 190,
    DOM_VK_SLASH: 191,
    DOM_VK_BACK_QUOTE: 192,
    DOM_VK_OPEN_BRACKET: 219,
    DOM_VK_BACK_SLASH: 220,
    DOM_VK_CLOSE_BRACKET: 221,
    DOM_VK_QUOTE: 222,
    DOM_VK_META: 224,
    SQUARE: 178,
    AMPERSAND: 38,
    E_ACCENT_RIGHT: 201,
    TILDE: 126,
    HASH: 35,
    APOSTROPHE: 39,
    LEFT_PARENTHESIS: 40,
    LEFT_BRACES: 123,
    RIGHT_BRACES: 126,
    E_ACCENT_LEFT: 200,
    UNDERSCORE: 95,
    C_UNDER: 199,
    CARAT: 94,
    A_ACCENT: 192,
    AT: 64,
    RIGHT_PARENTHESIS: 41,
    DEGREE: 176,
    TREMA: 16781911,
    CARAT_2: 16781906,
    POUND: 163,
    DOLLAR: 36,
    YEN: 164,
    U_GRAVE: 217,
    PERCENT: 37,
    MU: 924,
    QUESTION: 63,
    POINT: 46,
    COLON: 58,
    SECTION_SIGN: 167,
    EXCLAMATION: 33,
    ALT_GR: 16781571,
    LESS_THAN: 60,
    GREATER_THAN: 62,

    qtToDOM: function(key)
    {
        switch (key) 
        {
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
    },

    /** Check if the pressed key is a PAD number.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberPADPressed: function(key){
        return key >= KeyEvent.DOM_VK_NUMPAD0 && key <= KeyEvent.DOM_VK_NUMPAD9;
    },

    /** Check if the pressed key is a number with shift.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberTopPressed: function(key){
        var shift = RPM.keysPressed.indexOf(KeyEvent.DOM_VK_SHIFT) !== -1;
        return shift && key >= KeyEvent.DOM_VK_0 && key <= KeyEvent.DOM_VK_9;
    },

    /** Check if the pressed key is a number.
    *   @param {number} key The key ID.
    *   @returns {boolean}
    */
    isKeyNumberPressed: function(key){
        return KeyEvent.isKeyNumberPADPressed(key) ||
                KeyEvent.isKeyNumberTopPressed(key);
    },

    /** Get the char associated to the key.
    *   @param {number} key The key ID.
    *   @returns {string}
    */
    getKeyChar: function(key){
        // Character
        if (key >= KeyEvent.DOM_VK_A && key <= KeyEvent.DOM_VK_Z){
            return String.fromCharCode(key);
        }

        // Numbers (PADNUM)
        if (KeyEvent.isKeyNumberPADPressed(key)){
            return "" + (key - KeyEvent.DOM_VK_NUMPAD0);
        }

        // Numbers
        if (KeyEvent.isKeyNumberTopPressed(key)){
            return String.fromCharCode(key);
        }
        else {
            return "";
        }
    },

    getKeyString: function(key) {
        var text;

        text = KeyEvent.getKeyChar(key);
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
            case KeyEvent.DOM_VK_CONTEXT_MENU:
                return "CONTEXTMENU";
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
};