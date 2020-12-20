/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Constants, Paths, Utils, Platform } from "../Common";
var PictureKind = Enum.PictureKind;
import { Datas } from "..";
import { Picture2D, CollisionSquare } from "../Core";
import { Base } from "./Base";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');
/** @class
 *  A picture of the game.
 *  @extends {System.Base}
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  picture
 *  @param {PictureKind} [kind=PictureKind.Pictures] The kind of picture
 */
class Picture extends Base {
    constructor(json, kind = PictureKind
        .Pictures) {
        super(json, kind);
    }
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args) {
        this.kind = args[0];
    }
    /**
     *  Get string of picture kind.
     *  @param {PictureKind} kind The picture kind
     *  @returns {string}
     */
    static pictureKindToString(kind) {
        switch (kind) {
            case PictureKind.Bars:
                return "bar";
            case PictureKind.Icons:
                return "icon";
            case PictureKind.Autotiles:
                return "autotile";
            case PictureKind.Characters:
                return "character";
            case PictureKind.Mountains:
                return "mountain";
            case PictureKind.Tilesets:
                return "tileset";
            case PictureKind.Walls:
                return "wall";
            case PictureKind.Battlers:
                return "battler";
            case PictureKind.Facesets:
                return "faceset";
            case PictureKind.WindowSkins:
                return "window skin";
            case PictureKind.TitleScreen:
                return "title screen";
            case PictureKind.Objects3D:
                return "object 3D";
            case PictureKind.Pictures:
                return "picture";
            case PictureKind.Animations:
                return "animation";
            case PictureKind.Skyboxes:
                return "skybox";
        }
        return "";
    }
    /**
     *  Get the folder associated to a kind of picture.
     *  @static
     *  @param {PictureKind} kind The kind of picture
     *  @param {boolean} isBR Indicate if the picture is a BR
     *  @param {string} dlc The picture DLC name (if exists)
     *  @returns {string}
     */
    static getFolder(kind, isBR, dlc) {
        return (isBR ? Datas.Systems.PATH_BR : (dlc ? Datas.Systems.PATH_DLCS +
            Constants.STRING_SLASH + dlc : Paths.ROOT_DIRECTORY_LOCAL)) +
            this.getLocalFolder(kind);
    }
    /**
     *  Get the local folder associated to a kind of picture.
     *  @static
     *  @param {PictureKind} kind The kind of picture
     *  @returns {string}
     */
    static getLocalFolder(kind) {
        switch (kind) {
            case PictureKind.Bars:
                return Paths.BARS;
            case PictureKind.Icons:
                return Paths.ICONS;
            case PictureKind.Autotiles:
                return Paths.AUTOTILES;
            case PictureKind.Characters:
                return Paths.CHARACTERS;
            case PictureKind.Mountains:
                return Paths.MOUNTAINS;
            case PictureKind.Tilesets:
                return Paths.TILESETS;
            case PictureKind.Walls:
                return Paths.WALLS;
            case PictureKind.Battlers:
                return Paths.BATTLERS;
            case PictureKind.Facesets:
                return Paths.FACESETS;
            case PictureKind.WindowSkins:
                return Paths.WINDOW_SKINS;
            case PictureKind.TitleScreen:
                return Paths.TITLE_SCREEN;
            case PictureKind.Objects3D:
                return Paths.OBJECTS_3D;
            case PictureKind.Pictures:
                return Paths.HUD_PICTURES;
            case PictureKind.Animations:
                return Paths.ANIMATIONS;
            case PictureKind.Skyboxes:
                return Paths.SKYBOXES;
        }
        return "";
    }
    /**
     *  Read the JSON associated to the picture.
     *  @param {Object} json Json object describing the picture
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = Utils.defaultValue(json.d, "");
        this.jsonCollisions = Utils.defaultValue(json.col, []);
        this.collisionsRepeat = Utils.defaultValue(json.rcol, false);
    }
    /**
     *  Read the JSON associated to the picture.
     *  @async
     */
    async load() {
        this.picture = await Picture2D.create(this);
    }
    /**
     *  Get the absolute path associated to this picture.
     *  @returns {string}
     */
    getPath() {
        return this.id === -1 ? "" : Picture.getFolder(this.kind, this.isBR, this.dlc) + Constants.STRING_SLASH + this.name;
    }
    /**
     *  Read collisions according to image size.
     *  @param {THREE.Image} image The image texture
     */
    readCollisionsImage(image) {
        this.width = Math.floor(image.width / Datas.Systems.SQUARE_SIZE);
        this.height = Math.floor(image.height / Datas.Systems.SQUARE_SIZE);
        this.readCollisions();
    }
    /**
     *  Read collisions, we assume that this.width and this.height had been
     *  edited.
     */
    readCollisions() {
        if (!this.jsonCollisions) {
            return;
        }
        // Initialize
        let w = this.width / Datas.Systems.FRAMES;
        let h = this.height / 4;
        this.collisions = new Array(this.width * this.height);
        let i, l;
        for (i = 0, l = this.width * this.height; i < l; i++) {
            this.collisions[i] = null;
        }
        // Insert collision
        let j, k, jsonTab, jsonKey, jsonVal, index, collision;
        for (i = 0, l = this.jsonCollisions.length; i < l; i++) {
            jsonTab = this.jsonCollisions[i];
            jsonKey = jsonTab.k;
            jsonVal = jsonTab.v;
            index = jsonKey[0] + (jsonKey[1] * this.width);
            collision = new CollisionSquare;
            collision.read(jsonVal);
            this.collisions[index] = collision;
            if (this.collisionsRepeat) {
                for (j = 0; j < Datas.Systems.FRAMES; j++) {
                    for (k = 0; k < 4; k++) {
                        this.collisions[(jsonKey[0] + (j * w)) + ((jsonKey[1] +
                            (k * h)) * this.width)] = collision;
                    }
                }
            }
        }
        this.jsonCollisions = null;
    }
    /**
     *  Get a specific collision square according to texture.
     *  @param {number[]} pos Texture position
     *  @returns {CollisionSquare}
     */
    getCollisionAt(pos) {
        return this.getCollisionAtPos(pos[0], pos[1]);
    }
    /**
     *  Get a specific collision square according to texture.
     *  @param {number} x Texture x position
     *  @param {number} y Texture y position
     *  @returns {CollisionSquare}
     */
    getCollisionAtPos(x, y) {
        return this.collisions[x + y * this.width];
    }
    /**
     *  Get a specific collision square according to index.
     *  @param {number} index The index positions
     *  @returns {CollisionSquare}
     */
    getCollisionAtIndex(index) {
        return this.getCollisionAtPos(index % this.width, Math.floor(index /
            this.width));
    }
    /**
     *  Get a specific collision for wall.
     *  @param {number[]} texture Texture position
     *  @returns {number[][]}
     */
    getSquaresForWall(texture) {
        let w = texture[2];
        let h = texture[3];
        let l = w * h;
        let squares = new Array(l);
        let x, y, leftSquare, rightSquare, square;
        for (let i = 0; i < l; i++) {
            x = texture[0] + (i % w);
            y = texture[1] + Math.floor(i / w);
            if (x === 3) {
                leftSquare = this.getCollisionAtPos(0, y);
                rightSquare = this.getCollisionAtPos(2, y);
                if (leftSquare === null && rightSquare === null) {
                    squares[i] = null;
                }
                else if (leftSquare === null || rightSquare === null) {
                    square = (leftSquare === null ? rightSquare : leftSquare);
                    if (!square) {
                        Platform.showErrorMessage("Your wall image " + this.name
                            + " is not using a correct template. Your image "
                            + "should be this size: WIDTH: 3 * SQUARE_SIZE, "
                            + "HEIGHT: as you wish. There should be left wall, "
                            + "middle wall, and right wall for the 3 width "
                            + "squares.");
                        return;
                    }
                    squares[i] = square.rect;
                }
                else {
                    squares[i] = [0, 0, Datas.Systems.SQUARE_SIZE, Datas.Systems
                            .SQUARE_SIZE];
                }
            }
            else {
                square = this.getCollisionAtPos(x, y);
                squares[i] = square ? square.rect : null;
            }
        }
        return CollisionSquare.unionSquares(squares, l, w, h);
    }
    /**
     *  Get a specific collision square according to texture.
     *  @param {number[]} texture Texture position
     *  @returns {number[][]}
     */
    getSquaresForTexture(texture) {
        let w = texture[2];
        let h = texture[3];
        let l = w * h;
        var squares = new Array(l);
        let square;
        for (let i = 0; i < l; i++) {
            square = this.getCollisionAtPos(texture[0] + (i % w), texture[1] +
                Math.floor(i / w));
            squares[i] = square ? square.rect : null;
        }
        return CollisionSquare.unionSquares(squares, l, w, h);
    }
    /**
     *  Get a specific collision square according to texture
     *  @param {THREE.Image} image The image texture
     *  @returns {number[][][]}
     */
    getSquaresForStates(image) {
        let w = Math.floor(image.width / Datas.Systems.SQUARE_SIZE / Datas
            .Systems.FRAMES);
        let h = Math.floor(image.height / Datas.Systems.SQUARE_SIZE / 4);
        let states = new Array(Datas.Systems.FRAMES * 4);
        let j;
        for (let i = 0; i < Datas.Systems.FRAMES; i++) {
            for (j = 0; j < 4; j++) {
                states[i + (j * Datas.Systems.FRAMES)] = this
                    .getSquaresForTexture([i * w, j * h, w, h]);
            }
        }
        return states;
    }
}
export { Picture };
