/** @class
 *  @static
 *  A class replaced according to te platform used (desktop, browser, mobile...).
 */
declare class Platform {
    static readonly ROOT_DIRECTORY: any;
    static readonly screen: any;
    static readonly screenWidth: any;
    static readonly screenHeight: any;
    static readonly DESKTOP = true;
    static canvas3D: HTMLElement;
    static canvasHUD: HTMLCanvasElement;
    static canvasVideos: HTMLVideoElement;
    static canvasRendering: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static ctxr: CanvasRenderingContext2D;
    constructor();
    /**
     *  Set window title.
     *  @static
     *  @param {string} title The title to display
     */
    static setWindowTitle: (title: string) => void;
    /**
     *  Set window size.
     *  @static
     *  @param {number} w The window width
     *  @param {number} h The window height
     *  @param {boolean} f Indicate if the window is fullscreen
     */
    static setWindowSize: (w: number, h: number, f: boolean) => void;
    /**
     *  Quit app.
     *  @static
     */
    static quit: () => void;
    /**
     *  Show an error object.
     *  @static
     *  @param {Error} e The error message
     */
    static showError(e: Error): void;
    /**
     *  Show an error message.
     *  @static
     *  @param {string} msg The error message
     */
    static showErrorMessage(msg: string): void;
}
export { Platform };
