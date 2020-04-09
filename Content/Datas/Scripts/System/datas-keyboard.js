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
//  CLASS KeyBoardDatas
//
// -------------------------------------------------------

/** @class
*   All the keyBoard datas.
*   @property {SystemKeyBoard[]} list List of all the keys of the game according
*   to ID.
*   @property {Object} menuControls All the menu controls assigns.
*/
function DatasKeyBoard(){
    this.read();
}

/** Test if a key id can be equal to a keyboard system object.
*   @static
*   @param {number} key The key id that needs to be compared.
*   @param {SystemKeyBoard} abr The keyBoard to compare to the key.
*/
DatasKeyBoard.isKeyEqual = function(key, abr){
    var sc = abr.sc;

    for (var i = 0, l = sc.length; i < l; i++){
        var ll = sc[i].length;
        if (ll === 1){
            if (sc[i][0] === key)
                return true;
        }
        else{
            return false;
        }
    }

    return false;
}

// -------------------------------------------------------

DatasKeyBoard.prototype = {

    /** Read the JSON file associated to keyboard.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_KEYBOARD, true, function(res) {
            var json, sc;

            json = JSON.parse(res);

            // Shortcuts
            var jsonList = json.list;
            var i, l = jsonList.length;
            this.list = new Array(l+1);
            this.listOrdered = new Array(l);
            for (i = 0; i < l; i++){
                var jsonKey = jsonList[i];
                var id = jsonKey.id;
                var abbreviation = jsonKey.abr;
                var key = new SystemKeyBoard();
                key.readJSON(jsonKey);
                sc = $settings.kb[id];
                if (sc) {
                    key.sc = sc;
                }
                this.list[id] = key;
                this.listOrdered[i] = key;
                this[abbreviation] = key;
            }

            // Menu controls
            this.menuControls = {};
            this.menuControls["Action"] = this.list[json["a"]];
            this.menuControls["Cancel"] = this.list[json["c"]];
            this.menuControls["Up"] = this.list[json["u"]];
            this.menuControls["Down"] = this.list[json["d"]];
            this.menuControls["Left"] = this.list[json["l"]];
            this.menuControls["Right"] = this.list[json["r"]];
        });
    },

    // -------------------------------------------------------

    getCommandsGraphics: function() {
        var i, l, list;

        l = this.listOrdered.length;
        list = new Array(l);
        for (i = 0; i < l; i++) {
            list[i] = new GraphicKeyboard(this.listOrdered[i]);
        }

        return list;
    },

    // -------------------------------------------------------

    getCommandsActions: function() {
        var i, l, list;

        l = this.listOrdered.length;
        list = new Array(l);
        for (i = 0; i < l; i++) {
            list[i] = SceneKeyboardAssign.prototype.updateKey;
        }

        return list;
    }
}
