/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An animation frame
*   @property {SystemAnimationFrameElement[]} elements The frame elements by 
*   index
*   @property {SystemAnimationFrameEffect} effects The frame effects by index
*   @param {Object} [json=undefined] Json object describing the animation frame
*/
class SystemAnimationFrame
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the animation frame
    *   @param {Object} json Json object describing the animation frame
    */
    read(json)
    {
        this.elements = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.e, 
            []), SystemAnimationFrameElement);
        this.effects = RPM.readJSONSystemListByIndex(RPM.defaultValue(json.ef, 
            []), SystemAnimationFrameEffect);
    }

    // -------------------------------------------------------
    /** Play the sounds according to condition
    *   @param {AnimationEffectConditionKind} condition The condition
    */
    playSounds(condition)
    {
        for (let i = 0, l = this.effects.length; i < l; i++)
        {
            this.effects[i].playSE(condition);
        }
    }

    // -------------------------------------------------------
    /** Draw the animation frame
    *   @param {Picture2D} picture The picture associated to the animation
    *   @param {THREE.Vector2} position The position on screen for animation
    *   @param {rows} rows The number of rows in the animation texture
    *   @param {number} cols The number of columns in the animation texture
    */
    draw = function(picture, position, rows, cols)
    {
        for (let i = 0, l = this.elements.length; i < l; i++)
        {
            this.elements[i].draw(picture, position, rows, cols);
        }
    }
}
