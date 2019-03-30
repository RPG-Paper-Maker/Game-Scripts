/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
        this.titleLogoID = json.tl;
        this.titleBackgroundID = json.tb;
        this.titleMusic = new SystemPlaySong(SongKind.Music);
        this.titleMusic.readJSON(json.tm);
    });
};
