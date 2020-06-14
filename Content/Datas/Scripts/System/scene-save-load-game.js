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
//  CLASS SceneSaveLoadGame : SceneGame
//
// -------------------------------------------------------

/** @class
*   Abstract class for the game save and loading menus.
*   @extends SceneGame
*   @property {Game[]} gamesDatas List of all games datas.
*   @property {WindowBox} windowTop A Window for displaying informations on top.
*   @property {WindowChoices} windowChoicesSlots A window choices for choosing
*   a slot.
*   @property {WindowBox} windowInformations A Window for displaying
*   informations about the selected slot.
*   @property {WindowBox} windowBot A Window for displaying informations on
*   bottom.
*/
function SceneSaveLoadGame() {
    SceneGame.call(this);

    SceneSaveLoadGame.prototype.initializeWindows.call(this);
    SceneSaveLoadGame.prototype.initializeGames.call(this);
}

SceneSaveLoadGame.prototype = {

    // -------------------------------------------------------

    /** Initialize all the windows graphics.
    */
    initializeWindows: function(){
        var games = [];
        for (var i = 0; i < 4; i++) {
            games.push(SceneSaveLoadGame.prototype.getEmptyGame(i))
        }

        this.windowTop = new WindowBox(20, 20, RPM.SCREEN_X - 40, 30);
        this.windowChoicesSlots = new WindowChoices(OrientationWindow.Vertical,
            10, 100, 100, 50, 4, games, []);
        this.windowInformations = new WindowBox(120, 100, 500, 300, null, [20,
            20, 20, 20]);
        this.windowBot = new WindowBox(20, RPM.SCREEN_Y - 50, RPM.SCREEN_X - 40, 30);
    },

    // -------------------------------------------------------

    getEmptyGame: function(i) {
        return {
            currentSlot: i + 1,
            isNull: true
        };
    },

    // -------------------------------------------------------

    /** Initialize all the games.
    */
    initializeGames: function(){
        this.gamesDatas = [null, null, null, null];

        RPM.openFile(this, RPM.FILE_SAVE, true, function(res){
            var jsonList = JSON.parse(res);
            var game, j, ll;

            for (j = 0, ll = jsonList.length; j < ll; j++){
                var json = jsonList[j];

                if (json !== null){
                    game = new Game();
                    game.read(j + 1, json);
                } else {
                    game = {
                        currentSlot: j + 1,
                        isNull: true
                    };
                }
                SceneSaveLoadGame.prototype.initializeGame.call(this, game);
            }

            this.windowChoicesSlots.setContents(this.gamesDatas);
            this.loaded = true;
        });
    },

    // -------------------------------------------------------

    /** Initialize a game displaying.
    */
    initializeGame: function(game){
        this.gamesDatas[game.currentSlot-1] = new GraphicSave(game);

        if (game.currentSlot-1 === this.windowChoicesSlots.currentSelectedIndex)
        {
            SceneSaveLoadGame.prototype.updateInformations.call(this, game
                .currentSlot -1);
        }
    },

    // -------------------------------------------------------

    /** Set the contents in the bottom and top bars.
    */
    setContents: function(top, bot){
        this.windowTop.content = top;
        this.windowBot.content = bot;
    },

    // -------------------------------------------------------

    /** Update the information to display inside the save informations.
    */
    updateInformations: function(i){
        this.windowInformations.content = this.gamesDatas[i];
    },

    // -------------------------------------------------------

    update: function() {
        if (!this.windowInformations.content.game.isNull) {
            this.windowInformations.content.update();
        }
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     RPM.datasGame.keyBoard.menuControls.Cancel) ||
            DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.MainMenu))
        {
            RPM.datasGame.system.soundCancel.playSound();
            RPM.gameStack.pop();
        }
    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        this.windowChoicesSlots.onKeyPressedAndRepeat(key);
        SceneSaveLoadGame.prototype.updateInformations.call(
                    this, this.windowChoicesSlots.currentSelectedIndex);
    },


    // -------------------------------------------------------

    drawHUD: function() {
        if (this.loaded) {
            this.windowTop.draw();
            this.windowChoicesSlots.draw();
            this.windowInformations.draw();
            this.windowBot.draw();
        }
    }
}
