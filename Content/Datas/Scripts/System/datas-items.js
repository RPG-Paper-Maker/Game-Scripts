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
//  CLASS ItemsDatas
//
// -------------------------------------------------------

/** @class
*   All the items datas.
*   @property {SystemItem[]} list List of all the items of the game according
*   to ID.
*/
function DatasItems(){
    this.read();
}

DatasItems.prototype = {

    /** Read the JSON file associated to items.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_ITEMS, true, function(res){
            var json = JSON.parse(res).items;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the items according to the ID
            for (i = 0; i < l; i++){
                var jsonItem = json[i];
                var id = jsonItem.id;
                var item = new SystemItem();
                item.readJSON(jsonItem);
                this.list[id] = item;
            }
        });
    }
}
