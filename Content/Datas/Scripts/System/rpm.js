/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS RPM
//
// -------------------------------------------------------

/** @class
*   Utility class with a lot of functions.
*/
function RPM(){

}

// -------------------------------------------------------
//  PATHS
// -------------------------------------------------------

RPM.PATH_BR = "";
RPM.PATH_DATAS = $ROOT_DIRECTORY + "Content/Datas/";
RPM.FILE_MAPS = RPM.PATH_DATAS + "Maps/";
RPM.FILE_MAP_INFOS = "/infos.json";
RPM.FILE_MAP_OBJECTS = "/objects.json";
RPM.FILE_PICTURES_DATAS = RPM.PATH_DATAS + "pictures.json";
RPM.FILE_VIDEOS_DATAS = RPM.PATH_DATAS + "videos.json";
RPM.FILE_SONGS_DATAS = RPM.PATH_DATAS + "songs.json";
RPM.FILE_SHAPES_DATAS = RPM.PATH_DATAS + "shapes.json";
RPM.FILE_COMMON_EVENTS = RPM.PATH_DATAS + "commonEvents.json";
RPM.FILE_ITEMS = RPM.PATH_DATAS + "items.json";
RPM.FILE_SKILLS = RPM.PATH_DATAS + "skills.json";
RPM.FILE_WEAPONS = RPM.PATH_DATAS + "weapons.json";
RPM.FILE_ARMORS = RPM.PATH_DATAS + "armors.json";
RPM.FILE_HEROES = RPM.PATH_DATAS + "heroes.json";
RPM.FILE_MONSTERS = RPM.PATH_DATAS + "monsters.json";
RPM.FILE_TROOPS = RPM.PATH_DATAS + "troops.json";
RPM.FILE_BATTLE_SYSTEM = RPM.PATH_DATAS + "battleSystem.json";
RPM.FILE_TITLE_SCREEN_GAME_OVER = RPM.PATH_DATAS + "titlescreenGameover.json";
RPM.FILE_KEYBOARD = RPM.PATH_DATAS + "keyBoard.json";
RPM.FILE_SYSTEM = RPM.PATH_DATAS + "system.json";
RPM.FILE_CLASSES = RPM.PATH_DATAS + "classes.json";
RPM.FILE_TILESETS_DATAS = RPM.PATH_DATAS + "tilesets.json";
RPM.FILE_SPECIAL_ELEMENTS = RPM.PATH_DATAS + "specialElements.json";
RPM.FILE_VARIABLES = RPM.PATH_DATAS + "variables.json";
RPM.FILE_SETTINGS = RPM.PATH_DATAS + "settings.json";
RPM.FILE_SAVE = RPM.PATH_DATAS + "saves.json";
RPM.PATH_PICTURES = "Content/Pictures";
RPM.PATH_VIDEOS = "Content/Videos";
RPM.PATH_HUD = RPM.PATH_PICTURES + "/HUD/";
RPM.PATH_TEXTURES2D = RPM.PATH_PICTURES + "/Textures2D/";
RPM.PATH_BARS = RPM.PATH_HUD + "Bars";
RPM.PATH_FACESETS = RPM.PATH_HUD + "Facesets";
RPM.PATH_ICONS = RPM.PATH_HUD + "Icons";
RPM.PATH_WINDOW_SKINS = RPM.PATH_HUD + "WindowSkins";
RPM.PATH_TITLE_SCREEN = RPM.PATH_HUD + "TitleScreen";
RPM.PATH_AUTOTILES = RPM.PATH_TEXTURES2D + "Autotiles";
RPM.PATH_CHARACTERS = RPM.PATH_TEXTURES2D + "Characters";
RPM.PATH_RELIEFS = RPM.PATH_TEXTURES2D + "Reliefs";
RPM.PATH_TILESETS = RPM.PATH_TEXTURES2D + "Tilesets";
RPM.PATH_WALLS = RPM.PATH_TEXTURES2D + "Walls";
RPM.PATH_BATTLERS = RPM.PATH_TEXTURES2D + "Battlers";
RPM.PATH_OBJECTS_3D = RPM.PATH_TEXTURES2D + "Objects3D";
RPM.PATH_MOUNTAINS = RPM.PATH_TEXTURES2D + "Mountains";
RPM.PATH_SONGS = "Content/Songs/";
RPM.PATH_MUSICS = RPM.PATH_SONGS + "Musics";
RPM.PATH_BACKGROUND_SOUNDS = RPM.PATH_SONGS + "BackgroundSounds";
RPM.PATH_SOUNDS = RPM.PATH_SONGS + "Sounds";
RPM.PATH_MUSIC_EFFECTS = RPM.PATH_SONGS + "MusicEffects";
RPM.PATH_SHAPES = "Content/Shapes/";
RPM.PATH_OBJ = RPM.PATH_SHAPES + "OBJ";
RPM.PATH_MTL = RPM.PATH_SHAPES + "MTL";
RPM.PATH_OBJ_COLLISIONS = RPM.PATH_SHAPES + "Collisions";

// -------------------------------------------------------
//  CONSTANTS
// -------------------------------------------------------

RPM.SMALL_FONT_SIZE = 8;
RPM.MEDIUM_FONT_SIZE = 10;
RPM.BASIC_SQUARE_SIZE = 32;
RPM.BATLLER_STEPS = 9;
RPM.SMALL_SLOT_HEIGHT = 30;
RPM.MEDIUM_SLOT_WIDTH = 200;
RPM.MEDIUM_SLOT_HEIGHT = 40;
RPM.LARGE_SLOT_HEIGHT = 60;
RPM.MEDIUM_SPACE = 5;
RPM.LARGE_SPACE = 10;
RPM.HUGE_SPACE = 20;
RPM.SMALL_PADDING_BOX = [10, 10, 10, 10];
RPM.MEDIUM_PADDING_BOX = [20, 20, 20, 20];
RPM.HUGE_PADDING_BOX = [30, 30, 30, 30];
RPM.DIALOG_PADDING_BOX = [30, 50, 30, 50];
RPM.SMALL_SLOT_PADDING = [10, 5, 10, 5];
RPM.ONE_SECOND_MILLI = 1000;
RPM.STRING_RGBA = "rgba";
RPM.STRING_PARENTHESIS_LEFT = "(";
RPM.STRING_PARENTHESIS_RIGHT = ")";
RPM.STRING_BRACKET_LEFT = "[";
RPM.STRING_BRACKET_RIGHT = "]";
RPM.STRING_COMA = ",";
RPM.STRING_SLASH = "/";
RPM.STRING_NEW_LINE = "\n";
RPM.STRING_EQUAL = "=";
RPM.UNDEFINED = 'undefined';
RPM.TAG_BOLD = "b";
RPM.TAG_ITALIC = "i";
RPM.TAG_LEFT = "l";
RPM.TAG_CENTER = "c";
RPM.TAG_RIGHT = "r";
RPM.TAG_SIZE = "size";
RPM.TAG_FONT = "font";
RPM.TAG_TEXT_COLOR = "textcolor";
RPM.TAG_BACK_COLOR = "backcolor";
RPM.TAG_STROKE_COLOR = "strokecolor";
RPM.TAG_VARIABLE = "var";
RPM.TAG_PARAMETER = "par";
RPM.TAG_PROPERTY = "pro";
RPM.TAG_HERO_NAME = "hname";
RPM.TAG_ICON = "ico";
RPM.DEFAULT_FONT = "sans-serif";

// -------------------------------------------------------
//  COLORS
// -------------------------------------------------------

RPM.COLOR_GREEN = SystemColor.createColor(25, 214, 25);
RPM.COLOR_RED = SystemColor.createColor(216, 33, 17);
RPM.COLOR_WHITE = SystemColor.createColor(255, 255, 255);
RPM.COLOR_BLACK = SystemColor.createColor(0, 0, 0);

// -------------------------------------------------------
//  LOADER
// -------------------------------------------------------

RPM.OBJ_LOADER = new THREE.OBJLoader();

/** Binary operations.
*   @type {function[]} */
var $operators_compare =
[
    function(a, b) { return a === b },
    function(a, b) { return a !== b },
    function(a, b) { return a >= b },
    function(a, b) { return a <= b },
    function(a, b) { return a > b },
    function(a, b) { return a < b }
];

/** Arithmetic operations.
*   @type {function[]} */
var $operators_numbers =
[
    function(a, b) { return b },
    function(a, b) { return a + b },
    function(a, b) { return a - b },
    function(a, b) { return a * b },
    function(a, b) { return a / b },
    function(a, b) { return a % b }
];

// -------------------------------------------------------

/** @class
*   The key events.
*/
var KeyEvent = {
    DOM_VK_CANCEL: $DESKTOP ? 0 : 3,
    DOM_VK_HELP: $DESKTOP ? 0 : 6,
    DOM_VK_BACK_SPACE: $DESKTOP ? 16777219 : 8,
    DOM_VK_TAB: $DESKTOP ? 16777217 : 9,
    DOM_VK_CLEAR: $DESKTOP ? 0 : 12,
    DOM_VK_RETURN: $DESKTOP ? 16777220 : 13,
    DOM_VK_ENTER: $DESKTOP ? 16777221 : 14,
    DOM_VK_SHIFT: $DESKTOP ? 16777248 : 16,
    DOM_VK_CONTROL: $DESKTOP ? 16777249 : 17,
    DOM_VK_ALT: $DESKTOP ? 16777251 : 18,
    DOM_VK_PAUSE: $DESKTOP ? 16777224 : 19,
    DOM_VK_CAPS_LOCK: $DESKTOP ? 16777252 : 20,
    DOM_VK_ESCAPE: $DESKTOP ? 16777216 : 27,
    DOM_VK_SPACE: 32,
    DOM_VK_PAGE_UP: $DESKTOP ? 16777238 : 33,
    DOM_VK_PAGE_DOWN: $DESKTOP ? 16777239 : 34,
    DOM_VK_END: $DESKTOP ? 16777233 : 35,
    DOM_VK_HOME: $DESKTOP ? 16777250 : 36,
    DOM_VK_LEFT: $DESKTOP ? 16777234 : 37,
    DOM_VK_UP: $DESKTOP ? 16777235 : 38,
    DOM_VK_RIGHT: $DESKTOP ? 16777236 : 39,
    DOM_VK_DOWN: $DESKTOP ? 16777237 : 40,
    DOM_VK_PRINTSCREEN: $DESKTOP ? 0 : 44,
    DOM_VK_INSERT: $DESKTOP ? 16777222 : 45,
    DOM_VK_DELETE: $DESKTOP ? 16777223 : 46,
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
    DOM_VK_MULTIPLY: $DESKTOP ? 42 : 106,
    DOM_VK_ADD: $DESKTOP ? 43 : 107,
    DOM_VK_SEPARATOR: $DESKTOP ? 124 : 108,
    DOM_VK_SUBTRACT: $DESKTOP ? 45 : 109,
    DOM_VK_DECIMAL: $DESKTOP ? 16777223 : 110,
    DOM_VK_DIVIDE: $DESKTOP ? 47 : 111,
    DOM_VK_F1: $DESKTOP ? 16777264 : 112,
    DOM_VK_F2: $DESKTOP ? 16777265 : 113,
    DOM_VK_F3: $DESKTOP ? 16777266 : 114,
    DOM_VK_F4: $DESKTOP ? 16777267 : 115,
    DOM_VK_F5: $DESKTOP ? 16777268 : 116,
    DOM_VK_F6: $DESKTOP ? 16777269 : 117,
    DOM_VK_F7: $DESKTOP ? 16777270 : 118,
    DOM_VK_F8: $DESKTOP ? 16777271 : 119,
    DOM_VK_F9: $DESKTOP ? 16777272 : 120,
    DOM_VK_F10: $DESKTOP ? 16777273 : 121,
    DOM_VK_F11: $DESKTOP ? 16777274 : 122,
    DOM_VK_F12: $DESKTOP ? 16777275 : 123,
    DOM_VK_F13: $DESKTOP ? 16777276 : 124,
    DOM_VK_F14: $DESKTOP ? 16777277 : 125,
    DOM_VK_F15: $DESKTOP ? 16777278 : 126,
    DOM_VK_F16: $DESKTOP ? 16777279 : 127,
    DOM_VK_F17: $DESKTOP ? 16777280 : 128,
    DOM_VK_F18: $DESKTOP ? 16777281 : 129,
    DOM_VK_F19: $DESKTOP ? 16777282 : 130,
    DOM_VK_F20: $DESKTOP ? 16777283 : 131,
    DOM_VK_F21: $DESKTOP ? 16777284 : 132,
    DOM_VK_F22: $DESKTOP ? 16777285 : 133,
    DOM_VK_F23: $DESKTOP ? 16777286 : 134,
    DOM_VK_F24: $DESKTOP ? 16777287 : 135,
    DOM_VK_NUM_LOCK: $DESKTOP ? 16777253 : 144,
    DOM_VK_SCROLL_LOCK: $DESKTOP ? 0 : 145,
    DOM_VK_COMMA: $DESKTOP ? 44 : 188,
    DOM_VK_PERIOD: $DESKTOP ? 0 : 190,
    DOM_VK_SLASH: $DESKTOP ? 47 : 191,
    DOM_VK_BACK_QUOTE: $DESKTOP ? 96 : 192,
    DOM_VK_OPEN_BRACKET: $DESKTOP ? 91 : 219,
    DOM_VK_BACK_SLASH: $DESKTOP ? 92 : 220,
    DOM_VK_CLOSE_BRACKET: $DESKTOP ? 93 : 221,
    DOM_VK_QUOTE: $DESKTOP ? 34 : 222,
    DOM_VK_META: $DESKTOP ? 0 : 224,
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
        var shift = $keysPressed.indexOf(KeyEvent.DOM_VK_SHIFT) !== -1;
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

// -------------------------------------------------------
//
//  CLASS Node
//
// -------------------------------------------------------

/** @class
*   Datas structure of tree.
*   @property {Object} data Data of the node.
*   @property {Node} parent Parent of the node.
*   @property {Node} firstChild The first child of the node.
*   @property {Node} lastChild The last child of the node.
*   @property {Node} next The next parent child.
*/
function Node(parent, data){
    this.data = data;
    this.parent = parent;
    this.firstChild = null;
    this.lastChild = null;
    this.next = null;
}

Node.prototype = {

    /** Add a new child.
    *   @param {Object} data Data of the new child.
    *   @returns {Node} The new child.
    */
    add: function(data){
        var node = new Node(this, data);
        if (this.firstChild === null) this.firstChild = node;
        else this.lastChild.next = node;
        this.lastChild = node;

        return node;
    },

    /** Check if this node is the root of the tree.
    *   @returns {boolean}
    */
    isRoot: function(){
        return this.parent === null;
    },

    /** Get the next parent child.
    *   @returns {Node}
    */
    getNext: function(){
        if (this.next === null){
            return (this.parent.isRoot()) ? null : this.parent;
        }
        return this.next;
    }
}

// -------------------------------------------------------
//
//  CLASS Tree
//
// -------------------------------------------------------

/** @class
*   Datas structure of tree.
*   @property {Node} root Node representing the root of the tree.
*/
function Tree(data){
    this.root = new Node(null, data);
}

Tree.prototype = {

    /** Add a new child.
    *   @param {Object} data Data of the new child.
    *   @returns {Node} The new child.
    */
    add: function(data){
        return this.root.add(data);
    }
}

// -------------------------------------------------------
//  FUNCTIONS
// -------------------------------------------------------

/** Read a json file
*   @static
*   @param {Object} base The class calling this function.
*   @param {string} url The path of the file.
*   @param {boolean} loading Indicate if there's a loading screen while loading
*   the file.
*   @param {function} callback A callback function to excecute when the file is
*   loaded.
*/
RPM.openFile = function(base, url, loading, callback){
    if (loading)
        $filesToLoad++;
    var doc = new XMLHttpRequest();
    doc.onreadystatechange = function() {
        if (doc.readyState === XMLHttpRequest.DONE) {
            try{
                callback.call(base, doc.responseText);
            }
            catch (e){
                RPM.showError(e);
            }

            if (loading)
                $loadedFiles++;
        }
    }
    doc.open("GET", url, true);
    doc.send();
}

// -------------------------------------------------------

/** Write a json file
*   @static
*   @param {string} url The path of the file.
*   @param {Object} obj An object that can be stringified by JSON.
*/
RPM.saveFile = function(url, obj){
    var doc = new XMLHttpRequest();
    doc.open("PUT", url, false);
    doc.send(JSON.stringify(obj));
}

// -------------------------------------------------------

/** Check if all the files are loaded.
*   @static
*   @returns {boolean}
*/
RPM.isLoading = function(){
    if ($filesToLoad === $loadedFiles) {
        $filesToLoad = 0;
        $loadedFiles = 0;
        return false;
    }

    return true;
}

// -------------------------------------------------------

/** Link the fontSize and the fontName to a string that can be used by the
*   canvasHUD.
*   @static
*   @param {number} fontSize The fontSize.
*   @param {string} fontName The fontName.
*   @returns {string}
*/
RPM.createFont = function(fontSize, fontName, bold, italic) {
    return (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize + "px "
        + fontName;
}

// -------------------------------------------------------

/** If a current game exists, add one second to the timer.
*   @static
*/
RPM.updateTimer = function(){
    if ($game !== null){
        $game.playTime++;
    }
}

// -------------------------------------------------------

/** Describe a javascript object.
*   @static
*   @param {Object} obj The javascript object.
*   @returns {string}
*/
RPM.describe = function(obj){
    var res = "";
    for (var p in obj)
        res += console.log(p + ": " + obj[p]);

    return res;
}

// -------------------------------------------------------

/** Show alert dialog box.
*   @static
*   @param {string} text text to display.
*/
RPM.show = function(text){
    alert(text)
}

// -------------------------------------------------------

/** Return a string of the date by passing all the seconds.
*   @static
*   @param {number} total Total number of seconds.
*   @returns {string}
*/
RPM.getStringDate = function(total){
    var hours = RPM.formatNumber(Math.floor(total / 3600),4);
    var minutes = RPM.formatNumber(Math.floor((total % 3600) / 60),2);
    var seconds = RPM.formatNumber(Math.floor(total % 60),2);

    return (hours + ":" + minutes + ":" + seconds);
}

// -------------------------------------------------------

/** Return the string of a number and parse with 0 according to a given size.
*   @static
*   @param {number} num Number.
*   @param {number} size Max number to display.
*   @returns {string}
*/
RPM.formatNumber = function(num, size){
    return ('000000000' + num).substr(-size);
}

// -------------------------------------------------------

/** Generate the map name according to the ID.
*   @static
*   @param {number} id ID of the map.
*   @returns {string}
*/
RPM.generateMapName = function(id){
    return "MAP" + RPM.formatNumber(id, 4);
}

// -------------------------------------------------------

/** Transform a json position to index position on X/Z axis.
*   @static
*   @param {number[]} position The json position.
*   @returns {number}
*/
RPM.positionJSONToIndex = function(position){
    return (position[0] % $PORTION_SIZE) + (RPM.mod(position[1], $PORTION_SIZE) *
        $PORTION_SIZE) + ((position[3] % $PORTION_SIZE) * $PORTION_SIZE *
        $PORTION_SIZE);
}

// -------------------------------------------------------

/** Transform a quare position to index position on X/Z axis.
*   @static
*   @param {number[]} position The json position.
*   @returns {number}
*/
RPM.positionToIndex = function(position) {
    return (position[0] % $PORTION_SIZE) + (RPM.mod(position[1], $PORTION_SIZE) *
        $PORTION_SIZE) + ((position[2] % $PORTION_SIZE) * $PORTION_SIZE *
        $PORTION_SIZE);
}

// -------------------------------------------------------

/** Transform a json position to a THREE.Vector3.
*   @static
*   @param {number[]} position The json position.
*   @returns {THREE.Vector3}
*/
RPM.positionToVector3 = function(position){
    var pos = RPM.positionToBorderVector3(position);
    pos.setX(pos.x + (RPM.positionCenterX(position) / 100 * $SQUARE_SIZE));
    pos.setZ(pos.z + (RPM.positionCenterZ(position) / 100 * $SQUARE_SIZE));

    return pos;
}

// -------------------------------------------------------

/** Transform a json position to a THREE.Vector3.
*   @static
*   @param {number[]} position The json position.
*   @returns {THREE.Vector3}
*/
RPM.positionToBorderVector3 = function(position){
    return new THREE.Vector3(
                position[0] * $SQUARE_SIZE,
                (position[1] * $SQUARE_SIZE) +
                (position[2] * $SQUARE_SIZE / 100),
                position[3] * $SQUARE_SIZE);
}

// -------------------------------------------------------

/** Get the complete number of Y of a position.
*   @static
*   @param {number[]} position The json position.
*   @returns {number}
*/
RPM.positionTotalY = function(position){
    return (position[1] * $SQUARE_SIZE) + (position[2] * $SQUARE_SIZE / 100);
}

// -------------------------------------------------------

/** Extract the layer from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionLayer = function(position) {
    return position[4];
}

// -------------------------------------------------------

/** Extract the x center from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionCenterX = function(position) {
    var x = position[5];
    if (typeof x === 'undefined')
        x = 50;

    return x;
}

// -------------------------------------------------------

/** Extract the z center from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionCenterZ = function(position) {
    var z = position[6];
    if (typeof z === 'undefined')
        z = 50;

    return z;
}

// -------------------------------------------------------

/** Extract the angle from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionAngleY = function(position) {
    var a = position[7];
    if (typeof a == 'undefined')
        a = 0;

    return a;
}

// -------------------------------------------------------

/** Extract the angle from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionAngleX = function(position) {
    var a = position[8];
    if (typeof a == 'undefined')
        a = 0;

    return a;
}

// -------------------------------------------------------

/** Extract the angle from position.
*   @static
*   @param {number[]} position The json position.
*   @returns number
*/
RPM.positionAngleZ = function(position) {
    var a = position[9];
    if (typeof a == 'undefined')
        a = 0;

    return a;
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} x The position on screen.
*   @returns {number}
*/
RPM.getScreenX = function(x) {
    return Math.ceil(RPM.getDoubleScreenX(x));
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} y The position on screen.
*   @returns {number}
*/
RPM.getScreenY = function(y) {
    return Math.ceil(RPM.getDoubleScreenY(y));
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size.
*   @static
*   @param {number} xy The position on screen.
*   @returns {number}
*/

RPM.getScreenXY = function(xy) {
    return Math.ceil(($windowX + $windowY) / 2 * xy);
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size, but without
*   rounding it.
*   @static
*   @param {number} x The position on screen.
*   @returns {number}
*/
RPM.getDoubleScreenX = function(x) {
    return $windowX * x;
}

// -------------------------------------------------------

/** Get the pixel position transformation according to screen size, but without
*   rounding it.
*   @static
*   @param {number} y The position on screen.
*   @returns {number}
*/
RPM.getDoubleScreenY = function(y) {
    return $windowY * y;
}

// -------------------------------------------------------

/** Get the position according to the square size.
*   @static
*   @param {number} x The position.
*   @returns {number}
*/
RPM.getSquare = function(x) {
    return Math.floor(x / $SQUARE_SIZE);
};

// -------------------------------------------------------

/** Get the numberof fields of an object.
*   @static
*   @returns {number}
*/
RPM.countFields = function (obj) {
    if (obj.__count__ !== undefined) { // Old FF
        return obj.__count__;
    }

    if (Object.keys) { // ES5
        return Object.keys(obj).length;
    }

    // Everything else:

    var c = 0, p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            c += 1;
        }
    }

    return c;
};

// -------------------------------------------------------

/** Check if the array is empty.
*   @static
*   @returns {boolean}
*/
RPM.isEmpty = function(array) {
    return array[0] == null;
};

// -------------------------------------------------------

RPM.cos = function(w){
    return parseFloat(Math.cos(w).toFixed(10));
};

// -------------------------------------------------------

RPM.sin = function(w){
    return parseFloat(Math.sin(w).toFixed(10));
};

// -------------------------------------------------------

RPM.getPortion = function(position){
    var p = RPM.getPosition(position);
    return [
        Math.floor(p[0] / $PORTION_SIZE),
        Math.floor(p[1] / $PORTION_SIZE),
        Math.floor(p[2] / $PORTION_SIZE)
    ]
}

// -------------------------------------------------------

RPM.getPosition = function(position){
    return [
        Math.floor(position.x / $SQUARE_SIZE),
        Math.floor(position.y / $SQUARE_SIZE),
        Math.floor(position.z / $SQUARE_SIZE)
    ];
}

// -------------------------------------------------------

RPM.arePortionEquals= function(portion1, portion2) {
    return (portion1[0] === portion2[0] && portion1[1] === portion2[1] &&
            portion1[2] === portion2[2]);
}

// -------------------------------------------------------

/** Show an error.
*   @static
*   @param {Error} error The error message.
*/
RPM.showError = function(e){
    var txt;

    txt = e.fileName + " - line: " + e.lineNumber + " -> " + e.message + "\n" +
        e.stack;
    RPM.showErrorMessage(txt);
}

// -------------------------------------------------------

/** Show an error message.
*   @static
*   @param {string} error The error message.
*/
RPM.showErrorMessage = function(error){
    if ($DIALOG_ERROR !== null) {
        if (!$DIALOG_ERROR.text) {
            $DIALOG_ERROR.text = error;
            $DIALOG_ERROR.open();
        }
    } else {
        console.log(error);
    }
}

// -------------------------------------------------------

/** Give a modulo without negative value.
*   @static
*   @param {number} x
*   @param {number} m
*/
RPM.mod = function(x, m) {
    var r = x % m;

    return r < 0 ? r + m : r;
}

// -------------------------------------------------------

/** Get the list max ID.
*   @static
*   @param {number[]} list A list containing only IDs.
*/
RPM.getMaxID = function(list) {
    var max = 0;

    for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] > max)
            max = list[i];
    }

    return max;
}

// -------------------------------------------------------

/** Create a new array list initialed with null everywhere.
*   @static
*   @param {number} size The list size.
*/
RPM.fillNullList = function(size) {
    var list = new Array(size);

    for (var i = 0; i < size; i++) {
        list[i] = null;
    }

    return list;
}

// -------------------------------------------------------

/** Create a random number between min and max.
*   @static
*   @param {number} min
*   @param {number} max
*/

RPM.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -------------------------------------------------------

/** Load a texture.
*   @param {string} path The path of the texture.
*   @retuns {THREE.MeshBasicMaterial}
*/
RPM.loadTexture = function(paths, picture, callback) {
    $filesToLoad++;
    var path = paths[0];
    var pathLocal = paths[1];
    var texture;

    if (callback) {
        texture = callback.call(this, pathLocal, picture);
    } else {
        texture = $textureLoader.load(path,
            function(t){
                $loadedFiles++;
            },
            function (t) {},
            function (t) {
                RPM.showErrorMessage("Could not load " + path);
            }
        );
    }

    return RPM.createMaterial(texture);
};

// -------------------------------------------------------

/** Load a texture empty.
*   @retuns {THREE.MeshBasicMaterial}
*/
RPM.loadTextureEmpty = function(){
    return new THREE.MeshBasicMaterial(
    {
        transparent: true,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        alphaTest: 0.5,
        overdraw: 0.5
    });
};

// -------------------------------------------------------

/** Create a material from texture.
*   @retuns {THREE.MeshBasicMaterial}
*/
RPM.createMaterial = function(texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.flipY = false;

    return new THREE.MeshBasicMaterial(
    {
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        alphaTest: 0.5,
        overdraw: 0.5
    });
};

// -------------------------------------------------------

RPM.updateBackgroundColor = function(color) {
    $renderer.setClearColor(color.getHex(), color.alpha);
}

// -------------------------------------------------------

RPM.toScreenPosition = function(vector, camera) {
    var widthHalf = $canvasWidth / 2;
    var heightHalf = $canvasHeight / 2;
    var position = vector.clone();
    camera.updateMatrixWorld(true);
    position.project(camera);

    return {
        x: (position.x * widthHalf) + widthHalf,
        y: - (position.y * heightHalf) + heightHalf
    };
};

// -------------------------------------------------------

RPM.variance = function(value, variance) {
    var v = Math.round(value * variance / 100);

    return RPM.random(value - v, value + v);
};

// -------------------------------------------------------

RPM.evaluateFormula = function(formula, user, target, damage) {
    return new Function("u", "t", "damage", "return " + formula)(user, target,
        damage);
};

// -------------------------------------------------------

RPM.evaluateScript = function(script) {
    new Function("$that", script)($that);
};

// -------------------------------------------------------

RPM.formulaContainsUser = function(formula) {
    return formula.contains("u");
};

// -------------------------------------------------------

RPM.formulaContainsTarget = function(formula) {
    return formula.contains("t");
};

// -------------------------------------------------------

RPM.jsonDefault = function(json, defaultValue) {
    return typeof json === RPM.UNDEFINED ? defaultValue : json;
};

// -------------------------------------------------------

RPM.defaultValue = function(value, defaultValue) {
    return typeof value === RPM.UNDEFINED ? defaultValue : value;
};
