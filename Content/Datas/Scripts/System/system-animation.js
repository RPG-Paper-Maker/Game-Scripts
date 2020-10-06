/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An animation of a skill / item / weapon or for display animation command
*/
class SystemAnimation
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------

    read(json)
    {
        this.pictureID = RPM.defaultValue(json.pid, 1);
        this.positionKind = RPM.defaultValue(json.pk, AnimationPositionKind
            .Middle);
        this.frames = RPM.readJSONSystemList(json.f, SystemAnimationFrame);
        this.rows = RPM.defaultValue(json.r, 5);
        this.cols = RPM.defaultValue(json.c, 5);
    }

    // -------------------------------------------------------

    createPicture()
    {
        return RPM.datasGame.pictures.get(PictureKind.Animations, this.pictureID
            ).picture.createCopy();
    }

    // -------------------------------------------------------

    playSounds(frame, condition)
    {
        if (frame > 0 && frame < this.frames.length)
        {
            this.frames[frame].playSounds(condition);
        }
    }

    // -------------------------------------------------------

    draw(picture, frame, battler)
    {
        if (frame > 0 && frame < this.frames.length)
        {
            // Change position according to kind
            let position;
            switch (this.positionKind)
            {
            case AnimationPositionKind.Top:
                position = battler.topPosition;
                break;
            case AnimationPositionKind.Middle:
                position = battler.midPosition;
                break;
            case AnimationPositionKind.Bottom:
                position = battler.botPosition;
                break;
            case AnimationPositionKind.ScreenCenter:
                position = {
                    x: 0,
                    y: 0
                };
                break;
            }
            
            // Draw
            this.frames[frame].draw(picture, position, this.rows, this.cols);
        }
    }
}
