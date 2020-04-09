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
//  CLASS DatasVideos
//
// -------------------------------------------------------

/** @class
*   All the videos datas.
*   @property {SystemVideo[]} list List of all the videos of the game
*   according to ID.
*/
function DatasVideos() {
    this.read();
}

DatasVideos.prototype = {

    /** Read the JSON file associated to videos.
    */
    read: function() {
        RPM.openFile(this, RPM.FILE_VIDEOS_DATAS, true, function(res) {
            var i, l, json, jsonTab, jsonObj, video;

            json = JSON.parse(res);

            jsonTab = json.list;
            this.list = [];
            for (i = 0, l = jsonTab.length; i < l; i++) {
                jsonObj = jsonTab[i];
                video = new SystemVideo();
                video.readJSON(jsonObj);
                this.list[jsonObj.id] = video;
            }
        });
    }
}
