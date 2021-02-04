import { Datas, Graphic, Manager, Scene } from "../index.js";
import { Constants, Enum, ScreenResolution } from "../Common/index.js";
import { Rectangle, WindowBox, WindowChoices } from "../Core/index.js";
import { MenuBase } from "./MenuBase.js";
/**
 * The scene handling and processing the shop system.
 * @class
 * @extends {MenuBase}
 */
class MenuShop extends MenuBase {
    constructor() {
        super();
    }
    /**
     *  Create the menu.
     */
    create() {
        super.create();
        this.createAllWindows();
        this.step = 0;
    }
    /**
     *  Create all the windows.
     */
    createAllWindows() {
        this.createWindowBoxTop();
        this.createWindowChoicesBuySell();
        this.createWindowChoicesItemsKind();
        this.createWindowChoicesList();
        this.createWindowBoxInformation();
        this.createWindowBoxEmpty();
        this.createWindowBoxUseItem();
        this.createWindowBoxOwned();
        this.createWindowBoxCurrencies();
    }
    /**
     *  Create the top window.
     */
    createWindowBoxTop() {
        const rect = new Rectangle(20, 20, 200, 30);
        this.windowBoxTop = new WindowBox(rect.x, rect.y, rect.width, rect.height, { content: new Graphic.Text("Shop", { align: Enum.Align.Center })
        });
    }
    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowChoicesBuySell() {
        const rect = new Rectangle(ScreenResolution.SCREEN_X - (105 * 2) - 5, 20, 105, WindowBox.SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("Buy", { align: Enum.Align.Center }),
            new Graphic.Text("Sell", { align: Enum.Align.Center })
        ];
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesBuySell = new WindowChoices(rect.x, rect.y, rect.width, rect.height, list, options);
    }
    /**
     *  Create the choice tab window for sorting items kind.
     */
    createWindowChoicesItemsKind() {
        const rect = new Rectangle(5, 60, 105, WindowBox.SMALL_SLOT_HEIGHT);
        const list = [
            new Graphic.Text("All", { align: Enum.Align.Center }),
            new Graphic.Text("Consumables", { align: Enum.Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(1), { align: Enum.Align.Center }),
            new Graphic.Text(Datas.Systems.getItemType(2), { align: Enum.Align.Center }),
            new Graphic.Text("Weapons", { align: Enum.Align.Center }),
            new Graphic.Text("Armors", { align: Enum.Align.Center })
        ];
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: list.length,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesItemsKind = new WindowChoices(rect.x, rect.y, rect.width, rect.height, list, options);
    }
    /**
     *  Create the choice list.
     */
    createWindowChoicesList() {
        const rect = new Rectangle(20, 100, 200, WindowBox.SMALL_SLOT_HEIGHT);
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: Scene.Menu.SLOTS_TO_DISPLAY,
            padding: [0, 0, 0, 0]
        };
        this.windowChoicesList = new WindowChoices(rect.x, rect.y, rect.width, rect.height, [], options);
    }
    /**
     *  Create the information window.
     */
    createWindowBoxInformation() {
        const rect = new Rectangle(240, 100, 360, 200);
        this.windowBoxInformation = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, { padding: WindowBox.HUGE_PADDING_BOX });
    }
    /**
     *  Create the empty window.
     */
    createWindowBoxEmpty() {
        const rect = new Rectangle(10, 100, ScreenResolution.SCREEN_X - 20, WindowBox.SMALL_SLOT_HEIGHT);
        this.windowBoxEmpty = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, { content: new Graphic.Text("Empty", { align: Enum.Align
                    .Center }), padding: WindowBox.SMALL_SLOT_PADDING });
    }
    /**
     *  Create the user item window.
     */
    createWindowBoxUseItem() {
        const rect = new Rectangle(240, 320, 360, 140);
        this.windowBoxUseItem = new WindowBox(rect.x, rect.y, rect.width, rect
            .height, { content: new Graphic.UseSkillItem(), padding: WindowBox
                .SMALL_PADDING_BOX });
    }
    /**
     *  Create the owned items window.
     */
    createWindowBoxOwned() {
        const rect = new Rectangle(20, ScreenResolution.SCREEN_Y - WindowBox
            .SMALL_SLOT_HEIGHT - Constants.LARGE_SPACE, 100, WindowBox
            .SMALL_SLOT_HEIGHT);
        this.windowBoxOwned = new WindowBox(rect.x, rect.y, rect.width, rect
            .height);
    }
    /**
     *  Create the currencies window.
     */
    createWindowBoxCurrencies() {
        const width = 200;
        const rect = new Rectangle(ScreenResolution.SCREEN_X - Constants
            .LARGE_SPACE - width, ScreenResolution.SCREEN_Y - WindowBox
            .SMALL_SLOT_HEIGHT - Constants.LARGE_SPACE, width, WindowBox
            .SMALL_SLOT_HEIGHT);
        this.windowBoxCurrencies = new WindowBox(rect.x, rect.y, rect.width, rect
            .height);
    }
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key) {
        super.onKeyPressed(key);
        switch (this.step) {
            case 0:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.menuControls.Action)) {
                    Datas.Systems.soundConfirmation.playSound();
                    this.step = 1;
                    Manager.Stack.requestPaintHUD = true;
                }
                else if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    Scene.Map.current.user = null;
                    Manager.Stack.pop();
                }
                break;
            case 1:
                if (Datas.Keyboards.isKeyEqual(key, Datas.Keyboards
                    .menuControls.Cancel) || Datas.Keyboards.isKeyEqual(key, Datas.Keyboards.controls.MainMenu)) {
                    Datas.Systems.soundCancel.playSound();
                    this.step = 0;
                }
                break;
        }
    }
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key) {
        let res = super.onKeyPressedAndRepeat(key);
        switch (this.step) {
            case 0:
                this.windowChoicesBuySell.onKeyPressedAndRepeat(key);
                break;
            case 1:
                this.windowChoicesItemsKind.onKeyPressedAndRepeat(key);
                this.windowChoicesList.onKeyPressedAndRepeat(key);
                break;
        }
        return res;
    }
    /**
     *  Draw the HUD scene.
     */
    drawHUD() {
        super.drawHUD();
        this.windowBoxTop.draw();
        this.windowChoicesBuySell.draw();
        this.windowBoxCurrencies.draw();
        if (this.step > 0) {
            this.windowChoicesItemsKind.draw();
            this.windowChoicesList.draw();
            if (this.windowChoicesList.listWindows.length > 0) {
                this.windowBoxInformation.draw();
                this.windowBoxUseItem.draw();
            }
            else {
                this.windowBoxEmpty.draw();
            }
            this.windowBoxOwned.draw();
        }
    }
}
export { MenuShop };
