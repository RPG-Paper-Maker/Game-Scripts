/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../../Libs";
import { Datas, System } from "..";
import { ScreenResolution, Platform, Utils, IO, Paths } from "../Common";
import { Stack } from "./Stack";
import { Camera } from "../Core";

/** @class
 *  The GL class handling some 3D stuff.
 */
class GL {
    public static SHADER_FIX_VERTEX: string;
    public static SHADER_FIX_FRAGMENT: string;
    public static renderer: THREE.WebGLRenderer;
    public static textureLoader = new THREE.TextureLoader();
    public static screenTone: THREE.Vector4;

    constructor() {
        throw new Error("This is a static class");
    }

    /** 
     *  Initialize the openGL stuff.
     *  @static
     */
    static initialize() {
        this.renderer = new THREE.WebGLRenderer({antialias: Datas.Systems
            .antialias, alpha: true});
        this.renderer.autoClear = false;
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        if (Datas.Systems.antialias)
        {
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
        let json = await IO.openFile(Paths.SHADERS + "fix.vert")
        this.SHADER_FIX_VERTEX = json;
        json = await IO.openFile(Paths.SHADERS + "fix.frag")
        this.SHADER_FIX_FRAGMENT = json;
    }

    /** 
     *  Set the camera aspect while resizing the window.
     *  @static
     */
    static resize() {
        this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution
            .CANVAS_HEIGHT, true);
        let camera: Camera;
        for (let i = 0, l = Stack.content.length; i < l; i++) {
            camera = Stack.content[i].camera;
            if (!Utils.isUndefined(camera))
            {
                camera.resizeGL();
            }
        }
    }

    /** 
     *  Load a texture.
     *  @param {string} path The path of the texture
     *  @returns {Promise<THREE.MeshStandardMaterial>}
     */
    static async loadTexture(path: string): Promise<THREE.MeshStandardMaterial> {
        let texture: THREE.Texture = await (new Promise((resolve, reject) => {
            this.textureLoader.load(path,
                (t: THREE.Texture) => {
                    resolve(t);
                },
                () => {},
                () => {
                    Platform.showErrorMessage("Could not load " + path);
                }
            );
        }));
        return this.createMaterial(texture);
    }

    /** 
     *  Load a texture empty.
     *  @returns {THREE.MeshStandardMaterial}
     */
    static loadTextureEmpty(): THREE.MeshStandardMaterial {
        // @ts-ignore
        return new THREE.MeshBasicMaterial(
        {
            transparent: true,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading,
            alphaTest: 0.5
        });
    }

    /** 
     *  Create a material from texture.
     *  @returns {THREE.MeshStandardMaterial}
     */
    static createMaterial(texture: THREE.Texture, opts: { flipX?: boolean, 
        flipY?: boolean, uniforms?: Record<string, any> } = {}): THREE
        .MeshStandardMaterial
    {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = opts.flipY;
        if (!opts.uniforms) {
            opts.uniforms = {
                texture: { type: "t", value: texture },
                colorD: { type: "v4", value: this.screenTone },
                reverseH: { type: "b", value: opts.flipX },
            };
        }
        let material = new THREE.ShaderMaterial({
            uniforms:       opts.uniforms,
            vertexShader:   this.SHADER_FIX_VERTEX,
            fragmentShader: this.SHADER_FIX_FRAGMENT,
            side: THREE.DoubleSide,
            transparent: false
        });
        // @ts-ignore
        material.map = texture;
        // @ts-ignore
        return material;
    }

    /** 
     *  Update the background color
     *  @static
     *  @param {System.Color} color
     */
    static updateBackgroundColor(color: System.Color) {
        this.renderer.setClearColor(color.getHex(this.screenTone), color.alpha);
    }
}

export { GL };