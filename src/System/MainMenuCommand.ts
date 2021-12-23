/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Enum, Interpreter, Utils } from "../Common";
import { Translatable } from "./Translatable";
import { Manager, Scene } from "..";
import { Game } from "../Core";

/** @class
 *  A main menu command in scene main menu.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
class MainMenuCommand extends Translatable {

    public kind: Enum.MainMenuCommandKind;
    public script: string;

    constructor(json?: Record<string, any>) {
        super(json);
    }

    /** 
     *  Read the JSON associated to the main menu command.
     *  @param {Record<string, any>} - json Json object describing the main 
     *  menu command.
     */
    read(json: Record<string, any>) {
        super.read(json);
        this.kind = Utils.defaultValue(json.kind, Enum.MainMenuCommandKind.Inventory);
        if (this.kind === Enum.MainMenuCommandKind.Script) {
            this.script = Utils.defaultValue(json.script, "");
        }
    }

    /** 
     *  Get the callbacks functions when clicking on command.
     *  @returns {(item: Core.Item) => boolean}
     */
    getCallback(): () => boolean {
        switch (this.kind) {
            case Enum.MainMenuCommandKind.Inventory:
                return function() {
                    Manager.Stack.push(new Scene.MenuInventory());
                    return true;
                };
            case Enum.MainMenuCommandKind.Skills:
                return function() {
                    if (Game.current.teamHeroes.length > 0) {
                        Manager.Stack.push(new Scene.MenuSkills());
                        return true;
                    }
                    return false;
                };
            case Enum.MainMenuCommandKind.Equip:
                return function() {
                    if (Game.current.teamHeroes.length > 0) {
                        Manager.Stack.push(new Scene.MenuEquip());
                        return true;
                    }
                    return false;
                };
            case Enum.MainMenuCommandKind.States:
                return function() {
                    if (Game.current.teamHeroes.length > 0) {
                        Manager.Stack.push(new Scene.MenuDescriptionState());
                        return true;
                    }
                    return false;
                };
            case Enum.MainMenuCommandKind.Order:
                return function() {
                    if (Game.current.teamHeroes.length > 0) {
                        this.windowChoicesTeam.select(0);
                        return true;
                    }
                    return false;
                };
            case Enum.MainMenuCommandKind.Save:
                return function() {
                    if (Scene.Map.allowSaves) {
                        Manager.Stack.push(new Scene.SaveGame());
                        return true;
                    }
                    return false;
                };
            case Enum.MainMenuCommandKind.Quit:
                return function() {
                    Manager.Stack.popAll();
                    Manager.Stack.push(new Scene.TitleScreen());
                    return true;
                };
            case Enum.MainMenuCommandKind.Script:
                return function() {
                    return Interpreter.evaluate(this.script, { additionalName: 
                        "menu", additionalValue: this});
                };
            default:
                return null;
        }
    }
}

export { MainMenuCommand }