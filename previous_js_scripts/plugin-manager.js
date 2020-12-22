/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *  The plugin manager loading every plugins and handling plugin commands.
 *  @static
 *  @property {Record<string, any>} [PluginManager.plugins = {}] The plugins 
 *  according to plugin name
 */
class PluginManager {
    static plugins = {};

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Load all the game plugins.
     * @static
     * @async
     */
    static async load() {
        let pluginsNames = (await RPM.parseFileJSON(RPM.FILE_SCRIPTS)).plugins;
        for (let i = 0, l = pluginsNames.length; i < l; i++) {
            await PluginManager.loadPlugin(pluginsNames[i]);
        }
    }

    /**
     * Load a particular plugin.
     * @returns {boolean}
     */
    static async loadPlugin(pluginName) {
        return (await new Promise((resolve, reject) => {
            let url = RPM.PATH_PLUGINS + pluginName;
            let plugin = document.createElement("script");
            plugin.type = "text/javascript";
            plugin.src = url;
            document.body.appendChild(script);
            plugin.onload = resolve;
        }));
    }

    static register(plugin, parameters) {
        if (this.plugins.hasOwnProperty(plugin)) {
            throw new Error("Duplicate error: " + plugin + 
                " is an duplicate of " + this.plugins[plugin].name);
        } else {
            this.plugins[plugin] = parameters;
        }
    }

    /**
     * Return the plugin object
     * @param plugin
     * @returns {any}
     */
    static fetch(plugin) {
        if (!this.plugins.hasOwnProperty(plugin)) {
            throw new Error("Unindenfied plugin error: " + plugin + " doesn't exist in the current workspace!");
        } else {
            return this.plugins[plugin];
        }
    }

    /**
     * check whether the plugin exist or not.
     * @param name
     * @returns {boolean}
     */
    static exists(name) {
        return this.plugins.hasOwnProperty(name);
    }

    /**
     * return the plugin parameters
     * @param plugin
     * @returns {any}
     */
    static parameters(plugin) {
        return this.plugins[plugin].parameters;
    }

    /**
     * Merge the two plugins to extends their plugins data.
     * @usage This function is used to extends the parameters of other plugins See Patch System
     * @experimental This is a experimental features that is yet to be support in RPM
     * @param {string} parent
     * @param {string} child
     */
    static merge(parent, child)
    {
        const par = this.plugins[parent].parameter;
        const chi = this.plugins[child].parameter;
        this.plugins[parent].parameters = {...par, ...chi};
    }
}