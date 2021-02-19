/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Datas, Graphic } from "..";
import { Enum, ScreenResolution } from "../Common";
import { Frame, Game, Picture2D, Player, Rectangle, WindowBox, WindowChoices } from "../Core";
import { MenuBase } from "./MenuBase";

/**
 * The scene handling and processing the enter a name menu
 * @class
 * @extends {MenuBase}
 */
class MenuEnterAName extends MenuBase {
    public static MAX_ROWS = 7;
    public static MAX_COLUMNS = 13;
    public windowChoicesTop: WindowChoices;
    public windowBoxMain: WindowBox;
    public pictureFaceset: Picture2D;
    public heroInstanceID: number;
    public maxCharacters: number;
    public rows: number;
    public columns: number;
    public displayRows: number;
    public displayColumns: number;
    public selectedhero: Player;
    public frameUnderscore: Frame;

    constructor(heroInstanceID: number, maxCharacters: number) {
        super(heroInstanceID, maxCharacters);
    }

    initialize(heroInstanceID: number, maxCharacters: number) {
        this.heroInstanceID = heroInstanceID;
        this.maxCharacters = maxCharacters;
    }

    /**
     *  Create the menu.
     */
    create() {
        super.create();
        this.initializeDatas();
        this.createPictures();
        this.createAllWindows();
    }

    /**
     *  Create all the windows.
     */
    createAllWindows() {
        this.createWindowBoxTop();
        this.createWindowBoxMain();
    }

    /**
     *  Initialize all the datas.
     */
    initializeDatas() {
        this.rows = Datas.Systems.enterNameTable.length;
        this.columns = Datas.Systems.enterNameTable[0].length;
        this.displayRows = Math.min(this.rows, MenuEnterAName.MAX_ROWS);
        this.displayColumns = Math.min(this.columns, MenuEnterAName.MAX_COLUMNS);
        this.selectedhero = Game.current.getHeroByInstanceID(this.heroInstanceID);
        this.frameUnderscore = new Frame(250, { frames: 2 });
    }

    /**
     *  Create all the pictures.
     */
    createPictures() {
        this.pictureFaceset = Datas.Pictures.getPictureCopy(Enum.PictureKind
            .Facesets, this.selectedhero.system.idFaceset);
    }

    /**
     *  Create the top window.
     */
    createWindowBoxTop() {
        const slotWidth = 30;
        const rect = new Rectangle(((ScreenResolution.SCREEN_X - (this
            .displayColumns * 40)) / 2) + this.pictureFaceset.oW, this
            .pictureFaceset.oH - WindowBox.MEDIUM_SLOT_HEIGHT, slotWidth, 
            WindowBox.MEDIUM_SLOT_HEIGHT); 
        const list = new Array(this.maxCharacters);
        for (let i = 0; i < this.maxCharacters; i++) {
            list[i] = new Graphic.Text(i < this.selectedhero.name.length ? this
                .selectedhero.name[i] : "_");
        }
        const options = {
            orientation: Enum.OrientationWindow.Horizontal,
            nbItemsMax: this.maxCharacters,
            bordersInsideVisible: false
        };
        this.windowChoicesTop = new WindowChoices(rect.x, rect.y, rect.width, 
            rect.height, list, options);
        const index = (this.selectedhero.name.length < this.maxCharacters ? this
            .selectedhero.name.length : this.maxCharacters - 1);
        this.windowChoicesTop.unselect();
        this.windowChoicesTop.select(index);
    }

    /**
     *  Create the choice tab window buy/sell.
     */
    createWindowBoxMain() {
        const width = this.displayColumns * 40;
        const height = (this.displayRows + 1) * 40;
        const rect = new Rectangle((ScreenResolution.SCREEN_X - width) / 2, this
            .windowChoicesTop.oY + this.windowChoicesTop.oH, width, height);
        this.windowBoxMain = new WindowBox(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     *  Update the scene.
     */
    update() {
        if (this.frameUnderscore.update()) {
            (<Graphic.Text>this.windowChoicesTop.getCurrentContent()).setText(
                this.frameUnderscore.value === 0 ? "_" : " ");
        }
    }

    /** 
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number) {
        super.onKeyPressed(key);
        
    }

    /** 
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean {
        let res = super.onKeyPressedAndRepeat(key);
        
        return res;
    }

    /** 
     *  Draw the HUD scene.
     */
    drawHUD(){
        super.drawHUD();
        this.pictureFaceset.draw(this.windowBoxMain.oX, this.windowBoxMain.oY - this.pictureFaceset.oH);
        this.windowChoicesTop.draw();
        this.windowBoxMain.draw();
    }
}

export { MenuEnterAName }