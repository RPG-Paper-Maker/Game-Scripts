/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Manager } from "./index";
import { Utils, KeyEvent, Platform } from "./Common";

/**
 * The main class who boot and loop everything's
 *
 * @export
 * @class Main
 */
export class Main {

    static loaded = false;

    constructor() {
        throw new Error("This is a static class");
    }

    static async initialize() {
        Datas.Settings.checkIsDevMode();
        await Manager.Plugins.load();
        Manager.Stack.loadingDelay = 0;
        Manager.Songs.initialize();
        Manager.Stack.clearHUD();
        await Main.load();
    }
    
    /**
     * Load the game stack and datas
     *
     * @static
     * @memberof Main
     */
    static async load() {
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
        Main.onEndLoading();
    }

    /**
     * exporting function for let control to the user when the loading ended
     *
     * @export
     */
    static onEndLoading() {
        Manager.Stack.pushTitleScreen();
        Main.loaded = true;
        Manager.Stack.requestPaintHUD = true;
    };

    /** 
     *  Main loop of the game.
     */
    static loop() {
        requestAnimationFrame(Main.loop);

        // Update if everything is loaded
        if (Main.loaded) {
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

}

// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------

Utils.tryCatch(Main.initialize);

// -------------------------------------------------------
//
// INPUTS CONFIG
//
// -------------------------------------------------------

document.addEventListener('keydown', function (event) {
    if (Main.loaded && !Manager.Stack.isLoading()) {
        let key = event.keyCode;

        // On pressing F12, quit game
        if (key === KeyEvent.DOM_VK_F12) {
            Platform.quit();
        }
        // If not repeat, call simple press RPM event
        if (!event.repeat) {
            if (KeyEvent.keysPressed.indexOf(key) === -1) {
                KeyEvent.keysPressed.push(key);
                Manager.Stack.onKeyPressed(key);
                // If is loading, that means a new scene was created, return
                if (Manager.Stack.isLoading()) {
                    return;
                }
            }
        }

        // Also always call pressed and repeat RPM event
        Manager.Stack.onKeyPressedAndRepeat(key);
    }
}, false);

// -------------------------------------------------------

document.addEventListener('keyup', function (event) {
    if (Main.loaded && !Manager.Stack.isLoading()) {
        let key = event.keyCode;
        // Remove this key from pressed keys list
        KeyEvent.keysPressed.splice(KeyEvent.keysPressed.indexOf(key), 1);

        // Call release RPM event
        Manager.Stack.onKeyReleased(key);
    } else {
        KeyEvent.keysPressed = [];
    }
}, false);

// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------

requestAnimationFrame(Main.loop);