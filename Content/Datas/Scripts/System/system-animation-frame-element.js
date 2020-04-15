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
//  CLASS SystemAnimationFrameElement
//
// -------------------------------------------------------

/** @class
*   An animation frame element.
*/
function SystemAnimationFrameElement() {

}

// -------------------------------------------------------

SystemAnimationFrameElement.prototype.readJSON = function(json) {
    this.x = RPM.defaultValue(json.x, 0);
    this.y = RPM.defaultValue(json.y, 0);
    this.texRow = RPM.defaultValue(json.tr, 0);
    this.texCol = RPM.defaultValue(json.tc, 0);
    this.zoom = RPM.defaultValue(json.z, 100) / 100;
    this.angle = RPM.defaultValue(json.a, 0);
    this.flip = RPM.defaultValue(json.fv, false);
    this.opacity = RPM.defaultValue(json.o, 100) / 100;
}

// -------------------------------------------------------

SystemAnimationFrameElement.prototype.draw = function(picture, position, rows,
    cols)
{
    var oW, oH, w, h;

    picture.zoom = this.zoom;
    picture.opacity = this.opacity;
    picture.angle = this.angle;
    picture.centered = true;
    picture.reverse = this.flip;
    w = picture.oW / cols;
    h = picture.oH / rows;

    picture.draw(position.x + this.x, position.y + this.y, w * this.zoom, h *
        this.zoom, w * this.texCol, h * this.texRow, w, h, false);
}
