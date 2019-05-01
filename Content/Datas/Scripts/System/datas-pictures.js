/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS DatasPictures
//
// -------------------------------------------------------

/** @class
*   All the pictures datas.
*   @property {Object[]} list List of all the pictures of the game
*   according to ID and PictureKind.
*/
function DatasPictures(context, callback){
    this.read(context, callback);
}

DatasPictures.prototype = {

    /** Read the JSON file associated to pictures.
    */
    read: function(context, callback){
        RPM.openFile(this, RPM.FILE_PICTURES_DATAS, true, function(res){
            var json = JSON.parse(res).list;
            var i, j, l, ll, lll;
            var list;

            l = RPM.countFields(PictureKind) - 1;
            this.list = new Array(l);
            for (i = 0; i < l; i++){
                var jsonHash = json[i];
                var k = jsonHash.k;
                var jsonList = jsonHash.v;

                // Get the max ID
                ll = jsonList.length;
                lll = 0;
                var jsonPicture, id;
                for (j = 0; j < ll; j++){
                    jsonPicture = jsonList[j];
                    id = jsonPicture.id;
                    if (id > lll)
                        lll = id;
                }

                // Fill the pictures list
                list = new Array(lll + 1);
                for (j = 0; j < lll + 1 + (k === PictureKind.Characters ? 1 : 0); j++){
                    jsonPicture = jsonList[j];
                    id = jsonPicture.id;
                    var picture = new SystemPicture();
                    picture.readJSON(jsonPicture);

                    if (id !== 0) {
                        if (id === -1)
                            id = 0;

                        list[id] = picture;
                    }
                }

                this.list[k] = list;
            }

            callback.call(context);
        });
    },

    /** Get the corresponding picture.
    */
    get: function(kind, id){
        if (kind === PictureKind.None){
            return new SystemPicture();
        }
        else
            return this.list[kind][id];
    },

    // -------------------------------------------------------

    getIcon: function(id) {
        return this.get(PictureKind.Icons, id);
    }
}
