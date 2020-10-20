/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A reaction to an event
*   @property {string[]} [labels=[]] List of all labels
*   @property {number} idEvent The event ID
*   @property {boolean} blockingHero Indicate if this reaction is blocking the 
*   hero
*   @property {Tree} commands All the commands
*   @param {Object} [json=undefined] Json object describing the object reaction
*/
class SystemObjectReaction
{
    constructor(json)
    {
        this.labels = [];
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the object reaction
    *   @param {Object} json Json object describing the object reaction
    */
    read(json)
    {
        this.idEvent = json.id;

        // Options
        this.blockingHero = json.bh;

        // Read commands
        let jsonCommands = json.c;
        let commands = new Tree("root");
        this.readChildrenJSON(jsonCommands, commands);
        this.commands = commands;
    }

    // -------------------------------------------------------
    /** Read the JSON children associated to the object reaction
    *   @param {Object} jsonCommands Json object describing the object
    *   @param {Tree} commands All the commands (final result)
    */
    readChildrenJSON(jsonCommands,commands)
    {
        let choice = null;
        let command, node;
        for (let i = 0, l = jsonCommands.length; i < l; i++)
        {
            command = EventCommand.getEventCommand(jsonCommands[i]);

            // Comment
            if (command instanceof EventCommandComment)
            {
                continue;
            }

            // Add node
            node = commands.add(command);

            // If text before choice, make a link
            if (command instanceof EventCommandShowText)
            {
                choice = command;
            } else if (command instanceof EventCommandDisplayChoice)
            {
                command.setShowText(choice);
                choice = null;
            } else if (command instanceof EventCommandLabel) // Label
            {
                this.labels.push([command.label, node]);
            }
            if (jsonCommands[i].children)
            {
                this.readChildrenJSON(jsonCommands[i].children, node);
            }
        }
    }

    // -------------------------------------------------------
    /** Get the first node command of the reaction
    *   @returns {Node}
    */
    getFirstCommand()
    {
        return this.commands.root.firstChild;
    }
}