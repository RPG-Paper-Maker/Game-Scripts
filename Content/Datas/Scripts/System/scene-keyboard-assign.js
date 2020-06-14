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
//  CLASS SceneKeyboardAssign : SceneGame
//
// -------------------------------------------------------

/** @class
*   A scene for the keyboard assign setting.
*   @extends SceneGame
*/
function SceneKeyboardAssign() {
    SceneGame.call(this);

    // Creating background
    if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
        this.pictureBackground = Picture2D.createImageWithID(RPM.datasGame
            .titlescreenGameover.titleBackgroundImageID, PictureKind.TitleScreen);
        this.pictureBackground.cover = true;
    }

    // Creating windows
    this.windowKeyboard = new WindowBox(RPM.HUGE_SPACE, RPM.HUGE_SPACE, RPM
        .MEDIUM_SLOT_WIDTH, RPM.LARGE_SLOT_HEIGHT, new GraphicText("KEYBOARD", {
        align: Align.Center }), RPM.SMALL_SLOT_PADDING);
    this.windowInformations = new WindowBox(RPM.HUGE_SPACE + RPM
        .MEDIUM_SLOT_WIDTH + RPM.LARGE_SPACE, RPM.HUGE_SPACE, RPM.SCREEN_X - (2 *
        RPM.HUGE_SPACE) - RPM.MEDIUM_SLOT_WIDTH - RPM.LARGE_SPACE, RPM
        .LARGE_SLOT_HEIGHT, new GraphicText("Select a keyboard shortcut to edit."
        , { align: Align.Center }), RPM.SMALL_SLOT_PADDING);
    this.windowChoicesMain = new WindowChoices(OrientationWindow.Vertical, RPM
        .HUGE_SPACE, RPM.HUGE_SPACE + RPM.LARGE_SLOT_HEIGHT + RPM.LARGE_SPACE,
        RPM.SCREEN_X - (2 * RPM.HUGE_SPACE), RPM.MEDIUM_SLOT_HEIGHT, 9, RPM.datasGame
        .keyBoard.getCommandsGraphics(), RPM.datasGame.keyBoard.getCommandsActions()
        , RPM.SMALL_SLOT_PADDING, 0, 0, false);
    this.windowPress = new WindowBox((RPM.SCREEN_X / 2) - (SceneKeyboardAssign
        .WINDOW_PRESS_WIDTH / 2), (RPM.SCREEN_Y / 2) - (SceneKeyboardAssign
        .WINDOW_PRESS_HEIGHT / 2), SceneKeyboardAssign.WINDOW_PRESS_WIDTH,
        SceneKeyboardAssign.WINDOW_PRESS_HEIGHT, null, RPM.DIALOG_PADDING_BOX);

    // Initialize
    this.showPress = false;
    this.currentSC = [];
    this.keysPressed = [];
    this.compareWait = SceneKeyboardAssign.MAX_WAIT_TIME_FIRST;
}

SceneKeyboardAssign.WINDOW_PRESS_WIDTH = 300;
SceneKeyboardAssign.WINDOW_PRESS_HEIGHT = 200;
SceneKeyboardAssign.MAX_WAIT_TIME_FIRST = 3000;
SceneKeyboardAssign.MAX_WAIT_TIME = 1000;

// -------------------------------------------------------

SceneKeyboardAssign.prototype = {

    update: function() {
        if (this.showPress) {
            if (this.keysPressed.length === 0 && new Date().getTime() - this
                .waitTime >= this.compareWait)
            {
                this.showPress = false;

                // If nothing, go back to previous sc
                if (this.currentSC.length === 0) {
                    this.windowChoicesMain.getCurrentContent().updateShort(this
                        .originalSC);
                } else {
                    RPM.settings.updateKeyboard(this.windowChoicesMain
                        .getCurrentContent().kb.id, this.currentSC);
                }

                RPM.requestPaintHUD = true;
            }
        }
    },

    // -------------------------------------------------------

    updateKey: function() {
        this.compareWait = SceneKeyboardAssign.MAX_WAIT_TIME_FIRST;
        this.waitTime = new Date().getTime();
        this.showPress = true;
        this.originalSC = this.windowChoicesMain.getCurrentContent().kb.sc;
        this.currentSC = [];
        this.windowChoicesMain.getCurrentContent().updateShort(this
            .currentSC);
        this.nextOR = true;

        return true;
    },

    // -------------------------------------------------------

    onKeyPressed: function(key) {
        if (this.showPress) {
            var current;

            this.keysPressed.push(key);
            if (this.nextOR) {
                this.currentSC.push([]);
                this.nextOR = false;
            }
            current = this.currentSC[this.currentSC.length - 1];
            if (current.indexOf(key) === -1) {
                this.compareWait = SceneKeyboardAssign.MAX_WAIT_TIME_FIRST;
                this.currentSC[this.currentSC.length - 1].push(key);
                this.windowChoicesMain.getCurrentContent().updateShort(this
                    .currentSC);
            }
        } else {
            this.windowChoicesMain.onKeyPressed(key, this);

            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard.menuControls
                .Cancel) || DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .MainMenu))
            {
                RPM.datasGame.system.soundCancel.playSound();
                RPM.gameStack.pop();
            }
        }
    },

    // -------------------------------------------------------

    onKeyReleased: function(key) {
        this.keysPressed.splice(this.keysPressed.indexOf(key), 1);
        if (this.keysPressed.length === 0 && this.currentSC.length > 0) {
            this.compareWait = SceneKeyboardAssign.MAX_WAIT_TIME;
            this.nextOR = true;
            this.waitTime = new Date().getTime();
        }
    },

    // -------------------------------------------------------

    onKeyPressedRepeat: function(key) {

    },

    // -------------------------------------------------------

    onKeyPressedAndRepeat: function(key) {
        if (!this.showPress) {
            this.windowChoicesMain.onKeyPressedAndRepeat(key);
            this.windowPress.content = this.windowChoicesMain.getCurrentContent();
        }
    },

    // -------------------------------------------------------

    draw3D: function(canvas) {

    },

    // -------------------------------------------------------

    drawHUD: function() {
        if (RPM.datasGame.titlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowKeyboard.draw();
        this.windowInformations.draw();
        this.windowChoicesMain.draw();
        if (this.showPress) {
            this.windowPress.draw();
        }
    }
}
