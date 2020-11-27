/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the System datas

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
 *   @property {CameraProperties[]} cameraProperties List of all the
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
class DatasSystem {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to System
     */
    async read() {
        let json = await RPM.parseFileJSON(RPM.FILE_SYSTEM);

        // Project name
        this.projectName = new Lang(json.pn);
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
        Platform.canvas3D.width = w;
        Platform.canvas3D.height = h;
        Platform.canvasVideos.height = h;
        RPM.CANVAS_WIDTH = w;
        RPM.CANVAS_HEIGHT = h;
        RPM.WINDOW_X = RPM.CANVAS_WIDTH / RPM.SCREEN_X;
        RPM.WINDOW_Y = RPM.CANVAS_HEIGHT / RPM.SCREEN_Y;
        this.antialias = json.aa;

        // Now that antialias is on or off, initialize GL stuff
        RPM.initializeGL();
        RPM.resizeGL();
        RPM.requestPaintHUD = true;

        // Other numbers
        RPM.SQUARE_SIZE = json.ss;
        RPM.PORTIONS_RAY_NEAR = 3; // TODO: json.pr
        RPM.FRAMES = json.frames;
        this.mountainCollisionHeight = DynamicValue.readOrDefaultNumber(json.mch,
            4);
        this.mountainCollisionAngle = DynamicValue.readOrDefaultNumberDouble(json
            .mca, 45);
        this.mapFrameDuration = DynamicValue.readOrDefaultNumber(json.mfd, 150);

        // Path BR
        RPM.PATH_BR = RPM.PATH_FILES + json.pathBR;

        // Hero beginning
        this.idMapStartHero = json.idMapHero;
        this.idObjectStartHero = json.idObjHero;

        // Debug bounding box
        this.showBB = RPM.defaultValue(json.bb, false);
        if (this.showBB) {
            MapPortion.BB_MATERIAL.color.setHex(0xff0000);
            MapPortion.BB_MATERIAL.wireframe = true;
        }
        MapPortion.BB_MATERIAL.visible = this.showBB;

        // Lists
        this.itemsTypes = RPM.readJSONSystemList(json.itemsTypes, (element) => {
            return element.name;
        }, false);
        this.colors = RPM.readJSONSystemList(json.colors, Color);
        this.currencies = RPM.readJSONSystemList(json.currencies, Currency);
        this.windowSkins = RPM.readJSONSystemList(json.wskins, SystemWindowSkin);
        this.cameraProperties = RPM.readJSONSystemList(json.cp,
            CameraProperties);
        this.detections = RPM.readJSONSystemList(json.d, Detection);
        this.skyboxes = RPM.readJSONSystemList(json.sb, SystemSkybox);
        this.fontSizes = RPM.readJSONSystemList(json.fs, (element) => {
            return DynamicValue.readOrDefaultNumber(element.s, 0);
        }, false);
        this.fontNames = RPM.readJSONSystemList(json.fn, (element) => {
            return DynamicValue.readOrDefaultMessage(element.f, RPM.DEFAULT_FONT);
        }, false);
        this.speeds = RPM.readJSONSystemList(json.sf, (element) => {
            return DynamicValue.readOrDefaultNumberDouble(element.v, 1);
        }, false);
        this.frequencies = RPM.readJSONSystemList(json.f, (element) => {
            return DynamicValue.readOrDefaultNumberDouble(element.v, 1);
        }, false);

        // Sounds
        this.soundCursor = new PlaySong(SongKind.Sound, json.scu);
        this.soundConfirmation = new PlaySong(SongKind.Sound, json.sco);
        this.soundCancel = new PlaySong(SongKind.Sound, json.sca);
        this.soundImpossible = new PlaySong(SongKind.Sound, json.si);

        // Window skin options
        this.dbOptions = EventCommand.getEventCommand(json.dbo);
        this.dbOptions.update();

        // Initialize loading scene now that basics are loaded
        RPM.loadingScene = new SceneLoading();
    }

    // -------------------------------------------------------
    /** Update the Rpm.modelHero global variable by loading the hero model
     */
    async getModelHero() {
        let mapName = RPM.generateMapName(this.idMapStartHero);
        let json = (await RPM.parseFileJSON(RPM.FILE_MAPS + mapName + RPM
            .FILE_MAP_OBJECTS)).objs;
        let jsonObject, position;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            if (jsonObject.id === this.idObjectStartHero) {
                position = jsonObject.p;
                break;
            }
        }
        if (RPM.isUndefined(position)) {
            RPM.showErrorMessage("Can't find hero in object linking. Please"
                + " remove the hero object from your map and recreate it." +
                "\nIf possible, report that you got this error and " +
                "describe the steps for having this because we are trying "
                + "to fix this issue.");
        }
        let globalPortion = SceneMap.getGlobalPortion(position);
        let fileName = SceneMap.getPortionName(globalPortion[0], globalPortion[1
            ], globalPortion[2]);
        json = await RPM.parseFileJSON(RPM.FILE_MAPS + mapName + RPM
            .STRING_SLASH + fileName);
        RPM.modelHero = (new MapPortion(globalPortion[0], globalPortion[1],
            globalPortion[2])).getHeroModel(json);
    }

    // -------------------------------------------------------
    /** Load the window skins pictures
     */
    async loadWindowSkins() {
        for (let i = 1, l = this.windowSkins.length; i < l; i++) {
            await this.windowSkins[i].updatePicture();
        }
    }

    // -------------------------------------------------------
    /** Get the default array currencies for a default game
     *   @returns {number[]}
     */
    getDefaultCurrencies() {
        let list = [];
        for (let id in this.currencies) {
            list[id] = 0;
        }
        return list;
    }

    // -------------------------------------------------------
    /** Get the current System window skin
     *   @returns {SystemWindowSkin}
     */
    getWindowSkin() {
        return this.windowSkins[this.dbOptions.windowSkinID.getValue()];
    }
}