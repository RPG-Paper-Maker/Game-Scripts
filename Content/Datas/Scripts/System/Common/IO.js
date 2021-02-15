/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas } from "../index.js";
/**
 * The Input and Output class who handles loading and saving.
 *
 * @class IO
 */
class IO {
    constructor() {
        throw new Error("This is a static class");
    }
}
/**
 *  Check if a file exists.
 *  @static
 *  @param {string} url - The path of the file
 *  @returns {boolean}
 */
IO.fileExists = function (url) {
    const fs = require('fs');
    return (fs.existsSync(url));
};
/**
 *  Open an existing file.
 *  @static
 *  @param {string} url - The path of the file
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
 *  @param {string} url - The path of the file
 *  @returns {Promise<Record<string, any>>}
 */
IO.parseFileJSON = async function (url) {
    let content = await IO.openFile(url);
    if (Datas.Settings.isProtected) {
        content = atob(content);
    }
    return JSON.parse(content);
};
/**
 *  Write a json file.
 *  @static
 *  @param {string} url - The path of the file
 *  @param {Object} obj - An object that can be stringified by JSON
 */
IO.saveFile = async function (url, obj) {
    const fs = require('fs').promises;
    let content = JSON.stringify(obj);
    if (Datas.Settings.isProtected) {
        content = btoa(content);
    }
    return await fs.writeFile(url, content, (e) => {
        if (e) {
            throw e;
        }
    });
};
export { IO };
