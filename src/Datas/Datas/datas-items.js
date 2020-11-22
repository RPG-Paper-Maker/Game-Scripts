/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the items datas
 *   @property {SystemItem[]} list List of all the items of the game according
 *   to ID
 */
class DatasItems {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to items
     */
    async read() {
        let json = (await RPM.parseFileJSON(RPM.FILE_ITEMS)).items;
        this.list = RPM.readJSONSystemList(json, SystemItem);
    }
}
