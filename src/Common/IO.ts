/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/


/**
 * The Input and Output class who handles loading and saving.
 *
 * @class IO
 */
class IO {

    constructor() {
        throw new Error("This is a static class");
    }

    /** 
     *  Check if a file exists.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {boolean}
     */
    static fileExists = function(url: string): Promise<boolean> {
        const fs = require('fs');
        return (fs.existsSync(url));
    }

    /** 
     *  Open an existing file.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {string}
     */
    static openFile = async function(url: string): Promise<string>
    {
        const fs = require('fs').promises;
        return (await fs.readFile(url, (e: Error, data: Buffer) => {
            if (e) 
            {
                return null;
            } else
            {
                return data;
            }
        })).toString();
    }

    /** 
     *  Open and parse an existing file.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {Promise<Record<string, any>>}
     */
    static parseFileJSON = async function(url: string): Promise<Record<string, 
        any>>
    {
        return JSON.parse(await IO.openFile(url));
    }

    /** 
     *  Write a json file.
     *  @static
     *  @param {string} url - The path of the file
     *  @param {Object} obj - An object that can be stringified by JSON
     */
    static saveFile = async function(url: string, obj: Object)
    {
        const fs = require('fs').promises;
        return await fs.writeFile(url, JSON.stringify(obj), (e: Error) => {
            if (e)
            {
                throw e;
            }
        });
    }
}

export { IO }