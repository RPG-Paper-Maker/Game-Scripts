/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  [MAIN]
//
//  Main file that always needs to be on the bottom of the other scripts.
//  Contains all the global functions and variables.
//
// -------------------------------------------------------

// -------------------------------------------------------
//  GLOBAL VARIABLES
// -------------------------------------------------------

/** The main window.
*   @type {Window} */
var $window;

/** The game stack containing all the different scenes of the game.
*   @type {GameStack} */
var $gameStack;

/** The current map in the game.
*   @type {SceneMap} */
var $currentMap;

/** All the game datas.
*   @type {DatasGame} */
var $datasGame;

/** Defines the size (in pixels) of a square in a map.
*   @constant
*   @type {number} */
var $SQUARE_SIZE;

/** Defines the near ray size (in portions). The map will be drawn according to
*   the camera's position and to this ray.
*   @constant
*   @type {number} */
var $PORTIONS_RAY_NEAR;

/** Defines the far ray size (in portions). The map will not be drawn between
*   $PORTIONS_RAY_NEAR and $PORTIONS_RAY_FAR but will take account of objects
*   doings.
*   @constant
*   @type {number} */
var $PORTIONS_RAY_FAR = 0;

/** Defines the size (in squares) of a portion in a map.
*   @constant
*   @type {number} */
var $PORTION_SIZE = 16;

/** Defines the max size in px of a picture (limited for efficient canvas).
*   @constant
*   @type {number} */
var $MAX_PICTURE_SIZE = 4096;

/** Defines the number of frames for an animation.
*   @type {number} */
var $FRAMES;

/** A number representing the milliseconds elapsed between 1 January 1970
*   00:00:00 UTC and the given date. It is updated at the end of each update in
*   order to get the elapsed time between each update.
*   @type {number} */
var $elapsedTime = 0;

/** The average elapsed time.
*   @type {number} */
var $averageElapsedTime = 0;

/** A number representing the milliseconds elapsed between 1 January 1970
*   00:00:00 UTC and the given date. It is updated at the end of each update in
*   order to get the elapsed time between each update.
*   @type {number} */
var $lastUpdateTime = new Date().getTime();

/** The list of all the keys that are currently pressed (for multi-key handling)
*   .
*   @type {number[]} */
var $keysPressed = new Array;

/** The list of all the pictures to check for loading
*   .
*   @type {Pictures2D[]} */
var $picturesLoading = new Array;

/** The list of all the pictures loaded
*   .
*   @type {Pictures2D[]} */
var $picturesLoaded = new Array;

/** The number of files that still needs to be loaded asynchonously.
*   @type {number} */
var $filesToLoad = 0;

/** The number of loaded files (needs to be compared to $filesToLoad).
*   @type {number} */
var $loadedFiles = 0;

/** The font size of your texts.
*   @type {number}
*   @default 13 */
var $fontSize = 13;

/**  The font name of your texts.
*   @type {string}
*   @default "sans-serif" */
var $fontName = "sans-serif";

/** The canvas managing HUD.
*   @type {Canvas} */
var $canvasHUD;

/** The canvas managing 3D.
*   @type {Canvas} */
var $canvas3D;

/** The canvas managing rendering pictures.
*   @type {Canvas} */
var $canvasRendering;

/** Indicates if the hero is blocked by an event.
*   @type {boolean} */
var $blockingHero = false;

/** The model of the hero.
*   @type {SystemObject} */
var $modelHero;

/** The width of the window.
*   @type {number} */
var $canvasWidth;

/** The height of the window.
*   @type {number} */
var $canvasHeight;

/** The width of the screen.
*   @type {number} */
var $screenWidth;

/** The height of the screen.
*   @type {number} */
var $screenHeight;

/** Coefficient of window width (for resizing HUD).
*   @type {number} */
var $windowX;

/** Coefficient of window height (for resizing HUD).
*   @type {number} */
var $windowY;

/** Defines the default width of the screen.
*   @type {number} */
var $SCREEN_X = 640;

/** Defines the default height of the screen.
*   @type {number} */
var $SCREEN_Y = 480;

/** The global renderer.
*   @type {THREE.WebGLRenderer} */
var $renderer;

/** The current game played.
*   @type {Game} */
var $game = null;

/** The scene used for loading screen.
*   @type {SceneLoading} */
var $loadingScene;

/** The dialog for displaying errors.
*   @type {MessageDialog} */
var $DIALOG_ERROR = null;

/** A material invisible used for collisions.
*   @type {THREE.MeshBasicMaterial} */
var $BB_MATERIAL = new THREE.MeshBasicMaterial();
$BB_MATERIAL.visible = false;

/** The media player for songs.
*   @type {SongsManager} */
var $songsManager;

/** The texture loader.
*   @type {THREE.TextureLoader} */
var $textureLoader = new THREE.TextureLoader();

/** The context used for drawing HUD.
*   @type {Canvas2D} */
var $context;

var $requestPaintHUD = true;

// -------------------------------------------------------
//  BOUNDING BOXES
// -------------------------------------------------------

/** A bounding box used for boxes collisions.
*   @type {THREE.Mesh} */
var $BB_BOX = MapPortion.createBox();

/** A bounding box used for cylinders collisions.
*   @type {THREE.Mesh} */
var $BB_ORIENTED_BOX = MapPortion.createOrientedBox();

// -------------------------------------------------------
//  GLOBAL FUNCTIONS
// -------------------------------------------------------

/** Initialize the game stack and datas.
*/
function initialize(){
    $datasGame = new DatasGame();
    $gameStack = new GameStack();
    $loadingScene = new SceneLoading();
}

// -------------------------------------------------------

/** Initialize the openGL stuff.
*   @param {Canvas} canvas The 3D canvas.
*/
function initializeGL(canvas){

    // Create the renderer
    if ($DESKTOP) {
        $renderer = new THREE.Canvas3DRenderer({
                                                   canvas: canvas,
                                                   devicePixelRatio:
                                                   canvas.devicePixelRatio
                                               });
    }
    else{
        $renderer = new THREE.WebGLRenderer();
        $renderer.autoClear = false;
    }

    $renderer.setSize($canvasWidth, $canvasHeight);
}

// -------------------------------------------------------

/** Set the camera aspect while resizing the window.
*   @param {Canvas} canvas The 3D canvas.
*/
function resizeGL(canvas){
    $renderer.setSize($canvasWidth, $canvasHeight);
    var camera = $gameStack.camera;
    if (typeof camera !== 'undefined'){
        camera.threeCamera.aspect = $canvasWidth / $canvasHeight;
        camera.threeCamera.updateProjectionMatrix();
    }
}

// -------------------------------------------------------

/** Update the current stack.
*/
function update(){

    // Update songs manager
    $songsManager.update();

    // Repeat keypress as long as not blocking
    var continuePressed = true;
    for (var i = 0, l = $keysPressed.length; i < l; i++){
        continuePressed = onKeyPressedRepeat($keysPressed[i]);
        if (!continuePressed)
            break;
    }

    // Update the top of the stack
    $gameStack.update();

    $elapsedTime = new Date().getTime() - $lastUpdateTime;
    $averageElapsedTime = ($averageElapsedTime + $elapsedTime) / 2;
    $lastUpdateTime = new Date().getTime();
}

// -------------------------------------------------------

/** First key press handle for the current stack.
*   @param {number} key The key ID pressed.
*/
function onKeyPressed(key){
    $gameStack.onKeyPressed(key);
}

// -------------------------------------------------------

/** First key release handle for the current stack.
*   @param {number} key The key ID released.
*/
function onKeyReleased(key){
    $gameStack.onKeyReleased(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack.
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
function onKeyPressedRepeat(key){
    return $gameStack.onKeyPressedRepeat(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack, but with
*   a small wait after the first pressure (generally used for menus).
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
function onKeyPressedAndRepeat(key){
    return $gameStack.onKeyPressedAndRepeat(key);
}

// -------------------------------------------------------

/** Draw the 3D for the current stack.
*   @param {Canvas} canvas The 3D canvas.
*/
function draw3D(canvas){
    $gameStack.draw3D(canvas);
}

// -------------------------------------------------------

/** Draw HUD for the current stack.
*   @param {Canvas} canvas The HUD canvas.
*/
function drawHUD(loading) {

    if ($requestPaintHUD) {
        $requestPaintHUD = false;
        $context.clearRect(0, 0, $canvasWidth, $canvasHeight);
        $context.lineWidth = 1;
        $context.webkitImageSmoothingEnabled = false;
        $context.imageSmoothingEnabled = false;
        if (loading) {
            $loadingScene.drawHUD();
        }
        else {
            $gameStack.drawHUD();
        }
    }
    $gameStack.displayingContent = !loading;
}
