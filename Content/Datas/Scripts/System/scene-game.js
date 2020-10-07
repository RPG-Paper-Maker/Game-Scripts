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
//  CLASS SceneGame
//
// -------------------------------------------------------

/** @class
*   Abstract class for the game stack.
*   @property {ReactionInterpreter[]} reactionInterpreters The reaction
*   interpreters for parallel reactions.
*   @property {EventCommand[]} parallelCommands Commands that are still running
*   without blocking any other command.
*   @property {function} [callBackAfterLoading=null] A function to call after
*   loading completed. The function should be put to null after all the stuff
*   done.
*/
class SceneGame
{
    constructor(loading = true)
    {
        this.reactionInterpreters = new Array;
        this.parallelCommands = new Array;
        if (loading)
        {
            this.loading = true;
            RPM.tryCatch(this.load());
        }
    }

    async load()
    {
        this.loading = false;
    }

    /** Update the scene
    */
    update()
    {
        // Check diagonal moves
        let i, l;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].updateObjectMoveState();
        }
        for (i = 0, l = this.parallelCommands.length; i < l; i++)
        {
            this.parallelCommands[i].updateObjectMoveState();
        }

        // Parallel reactions
        SceneGame.prototype.updateInterpreters.call(this);

        // Parallel comands
        SceneGame.prototype.updateParallelCommands.call(this);
    }

    // -------------------------------------------------------

    /** Update all the reactions
    */
    updateInterpreters()
    {
        // Index of all the finished parallel reactions
        let endingReactions = new Array;

        // Updating blocking hero
        RPM.blockingHero = false;
        let i, l, interpreter;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            if (this.reactionInterpreters[i].currentReaction.blockingHero)
            {
                RPM.blockingHero = true;
                break;
            }
        }

        // Updating all reactions
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            interpreter = this.reactionInterpreters[i];
            interpreter.update();
            if (interpreter.isFinished())
            {
                interpreter.updateFinish();
                endingReactions.push(i);
            }
            // If changed map, STOP
            if (RPM.currentMap.loading)
            {
                return;
            }
        }

        // Deleting finished reactions
        for (i = endingReactions.length - 1; i >= 0; i--)
        {
            this.reactionInterpreters.splice(endingReactions[i], 1);
        }
    }

    // -------------------------------------------------------
    /** Update all the parallel commands
    */
    updateParallelCommands()
    {
        let endingCommands = new Array; // Index of all the finished commands
        let i, l, previousCommand, command;
        for (i = 0, l = this.parallelCommands.length; i < l; i++)
        {
            previousCommand = this.parallelCommands[i].currentCommand;
            command = this.parallelCommands[i].updateCommand();
            if (previousCommand !== command)
            {
                endingCommands.push(i);
            }
        }
        for (i = endingCommands.length - 1; i >= 0; i--)
        {
            this.parallelCommands.splice(endingCommands[i], 1);
        }
    }

    // -------------------------------------------------------
    /** Add a reaction in the interpreter list.
    *   @param {MapObject} sender The sender of this reaction.
    *   @param {SystemReaction} reaction The reaction to add.
    *   @param {MapObject} object The object reacting.
    *   @param {number} state The state ID.
    *   @param {SystemParameter[]} parameters All the parameters coming with
    *   this reaction.
    */
    addReaction(sender, reaction, object, state, parameters, event, moving)
    {
        if (reaction.getFirstCommand() !== null)
        {
            let excecuted = false;
            let reactionInterpreter;
            for (let i = 0, l = this.reactionInterpreters.length; i < l; i++)
            {
                reactionInterpreter = this.reactionInterpreters[i];
                if (reactionInterpreter.currentMapObject === object &&
                    reactionInterpreter.currentReaction === reaction)
                {
                    excecuted = true;
                    break;
                }
            }
            if (!excecuted)
            {
                reactionInterpreter = new ReactionInterpreter(sender, reaction,
                    object, state, parameters, event);
                this.reactionInterpreters.push(reactionInterpreter);
                if (!moving)
                {
                    if (object.movingState !== null)
                    {
                        object.movingState.pause = true;
                    }
                }

                return reactionInterpreter;
            }
        }
        return null;
    }

    // -------------------------------------------------------
    /** First key press handle.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed(key)
    {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].onKeyPressed(key);
        }
    }

    // -------------------------------------------------------
    /** First key release handle.
    *   @param {number} key The key ID released.
    */
    onKeyReleased(key)
    {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].onKeyReleased(key);
        }
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle.
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedRepeat(key)
    {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].onKeyPressedRepeat(key);
        }
        return true;
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat(key)
    {
        for (let i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].onKeyPressedAndRepeat(key);
        }
    }

    // -------------------------------------------------------
    /** Draw the 3D
    */
    draw3D()
    {

    }

    // -------------------------------------------------------

    /** Draw HUD.
    */
    drawHUD()
    {
        let i, l;
        for (i = 0, l = this.reactionInterpreters.length; i < l; i++)
        {
            this.reactionInterpreters[i].drawHUD();
        }
        for (i = 0, l = this.parallelCommands.length; i < l; i++)
        {
            this.parallelCommands[i].drawHUD();
        }
    }

    close()
    {

    }
}
