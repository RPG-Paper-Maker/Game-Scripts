/**
 * The static class who manage persistence data across savefiles.
 * @usage Could be used for newGame+ or achievement.
 */
export class Persistence {
    constructor(props) {
        throw new Error("This is a static class");
    }
    static init() {
    }
    static register(name, path, value) {
        // TODO implement persistence.
    }
    static fetch(name, value) { }
    static set(name, value) {
    }
    static reset(name) { }
    static remove(name) { }
    /**
     * Delete the whole json.
     */
    static async destroy() {
    }
    static addToGlobals(value) {
    }
    static exists(name) {
        return this.persistencePath.hasOwnProperty(name);
    }
}
Persistence.persistencePath = {};
