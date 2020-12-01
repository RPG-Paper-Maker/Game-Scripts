/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Stack } from "./Manager/index.js";
/** Initialize the game stack and datas
*/
function initialize() {
    /*
    RPM.songsManager = new SongsManager();
    RPM.settings = new Settings();
    RPM.datasGame = new DatasGame();*/
    Stack.loadingDelay = 0;
    //Stack.clearHUD();
}
/** Load the game stack and datas
 */
async function load() {
    //await RPM.settings.read();
    //await RPM.datasGame.read();
    //RPM.gameStack.pushTitleScreen();
    //RPM.datasGame.loaded = true;
    //Stack.requestPaintHUD = true;
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
    //Stack.elapsedTime = new Date().getTime() - Stack.lastUpdateTime;
    //Stack.averageElapsedTime = (Stack.averageElapsedTime + Stack.elapsedTime) / 
    //    2;
    //Stack.lastUpdateTime = new Date().getTime();
}
