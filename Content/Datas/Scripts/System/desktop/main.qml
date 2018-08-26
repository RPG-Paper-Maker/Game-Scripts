/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    //visibility: "FullScreen"

    width: 640
    height: 480
    maximumHeight: height
    maximumWidth: width
    minimumHeight: height
    minimumWidth: width

    visible: true
    Component.onCompleted: {
        setX(Screen.width / 2 - width / 2);
        setY(Screen.height / 2 - height / 2);
        Game.$canvasHUD = canvas;
        Game.$canvasRendering = canvasRendering;
    }

    function showError(e){
        dialogError.text = e.fileName + " - line: " + e.lineNumber + " -> " +
                e.message;
        dialogError.open();
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

    SoundEffect {
        id: playSound1;
    }

    SoundEffect {
        id: playSound2;
    }

    SoundEffect {
        id: playSound3;
    }

    SoundEffect {
        id: playSound4;
    }

    SoundEffect {
        id: playSound5;
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
                if (!Game.RPM.isLoading() &&
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
                if (!Game.RPM.isLoading() &&
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
                Game.$canvasWidth = canvas3d.width;
                Game.$canvasHeight = canvas3d.height;
                Game.$windowX = Game.$canvasWidth / Game.$SCREEN_X;
                Game.$windowY = Game.$canvasHeight / Game.$SCREEN_Y;
                Game.$songsManager = new Game.SongsManager(
                    musicPlayer, backgroundsoundPlayer, musicEffectPlayer,
                    [playSound1, playSound2, playSound3, playSound4,
                    playSound5]);
                Game.initialize();
                Game.initializeGL(canvas3d);
            }
            catch (e){
                showError(e);
            }
        }

        onPaintGL: {
            try{
                if (!Game.RPM.isLoading()) {
                    if (!Game.$gameStack.isEmpty()) {
                        var callback =
                                Game.$gameStack.top().callBackAfterLoading;
                        if (callback === null) {
                            Game.update();
                            Game.draw3D(canvas3d);
                            Game.drawHUD(canvas);
                            canvas.requestPaint();
                        }
                        else {
                            Game.$renderer.render(
                                        Game.$loadingScene,
                                        Game.$currentMap.camera.threeCamera);
                            if (callback) {
                                Game.$gameStack.top().callBackAfterLoading =
                                        undefined;
                                callback.call(Game.$gameStack.top());
                            }
                        }
                    }
                    else
                        Game.$gameStack.pushTitleScreen();
                }
            }
            catch (e) {
                showError(e);
            }
        }

        onResizeGL: {
            try{
                Game.$canvasWidth = canvas3d.width;
                Game.$canvasHeight = canvas3d.height;
                Game.resizeGL(canvas3d);
            }
            catch (e){
                showError(e);
            }
        }
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
            for (var i = 0, l = Game.$picturesLoading.length; i < l; i++) {
                if (Game.$picturesLoading[i].check())
                    break;
            }
        }
    }
}
