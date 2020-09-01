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
//  CLASS DatasDLCs
//
// -------------------------------------------------------

function DatasDLCs() {
    this.read();
}

DatasDLCs.prototype = {

    /** Read the JSON file associated to dlcs
    */
    read: function(){
        RPM.openFile(this, RPM.FILE_DLCS, true, function(res){
            let json = JSON.parse(res);
            
            RPM.PATH_DLCS = "file:///" + json.p;
        });
    }
}
