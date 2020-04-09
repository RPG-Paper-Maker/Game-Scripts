/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS DatasSystem
//
// -------------------------------------------------------

/** @class
*   All the system datas.
*   @property {string[]} itemsTypes List of all the possible types of items of
*   the game according to ID.
*   @property {number} idMapStartHero Id of the map where the hero is in the
*   beginning of a game.
*   @property {number} idObjectStartHero Id of the object where the hero is in
*   the beginning of a game.
*   @property {SystemCurrency[]} currencies List of all the currencies of the
*   game according to ID.
*/
function DatasSystem(){
    this.read();
}

DatasSystem.prototype = {

    /** Read the JSON file associated to system.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SYSTEM, true, function(res){
            var json = JSON.parse(res);
            var jsonItemsTypes = json.itemsTypes;
            var i, l = jsonItemsTypes.length, id, w, h, isScreenWindow;
            var jsonList, jsonElement, element;
            this.itemsTypes = new Array(l+1);
            for (i = 0; i < l; i++) {
                this.itemsTypes[jsonItemsTypes[i].id] = {
                    name: jsonItemsTypes[i].name
                };
            }

            // Project name
            this.projectName = new SystemLang();
            this.projectName.readJSON(json.pn);
            $window.title = this.projectName.name;

            // Screen resolution
            w = json.sw;
            h = json.sh;
            isScreenWindow = json.isw;
            if (!isScreenWindow) {
                $window.visibility = "FullScreen";
                w = $screenWidth;
                h = $screenHeight;
            }
            $window.width = w;
            $window.maximumWidth = w;
            $window.minimumWidth = w;
            $window.height = h;
            $window.maximumHeight = h;
            $window.minimumHeight = h;
            $window.setX($screenWidth / 2 - w / 2);
            $window.setY($screenHeight / 2 - h / 2);
            $canvasHUD.width = w;
            $canvasHUD.height = h;
            $canvas3D.width = w;
            $canvas3D.height = h;
            $canvasWidth = w;
            $canvasHeight = h;
            $windowX = $canvasWidth / $SCREEN_X;
            $windowY = $canvasHeight / $SCREEN_Y;
            $context.width = w;
            $context.height = h;
            resizeGL($canvas3D);
            $requestPaintHUD = true;

            // Other numbers
            $SQUARE_SIZE = json.ss;
            //$PORTIONS_RAY_NEAR = json.pr;
            $PORTIONS_RAY_NEAR = 3;
            $FRAMES = json.frames;
            this.mountainCollisionHeight = SystemValue.readOrDefaultNumber(json
                .mch, 4);
            this.mountainCollisionAngle = SystemValue.readOrDefaultNumberDouble(
                json.mca, 45);

            // Path BR
            RPM.PATH_BR = "file:///" + json.pathBR + "/";

            // Hero beginning
            this.idMapStartHero = json.idMapHero;
            this.idObjectStartHero = json.idObjHero;
            this.getModelHero();

            // Debug
            this.showBB = (typeof json.bb !== 'undefined');
            if (this.showBB) {
                $BB_MATERIAL.color.setHex(0xff0000);
                $BB_MATERIAL.wireframe = true;
                $BB_MATERIAL.visible = true;
            }

            // Colors
            var jsonColors = json.colors;
            l = jsonColors.length;
            this.colors = new Array(l + 1);
            for (i = 0; i < l; i++){
                var jsonColor = jsonColors[i];
                id = jsonColor.id;
                var color = new SystemColor();
                color.readJSON(jsonColor);
                this.colors[id] = color;
            }

            // Currencies
            var jsonCurrencies = json.currencies;
            l = jsonCurrencies.length;
            this.currencies = new Array(l + 1);
            for (i = 0; i < l; i++){
                var jsonCurrency = jsonCurrencies[i];
                id = jsonCurrency.id;
                var currency = new SystemCurrency();
                currency.readJSON(jsonCurrency);
                this.currencies[id] = currency;
            }

            // WindowSkins
            var jsonWindowSkins = json.wskins;
            l = jsonWindowSkins.length;
            this.windowSkins = new Array(l + 1);
            for (i = 0; i < l; i++){
                var jsonWindowSkin = jsonWindowSkins[i];
                id = jsonWindowSkin.id;
                var windowSkin = new SystemWindowSkin();
                windowSkin.readJSON(jsonWindowSkin);
                this.windowSkins[id] = windowSkin;
            }

            // CameraProperties
            jsonList = json.cp;
            l = jsonList.length;
            this.cameraProperties = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = new SystemCameraProperties();
                element.readJSON(jsonElement);
                this.cameraProperties[jsonElement.id] = element;
            }

            // Detections
            jsonList = json.d;
            l = jsonList.length;
            this.detections = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = new SystemDetection();
                element.readJSON(jsonElement);
                this.detections[jsonElement.id] = element;
            }

            // Speeds
            jsonList = json.sf;
            l = jsonList.length;
            this.speeds = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = SystemValue.readOrDefaultNumberDouble(jsonElement.v, 1);
                this.speeds[jsonElement.id] = element;
            }
            // Frequencies
            jsonList = json.f;
            l = jsonList.length;
            this.frequencies = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = SystemValue.readOrDefaultNumberDouble(jsonElement.v, 1);
                this.frequencies[jsonElement.id] = element;
            }

            // Font sizes
            jsonList = json.fs;
            l = jsonList.length;
            this.fontSizes = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = SystemValue.readOrDefaultNumber(jsonElement.s, 0);
                this.fontSizes[jsonElement.id] = element;
            }

            // Font names
            jsonList = json.fn;
            l = jsonList.length;
            this.fontNames = new Array(l + 1);
            for (i = 0; i < l; i++) {
                jsonElement = jsonList[i];
                id = jsonElement.id;
                element = SystemValue.readOrDefaultMessage(jsonElement.f, RPM
                    .DEFAULT_FONT);
                this.fontNames[jsonElement.id] = element;
            }

            // read song now that BR path is loaded
            $datasGame.songs.read();

            // Sounds
            this.soundCursor = new SystemPlaySong(SongKind.Sound);
            this.soundCursor.readJSON(json.scu);
            this.soundConfirmation = new SystemPlaySong(SongKind.Sound);
            this.soundConfirmation.readJSON(json.sco);
            this.soundCancel = new SystemPlaySong(SongKind.Sound);
            this.soundCancel.readJSON(json.sca);
            this.soundImpossible = new SystemPlaySong(SongKind.Sound);
            this.soundImpossible.readJSON(json.si);

            // Dialog box options
            this.dbOptions = EventCommand.getEventCommand(json.dbo);
            this.dbOptions.update();

            $loadingScene = new SceneLoading();
        });
    },

    // -------------------------------------------------------

    /** Update the $modelHero global variable by loading the hero model.
    */
    getModelHero: function(){
        var mapName = RPM.generateMapName(this.idMapStartHero);
        RPM.openFile(null, RPM.FILE_MAPS + mapName + RPM.FILE_MAP_OBJECTS,
                       true, function(res)
        {
            var json = JSON.parse(res).objs;
            var i, l;

            var jsonObject;
            l = json.length;
            var id = $datasGame.system.idObjectStartHero;
            var position;

            for (i = 0; i < l; i++){
                jsonObject = json[i];
                if (jsonObject.id === id){
                    position = jsonObject.p;
                    break;
                }
            }
            if (typeof position == 'undefined') {
                RPM.showErrorMessage("Can't find hero in object linking. Please"
                    + " remove the hero object from your map and recreate it." +
                    "\nIf possible, report that you got this error and " +
                    "describe the steps for having this because we are trying "
                    + "to fix this issue.");
            }
            var globalPortion = SceneMap.getGlobalPortion(position);

            var fileName = SceneMap.getPortionName(globalPortion[0],
                                                   globalPortion[1],
                                                   globalPortion[2]);

            RPM.openFile(null, RPM.FILE_MAPS + mapName + "/" + fileName,
                           false, function(res){
                var json = JSON.parse(res);
                var mapPortion = new MapPortion(globalPortion[0],
                                                globalPortion[1],
                                                globalPortion[2]);

                // Update the hero model
                $modelHero = mapPortion.getHeroModel(json);
            });
        });
    },

    // -------------------------------------------------------

    loadWindowSkins: function() {
        for (var i = 1, l = this.windowSkins.length; i < l; i++) {
            this.windowSkins[i].updatePicture();
        }
    },

    // -------------------------------------------------------

    /** Get the default array currencies for a default game.
    *   @returns {number[]}
    */
    getDefaultCurrencies: function(){
        var id, list;

        list = [];
        for (id in this.currencies) {
            list[id] = 0;
        }

        return list;
    },

    // -------------------------------------------------------

    getWindowSkin: function() {
        return this.windowSkins[this.dbOptions.windowSkinID.getValue()];
    }
}
