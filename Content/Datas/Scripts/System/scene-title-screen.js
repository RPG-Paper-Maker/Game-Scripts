/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SceneTitleScreen : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the title screen.
*   @extends SceneGame
*   @property {WindowChoices} windowChoicesCommands A window choices for
*   choosing a command.
*/
function SceneTitleScreen() {
    SceneGame.call(this);

    var commands, commandsActions;

    // Initializing commands (texts and actions)
    commands = [
        new GraphicText("New game"),
        new GraphicText("Load game"),
        new GraphicText("Exit")
    ];
    commandsActions = [
        SceneTitleScreen.prototype.startNewGame,
        SceneTitleScreen.prototype.loadGame,
        SceneTitleScreen.prototype.exit
    ];

    // Creating pictures
    this.pictureLogo = Picture2D.createImageWithID($datasGame
        .titlescreenGameover.titleLogoID, PictureKind.TitleScreen, null);
    this.pictureBackground = Picture2D.createImageWithID($datasGame
        .titlescreenGameover.titleBackgroundID, PictureKind.TitleScreen);

    // Windows
    this.windowChoicesCommands = new WindowChoices(OrientationWindow.Vertical,
        $SCREEN_X / 2 - 100, 300, 200, 50, 3, commands, commandsActions);

    // Play title screen song
    $datasGame.titlescreenGameover.titleMusic.playSong();
}

SceneTitleScreen.prototype = {

    /** Callback function for starting a new game.
    */
    startNewGame: function() {

        // Create a new game
        $game = new Game();
        $game.initializeDefault();

        // Add local map to stack
        $gameStack.replace(new SceneMap($datasGame.system.idMapStartHero));
    },

    // -------------------------------------------------------

    /** Callback function for loading an existing game.
    */
    loadGame: function() {
        $gameStack.push(new SceneLoadGame());
    },

    // -------------------------------------------------------

    /** Callback function for closing the window.
    */
    exit: function() {
        quit();
    },

    // -------------------------------------------------------

    update: function() {

    },

    // -------------------------------------------------------

    onKeyPressed: function(key) {
        this.windowChoicesCommands.onKeyPressed(key);
    },

    // -------------------------------------------------------

    onKeyReleased: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    },

    // -------------------------------------------------------

    draw3D: function(canvas) {

    },

    // -------------------------------------------------------

    drawHUD: function() {
        this.pictureBackground.draw();
        this.pictureLogo.draw();
        this.windowChoicesCommands.draw();
    }
}
