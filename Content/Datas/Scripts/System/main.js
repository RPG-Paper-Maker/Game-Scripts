/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  [MAIN]
//
//  Main file that always needs to be on the bottom of the other scripts
//
// -------------------------------------------------------

// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------

RPM.initialize();

// -------------------------------------------------------
//
// INPUTS CONFIG
//
// -------------------------------------------------------

document.addEventListener('keydown', function(event)
{
    if (RPM.datasGame.loaded && !RPM.gameStack.isLoading())
    {
        let key = event.keyCode;

        // On pressing F12, quit game
        if (key === KeyEvent.DOM_VK_F12)
        {
            Platform.quit();
        }
        // If not repeat, call simple press RPM event
        if (!event.repeat)
        {
            if (RPM.keysPressed.indexOf(key) === -1)
            {
                RPM.keysPressed.push(key);
                RPM.onKeyPressed(key);
                // If is loading, that means a new scene was created, return
                if (RPM.gameStack.isLoading())
                {
                    return;
                }
            }
        }

        // Also always call pressed and repeat RPM event
        RPM.onKeyPressedAndRepeat(key);
    }
}, false);

// -------------------------------------------------------

document.addEventListener('keyup', function(event) 
{
    if (RPM.datasGame.loaded && !RPM.gameStack.isLoading())
    {
        let key = event.keyCode;
        // Remove this key from pressed keys list
        RPM.keysPressed.splice(RPM.keysPressed.indexOf(key), 1);

        // Call release RPM event
        RPM.onKeyReleased(key);
    } else 
    {
        RPM.keysPressed = [];
    }
}, false);

// -------------------------------------------------------
//
// START LOADING GAME FILES
//
// -------------------------------------------------------

RPM.tryCatch(RPM.load());

// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------

requestAnimationFrame(RPM.loop);