import { Base } from "./Base.js";
import { Picture2D, WindowChoices } from "../Core/index.js";
/**
 * the Scene displaying the game title screen.
 *
 * @class TitleScreen
 * @extends {Base}
 */
declare class TitleScreen extends Base {
    /**
     * The title screen background image.
     *
     * @type {Picture2D}
     * @memberof TitleScreen
     */
    pictureBackground: Picture2D;
    /**
     * The title screen command window.
     *
     * @type {WindowChoices}
     * @memberof TitleScreen
     */
    windowChoicesCommands: WindowChoices;
    constructor();
    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
     */
    create(): void;
    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
     */
    load(): Promise<void>;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @memberof TitleScreen
     */
    onKeyPressed(key: number): void;
    /**
     * @inheritdoc
     *
     * @param {number} key - the key ID
     * @return {*}  {boolean}
     * @memberof TitleScreen
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     * @inheritdoc
     *
     * @memberof TitleScreen
     */
    drawHUD(): void;
}
export { TitleScreen };
