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
//  CLASS SystemObjectReaction
//
// -------------------------------------------------------

/** @class
*   A reaction to an event.
*/
function SystemObjectReaction() {
    this.labels = new Array; // TODO
}

/** Read the JSON associated to the object reaction.
*   @param {Object} json Json object describing the object.
*/
SystemObjectReaction.prototype.readJSON = function(json) {
    this.idEvent = json.id;

    // Options
    this.blockingHero = json.bh;

    // Read commands
    var jsonCommands = json.c;
    var commands = new Tree("root");
    this.readChildrenJSON(jsonCommands, commands);
    this.commands = commands;
}

// -------------------------------------------------------

/** Read the JSON children associated to the object reaction.
*   @param {Object} jsonCommands Json object describing the object.
*   @param {Tree} commands All the commands (final result).
*/
SystemObjectReaction.prototype.readChildrenJSON = function(jsonCommands,
    commands)
{
    var node, command, choice;

    choice = null;
    for (var j = 0, ll = jsonCommands.length; j < ll; j++){
        command = EventCommand.getEventCommand(jsonCommands[j]);

        // If text before choice, make a link
        if (command instanceof EventCommandShowText) {
            choice = command;
        } else if (command instanceof EventCommandDisplayChoice) {
            command.setShowText(choice);
            choice = null;
        }
        node = commands.add(command);
        if (jsonCommands[j].hasOwnProperty("children")) {
            this.readChildrenJSON(jsonCommands[j].children, node);
        }
    }
}

// -------------------------------------------------------

/** Get the first node command of the reaction.
*   @returns {Node}
*/
SystemObjectReaction.prototype.getFirstCommand = function() {
    return this.commands.root.firstChild;
}
