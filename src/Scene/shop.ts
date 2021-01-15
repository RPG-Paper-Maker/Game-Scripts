
import { Graphic } from "..";
import { Game, Rectangle, WindowBox } from "../Core";
import { Currency } from "../System";
import { MenuBase, MenuCommands } from "./MenuBase";
import {Enum} from "../Common";
import Align = Enum.Align;


/**
 * The scene handling and processing the shop system.
 *
 * @class Shop
 * @extends {MenuBase}
 */
class Shop extends MenuBase {

    currencies: number[];
    currency: Currency;

    topWindow: WindowBox;

    static commands: MenuCommands[]  = [];


    constructor() {
        super();

        this.currencies = Game.current.currencies;
    }


    create() {
        super.create();
        this.createAllWindows();
    }

    createAllWindows() {
        this.createTopWindow();
        this.createHelpWindow();
    }

    createTopWindow() {
        const rect = new Rectangle(100, 100, 100, 100); // TEMP
        const options = {
            content: new Graphic.Text("Shop", {align: Align.Center})
        }
        this.topWindow = new WindowBox(rect.x, rect.y, rect.width, rect.height);

    }

    /**
     * create the window who display item informations
     *
     * @memberof Shop
     */
    createHelpWindow(){

    }

    drawHUD(){
        super.drawHUD();
        this.topWindow.draw();
    }
}