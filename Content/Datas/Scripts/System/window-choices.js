/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A class for window choices
*   @extends Bitmap
*   @property {Object[]} listContents List of all the graphic contents to 
*   display
*   @property {function[]} listCallbacks List of all the callback functions to 
*   excecute when pressed.
*   @property {OrientationWindow} orientation The orientation of the window
*   (horizontal or vertical)
*   @property {number} nbItemsMax Max number of items to display on the choice 
*   box
*   @property {number[]} padding Padding of the box
*   @property {number} space Space between each choice in the box
*   @property {number} currentSelectedIndex The current selected index position 
*   in the choice box
*   @property {boolean} bordersInsideVisible If checked, each choice 
*   will have an individual window box
*   @property {number} offsetSelectedIndex offset index position when going out 
*   of the total box size   
*   @property {number} choiceWidth A choice box width
*   @property {number} choiceHeight A choice box height
*   @property {number} startTime A time variable used for delaying going up/down 
*   while keeping keyboard pressed
*   @property {number} size Max number of choices according to max number + 
*   current number 
*   @property {WindowBox} windowMain The main window box when there is no border
*   inside
*   @property {WindowBox[]} listWindows List of all the windows to display
*   @param {number} x The x coords
*   @param {number} y The y coords
*   @param {number} w The w coords
*   @param {number} h The h coords
*   @param {Object[]} listContents List of all the contents to display
*   @param {Object} [opts={}] Options
*   @param {function[]} [opts.listCallbacks=null] List of all the callback 
*   functions to excecute when pressed.
*   @param {OrientationWindow} [opts.orientation=OrientationWindow.Vertical] The 
*   orientation of the window (horizontal or vertical)
*   @param {number} [opts.nbItemsMax = listContents.length] Max number of items 
*   to display on the choice box
*   @param {number[]} [opts.padding=RPM.SMALL_SLOT_PADDING] Padding of the box
*   @param {number} [opts.space=0] Space between each choice in the box
*   @param {number} [opts.currentSelectedIndex=0] The current selected index 
*   position in the choice box
*   @param {boolean} [opts.bordersInsideVisible=true] If checked, each choice 
*   will have an individual window box
*/
class WindowChoices extends Bitmap
{
    /** Number of milliseconds to wait before going up/down when keypress repeat
    *   @member {number} [WindowChoices.TIME_WAIT_PRESS=50]
    */
    static TIME_WAIT_PRESS = 50;

    constructor (x, y, w, h, listContents, { listCallbacks = null, orientation = 
        OrientationWindow.Vertical, nbItemsMax = listContents.length, padding 
        = RPM.SMALL_SLOT_PADDING, space = 0, currentSelectedIndex = 0, 
        bordersInsideVisible = true } = {})
    {
        super(x, y, w, h);

        // Parameters
        this.orientation = orientation;
        this.nbItemsMax = nbItemsMax;
        this.padding = padding;
        this.space = space;
        this.currentSelectedIndex = currentSelectedIndex;
        this.bordersInsideVisible = bordersInsideVisible;

        // Initialize values
        this.offsetSelectedIndex = 0;
        this.choiceWidth = w;
        this.choiceHeight = h;
        this.startTime = new Date().getTime();

        // Initialize contents choices and callbacks
        this.setContentsCallbacks(listContents, listCallbacks, 
            currentSelectedIndex);
    }

    // -------------------------------------------------------
    /** Set the x value
    *   @param {number} x The x value
    */
    setX(x)
    {
        super.setX(x);
        if (this.listContents)
        {
            this.updateContentSize(this.currentSelectedIndex);
        }
    }

    // -------------------------------------------------------
    /** Set the y value
    *   @param {number} y The y value
    */
    setY(y)
    {
        super.setY(y);
        if (this.listContents)
        {
            this.updateContentSize(this.currentSelectedIndex);
        }
    }

    // -------------------------------------------------------
    /** Get the content at a specific index
     *   @param {number} i The index
     *   @returns {Object}
     */
    getContent(i)
    {
        let window = this.listWindows[i];
        return window ? window.content : null;
    }

    // -------------------------------------------------------
    /** Get the current selected content
    *   @returns {Object}
    */
    getCurrentContent()
    {
        return this.getContent(this.currentSelectedIndex);
    }

    // -------------------------------------------------------
    /** Update content size according to all the current settings
    *   @param {number} [currentSelectedIndex=0] The current selected index position
    */
    updateContentSize(currentSelectedIndex = 0)
    {
        // Getting the main box size
        let totalNb = this.listContents.length;
        this.size = totalNb > this.nbItemsMax ? this.nbItemsMax : totalNb;
        let boxWidth, boxHeight;
        if (this.orientation === OrientationWindow.Horizontal)
        {
            boxWidth = (this.choiceWidth + this.space) * this.size - this.space;
            boxHeight = this.choiceHeight;
        } else
        {
            boxWidth = this.choiceWidth;
            boxHeight = (this.choiceHeight + this.space) * this.size - this
                .space;
        }
        this.setW(boxWidth);
        this.setH(boxHeight);
        if (!this.bordersInsideVisible)
        {
            this.windowMain = new WindowBox(this.oX, this.oY, boxWidth, 
                boxHeight);
        }

        // Create a new windowBox for each choice and according to orientation
        this.listWindows = new Array(totalNb);
        let window;
        for (let i = 0; i < totalNb; i++)
        {
            if (this.orientation === OrientationWindow.Horizontal)
            {
                window = new WindowBox(this.oX + (i * this.choiceWidth) + (i *
                    this.space), this.oY, this.choiceWidth, this.choiceHeight,
                    this.listContents[i], this.padding);
            } else
            {
                window = new WindowBox(this.oX, this.oY + (i * this.choiceHeight
                    ) + (i * this.space), this.choiceWidth, this.choiceHeight,
                    this.listContents[i], this.padding);
            }
            window.bordersVisible = this.bordersInsideVisible;
            this.listWindows[i] = window;
        }
        // Select current selected index if number of choices > 0
        if (this.size > 0)
        {
            this.currentSelectedIndex = currentSelectedIndex;
            if (this.currentSelectedIndex !== -1)
            {
                this.listWindows[this.currentSelectedIndex].selected = true;
            }
        } else
        {
            this.currentSelectedIndex = -1;
        }
        this.offsetSelectedIndex = 0;

        // Update HUD
        RPM.requestPaintHUD = true;
    }

    // -------------------------------------------------------
    /** Set the content at a specific index
    *   @param {number} i The index
    *   @param {Object} content The new content
    */
    setContent(i, content)
    {
        this.listWindows[i].content = content;
    }

    // -------------------------------------------------------
    /** Set all the graphic contents
    *   @param {Object[]} contents All the contents
    */
    setContents(contents)
    {
        for (let i = 0, l = this.listWindows.length; i < l; i++)
        {
            this.setContent(i, contents[i]);
        }
    }

    // -------------------------------------------------------
    /** Set all the callbacks for each choice
    *   @param {function[]} callbacks All the callbacks functions
    */
    setCallbacks(callbacks)
    {
        if (callbacks === null)
        {
            // Create a complete empty list according to contents length
            let l = this.listContents.length;
            this.listCallBacks = new Array(l);
            for (let i = 0; i < l; i++)
            {
                this.listCallBacks[i] = null;
            }
        } else
        {
            this.listCallBacks = callbacks;
        }
    }

    // -------------------------------------------------------
    /** Set all the contents and callbacks
    *   @param {Object[]} contents All the contents
    *   @param {function[]} [callbacks=null] All the callbacks functions
    *   @param {number} [currentSelectedIndex=0] The current selected index 
    *   position
    */
    setContentsCallbacks(contents, callbacks = null, currentSelectedIndex = 0)
    {
        this.listContents = contents;
        this.updateContentSize(currentSelectedIndex);
        this.setCallbacks(callbacks);
    }

    // -------------------------------------------------------
    /** Unselect a choice
    */
    unselect()
    {
        if (this.currentSelectedIndex !== -1 && this.listWindows.length > 0)
        {
            this.listWindows[this.currentSelectedIndex].selected = false;
            this.currentSelectedIndex = -1;
            this.offsetSelectedIndex = 0;
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Select a choice
    *   @param {number} i The index of the choice
    */
    select(i)
    {
        if (this.listWindows.length > 0)
        {
            if (i >= this.listWindows.length)
            {
                i = this.listWindows.length - 1;
                this.offsetSelectedIndex = this.size - 1;
            }
            this.currentSelectedIndex = i;
            this.listWindows[this.currentSelectedIndex].selected = true;
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Select the current choice
    */
    selectCurrent()
    {
        this.select(this.currentSelectedIndex);
    }

    // -------------------------------------------------------
    /** Go cursor up
    */
    goUp()
    {
        let index = this.currentSelectedIndex;
        if (index > 0)
        {
            this.currentSelectedIndex--;
            if (this.offsetSelectedIndex > 0)
            {
                this.offsetSelectedIndex--;
            }
        } else if (index === 0)
        {
            this.currentSelectedIndex = this.listWindows.length - 1;
            this.offsetSelectedIndex = this.size - 1;
        }
        if (index !== this.currentSelectedIndex)
        {
            RPM.datasGame.system.soundCursor.playSound();
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** Go cursor down
    */
    goDown()
    {
        let index = this.currentSelectedIndex;
        if (index < this.listWindows.length - 1 && index >= 0)
        {
            this.currentSelectedIndex++;
            if (this.offsetSelectedIndex < this.size - 1)
            {
                this.offsetSelectedIndex++;
            }
        }
        else if (index === this.listWindows.length - 1)
        {
            this.currentSelectedIndex = 0;
            this.offsetSelectedIndex = 0;
        }
        if (index !== this.currentSelectedIndex)
        {
            RPM.datasGame.system.soundCursor.playSound();
            RPM.requestPaintHUD = true;
        }
    }

    // -------------------------------------------------------
    /** First key press handle
    *   @param {number} key The key ID pressed
    *   @param {Object} base The base object to apply with callback
    */
    onKeyPressed(key, base)
    {
        if (this.currenSelectedIndex !== -1)
        {
            if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                .menuControls.Action))
            {
                let callback = this.listCallBacks[this.currentSelectedIndex];
                if (callback !== null)
                {
                    // Play a sound according to callback result
                    if (callback.call(base))
                    {
                        RPM.datasGame.system.soundConfirmation.playSound();
                    } else
                    {
                        RPM.datasGame.system.soundImpossible.playSound();
                    }
                } else
                {
                    RPM.datasGame.system.soundImpossible.playSound();
                }
            }
        }
    }

    // -------------------------------------------------------
    /** Key pressed repeat handle, but with a small wait after the first 
    *   pressure (generally used for menus)
    *   @param {number} key The key ID pressed
    *   @returns {boolean} false if the other keys are blocked after it
    */
    onKeyPressedAndRepeat(key)
    {
        // Wait for a slower update
        let t = new Date().getTime();
        if (t - this.startTime >= WindowChoices.TIME_WAIT_PRESS)
        {
            this.startTime = t;
            if (this.currentSelectedIndex !== -1)
            {
                this.listWindows[this.currentSelectedIndex].selected = false;
                // Go up or go down according to key and orientation
                if (this.orientation === OrientationWindow.Vertical)
                {
                    if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Down))
                    {
                        this.goDown();
                    } else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame
                        .keyBoard.menuControls.Up))
                    {
                        this.goUp();
                    }
                } else
                {
                    if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame.keyBoard
                        .menuControls.Right))
                    {
                        this.goDown();
                    }
                    else if (DatasKeyBoard.isKeyEqual(key, RPM.datasGame
                        .keyBoard.menuControls.Left))
                    {
                        this.goUp();
                    }
                }
    
                this.selectCurrent();
            }
        } 
    }

    // -------------------------------------------------------
    /** Draw the windows
    */
    draw()
    {
        if (!this.bordersInsideVisible)
        {
            this.windowMain.draw();
        }
        let offset = this.currentSelectedIndex === -1 ? -1 : this
            .offsetSelectedIndex;
        let index;
        for (let i = 0; i < this.size; i++)
        {
            index = i + this.currentSelectedIndex - offset;
            this.listWindows[index].draw(true, this.listWindows[i]
                .windowDimension, this.listWindows[i].contentDimension);
        }
    }
}
