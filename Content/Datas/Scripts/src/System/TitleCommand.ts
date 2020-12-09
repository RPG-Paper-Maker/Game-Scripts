/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Translatable } from "./Translatable";
import { Enum, Utils, Platform, Constants, Interpreter } from "../Common";
import TitleCommandKind = Enum.TitleCommandKind;
import { Datas, Manager } from "..";
import { Game } from "../Core";
import { Scene } from "..";

/** @class
 *  A title command of the game.
 *  @extends System.Translatable
 *  @property {TitleCommandKind} kind The title command kind
 *  @property {string} script The script formula
 *  @param {Record<string, any>} [json=undefined] Json object describing the title screen command
 */
class TitleCommand extends Translatable {

    public kind: TitleCommandKind;
    public script: string;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the title screen command.
     *  @param {Record<string, any>} json Json object describing the title 
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
                return this.startNewGame;
            case TitleCommandKind.LoadGame:
                return this.loadGame;
            case TitleCommandKind.Settings:
                return this.showSettings;
            case TitleCommandKind.Exit:
                return this.exit;
            case TitleCommandKind.Script:
                return this.executeScript;
        }
    }
    
    /** 
     *  Callback function for start a new game.
     *  @returns {boolean}
     */
    startNewGame(): boolean {
        // Stop video and songs if existing
        if (!Datas.TitlescreenGameover.isTitleBackgroundImage)
        {
            Platform.canvasVideos.classList.add(Constants.CLASS_HIDDEN);
            Platform.canvasVideos.pause();
            Platform.canvasVideos.src = "";
        }
        Manager.Songs.stopAll();
    
        // Create a new game
        Manager.Stack.game = new Game();
        Manager.Stack.game.initializeDefault();
    
        // Add local map to stack
        Manager.Stack.replace(new Scene.Map(Datas.Systems.ID_MAP_START_HERO));

        return true;
    }
    
    /** 
     *  Callback function for loading an existing game.
     *  @returns {boolean}
     */
    loadGame(): boolean {
        Manager.Stack.push(new Scene.LoadGame());
        return true;
    }
    
    /** 
     *  Callback function for loading an existing game.
     *   @returns {boolean}
     */
    showSettings(): boolean {
        Manager.Stack.push(new Scene.TitleSettings());
        return true;
    }
    
    /** 
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    exit(): boolean {
        Platform.quit();
        return true;
    }
    
    /** 
     *  Callback function for closing the window.
     *  @returns {boolean}
     */
    executeScript(): boolean {
        Interpreter.evaluate(this.script);
        return true;
    }
}

export { TitleCommand }