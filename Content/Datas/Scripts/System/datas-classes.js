/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS DatasClasses
//
// -------------------------------------------------------

/** @class
*   All the classes datas.
*   @property {SystemClass[]} list List of all the classes of the game according
*   to ID.
*/
function DatasClasses(){
    this.read();
}

DatasClasses.prototype = {

    /** Read the JSON file associated to classes.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_CLASSES, true, function(res){
            var json = JSON.parse(res).classes;
            var i, l = json.length;
            this.list = new Array(l+1);

            // Sorting all the classes according to the ID
            for (i = 0; i < l; i++){
                var jsonClass = json[i];
                var id = jsonClass.id;
                var c = new SystemClass();
                c.readJSON(jsonClass);
                this.list[id] = c;
            }
        });
    }
}
