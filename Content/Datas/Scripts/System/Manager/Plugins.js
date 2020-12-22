/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Constants } from "../Common/index.js";
import { System } from "../index.js";
/** @class
 *  The class who handles plugins of RPG Paper Maker.
 *  @static
 *  @author Nio Kasgami, Wano
 */
class Plugins {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     * Load all the game plugins.
     * @static
     * @async
     */
    static async load() {
        let pluginsNames = (await IO.parseFileJSON(Paths.FILE_SCRIPTS)).plugins;
        for (let i = 0, l = pluginsNames.length; i < l; i++) {
            await this.loadPlugin(pluginsNames[i]);
        }
    }
    /**
     *  Load a particular plugin.
     *  @param {string} pluginName The plugin name to load
     *  @returns {Promise<boolean>}
     */
    static async loadPlugin(pluginName) {
        let json = await IO.parseFileJSON(Paths.PLUGINS + pluginName +
            Constants.STRING_SLASH + Paths.FILE_PLUGIN_DETAILS);
        let plugin = new System.Plugin(json);
        this.register(plugin);
        return (await new Promise((resolve, reject) => {
            let url = Paths.PLUGINS + pluginName + Constants.STRING_SLASH +
                Paths.FILE_PLUGIN_CODE;
            let script = document.createElement("script");
            script.type = "module";
            script.src = url;
            document.body.appendChild(script);
            script.onload = () => { resolve(true); };
        }));
    }
    /**
     *  Register plugin parameters.
     *  @param {System.Plugin} plugin
     */
    static register(plugin) {
        if (this.plugins.hasOwnProperty(plugin.name)) {
            throw new Error("Duplicate error: " + plugin + " is an duplicate of "
                + plugin.name);
        }
        else {
            this.plugins[plugin.name] = plugin;
        }
    }
    /**
     * Return the plugin object
     * @param plugin
     * @returns {any}
     */
    static fetch(plugin) {
        /*
        if (!this.plugins.hasOwnProperty(plugin)) {
            throw new Error("Unindenfied plugin error: " + plugin + " doesn't exist in the current workspace!");
        } else {
            return this.plugins[plugin];
        }
        */
    }
    /**
     * check whether the plugin exist or not.
     * @param id
     * @returns {boolean}
     */
    static exists(id) {
        /*
        for (const plugins in this.plugins) {
            if (this.plugins.hasOwnProperty(plugins)) {
                if (this.plugins[plugins].id === id) {
                    return true;
                }
            }
        }
        */
        return false;
    }
    /**
     *  Get a plugin parameters.
     *  @param {string} pluginName
     *  @returns {Record<string, DynamicValue>}
     */
    static getParameters(pluginName) {
        return this.plugins[pluginName].parameters;
    }
    /**
     *  Get a plugin parameter.
     *  @param {string} pluginName
     *  @param {string} parameter
     *  @returns {any}
     */
    static getParameter(pluginName, parameter) {
        return this.getParameters(pluginName)[parameter].getValue();
    }
    /**
     * Merge the two plugins to extends their plugins data.
     * @usage This function is used to extends the parameters of other plugins See Patch System
     * @experimental This is a experimental features that is yet to be support in RPM
     * @param {string} parent
     * @param {string} child
     */
    static merge(parent, child) {
        /*
        const par = this.plugins[parent].parameter;
        const chi = this.plugins[child].parameter;
        this.plugins[parent].parameters = { ...par, ...chi };
        */
    }
}
Plugins.plugins = {};
export { Plugins };
