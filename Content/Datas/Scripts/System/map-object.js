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
//  CLASS MapObject
//
// -------------------------------------------------------

/** @class
*   Element movable in local map.
*   @property {SystemObject} system System infos.
*   @property {number} speed Speed coef.
*   @property {Orientation} orientationEye Where the character is looking.
*   @property {THREE.Mesh} mesh The current mesh used for this object.
*   @param {THREE.Mesh} mesh The current mesh used for this object.
*   @param {SystemObject} system System infos.
*/
function MapObject(system, position, isHero) {
    this.system = system;
    this.position = position;
    this.previousPosition = position;
    this.mesh = null;
    this.meshBoundingBox = null;
    this.currentBoundingBox = null;
    this.boundingBoxSettings = null;
    this.frame = 0;
    this.orientationEye = Orientation.South;
    this.orientation = this.orientationEye;
    this.width = 1;
    this.height = 1;
    this.moving = false;
    this.movingHorizontal = null;
    this.movingVertical = null;
    this.frameTick = 0;
    this.moveFrequencyTick = 0;
    this.isHero = RPM.jsonDefault(isHero, false);
    this.isStartup = typeof position === RPM.UNDEFINED;
    this.isInScene = false;
    this.receivedOneEvent = false;
    this.movingState = null;
    this.previousOrientation = null;
    this.otherMoveCommand = null;
    this.yMountain = null;
    if (!this.isHero && !this.isStartup) {
        this.initializeProperties();
    }
    this.initializeTimeEvents();
}

/** Normal speed coef.
*   @constant
*   @static
*   @default 0.004666
*/
MapObject.SPEED_NORMAL = 0.004666;
MapObject.FRAME_DURATION = 150;

// -------------------------------------------------------

/** Update the object with a particular ID.
*   @static
*   @param {MapObject} object This object.
*   @param {number} objectID The object ID searched.
*   @param {Object} base The base module for the callback.
*   @param {function} callback The function to call after having found the
*   object.
*/
MapObject.updateObjectWithID = function(object, objectID, base, callback) {
    if (object.isHero && objectID === -1) {
        callback.call(base, RPM.game.hero);
    }

    switch (objectID) {
    case -1: // This object
        callback.call(base, object);
        break;

    case 0: // Hero
        callback.call(base, RPM.game.hero);
        break;

    default: // Particular object
        MapObject.getObjectAndPortion(object, objectID, base, callback);
        break;
    }
}

// -------------------------------------------------------

MapObject.getObjectAndPortion = function(object, objectID, base, callback) {
    var i, l, globalPortion, localPortion, moved, mapsDatas, movedObjects,
        mapPortion, objects;

    switch (objectID) {
    case -1: // This object
        objectID = object.system.id;
        break;
    case 0: // Hero
        objectID = RPM.game.hero.system.id;
        break;
    default:
        break;
    }
    globalPortion = SceneMap.getGlobalPortion(RPM.currentMap.allObjects[
        objectID]);
    localPortion = RPM.currentMap.getLocalPortion(globalPortion);

    // First search in the moved objects
    mapsDatas = RPM.game.mapsDatas[RPM.currentMap.id][globalPortion[0]][
        globalPortion[1]][globalPortion[2]];
    movedObjects = mapsDatas.m;
    moved = null;
    for (i = 0, l = movedObjects.length; i < l; i++) {
        if (movedObjects[i].system.id === objectID) {
            moved = movedObjects[i];
            break;
        }
    }
    if (moved !== null) {
        callback.call(base, moved, objectID, 0, i, null, mapsDatas);
        return;
    }

    // If not moving, search directly in portion
    if (RPM.currentMap.isInPortion(localPortion)) {
        mapPortion = RPM.currentMap.getMapPortionByPortion(localPortion);
        objects = mapPortion.objectsList;

        for (i = 0, l = objects.length; i < l; i++){
            if (objects[i].system.id === objectID){
                moved = objects[i];
                break;
            }
        }

        if (moved === null) {
            callback.call(base, RPM.game.hero, objectID, 1, -1, null, mapsDatas);
        } else {
            callback.call(base, moved, objectID, 1, i, objects, mapsDatas);
        }
    }
    // Load the file if not already in temp
    else{
        var fileName = SceneMap.getPortionName(globalPortion[0], globalPortion[
            1], globalPortion[2]);
        RPM.openFile(this, RPM.FILE_MAPS + RPM.currentMap.mapName + "/" +
                       fileName, false, function(res)
        {
            var json = JSON.parse(res);
            mapPortion = new MapPortion(globalPortion[0],
                                        globalPortion[1],
                                        globalPortion[2]);
            moved = mapPortion.getObjFromID(json, objectID);

           if (moved === null) {
               callback.call(base, RPM.game.hero, objectID, 2, -1, null, mapsDatas);
           } else {
               callback.call(base, moved, objectID, 2, -1, null, mapsDatas);
           }
        });
    }
}

MapObject.prototype = {

    initializeProperties: function() {
        var i, l, prop, mapProp, propValue;

        if (this.isHero) {
            mapProp = RPM.game.heroProperties;
        } else if (this.isStartup) {
            mapProp = RPM.game.startupProperties[RPM.currentMap.id];
            if (typeof mapProp === RPM.UNDEFINED) {
                mapProp = [];
            }
        } else {
            var obj, portion, portionDatas, indexProp;

            obj = RPM.currentMap.allObjects[this.system.id];
            if (typeof obj === 'undefined') {
                RPM.showErrorMessage("Can't find object " + this.system.name +
                    " in object linking. Please remove this object from your " +
                    "map and recreate it.\nIf possible, report that you got " +
                    "this error and describe the steps for having this " +
                    "because we are trying to fix this issue.");
            }
            portion = SceneMap.getGlobalPortion(obj);
            portionDatas = RPM.game.mapsDatas[RPM.currentMap.id][portion[0]][portion[1
                ]][portion[2]];
            indexProp = portionDatas.pi.indexOf(this.system.id);
            mapProp = (indexProp === -1) ? [] : portionDatas.p[indexProp];
        }

        this.properties = [];
        for (i = 0, l = this.system.properties.length; i < l; i++) {
            prop = this.system.properties[i];
            propValue = mapProp[prop.id - 1];
            this.properties[prop.id] = typeof propValue === 'undefined' ? prop
                .initialValue.getValue() : propValue;
        }
    },

    initializeTimeEvents: function() {
        var i, l, event;

        l = this.system.timeEvents.length;
        this.timeEventsEllapsed = new Array(l);
        for (i = 0; i < l; i++) {
            event = this.system.timeEvents[i];
            this.timeEventsEllapsed[i] = [event, new Date().getTime()];
        }
    },

    updateTimeEvents: function() {
        var i, l, events, event, interval, repeat, timeEllapsed, removeList;

        // First run detection state
        if (this.currentState && this.currentState.detection !== null) {
            this.currentState.detection.update(null, this, null);
        }

        // Run other time events
        removeList = [];
        for (i = 0, l = this.timeEventsEllapsed.length; i < l; i++) {
            events = this.timeEventsEllapsed[i];
            event = events[0];
            timeEllapsed = events[1];
            interval = event.parameters[1].value;
            if (new Date().getTime() - timeEllapsed >= interval.getValue()) {
                repeat = event.parameters[2].value;
                if (this.receiveEvent(this, true, 1, [null, interval, repeat],
                    this.states, events))
                {
                    if (!repeat.getValue()) {
                        removeList.push(i);
                    }
                } else {
                    return;
                }
            }
        }

        // Remove useless no repeat events
        for (i = removeList.length - 1; i >= 0; i--) {
            this.timeEventsEllapsed.splice(removeList[i], 1);
        }
    },

    /** Update the current state (graphics to display). Also update the mesh.
    */
    changeState: function() {
        var angle = this.mesh ? this.mesh.rotation.y : 0;
        var x, y, picture;

        // Remove previous mesh
        this.removeFromScene();

        // Updating the current state
        if (this.isHero) {
            this.states = RPM.game.heroStates;
        } else if (this.isStartup) {
            if (!RPM.game.startupStates.hasOwnProperty(RPM.currentMap.id)) {
                RPM.game.startupStates[RPM.currentMap.id] = [1];
            }
            this.states = RPM.game.startupStates[RPM.currentMap.id];
        } else {
            var obj;

            obj = RPM.currentMap.allObjects[this.system.id];
            if (typeof obj === 'undefined') {
                RPM.showErrorMessage("Can't find object " + this.system.name +
                    " in object linking. Please remove this object from your " +
                    "map and recreate it.\nIf possible, report that you got " +
                    "this error and describe the steps for having this " +
                    "because we are trying to fix this issue.");
            }
            var portion = SceneMap.getGlobalPortion(obj);
            var portionDatas = RPM.game.mapsDatas[RPM.currentMap.id]
                    [portion[0]][portion[1]][portion[2]];
            var indexState = portionDatas.si.indexOf(this.system.id);
            this.states = (indexState === -1) ? [this.system.states.length > 0 ?
                this.system.states[0].id : 1] : portionDatas.s[indexState];
        }
        this.currentState = null;
        for (var i = this.system.states.length - 1; i >= 0; i--){
            var state = this.system.states[i];
            if (this.states.indexOf(state.id) !== -1){
                this.currentState = state;
                break;
            }
        }

        // Update mesh
        if (this.isStartup) {
            return;
        }

        var material = this.currentState === null ? null : (this.currentState
            .graphicID === 0 ? RPM.currentMap.textureTileset : RPM.currentMap
            .texturesCharacters[this.currentState.graphicID]);
        this.meshBoundingBox = new Array;
        if (this.currentState !== null && !this.isNone() && material && material
            .map)
        {
            this.speed = RPM.datasGame.system.speeds[this.currentState.speedID];
            this.frequency = RPM.datasGame.system.frequencies[this.currentState
                .frequencyID];
            this.frame = this.currentState.indexX >= RPM.FRAMES ? RPM.FRAMES - 1 :
                this.currentState.indexX;
            this.orientationEye = this.currentState.indexY;
            this.updateOrientation();

            if (this.currentState.graphicID === 0) {
                x = this.currentState.rectTileset[0];
                y = this.currentState.rectTileset[1];
                this.width = this.currentState.rectTileset[2];
                this.height = this.currentState.rectTileset[3];
            } else {
                x = 0;
                y = 0;
                this.width = material.map.image.width / RPM.SQUARE_SIZE /
                    RPM.FRAMES;
                this.height = material.map.image.height /
                    RPM.SQUARE_SIZE / 4;
            }

            var sprite = new Sprite(this.currentState.graphicKind,
                                    [x, y, this.width, this.height]);
            var geometry, objCollision, result;
            result = sprite.createGeometry(this.width, this.height, false,
                                           this.position);
            geometry = result[0];
            objCollision = result[1];
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(this.position.x,
                                   this.position.y,
                                   this.position.z);
            this.boundingBoxSettings = objCollision[1][0];
            if (this.currentState.graphicID === 0) {
                picture = RPM.currentMap.mapInfos.tileset.picture;
                this.boundingBoxSettings.squares = picture ? picture
                    .getSquaresForTexture(this.currentState.rectTileset) : [];
            }

            this.updateBB(this.position);
            this.updateUVs();
            this.updateAngle(angle);
        }
        else {
            this.mesh = null;
            this.boundingBoxSettings = null;
            this.speed = SystemValue.createNumberDouble(1);
            this.frequency = SystemValue.createNumberDouble(1);
        }

        // Add to the scene
        this.addToScene();
    },

    /** Read the JSON associated to the object.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json){
        var jsonPosition = json.k;
        this.position = RPM.positionToVector3(jsonPosition);
        this.system = new SystemObject;
        this.system.readJSON(json.v);
    },

    /** Simulate moving object position.
    *   @param {Orientation} orientation Where to move.
    *   @param {number} distance The distance.
    *   @returns {THREE.Vector3}
    */
    getFuturPosition: function(orientation, distance, angle){

        var position = new THREE.Vector3(this.previousPosition.x,
                                         this.previousPosition.y,
                                         this.previousPosition.z);

        // The speed depends on the time elapsed since the last update
        var xPlus, zPlus, xAbs, zAbs, res, i, l, blocked;
        var w = RPM.currentMap.mapInfos.length * RPM.SQUARE_SIZE;
        var h = RPM.currentMap.mapInfos.width * RPM.SQUARE_SIZE;
        var result, yMountain;

        if (orientation === Orientation.South || this.previousOrientation ===
            Orientation.South)
        {
            xPlus = distance * RPM.cos(angle * Math.PI / 180.0);
            zPlus = distance * RPM.sin(angle * Math.PI / 180.0);
            res = position.z - zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
            res = position.x - xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
        }
        if (orientation === Orientation.West || this.previousOrientation ===
            Orientation.West)
        {
            xPlus = distance * RPM.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * RPM.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x + xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            res = position.z + zPlus;
            if (res >= 0 && res < h)
               position.setZ(res);
        }
        if (orientation === Orientation.North || this.previousOrientation ===
            Orientation.North)
        {
            xPlus = distance * RPM.cos(angle * Math.PI / 180.0);
            zPlus = distance * RPM.sin(angle * Math.PI / 180.0);
            res = position.z + zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
            res = position.x + xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
        }
        if (orientation === Orientation.East || this.previousOrientation ===
            Orientation.East)
        {
            xPlus = distance * RPM.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * RPM.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x - xPlus;
            if (res >= 0 && res < w)
                position.setX(res);
            res = position.z - zPlus;
            if (res >= 0 && res < h)
                position.setZ(res);
        }

        // Collision
        this.updateBBPosition(position);
        yMountain = null;
        blocked = false;
        for (i = 0, l = this.meshBoundingBox.length; i < l; i++) {
            this.currentBoundingBox = this.meshBoundingBox[i];
            result = MapPortion.checkCollisionRay(this.position, position, this);
            if (result[0]) {
                blocked = true;
                position = this.position;
                break;
            }
            if (result[1] !== null) {
                yMountain = result[1];
            }
        }
        // If not blocked and possible Y up/down, check if there is no collision
        // on top
        if (!blocked && yMountain !== null) {
            position.setY(yMountain);
            for (i = 0, l = this.meshBoundingBox.length; i < l; i++) {
                this.currentBoundingBox = this.meshBoundingBox[i];
                result = MapPortion.checkCollisionRay(this.position, position,
                    this);
                if (result[0]) {
                    position = this.position;
                    break;
                }
            }
        }
        if (yMountain !== null && !position.equals(this.position)) {
            this.yMountain = yMountain - this.position.y;
            this.timeYMountain = new Date().getTime();
            this.yMountainBefore = this.position.y;
            position.setY(this.yMountainBefore);
        }

        this.updateBBPosition(this.position);

        return position;
    },

    // -------------------------------------------------------

    checkCollisionObject: function(object) {
        for (var i = 0, l = this.meshBoundingBox.length; i < l; i++) {
            for (var j = 0, ll = object.meshBoundingBox.length; j < ll; j++) {
                if (CollisionsUtilities.obbVSobb(
                            this.meshBoundingBox[i].geometry,
                            object.meshBoundingBox[j].geometry))
                {
                    return true;
                }
            }
        }

        return false;
    },

    // -------------------------------------------------------

    checkCollisionDetection: function() {
        var i, l;
        for (i = 0, l = this.meshBoundingBox.length; i < l; i++) {
            if (CollisionsUtilities.obbVSobb(this.meshBoundingBox[i].geometry,
                RPM.BB_BOX_DETECTION.geometry))
            {
                return true;
            }
        }
        // If no bounding box, use only one square by default
        if (l === 0) {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX_DEFAULT_DETECTION, [this
                .position.x, this.position.y + (RPM.SQUARE_SIZE / 2), this.position
                .z, RPM.SQUARE_SIZE, RPM.SQUARE_SIZE, RPM.SQUARE_SIZE, 0, 0, 0]);
            if (CollisionsUtilities.obbVSobb(RPM.BB_BOX_DEFAULT_DETECTION.geometry,
                RPM.BB_BOX_DETECTION.geometry))
            {
                return true;
            }
        }

        return false;
    },

    // -------------------------------------------------------

    isInRect: function(object) {
        var la, lb, ra, rb, ba, bb, ta, tb;
        la = this.position.x - Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        lb = object.position.x - Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        ra = this.position.x + Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        rb = object.position.x + Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        ba = this.position.z + Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        bb = object.position.z + Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        ta = this.position.z - Math.floor(this.width * RPM.SQUARE_SIZE / 2);
        tb = object.position.z - Math.floor(this.width * RPM.SQUARE_SIZE / 2);

        return (la < rb && ra > lb && ta < bb && ba > tb);
    },

    // -------------------------------------------------------

    /** Only updates the bounding box mesh position.
    *   @param {THREE.Vector3} position Position to update.
    */
    updateBB: function(position) {
        if (this.currentState.graphicID !== 0) {
            this.boundingBoxSettings.squares = RPM.currentMap.collisions
                [PictureKind.Characters][this.currentState.graphicID]
                [this.getStateIndex()];
        }

        this.boundingBoxSettings.b = new Array;
        var i, l, box;
        this.removeBBFromScene();

        for (i = 0, l = this.boundingBoxSettings.squares.length; i < l; i++) {
            this.boundingBoxSettings.b.push(CollisionSquare.getBB(
                this.boundingBoxSettings.squares[i], this.width, this.height));
            if (this.currentState.graphicKind === ElementMapKind.SpritesFix) {
                box = MapPortion.createBox();
                MapPortion.applyBoxSpriteTransforms(
                    box, [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                        this.boundingBoxSettings.b[i][5],
                        this.boundingBoxSettings.b[i][6],
                        this.boundingBoxSettings.b[i][7],
                        this.boundingBoxSettings.b[i][8]
                    ]);
            }
            else {
                box = MapPortion.createOrientedBox();
                MapPortion.applyOrientedBoxTransforms(
                    box, [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]);
            }
            this.meshBoundingBox.push(box);
        }

        this.addBBToScene();
    },

    // -------------------------------------------------------

    /** Only updates the bounding box mesh position.
    *   @param {THREE.Vector3} position Position to update.
    */
    updateBBPosition: function(position) {
        for (var i = 0, l = this.meshBoundingBox.length; i < l; i++) {
            if (this.currentState.graphicKind === ElementMapKind.SpritesFix) {
                MapPortion.applyBoxSpriteTransforms(
                    this.meshBoundingBox[i], [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]);
            }
            else {
                MapPortion.applyOrientedBoxTransforms(
                    this.meshBoundingBox[i], [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]);
            }
        }
    },

    // -------------------------------------------------------

    /** Move the object (one step).
    *   @param {Orientation} orientation Where to move.
    *   @param {number} limit Max distance to go.
    *   @returns {number} Distance cross.
    */
    move: function(orientation, limit, angle, isCameraOrientation){
        var objects, movedObjects, index, normalDistance, position, distance;

        // Remove from move
        this.removeMoveTemp();

        // Set position
        var speed = this.speed.getValue() * MapObject.SPEED_NORMAL *
            RPM.averageElapsedTime * RPM.SQUARE_SIZE;
        if (this.otherMoveCommand !== null) {
            speed *= Math.SQRT1_2;
        }

        normalDistance = Math.min(limit, speed);
        position = this.getFuturPosition(orientation, normalDistance, angle);
        distance = (position.equals(this.position)) ? 0 : normalDistance;
        if (this.previousOrientation !== null) {
            orientation = this.previousOrientation;
        }
        if (isCameraOrientation) {
            orientation = RPM.mod(orientation +
                                RPM.currentMap.camera.getMapOrientation() - 2, 4);
        }
        this.position.set(position.x, position.y, position.z);

        // Update orientation
        this.orientationEye = orientation;
        orientation = this.orientation;
        if (this.currentState.setWithCamera)
            this.updateOrientation();
        if (this.orientation !== orientation)
            this.updateUVs();

        this.moving = true;

        // Add to moving objects
        this.addMoveTemp();

        return [distance, normalDistance];
    },

    // -------------------------------------------------------

    /** Teleport the object.
    *   @param {THREE.Vector3} position Position to teleport.
    */
    teleport: function(position){

        // Remove from move
        this.removeMoveTemp();

        // Set position
        this.position.set(position.x, position.y, position.z);
        this.updateBBPosition(position);
        this.moving = true;

        // Add to moving objects
        this.addMoveTemp();
    },

    // -------------------------------------------------------

    removeMoveTemp: function(){
        var objects, previousPortion, movedObjects, index, mapPortion,
            originalPortion, localPortion;

        if (!this.isHero){
            previousPortion = RPM.getPortion(this.position);
            objects = RPM.game.mapsDatas[RPM.currentMap.id]
                   [previousPortion[0]][previousPortion[1]][previousPortion[2]];

            // Remove from the moved objects in or out of the portion
            movedObjects = objects.mout;
            index = movedObjects.indexOf(this);
            if (index !== -1)
                movedObjects.splice(index, 1);
            movedObjects = objects.min;
            index = movedObjects.indexOf(this);
            if (index !== -1)
                movedObjects.splice(index, 1);

            // Add to moved objects of the original portion if not done yet
            originalPortion = SceneMap.getGlobalPortion(
                        RPM.currentMap.allObjects[this.system.id]);
            objects = RPM.game.mapsDatas[RPM.currentMap.id]
                   [originalPortion[0]][originalPortion[1]][originalPortion[2]];
            movedObjects = objects.m;
            if (movedObjects.indexOf(this) === -1) {
                movedObjects.push(this);
                localPortion = RPM.currentMap.getLocalPortion(originalPortion);
                mapPortion = RPM.currentMap.getMapPortionByPortion(localPortion);
                movedObjects = mapPortion.objectsList;
                index = movedObjects.indexOf(this);
                if (index !== -1)
                    movedObjects.splice(index, 1);
            }
        }
    },

    // -------------------------------------------------------

    addMoveTemp: function(){
        var objects, afterPortion, originalPortion, localPortion;
        afterPortion = RPM.getPortion(this.position);

        if (!this.isHero){
            objects = RPM.game.mapsDatas[RPM.currentMap.id]
                    [afterPortion[0]][afterPortion[1]][afterPortion[2]];
            originalPortion = SceneMap.getGlobalPortion(
                        RPM.currentMap.allObjects[this.system.id]);

            if (originalPortion[0] !== afterPortion[0] ||
                originalPortion[1] !== afterPortion[1] ||
                originalPortion[2] !== afterPortion[2])
            {
                objects.mout.push(this);
            }
            else
                objects.min.push(this);
        }

        // Add or remove from scene
        localPortion = RPM.currentMap.getLocalPortion(afterPortion);
        if (RPM.currentMap.isInPortion(localPortion))
            this.addToScene();
        else
            this.removeFromScene();
    },

    // -------------------------------------------------------

    addToScene: function(){
        if (!this.isInScene && this.mesh !== null) {
            RPM.currentMap.scene.add(this.mesh);
            this.isInScene = true;
        }
    },

    // -------------------------------------------------------

    addBBToScene: function() {
        if (RPM.datasGame.system.showBB) {
            for (var i = 0, l = this.meshBoundingBox.length; i < l; i++)
                RPM.currentMap.scene.add(this.meshBoundingBox[i]);
        }
    },

    // -------------------------------------------------------

    removeFromScene: function(){
        if (this.isInScene) {
            RPM.currentMap.scene.remove(this.mesh);
            this.removeBBFromScene();
            this.isInScene = false;
        }
    },

    // -------------------------------------------------------

    removeBBFromScene: function() {
        if (RPM.datasGame.system.showBB) {
            for (var i = 0, l = this.meshBoundingBox.length; i < l; i++)
                RPM.currentMap.scene.remove(this.meshBoundingBox[i]);
        }

        this.meshBoundingBox = new Array;
    },

    // -------------------------------------------------------

    /** Receive an event.
    *   @param {MapObject} sender The sender of this event.
    *   @param {boolean} isSystem Boolean indicating if it is an event system.
    *   @param {number} eventId ID of the event.
    *   @param {SystemParameter[]} parameters List of all the parameters.
    *   @param {numbers[]} states List of all the current states of the object.
    */
    receiveEvent: function(sender, isSystem, idEvent, parameters, states, event)
    {
        // Option only one event per frame
        if (this.system.eventFrame && this.receivedOneEvent) {
            return false;
        }

        var i, j, l, ll, test;

        test = false;
        for (i = 0, l = states.length; i < l; i++){
            var state = states[i];
            var reactions = this.system.getReactions(isSystem, idEvent,
                states[i], parameters);

            for (j = 0, ll = reactions.length; j < ll; j++) {
                SceneGame.prototype.addReaction.call(RPM.gameStack.top(), sender,
                    reactions[j], this, state, parameters, event);
                this.receivedOneEvent = true;
                test = true;
                if (this.system.eventFrame) {
                    return true;
                }
            }
        }

        return test;
    },

    // -------------------------------------------------------

    /** Update the object graphics.
    */
    update: function(angle) {
        if (this.moveFrequencyTick > 0) {
            this.moveFrequencyTick -= RPM.elapsedTime;
        }

        // Graphic updates
        if (this.mesh !== null) {
            var frame = this.frame;
            var orientation = this.orientation;

            if (this.moving) {

                // If moving, update frame
                if (this.currentState.moveAnimation){
                    this.frameTick += RPM.elapsedTime;
                    if (this.frameTick >= (MapObject.FRAME_DURATION / this
                        .speed.getValue()))
                    {
                        this.frame = (this.frame + 1) % RPM.FRAMES;
                        this.frameTick = 0;
                    }
                }

                // Update mesh position
                var offset = (this.currentState.pixelOffset &&
                              this.frame % 2 !== 0) ? 1 : 0;
                this.mesh.position.set(this.position.x,
                                       this.position.y + offset,
                                       this.position.z);
                //this.updateBBPosition(this.position);
                this.moving = false;
                this.previousPosition = this.position;
            }
            else {
                this.frame = this.currentState.indexX;

                // Update angle
                if (this.currentState.setWithCamera)
                    this.updateOrientation();
            }

            this.updateAngle(angle);

            // Update mesh
            if (frame !== this.frame || orientation !== this.orientation)
                this.updateUVs();
        }

        // Smooth camera y Mountain up / down
        if (this.yMountain !== null) {
            var time;

            time = Math.min(1, (new Date().getTime() - this.timeYMountain) / 40);
            this.position.setY(this.yMountainBefore + (time * this.yMountain));
            if (time === 1) {
                this.yMountain = null;
            }
        }

        // Moving
        this.updateMovingState();

        // Time events
        this.receivedOneEvent = false;
        this.updateTimeEvents();
    },

    // -------------------------------------------------------

    updateMovingState: function() {
        if (this.currentState && this.currentState.objectMovingKind !==
            ObjectMovingKind.Fix)
        {
            var interpreter;

            interpreter = RPM.currentMap.addReaction(null, this.currentState.route,
                this, this.currentState.id, [null], null, true);
            if (interpreter !== null) {
                this.movingState = interpreter.currentCommandState;
            }
        }
    },

    // -------------------------------------------------------

    /** Update the move states to know if diagonal move is needed.
    */
    updateMoveStates: function(orientation) {
        /*
        switch (orientation) {
        case Orientation.South:
        case Orientation.North:
            this.movingVertical = orientation;
            break;
        case Orientation.West:
        case Orientation.East:
            this.movingHorizontal = orientation;
            break;
        }*/
    },

    // -------------------------------------------------------

    /** Update the Y angle (for face sprites).
    *   @param {number} angle The angle on the Y axis.
    */
    updateAngle: function(angle){
        if (this.currentState.graphicKind === ElementMapKind.SpritesFace)
            this.mesh.rotation.y = angle;
    },

    // -------------------------------------------------------

    /** Update the orientation according to the camera position
    */
    updateOrientation: function(){
        this.orientation = RPM.mod((RPM.currentMap.orientation - 2) * 3 +
                                     this.orientationEye, 4);
    },

    // -------------------------------------------------------

    /** Update the UVs coordinates according to frame and orientation.
    */
    updateUVs: function(){
        if (this.mesh !== null && !this.isNone()) {
            var textureWidth, textureHeight;
            var x, y, w, h;

            if (this.mesh.material && this.mesh.material.map) {
                textureWidth = this.mesh.material.map.image.width;
                textureHeight = this.mesh.material.map.image.height;
                if (this.currentState.graphicID === 0) {
                    w = this.width * RPM.SQUARE_SIZE / textureWidth;
                    h = this.height * RPM.SQUARE_SIZE / textureHeight;
                    x = this.currentState.rectTileset[0] * RPM.SQUARE_SIZE /
                        textureWidth;
                    y = this.currentState.rectTileset[1] * RPM.SQUARE_SIZE /
                        textureHeight;
                } else {
                    w = this.width * RPM.SQUARE_SIZE / textureWidth;
                    h = this.height * RPM.SQUARE_SIZE / textureHeight;
                    x = (this.frame >= RPM.FRAMES ? RPM.FRAMES - 1 : this.frame) * w;
                    y = this.orientation * h;
                }
                var coefX = RPM.COEF_TEX / textureWidth;
                var coefY = RPM.COEF_TEX / textureHeight;
                x += coefX;
                y += coefY;
                w -= (coefX * 2);
                h -= (coefY * 2);

                // Update geometry
                this.mesh.geometry.faceVertexUvs[0][0][0].set(x, y);
                this.mesh.geometry.faceVertexUvs[0][0][1].set(x + w, y);
                this.mesh.geometry.faceVertexUvs[0][0][2].set(x + w, y + h);
                this.mesh.geometry.faceVertexUvs[0][1][0].set(x, y);
                this.mesh.geometry.faceVertexUvs[0][1][1].set(x + w, y + h);
                this.mesh.geometry.faceVertexUvs[0][1][2].set(x, y + h);
                this.mesh.geometry.uvsNeedUpdate = true;
            }
        }
    },

    // -------------------------------------------------------

    /** Update the material.
    */
    updateMaterial: function(){
        if (!this.isNone()){
            this.mesh.material = this.currentState.graphicID === 0 ?
                RPM.currentMap.textureTileset : RPM.currentMap.texturesCharacters[
                this.currentState.graphicID];
        } else {
            this.mesh = null;
        }
    },

    // -------------------------------------------------------

    getStateIndex: function() {
        return this.frame + (this.orientation * RPM.FRAMES);
    },

    // -------------------------------------------------------

    isNone: function() {
        return this.currentState.graphicKind === ElementMapKind.None ||
               this.currentState.graphicID === -1;
    }
}
