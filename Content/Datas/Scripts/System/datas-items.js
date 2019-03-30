/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
