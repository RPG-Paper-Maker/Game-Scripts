/**
 * The class who handles plugins of RPG Paper Maker
 * @author Nio Kasgami
 */
export class PluginManager {

    static plugins: Record<string, any> = {};

    constructor() {
        throw new Error("This is a static class");
    }

    static load() {
        // @todo let Wano implement the logics since I have no idea of how to do it.
        // @todo should it be Async?
    }

    static register(plugin: string, parameters: any) {
        if (this.plugins.hasOwnProperty(plugin)) {
            throw new Error("Duplicate error: " + plugin + " is an duplicate of " + this.plugins[plugin].name);
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
     * @param id
     * @returns {boolean}
     */
    static exists(id): boolean {
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
    static merge(parent: string, child: string) {
        const par = this.plugins[parent].parameter;
        const chi = this.plugins[child].parameter;
        this.plugins[parent].parameters = {...par, ...chi};
    }
}