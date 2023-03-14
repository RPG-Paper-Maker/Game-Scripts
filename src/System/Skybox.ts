/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
     *  @returns {THREE.MeshPhongMaterial[]} 
     */
    createTextures(): THREE.MeshBasicMaterial[] {
        return [this.left, this.right, this.top, this.bot, this.front, this.back]
            .map(side => { 
                const texture = Manager.GL.textureLoader.load(Datas.Pictures.get(
                    PictureKind.Skyboxes, side).getPath());
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.x = - 1;
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;
                return new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            });
    }
}

export { Skybox }