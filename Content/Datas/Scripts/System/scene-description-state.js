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
//  CLASS SceneDescriptionState : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene in the menu for describing players statistics.
*   @extends SceneGame
*   @property {WindowBox} windowTop Window on top with "State" text.
*   @property {WindowTabs} windowChoicesTabs Window for each tabs.
*   @property {WindowBox} windowInformations Window for skill informations.
*/
function SceneDescriptionState() {
    SceneGame.call(this);

    var nbHeroes, i;
    var listHeroes;

    // Tab heroes
    nbHeroes = $game.teamHeroes.length;
    listHeroes = new Array(nbHeroes);
    for (i = 0; i < nbHeroes; i++)
        listHeroes[i] = new GraphicPlayerDescription($game.teamHeroes[i]);

    // All the windows
    this.windowTop = new WindowBox(20, 20, 200, 30, new GraphicText("State", {
        align: Align.Center }));
    this.windowChoicesTabs = new WindowTabs(OrientationWindow.Horizontal, 50,
        60, 110, RPM.SMALL_SLOT_HEIGHT, 4, listHeroes, null);
    this.windowInformations = new WindowBox(20, 100, 600, 340, null, RPM
        .HUGE_PADDING_BOX);
    this.synchronize();
}

SceneDescriptionState.prototype = {

    /** Synchronize informations with selected hero.
    */
    synchronize: function(){
        this.windowInformations.content =
             this.windowChoicesTabs.getCurrentContent();
    },

    // -------------------------------------------------------

    update: function(){
        this.windowInformations.content.updateBattler();
    },

    // -------------------------------------------------------

    onKeyPressed: function(key){
        if (DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.menuControls.Cancel) ||
            DatasKeyBoard.isKeyEqual(key,
                                     $datasGame.keyBoard.MainMenu))
        {
            $datasGame.system.soundCancel.playSound();
            $gameStack.pop();
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key){

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key){
        var indexTab = this.windowChoicesTabs.currentSelectedIndex;
        this.windowChoicesTabs.onKeyPressedAndRepeat(key);
        this.synchronize();
    },

    // -------------------------------------------------------

    draw3D: function(canvas){
        $currentMap.draw3D(canvas);
    },

    // -------------------------------------------------------

    drawHUD: function(){

        // Draw the local map behind
        $currentMap.drawHUD();

        // Draw the menu
        this.windowTop.draw();
        this.windowChoicesTabs.draw();
        this.windowInformations.draw();
    }
}
