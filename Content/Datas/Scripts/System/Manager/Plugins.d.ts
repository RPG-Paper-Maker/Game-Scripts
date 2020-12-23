import { System } from "..";
/** @class
 *  The class who handles plugins of RPG Paper Maker.
 *  @static
 *  @author Nio Kasgami, Wano
 */
declare class Plugins {
    static plugins: Record<string, System.Plugin>;
    constructor();
    /**
     * Load all the game plugins.
     * @static
     * @async
     */
    static load(): Promise<void>;
    /**
     *  Load a particular plugin.
     *  @param {string} pluginName The plugin name to load
     *  @returns {Promise<boolean>}
     */
    static loadPlugin(pluginName: string): Promise<boolean>;
    /**
     *  Register plugin parameters.
     *  @param {System.Plugin} plugin
     */
    static register(plugin: System.Plugin): void;
    /**
     * Return the plugin object
     * @param plugin
     * @returns {any}
     * @deprecated use Plugins.getParameters(pluginName); or Plugins.getParameter(pluginName, parameterName); instead
     */
    static fetch(plugin: string): any;
    /**
     * check whether the plugin exist or not.
     * It's used for compatbilities purpose
     * @param id
     * @returns {boolean}
     */
    static exists(pluginName: string): boolean;
    /**
     *  Get plugin parameters.
     *  @param {string} pluginName
     *  @returns {Record<string, DynamicValue>}
     */
    static getParameters(pluginName: string): any;
    /**
     *  Get a plugin parameter.
     *  @param {string} pluginName
     *  @param {string} parameter
     *  @returns {any}
     */
    static getParameter(pluginName: string, parameter: string): any;
    /**
     * Check whether or not the plugin is enabled or not.
     * @param pluginName
     */
    static isEnabled(pluginName: string): boolean;
    /**
     * Merge the two plugins to extends their plugins data.
     * @usage This function is used to extends the parameters of other plugins See Patch System
     * @experimental This is a experimental features that is yet to be support in RPM
     * @param {string} parent
     * @param {string} child
     */
    static merge(parent: string, child: string): void;
}
export { Plugins };
