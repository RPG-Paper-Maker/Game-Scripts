/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
/**
 *  The class who handles plugins of RPG Paper Maker.
 *  @static
 *  @author Nio Kasgami
 */
class Plugins {
    constructor() {
        throw new Error("This is a static class");
    }
    static load() {
        // @todo let Wano implement the logics since I have no idea of how to do it.
        // @todo should it be Async?
    }
    static register(plugin, parameters) {
        if (this.plugins.hasOwnProperty(plugin)) {
            throw new Error("Duplicate error: " + plugin + " is an duplicate of " + this.plugins[plugin].name);
        }
        else {
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
        }
        else {
            return this.plugins[plugin];
        }
    }
    /**
     * check whether the plugin exist or not.
     * @param id
     * @returns {boolean}
     */
    static exists(id) {
        for (const plugins in this.plugins) {
            if (this.plugins.hasOwnProperty(plugins)) {
                if (this.plugins[plugins].id === id) {
                    return true;
                }
            }
        }
        return false;
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
    static merge(parent, child) {
        const par = this.plugins[parent].parameter;
        const chi = this.plugins[child].parameter;
        this.plugins[parent].parameters = { ...par, ...chi };
    }
}
Plugins.plugins = {};
export { Plugins };
