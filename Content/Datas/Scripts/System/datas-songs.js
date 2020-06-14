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
//  CLASS DatasSongs
//
// -------------------------------------------------------

/** @class
*   All the songs datas.
*   @property {Object[]} list List of all the songs of the game
*   according to ID and SongKind.
*/
function DatasSongs(){

}

DatasSongs.prototype = {

    /** Read the JSON file associated to songs.
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_SONGS_DATAS, true, function(res){
            var json = JSON.parse(res).list;
            var i, j, l, ll, lll;
            var list;

            l = RPM.countFields(SongKind) - 1;
            this.list = new Array(l);
            for (i = 0; i < l; i++){
                var jsonHash = json[i];
                var k = jsonHash.k;
                var jsonList = jsonHash.v;

                // Get the max ID
                ll = jsonList.length;
                lll = 0;
                var jsonSong, id;
                for (j = 0; j < ll; j++){
                    jsonSong = jsonList[j];
                    id = jsonSong.id;
                    if (id > lll)
                        lll = id;
                }

                // Fill the songs list
                list = new Array(lll + 1);
                for (j = 0; j < lll + 1; j++){
                    jsonSong = jsonList[j];
                    if (jsonSong)
                    {
                        id = jsonSong.id;
                        var song = new SystemSong();
                        song.readJSON(jsonSong);
                        if (k !== SongKind.Sound)
                        {
                            song.load(k);
                        }

                        if (id === -1)
                            id = 0;

                        list[id] = song;
                    }
                }

                this.list[k] = list;
            }
        });
    },

    /** Get the corresponding song.
    */
    get: function(kind, id){
        if (kind === SongKind.None){
            return new SystemSong();
        }
        else
            return this.list[kind][id];
    }
}
