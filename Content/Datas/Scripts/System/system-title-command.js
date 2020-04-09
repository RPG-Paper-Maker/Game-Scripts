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
//  CLASS SystemTitleCommand
//
// -------------------------------------------------------

/** @class
*   A title command of the game.
*/
function SystemTitleCommand() {

}

// -------------------------------------------------------

SystemTitleCommand.prototype.readJSON = function(json) {
   SystemLang.prototype.readJSON.call(this, json);

   this.kind = RPM.jsonDefault(json.k, TitleCommandKind.NewGame);
   this.script = RPM.jsonDefault(json.s, "");
}

// -------------------------------------------------------

SystemTitleCommand.prototype.getAction = function() {
   switch (this.kind) {
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

/** Callback function for starting a new game.
*/
SystemTitleCommand.prototype.startNewGame = function() {
    // Stop video if existing
    if (!$datasGame.titlescreenGameover.isTitleBackgroundVideo) {
        $canvasVideos.stop();
    }

    // Create a new game
    $game = new Game();
    $game.initializeDefault();

    // Add local map to stack
    $gameStack.replace(new SceneMap($datasGame.system.idMapStartHero));

    return true;
}

// -------------------------------------------------------

/** Callback function for loading an existing game.
*/
SystemTitleCommand.prototype.loadGame = function() {
    $gameStack.push(new SceneLoadGame());

    return true;
}

// -------------------------------------------------------

/** Callback function for loading an existing game.
*/
SystemTitleCommand.prototype.showSettings = function() {
    $gameStack.push(new SceneTitleSettings());

    return true;
}

// -------------------------------------------------------

/** Callback function for closing the window.
*/
SystemTitleCommand.prototype.exit = function() {
    quit();

    return true;
}

// -------------------------------------------------------

/** Callback function for closing the window.
*/
SystemTitleCommand.prototype.executeScript = function() {
    RPM.evaluateScript(this.script);

    return true;
}
