/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils, Platform } from "../Common/index.js";
/** @class
 *  The abstract class who model the Structure of RPM datas.
 */
class Base {
    constructor() {
        throw new Error("This is a static class!");
    }
    static get(id, list, name) {
        let v = list[id];
        if (Utils.isUndefined(v)) {
            Platform.showErrorMessage(Base.STRING_ERROR_GET_1 + Utils
                .formatNumber(id, 4) + ": " + name + Base.STRING_ERROR_GET_2);
        }
        else {
            return v;
        }
    }
}
Base.STRING_ERROR_GET_1 = "Impossible to get the system ID ";
Base.STRING_ERROR_GET_2 = ". Please check if this ID exists in the software.";
export { Base };
