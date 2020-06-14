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
//  CLASS DatasTitlescreenGameover
//
// -------------------------------------------------------

/** @class
*   All the titlescreen and gameover datas.
*/
function DatasTitlescreenGameover() {
    this.read();
}

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.read = function() {
    RPM.openFile(this, RPM.FILE_TITLE_SCREEN_GAME_OVER, true, function(res) {
        var i, l, j, json, jsonTab, obj;

        json = JSON.parse(res);

        // Title screen
        this.isTitleBackgroundImage = RPM.jsonDefault(json.itbi, true);
        this.titleBackgroundImageID = RPM.jsonDefault(json.tb, 1);
        this.titleBackgroundVideoID = RPM.jsonDefault(json.tbv, 1);
        this.titleMusic = new SystemPlaySong(SongKind.Music);
        this.titleMusic.readJSON(json.tm);
        jsonTab = RPM.jsonDefault(json.tc, []);
        l = jsonTab.length;
        this.titleCommands = new Array(l);
        for (i = 0; i < l; i++) {
            obj = new SystemTitleCommand;
            obj.readJSON(jsonTab[i]);
            this.titleCommands[i] = obj;
        }
        jsonTab = json.ts;
        l = jsonTab.length;
        this.titleSettings = [];
        for (i = 0, j = 0; i < l; i++) {
            obj = jsonTab[i];
            if (obj.tso) {
                this.titleSettings[j] = obj.id;
                j++;
            }
        }
    });
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.getCommandsNames = function() {
    var i, l, list, obj, titleCommand;

    l = this.titleCommands.length;
    list = new Array(l);
    for (i = 0; i < l; i++) {
        titleCommand = this.titleCommands[i]
        obj = new GraphicText(titleCommand.name, { align: Align.Center });
        obj.datas = titleCommand;
        list[i] = obj;
    }

    return list;
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.getCommandsActions = function() {
    var i, l, list;

    l = this.titleCommands.length;
    list = new Array(l);
    for (i = 0; i < l; i++) {
        list[i] = this.titleCommands[i].getAction();
    }

    return list;
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.getSettingsCommandsContent = function() {
    var i, l, list;

    l = this.titleSettings.length;
    list = new Array(l);
    for (i = 0; i < l; i++) {
        list[i] = new GraphicSetting(this.titleSettings[i]);
    }

    return list;
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.getSettingsCommandsActions = function() {
    var i, l, list;

    l = this.titleSettings.length;
    list = new Array(l);
    for (i = 0; i < l; i++) {
        list[i] = this.getSettingsCommandsAction(this.titleSettings[i]);
    }

    return list;
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.getSettingsCommandsAction = function(id) {
    switch (id) {
    case TitleSettingKind.KeyboardAssigment:
        return DatasTitlescreenGameover.prototype.keyboardAssignment;
    }
};

// -------------------------------------------------------

DatasTitlescreenGameover.prototype.keyboardAssignment = function() {
    RPM.gameStack.push(new SceneKeyboardAssign());

    return true;
};

