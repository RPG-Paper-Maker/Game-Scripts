/**
 *  @class
 *  Handles inputs for keyboard and mouse.
 */
declare class Inputs {
    constructor();
    /**
     *  Initialize all keyboard and mouse events.
     *  @static
     */
    static initialize(): void;
    /**
     *  Initialize all keyboard events.
     *  @static
     */
    static initializeKeyboard(): void;
    /**
     *  Initialize all mouse events.
     *  @static
     */
    static initializeMouse(): void;
}
export { Inputs };
