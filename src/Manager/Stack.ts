/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from "..";
import { Utils, Platform, ScreenResolution } from "../Common";
import { Game } from "../Core";

/** @class
 *  The game stack that is organizing the game scenes.
 *  @property {Scene.Base[]} content The stack content
 *  @property {Scene.Base} top The stack top content
 *  @property {Scene.Base} subTop The stack top - 1 content
 *  @property {Scene.Base} bot The stack bot content
 */
class Stack {

    public static top: Scene.Base = null;
    public static subTop: Scene.Base = null;
    public static bot: Scene.Base = null;
    public static content: Scene.Base[] = [];
    public static requestPaintHUD: boolean = false;
    public static sceneLoading: Scene.Loading;
    public static loadingDelay = 0;
    public static elapsedTime = 0;
    public static averageElapsedTime = 0;
    public static lastUpdateTime = new Date().getTime();
    public static game: Game;

    constructor() {
        throw new Error("This is a static class");
    }

    /** 
     *  Push a new scene in the stack.
     *  @param {Scene.Base} scene The scene to push
     */
    static push(scene: Scene.Base) {
        this.content.push(scene);
        this.top = scene;
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        this.requestPaintHUD = true;
    }

    /** 
     *  Pop (remove) the last scene in the stack.
     *  @returns {Scene.Base} The last scene that is removed
     */
    static pop(): Scene.Base {
        let scene = this.content.pop();
        this.top = this.at(this.content.length - 1);
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        scene.close();
        this.requestPaintHUD = true;
        return scene;
    }

    /** 
     *  Pop (remove) all the scene in the stack.
     *  @returns Scene.Base
     */
    static popAll(): Scene.Base {
        let scene: Scene.Base;
        for (let i = this.content.length - 1; i >= 0; i--) {
            scene = this.content.pop();
            scene.close();
        }
        this.top = null;
        this.subTop = null;
        this.bot = null;
        this.requestPaintHUD = true;
        return scene;
    }

    /** 
     *  Replace the last scene in the stack by a new scene.
     *  @param {SceneGame} scene The scene to replace
     *  @returns {SceneGame} The last scene that is replaced
     */
    static replace(scene: Scene.Base): Scene.Base {
        let pop = this.pop();
        this.push(scene);
        return pop;
    }

    /** 
     *  Get the scene at a specific index in the stack. 0 is the bottom of the
     *  stack.
     *  @param {number} i Index in the stack
     *  @returns {SceneGame} The scene in the index of the stack
     */
    static at(i: number): Scene.Base {
        return Utils.defaultValue(this.content[i], null);
    }

    /** 
     *  Check if the stack is empty
     *  @returns {boolean}
     */
    static isEmpty(): boolean {
        return this.top === null;
    }

    /** 
     *  Check if top content is loading
     *  @returns {boolean}
     */
    static isLoading(): boolean {
        return this.isEmpty() || this.top.loading;
    }

    /** 
     *  Push the title screen when empty
     *  @returns {SceneTitleScreen}
     */
    static pushTitleScreen() {
        /*
        let scene = new SceneTitleScreen();
        this.push(scene);
        return scene;
        *
         */
    }

    /** 
     *  Clear the HUD canvas.
     */
    static clearHUD() {
        Platform.ctx.clearRect(0, 0, ScreenResolution.CANVAS_WIDTH, ScreenResolution
        .CANVAS_HEIGHT);
        Platform.ctx.lineWidth = 1;
        Platform.ctx.imageSmoothingEnabled = false;
    }

    /** 
     *  Update the stack.
     */
    static update() {
        // Update game timer if there's a current game
        /*
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
        }*/
        this.top.update();
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {number} key The key ID pressed
     */
    static onKeyPressed(key: number) {
        if (!this.isEmpty()) {
            this.top.onKeyPressed(key);
        }
    }

    /** 
     *  First key release handle for the current stack.
     *  @param {number} key The key ID released
     */
    static onKeyReleased(key: number) {
        if (!this.isEmpty()) {
            this.top.onKeyReleased(key);
        }
    }

    /** 
     *  Key pressed repeat handle for the current stack.
     *  @param {number} key The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    static onKeyPressedRepeat(key: number): boolean {
        return this.isEmpty() ? true : this.top.onKeyPressedRepeat(key);
    }

    /** 
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {number} key The key ID pressed
     *  @returns {boolean} false if the other keys are blocked after it
     */
    static onKeyPressedAndRepeat(key: number): boolean {
        return this.isEmpty() ? true : this.top.onKeyPressedAndRepeat(key);
    }

    /** 
     *  Draw the 3D for the current stack.
     */
    static draw3D() {
        if (!this.isEmpty()) {
            this.top.draw3D();
        }
    }

    /** 
     *  Draw HUD for the current stack.
     */
    static drawHUD() {
        if (this.requestPaintHUD)
        { 
            if (this.isLoading() && this.sceneLoading) 
            {
                this.loadingDelay += this.elapsedTime;
                if (this.loadingDelay >= Scene.Loading.MIN_DELAY)
                {
                    this.requestPaintHUD = false;
                    this.sceneLoading.drawHUD();
                }
            } else
            {
                this.requestPaintHUD = false;
                this.loadingDelay = 0;
                this.clearHUD();
                if (!this.isEmpty()) {
                    // Display < 0 index image command
                    /*
                    let i, l, v;
                    for (i = 0, l = RPM.displayedPictures.length; i < l; i++) {
                        v = RPM.displayedPictures[i];
                        if (v[0] >= 0) {
                            break;
                        }
                        v[1].draw();
                    }*/
        
                    // Draw System HUD
                    this.top.drawHUD();
        
                    // Display >= 0 index image command
                    /*
                    for (; i < l; i++) {
                        RPM.displayedPictures[i][1].draw();
                    }*/
                }
            }
        }
    }
}

export { Stack };