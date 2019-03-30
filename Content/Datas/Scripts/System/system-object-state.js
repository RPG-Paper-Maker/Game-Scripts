/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
function SystemObjectState(){

}

SystemObjectState.prototype = {

    /** Read the JSON associated to the object state.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        this.indexX = json.x;
        this.indexY = json.y;
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
    }
}
