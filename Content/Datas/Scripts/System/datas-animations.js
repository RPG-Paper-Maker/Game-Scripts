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
//  CLASS DatasAnimations
//
// -------------------------------------------------------

/** @class
*   All the animations datas.
*   @property {SystemAnimation[]} list List of all the animations of the game
*   according to ID.
*/
function DatasAnimations() {
    this.read();
}

DatasAnimations.prototype = {

    /** Read the JSON file associated to troops.
    */
    read: function() {
        RPM.openFile(this, RPM.FILE_ANIMATIONS, true, function(res) {
            var i, l, json, jsonAnimation, animation;

            json = JSON.parse(res).animations;
            l = json.length;
            this.list = new Array(l + 1);

            // Sorting all the animations according to the ID
            for (i = 0; i < l; i++){
                jsonAnimation = json[i];
                animation = new SystemAnimation();
                animation.readJSON(jsonAnimation);
                this.list[jsonAnimation.id] = animation;
            }
        });
    }
}
