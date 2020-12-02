/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   Element movable in local map
*   @property {number} [MapObject.SPEED_NORMAL=0.004666] Normal speed coef
*   @property {SystemObject} System The System infos
*   @property {THREE.Vector3} position The current object position
*   @property {THREE.Vector3} previousPosition The previous position before 
*   last move
*   @property {THREE.Mesh} mesh The current mesh used for this object
*   @property {THREE.Mesh[]} meshBoundingBox The meshs bounding box used for 
*   collisions
*   @property {THREE.Mesh} currentBoundingBox The current bounding box mesh
*   @property {Object} boundingBoxSettings The bounding box settings
*   @property {Frame} frame The animation move frame
*   @property {Orientation} orientationEye Orientation where the character is 
*   looking at
*   @property {Orientation} orientation The orientation according to camera
*   @property {number} width The width by number of squares
*   @property {number} height The height by number of squares
*   @property {boolean} moving Indicate if the object is moving
*   @property {number} moveFrequencyTick The move frequency tick
*   @property {boolean} isHero Indicate if this obejct is the hero
*   @property {boolean} isStartup Indicate if this object is a startup
*   @property {boolean} isInScene Indicate if this object mesh is in the scene
*   @property {boolean} receivedOneEvent Indicate if this object receive one 
*   event per frame
*   @property {Object} movingState The current state (for moving command)
*   @property {Orientation} previousOrientation The previous orientation before 
*   last move
*   @property {EventCommandMoveObject} otherMoveCommand The other move command 
*   for calculating diagonal move
*   @property {number} yMountain The last y mountain pixel
*   @property {number[]} properties The properties values according to ID 
*   @property {Object[]} statesInstance The states instances values according 
*   to ID
*   @property {any[][]} timeEventsEllapsed Informations about time events
*   @property {number[]} states The states IDs  
*   @property {SystemObjectState} currentState The current System object state
*   @property {Object} currentStateInstance The current instance object state
*   @property {SystemValue} speed Speed coef
*   @property {SystemValue} frequency Frequency value
*   @param {SystemObject} System The System informations
*   @param {THREE.Vector3} position The current object position
*   @param {boolean} isHero Indicate if the object is the hero
*/
class MapObject
{
    static SPEED_NORMAL = 0.004666;

    constructor(system, position, isHero)
    {
        /*
        this.system = system;
        this.position = position;
        this.previousPosition = position;
        this.mesh = null;
        this.meshBoundingBox = null;
        this.currentBoundingBox = null;
        this.boundingBoxSettings = null;
        this.frame = new Frame(0);
        this.orientationEye = Orientation.South;
        this.orientation = this.orientationEye;
        this.width = 1;
        this.height = 1;
        this.moving = false;
        this.moveFrequencyTick = 0;
        this.isHero = RPM.defaultValue(isHero, false);
        this.isStartup = RPM.isUndefined(position);
        this.isInScene = false;
        this.receivedOneEvent = false;
        this.movingState = null;
        this.previousOrientation = null;
        this.otherMoveCommand = null;
        this.yMountain = null;
        if (!this.isHero)
        {
            this.initializeProperties();
        }
        this.initializeTimeEvents();*/
    }

    // -------------------------------------------------------
    /** Update the object with a particular ID
    *   @static
    *   @param {MapObject} object This object
    *   @param {number} objectID The object ID searched
    *   @param {Object} base The base module for the callback
    *   @param {function} callback The function to call after having found the
    *   object
    */
    static async updateObjectWithID(object, objectID, base, callback) 
    {
        /*
        switch (objectID)
        {
        case -1:
            
            if (object.isInScene || object.isHero || object.isStartup)
            {
                RPM.tryCatch(callback.call(base, object));
            } else // If not in scene, then search the id again in the current
            //  loaded portions
            {
                await MapObject.getObjectAndPortion(object, objectID, base, 
                    callback);
            }
            break;
        case 0: // Hero
            RPM.tryCatch(callback.call(base, RPM.game.hero));
            break;
        default: // Particular object
            await MapObject.getObjectAndPortion(object, objectID, base, callback);
            break;
        }*/
    }

    // -------------------------------------------------------
    /** Get the direct object and portion
    *   @static
    *   @param {MapObject} object This object
    *   @param {number} objectID The object ID searched
    *   @param {Object} base The base module for the callback
    *   @param {function} callback The function to call after having found the
    *   object
    */
    static async getObjectAndPortion(object, objectID, base, callback) 
    {
        /*
        switch (objectID)
        {
        case -1: // This object
            objectID = object.system.id;
            break;
        case 0: // Hero
            objectID = RPM.game.hero.system.id;
            break;
        default:
            break;
        }

        // First search in the moved objects
        let globalPortion = SceneMap.getGlobalPortion(RPM.currentMap.allObjects[
            objectID]);
        let mapsDatas = RPM.game.getPotionsDatas(RPM.currentMap.id, 
            globalPortion[0], globalPortion[1], globalPortion[2]);
        let movedObjects = mapsDatas.m;
        let moved = null;
        let i, l;
        for (i = 0, l = movedObjects.length; i < l; i++)
        {
            if (movedObjects[i].system.id === objectID)
            {
                moved = movedObjects[i];
                break;
            }
        }
        if (moved !== null)
        {
            RPM.tryCatch(callback.call(base, moved, objectID, 0, i, null, 
                mapsDatas));
            return;
        }

        // If not moving, search directly in portion
        let localPortion = RPM.currentMap.getLocalPortion(globalPortion);
        let mapPortion;
        if (RPM.currentMap.isInPortion(localPortion))
        {
            mapPortion = RPM.currentMap.getMapPortionByPortion(localPortion);
            let objects = mapPortion.objectsList;
            for (i = 0, l = objects.length; i < l; i++)
            {
                if (objects[i].system.id === objectID)
                {
                    moved = objects[i];
                    break;
                }
            }
            if (moved === null)
            {
                RPM.tryCatch(callback.call(base, RPM.game.hero, objectID, 1, -1, 
                    null, mapsDatas));
            } else
            {
                RPM.tryCatch(callback.call(base, moved, objectID, 1, i, objects, 
                    mapsDatas));
            }
        } else
        {   // Load the file if not already in temp
            let json = await RPM.parseFileJSON(RPM.FILE_MAPS + RPM.currentMap
                .mapName + RPM.STRING_SLASH + SceneMap.getPortionName(
                    globalPortion[0], globalPortion[1], globalPortion[2]));
            mapPortion = new MapPortion(globalPortion[0], globalPortion[1],
                globalPortion[2]);
            moved = mapPortion.getObjFromID(json, objectID);
            if (moved === null)
            {
                RPM.tryCatch(callback.call(base, RPM.game.hero, objectID, 2, -1, 
                    null, mapsDatas));
            } else
            {
                RPM.tryCatch(callback.call(base, moved, objectID, 2, -1, null, 
                    mapsDatas));
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Initialize objet properties
    */
    initializeProperties()
    {
        /*
        let mapProp, mapStatesOpts;
        if (this.isHero) 
        {
            mapProp = RPM.game.heroProperties;
            mapStatesOpts = RPM.game.heroStatesOptions;
        } else if (this.isStartup)
        {
            mapProp = RPM.game.startupProperties[RPM.currentMap.id];
            mapStatesOpts = [];
            if (RPM.isUndefined(mapProp))
            {
                mapProp = [];
            }
        } else
        {
            let obj = RPM.currentMap.allObjects[this.system.id];
            if (RPM.isUndefined(obj))
            {
                RPM.showErrorMessage("Can't find object " + this.system.name +
                    " in object linking. Please remove this object from your " +
                    "map and recreate it.\nIf possible, report that you got " +
                    "this error and describe the steps for having this " +
                    "because we are trying to fix this issue.");
            }
            let portion = SceneMap.getGlobalPortion(obj);
            let portionDatas = RPM.game.getPotionsDatas(RPM.currentMap.id, 
                portion[0], portion[1], portion[2]);
            let indexProp = portionDatas.pi.indexOf(this.system.id);
            mapProp = (indexProp === -1) ? [] : portionDatas.p[indexProp];
            indexProp = portionDatas.soi.indexOf(this.system.id);
            mapStatesOpts = (indexProp === -1) ? [] : portionDatas.so[indexProp];
        }

        // Properties
        this.properties = [];
        let i, l, prop, propValue;
        for (i = 0, l = this.system.properties.length; i < l; i++)
        {
            prop = this.system.properties[i];
            propValue = mapProp[prop.id - 1];
            this.properties[prop.id] = RPM.defaultValue(propValue, prop
                .initialValue.getValue());
        }

        // States
        this.statesInstance = [];
        let stateSystem, stateValue, state;
        for (i = 0, l = this.system.states.length; i < l; i++)
        {
            stateSystem = this.system.states[i];
            stateValue = mapStatesOpts[stateSystem.id - 1];
            state = stateSystem.copyInstance();
            this.statesInstance[i] = state;
            if (!RPM.isUndefined(stateValue))
            {
                state.graphicID = stateValue.gid;
                state.rectTileset = stateValue.gt;
                state.indexX = stateValue.gix;
                state.indexY = stateValue.giy;
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Initialize time events (reactions to event time)
    */
    initializeTimeEvents()
    {
        /*
        let l = this.system.timeEvents.length;
        this.timeEventsEllapsed = new Array(l);
        for (let i = 0; i < l; i++)
        {
            this.timeEventsEllapsed[i] = [this.system.timeEvents[i], new Date()
                .getTime()];
        }
        */
    }

    // -------------------------------------------------------
    /** Update time events
    */
    updateTimeEvents() 
    {
        /*
        // First run detection state
        if (this.currentState && this.currentState.detection !== null)
        {
            this.currentState.detection.update(null, this, null);
        }

        // Run other time events
        let removeList = [];
        let i, l, events, event, timeEllapsed, interval, repeat;
        for (i = 0, l = this.timeEventsEllapsed.length; i < l; i++) {
            events = this.timeEventsEllapsed[i];
            event = events[0];
            timeEllapsed = events[1];
            interval = event.parameters[1].value;
            if (new Date().getTime() - timeEllapsed >= interval.getValue())
            {
                repeat = event.parameters[2].value;
                if (this.receiveEvent(this, true, 1, [null, interval, repeat],
                    this.states, events))
                {
                    if (!repeat.getValue())
                    {
                        removeList.push(i);
                    }
                } else
                {
                    return;
                }
            }
        }

        // Remove useless no repeat events
        for (i = removeList.length - 1; i >= 0; i--)
        {
            this.timeEventsEllapsed.splice(removeList[i], 1);
        }
        */
    }

    // -------------------------------------------------------
    /** Update the current state (graphics to display), also update the mesh
    */
    changeState()
    {
        /*
        let angle = this.mesh ? this.mesh.rotation.y : 0;

        // Remove previous mesh
        this.removeFromScene();

        // Updating the current state
        if (this.isHero)
        {
            this.states = RPM.game.heroStates;
        } else if (this.isStartup)
        {
            if (!RPM.game.startupStates.hasOwnProperty(RPM.currentMap.id))
            {
                RPM.game.startupStates[RPM.currentMap.id] = [1];
            }
            this.states = RPM.game.startupStates[RPM.currentMap.id];
        } else
        {
            let obj = RPM.currentMap.allObjects[this.system.id];
            if (RPM.isUndefined(obj))
            {
                RPM.showErrorMessage("Can't find object " + this.system.name +
                    " in object linking. Please remove this object from your " +
                    "map and recreate it.\nIf possible, report that you got " +
                    "this error and describe the steps for having this " +
                    "because we are trying to fix this issue.");
            }
            let portion = SceneMap.getGlobalPortion(obj);
            let portionDatas = RPM.game.getPotionsDatas(RPM.currentMap.id,
                portion[0], portion[1], portion[2]);
            let indexState = portionDatas.si.indexOf(this.system.id);
            this.states = (indexState === -1) ? [this.system.states.length > 0 ?
                this.system.states[0].id : 1] : portionDatas.s[indexState];
        }
        this.currentState = null;
        this.currentStateInstance = null;
        let state;
        for (let i = this.system.states.length - 1; i >= 0; i--)
        {
            state = this.system.states[i];
            if (this.states.indexOf(state.id) !== -1)
            {
                this.currentState = state;
                this.currentStateInstance = this.statesInstance[i];
                break;
            }
        }

        // Update mesh
        if (this.isStartup)
        {
            return;
        }
        let material = this.currentStateInstance === null ? null : (this
            .currentStateInstance.graphicID === 0 ? RPM.currentMap
            .textureTileset : RPM.currentMap.texturesCharacters[this
            .currentStateInstance.graphicID]);
        this.meshBoundingBox = new Array;
        if (this.currentState !== null && !this.isNone() && material && material
            .map)
        {
            this.speed = RPM.datasGame.system.speeds[this.currentState.speedID];
            this.frequency = RPM.datasGame.system.frequencies[this.currentState
                .frequencyID];
            this.frame.value = this.currentStateInstance.indexX >= RPM.FRAMES ? RPM
                .FRAMES - 1 : this.currentStateInstance.indexX;
            this.orientationEye = this.currentStateInstance.indexY;
            this.updateOrientation();
            let x, y;
            if (this.currentStateInstance.graphicID === 0)
            {
                x = this.currentStateInstance.rectTileset[0];
                y = this.currentStateInstance.rectTileset[1];
                this.width = this.currentStateInstance.rectTileset[2];
                this.height = this.currentStateInstance.rectTileset[3];
            } else
            {
                x = 0;
                y = 0;
                this.width = material.map.image.width / RPM.SQUARE_SIZE / RPM
                    .FRAMES;
                this.height = material.map.image.height / RPM.SQUARE_SIZE / 4;
            }
            let sprite = Sprite.create(this.currentState.graphicKind, [x, y, 
                this.width, this.height]);
            let result = sprite.createGeometry(this.width, this.height, false,
                this.position);
            let geometry = result[0];
            let objCollision = result[1];
            this.mesh = new Physijs.ConvexMesh(geometry, material);
            this.mesh.position.set(this.position.x, this.position.y, this
                .position.z);
            this.boundingBoxSettings = objCollision[1][0];
            if (this.currentStateInstance.graphicID === 0)
            {
                let picture = RPM.currentMap.mapProperties.tileset.picture;
                this.boundingBoxSettings.squares = picture ? picture
                    .getSquaresForTexture(this.currentStateInstance.rectTileset) : [];
            }
            this.updateBB(this.position);
            this.updateUVs();
            this.updateAngle(angle);
        } else
        {
            this.mesh = null;
            this.boundingBoxSettings = null;
            this.speed = this.currentState === null ? SystemValue
                .createNumberDouble(1) : RPM.datasGame.system.speeds[this
                .currentState.speedID];
            this.frequency = this.currentState === null ? SystemValue
                .createNumberDouble(0) : RPM.datasGame.system.frequencies[this
                .currentState.frequencyID];
            this.width = 0;
            this.height = 0;
        }

        // Add to the scene
        this.addToScene();
        */
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the object
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        /*
        this.position = RPM.positionToVector3(json.k);
        this.system = new SystemObject(json.v);*/
    }

    // -------------------------------------------------------
    /** Simulate moving object position
    *   @param {Orientation} orientation The orientation to move
    *   @param {number} distance The distance
    *   @param {number} angle The angle
    *   @returns {THREE.Vector3}
    */
    getFuturPosition(orientation, distance, angle)
    {
        /*
        let position = new THREE.Vector3(this.previousPosition.x, this
            .previousPosition.y, this.previousPosition.z);

        // The speed depends on the time elapsed since the last update
        let w = RPM.currentMap.mapProperties.length * RPM.SQUARE_SIZE;
        let h = RPM.currentMap.mapProperties.width * RPM.SQUARE_SIZE;
        let xPlus, zPlus, res;
        if (orientation === Orientation.South || this.previousOrientation ===
            Orientation.South)
        {
            xPlus = distance * RPM.cos(angle * Math.PI / 180.0);
            zPlus = distance * RPM.sin(angle * Math.PI / 180.0);
            res = position.z - zPlus;
            if (res >= 0 && res < h)
            {
                position.setZ(res);
            }
            res = position.x - xPlus;
            if (res >= 0 && res < w)
            {
                position.setX(res);
            }
        }
        if (orientation === Orientation.West || this.previousOrientation ===
            Orientation.West)
        {
            xPlus = distance * RPM.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * RPM.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x + xPlus;
            if (res >= 0 && res < w)
            {
                position.setX(res);
            }
            res = position.z + zPlus;
            if (res >= 0 && res < h)
            {
               position.setZ(res);
            }
        }
        if (orientation === Orientation.North || this.previousOrientation ===
            Orientation.North)
        {
            xPlus = distance * RPM.cos(angle * Math.PI / 180.0);
            zPlus = distance * RPM.sin(angle * Math.PI / 180.0);
            res = position.z + zPlus;
            if (res >= 0 && res < h)
            {
                position.setZ(res);
            }
            res = position.x + xPlus;
            if (res >= 0 && res < w)
            {
                position.setX(res);
            }
        }
        if (orientation === Orientation.East || this.previousOrientation ===
            Orientation.East)
        {
            xPlus = distance * RPM.cos((angle - 90.0) * Math.PI / 180.0);
            zPlus = distance * RPM.sin((angle - 90.0) * Math.PI / 180.0);
            res = position.x - xPlus;
            if (res >= 0 && res < w)
            {
                position.setX(res);
            }
            res = position.z - zPlus;
            if (res >= 0 && res < h)
            {
                position.setZ(res);
            }
        }

        // Collision
        this.updateBBPosition(position);
        let yMountain = null;
        let blocked = false;
        let i, l, result;
        for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
        {
            this.currentBoundingBox = this.meshBoundingBox[i];
            result = MapPortion.checkCollisionRay(this.position, position, this);
            if (result[0])
            {
                blocked = true;
                position = this.position;
                break;
            }
            if (result[1] !== null)
            {
                yMountain = result[1];
            }
        }
        // If not blocked and possible Y up/down, check if there is no collision
        // on top
        if (!blocked && yMountain !== null)
        {
            position.setY(yMountain);
            for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
            {
                this.currentBoundingBox = this.meshBoundingBox[i];
                result = MapPortion.checkCollisionRay(this.position, position,
                    this);
                if (result[0])
                {
                    position = this.position;
                    break;
                }
            }
        }
        this.updateBBPosition(this.position);
        return position;
        */
    }

    // -------------------------------------------------------
    /** Check collision with another object
    *   @param {MapObject} object The other map object
    *   @returns {boolean}
    */
    checkCollisionObject(object)
    {
        /*
        let i, j, l, m;
        for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
        {
            for (j = 0, m = object.meshBoundingBox.length; j < m; j++)
            {
                if (CollisionsUtilities.obbVSobb(this.meshBoundingBox[i]
                    .geometry, object.meshBoundingBox[j].geometry))
                {
                    return true;
                }
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check the collision detection
    *   @returns {THREE.Vector3}
    */
    checkCollisionDetection()
    {
        /*
        let i, l;
        for (i = 0, l = this.meshBoundingBox.length; i < l; i++)
        {
            if (CollisionsUtilities.obbVSobb(this.meshBoundingBox[i].geometry,
                RPM.BB_BOX_DETECTION.geometry))
            {
                return true;
            }
        }
        // If no bounding box, use only one square by default
        if (l === 0)
        {
            MapPortion.applyBoxSpriteTransforms(RPM.BB_BOX_DEFAULT_DETECTION, [
                this.position.x, this.position.y + (RPM.SQUARE_SIZE / 2), this
                .position.z, RPM.SQUARE_SIZE, RPM.SQUARE_SIZE, RPM.SQUARE_SIZE, 
                0, 0, 0]);
            if (CollisionsUtilities.obbVSobb(RPM.BB_BOX_DEFAULT_DETECTION
                .geometry, RPM.BB_BOX_DETECTION.geometry))
            {
                return true;
            }
        }
        return false;
        */
    }

    // -------------------------------------------------------
    /** Check if two objects can be in the same floor rect (need test collision)
    *   @param {MapObject} object The other map object
    *   @returns {boolean}
    */
    isInRect(object)
    {
        /*
        return (this.position.x - Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            < (object.position.x + Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            && (this.position.x + Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            > (object.position.x - Math.floor(this.width * RPM.SQUARE_SIZE / 2))
            && (this.position.z - Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            < (object.position.z + Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            && (this.position.z + Math.floor(this.width * RPM.SQUARE_SIZE / 2)) 
            > (object.position.z - Math.floor(this.width * RPM.SQUARE_SIZE / 2));
            */
    }

    // -------------------------------------------------------
    /** Only updates the bounding box mesh position
    *   @param {THREE.Vector3} position Position to update
    */
    updateBB(position)
    {
        /*
        if (this.currentStateInstance.graphicID !== 0)
        {
            this.boundingBoxSettings.squares = RPM.currentMap.collisions
                [PictureKind.Characters][this.currentStateInstance.graphicID]
                [this.getStateIndex()];
        }
        this.boundingBoxSettings.b = new Array;
        this.removeBBFromScene();
        let box;
        for (let i = 0, l = this.boundingBoxSettings.squares.length; i < l; i++)
        {
            this.boundingBoxSettings.b.push(CollisionSquare.getBB(this
                .boundingBoxSettings.squares[i], this.width, this.height));
            if (this.currentState.graphicKind === ElementMapKind.SpritesFix)
            {
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
                    ]
                );
            } else
            {
                box = MapPortion.createOrientedBox();
                MapPortion.applyOrientedBoxTransforms(
                    box, [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]
                );
            }
            this.meshBoundingBox.push(box);
        }
        this.addBBToScene();
        */
    }

    // -------------------------------------------------------
    /** Only updates the bounding box mesh position
    *   @param {THREE.Vector3} position Position to update
    */
    updateBBPosition(position)
    {
        /*
        for (let i = 0, l = this.meshBoundingBox.length; i < l; i++)
        {
            if (this.currentState.graphicKind === ElementMapKind.SpritesFix) {
                MapPortion.applyBoxSpriteTransforms(
                    this.meshBoundingBox[i], [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]
                );
            } else
            {
                MapPortion.applyOrientedBoxTransforms(
                    this.meshBoundingBox[i], [
                        position.x + this.boundingBoxSettings.b[i][0],
                        position.y + this.boundingBoxSettings.b[i][1],
                        position.z + this.boundingBoxSettings.b[i][2],
                        this.boundingBoxSettings.b[i][3],
                        this.boundingBoxSettings.b[i][4],
                    ]
                );
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Move the object (one step)
    *   @param {Orientation} orientation Orientation to move
    *   @param {number} limit Max distance to go
    *   @param {number} angle The angle
    *   @param {number} isCameraOrientation Indicate if this should take 
    *   account of camera orientation
    *   @returns {number[]}
    */
    move(orientation, limit, angle, isCameraOrientation)
    {
        /*
        if (this.removed)
        {
            return [0, 0];
        }
        
        // Remove from move
        this.removeMoveTemp();

        // Set position
        let speed = this.speed.getValue() * MapObject.SPEED_NORMAL * RPM
            .averageElapsedTime * RPM.SQUARE_SIZE;
        if (this.otherMoveCommand !== null)
        {
            speed *= Math.SQRT1_2;
        }
        let normalDistance = Math.min(limit, speed);
        let position = this.getFuturPosition(orientation, normalDistance, angle);
        let distance = (position.equals(this.position)) ? 0 : normalDistance;
        if (this.previousOrientation !== null)
        {
            orientation = this.previousOrientation;
        }
        if (isCameraOrientation)
        {
            orientation = RPM.mod(orientation + RPM.currentMap.camera
                .getMapOrientation() - 2, 4);
        }
        this.position.set(position.x, position.y, position.z);

        // Update orientation
        this.orientationEye = orientation;
        orientation = this.orientation;
        if (this.currentState.setWithCamera)
        {
            this.updateOrientation();
        }
        if (this.orientation !== orientation)
        {
            this.updateUVs();
        }
        this.moving = true;

        // Add to moving objects
        this.addMoveTemp();

        return [distance, normalDistance];
        */
    }

    // -------------------------------------------------------
    /** Teleport the object
    *   @param {THREE.Vector3} position Position to teleport
    */
    teleport(position)
    {
        /*
        if (this.removed)
        {
            return;
        }

        // Remove from move
        this.removeMoveTemp();

        // Set position
        this.position.set(position.x, position.y, position.z);
        this.updateBBPosition(position);
        this.moving = true;

        // Add to moving objects
        this.addMoveTemp();
        */
    }

    // -------------------------------------------------------
    /** Remove datas move temp
    */
    removeMoveTemp()
    {
        /*
        if (!this.isHero)
        {
            let previousPortion = RPM.getPortion(this.position);
            let objects = RPM.game.getPotionsDatas(RPM.currentMap.id,
                previousPortion[0], previousPortion[1], previousPortion[2]);

            // Remove from the moved objects in or out of the portion
            let movedObjects = objects.mout;
            let index = movedObjects.indexOf(this);
            if (index !== -1)
            {
                movedObjects.splice(index, 1);
            }
            movedObjects = objects.min;
            index = movedObjects.indexOf(this);
            if (index !== -1)
            {
                movedObjects.splice(index, 1);
            }

            // Add to moved objects of the original portion if not done yet
            let originalPortion = SceneMap.getGlobalPortion(RPM.currentMap
                .allObjects[this.system.id]);
            objects = RPM.game.getPotionsDatas(RPM.currentMap.id,
                originalPortion[0], originalPortion[1], originalPortion[2]);
            movedObjects = objects.m;
            if (movedObjects.indexOf(this) === -1) {
                movedObjects.push(this);
                movedObjects = RPM.currentMap.getMapPortionByPortion(RPM
                    .currentMap.getLocalPortion(originalPortion)).objectsList;
                index = movedObjects.indexOf(this);
                if (index !== -1)
                {
                    movedObjects.splice(index, 1);
                }
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Add to datas move temp
    */
    addMoveTemp()
    {
        /*
        if (!this.isHero)
        {
            let afterPortion = RPM.getPortion(this.position);
            let objects = RPM.game.getPotionsDatas(RPM.currentMap.id,
                afterPortion[0], afterPortion[1], afterPortion[2]);
            let originalPortion = SceneMap.getGlobalPortion(RPM.currentMap
                .allObjects[this.system.id]);
            if (originalPortion[0] !== afterPortion[0] || originalPortion[1] !==
                afterPortion[1] || originalPortion[2] !== afterPortion[2])
            {
                objects.mout.push(this);
            } else
            {
                objects.min.push(this);   
            }

            // Add or remove from scene
            if (RPM.currentMap.isInPortion(RPM.currentMap.getLocalPortion(
                afterPortion)))
            {
                this.addToScene();
            } else
            {
                this.removeFromScene();
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Add object mesh to scene
    */
    addToScene()
    {
        /*
        if (!this.isInScene && this.mesh !== null)
        {
            RPM.currentMap.scene.add(this.mesh);
            this.isInScene = true;
        }
        */
    }

    // -------------------------------------------------------
    /** Add bounding boxes mesh to scene
    */
    addBBToScene()
    {
        /*
        if (RPM.datasGame.system.showBB)
        {
            for (let i = 0, l = this.meshBoundingBox.length; i < l; i++)
            {
                RPM.currentMap.scene.add(this.meshBoundingBox[i]);
            }
        }
        */
    }

    // -------------------------------------------------------
    /** remove object mesh from scene
    */
    removeFromScene()
    {
        /*
        if (this.isInScene)
        {
            RPM.currentMap.scene.remove(this.mesh);
            this.removeBBFromScene();
            this.isInScene = false;
        }
        */
    }

    // -------------------------------------------------------
    /** Remove bounding boxes mesh from scene
    */
    removeBBFromScene()
    {
        /*
        if (RPM.datasGame.system.showBB)
        {
            for (let i = 0, l = this.meshBoundingBox.length; i < l; i++)
            {
                RPM.currentMap.scene.remove(this.meshBoundingBox[i]);
            }
        }
        this.meshBoundingBox = new Array;
        */
    }

    // -------------------------------------------------------
    /** Receive an event
    *   @param {MapObject} sender The sender of this event
    *   @param {boolean} isSystem Indicate if it is an event System
    *   @param {number} eventID The event ID
    *   @param {Parameter[]} parameters List of all the parameters
    *   @param {number[]} states List of all the current states of the object
    *   @param {number[]} event The time events list
    *   @returns {boolean}
    */
    receiveEvent(sender, isSystem, eventID, parameters, states, event)
    {
        /*
        // Option only one event per frame
        if (this.system.eventFrame && this.receivedOneEvent)
        {
            return false;
        }

        let test = false;
        let i, j, l, m, state, reactions;
        for (i = 0, l = states.length; i < l; i++)
        {
            state = states[i];
            reactions = this.system.getReactions(isSystem, eventID, states[i], 
                parameters);
            for (j = 0, m = reactions.length; j < m; j++)
            {
                RPM.gameStack.top.addReaction(sender, reactions[j], this, state,
                    parameters, event);
                this.receivedOneEvent = true;
                test = true;
                if (this.system.eventFrame)
                {
                    return true;
                }
            }
        }
        return test;
        */
    }

    // -------------------------------------------------------
    /** Update according to camera angle
    *   @param {number} angle The camera angle
    */
    update(angle)
    {
        /*
        if (this.removed)
        {
            return;
        }
        if (this.moveFrequencyTick > 0)
        {
            this.moveFrequencyTick -= RPM.elapsedTime;
        }

        // Graphic updates
        if (this.mesh !== null)
        {
            let frame = false;
            let orientation = this.orientation;
            if (this.moving)
            {
                // If moving, update frame
                if (this.currentState.moveAnimation)
                {
                    frame = this.frame.update(RPM.datasGame.system
                        .mapFrameDuration.getValue() / this.speed.getValue());
                }

                // Update mesh position
                let offset = (this.currentState.pixelOffset && this.frame.value 
                    % 2 !== 0) ? 1 : 0;
                this.mesh.position.set(this.position.x, this.position.y + offset
                    , this.position.z);
                //this.updateBBPosition(this.position);
                this.moving = false;
                this.previousPosition = this.position;
            } else
            {
                frame = this.frame.value !== this.currentStateInstance.indexX;
                this.frame.value = this.currentStateInstance.indexX;

                // Update angle
                if (this.currentState.setWithCamera)
                {
                    this.updateOrientation();
                }
            }
            this.upPosition = new THREE.Vector3(this.position.x, this.position.y 
                + (this.height * RPM.SQUARE_SIZE), this.position.z);
            this.halfPosition = new THREE.Vector3(this.position.x, this.position
                .y + (this.height * RPM.SQUARE_SIZE / 2), this.position.z);
            this.updateAngle(angle);

            // Update mesh
            if (frame || orientation !== this.orientation)
            {
                this.updateUVs();
            }
        }

        // Moving
        this.updateMovingState();

        // Time events
        this.receivedOneEvent = false;
        this.updateTimeEvents();
        */
    }

    // -------------------------------------------------------
    /** Update moving state
    */
    updateMovingState()
    {
        /*
        if (!this.removed && this.currentState && this.currentState
            .objectMovingKind !== ObjectMovingKind.Fix)
        {
            let interpreter = RPM.currentMap.addReaction(null, this.currentState
                .route, this, this.currentState.id, [null], null, true);
            if (interpreter !== null)
            {
                this.movingState = interpreter.currentCommandState;
            }
        }
        */
    }

    // -------------------------------------------------------
    /** Update sprite faces angles
    *   @param {number} angle The camera angle
    */
    updateAngle(angle)
    {
        /*
        if (this.currentState.graphicKind === ElementMapKind.SpritesFace)
        {
            this.mesh.rotation.y = angle;
        }
        */
    }

    // -------------------------------------------------------
    /** Update the orientation according to the camera position
    */
    updateOrientation()
    {
        /*
        this.orientation = RPM.mod((RPM.currentMap.orientation - 2) * 3 + this
            .orientationEye, 4);
            */
    }

    // -------------------------------------------------------
    /** Update the UVs coordinates according to frame and orientation
    */
    updateUVs()
    {
        /*
        if (this.mesh !== null && !this.isNone())
        {
            if (this.mesh.material && this.mesh.material.map)
            {
                let textureWidth = this.mesh.material.map.image.width;
                let textureHeight = this.mesh.material.map.image.height;
                let w, h, x, y;
                if (this.currentStateInstance.graphicID === 0) {
                    w = this.width * RPM.SQUARE_SIZE / textureWidth;
                    h = this.height * RPM.SQUARE_SIZE / textureHeight;
                    x = this.currentStateInstance.rectTileset[0] * RPM
                        .SQUARE_SIZE / textureWidth;
                    y = this.currentStateInstance.rectTileset[1] * RPM
                        .SQUARE_SIZE / textureHeight;
                } else
                {
                    w = this.width * RPM.SQUARE_SIZE / textureWidth;
                    h = this.height * RPM.SQUARE_SIZE / textureHeight;
                    x = (this.frame.value >= RPM.FRAMES ? RPM.FRAMES - 1 : this
                        .frame.value) * w;
                    y = this.orientation * h;
                }
                let coefX = RPM.COEF_TEX / textureWidth;
                let coefY = RPM.COEF_TEX / textureHeight;
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
        */
    }

    // -------------------------------------------------------
    /** Update the material
    */
    updateMaterial()
    {
        /*
        if (!this.isNone())
        {
            this.mesh.material = this.currentStateInstance.graphicID === 0 ?
                RPM.currentMap.textureTileset : RPM.currentMap
                .texturesCharacters[this.currentStateInstance.graphicID];
        } else
        {
            this.mesh = null;
        }
        */
    }

    // -------------------------------------------------------
    /** Get the state index
    *   @returns {number}
    */
    getStateIndex()
    {
        /*
        return this.frame.value + (this.orientation * RPM.FRAMES);
        */
    }

    // -------------------------------------------------------
    /** Check if graphics is none
    *   @returns {boolean}
    */
    isNone()
    {
        /*
        return this.currentState.graphicKind === ElementMapKind.None || this
            .currentStateInstance.graphicID === -1;
            */
    }
}

export { MapObject }