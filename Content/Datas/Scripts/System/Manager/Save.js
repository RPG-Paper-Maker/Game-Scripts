"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Save = void 0;
/**
 * The static class who manage saving and Loading in the game
 */
class Save {
    constructor() {
        return new Error("This is a static class");
    }
    static init() {
        this._maxSaveSlots = 10;
    }
    static async write(slot) { }
    static load(slot, json) { }
    static maxSaveSlots() {
        return this._maxSaveSlots;
    }
}
exports.Save = Save;
// TODO : implements autosave?
Save._isAutosaveEnabled = false;
Save._saveExtension = ".rpm";
