/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import QtQuick 2.4
import QtCanvas3D 1.1
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.1
import QtMultimedia 5.8

import "qrc:/qmlUtilities.js" as Game

// -------------------------------------------------------
//
//  main.qml
//
//  Main QML file for interface support. Handling display,
//  events..
//
// -------------------------------------------------------

// -------------------------------------------------------
// Main Window
// -------------------------------------------------------

Window {
    id: window
    title: qsTr("Game")
    visible: true
    Component.onCompleted: {
        Game.$that = Game;
        Game.$window = window;
        Game.$canvasHUD = canvas;
        Game.$canvas3D = canvas3d;
        Game.$canvasRendering = canvasRendering;
        Game.$screenWidth = Screen.width;
        Game.$screenHeight = Screen.height;
    }

    function showError(e){
        Game.RPM.showError(e);
        /*
        dialogError.text = e.fileName + " - line: " + e.lineNumber + " -> " +
                e.message;
        dialogError.open();
        */
    }

    MessageDialog {
        id: dialogError
        title: "Error"
        icon: StandardIcon.Critical
        visible: false

        onButtonClicked: {
            Game.quit();
        }
    }

    Timer {
        interval: 1000; running: true; repeat: true
        onTriggered: {
            Game.RPM.updateTimer();
        }
    }

    Audio {
        id: musicPlayer;
        playlist: Playlist {
            playbackMode: Playlist.CurrentItemInLoop;
        }
    }

    Audio {
        id: backgroundsoundPlayer;
        playlist: Playlist {
            playbackMode: Playlist.CurrentItemInLoop;
        }
    }

    Audio {
        id: musicEffectPlayer;
        playlist: Playlist {
            playbackMode: Playlist.CurrentItemOnce;
        }
    }

    Audio {
        id: playSound1;
    }

    Audio {
        id: playSound2;
    }

    Audio {
        id: playSound3;
    }

    Audio {
        id: playSound4;
    }

    Audio {
        id: playSound5;
    }

    Audio {
        id: playSound6;
    }

    Audio {
        id: playSound7;
    }

    Audio {
        id: playSound8;
    }

    Audio {
        id: playSound9;
    }

    Audio {
        id: playSound10;
    }

    property double startTime: new Date().getTime()

    // -------------------------------------------------------
    // Keys handling
    // -------------------------------------------------------

    Item {
        id: keyboard
        focus: true

        onActiveFocusChanged: {
            Game.$keysPressed = [];
        }

        Keys.onPressed: {
            try{
                if (!Game.$datasGame.loaded) {
                    return;
                }

                if (!Game.RPM.isLoading() && Game.$gameStack.displayingContent &&
                    !Game.$gameStack.top().callBackAfterLoading)
                {
                    var key = event.key;

                    if (key === Qt.Key_F12){
                        Game.quit();
                    }

                    if (!event.isAutoRepeat){
                        Game.$keysPressed.push(key);
                        Game.onKeyPressed(key);
                    }

                    // Wait 50 ms for a slower update
                    var t = new Date().getTime();
                    if (t - startTime >= 50){
                        startTime = t;
                        Game.onKeyPressedAndRepeat(key);
                    }
                }
            }
            catch (e){
                showError(e);
            }
        }

        Keys.onReleased: {
            try{
                if (!Game.$datasGame.loaded) {
                    return;
                }

                if (!Game.RPM.isLoading() && Game.$gameStack.displayingContent &&
                    !Game.$gameStack.top().callBackAfterLoading)
                {
                    if (event.isAutoRepeat) return;
                    var key = event.key;
                    Game.$keysPressed.splice(Game.$keysPressed.indexOf(key), 1);
                    Game.onKeyReleased(key);
                }
                else {
                    Game.$keysPressed = [];
                }
            }
            catch (e){
                showError(e);
            }
        }
    }

    // -------------------------------------------------------
    // 3D drawing
    // -------------------------------------------------------

    Canvas3D {
        id: canvas3d
        anchors.fill: parent

        onInitializeGL: {
            try{
                Game.$DIALOG_ERROR = dialogError;
                Game.$canvasWidth = Game.$SCREEN_X;
                Game.$canvasHeight = Game.$SCREEN_Y;
                Game.$windowX = 1;
                Game.$windowY = 1;
                Game.$context = canvas.getContext('2d');
                Game.$songsManager = new Game.SongsManager(
                    musicPlayer, backgroundsoundPlayer, musicEffectPlayer,
                    [playSound1, playSound2, playSound3, playSound4,
                    playSound5, playSound6, playSound7, playSound8, playSound9,
                    playSound10]);
                Game.$canvasVideos = video;
                Game.initialize();
                Game.initializeGL(canvas3d);
            }
            catch (e){
                showError(e);
            }
        }

        onPaintGL: {
            try{
                // Loading datas game
                if (Game.$datasGame && !Game.$datasGame.loaded) {
                    Game.$datasGame.updateLoadings();
                    Game.$renderer.clear();
                    Game.drawHUD(true);
                    canvas.requestPaint();
                    return;
                }

                if (!Game.RPM.isLoading()) {
                    if (!Game.$gameStack.isEmpty()) {
                        // Callbacks
                        var callback = Game.$gameStack.top().callBackAfterLoading;
                        if (callback === null) {
                            Game.update();
                            callback = Game.$gameStack.top().callBackAfterLoading;
                            if (callback === null) {
                                Game.draw3D(canvas3d);
                                Game.drawHUD(false);
                            }
                            canvas.requestPaint();
                        }
                        else {
                            if (!Game.$gameStack.top().isBattleMap) {
                                Game.$renderer.clear();
                                Game.drawHUD(true);
                                canvas.requestPaint();
                            }
                            if (callback) {
                                Game.$gameStack.top().callBackAfterLoading =
                                        undefined;
                                callback.call(Game.$gameStack.top());
                            }
                        }
                    }
                    else {
                        Game.$gameStack.pushTitleScreen();
                    }
                }
            }
            catch (e) {
                showError(e);
            }
        }

        onResizeGL: {
            try{
                Game.resizeGL(canvas3d);
            }
            catch (e){
                showError(e);
            }
        }
    }

    // -------------------------------------------------------
    // Video player
    // -------------------------------------------------------

    Video {
        id: video
        anchors.fill: parent
        focus: true
    }

    // -------------------------------------------------------
    // HUD drawing
    // -------------------------------------------------------

    Canvas {
        id: canvas
        anchors.fill: parent
    }

    // -------------------------------------------------------
    // Pictures rendering
    // -------------------------------------------------------

    Canvas {
        id: canvasRendering
        width: 4096
        height: 4096
        visible: false

        onImageLoaded: {
            for (var i = Game.$picturesLoading.length - 1; i >= 0; i--) {
                Game.$picturesLoading[i].check();
            }
        }
    }
}
