/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { System, Graphic, Datas } from "../index";
import { ScreenResolution, Enum, Constants } from "../Common";
import { WindowChoices, MapObject, WindowBox } from "../Core";
import Align = Enum.Align;
import { ShowText } from "./ShowText";

/** @class
 *  An event command for displaying a choice.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class DisplayChoice extends Base {

    public cancelAutoIndex: System.DynamicValue;
    public choices: string[];
    public windowChoices: WindowChoices;
    public showText: ShowText;

    constructor(command: any[]) {
        super();

        let iterator = {
            i: 0
        };
        this.cancelAutoIndex = System.DynamicValue.createValueCommand(command, 
            iterator);
        this.choices = [];
        let l = command.length;
        let lang = null;
        let next: string;
        while (iterator.i < l) {
            next = command[iterator.i];
            iterator.i++;
            if (next !== Constants.STRING_DASH) {
                lang = new System.Translatable();
                lang.getCommand(command, iterator);
                this.choices.push(lang.name());
            }
        }

        // Determine slots width
        l = this.choices.length;
        let graphics = new Array(l);
        let w = WindowBox.MEDIUM_SLOT_WIDTH;
        let graphic: Graphic.Text;
        for (let i = 0; i < l; i++) {
            graphic = new Graphic.Text(this.choices[i], { align: Align.Center });
            graphics[i] = graphic;
            if (graphic.textWidth > w) {
                w = graphic.textWidth;
            }
        }
        w += WindowBox.SMALL_SLOT_PADDING[0] + WindowBox.SMALL_SLOT_PADDING[2];

        // Window
        this.windowChoices = new WindowChoices((ScreenResolution.SCREEN_X - w) / 
            2, ScreenResolution.SCREEN_Y - 10 - 150 - (l * WindowBox
            .MEDIUM_SLOT_HEIGHT), w, WindowBox.MEDIUM_SLOT_HEIGHT, graphics, 
            {
                nbItemsMax: l
            }
        );
    }

    /** 
     *  Set the show text property.
     *  @param {EventCommand.ShowText} showText - The show text value
     */
    setShowText(showText: ShowText) {
        this.showText = showText;

        // Move to right if show text before
        if (showText) {
            this.windowChoices.setX(ScreenResolution.SCREEN_X - this
                .windowChoices.oW - 10);
        }
    }

    /** 
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize(): Record<string, any> {
        this.windowChoices.unselect();
        this.windowChoices.select(0);
        return {
            index: -1
        };
    }

    /** 
     *  Update and check if the event is finished.
     *  @param {Record<string, any>}} - currentState The current state of the 
     *  event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
     */
    update(currentState: Record<string, any>, object: MapObject, state: number): 
        number
    {
        return currentState.index + 1;
    }

    /** 
     *  Returns the number of node to pass.
     *  @returns {number}
     */
    goToNextCommand(): number {
        return 1;
    }

    /** 
     *  First key press handle for the current stack.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressed(currentState: Record<string, any>, key: number) {
        if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
            currentState.index = this.windowChoices.currentSelectedIndex;
        } else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls
            .Cancel))
        {
            currentState.index = this.cancelAutoIndex.getValue() - 1;
        }
    }

    /** 
     *  Key pressed repeat handle for the current stack, but with
     *  a small wait after the first pressure (generally used for menus).
     *  @param {Record<string, any>}} - currentState The current state of the event
     *  @param {number} key - The key ID pressed
     */
    onKeyPressedAndRepeat(currentState: Record<string, any>, key: number): 
        boolean
    {
        return this.windowChoices.onKeyPressedAndRepeat(key);
    }

    /** 
     *  Draw the HUD
     *  @param {Record<string, any>} - currentState The current state of the event
     */
    drawHUD(currentState?: Record<string, any>)
    {
        // Display text command if existing
        if (this.showText) {
            this.showText.drawHUD();
        }
        this.windowChoices.draw();
    }
}

export { DisplayChoice }