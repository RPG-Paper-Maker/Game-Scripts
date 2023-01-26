/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Translatable } from "./Translatable";
import { Enum, Utils, Platform, Interpreter } from "../Common";
import TitleCommandKind = Enum.TitleCommandKind;
import { Datas, Manager } from "../index";
import { Game } from "../Core";
import { Scene } from "../index";

/** @class
 *  A title command of the game.
 *  @extends System.Translatable
 *  @param {Record<string, any>} - [json=undefined] Json object describing the 
 *  title screen command
 */
class TitleCommand extends Translatable {

    public kind: TitleCommandKind;
    public script: string;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the title screen command.
     *  @param {Record<string, any>} - json Json object describing the title 
     *  screen command
     */
    read(json: Record<string, any>) {
        super.read(json);
    
        this.kind = Utils.defaultValue(json.k, TitleCommandKind.NewGame);
        this.script = Utils.defaultValue(json.s, "");
    }

    /** 
     *  Get the action function according to kind.
     *  @returns {Function}
     */
    getAction(): Function {
        switch (this.kind) {
            case TitleCommandKind.NewGame:
                return TitleCommand.startNewGame;
            case TitleCommandKind.LoadGame:
                return TitleCommand.loadGame;
            case TitleCommandKind.Settings:
                const name = this.name();
                return () => {
                    return TitleCommand.showSettings(name);
                };
            case TitleCommandKind.Exit:
                return TitleCommand.exit;
            case TitleCommandKind.Script:
                return this.executeScript;
        }
    }
    
    /** 
     *  Callback function for start a new game.
     *  @static
     *  @returns {boolean}
     */
    static startNewGame(): boolean {
        // Stop video and songs if existing
        if (!Datas.TitlescreenGameover.isTitleBackgroundImage)
        {
            Manager.Videos.stop();
        }
    
        // Create a new game
        Game.current = new Game();
        Game.current.initializeDefault();
    
        // Add local map to stack
        Manager.Stack.replace(new Scene.Map(Datas.Systems.ID_MAP_START_HERO));

        return true;
    }
    
    /** 
     *  Callback function for loading an existing game.
     *  @returns {boolean}
     */
    static loadGame(): boolean {
        Manager.Stack.push(new Scene.LoadGame());
        return true;
    }
    
    /** 
     *  Callback function for loading an existing game.
     *   @returns {boolean}
     */
    static showSettings(title: string): boolean {
        Manager.Stack.push(new Scene.TitleSettings(title));
        return true;
    }
    
    /** 
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    static exit(): boolean {
        Platform.quit();
        return true;
    }
    
    /** 
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    executeScript(): boolean {
        Interpreter.evaluate(this.script, { addReturn: false });
        return true;
    }
}

export { TitleCommand }