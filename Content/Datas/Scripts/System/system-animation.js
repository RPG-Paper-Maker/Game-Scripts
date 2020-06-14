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
    this.positionKind = RPM.defaultValue(json.pk, AnimationPositionKind.Middle);
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
    return RPM.datasGame.pictures.get(PictureKind.Animations, this.pictureID)
        .picture.createCopy();
}

// -------------------------------------------------------

SystemAnimation.prototype.playSounds = function(frame, condition) {
    if (frame > 0 && frame < this.frames.length) {
        this.frames[frame].playSounds(condition);
    }
}

// -------------------------------------------------------

SystemAnimation.prototype.draw = function(picture, frame, battler) {
    if (frame > 0 && frame < this.frames.length) {
        var position;

        // Change position according to kind
        switch (this.positionKind) {
        case AnimationPositionKind.Top:
            position = battler.topPosition;
            break;
        case AnimationPositionKind.Middle:
            position = battler.midPosition;
            break;
        case AnimationPositionKind.Bottom:
            position = battler.botPosition;
            break;
        case AnimationPositionKind.ScreenCenter:
            position = {
                x: 0,
                y: 0
            };
            break;
        }

        // Draw!!!
        this.frames[frame].draw(picture, position, this.rows, this.cols);
    }
}
