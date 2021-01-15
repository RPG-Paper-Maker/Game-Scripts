import { Graphic } from "../index.js";
import { Game, Rectangle, WindowBox } from "../Core/index.js";
import { MenuBase } from "./MenuBase.js";
import { Enum } from "../Common/index.js";
var Align = Enum.Align;
/**
 * The scene handling and processing the shop system.
 *
 * @class Shop
 * @extends {MenuBase}
 */
class Shop extends MenuBase {
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
            content: new Graphic.Text("Shop", { align: Align.Center })
        };
        this.topWindow = new WindowBox(rect.x, rect.y, rect.width, rect.height);
    }
    /**
     * create the window who display item informations
     *
     * @memberof Shop
     */
    createHelpWindow() {
    }
    drawHUD() {
        super.drawHUD();
        this.topWindow.draw();
    }
}
Shop.commands = [];
