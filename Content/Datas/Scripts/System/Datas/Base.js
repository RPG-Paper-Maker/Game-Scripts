/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Utils, Platform } from "../Common";
/** @class
 *  The abstract class who model the Structure of RPM datas.
 *  @static
 */
class Base {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Get an element in a list by ID safely.
     *  @static
     *  @param {number} id The ID to select
     *  @param {T[]} list The list to browse
     *  @param {string} name The name of the element to describe in the error
     *  message
     *  @returns {T}
     */
    static get(id, list, name, isID = true) {
        let v = list[id];
        if (Utils.isUndefined(v)) {
            Platform.showErrorMessage(Base.STRING_ERROR_GET_1 + (isID ? "ID" :
                "index") + " " + Utils.formatNumber(id, 4) + ": " + name + Base
                .STRING_ERROR_GET_2);
        }
        else {
            return v;
        }
    }
}
Base.STRING_ERROR_GET_1 = "Impossible to get the system ";
Base.STRING_ERROR_GET_2 = ". Please check if this ID exists in the software.";
export { Base };
