/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Utils } from "../Common/index.js";
import { System } from "../index.js";
/** @class
 *  All the armors datas.
 *  @property {SystemArmor[]} list List of all the armors of the game according
 *  to ID
 */
class Armors {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to armors.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await IO.parseFileJSON(Paths.FILE_ARMORS)).armors;
        this.list = [];
        Utils.readJSONSystemList({ list: json, listIDs: this.list, cons: System
                .Armor });
    }
}
export { Armors };
