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
//  CLASS SystemCommonReaction
//
// -------------------------------------------------------

/** @class
*   A common reaction.
*   @property {boolean} blockingHero Indicates if this reaction is blocking
*   the hero.
*   @property {Object} labels Hash of all the labels.
*   @property {Tree} commands All the commands.
*/
function SystemCommonReaction() {
    SystemObjectReaction.call(this);
}

SystemCommonReaction.prototype = Object.create(SystemObjectReaction.prototype);

/** Read the JSON associated to the object reaction.
*   @param {Object} json Json object describing the object.
*/
SystemCommonReaction.prototype.readJSON = function(json) {
    SystemObjectReaction.prototype.readJSON.call(this, json);

    this.parameters = SystemParameter.readParameters(json);
}
