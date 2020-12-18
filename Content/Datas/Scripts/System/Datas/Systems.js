/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Platform, ScreenResolution, Utils, Constants, Enum } from "../Common";
import * as System from "../System";
import { Manager, Datas, Scene } from "..";
var SongKind = Enum.SongKind;
import { Position, MapPortion } from "../Core";
/** @class
*   All the System datas.
*   @property {SystemLang} projectName The project name
*   @property {boolean} antialias Indicate if there is antialiasing
*   @property {number} mountainCollisionHeight The height limit for collision
*   @property {number} mountainCollisionAngle The angle limit for collision
*   @property {SystemValue} mapFrameDuration Time in milliseconds for a frame
*   in map
*   @property {number} idMapStartHero Id of the map where the hero is in the
*   beginning of a game
*   @property {number} idObjectStartHero Id of the object where the hero is in
*   the beginning of a game
*   @property {boolean} showBB Indicate if the collision boxes
*   @property {string[]} itemsTypes List of all the types of items by ID
*   @property {SystemColor[]} colors List of all the colors by ID
*   @property {Currency[]} currencies List of all the currencies by ID
*   @property {SystemWindowSkin[]} windowSkins List of all the windowSkins by ID
*   @property {SystemCameraProperties[]} cameraProperties List of all the
*   camera properties by ID
*   @property {Detection[]} detections List of all the detections by ID
*   @property {SystemSkybox[]} skyboxes List of all the skyboxes by ID
*   @property {number[]} fontSizes List of all the font sizes by ID
*   @property {string[]} fontNames List of all the font names by ID
*   @property {number[]} speeds List of all the speeds by ID
*   @property {number[]} frequencies List of all the frequencies by ID
*   @property {SystemPlaySong} soundCursor The cursor sound
*   @property {SystemPlaySong} soundConfirmation The confirmation sound
*   @property {SystemPlaySong} soundCancel The cancel sound
*   @property {SystemPlaySong} soundImpossible The impossible sound
*   @property {EventCommand} dbOptions The window box options
*/
class Systems {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to System.
     *  @static
     */
    static async read() {
        let json = await IO.parseFileJSON(Paths.FILE_SYSTEM);
        // Project name
        this.projectName = new System.Translatable(json.pn);
        Platform.setWindowTitle(this.projectName.name());
        // Screen resolution + antialiasing
        let w = json.sw;
        let h = json.sh;
        let isScreenWindow = json.isw;
        if (!isScreenWindow) {
            w = Platform.screenWidth;
            h = Platform.screenHeight;
        }
        Platform.setWindowSize(w, h, !isScreenWindow);
        Platform.canvasHUD.width = w;
        Platform.canvasHUD.height = h;
        Platform.canvas3D.style.width = w;
        Platform.canvas3D.style.height = h;
        Platform.canvasVideos.height = h;
        ScreenResolution.CANVAS_WIDTH = w;
        ScreenResolution.CANVAS_HEIGHT = h;
        ScreenResolution.WINDOW_X = ScreenResolution.CANVAS_WIDTH /
            ScreenResolution.SCREEN_X;
        ScreenResolution.WINDOW_Y = ScreenResolution.CANVAS_HEIGHT /
            ScreenResolution.SCREEN_Y;
        this.antialias = Utils.defaultValue(json.aa, false);
        // Other numbers
        this.SQUARE_SIZE = json.ss;
        this.PORTIONS_RAY_NEAR = 3; // TODO: json.pr
        this.FRAMES = json.frames;
        this.mountainCollisionHeight = System.DynamicValue.readOrDefaultNumber(json.mch, 4);
        this.mountainCollisionAngle = System.DynamicValue
            .readOrDefaultNumberDouble(json.mca, 45);
        this.mapFrameDuration = System.DynamicValue.readOrDefaultNumber(json.mfd, 150);
        // Path BR
        this.PATH_BR = Paths.FILES + json.pathBR;
        // Path DLC
        this.PATH_DLCS = Paths.FILES + (await IO.parseFileJSON(Paths.FILE_DLCS))
            .p;
        // Hero beginning
        this.ID_MAP_START_HERO = json.idMapHero;
        this.ID_OBJECT_START_HERO = json.idObjHero;
        // Debug bounding box
        this.showBB = Utils.defaultValue(json.bb, false);
        if (this.showBB) {
            Manager.Collisions.BB_MATERIAL.color.setHex(0xff0000);
            Manager.Collisions.BB_MATERIAL.wireframe = true;
        }
        Manager.Collisions.BB_MATERIAL.visible = this.showBB;
        // Lists
        this.itemsTypes = [];
        this.colors = [];
        this.currencies = [];
        this.windowSkins = [];
        this.cameraProperties = [];
        this.detections = [];
        this.skyboxes = [];
        this.fontSizes = [];
        this.fontNames = [];
        this.speeds = [];
        this.frequencies = [];
        Utils.readJSONSystemList({ list: json.itemsTypes, listIDs: this
                .itemsTypes, func: (element) => {
                return element.name;
            } });
        Utils.readJSONSystemList({ list: json.colors, listIDs: this.colors, cons: System.Color });
        Utils.readJSONSystemList({ list: json.currencies, listIDs: this
                .currencies, cons: System.Currency });
        Utils.readJSONSystemList({ list: json.wskins, listIDs: this.windowSkins,
            cons: System.WindowSkin });
        Utils.readJSONSystemList({ list: json.cp, listIDs: this.cameraProperties,
            cons: System.CameraProperties });
        Utils.readJSONSystemList({ list: json.d, listIDs: this.detections, cons: System.Detection });
        Utils.readJSONSystemList({ list: json.sb, listIDs: this.skyboxes, cons: System.Skybox });
        Utils.readJSONSystemList({ list: json.fs, listIDs: this.fontSizes, func: (element) => {
                return System.DynamicValue.readOrDefaultNumber(element.s, 0);
            } });
        Utils.readJSONSystemList({ list: json.fn, listIDs: this.fontNames, func: (element) => {
                return System.DynamicValue.readOrDefaultMessage(element.f, Constants
                    .DEFAULT_FONT_NAME);
            } });
        Utils.readJSONSystemList({ list: json.sf, listIDs: this.speeds, func: (element) => {
                return System.DynamicValue.readOrDefaultNumberDouble(element.v, 1);
            } });
        Utils.readJSONSystemList({ list: json.f, listIDs: this.frequencies, func: (element) => {
                return System.DynamicValue.readOrDefaultNumberDouble(element.v, 1);
            } });
        // Sounds
        this.soundCursor = new System.PlaySong(SongKind.Sound, json.scu);
        this.soundConfirmation = new System.PlaySong(SongKind.Sound, json.sco);
        this.soundCancel = new System.PlaySong(SongKind.Sound, json.sca);
        this.soundImpossible = new System.PlaySong(SongKind.Sound, json.si);
        // Window skin options
        this.dbOptions = Manager.Events
            .getEventCommand(json.dbo);
        this.dbOptions.update();
        // Initialize loading scene now that basics are loaded
        Manager.Stack.sceneLoading = new Scene.Loading();
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Get the item type by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getItemType(id) {
        return Datas.Base.get(id, this.itemsTypes, "item type");
    }
    /**
     *  Get the color by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {System.Color}
     */
    static getColor(id) {
        return Datas.Base.get(id, this.colors, "color");
    }
    /**
     *  Get the currency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCurrency(id) {
        return Datas.Base.get(id, this.currencies, "currency");
    }
    /**
     *  Get the window skin by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getWindowSkin(id) {
        return Datas.Base.get(id, this.windowSkins, "window skin");
    }
    /**
     *  Get the camera properties by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCameraProperties(id) {
        return Datas.Base.get(id, this.cameraProperties, "camera properties");
    }
    /**
     *  Get the detection by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getDetection(id) {
        return Datas.Base.get(id, this.detections, "detections");
    }
    /**
     *  Get the skybox by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSkybox(id) {
        return Datas.Base.get(id, this.skyboxes, "skybox");
    }
    /**
     *  Get the font size by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontSize(id) {
        return Datas.Base.get(id, this.fontSizes, "font size");
    }
    /**
     *  Get the font name by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontName(id) {
        return Datas.Base.get(id, this.fontNames, "font name");
    }
    /**
     *  Get the speed by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSpeed(id) {
        return Datas.Base.get(id, this.speeds, "speed");
    }
    /**
     *  Get the frequency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFrequency(id) {
        return Datas.Base.get(id, this.frequencies, "frequency");
    }
    /**
     *  Get the system object of hero.
     *  @static
     *  @async
     */
    static async getModelHero() {
        let mapName = Scene.Map.generateMapName(this.ID_MAP_START_HERO);
        let json = (await IO.parseFileJSON(Paths.FILE_MAPS + mapName + Paths
            .FILE_MAP_OBJECTS)).objs;
        let jsonObject, position;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            if (jsonObject.id === this.ID_OBJECT_START_HERO) {
                position = Position.createFromArray(jsonObject.p);
                break;
            }
        }
        if (Utils.isUndefined(position)) {
            Platform.showErrorMessage("Can't find hero in object linking. Please"
                + " remove the hero object from your map and recreate it." +
                "\nIf possible, report that you got this error and " +
                "describe the steps for having this because we are trying "
                + "to fix this issue.");
        }
        let globalPortion = position.getGlobalPortion();
        let fileName = globalPortion.getFileName();
        json = await IO.parseFileJSON(Paths.FILE_MAPS + mapName + Constants
            .STRING_SLASH + fileName);
        this.modelHero = (new MapPortion(globalPortion)).getHeroModel(json);
    }
    /**
     *  Load the window skins pictures
     *  @static
     */
    static async loadWindowSkins() {
        for (let i = 1, l = this.windowSkins.length; i < l; i++) {
            await this.windowSkins[i].updatePicture();
        }
    }
    /**
     *  Get the default array currencies for a default game.
     *  @static
     *  @returns {number[]}
     */
    static getDefaultCurrencies() {
        let list = [];
        for (let id in this.currencies) {
            list[id] = 0;
        }
        return list;
    }
    /**
     *  Get the current System window skin.
     *  @static
     *  @returns {SystemWindowSkin}
     */
    static getCurrentWindowSkin() {
        return this.dbOptions.v_windowSkin;
    }
}
export { Systems };
