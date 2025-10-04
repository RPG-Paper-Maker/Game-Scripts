/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Inputs, Platform } from './Common';
import { Data, Manager } from './index';

/**
 * The main class who boot and loop everything's
 *
 * @export
 * @class Main
 */
export class Main {
	static clock = new THREE.Clock();
	static clockFPS = new THREE.Clock();
	static delta = 0;
	static maxFPS: number = 60;
	static FPS: number = 0;
	static loaded: boolean = false;
	static frames: number = 0;
	static time: number = 0;

	constructor() {
		throw new Error('This is a static class');
	}

	static async initialize() {
		await Data.Settings.checkIsProtected();
		await Manager.Plugins.load();
		Inputs.initialize();
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
		await Data.Languages.read();
		await Data.Settings.read();
		await Data.Systems.read();
		await Data.Variables.read();
		await Manager.GL.load();
		await Data.Pictures.read();
		await Data.Songs.read();
		await Data.Videos.read();
		await Data.Shapes.read();
		Manager.GL.initialize();
		Manager.GL.resize();
		Manager.Collisions.initialize();
		await Data.SpecialElements.read();
		await Data.Tilesets.read();
		await Data.Status.read();
		await Data.Items.read();
		await Data.Skills.read();
		await Data.Weapons.read();
		await Data.Armors.read();
		await Data.Classes.read();
		await Data.Heroes.read();
		await Data.Monsters.read();
		await Data.Troops.read();
		await Data.BattleSystems.read();
		await Data.TitlescreenGameover.read();
		await Data.Keyboards.read();
		await Data.Animations.read();
		await Data.CommonEvents.read();
		Data.Systems.getModelHero();
		await Data.Systems.loadWindowSkins();
		await Main.onEndLoading();
	}

	/**
	 * exporting function for let control to the user when the loading ended
	 *
	 * @export
	 */
	static async onEndLoading() {
		switch (Platform.MODE_TEST) {
			case Platform.MODE_TEST_BATTLE_TROOP:
				await Manager.Stack.pushBattleTest();
				break;
			case Platform.MODE_TEST_SHOW_TEXT_PREVIEW:
				await Manager.Stack.pushShowTextPreview();
				break;
			default:
				Manager.Stack.pushTitleScreen();
				break;
		}
		Main.loaded = true;
		Manager.Stack.requestPaintHUD = true;
	}

	/**
	 *  Main loop of the game.
	 */
	static loop() {
		requestAnimationFrame(Main.loop);
		Main.delta += Main.clock.getDelta();
		if (Main.delta > 1 / Main.maxFPS) {
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
			Manager.Stack.elapsedTime = new Date().getTime() - Manager.Stack.lastUpdateTime;
			Manager.Stack.averageElapsedTime = (Manager.Stack.averageElapsedTime + Manager.Stack.elapsedTime) / 2;
			Manager.Stack.lastUpdateTime = new Date().getTime();
			Main.frames++;
			Main.time += Main.clockFPS.getDelta();
			if (Main.time >= 1) {
				Main.FPS = Main.frames;
				Main.frames = 0;
				Main.time = Main.time % 1;
			}
			Main.delta = Main.delta % (1 / Main.maxFPS);
		}
	}
}

// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------

Main.initialize().catch(console.error);

// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------

requestAnimationFrame(Main.loop);
