/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the system datas
*   @property {string[]} itemsTypes List of all the possible types of items of
*   the game according to ID.
*   @property {number} idMapStartHero Id of the map where the hero is in the
*   beginning of a game.
*   @property {number} idObjectStartHero Id of the object where the hero is in
*   the beginning of a game.
*   @property {SystemCurrency[]} currencies List of all the currencies of the
*   game according to ID.
*/
class DatasSystem
{
    constructor()
    {

    }

    /** Read the JSON file associated to system
    */
    async read()
    {
        let json = await RPM.parseFileJSON(RPM.FILE_SYSTEM);

        // Font sizes & font names
        this.fontSizes = RPM.readJSONSystemList(json.fs, (element) =>
        {
            return SystemValue.readOrDefaultNumber(element.s, 0);
        }, false);
        this.fontNames = RPM.readJSONSystemList(json.fn, (element) =>
        {
            return SystemValue.readOrDefaultMessage(element.f, RPM.DEFAULT_FONT);
        }, false);
        

        // Initialize loading scene now that basics are loaded
        //RPM.loadingScene = new SceneLoading();

        // Project name
        this.projectName = new SystemLang(json.pn);
        Platform.setWindowTitle(this.projectName.name());

        // Screen resolution + antialiasing
        let w = json.sw;
        let h = json.sh;
        let isScreenWindow = json.isw;
        if (!isScreenWindow)
        {
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
        RPM.resizeGL(Platform.canvas3D);
        RPM.requestPaintHUD = true;

        // Other numbers
        RPM.SQUARE_SIZE = json.ss;
        RPM.PORTIONS_RAY_NEAR = 3; // TODO: json.pr
        RPM.FRAMES = json.frames;
        this.mountainCollisionHeight = SystemValue.readOrDefaultNumber(json.mch, 
            4);
        this.mountainCollisionAngle = SystemValue.readOrDefaultNumberDouble(json
            .mca, 45);
        this.mapFrameDuration = SystemValue.readOrDefaultNumber(json.mfd, 150);

        // Path BR
        RPM.PATH_BR = RPM.PATH_FILES + json.pathBR;

        // Hero beginning
        this.idMapStartHero = json.idMapHero;
        this.idObjectStartHero = json.idObjHero;
        //await this.getModelHero();

        // Debug bounding box
        this.showBB = RPM.defaultValue(json.bb, false);
        if (this.showBB)
        {
            RPM.BB_MATERIAL.color.setHex(0xff0000);
            RPM.BB_MATERIAL.wireframe = true;
            RPM.BB_MATERIAL.visible = true;
        }

        // Lists
        this.itemsTypes = RPM.readJSONSystemList(json.itemsTypes, (element) =>
        {
            return element.name;
        }, false);
        this.colors = RPM.readJSONSystemList(json.colors, SystemColor);
        this.currencies = RPM.readJSONSystemList(json.currencies, SystemCurrency);
        this.windowSkins = RPM.readJSONSystemList(json.wskins, SystemWindowSkin);
        this.cameraProperties = RPM.readJSONSystemList(json.cp, 
            SystemCameraProperties);

        /*
        // Detections
        jsonList = json.d;
        l = jsonList.length;
        this.detections = new Array(l + 1);
        for (i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            element = new SystemDetection();
            element.read(jsonElement);
            this.detections[id] = element;
        }

        // Speeds
        jsonList = json.sf;
        l = jsonList.length;
        this.speeds = new Array(l + 1);
        for (i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            element = SystemValue.readOrDefaultNumberDouble(jsonElement.v, 1);
            this.speeds[id] = element;
        }
        // Frequencies
        jsonList = json.f;
        l = jsonList.length;
        this.frequencies = new Array(l + 1);
        for (i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            element = SystemValue.readOrDefaultNumberDouble(jsonElement.v, 1);
            this.frequencies[id] = element;
        }

        // Skyboxes
        jsonList = json.sb;
        l = jsonList.length;
        this.skyboxes = new Array(l + 1);
        for (i = 0; i < l; i++) {
            jsonElement = jsonList[i];
            id = jsonElement.id;
            element = new SystemSkybox();
            element.read(jsonElement);
            this.skyboxes[id] = element;
        }

        // read song now that BR path is loaded
        RPM.datasGame.songs.read();

        // Sounds
        this.soundCursor = new SystemPlaySong(SongKind.Sound);
        this.soundCursor.read(json.scu);
        this.soundConfirmation = new SystemPlaySong(SongKind.Sound);
        this.soundConfirmation.read(json.sco);
        this.soundCancel = new SystemPlaySong(SongKind.Sound);
        this.soundCancel.read(json.sca);
        this.soundImpossible = new SystemPlaySong(SongKind.Sound);
        this.soundImpossible.read(json.si);

        this.dbOptions = EventCommand.getEventCommand(json.dbo);
        this.dbOptions.update();
        */
    }

    // -------------------------------------------------------

    /** Update the RPM.modelHero global variable by loading the hero model.
    */
    async getModelHero()
    {
        let mapName = RPM.generateMapName(this.idMapStartHero);
        let json = (await RPM.parseFileJSON(RPM.FILE_MAPS + mapName + RPM
            .FILE_MAP_OBJECTS)).objs;
        let jsonObject, position;
        for (let i = 0, l = json.length; i < l; i++)
        {
            jsonObject = json[i];
            if (jsonObject.id === this.idObjectStartHero)
            {
                position = jsonObject.p;
                break;
            }
        }
        if (RPM.isUndefined(position))
        {
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

    loadWindowSkins()
    {
        for (var i = 1, l = this.windowSkins.length; i < l; i++) {
            this.windowSkins[i].updatePicture();
        }
    }

    // -------------------------------------------------------
    /** Get the default array currencies for a default game.
    *   @returns {number[]}
    */
    getDefaultCurrencies()
    {
        var id, list;

        list = [];
        for (id in this.currencies) {
            list[id] = 0;
        }

        return list;
    }

    // -------------------------------------------------------

    getWindowSkin()
    {
        return this.windowSkins[this.dbOptions.windowSkinID.getValue()];
    }
}