/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
const THREE = require('./Content/Datas/Scripts/Libs/three.js');

/** @class
 *  The system color class.
 *  @extends {System.Base} 
 *  @property {number} red The red color between 0 and 255
 *  @property {number} green The green color between 0 and 255
 *  @property {number} blue The blue color between 0 and 255
 *  @property {number} alpha The alpha value between 0 and 1
 *  @property {string} rgb The rgb value used for ctx
 *  @property {THREE.Color} color The three.js color
 *  @param {Record<string, any>} [json=undefined] Json object describing the color
 */
class Color extends Base {
    
    public static white = Color.createColor(255, 255, 255);
    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;
    public rgb: string;
    public color: typeof THREE.Color

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Create a new color according to RGBA values.
     *  @static
     *  @param {number} r The red color between 0 and 255
     *  @param {number} g The green color between 0 and 255
     *  @param {number} b The blue color between 0 and 255
     *  @param {number} a The alpha value between 0 and 255
     *  @returns {Color}
     */
    static createColor(r: number, g: number, b: number, a?: number): Color {
        let color = new Color();
        color.initialize(r, g, b, a);
        return color;
    }

    /** 
     *  Used for mixing vectors according to alpha in getHex algorithm.
     *  @static
     *  @param {THREE.Vector3} x The x position
     *  @param {THREE.Vector3} y The y position
     *  @param {number} aThe alpha value between 0 and 1
     *  @returns {THREE.Vector3}
     */
    static mix(x: typeof THREE.Vector3, y: typeof THREE.Vector3, a: number): 
        typeof THREE.Vector3
    {
        return x.clone().multiplyScalar(1 - a).add(y.clone().multiplyScalar(a));
    }

    /** 
     *  Initialize the color according to RGBA values.
     *  @param {number} r The red color between 0 and 255
     *  @param {number} g The green color between 0 and 255
     *  @param {number} b The blue color between 0 and 255
     *  @param {number} a The alpha value between 0 and 255
     */
    initialize(r: number, g: number, b: number, a: number = 255) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a / 255;
        this.rgb = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        this.color = new THREE.Color(this.rgb);
    }


    /** 
     *  Read the JSON associated to the color.
     *  @param {Record<string, any>} json Json object describing the color
     */
    read(json: Record<string, any>) {
        this.initialize(json.r, json.g, json.b, json.a);
    }


    /** 
     *  Get the hex value of the color.
     *  @param {THREE.Vector4} tone The tone value
     *  @returns {number}
     */
    getHex(tone: typeof THREE.Vector4): number {
        if (tone) {
            let rgb = new THREE.Vector3(Math.max(Math.min(this.color.r + tone.x,
                1), -1), Math.max(Math.min(this.color.g + tone.y, 1), -1), Math
                .max(Math.min(this.color.b + tone.z, 1), -1));
            let w = new THREE.Vector3(0.2125, 0.7154, 0.0721);
            let intensity = rgb.dot(w);
            let m = Color.mix(new THREE.Vector3(intensity, intensity,
                intensity), rgb, tone.w);
            return new THREE.Color(Math.min(Math.max(0, m.x), 1), Math.min(Math
                .max(0, m.y), 1), Math.min(Math.max(0, m.z), 1)).getHex();
        }
        return this.color.getHex();
    }
}

export { Color }