/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemAnimation
//
// -------------------------------------------------------

/** @class
*   An animation of a skill / item / weapon or for display animation command.
*/
function SystemAnimation() {

}

// -------------------------------------------------------

SystemAnimation.prototype.readJSON = function(json) {
    var i, l, jsonFrames, jsonFrame, frame;

    this.pictureID = RPM.defaultValue(json.pid, 1);
    this.positionKind = RPM.defaultValue(json.pk, AnimationPositionKind.Top);
    jsonFrames = json.f;
    l = jsonFrames.length;
    this.frames = new Array(l + 1);
    for (i = 0; i < l; i++) {
        jsonFrame = jsonFrames[i];
        frame = new SystemAnimationFrame();
        frame.readJSON(jsonFrame);
        this.frames[jsonFrame.id] = frame;
    }
    this.rows = RPM.defaultValue(json.r, 5);
    this.cols = RPM.defaultValue(json.c, 5);
}

// -------------------------------------------------------

SystemAnimation.prototype.createPicture = function() {
    return $datasGame.pictures.get(PictureKind.Animations, this.pictureID)
        .picture.createCopy();
}

// -------------------------------------------------------

SystemAnimation.prototype.draw = function(picture, frame, position) {
    if (frame > 0 && frame < this.frames.length) {
        this.frames[frame].draw(picture, position, this.rows, this.cols);
    }
}
