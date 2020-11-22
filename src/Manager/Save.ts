/**
 * The static class who manage saving and Loading in the game
 */
export class Save {

    private static _maxSaveSlots: number;
    private static _currentSlots: number;
    private static _lastSaveSlots: number;
    // TODO : implements autosave?
    private static _isAutosaveEnabled: boolean = false;
    private static _saveExtension: string = ".rpm";
    private static _saveFolderName: string;

    constructor() {
        return new Error("This is a static class");
    }

    static init(){
        this._maxSaveSlots = 10;
    }
    static async write(slot: number){}

    static load(slot, json){}


    static maxSaveSlots(): number {
        return  this._maxSaveSlots;
    }
}