/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A title command of the game
*   @extends SystemLang
*   @property {TitleCommandKind} kind The title command kind
*   @property {string} script The script formula
*   @param {Object} [json=undefined] Json object describing the title screen command
*/
class SystemTitleCommand extends SystemLang
{
    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the title screen command
    *   @param {Object} json Json object describing the title screen command
    */
    read(json)
    {
        super.read(json);
    
        this.kind = RPM.defaultValue(json.k, TitleCommandKind.NewGame);
        this.script = RPM.defaultValue(json.s, RPM.STRING_EMPTY);
    }
    
    // -------------------------------------------------------
    /** Get the action function according to kind
    *   @returns {function}
    */
    getAction()
    {
        switch (this.kind)
        {
        case TitleCommandKind.NewGame:
            return this.startNewGame;
        case TitleCommandKind.LoadGame:
            return this.loadGame;
        case TitleCommandKind.Settings:
            return this.showSettings;
        case TitleCommandKind.Exit:
            return this.exit;
        case TitleCommandKind.Script:
            return this.executeScript;
        }
    }
    
    // -------------------------------------------------------
    /** Callback function for start a new game
    *   @returns {boolean}
    */
    startNewGame()
    {
        // Stop video and songs if existing
        if (!RPM.datasGame.titlescreenGameover.isTitleBackgroundImage)
        {
            Platform.canvasVideos.classList.add(RPM.CLASS_HIDDEN);
            Platform.canvasVideos.pause();
            Platform.canvasVideos.src = RPM.STRING_EMPTY;
        }
        RPM.songsManager.stopAll();
    
        // Create a new game
        RPM.game = new Game();
        RPM.game.initializeDefault();
    
        // Add local map to stack
        RPM.gameStack.replace(new SceneMap(RPM.datasGame.system.idMapStartHero));
    
        return true;
    }
    
    // -------------------------------------------------------
    /** Callback function for loading an existing game
    *   @returns {boolean}
    */
    loadGame()
    {
        RPM.gameStack.push(new SceneLoadGame());
        return true;
    }
    
    // -------------------------------------------------------
    /** Callback function for loading an existing game
    *   @returns {boolean}
    */
    showSettings()
    {
        RPM.gameStack.push(new SceneTitleSettings());
        return true;
    }
    
    // -------------------------------------------------------
    /** Callback function for closing the window
    *   @returns {boolean}
    */
    exit()
    {
        Platform.quit();
        return true;
    }
    
    // -------------------------------------------------------
    /** Callback function for closing the window
    *   @returns {boolean}
    */
    executeScript()
    {
        RPM.evaluateScript(this.script);
        return true;
    }
}
