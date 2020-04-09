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
//  CLASS SystemAnimationFrameEffect
//
// -------------------------------------------------------

/** @class
*   An animation frame effect.
*/
function SystemAnimationFrameEffect() {

}

// -------------------------------------------------------

SystemAnimationFrameEffect.prototype.readJSON = function(json) {
    this.isSE = RPM.defaultValue(json.ise, true);
    if (this.isSE) {
        this.se = new SystemPlaySong(SongKind.Sound);
        this.se.readJSON(json.se);
    }
    this.condition = RPM.defaultValue(json.c, AnimationEffectConditionKind.None);
}

// -------------------------------------------------------

SystemAnimationFrameEffect.prototype.playSE = function(condition) {
    if (this.isSE && (this.condition === AnimationEffectConditionKind.None ||
        this.condition === condition))
    {
        this.se.playSound();
    }
}
