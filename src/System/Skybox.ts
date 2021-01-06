/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { THREE } from "../Globals";
import { Base } from "./Base"
import { Utils, Enum } from "../Common";
import { Manager, Datas } from "../index";
import PictureKind = Enum.PictureKind;

/** @class
 *  A skybox of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  skybox
 */
class Skybox extends Base {
    
    public front: number;
    public back: number;
    public top: number;
    public bot: number;
    public left: number;
    public right: number;

    constructor(json?: Record<string, any>) {
        super(json)
    }

    /** 
     *  Read the JSON associated to the skybox.
     *  @param {Record<string, any>} - json Json object describing the skybox
     */
    read(json: Record<string, any>) {
        this.front = Utils.defaultValue(json.fid, 1);
        this.back = Utils.defaultValue(json.bid, 1);
        this.top = Utils.defaultValue(json.tid, 1);
        this.bot = Utils.defaultValue(json.boid, 1);
        this.left = Utils.defaultValue(json.lid, 1);
        this.right = Utils.defaultValue(json.rid, 1);
    }
    
    /** 
     *  Create the textures for the background
     *  @returns {THREE.ShaderMaterial[]} 
     */
    createTextures(): THREE.ShaderMaterial[] {
        return [
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.left).getPath()), { 
                flipY: true, flipX: true }),
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.right).getPath()), { 
                flipY: true, flipX: true }),
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.top).getPath()), { 
                flipY: true, flipX: true }),
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.bot).getPath()), { 
                flipY: true, flipX: true }),
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.front).getPath()), { 
                flipY: true, flipX: true }),
            Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas
                .Pictures.get(PictureKind.Skyboxes, this.back).getPath()), { 
                flipY: true, flipX: true })
        ];
    }
}

export { Skybox }