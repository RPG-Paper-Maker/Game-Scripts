/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/** @class
 *  The Input and Output class who handles loading and saving
 *  @TODO : handle Server In Out input as well?  such as Web loading?
 */
class IO {
    constructor() {
        throw new Error("This is a static class");
    }
}
/**
 *  Check if a file exists.
 *  @static
 *  @param {string} url The path of the file
 *  @returns {boolean}
 */
IO.fileExists = function (url) {
    const fs = require('fs');
    return (fs.existsSync(url));
};
/**
 *  Open an existing file.
 *  @static
 *  @param {string} url The path of the file
 *  @returns {string}
 */
IO.openFile = async function (url) {
    const fs = require('fs').promises;
    return (await fs.readFile(url, (e, data) => {
        if (e) {
            return null;
        }
        else {
            return data;
        }
    })).toString();
};
/**
 *  Open and parse an existing file.
 *  @static
 *  @param {string} url The path of the file
 *  @returns {Promise<Record<string, any>>}
 */
IO.parseFileJSON = async function (url) {
    return JSON.parse(await IO.openFile(url));
};
/**
 *  Write a json file.
 *  @static
 *  @param {string} url The path of the file
 *  @param {Object} obj An object that can be stringified by JSON
 */
IO.saveFile = async function (url, obj) {
    const fs = require('fs').promises;
    return await fs.writeFile(url, JSON.stringify(obj), (e) => {
        if (e) {
            throw e;
        }
    });
};
export { IO };
