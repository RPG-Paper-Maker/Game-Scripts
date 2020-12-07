/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../../Libs/index.js";
import { Datas } from "../index.js";
import { ScreenResolution, Platform, Utils, IO, Paths } from "../Common/index.js";
import { Stack } from "./Stack.js";
/** @class
 *  The GL class handling some 3D stuff.
 */
class GL {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Initialize the openGL stuff.
     *  @static
     */
    static initialize() {
        this.renderer = new THREE.WebGLRenderer({ antialias: Datas.Systems
                .antialias, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        if (Datas.Systems.antialias) {
            this.renderer.setPixelRatio(2);
        }
        Platform.canvas3D.appendChild(this.renderer.domElement);
    }
    /**
     *  Load shaders stuff.
     *  @static
     */
    static async load() {
        // Shaders
        let json = await IO.openFile(Paths.SHADERS + "fix.vert");
        this.SHADER_FIX_VERTEX = json;
        json = await IO.openFile(Paths.SHADERS + "fix.frag");
        this.SHADER_FIX_FRAGMENT = json;
    }
    /**
     *  Set the camera aspect while resizing the window.
     *  @static
     */
    static resize() {
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        let camera;
        for (let i = 0, l = Stack.content.length; i < l; i++) {
            camera = Stack.content[i].camera;
            if (!Utils.isUndefined(camera)) {
                camera.resizeGL();
            }
        }
    }
}
export { GL };
