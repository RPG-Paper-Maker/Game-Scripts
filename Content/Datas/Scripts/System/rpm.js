/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   Utility class with a lot of functions.
*/
class RPM
{
    // -------------------------------------------------------
    //  PATHS
    // -------------------------------------------------------
    static PATH_BR = "";
    static ROOT_DIRECTORY_LOCAL = "."
    static PATH_FILES = "file:///";
    static PATH_DATAS = Platform.ROOT_DIRECTORY + "/Content/Datas/";
    static EXTENSION_JSON = ".json";
    static FILE_MAPS = RPM.PATH_DATAS + "Maps/";
    static FILE_MAP_INFOS = "/infos" + RPM.EXTENSION_JSON;
    static FILE_MAP_OBJECTS = "/objects" + RPM.EXTENSION_JSON;
    static FILE_PICTURES_DATAS = RPM.PATH_DATAS + "pictures" + RPM
        .EXTENSION_JSON;
    static FILE_VIDEOS_DATAS = RPM.PATH_DATAS + "videos" + RPM.EXTENSION_JSON;
    static FILE_SONGS_DATAS = RPM.PATH_DATAS + "songs" + RPM.EXTENSION_JSON;
    static FILE_SHAPES_DATAS = RPM.PATH_DATAS + "shapes" + RPM.EXTENSION_JSON;
    static FILE_COMMON_EVENTS = RPM.PATH_DATAS + "commonEvents" + RPM
        .EXTENSION_JSON;
    static FILE_ITEMS = RPM.PATH_DATAS + "items" + RPM.EXTENSION_JSON;
    static FILE_SKILLS = RPM.PATH_DATAS + "skills" + RPM.EXTENSION_JSON;
    static FILE_WEAPONS = RPM.PATH_DATAS + "weapons" + RPM.EXTENSION_JSON;
    static FILE_ARMORS = RPM.PATH_DATAS + "armors" + RPM.EXTENSION_JSON;
    static FILE_HEROES = RPM.PATH_DATAS + "heroes" + RPM.EXTENSION_JSON;
    static FILE_MONSTERS = RPM.PATH_DATAS + "monsters" + RPM.EXTENSION_JSON;
    static FILE_TROOPS = RPM.PATH_DATAS + "troops" + RPM.EXTENSION_JSON;
    static FILE_BATTLE_SYSTEM = RPM.PATH_DATAS + "battleSystem" + RPM
        .EXTENSION_JSON;
    static FILE_TITLE_SCREEN_GAME_OVER = RPM.PATH_DATAS + "titlescreenGameover"
        + RPM.EXTENSION_JSON;
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
    static PATH_PICTURES = "/Content/Images";
    static PATH_VIDEOS = "/Content/Videos";
    static PATH_HUD = RPM.PATH_PICTURES + "/HUD/";
    static PATH_TEXTURES2D = RPM.PATH_PICTURES + "/Textures2D/";
    static PATH_BARS = RPM.PATH_HUD + "Bars";
    static PATH_FACESETS = RPM.PATH_HUD + "Facesets";
    static PATH_ICONS = RPM.PATH_HUD + "Icons";
    static PATH_WINDOW_SKINS = RPM.PATH_HUD + "WindowSkins";
    static PATH_TITLE_SCREEN = RPM.PATH_HUD + "TitleScreen";
    static PATH_HUD_PICTURES = RPM.PATH_HUD + "Pictures";
    static PATH_ANIMATIONS = RPM.PATH_HUD + "Animations";
    static PATH_AUTOTILES = RPM.PATH_TEXTURES2D + "Autotiles";
    static PATH_CHARACTERS = RPM.PATH_TEXTURES2D + "Characters";
    static PATH_TILESETS = RPM.PATH_TEXTURES2D + "Tilesets";
    static PATH_WALLS = RPM.PATH_TEXTURES2D + "Walls";
    static PATH_BATTLERS = RPM.PATH_TEXTURES2D + "Battlers";
    static PATH_OBJECTS_3D = RPM.PATH_TEXTURES2D + "Objects3D";
    static PATH_MOUNTAINS = RPM.PATH_TEXTURES2D + "Mountains";
    static PATH_SKYBOXES = RPM.PATH_TEXTURES2D + "SkyBoxes";
    static PATH_SONGS = "/Content/Songs/";
    static PATH_MUSICS = RPM.PATH_SONGS + "Musics";
    static PATH_BACKGROUND_SOUNDS = RPM.PATH_SONGS + "BackgroundSounds";
    static PATH_SOUNDS = RPM.PATH_SONGS + "Sounds";
    static PATH_MUSIC_EFFECTS = RPM.PATH_SONGS + "MusicEffects";
    static PATH_SHAPES = "/Content/Shapes/";
    static PATH_OBJ = RPM.PATH_SHAPES + "OBJ";
    static PATH_MTL = RPM.PATH_SHAPES + "MTL";
    static PATH_OBJ_COLLISIONS = RPM.PATH_SHAPES + "Collisions";
    static PATH_SHADERS = RPM.PATH_DATAS + "Scripts/System/shaders/";
    static PATH_SAVES = RPM.PATH_DATAS + "Saves";
    // -------------------------------------------------------
    //  CONSTANTS
    // -------------------------------------------------------
    static SMALL_FONT_SIZE = 8;
    static MEDIUM_FONT_SIZE = 10;
    static BASIC_SQUARE_SIZE = 32;
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
    // -------------------------------------------------------
    //  COLORS
    // -------------------------------------------------------
    static COLOR_GREEN = SystemColor.createColor(25, 214, 25);
    static COLOR_RED = SystemColor.createColor(216, 33, 17);
    static COLOR_WHITE = SystemColor.createColor(255, 255, 255);
    static COLOR_BLACK = SystemColor.createColor(0, 0, 0);
    // -------------------------------------------------------
    //  OTHERS
    // -------------------------------------------------------
    static elapsedTime = 0;
    static averageElapsedTime = 0;
    static lastUpdateTime = new Date().getTime();
    static keysPressed = new Array;
    static picturesLoading = new Array;
    static picturesLoaded = new Array;
    static fontSize = 13;
    static fontName = "sans-serif";
    static escaped = false;
    static blockingHero = false;
    static game = null;
    static DIALOG_ERROR = null;
    static textureLoader = new THREE.TextureLoader();
    static requestPaintHUD = true;
    static currentObject = null;
    static currentParameters = null;
    static currentMap = null;
    static currentReaction = null;
    static displayedPictures = [];
    static screenTone = new THREE.Vector4(0, 0, 0, 1);
    static allowSaves = true;
    static allowMainMenu = true;
    static isInMainMenu = false;
    static BB_BOX = MapPortion.createBox();
    static BB_BOX_DETECTION = MapPortion.createBox();
    static BB_BOX_DEFAULT_DETECTION = MapPortion.createBox();
    static BB_ORIENTED_BOX = MapPortion.createOrientedBox();
    static OBJ_LOADER = new THREE.OBJLoader();
    static CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
    static operators_compare =
    [
        function(a, b) { return a === b },
        function(a, b) { return a !== b },
        function(a, b) { return a >= b },
        function(a, b) { return a <= b },
        function(a, b) { return a > b },
        function(a, b) { return a < b }
    ];
    static operators_numbers =
    [
        function(a, b) { return b },
        function(a, b) { return a + b },
        function(a, b) { return a - b },
        function(a, b) { return a * b },
        function(a, b) { return a / b },
        function(a, b) { return a % b }
    ];

    constructor()
    {
        throw new Error("This class is static.")
    }

    // -------------------------------------------------------
    //  FUNCTIONS
    // -------------------------------------------------------

    static fileExists = function(url)
    {
        const fs = require('fs');
        return (fs.existsSync(url));
    }

    /** Read a json file
    *   @static
    *   @param {Object} base The class calling this function.
    *   @param {string} url The path of the file.
    */
    static openFile = async function(url)
    {
        const fs = require('fs').promises;
        return (await fs.readFile(url, (e, data) => {
            if (e) 
            {
                return null;
            } else
            {
                return data;
            }
        })).toString();
    }

    static parseFileJSON = async function(url)
    {
        return JSON.parse(await RPM.openFile(url));
    }

    // -------------------------------------------------------
    /** Write a json file
    *   @static
    *   @param {string} url The path of the file.
    *   @param {Object} obj An object that can be stringified by JSON.
    */
    static saveFile = async function(url, obj)
    {
        const fs = require('fs').promises;
        return await fs.writeFile(url, JSON.stringify(obj), (e) => {
            if (e)
            {
                RPM.showError(e);
            }
        });
    }

    // -------------------------------------------------------
    /** Link the fontSize and the fontName to a string that can be used by the
    *   canvasHUD.
    *   @static
    *   @param {number} fontSize The fontSize.
    *   @param {string} fontName The fontName.
    *   @returns {string}
    */
    static createFont = function(fontSize, fontName, bold, italic) {
        return (bold ? "bold " : "") + (italic ? "italic " : "") + fontSize + 
            "px " + fontName;
    }

    // -------------------------------------------------------
    /** Describe a javascript object.
    *   @static
    *   @param {Object} obj The javascript object.
    *   @returns {string}
    */
    static describe(obj)
    {
        var res = RPM.STRING_EMPTY;
        for (var p in obj)
        {
            res += console.log(p + RPM.STRING_COLON + RPM.STRING_SPACE + obj[p]);
        }
        return res;
    }

    // -------------------------------------------------------
    /** Show alert dialog box.
    *   @static
    *   @param {string} text text to display.
    */
    static show(text)
    {
        dia.showMessageBoxSync({ title: 'Error', type: 'error', message: text });
    }

    // -------------------------------------------------------
    /** Return a string of the date by passing all the seconds.
    *   @static
    *   @param {number} total Total number of seconds.
    *   @returns {string}
    */
    static getStringDate(total)
    {
        return (RPM.formatNumber(Math.floor(total / 3600), 4) + RPM.STRING_COLON
            + RPM.formatNumber(Math.floor((total % 3600) / 60), 2) + RPM
            .STRING_COLON + RPM.formatNumber(Math.floor(total % 60), 2));
    }

    // -------------------------------------------------------
    /** Return the string of a number and parse with 0 according to a given size.
    *   @static
    *   @param {number} num Number.
    *   @param {number} size Max number to display.
    *   @returns {string}
    */
    static formatNumber(num, size)
    {
        return ('000000000' + num).substr(-size);
    }

    // -------------------------------------------------------
    /** Generate the map name according to the ID.
    *   @static
    *   @param {number} id ID of the map.
    *   @returns {string}
    */
    static generateMapName(id)
    {
        return "MAP" + RPM.formatNumber(id, 4);
    }

    // -------------------------------------------------------
    /** Transform a json position to index position on X/Z axis.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns {number}
    */
    static positionJSONToIndex(position)
    {
        return (position[0] % RPM.PORTION_SIZE) + (RPM.mod(position[1], RPM
            .PORTION_SIZE) * RPM.PORTION_SIZE) + ((position[3] % RPM
            .PORTION_SIZE) * RPM.PORTION_SIZE * RPM.PORTION_SIZE);
    }

    // -------------------------------------------------------
    /** Transform a quare position to index position on X/Z axis.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns {number}
    */
    static positionToIndex(position)
    {
        return (position[0] % RPM.PORTION_SIZE) + (RPM.mod(position[1], RPM
            .PORTION_SIZE) * RPM.PORTION_SIZE) + ((position[2] % RPM
            .PORTION_SIZE) * RPM.PORTION_SIZE * RPM.PORTION_SIZE);
    }

    // -------------------------------------------------------
    /** Transform a json position to a THREE.Vector3.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns {THREE.Vector3}
    */
    static positionToVector3(position)
    {
        let pos = RPM.positionToBorderVector3(position);
        pos.setX(pos.x + (RPM.positionCenterX(position) / 100 * RPM.SQUARE_SIZE));
        pos.setZ(pos.z + (RPM.positionCenterZ(position) / 100 * RPM.SQUARE_SIZE));
        return pos;
    }

    // -------------------------------------------------------
    /** Transform a json position to a THREE.Vector3.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns {THREE.Vector3}
    */
    static positionToBorderVector3(position)
    {
        return new THREE.Vector3(position[0] * RPM.SQUARE_SIZE, (position[1] * 
            RPM.SQUARE_SIZE) + (position[2] * RPM.SQUARE_SIZE / 100), position
            [3] * RPM.SQUARE_SIZE);
    }

    // -------------------------------------------------------
    /** Get the complete number of Y of a position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns {number}
    */
    static positionTotalY(position)
    {
        return (position[1] * RPM.SQUARE_SIZE) + (position[2] * RPM.SQUARE_SIZE 
            / 100);
    }

    // -------------------------------------------------------
    /** Extract the layer from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionLayer(position)
    {
        return position[4];
    }

    // -------------------------------------------------------
    /** Extract the x center from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionCenterX(position)
    {
        return RPM.defaultValue(position[5], 50);
    }

    // -------------------------------------------------------
    /** Extract the z center from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionCenterZ = function(position)
    {
        return RPM.defaultValue(position[6], 50);
    }

    // -------------------------------------------------------
    /** Extract the angle from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionAngleY(position)
    {
        return RPM.defaultValue(position[7], 0);
    }

    // -------------------------------------------------------
    /** Extract the angle from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionAngleX(position)
    {
        return RPM.defaultValue(position[8], 0);
    }

    // -------------------------------------------------------
    /** Extract the angle from position.
    *   @static
    *   @param {number[]} position The json position.
    *   @returns number
    */
    static positionAngleZ(position)
    {
        return RPM.defaultValue(position[9], 0);
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size.
    *   @static
    *   @param {number} x The position on screen.
    *   @returns {number}
    */
    static getScreenX(x)
    {
        return Math.ceil(RPM.getDoubleScreenX(x));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size.
    *   @static
    *   @param {number} y The position on screen.
    *   @returns {number}
    */
    static getScreenY(y)
    {
        return Math.ceil(RPM.getDoubleScreenY(y));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size.
    *   @static
    *   @param {number} xy The position on screen.
    *   @returns {number}
    */

    static getScreenXY(xy)
    {
        return Math.ceil((RPM.WINDOW_X + RPM.WINDOW_Y) / 2 * xy);
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size.
    *   @static
    *   @param {number} xy The position on screen.
    *   @returns {number}
    */

    static getScreenMinXY(xy)
    {
        return Math.ceil(xy * Math.min(RPM.WINDOW_X,RPM.WINDOW_Y));
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size, but without
    *   rounding it.
    *   @static
    *   @param {number} x The position on screen.
    *   @returns {number}
    */
    static getDoubleScreenX(x)
    {
        return RPM.WINDOW_X * x;
    }

    // -------------------------------------------------------
    /** Get the pixel position transformation according to screen size, but without
    *   rounding it.
    *   @static
    *   @param {number} y The position on screen.
    *   @returns {number}
    */
    static getDoubleScreenY(y)
    {
        return RPM.WINDOW_Y * y;
    }

    // -------------------------------------------------------
    /** Get the position according to the square size.
    *   @static
    *   @param {number} x The position.
    *   @returns {number}
    */
    static getSquare(x)
    {
        return Math.floor(x / RPM.SQUARE_SIZE);
    }

    // -------------------------------------------------------
    /** Get the numberof fields of an object.
    *   @static
    *   @returns {number}
    */
    static countFields(obj)
    {
        if (obj.__count__ !== undefined) // Old FF
        {
            return obj.__count__;
        }

        if (Object.keys) // ES5
        { 
            return Object.keys(obj).length;
        }

        // Everything else:
        let c = 0;
        for (let p in obj)
        {
            if (obj.hasOwnProperty(p))
            {
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
    static isEmpty(array)
    {
        return array[0] == null;
    }

    // -------------------------------------------------------

    static cos(w)
    {
        return parseFloat(Math.cos(w).toFixed(10));
    }

    // -------------------------------------------------------
    static sin(w)
    {
        return parseFloat(Math.sin(w).toFixed(10));
    }

    // -------------------------------------------------------

    static getPortion(position)
    {
        return RPM.getPortionArray(RPM.getPosition(position));
    }

    // -------------------------------------------------------

    static getPortionArray(p)
    {
        return [
            Math.floor(p[0] / RPM.PORTION_SIZE),
            Math.floor(p[1] / RPM.PORTION_SIZE),
            Math.floor(p[2] / RPM.PORTION_SIZE)
        ];
    }

    // -------------------------------------------------------

    static getPosition(position)
    {
        return [
            Math.floor(position.x / RPM.SQUARE_SIZE),
            Math.floor(position.y / RPM.SQUARE_SIZE),
            Math.floor(position.z / RPM.SQUARE_SIZE)
        ];
    }

    // -------------------------------------------------------

    static arePortionEquals(portion1, portion2)
    {
        return (portion1[0] === portion2[0] && portion1[1] === portion2[1] &&
            portion1[2] === portion2[2]);
    }

    // -------------------------------------------------------
    /** Show an error.
    *   @static
    *   @param {Error} error The error message.
    */
    static showError(e)
    {
        RPM.showErrorMessage(e.fileName + " - line: " + e.lineNumber + " -> " + 
            e.message + RPM.STRING_NEW_LINE + e.stack);
    }

    // -------------------------------------------------------
    /** Show an error message.
    *   @static
    *   @param {string} msg The error message.
    */
    static showErrorMessage(msg)
    {
        if (Platform.DESKTOP)
        {
            const dialog = require('electron').remote.dialog;
            dialog.showMessageBoxSync(
                { 
                    title: 'Error',
                    type: 'error',
                    message: msg
                }
            );
        } else
        {
            console.alert(msg);
        }
    }

    // -------------------------------------------------------
    /** Give a modulo without negative value.
    *   @static
    *   @param {number} x
    *   @param {number} m
    */
    static mod(x, m)
    {
        let r = x % m;
        return r < 0 ? r + m : r;
    }

    // -------------------------------------------------------
    /** Get the list max ID.
    *   @static
    *   @param {number[]} list A list containing only IDs.
    */
    static getMaxID(list)
    {
        let max = 0;
        for (let i = 0, l = list.length; i < l; i++)
        {
            max = Math.max(list[i], max);
        }
        return max;
    }

    // -------------------------------------------------------
    /** Create a new array list initialed with null everywhere.
    *   @static
    *   @param {number} size The list size.
    */
    static fillNullList(size)
    {
        let list = new Array(size);
        for (let i = 0; i < size; i++)
        {
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
    static random(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // -------------------------------------------------------
    /** Load a texture
    *   @param {string} path The path of the texture
    *   @retuns {THREE.MeshBasicMaterial}
    */
    static async loadTexture(path)
    {
        let texture = await new Promise((resolve, reject) => {
            RPM.textureLoader.load(path,
                (t) => {
                    resolve(t);
                },
                (t) => {},
                (t) => {
                    RPM.showErrorMessage("Could not load " + path);
                }
            );
        });
        return RPM.createMaterial(texture);
    }

    // -------------------------------------------------------
    /** Load a texture empty.
    *   @retuns {THREE.MeshBasicMaterial}
    */
    static loadTextureEmpty()
    {
        return new THREE.MeshBasicMaterial(
        {
            transparent: true,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading,
            alphaTest: 0.5
        });
    }

    // -------------------------------------------------------
    /** Create a material from texture.
    *   @retuns {THREE.MeshBasicMaterial}
    */
    static createMaterial(texture, opts)
    {
        opts = RPM.defaultValue(opts, {})
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = opts.flipY;
        if (!opts.uniforms)
        {
            opts.uniforms = {
                texture: { type: "t", value: texture },
                colorD: { type: "v4", value: RPM.screenTone },
                reverseH: { type: "b", value: opts.flipX },
            };
        }
        let material = new THREE.ShaderMaterial({
            uniforms:       opts.uniforms,
            vertexShader:   RPM.SHADER_FIX_VERTEX,
            fragmentShader: RPM.SHADER_FIX_FRAGMENT,
            transparent: true,
            side: THREE.DoubleSide
        });
        material.map = texture;
        return material;
    }

    // -------------------------------------------------------

    static updateBackgroundColor(color)
    {
        RPM.renderer.setClearColor(color.getHex(RPM.screenTone), color.alpha);
    }

    // -------------------------------------------------------

    static toScreenPosition(vector, camera)
    {
        let widthHalf = RPM.CANVAS_WIDTH / 2;
        let heightHalf = RPM.CANVAS_HEIGHT / 2;
        let position = vector.clone();
        camera.updateMatrixWorld(true);
        position.project(camera);
        return new THREE.Vector2((position.x * widthHalf) + widthHalf, - (
            position.y * heightHalf) + heightHalf);
    }

    // -------------------------------------------------------

    static variance(value, variance)
    {
        let v = Math.round(value * variance / 100);
        return RPM.random(value - v, value + v);
    }

    // -------------------------------------------------------

    static evaluateFormula(formula, user, target, damage)
    {
        return new Function("u", "t", "damage", "$that", "return " + formula)(
            user, target, damage, $that);
    }

    // -------------------------------------------------------

    static evaluateScript(script)
    {
        return new Function("$that", script)($that);
    }

    // -------------------------------------------------------

    static formulaContainsUser(formula)
    {
        return formula.contains("u");
    }

    // -------------------------------------------------------

    static formulaContainsTarget(formula)
    {
        return formula.contains("t");
    }

    // -------------------------------------------------------

    static defaultValue(value, defaultValue)
    {
        return RPM.isUndefined(value) ? defaultValue : value;
    }

    // -------------------------------------------------------

    static isUndefined(value)
    {
        return typeof value === RPM.UNDEFINED;
    }

    // -------------------------------------------------------

    static isNumber(value)
    {
        return typeof value === RPM.NUMBER;
    }

    // -------------------------------------------------------

    static isString(value)
    {
        return typeof value === RPM.STRING;
    }

    // -------------------------------------------------------

    static numToBool(num)
    {
        return num === RPM.NUM_BOOL_TRUE;
    }

    // -------------------------------------------------------

    static boolToNum(b)
    {
        return b ? RPM.NUM_BOOL_TRUE : RPM.NUM_BOOL_FALSE;
    }

    // -------------------------------------------------------

    static indexOfProp(array, attr, value)
    {
        for (let i = 0, l = array.length; i < l; i ++) 
        {
            if (array[i][attr] === value) 
            {
                return i;
            }
        }
        return -1;
    }

    static numToString(n)
    {
        return RPM.STRING_EMPTY + n;
    }

    static readJSONSystemList(jsonList, func, isConstructor = true)
    {
        let jsonElement;
        let l = jsonList.length;
        let list = [];
        for (let i = 0; i < l; i++)
        {
            jsonElement = jsonList[i];
            list[jsonElement.id] = isConstructor ? new func(jsonElement) : func
                .call(null, jsonElement);
        }
        return list;
    }

    static readJSONSystemListByIndex(jsonList, func, isConstructor = true)
    {
        let jsonElement;
        let l = jsonList.length;
        let list = new Array(l);
        for (let i = 0; i < l; i++)
        {
            jsonElement = jsonList[i];
            list[i] = isConstructor ? new func(jsonElement) : func.call(null, 
                jsonElement);
        }
        return list;
    }

    static readJSONSystemListByIDIndex(jsonList, listIDs, listIndexes, func,
        isConstructor = true)
    {
        let l = jsonList.length;
        let maxID = 0;
        let id, jsonElement;
        for (let i = 0; i < l; i++)
        {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            listIDs[id] = isConstructor ? new func(jsonElement) : func.call(null
                , jsonElement);
            listIndexes[i] = id;
            maxID = Math.max(id, maxID);
        }
        return maxID;
    }

    static readJSONSystemListHash(jsonList, func, isConstructor = true)
    {
        let list = [];
        let jsonElement;
        for (let i = 0, l = jsonList.length; i < l; i++)
        {
            jsonElement = jsonList[i];
            list[jsonElement[RPM.JSON_KEY]] = isConstructor ? new func(
                jsonElement[RPM.JSON_VALUE]) : func.call(null, jsonElement);
        }
        return list;
    }

    static async tryCatch(func)
    {
        try
        {
            return await func;
        } catch(e)
        {
            window.onerror(null, null, null, null, e);
        }
    }

    /** Initialize the game stack and datas
    */
    static initialize()
    {
        RPM.songsManager = new SongsManager();
        RPM.settings = new Settings();
        RPM.datasGame = new DatasGame();
        RPM.gameStack = new GameStack();
        RPM.loadingDelay = 0;
        RPM.clearHUD();
    }

    // -------------------------------------------------------
    /** Load the game stack and datas
    */
    static async load()
    {
        await RPM.settings.read();
        await RPM.datasGame.read();
        RPM.gameStack.pushTitleScreen();
        RPM.datasGame.loaded = true;
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Load the game stack and datas
    */
    static clearHUD()
    {
        Platform.ctx.clearRect(0, 0, RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        Platform.ctx.lineWidth = 1;
        Platform.ctx.webkitImageSmoothingEnabled = false;
        Platform.ctx.imageSmoothingEnabled = false;
    }

    // -------------------------------------------------------
    /** Initialize the openGL stuff.
    */
    static initializeGL()
    {
        // Create the renderer
        RPM.renderer = new THREE.WebGLRenderer({antialias: RPM.datasGame.system
            .antialias, alpha: true});
        RPM.renderer.autoClear = false;
        RPM.renderer.setSize(RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        if (RPM.datasGame.system.antialias)
        {
            RPM.renderer.setPixelRatio(2);
        }
        Platform.canvas3D.appendChild(RPM.renderer.domElement);
    }

    // -------------------------------------------------------
    /** Set the camera aspect while resizing the window.
    */
    static resizeGL()
    {
        RPM.renderer.setSize(RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
        let camera = RPM.gameStack.camera;
        if (!RPM.isUndefined(camera))
        {
            camera.threeCamera.aspect = RPM.CANVAS_WIDTH / RPM.CANVAS_HEIGHT;
            camera.threeCamera.updateProjectionMatrix();
        }
    }

    // -------------------------------------------------------
    /** Update the current stack.
    */
    static update()
    {
        // Update game timer if there's a current game
        if (RPM.game)
        {
            RPM.game.playTime.update();
        }

        // Update songs manager
        RPM.songsManager.update();

        // Repeat keypress as long as not blocking
        let continuePressed;
        for (let i = 0, l = RPM.keysPressed.length; i < l; i++)
        {
            continuePressed = RPM.onKeyPressedRepeat(RPM.keysPressed[i]);
            if (!continuePressed)
            {
                break;
            }
        }

        // Update the top of the stack
        RPM.gameStack.update();
    }

    // -------------------------------------------------------
    /** First key press handle for the current stack.
    *   @param {number} key The key ID pressed.
    */
    static onKeyPressed(key)
    {
        RPM.gameStack.onKeyPressed(key);
    }

    // -------------------------------------------------------

    /** First key release handle for the current stack.
    *   @param {number} key The key ID released.
    */
    static onKeyReleased(key)
    {
        RPM.gameStack.onKeyReleased(key);
    }

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack.
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    static onKeyPressedRepeat(key)
    {
        return RPM.gameStack.onKeyPressedRepeat(key);
    }

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack, but with
    *   a small wait after the first pressure (generally used for menus)
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    static onKeyPressedAndRepeat(key)
    {
        return RPM.gameStack.onKeyPressedAndRepeat(key);
    }

    // -------------------------------------------------------

    /** Draw the 3D for the current stack
    */
    static draw3D()
    {
        RPM.gameStack.draw3D();
    }

    // -------------------------------------------------------

    /** Draw HUD for the current stack
    */
    static drawHUD = function()
    {
        if (RPM.requestPaintHUD)
        { 
            if (RPM.gameStack.isLoading() && RPM.loadingScene) 
            {
                RPM.loadingDelay += RPM.elapsedTime;
                if (RPM.loadingDelay >= RPM.LOADING_MIN_DELAY)
                {
                    RPM.requestPaintHUD = false;
                    RPM.loadingScene.drawHUD();
                }
            } else
            {
                RPM.requestPaintHUD = false;
                RPM.loadingDelay = 0;
                RPM.clearHUD();
                RPM.gameStack.drawHUD();
            }
        }
    }

    // -------------------------------------------------------
    /** Main loop of the game
    */
    static loop()
    {
        requestAnimationFrame(RPM.loop);

        // Update if everything is loaded
        if (RPM.datasGame.loaded)
        {
            if (!RPM.gameStack.isLoading())
            {
                RPM.update();
            }
            if (!RPM.gameStack.isLoading())
            {
                RPM.draw3D();
            }
        }
        RPM.drawHUD();

        // Elapsed time
        RPM.elapsedTime = new Date().getTime() - RPM.lastUpdateTime;
        RPM.averageElapsedTime = (RPM.averageElapsedTime + RPM.elapsedTime) / 2;
        RPM.lastUpdateTime = new Date().getTime();
    }
}