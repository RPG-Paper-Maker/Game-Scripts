/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Stack } from "./Manager/index.js";
import { Utils } from "./Common/Utils.js";
import { Datas } from "./index.js";
let loadedDatas = false;
/** Initialize the game stack and datas
*/
function initialize() {
    //RPM.songsManager = new SongsManager();
    Stack.loadingDelay = 0;
    Stack.clearHUD();
}
/** Load the game stack and datas
 */
async function load() {
    console.log("ok");
    await Datas.Settings.read();
    //await RPM.datasGame.read();
    //RPM.gameStack.pushTitleScreen();
    //RPM.datasGame.loaded = true;
    Stack.requestPaintHUD = true;
}
/** Initialize the openGL stuff
 */
function initializeGL() {
    // Create the renderer
    /*
    RPM.renderer = new THREE.WebGLRenderer({antialias: RPM.datasGame.system
        .antialias, alpha: true});
    RPM.renderer.autoClear = false;
    RPM.renderer.setSize(RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
    if (RPM.datasGame.system.antialias)
    {
        RPM.renderer.setPixelRatio(2);
    }
    Platform.canvas3D.appendChild(RPM.renderer.domElement);*/
}
/** Set the camera aspect while resizing the window
 */
function resizeGL() {
    /*
    RPM.renderer.setSize(RPM.CANVAS_WIDTH, RPM.CANVAS_HEIGHT);
    let camera = RPM.gameStack.camera;
    if (!RPM.isUndefined(camera))
    {
        camera.threeCamera.aspect = RPM.CANVAS_WIDTH / RPM.CANVAS_HEIGHT;
        camera.threeCamera.updateProjectionMatrix();
    }*/
}
/** Main loop of the game
 */
function loop() {
    requestAnimationFrame(loop);
    // Update if everything is loaded
    /*
    if (RPM.datasGame.loaded)
    {
        if (!RPM.gameStack.isLoading())
        {
            Stack.update();
        }
        if (!Stack.isLoading())
        {
            Stack.draw3D();
        }
    }*/
    //Stack.drawHUD();
    // Elapsed time
    Stack.elapsedTime = new Date().getTime() - Stack.lastUpdateTime;
    Stack.averageElapsedTime = (Stack.averageElapsedTime + Stack.elapsedTime) /
        2;
    Stack.lastUpdateTime = new Date().getTime();
}
// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------
initialize();
// -------------------------------------------------------
//
// INPUTS CONFIG
//
// -------------------------------------------------------
document.addEventListener('keydown', function (event) {
    /*
    if (RPM.datasGame.loaded && !RPM.gameStack.isLoading())
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
                // If is loading, that means a new scene was created, return
                if (RPM.gameStack.isLoading())
                {
                    return;
                }
            }
        }

        // Also always call pressed and repeat RPM event
        RPM.onKeyPressedAndRepeat(key);
    }*/
}, false);
// -------------------------------------------------------
document.addEventListener('keyup', function (event) {
    /*
    if (RPM.datasGame.loaded && !RPM.gameStack.isLoading())
    {
        let key = event.keyCode;
        // Remove this key from pressed keys list
        RPM.keysPressed.splice(RPM.keysPressed.indexOf(key), 1);

        // Call release RPM event
        RPM.onKeyReleased(key);
    } else
    {
        RPM.keysPressed = [];
    }*/
}, false);
// -------------------------------------------------------
//
// START LOADING GAME FILES
//
// -------------------------------------------------------
Utils.tryCatch(load);
// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------
requestAnimationFrame(loop);
