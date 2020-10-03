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
//  CLASS GameStack
//
// -------------------------------------------------------

/** @class
*   The game stack that is organizing the game scenes.
*   @property {SceneGame[]} content The stack content.
*/
function GameStack(){
    this.content = [];
    this.top = null;
    this.subTop = null;
    this.bot = null;
}

GameStack.prototype = {

    /** Push a new scene in the stack.
    *   @param {SceneGame} scene The scene to push.
    */
    push: function(scene)
    {
        this.top = scene;
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        this.content.push(scene);
        RPM.requestPaintHUD = true;
    },

    // -------------------------------------------------------

    /** Pop (remove) the last scene in the stack.
    *   @returns {SceneGame} The last scene that is removed.
    */
    pop: function()
    {
        this.top = this.at(this.content.length - 1);
        this.subTop = this.at(this.content.length - 2);
        this.bot = this.at(0);
        let scene = this.content.pop();
        scene.close();
        RPM.requestPaintHUD = true;
        
        return scene;
    },

    // -------------------------------------------------------

    /** Replace the last scene in the stack by a new scene.
    *   @param {SceneGame} scene The scene to replace.
    *   @returns {SceneGame} The last scene that is replaced.
    */
    replace: function(scene) {
        var pop = this.pop();
        this.push(scene);

        return pop;
    },

    // -------------------------------------------------------

    /** Get the scene at a specific index in the stack. 0 is the bottom of the
    *   stack.
    *   @param {number} i Index in the stack.
    *   @returns {SceneGame} The scene in the index of the stack.
    */
    at: function(i) {
        return RPM.defaultValue(this.content[i], null);
    },

    // -------------------------------------------------------

    /** Check if the stack is empty.
    *   @returns {boolean}
    */
    isEmpty: function() {
        return this.top === null;
    },

    isLoading: function()
    {
        return this.isEmpty || this.top.loading;
    },

    // -------------------------------------------------------
    /** Push the title screen when empty.
    *   @returns {SceneTitleScreen}
    */
    pushTitleScreen: function() {
        var scene = new SceneTitleScreen();
        this.push(scene);

        return scene;
    },

    // -------------------------------------------------------

    /** Update the stack.
    */
    update: function() {
        this.top().update();
    },

    // -------------------------------------------------------

    /** First key press handle for the current stack.
    *   @param {number} key The key ID pressed.
    */
    onKeyPressed: function(key){
        if (!this.isEmpty())
            this.top().onKeyPressed(key);
    },

    // -------------------------------------------------------

    /** First key release handle for the current stack.
    *   @param {number} key The key ID released.
    */
    onKeyReleased: function(key){
        if (!this.isEmpty())
            this.top().onKeyReleased(key);
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack.
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedRepeat: function(key){
        if (!this.isEmpty())
            return this.top().onKeyPressedRepeat(key);

        return true;
    },

    // -------------------------------------------------------

    /** Key pressed repeat handle for the current stack, but with
    *   a small wait after the first pressure (generally used for menus).
    *   @param {number} key The key ID pressed.
    *   @returns {boolean} false if the other keys are blocked after it.
    */
    onKeyPressedAndRepeat: function(key){
        if (!this.isEmpty())
            return this.top().onKeyPressedAndRepeat(key);

        return true;
    },

    // -------------------------------------------------------

    /** Draw the 3D for the current stack.
    *   @param {Canvas} canvas The 3D canvas.
    */
    draw3D: function(canvas){
        if (!this.isEmpty())
            this.top().draw3D(canvas);
    },

    // -------------------------------------------------------

    /** Draw HUD for the current stack.
    */
    drawHUD: function() {
        if (!this.isEmpty()) {
            var i, l, v;

            // Display < 0 index image command
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
