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
//  CLASS SystemState
//
// -------------------------------------------------------

/** @class
*   A possible state of an object.
*   @property {number} id ID.
*   @property {number} graphicID ID of the graphic texture.
*   @property {MapEditorSubSelectionKind} graphicKind The kind of graphic.
*   @property {number} indexX
*   @property {number} indexY
*   @property {boolean} moveAnimation Indicate if the abject is animated when
*   moving.
*   @property {boolean} stopAnimation Indicate if the abject is animated when
*   not moving.
*   @property {boolean} climbAnimation Indicate if the abject is animated when
*   climbing.
*   @property {boolean} directionFix Indicate if the abject is looking the
*   object sending reaction to him.
*   @property {boolean} through Indicate if the abject can be passed through.
*   @property {boolean} setWithAnimation Indicate if the abject orientation is
*   updated according to the camera.
*   @property {boolean} pixelOffset Indicate if there is a pixel offset for
*   impair frames when moving.
*   @property {boolean} keepPosition Indicate if the object should keep the
*   position after moving (after changing map / save).
*/
function SystemObjectState() {

}

SystemObjectState.prototype = {

    /** Read the JSON associated to the object state.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        var jsonRoute;

        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        if (this.graphicID === 0) {
            this.rectTileset = json.rt;
        } else {
            this.indexX = json.x;
            this.indexY = json.y;
        }
        this.objectMovingKind = RPM.jsonDefault(json.omk, ObjectMovingKind.Fix);
        jsonRoute = RPM.jsonDefault(json.ecr, {
            kind: EventCommandKind.MoveObject,
            command: [PrimitiveValueKind.DataBase, -1, 1, 1, 0, CommandMoveKind
                .MoveRandom, 0]
        });
        this.route = new SystemObjectReaction();
        this.route.readJSON({
            bh: false,
            c: [jsonRoute]
        });
        this.speedID = RPM.jsonDefault(json.s, 1);
        this.frequencyID = RPM.jsonDefault(json.f, 1);
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
        this.detection = RPM.jsonDefault(json.ecd, null);
        if (this.detection !== null) {
            this.detection = EventCommand.getEventCommand(this.detection);
        }
    }
}
