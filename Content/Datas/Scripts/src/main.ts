/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Manager } from ".";
import { Utils } from "./Common";

let loadedDatas = false;

/** 
 *  Initialize the game stack and datas.
 */
function initialize() {
    Manager.Stack.loadingDelay = 0;
    Manager.Stack.clearHUD();
}

/** 
 *  Load the game stack and datas.
 */
async function load() {
    await Datas.Settings.read();
    await Datas.Systems.read();
    await Datas.Variables.read();
    await Datas.Pictures.read();
    await Datas.Songs.read();
    await Datas.Videos.read();
    await Datas.Shapes.read();
    Manager.GL.load();
    Manager.GL.initialize();
    Manager.GL.resize();
    await Datas.SpecialElements.read();
    await Datas.Tilesets.read();
    await Datas.Items.read();
    await Datas.Skills.read();
    await Datas.Weapons.read();
    await Datas.Armors.read();
    await Datas.Classes.read();
    await Datas.Heroes.read();
    await Datas.Monsters.read();
    await Datas.Troops.read();
    await Datas.BattleSystems.read();
    await Datas.TitlescreenGameover.read();
    await Datas.Keyboards.read();
    await Datas.Animations.read();
    await Datas.CommonEvents.read();
    await Datas.Systems.getModelHero();
    await Datas.Systems.loadWindowSkins();
    Manager.Stack.pushTitleScreen();
    loadedDatas = true;
    Manager.Stack.requestPaintHUD = true;
}

/** 
 *  Main loop of the game.
 */
function loop() {
    requestAnimationFrame(loop);

    // Update if everything is loaded
    if (loadedDatas) {
        if (!Manager.Stack.isLoading()) {
            Manager.Stack.update();
        }
        if (!Manager.Stack.isLoading()) {
            Manager.Stack.draw3D();
        }
    }
    Manager.Stack.drawHUD();

    // Elapsed time
    Manager.Stack.elapsedTime = new Date().getTime() - Manager.Stack
        .lastUpdateTime;
    Manager.Stack.averageElapsedTime = (Manager.Stack.averageElapsedTime + 
        Manager.Stack.elapsedTime) / 2;
    Manager.Stack.lastUpdateTime = new Date().getTime();
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

document.addEventListener('keydown', function(event)
{
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

document.addEventListener('keyup', function(event) 
{
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