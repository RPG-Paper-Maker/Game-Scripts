/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   The game stack that is organizing the game scenes
*   @property {SceneGame[]} content The stack content
*   @property {SceneGame[]} top The stack top content
*   @property {SceneGame[]} subTop The stack top - 1 content
*   @property {SceneGame[]} bot The stack bot content
*/
class GameStack
{
    constructor()
    {
        this.content = [];
        this.top = null;
        this.subTop = null;
        this.bot = null;
    }

    // -------------------------------------------------------
    /** Push a new scene in the stack
    *   @param {SceneGame} scene The scene to push
    */
    push(scene)
    {
        this.content.push(scene);
        this.top = scene;
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Pop (remove) the last scene in the stack
    *   @returns {SceneGame} The last scene that is removed
    */
    pop()
    {
        let scene = this.content.pop();
        this.top = this.at(this.content.length - 1);
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        scene.close();
        RPM.requestPaintHUD = true;
        return scene;
    }

    // -------------------------------------------------------
    /** Pop (remove) all the scene in the stack
    */
    popAll()
    {
        let scene;
        for (let i = this.content.length - 1; i >= 0; i--)
        {
            scene = this.content.pop();
            scene.close();
        }
        this.top = null;
        this.subTop = null;
        this.bot = null;
        RPM.requestPaintHUD = true;
        return scene;
    }

    // -------------------------------------------------------
    /** Replace the last scene in the stack by a new scene
    *   @param {SceneGame} scene The scene to replace
    *   @returns {SceneGame} The last scene that is replaced
    */
    replace(scene)
    {
        let pop = this.pop();
        this.push(scene);
        return pop;
    }

    // -------------------------------------------------------
    /** Get the scene at a specific index in the stack. 0 is the bottom of the
    *   stack
    *   @param {number} i Index in the stack
    *   @returns {SceneGame} The scene in the index of the stack
    */
    at(i)
    {
        return RPM.defaultValue(this.content[i], null);
    }

    // -------------------------------------------------------
    /** Check if the stack is empty
    *   @returns {boolean}
    */
    isEmpty()
    {
        return this.top === null;
    }

    // -------------------------------------------------------
    /** Check if top content is loading
    *   @returns {boolean}
    */
    isLoading()
    {
        return this.isEmpty() || this.top.loading;
    }

    // -------------------------------------------------------
    /** Push the title screen when empty
     *   @returns {SceneTitleScreen}
     */
    pushTitleScreen()
    {
        let scene = new SceneTitleScreen();
        this.push(scene);
        return scene;
    }

    // -------------------------------------------------------
    /** Update the stack
    */
    update()
    {
        this.top.update();
    }

    // -------------------------------------------------------
    /** First key press handle for the current stack
    *   @param {number} key The key ID pressed
    */
    onKeyPressed(key)
    {
        if (!this.isEmpty())
        {
            this.top.onKeyPressed(key);
        }
    }

    // -------------------------------------------------------
    /** First key release handle for the current stack
    *   @param {number} key The key ID released
    */
    onKeyReleased(key)
    {
        if (!this.isEmpty())
        {
            this.top.onKeyReleased(key);
        }
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle for the current stack
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedRepeat(key)
    {
        return this.isEmpty() ? true : this.top.onKeyPressedRepeat(key);
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle for the current stack, but with
    *   a small wait after the first pressure (generally used for menus)
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedAndRepeat(key)
    {
        return this.isEmpty() ? true : this.top.onKeyPressedAndRepeat(key);
    }

    // -------------------------------------------------------
    /** Draw the 3D for the current stack
    */
    draw3D()
    {
        if (!this.isEmpty())
        {
            this.top.draw3D();
        }
    }

    // -------------------------------------------------------
    /** Draw HUD for the current stack
    */
    drawHUD()
    {
        if (!this.isEmpty())
        {
            // Display < 0 index image command
            let i, l, v;
            for (i = 0, l = RPM.displayedPictures.length; i < l; i++) 
            {
                v = RPM.displayedPictures[i];
                if (v[0] >= 0)
                {
                    break;
                }
                v[1].draw();
            }

            // Draw system HUD
            this.top.drawHUD();

            // Display >= 0 index image command
            for (; i < l; i++) 
            {
                RPM.displayedPictures[i][1].draw();
            }
        }
    }
}