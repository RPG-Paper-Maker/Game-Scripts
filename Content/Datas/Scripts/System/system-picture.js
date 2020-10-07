/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A picture of the game
*   @property {PictureKind} kind The kind of picture
*   @property {string} name The picture name
*   @property {boolean} isBR Indicate if the picture is a BR (Basic Ressource)
*   @property {boolean} isDLC Indicate if the picture is a DLC
*   @property {number[]} jsonCollisions The json used for the picture collision
*   @property {boolean} collisionsRepeat Indicate if collision is repeated (for 
*   characters)
*   @param {Object} [json=undefined] Json object describing the picture
*   @param {Object} [kind=PictureKind.Pictures] The kind of picture
*/
class SystemPicture
{
    constructor(json, kind = PictureKind.Pictures)
    {
        this.kind = kind;
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Get the folder associated to a kind of picture
    *   @static
    *   @param {PictureKind} kind The kind of picture
    *   @param {boolean} isBR Indicate if the picture is a BR
    *   @param {boolean} isDLC Indicate if the picture is a DLC
    *   @returns {string}
    */
    static getFolder = function(kind, isBR, dlc)
    {
        return (isBR ? RPM.PATH_BR : (dlc ? RPM.PATH_DLCS + RPM.STRING_SLASH + 
            dlc : RPM.ROOT_DIRECTORY_LOCAL)) + SystemPicture.getLocalFolder(kind);
    }

    // -------------------------------------------------------
    /** Get the local folder associated to a kind of picture
    *   @static
    *   @param {PictureKind} kind The kind of picture
    *   @returns {string}
    */
    static getLocalFolder = function(kind)
    {
        switch(kind)
        {
        case PictureKind.Bars:
            return RPM.PATH_BARS;
        case PictureKind.Icons:
            return RPM.PATH_ICONS;
        case PictureKind.Autotiles:
            return RPM.PATH_AUTOTILES;
        case PictureKind.Characters:
            return RPM.PATH_CHARACTERS;
            case PictureKind.Mountains:
            return RPM.PATH_MOUNTAINS;
        case PictureKind.Tilesets:
            return RPM.PATH_TILESETS;
        case PictureKind.Walls:
            return RPM.PATH_WALLS;
        case PictureKind.Battlers:
            return RPM.PATH_BATTLERS;
        case PictureKind.Facesets:
            return RPM.PATH_FACESETS;
        case PictureKind.WindowSkins:
            return RPM.PATH_WINDOW_SKINS;
        case PictureKind.TitleScreen:
            return RPM.PATH_TITLE_SCREEN;
        case PictureKind.Objects3D:
            return RPM.PATH_OBJECTS_3D;
        case PictureKind.Pictures:
            return RPM.PATH_HUD_PICTURES;
        case PictureKind.Animations:
            return RPM.PATH_ANIMATIONS;
        case PictureKind.Skyboxes:
            return RPM.PATH_SKYBOXES;
        }
        return "";
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the picture
    *   @param {Object} json Json object describing the picture
    */
    read(json)
    {
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = RPM.defaultValue(json.d, RPM.STRING_EMPTY);
        this.jsonCollisions = RPM.defaultValue(json.col, []);
        this.collisionsRepeat = RPM.defaultValue(json.rcol, false);
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the picture
    */
    load()
    {
        this.picture = Picture2D.create(this, this.kind);
    }

    // -------------------------------------------------------
    /** Get the absolute path associated to this picture
    *   @returns {string}
    */
    getPath()
    {
        return SystemPicture.getFolder(this.kind, this.isBR, this.dlc) + RPM
            .STRING_SLASH + this.name;
    }

    // -------------------------------------------------------
    /** Read collisions according to image size
    *   @param {Image} image The image texture
    */
    readCollisionsImage(image)
    {
        this.width = Math.floor(image.width / RPM.SQUARE_SIZE);
        this.height = Math.floor(image.height / RPM.SQUARE_SIZE);
        this.readCollisions();
    }

    // -------------------------------------------------------
    /** Read collisions, we assume that this.width and this.height had been
    *   edited
    */
    readCollisions()
    {
        if (!this.jsonCollisions)
        {
            return;
        }

        // Initialize
        let w = this.width / RPM.FRAMES;
        let h = this.height / 4;
        this.collisions = new Array(this.width * this.height);
        let i, l;
        for (i = 0, l = this.width * this.height; i < l; i++)
        {
            this.collisions[i] = null;
        }

        // Insert collision
        let j, k, jsonTab, jsonKey, jsonVal, index, collision;
        for (i = 0, l = this.jsonCollisions.length; i < l ; i++)
        {
            jsonTab = this.jsonCollisions[i];
            jsonKey = jsonTab.k;
            jsonVal = jsonTab.v;
            index = jsonKey[0] + (jsonKey[1] * this.width);
            collision = new CollisionSquare;
            collision.read(jsonVal);
            this.collisions[index] = collision;

            if (this.collisionsRepeat)
            {
                for (j = 0; j < RPM.FRAMES; j++)
                {
                    for (k = 0; k < 4; k++)
                    {
                        this.collisions[(jsonKey[0] + (j * w)) + ((jsonKey[1] +
                            (k * h)) * this.width)] = collision;
                    }
                }
            }
        }
        this.jsonCollisions = null;
    }

    // -------------------------------------------------------
    /** Get a specific collision square according to texture
    *   @param {number[]} pos Texture position
    */
    getCollisionAt(pos)
    {
        return this.getCollisionAtPos(pos[0], pos[1]);
    }

    // -------------------------------------------------------
    /** Get a specific collision square according to texture
    *   @param {number} x Texture x position
    *   @param {number} y Texture y position
    */
    getCollisionAtPos(x, y)
    {
        return this.collisions[x + y * this.width];
    }

    // -------------------------------------------------------
    /** Get a specific collision square according to index
    *   @param {number} index The index positions
    */
    getCollisionAtIndex(index)
    {
        return this.getCollisionAtPos(index % this.width, Math.floor(index / 
            this.width));
    }

    // -------------------------------------------------------
    /** Get a specific collision for wall
    *   @param {number[]} texture Texture position
    */
    getSquaresForWall(texture)
    {
        let w = texture[2];
        let h = texture[3];
        let l = w * h;
        let squares = new Array(l);
        let x, y, leftSquare, rightSquare, square;
        for (let i = 0; i < l; i++)
        {
            x = texture[0] + (i % w);
            y = texture[1] + Math.floor(i / w);
            if (x === 3)
            {
                leftSquare = this.getCollisionAtPos(0, y);
                rightSquare = this.getCollisionAtPos(2, y);
                if (leftSquare === null && rightSquare === null)
                {
                    squares[i] = null;
                } else if (leftSquare === null || rightSquare === null)
                {
                    square = (leftSquare === null ? rightSquare : leftSquare);
                    if (!square)
                    {
                        RPM.showErrorMessage("Your wall image " + this.name +
                            " is not using a correct template. Your image "
                            + "should be this size: WIDTH: 3 * SQUARE_SIZE, "
                            + "HEIGHT: as you wish. There should be left wall, "
                            + "middle wall, and right wall for the 3 width "
                            + "squares.");
                        return;
                    }
                    squares[i] = square.rect;
                }
                else
                {
                    squares[i] = [0, 0, RPM.SQUARE_SIZE, RPM.SQUARE_SIZE];
                }
            } else
            {
                square = this.getCollisionAtPos(x, y);
                squares[i] = square ? square.rect : null;
            }
        }
        return CollisionSquare.unionSquares(squares, l, w, h);
    }

    // -------------------------------------------------------
    /** Get a specific collision square according to texture
    *   @param {number[]} texture Texture position
    */
    getSquaresForTexture(texture)
    {
        let w = texture[2];
        let h = texture[3];
        let l = w * h;
        var squares = new Array(l);
        let square;
        for (let i = 0; i < l; i++)
        {
            square = this.getCollisionAtPos(texture[0] + (i % w), texture[1] + 
                Math.floor(i / w));
            squares[i] = square ? square.rect : null;
        }
        return CollisionSquare.unionSquares(squares, l, w, h);
    }

    // -------------------------------------------------------
    /** Get a specific collision square according to texture
    *   @param {Image} image The image texture
    */
    getSquaresForStates(image)
    {
        let w = Math.floor(image.width / RPM.SQUARE_SIZE / RPM.FRAMES);
        let h = Math.floor(image.height / RPM.SQUARE_SIZE / 4);
        let states = new Array(RPM.FRAMES * 4);
        let j;
        for (let i = 0; i < RPM.FRAMES; i++)
        {
            for (j = 0; j < 4; j++)
            {
                states[i + (j * RPM.FRAMES)] = this.getSquaresForTexture([i * w,
                    j * h, w, h]);
            }
        }
        return states;
    }
}