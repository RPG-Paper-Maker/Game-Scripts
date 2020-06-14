/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  [MAIN]
//
//  Main file that always needs to be on the bottom of the other scripts.
//  Contains all the global functions and variables.
//
// -------------------------------------------------------

/** Initialize the game stack and datas.
*/
RPM.initialize = function()
{
    RPM.songsManager = new SongsManager();
    RPM.settings = new Settings();
    RPM.gameStack = new GameStack();
}

// -------------------------------------------------------

/** Initialize the openGL stuff.
*/
RPM.initializeGL = function()
{
    // Create the renderer
    RPM.renderer = new THREE.WebGLRenderer({antialias: RPM.datasGame.system
        .antialias, alpha: true});
    RPM.renderer.setSize(RPM.canvasWidth, RPM.canvasHeight);
    if (RPM.datasGame.system.antialias)
    {
        RPM.renderer.setPixelRatio(2);
    }
    Platform.canvas3D.appendChild(RPM.renderer.domElement);
}

// -------------------------------------------------------

/** Set the camera aspect while resizing the window.
*   @param {Canvas} canvas The 3D canvas.
*/
RPM.resizeGL = function(canvas)
{
    RPM.renderer.setSize(RPM.canvasWidth, RPM.canvasHeight);
    var camera = RPM.gameStack.camera;
    if (typeof camera !== 'undefined'){
        camera.threeCamera.aspect = RPM.canvasWidth / RPM.canvasHeight;
        camera.threeCamera.updateProjectionMatrix();
    }
}

// -------------------------------------------------------

/** Update the current stack.
*/
RPM.update = function()
{
    // Update game timer
    if (RPM.game)
    {
        RPM.game.playTime.update();
    }

    // Update songs manager
    RPM.songsManager.update();

    // Repeat keypress as long as not blocking
    var continuePressed = true;
    var key;
    for (var i = 0, l = RPM.keysPressed.length; i < l; i++){
        key = RPM.keysPressed[i];
        continuePressed = RPM.onKeyPressedRepeat(RPM.keysPressed[i]);
        if (!continuePressed)
        {
            break;
        }
    }

    // Update the top of the stack
    RPM.gameStack.update();

    RPM.elapsedTime = new Date().getTime() - RPM.lastUpdateTime;
    RPM.averageElapsedTime = (RPM.averageElapsedTime + RPM.elapsedTime) / 2;
    RPM.lastUpdateTime = new Date().getTime();
}

// -------------------------------------------------------

/** First key press handle for the current stack.
*   @param {number} key The key ID pressed.
*/
RPM.onKeyPressed = function(key)
{
    RPM.gameStack.onKeyPressed(key);
}

// -------------------------------------------------------

/** First key release handle for the current stack.
*   @param {number} key The key ID released.
*/
RPM.onKeyReleased = function(key)
{
    RPM.gameStack.onKeyReleased(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack.
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
RPM.onKeyPressedRepeat = function(key)
{
    return RPM.gameStack.onKeyPressedRepeat(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack, but with
*   a small wait after the first pressure (generally used for menus).
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
RPM.onKeyPressedAndRepeat = function(key)
{
    return RPM.gameStack.onKeyPressedAndRepeat(key);
}

// -------------------------------------------------------

/** Draw the 3D for the current stack.
*   @param {Canvas} canvas The 3D canvas.
*/
RPM.draw3D = function()
{
    RPM.gameStack.draw3D();
}

// -------------------------------------------------------

/** Draw HUD for the current stack.
*   @param {Canvas} canvas The HUD canvas.
*/
RPM.drawHUD = function(loading)
{

    if (RPM.requestPaintHUD)
    {
        RPM.requestPaintHUD = false;
        Platform.ctx.clearRect(0, 0, RPM.canvasWidth, RPM.canvasHeight);
        Platform.ctx.lineWidth = 1;
        Platform.ctx.webkitImageSmoothingEnabled = false;
        Platform.ctx.imageSmoothingEnabled = false;
        if (loading) 
        {
            if (RPM.loadingScene) 
            {
                RPM.loadingScene.drawHUD();
            }
        }
        else {
            RPM.gameStack.drawHUD();
        }
    }
    RPM.gameStack.displayingContent = !loading;
}

// -------------------------------------------------------

/** Main loop of the game.
*/

RPM.loop = function()
{
    requestAnimationFrame(RPM.loop);

    // Loading datas game
    if (RPM.datasGame && !RPM.datasGame.loaded) 
    {
        RPM.datasGame.updateLoadings();
        RPM.drawHUD(true);
        return;
    }
    if (!RPM.isLoading()) 
    {
        if (!RPM.gameStack.isEmpty()) 
        {
            // Callbacks
            var callback = RPM.gameStack.top().callBackAfterLoading;
            if (callback === null) 
            {
                RPM.update();
                callback = RPM.gameStack.top().callBackAfterLoading;
                if (callback === null) 
                {
                    RPM.draw3D();
                    RPM.drawHUD(false);
                }
            } else 
            {
                if (!RPM.gameStack.top().isBattleMap) 
                {
                    RPM.renderer.clear();
                    RPM.drawHUD(true);
                }
                if (callback) 
                {
                    RPM.gameStack.top().callBackAfterLoading = undefined;
                    callback.call(RPM.gameStack.top());
                }
            }
        }
        else {
            RPM.gameStack.pushTitleScreen();
        }
    }
}

// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------

RPM.initialize();

// -------------------------------------------------------
//
// INPUTS
//
// -------------------------------------------------------

document.addEventListener('keydown', function(event) {
    if (RPM.datasGame.loaded && !RPM.isLoading() && RPM.gameStack
        .displayingContent && !RPM.gameStack.top().callBackAfterLoading)
    {
        let key = event.keyCode;
        // On pressing F12, quit game
        if (key === KeyEvent.DOM_VK_F12)
        {
            Platform.quit();
        }
        // If not repeat, call simple press RPM event
        if (!event.repeat)
        {
            if (RPM.keysPressed.indexOf(key) === -1)
            {
                RPM.keysPressed.push(key);
                RPM.onKeyPressed(key);
            }
        }

        // Also always call pressed and repeat RPM event
        RPM.onKeyPressedAndRepeat(key);
    }
}, false);
document.addEventListener('keyup', function(event) 
{
    if (RPM.datasGame.loaded && !RPM.isLoading() && RPM.gameStack
        .displayingContent && !RPM.gameStack.top().callBackAfterLoading)
    {
        let key = event.keyCode;
        // Remove this key from pressed keys list
        RPM.keysPressed.splice(RPM.keysPressed.indexOf(key), 1);

        // Call release RPM event
        RPM.onKeyReleased(key);
    } else 
    {
        RPM.keysPressed = [];
    }
}, false);

// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------

requestAnimationFrame(RPM.loop);