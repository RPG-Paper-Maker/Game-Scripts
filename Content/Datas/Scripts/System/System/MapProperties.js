/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { THREE } from "../Globals.js";
import { Datas, System, Manager, Scene } from "../index.js";
import { PlaySong } from "./PlaySong.js";
import { DynamicValue } from "./DynamicValue.js";
import { MapObject } from "../Core/MapObject.js";
import { Enum, Constants } from "../Common/index.js";
var SongKind = Enum.SongKind;
var PictureKind = Enum.PictureKind;
/** @class
 *  The properties of a map.
 *  @extends System.Base
 */
class MapProperties extends Base {
    constructor() {
        super();
        this.sceneBackground = null;
        this.skyboxGeometry = null;
    }
    /**
     *  Read the JSON associated to the map properties.
     *  @param {Record<string, any>} - json Json object describing the map
     *  properties
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;
        // Tileset: if not existing, by default select the first one
        this.tileset = Datas.Tilesets.get(json.tileset);
        this.music = new PlaySong(SongKind.Music, json.music);
        this.backgroundSound = new PlaySong(SongKind.BackgroundSound, json.bgs);
        this.cameraProperties = Datas.Systems.getCameraProperties(DynamicValue
            .readOrDefaultDatabase(json.cp, 1).getValue());
        this.isBackgroundColor = json.isky;
        this.isBackgroundImage = json.isi;
        if (this.isBackgroundColor) {
            this.backgroundColorID = new DynamicValue(json.sky);
        }
        else if (this.isBackgroundImage) {
            this.backgroundImageID = json.ipid;
            this.updateBackgroundImage();
        }
        else {
            this.backgroundSkyboxID = DynamicValue.readOrDefaultDatabase(json
                .sbid);
            this.updateBackgroundSkybox();
        }
        this.updateBackgroundColor();
        var startupReactions = new System.MapObject(json.so);
        this.startupObject = new MapObject(startupReactions);
        this.startupObject.changeState();
    }
    /**
     *  Update the background color
     */
    updateBackgroundColor() {
        this.backgroundColor = Datas.Systems.getColor(this.isBackgroundColor ?
            this.backgroundColorID.getValue() : 1);
    }
    /**
     *  Update the background image
     */
    updateBackgroundImage() {
        let bgMat = Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas.Pictures.get(PictureKind.Pictures, this.backgroundImageID)
            .getPath()), { flipY: true });
        bgMat.depthTest = false;
        bgMat.depthWrite = false;
        this.sceneBackground = new THREE.Scene();
        this.cameraBackground = new THREE.Camera();
        this.sceneBackground.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), bgMat));
    }
    /**
     *  Update the background skybox
     */
    updateBackgroundSkybox() {
        let size = 10000 * Datas.Systems.SQUARE_SIZE / Constants
            .BASIC_SQUARE_SIZE;
        this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
        Scene.Map.current.scene.add(new THREE.Mesh(this.skyboxGeometry, Datas
            .Systems.getSkybox(this.backgroundSkyboxID.getValue()).createTextures()));
    }
}
export { MapProperties };
