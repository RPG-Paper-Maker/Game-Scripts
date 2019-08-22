/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS DatasTitlescreenGameover
//
// -------------------------------------------------------

/** @class
*   All the titlescreen and gameover datas.
*/
function DatasTitlescreenGameover() {
    this.read();
}

DatasTitlescreenGameover.prototype.read = function() {
    RPM.openFile(this, RPM.FILE_TITLE_SCREEN_GAME_OVER, true, function(res) {
        var json;

        json = JSON.parse(res);

        // Title screen
        this.isTitleBackgroundImage = RPM.jsonDefault(json.itbi, true);
        this.titleBackgroundImageID = RPM.jsonDefault(json.tb, 1);
        this.titleBackgroundVideoID = RPM.jsonDefault(json.tbv, 1);
        this.titleMusic = new SystemPlaySong(SongKind.Music);
        this.titleMusic.readJSON(json.tm);
    });
};
